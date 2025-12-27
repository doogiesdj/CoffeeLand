#!/bin/bash

# AWS EC2 배포 자동화 스크립트

echo "🚀 CoffeeLand 온톨로지 뷰어 배포 시작..."

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 시스템 업데이트
echo -e "${YELLOW}1. 시스템 업데이트 중...${NC}"
sudo apt-get update -y
sudo apt-get upgrade -y

# 2. Node.js 설치 확인
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}2. Node.js 설치 중...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo -e "${GREEN}2. Node.js가 이미 설치되어 있습니다.${NC}"
fi

echo "Node.js 버전: $(node --version)"
echo "NPM 버전: $(npm --version)"

# 3. PM2 설치 확인
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}3. PM2 설치 중...${NC}"
    sudo npm install -g pm2
else
    echo -e "${GREEN}3. PM2가 이미 설치되어 있습니다.${NC}"
fi

# 4. Nginx 설치 확인
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}4. Nginx 설치 중...${NC}"
    sudo apt-get install nginx -y
else
    echo -e "${GREEN}4. Nginx가 이미 설치되어 있습니다.${NC}"
fi

# 5. 애플리케이션 디렉토리로 이동
APP_DIR="/home/ubuntu/coffeeland-ontology-viewer"

if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}애플리케이션 디렉토리를 찾을 수 없습니다: $APP_DIR${NC}"
    echo "Git clone을 먼저 수행해주세요."
    exit 1
fi

cd $APP_DIR

# 6. 의존성 설치
echo -e "${YELLOW}5. NPM 의존성 설치 중...${NC}"
npm install --production

# 7. 환경 변수 설정
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}6. .env 파일 생성 중...${NC}"
    cat > .env << EOF
PORT=3000
NODE_ENV=production
MAX_FILE_SIZE=52428800
SESSION_SECRET=$(openssl rand -base64 32)
EOF
    echo -e "${GREEN}.env 파일이 생성되었습니다.${NC}"
else
    echo -e "${GREEN}6. .env 파일이 이미 존재합니다.${NC}"
fi

# 8. uploads 디렉토리 권한 설정
echo -e "${YELLOW}7. 디렉토리 권한 설정 중...${NC}"
mkdir -p uploads
chmod 755 uploads

# 9. PM2로 애플리케이션 시작
echo -e "${YELLOW}8. PM2로 애플리케이션 시작 중...${NC}"
pm2 stop ontology-viewer 2>/dev/null || true
pm2 delete ontology-viewer 2>/dev/null || true
pm2 start server.js --name "ontology-viewer" -i max
pm2 save

# 10. PM2 자동 시작 설정
echo -e "${YELLOW}9. PM2 부팅 시 자동 시작 설정 중...${NC}"
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
pm2 save

# 11. Nginx 설정
echo -e "${YELLOW}10. Nginx 설정 중...${NC}"

# 도메인 입력 받기
read -p "도메인을 입력하세요 (예: tonicloud.org): " DOMAIN

if [ -z "$DOMAIN" ]; then
    DOMAIN="tonicloud.org"
fi

sudo tee /etc/nginx/sites-available/ontology > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Nginx 설정 활성화
sudo ln -sf /etc/nginx/sites-available/ontology /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Nginx 설정 테스트
sudo nginx -t

if [ $? -eq 0 ]; then
    sudo systemctl restart nginx
    echo -e "${GREEN}Nginx가 성공적으로 설정되었습니다.${NC}"
else
    echo -e "${RED}Nginx 설정에 오류가 있습니다.${NC}"
    exit 1
fi

# 12. 방화벽 설정 (UFW)
echo -e "${YELLOW}11. 방화벽 설정 중...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 13. SSL 인증서 설치 안내
echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}배포가 완료되었습니다!${NC}"
echo -e "${GREEN}===========================================${NC}"
echo ""
echo -e "${YELLOW}다음 단계:${NC}"
echo ""
echo "1. Route 53에서 A 레코드 설정:"
echo "   - AWS Console > Route 53 > Hosted Zones"
echo "   - tonicloud.org 선택"
echo "   - A 레코드 생성: EC2 Elastic IP 입력"
echo ""
echo "2. SSL 인증서 설치 (HTTPS):"
echo "   sudo apt-get install certbot python3-certbot-nginx -y"
echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "3. 애플리케이션 상태 확인:"
echo "   pm2 status"
echo "   pm2 logs ontology-viewer"
echo ""
echo "4. 브라우저에서 접속:"
echo "   http://$DOMAIN"
echo ""
echo -e "${GREEN}===========================================${NC}"
