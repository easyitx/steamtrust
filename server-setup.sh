#!/bin/bash

# CSFade Backend Server Setup Script
# Настройка сервера перед деплоем (универсальный стиль)

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Загрузка переменных
ENV_FILE="$(dirname "$0")/.env.config"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Файл $ENV_FILE не найден${NC}"
    exit 1
fi
set -a
source "$ENV_FILE"
set +a

log() {
    echo -e "${BLUE}[SETUP]${NC} $1"
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

# Проверка обязательных переменных
REQUIRED_VARS=("SERVER_IP" "SSH_USER" "SSH_KEY_PATH" "APP_DIR" "LOG_DIR" "BACKUP_DIR" "DEPLOY_USER")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        error "Переменная $var не установлена в $ENV_FILE"
    fi
done

# Разворачиваем путь к SSH ключу
SSH_KEY_EXPANDED="${SSH_KEY_PATH/#~/$HOME}"

remote_exec() {
    local user="$1"
    shift
    ssh -i "$SSH_KEY_EXPANDED" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$user@$SERVER_IP" "$@"
}

log "=== Backend Server Setup ==="
log "Сервер: $SERVER_IP"
log "Пользователь для первого подключения: $SSH_USER"
log "Пользователь для деплоя: $DEPLOY_USER"

# 1. Создание пользователя и настройка SSH (от root/SSH_USER)
remote_exec "$SSH_USER" "\
if ! id '$DEPLOY_USER' &>/dev/null; then
    useradd -m -s /bin/bash $DEPLOY_USER
    echo 'Пользователь $DEPLOY_USER создан'
else
    echo 'Пользователь $DEPLOY_USER уже существует'
fi
usermod -aG sudo,docker $DEPLOY_USER 2>/dev/null || usermod -aG sudo $DEPLOY_USER
mkdir -p /home/$DEPLOY_USER/.ssh
chmod 700 /home/$DEPLOY_USER/.ssh
cp /root/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/ 2>/dev/null || echo 'SSH ключи не найдены'
chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys 2>/dev/null || true
echo '$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/$DEPLOY_USER
"

# 2. Установка системных пакетов и глобальных npm-модулей (от root/SSH_USER)
remote_exec "$SSH_USER" "\
apt update && apt upgrade -y
apt install -y curl wget git htop nano ufw fail2ban unattended-upgrades apt-transport-https ca-certificates gnupg lsb-release software-properties-common
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g npm@latest
npm install -g pm2 yarn
systemctl enable unattended-upgrades
apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \"deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable\" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl start docker
systemctl enable docker
usermod -aG docker $DEPLOY_USER
docker --version
docker compose version
echo 'Docker успешно установлен'
"

success "Backend server setup завершён!" 