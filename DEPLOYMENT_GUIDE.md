# 🚀 CoffeeLand 온톨로지 뷰어 - 완전한 배포 가이드

## ✅ 프로젝트 완료

CoffeeLand 온톨로지 뷰어가 성공적으로 구축되었습니다!

### GitHub 저장소
📦 **Repository**: https://github.com/doogiesdj/CoffeeLand

---

## 📋 단계별 배포 프로세스

### **STEP 1: 로컬에서 테스트** ✓ (선택사항)

```bash
# 프로젝트 클론
git clone https://github.com/doogiesdj/CoffeeLand.git
cd CoffeeLand

# 의존성 설치
npm install

# 로컬 서버 실행
npm start

# 브라우저에서 테스트
# http://localhost:3000
```

---

### **STEP 2: AWS EC2 인스턴스 생성**

#### 2-1. EC2 대시보드 접속
- AWS Console 로그인
- Services > EC2

#### 2-2. 인스턴스 시작
```
AMI: Ubuntu Server 22.04 LTS
Instance Type: t2.small (권장) 또는 t2.micro
Storage: 20GB gp3
```

#### 2-3. 보안 그룹 설정
| 유형 | 프로토콜 | 포트 | 소스 |
|------|---------|------|------|
| SSH | TCP | 22 | My IP |
| HTTP | TCP | 80 | 0.0.0.0/0 |
| HTTPS | TCP | 443 | 0.0.0.0/0 |

#### 2-4. Elastic IP 할당
- EC2 > 네트워크 및 보안 > 탄력적 IP
- 할당 후 인스턴스에 연결

**📌 중요**: Elastic IP를 기록해두세요!
```
예: 54.180.123.45
```

---

### **STEP 3: EC2 서버 설정**

#### 3-1. SSH 접속
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@YOUR_ELASTIC_IP
```

#### 3-2. 자동 배포 스크립트 사용 (권장)

```bash
# GitHub에서 프로젝트 클론
cd ~
git clone https://github.com/doogiesdj/CoffeeLand.git
cd CoffeeLand

# 자동 배포 스크립트 실행
chmod +x deploy-aws.sh
./deploy-aws.sh
```

스크립트가 자동으로 처리하는 항목:
- ✅ Node.js 18.x 설치
- ✅ PM2 프로세스 매니저 설치
- ✅ Nginx 웹서버 설치
- ✅ 애플리케이션 의존성 설치
- ✅ 환경 변수 설정
- ✅ PM2로 앱 실행
- ✅ Nginx 리버스 프록시 설정
- ✅ 방화벽 설정

프롬프트가 나타나면 도메인 입력:
```
도메인을 입력하세요: tonicloud.org
```

#### 3-3. 수동 설치 (옵션)

자동 스크립트를 사용하지 않으려면 다음 명령어를 순서대로 실행:

```bash
# Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 설치
sudo npm install -g pm2

# 의존성 설치
npm install

# 환경 변수 설정
cat > .env << EOF
PORT=3000
NODE_ENV=production
MAX_FILE_SIZE=52428800
SESSION_SECRET=$(openssl rand -base64 32)
EOF

# PM2로 실행
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

### **STEP 4: Route 53 도메인 연결**

#### 4-1. Route 53 콘솔 접속
- AWS Console > Route 53 > 호스팅 영역

#### 4-2. tonicloud.org 호스팅 영역 선택

#### 4-3. A 레코드 생성

**루트 도메인 (tonicloud.org):**
```
레코드 이름: (비워두기)
레코드 유형: A
값: YOUR_ELASTIC_IP (예: 54.180.123.45)
TTL: 300
라우팅 정책: 단순 라우팅
```

**www 서브도메인:**
```
레코드 이름: www
레코드 유형: A
값: YOUR_ELASTIC_IP
TTL: 300
```

#### 4-4. DNS 전파 확인 (5-15분 소요)

```bash
# 로컬 터미널에서
nslookup tonicloud.org

# 또는
dig tonicloud.org
```

---

### **STEP 5: SSL 인증서 설치 (HTTPS)**

#### 5-1. EC2 서버에서 Certbot 설치

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx -y
```

#### 5-2. SSL 인증서 발급

```bash
sudo certbot --nginx -d tonicloud.org -d www.tonicloud.org
```

프롬프트 응답:
- 이메일: (본인 이메일 입력)
- 약관 동의: Yes
- HTTP → HTTPS 리다이렉트: Yes

#### 5-3. 자동 갱신 테스트

```bash
sudo certbot renew --dry-run
```

---

### **STEP 6: 애플리케이션 테스트**

#### 6-1. 브라우저에서 접속

```
✅ http://tonicloud.org
✅ https://tonicloud.org (SSL 설치 후)
```

#### 6-2. 기능 테스트 체크리스트

- [ ] 웹페이지 정상 로딩
- [ ] RDF/OWL 파일 업로드
- [ ] 그래프 시각화 작동
- [ ] 계층 구조 트리 표시
- [ ] SPARQL 쿼리 실행
- [ ] RDF 내용 표시
- [ ] 통계 정보 표시

#### 6-3. 서버 상태 확인

```bash
# PM2 상태
pm2 status

# PM2 로그
pm2 logs ontology-viewer

# Nginx 상태
sudo systemctl status nginx

