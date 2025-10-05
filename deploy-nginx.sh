#!/bin/bash

# =============================================================================
# SteamTrust Nginx Automatic Deployment Script
# Автоматическое развертывание nginx на сервере
# =============================================================================

set -e

# Переменные состояния
CONFIG_RESTORED=false

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[NGINX-DEPLOY]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Проверка существования файлов
if [ ! -f ".env.config" ]; then
    error "Файл .env.config не найден"
    exit 1
fi

if [ ! -f "nginx.conf" ]; then
    error "Файл nginx.conf не найден"
    exit 1
fi

# Загрузка переменных из .env.config
log "Загрузка конфигурации из .env.config..."
set -a
source .env.config
set +a

# Проверка обязательных переменных
REQUIRED_VARS=("SERVER_IP" "SSH_USER" "SSH_KEY_PATH" "DOMAIN")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        error "Переменная $var не найдена в .env.config"
        exit 1
    fi
done

# Разворачиваем путь к SSH ключу
SSH_KEY_EXPANDED="${SSH_KEY_PATH/#~/$HOME}"

if [ ! -f "$SSH_KEY_EXPANDED" ]; then
    error "SSH ключ не найден: $SSH_KEY_EXPANDED"
    exit 1
fi

log "=== Nginx Deployment ==="
log "Сервер: $SERVER_IP"
log "Пользователь: $SSH_USER"
log "Домен: $DOMAIN"
log "SSH ключ: $SSH_KEY_EXPANDED"

# Функция для выполнения команд на сервере
remote_exec() {
    ssh -i "$SSH_KEY_EXPANDED" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$SSH_USER@$SERVER_IP" "$@"
}

# Функция для копирования файлов на сервер
remote_copy() {
    scp -i "$SSH_KEY_EXPANDED" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$1" "$SSH_USER@$SERVER_IP:$2"
}

# Проверка доступности сервера
log "1. Проверка подключения к серверу..."
if ! remote_exec "echo 'Сервер доступен'" > /dev/null 2>&1; then
    error "Не удается подключиться к серверу $SERVER_IP"
    exit 1
fi
success "Подключение к серверу установлено"

# Обновление системы и установка nginx
log "2. Установка nginx и зависимостей..."
remote_exec "
    export DEBIAN_FRONTEND=noninteractive
    apt update
    apt install -y nginx curl htop
    systemctl stop nginx || true
"
success "Nginx установлен"

# Создание необходимых директорий
log "3. Создание директорий..."
remote_exec "
    mkdir -p /var/cache/nginx
    mkdir -p /var/www/steamtrust.ru
    mkdir -p /var/www/html
    chown -R www-data:www-data /var/cache/nginx
    chmod -R 755 /var/cache/nginx
"
success "Директории созданы"

