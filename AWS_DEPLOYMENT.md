# AWS 배포 가이드

이 문서는 CoffeeLand 온톨로지 뷰어를 AWS에 배포하고 tonicloud.org 도메인에 연결하는 전체 과정을 설명합니다.

## 📋 목차

1. [AWS EC2 배포](#aws-ec2-배포)
2. [Route 53 도메인 연결](#route-53-도메인-연결)
3. [SSL 인증서 설정](#ssl-인증서-설정)
4. [자동 배포 스크립트](#자동-배포-스크립트)
5. [모니터링 및 로그](#모니터링-및-로그)

---

## AWS EC2 배포

### 1단계: EC2 인스턴스 생성

#### AWS Console에서 작업:

1. **EC2 대시보드** 접속
   - AWS Console > Services > EC2

2. **인스턴스 시작** 클릭

3. **AMI 선택**
   - Ubuntu Server 22.04 LTS (HVM), SSD Volume Type
   - 64-bit (x86)

4. **인스턴스 타입 선택**
   - t2.micro (프리티어) 또는
   - t2.small (권장 - 더 나은 성능)

5. **키 페어 생성**
   - 새 키 페어 생성 또는 기존 키 선택
   - 다운로드한 .pem 파일 안전하게 보관

6. **네트워크 설정**
   - VPC: 기본 VPC 선택
   - 퍼블릭 IP 자동 할당: 활성화

7. **보안 그룹 설정**
   ```
   규칙 추가:
   - SSH (22) - 내 IP 또는 0.0.0.0/0
   - HTTP (80) - 0.0.0.0/0
   - HTTPS (443) - 0.0.0.0/0
   - Custom TCP (3000) - 0.0.0.0/0 (임시, 나중에 제거)
   ```

8. **스토리지 설정**
   - 8GB 이상 (20GB 권장)
   - gp3 타입

9. **인스턴스 시작** 클릭

### 2단계: Elastic IP 할당

1. **EC2 > 네트워크 및 보안 > 탄력적 IP** 메뉴
2. **탄력적 IP 주소 할당** 클릭
3. 할당된 IP를 EC2 인스턴스와 연결

### 3단계: SSH 접속

```bash
# 키 파일 권한 설정
chmod 400 your-key.pem

# EC2 인스턴스 접속
ssh -i your-key.pem ubuntu@YOUR_ELASTIC_IP
```

### 4단계: 서버 환경 설정

```bash
# 시스템 업데이트
sudo apt-get update
sudo apt-get upgrade -y

# Node.js 18.x 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 버전 확인
node --version
npm --version

# Git 설치
sudo apt-get install git -y

# PM2 설치 (프로세스 관리자)
sudo npm install -g pm2

# Nginx 설치
sudo apt-get install nginx -y
```

### 5단계: GitHub에서 코드 가져오기

```bash
# GitHub 저장소 클론
cd ~
git clone https://github.com/YOUR_USERNAME/coffeeland-ontology-viewer.git
cd coffeeland-ontology-viewer

# 의존성 설치
npm install
```

### 6단계: 환경 변수 설정

```bash
# .env 파일 생성
nano .env
```

다음 내용 입력:

```env
PORT=3000
NODE_ENV=production
MAX_FILE_SIZE=52428800
SESSION_SECRET=your-random-secret-key-here
```

보안을 위해 SECRET 생성:
```bash
openssl rand -base64 32
```

### 7단계: PM2로 애플리케이션 실행

```bash
# PM2로 실행
pm2 start server.js --name "ontology-viewer"

# 상태 확인
pm2 status

# 로그 확인
pm2 logs ontology-viewer

# 부팅 시 자동 시작 설정
pm2 startup systemd
# 출력된 명령어 실행

pm2 save
```

**또는 ecosystem.config.js 사용:**

```bash
pm2 start ecosystem.config.js
pm2 save
```

### 8단계: Nginx 리버스 프록시 설정

```bash
# Nginx 설정 파일 생성
sudo nano /etc/nginx/sites-available/ontology
```

다음 내용 입력:

```nginx
server {
    listen 80;
    server_name tonicloud.org www.tonicloud.org;

    # 파일 업로드 크기 제한
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 타임아웃 설정
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

설정 활성화:

```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/ontology /etc/nginx/sites-enabled/

# 기본 사이트 비활성화
sudo rm /etc/nginx/sites-enabled/default

# Nginx 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx

# Nginx 상태 확인
sudo systemctl status nginx
```

---

## Route 53 도메인 연결

### 방법 1: A 레코드로 직접 연결 (권장)

1. **AWS Console > Route 53 > 호스팅 영역** 접속

2. **tonicloud.org** 호스팅 영역 선택

3. **레코드 생성** 클릭

4. **A 레코드 설정:**
   ```
   레코드 이름: (비워두기 - 루트 도메인)
   레코드 유형: A
   값: YOUR_ELASTIC_IP
   TTL: 300
   라우팅 정책: 단순 라우팅
   ```

5. **레코드 생성** 클릭

6. **www 서브도메인용 레코드도 생성:**
   ```
   레코드 이름: www
   레코드 유형: A
   값: YOUR_ELASTIC_IP
   TTL: 300
   ```

### 방법 2: CNAME 레코드 사용

```
레코드 이름: ontology
레코드 유형: CNAME
값: ec2-xx-xx-xx-xx.ap-northeast-2.compute.amazonaws.com
TTL: 300
```

이렇게 하면 `ontology.tonicloud.org`로 접속 가능

### DNS 전파 확인

```bash
# DNS 확인
nslookup tonicloud.org

# 또는
dig tonicloud.org

# 웹 브라우저에서 테스트
curl http://tonicloud.org
```

DNS 전파는 최대 48시간 소요될 수 있지만 보통 5-15분 이내에 완료됩니다.

---

## SSL 인증서 설정

### Let's Encrypt (Certbot) 사용

#### 1단계: Certbot 설치

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx -y
```

#### 2단계: SSL 인증서 발급

```bash
# Nginx 플러그인 사용
sudo certbot --nginx -d tonicloud.org -d www.tonicloud.org
```

프롬프트에서:
- 이메일 입력
- 약관 동의
- HTTP를 HTTPS로 리다이렉트: Yes

#### 3단계: 자동 갱신 설정

```bash
# 자동 갱신 테스트
sudo certbot renew --dry-run

# 갱신 타이머 확인
sudo systemctl status certbot.timer
```

Let's Encrypt 인증서는 90일마다 갱신이 필요하며, Certbot이 자동으로 처리합니다.

#### 4단계: 방화벽 설정

```bash
# UFW 방화벽 설정
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable

# 상태 확인
sudo ufw status
```

### 인증서 확인

```bash
# 브라우저에서 접속
https://tonicloud.org

# SSL 등급 확인 (선택사항)
# https://www.ssllabs.com/ssltest/
```

---

## 자동 배포 스크립트

### 사용 방법

프로젝트에 포함된 `deploy-aws.sh` 스크립트 사용:

```bash
# EC2 인스턴스에서
cd ~/coffeeland-ontology-viewer

# 실행 권한 부여
chmod +x deploy-aws.sh

# 스크립트 실행
./deploy-aws.sh
```

이 스크립트는 자동으로:
- Node.js, PM2, Nginx 설치
- 의존성 설치
- 환경 변수 설정
- PM2로 앱 시작
- Nginx 설정
- 방화벽 설정

---

## 모니터링 및 로그

### PM2 모니터링

```bash
# 실시간 모니터링
pm2 monit

# 상태 확인
pm2 status

# 로그 보기
pm2 logs ontology-viewer

# 최근 로그만
pm2 logs ontology-viewer --lines 100

# 특정 프로세스 재시작
pm2 restart ontology-viewer

# 메모리 사용량 확인
pm2 info ontology-viewer
```

### Nginx 로그

```bash
# 액세스 로그
sudo tail -f /var/log/nginx/access.log

# 에러 로그
sudo tail -f /var/log/nginx/error.log
```

### 시스템 리소스 모니터링

```bash
# 실시간 리소스 사용량
htop

# 디스크 사용량
df -h

# 메모리 사용량
free -h

# 네트워크 연결
netstat -tuln | grep :3000
```

### 로그 로테이션 설정

```bash
# PM2 로그 로테이션 모듈 설치
pm2 install pm2-logrotate

# 설정
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

---

## 업데이트 및 재배포

### Git Pull 방식

```bash
cd ~/coffeeland-ontology-viewer

# 최신 코드 가져오기
git pull origin main

# 의존성 업데이트
npm install

# 애플리케이션 재시작
pm2 restart ontology-viewer

# 또는 무중단 재시작 (클러스터 모드)
pm2 reload ontology-viewer
```

### GitHub Actions를 통한 자동 배포 (선택사항)

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to AWS EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to EC2
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.EC2_HOST }}
        username: ubuntu
        key: ${{ secrets.EC2_SSH_KEY }}
        script: |
          cd ~/coffeeland-ontology-viewer
          git pull origin main
          npm install
          pm2 restart ontology-viewer
```

GitHub Secrets에 추가:
- `EC2_HOST`: EC2 Elastic IP
- `EC2_SSH_KEY`: .pem 파일 내용

---

## 트러블슈팅

### 문제 1: 502 Bad Gateway

**원인:** Node.js 애플리케이션이 실행되지 않음

**해결:**
```bash
pm2 status
pm2 logs ontology-viewer
pm2 restart ontology-viewer
```

### 문제 2: 파일 업로드 실패

**원인:** 파일 크기 제한 또는 권한 문제

**해결:**
```bash
# uploads 디렉토리 권한 확인
ls -la uploads/
chmod 755 uploads/

# Nginx 설정 확인
grep client_max_body_size /etc/nginx/sites-available/ontology
```

### 문제 3: SSL 인증서 오류

**원인:** DNS 전파 미완료 또는 인증서 만료

**해결:**
```bash
# DNS 확인
nslookup tonicloud.org

# 인증서 갱신
sudo certbot renew
sudo systemctl restart nginx
```

### 문제 4: 메모리 부족

**원인:** t2.micro 인스턴스의 메모리 부족

**해결:**
```bash
# 스왑 메모리 생성
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 영구 설정
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 보안 체크리스트

- [ ] EC2 보안 그룹에서 불필요한 포트 차단
- [ ] SSH 포트를 22에서 다른 포트로 변경 (선택사항)
- [ ] fail2ban 설치로 무차별 대입 공격 방지
- [ ] SSL/TLS 인증서 설치 완료
- [ ] 정기적인 시스템 업데이트 설정
- [ ] 백업 계획 수립
- [ ] CloudWatch 알람 설정 (선택사항)

### fail2ban 설치 (선택사항)

```bash
sudo apt-get install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 비용 최적화

### AWS 프리티어 사용

- EC2 t2.micro: 월 750시간 무료 (1년)
- Elastic IP: 인스턴스에 연결된 상태에서 무료
- Route 53: 호스팅 영역당 월 $0.50
- 데이터 전송: 월 15GB까지 무료

### 예상 월 비용 (프리티어 이후)

- t2.micro: ~$8.50/월
- t2.small: ~$17/월
- Route 53: $0.50/월
- 데이터 전송: 사용량에 따라

---

## 백업 전략

```bash
# 자동 백업 스크립트
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 애플리케이션 백업
tar -czf $BACKUP_DIR/app_$DATE.tar.gz ~/coffeeland-ontology-viewer

# uploads 디렉토리 백업
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz ~/coffeeland-ontology-viewer/uploads

# 7일 이상 된 백업 삭제
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

# S3로 업로드 (선택사항)
# aws s3 cp $BACKUP_DIR/app_$DATE.tar.gz s3://your-bucket/backups/
```

cron으로 자동화:
```bash
crontab -e

# 매일 새벽 3시에 백업
0 3 * * * /home/ubuntu/backup.sh
```

---

## 추가 리소스

- [Express.js 공식 문서](https://expressjs.com/)
- [PM2 공식 문서](https://pm2.keymetrics.io/)
- [Nginx 공식 문서](https://nginx.org/en/docs/)
- [Let's Encrypt 문서](https://letsencrypt.org/docs/)
- [AWS EC2 사용 설명서](https://docs.aws.amazon.com/ec2/)
- [Route 53 개발자 가이드](https://docs.aws.amazon.com/route53/)

---

**배포 완료 후 확인사항:**

✅ http://tonicloud.org 접속 가능  
✅ https://tonicloud.org 접속 가능 (SSL)  
✅ RDF 파일 업로드 테스트  
✅ 모든 탭 기능 동작 확인  
✅ PM2 모니터링 설정 완료  
✅ 자동 재시작 설정 완료

**문제가 발생하면 로그를 확인하세요:**
```bash
pm2 logs ontology-viewer
sudo tail -f /var/log/nginx/error.log
```