# 시스템 리소스
htop
```

---

## 🔧 배포 후 관리

### 애플리케이션 업데이트

```bash
cd ~/CoffeeLand

# 최신 코드 가져오기
git pull origin main

# 의존성 업데이트
npm install

# 무중단 재시작
pm2 reload ontology-viewer
```

### 로그 모니터링

```bash
# 실시간 로그
pm2 logs ontology-viewer

# Nginx 로그
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 백업

```bash
# 수동 백업
tar -czf coffeeland-backup-$(date +%Y%m%d).tar.gz ~/CoffeeLand

# S3로 백업 (선택사항)
aws s3 cp coffeeland-backup-*.tar.gz s3://your-bucket/backups/
```

---

## 📊 주요 기능

### 1. **그래프 시각화**
- Cytoscape.js 기반 노드-엣지 다이어그램
- 5가지 레이아웃 옵션
- 확대/축소, 드래그, 클릭 인터랙션

### 2. **계층 구조 트리뷰**
- 클래스 계층 구조 시각화
- 펼치기/접기 기능
- 상속 관계 표시

### 3. **SPARQL 쿼리**
- 실시간 쿼리 실행
- 5가지 예제 쿼리 제공
- 결과를 테이블로 표시

### 4. **RDF 내용 표시**
- Turtle, N-Triples 포맷 지원
- 포맷 변환 기능
- 다운로드 및 복사 기능

### 5. **통계 정보**
- 클래스, 속성, 인스턴스 개수
- 네임스페이스 목록
- 총 트리플 수

---

## 🛠️ 기술 스택

### Backend
- Node.js 18+
- Express 4.18
- N3.js (RDF 파싱)
- Multer (파일 업로드)

### Frontend
- Vanilla JavaScript
- Cytoscape.js (그래프)
- D3.js (트리)
- CSS3

### DevOps
- PM2 (프로세스 관리)
- Nginx (리버스 프록시)
- Let's Encrypt (SSL)
- AWS EC2, Route 53

---

## 📁 프로젝트 구조

```
CoffeeLand/
├── server.js                    # Express 서버
├── package.json                 # 프로젝트 설정
├── ecosystem.config.js          # PM2 설정
├── deploy-aws.sh               # 자동 배포 스크립트
├── .env                        # 환경 변수
├── routes/
│   ├── rdf.js                  # RDF API
│   └── sparql.js               # SPARQL API
├── public/
│   ├── index.html              # 메인 페이지
│   ├── css/style.css           # 스타일
│   └── js/main.js              # 프론트엔드
├── uploads/                    # 업로드 파일
├── README.md                   # 프로젝트 문서
└── AWS_DEPLOYMENT.md           # 상세 배포 가이드
```

---

## 🔒 보안

### 적용된 보안 조치
- ✅ Helmet.js (보안 헤더)
- ✅ CORS 설정
- ✅ 파일 크기 제한 (50MB)
- ✅ 파일 타입 검증
- ✅ SSL/TLS 암호화
- ✅ UFW 방화벽

### 추가 보안 권장사항
```bash
# fail2ban 설치
sudo apt-get install fail2ban -y

# SSH 포트 변경 (선택사항)
sudo nano /etc/ssh/sshd_config
# Port 22 → Port 2222

# 시스템 업데이트 자동화
sudo apt-get install unattended-upgrades -y
```

---

## 💰 예상 비용

### AWS 프리티어 (첫 12개월)
- EC2 t2.micro: 무료
- Route 53: $0.50/월
- 데이터 전송: 15GB까지 무료

### 프리티어 이후
- EC2 t2.small: ~$17/월
- Route 53: $0.50/월
- 데이터 전송: 사용량에 따라

**총 예상 비용**: 약 $18-25/월

---

## 🐛 트러블슈팅

### 문제 1: 502 Bad Gateway

**해결:**
```bash
pm2 restart ontology-viewer
sudo systemctl restart nginx
```

### 문제 2: 파일 업로드 실패

**해결:**
```bash
chmod 755 ~/CoffeeLand/uploads
sudo nano /etc/nginx/sites-available/ontology
# client_max_body_size 50M; 확인
```

### 문제 3: SSL 인증서 오류

**해결:**
```bash
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

### 문제 4: 메모리 부족 (t2.micro)

**해결: 스왑 메모리 추가**
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 📞 지원

### 문서
- [README.md](./README.md) - 프로젝트 개요
- [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) - 상세 배포 가이드

### GitHub
- 이슈: https://github.com/doogiesdj/CoffeeLand/issues
- Pull Requests: 환영합니다!

---

## ✨ 다음 단계

배포가 완료되면 다음 작업을 고려하세요:

### 1. 샘플 온톨로지 준비
Protege에서 coffeeland.owl 파일을 export하여 테스트

### 2. 도메인 확장
서브도메인 추가:
- ontology.tonicloud.org
- demo.tonicloud.org

### 3. 추가 기능
- 사용자 인증
- 온톨로지 버전 관리
- 협업 기능
- API 문서화

### 4. 모니터링
- AWS CloudWatch 설정
- 알림 설정
- 성능 모니터링

---

## 🎉 완료!

축하합니다! CoffeeLand 온톨로지 뷰어가 성공적으로 배포되었습니다.

**접속 URL**: https://tonicloud.org

궁금한 점이 있으시면 GitHub Issues로 문의해주세요!

---

**Made with ☕ by CoffeeLand Project**