# Полная очистка существующих конфигураций
log "4. Полная очистка существующих конфигураций nginx..."
remote_exec "
    # Остановка nginx
    systemctl stop nginx || true

    # Создание полного бэкапа конфигураций
    BACKUP_DIR=/etc/nginx/backup-\$(date +%Y%m%d_%H%M%S)
    mkdir -p \$BACKUP_DIR

    # Бэкап основных конфигов
    cp -r /etc/nginx/nginx.conf \$BACKUP_DIR/ 2>/dev/null || true
    cp -r /etc/nginx/sites-available \$BACKUP_DIR/ 2>/dev/null || true
    cp -r /etc/nginx/sites-enabled \$BACKUP_DIR/ 2>/dev/null || true
    cp -r /etc/nginx/conf.d \$BACKUP_DIR/ 2>/dev/null || true

    # Очистка старых конфигураций
    rm -f /etc/nginx/sites-enabled/* 2>/dev/null || true
    rm -f /etc/nginx/sites-available/* 2>/dev/null || true
    rm -f /etc/nginx/conf.d/* 2>/dev/null || true

    # Очистка кэша nginx
    rm -rf /var/cache/nginx/* 2>/dev/null || true

    # Очистка логов (сохраняем последние)
    if [ -f /var/log/nginx/access.log ]; then
        tail -1000 /var/log/nginx/access.log > /tmp/access.log.backup
        > /var/log/nginx/access.log
        cat /tmp/access.log.backup >> /var/log/nginx/access.log
        rm /tmp/access.log.backup
    fi

    if [ -f /var/log/nginx/error.log ]; then
        tail -1000 /var/log/nginx/error.log > /tmp/error.log.backup
        > /var/log/nginx/error.log
        cat /tmp/error.log.backup >> /var/log/nginx/error.log
        rm /tmp/error.log.backup
    fi

    echo \"Бэкап создан в: \$BACKUP_DIR\"
"
success "Старые конфигурации очищены, бэкап создан"

# Копирование новой конфигурации nginx
log "5. Копирование новой конфигурации nginx..."
remote_copy "nginx.conf" "/etc/nginx/nginx.conf"
success "Новая конфигурация nginx скопирована"

# Проверка синтаксиса nginx перед перезапуском
log "6. Проверка конфигурации nginx..."
NGINX_TEST_OUTPUT=$(remote_exec "nginx -t" 2>&1 || true)
if ! echo "$NGINX_TEST_OUTPUT" | grep -q "syntax is ok"; then
    error "Ошибка в новой конфигурации nginx:"
    echo "$NGINX_TEST_OUTPUT"

    # Восстановление последнего бэкапа конфигурации
    RESTORE_RESULT=$(remote_exec "
        LATEST_BACKUP=\$(ls -td /etc/nginx/backup-* 2>/dev/null | head -1)
        if [ -n \"\$LATEST_BACKUP\" ] && [ -d \"\$LATEST_BACKUP\" ]; then
            echo \"Восстанавливаем из бэкапа: \$LATEST_BACKUP\"

            # Восстановление конфигураций
            cp \$LATEST_BACKUP/nginx.conf /etc/nginx/nginx.conf 2>/dev/null || true
            cp -r \$LATEST_BACKUP/sites-available/* /etc/nginx/sites-available/ 2>/dev/null || true
            cp -r \$LATEST_BACKUP/sites-enabled/* /etc/nginx/sites-enabled/ 2>/dev/null || true
            cp -r \$LATEST_BACKUP/conf.d/* /etc/nginx/conf.d/ 2>/dev/null || true

            # Проверка и запуск
            if nginx -t 2>/dev/null; then
                systemctl restart nginx
                echo \"SUCCESS_RESTORE\"
            else
                echo \"FAILED_RESTORE\"
            fi
        else
            echo \"NO_BACKUP\"
        fi
    ")

    if echo "$RESTORE_RESULT" | grep -q "SUCCESS_RESTORE"; then
        warn "Новая конфигурация содержала ошибки, но старая конфигурация успешно восстановлена"
        warn "Проверьте файл nginx.conf на наличие ошибок перед повторным развертыванием"
        CONFIG_RESTORED=true
        # Продолжаем с восстановленной конфигурацией
    else
        error "Не удалось восстановить рабочую конфигурацию nginx"
        error "Проверьте состояние nginx на сервере вручную"
        exit 1
    fi
fi
success "Конфигурация nginx корректна"

# Настройка системных лимитов
log "7. Оптимизация системы..."
remote_exec "
    # Файловые дескрипторы для nginx (www-data пользователь)
    if ! grep -q 'www-data.*nofile' /etc/security/limits.conf; then
        echo 'www-data soft nofile 65535' >> /etc/security/limits.conf
        echo 'www-data hard nofile 65535' >> /etc/security/limits.conf
    fi

    # Сетевые оптимизации
    cat >> /etc/sysctl.conf << SYSCTL_EOF

# Оптимизация сети для nginx
net.core.somaxconn = 65535
net.ipv4.tcp_max_tw_buckets = 1440000
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 15
net.core.netdev_max_backlog = 4000
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
SYSCTL_EOF

    sysctl -p > /dev/null 2>&1 || true
"
success "Система оптимизирована"

# Запуск nginx с проверкой
log "8. Запуск nginx..."

# Проверяем, запущен ли nginx после возможного восстановления
if remote_exec "systemctl is-active nginx &>/dev/null"; then
    warn "Nginx уже запущен (возможно, после восстановления конфигурации)"
    remote_exec "systemctl status nginx --no-pager -l"
else
    remote_exec "
        if systemctl is-active nginx &>/dev/null; then
            systemctl stop nginx
            sleep 2
        fi

        if ! systemctl start nginx; then
            error 'Ошибка при запуске nginx'
            journalctl -u nginx --no-pager -n 20
            exit 1
        fi

        systemctl enable nginx
        systemctl status nginx --no-pager -l
    "
fi
success "Nginx запущен"

# Проверка работы
log "9. Проверка работы..."
sleep 5

# Проверка HTTP
if remote_exec "curl -s -o /dev/null -w '%{http_code}' http://localhost/health" | grep -q "200"; then
    success "HTTP health check работает"
else
    warn "HTTP health check недоступен"
fi

# Создание скрипта для мониторинга на сервере
log "10. Создание скрипта мониторинга..."
remote_exec "
    cat > /usr/local/bin/nginx-status << MONITOR_EOF
#!/bin/bash
echo '=== SteamTrust Nginx Status ==='
echo 'Nginx: \$(systemctl is-active nginx)'
echo 'Connections: \$(netstat -an | grep :80 | wc -l)'
echo
echo '=== Recent Nginx Logs ==='
tail -5 /var/log/nginx/access.log 2>/dev/null || echo 'No access logs'
echo
echo '=== Health Check ==='
curl -s -w 'HTTP: %{http_code}\\n' http://steamtrust.ru/health -o /dev/null || echo 'Health check failed'
MONITOR_EOF
    chmod +x /usr/local/bin/nginx-status
"
success "Скрипт мониторинга создан: nginx-status"

# Итоговая информация
log "=== Развертывание завершено! ==="

if [ "$CONFIG_RESTORED" = true ]; then
    echo -e "${YELLOW}
⚠️  Nginx работает с восстановленной конфигурацией на сервере $SERVER_IP

🔧 Статус конфигурации:
   - Новая конфигурация содержала ошибки
   - Автоматически восстановлена предыдущая рабочая конфигурация
   - Исправьте ошибки в nginx.conf и повторите развертывание

🌐 Ваши сайты (работают со старой конфигурацией):
   - http://steamtrust.ru (основной сайт)
   - http://www.steamtrust.ru (основной сайт)
   - http://api.steamtrust.ru (API)

📋 Необходимые действия:
   1. Проверьте файл nginx.conf на синтаксические ошибки
   2. Исправьте найденные проблемы
   3. Повторите развертывание
${NC}"
    warn "Развертывание завершено с восстановлением конфигурации!"
else
    echo -e "${GREEN}
✅ Nginx успешно развернут на сервере $SERVER_IP

🌐 Ваши сайты (все без SSL):
   - http://steamtrust.ru (основной сайт, порт 4200)
   - http://www.steamtrust.ru (основной сайт, порт 4200)
   - http://api.steamtrust.ru (API, порт 3021)

📊 Мониторинг:
   - Health check: http://steamtrust.ru/health
   - Nginx status: ssh $SSH_USER@$SERVER_IP 'nginx-status'
   - Логи: ssh $SSH_USER@$SERVER_IP 'tail -f /var/log/nginx/access.log'

🎯 Готово к работе!
${NC}"
    success "Развертывание nginx завершено успешно!"
fi