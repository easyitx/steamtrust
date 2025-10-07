#!/bin/bash

# Скрипт развертывания бэкенда (только копирование файлов)
# Использование: ./deploy.sh

set -e

# Загрузка переменных из .env.production
ENV_FILE=".env.production"
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Файл $ENV_FILE не найден"
    exit 1
fi
set -a
source "$ENV_FILE"
set +a

# Проверка обязательных переменных
REQUIRED_VARS=("SERVER_USER" "SERVER_IP" "SSH_KEY_PATH")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Переменная $var не установлена в $ENV_FILE"
        exit 1
    fi
done

# Конфигурация сервера
SERVER_PATH="/usr/local/src/steamtrust/backend"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Развертывание бэкенда (только копирование) ===${NC}"

# Функция для вывода сообщений
log() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка SSH соединения
check_ssh() {
    log "Проверка SSH соединения..."
    if ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "echo 'SSH OK'" 2>/dev/null; then
        success "SSH соединение работает"
        return 0
    else
        error "SSH соединение не работает"
        return 1
    fi
}

# Копирование файлов на сервер
copy_files() {
    log "Копирование файлов на сервер..."
    
    # Создание директории на сервере с sudo
    ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "sudo mkdir -p $SERVER_PATH && sudo chown $SERVER_USER:$SERVER_USER $SERVER_PATH"

    # Копирование файлов проекта
    rsync -avz --delete \
        --exclude 'node_modules' \
        --exclude 'dist' \
        --exclude '.git' \
        --exclude 'logs' \
        --exclude '.idea' \
        --exclude 'src/files/uploads' \
        -e "ssh -i $SSH_KEY_PATH -o StrictHostKeyChecking=no" \
        ./ "$SERVER_USER@$SERVER_IP:$SERVER_PATH/"
    
    success "Файлы скопированы"
}

# Создание .env файла на сервере
create_env() {
    log "Создание .env файла на сервере..."
    
    # Проверяем наличие .env.production
    if [ ! -f ".env.production" ]; then
        error "Файл .env.production не найден!"
        exit 1
    fi
    
    # Читаем данные из .env.production и создаем .env на сервере
    ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "
        cd $SERVER_PATH
        
        # Создание .env файла на основе .env.production
        cat > .env << 'EOF'
$(cat .env.production)

# Дополнительные настройки для продакшена
NODE_ENV=production
EOF
        
        echo '✅ .env файл создан на основе .env.production'
    "
    
    success ".env файл создан на основе .env.production"
}

# Основной процесс развертывания
main() {
    check_ssh || exit 1
    copy_files
    create_env
    echo ""
    success "=== РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО ==="
    echo -e "${BLUE}Файлы скопированы в: $SERVER_PATH${NC}"
    echo -e "${BLUE}.env файл создан на сервере${NC}"
}

# Запуск
main