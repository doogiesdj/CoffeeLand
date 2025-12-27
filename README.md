# CoffeeLand 온톨로지 뷰어

Semantic Web 온톨로지 시각화를 위한 동적 웹 애플리케이션

## 🎯 기능

- ✅ **그래프 시각화**: Cytoscape.js를 이용한 노드-엣지 다이어그램
- ✅ **계층 구조 트리뷰**: 클래스 계층 구조 탐색
- ✅ **SPARQL 쿼리**: 실시간 SPARQL 쿼리 실행
- ✅ **RDF 내용 표시**: 다양한 포맷(Turtle, N-Triples 등)으로 변환 및 표시
- ✅ **통계 정보**: 클래스, 속성, 인스턴스 개수 및 네임스페이스 목록

## 🛠️ 기술 스택

### Backend
- **Node.js** v14+ 
- **Express** - 웹 프레임워크
- **N3.js** - RDF/Turtle 파싱
- **Multer** - 파일 업로드 처리

### Frontend
- **Vanilla JavaScript** - 프론트엔드 로직
- **Cytoscape.js** - 그래프 시각화
- **D3.js** - 트리 시각화
- **Font Awesome** - 아이콘

## 📁 프로젝트 구조

```
coffeeland-ontology-viewer/
├── server.js                 # Express 서버
├── package.json              # 프로젝트 설정
├── .env                      # 환경 변수
├── routes/
│   ├── rdf.js               # RDF 처리 API
│   └── sparql.js            # SPARQL 쿼리 API
├── public/
│   ├── index.html           # 메인 HTML
│   ├── css/
│   │   └── style.css        # 스타일시트
│   └── js/
│       └── main.js          # 프론트엔드 JavaScript
└── uploads/                 # 업로드된 RDF 파일 저장
```

## 🚀 로컬 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 서버 실행

```bash
# 프로덕션 모드
npm start

# 개발 모드 (nodemon 사용)
npm run dev
```

### 3. 브라우저에서 접속

```
http://localhost:3000
```

## 📤 사용 방법

1. **파일 업로드**: Protege에서 export한 RDF/OWL 파일을 업로드
2. **그래프 시각화**: 온톨로지를 노드-엣지 다이어그램으로 확인
3. **계층 구조**: 클래스의 계층적 관계 탐색
4. **SPARQL 쿼리**: 예제 쿼리 또는 커스텀 쿼리 실행
5. **통계 확인**: 온톨로지의 전체 통계 정보 확인

## 🌐 AWS 배포 가이드

### Option 1: AWS EC2 (추천)

#### 1단계: EC2 인스턴스 생성

```bash
# AWS Console에서 EC2 인스턴스 생성
# - AMI: Ubuntu 22.04 LTS
# - Instance Type: t2.micro (프리티어) 또는 t2.small
# - Security Group: 포트 22(SSH), 80(HTTP), 443(HTTPS), 3000(Node.js) 열기
```

#### 2단계: SSH 접속 및 환경 설정

```bash
# SSH로 EC2 접속
ssh -i your-key.pem ubuntu@your-ec2-ip

# Node.js 설치 (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git 설치
sudo apt-get install git -y

# PM2 설치 (프로세스 관리)
sudo npm install -g pm2
```

#### 3단계: 애플리케이션 배포

```bash
# GitHub에서 클론
git clone https://github.com/your-username/coffeeland-ontology-viewer.git
cd coffeeland-ontology-viewer

# 의존성 설치
npm install

# 환경 변수 설정
nano .env
# PORT=3000 설정

# PM2로 실행
pm2 start server.js --name "ontology-viewer"
pm2 save
pm2 startup
```

#### 4단계: Nginx 리버스 프록시 설정

```bash
# Nginx 설치
sudo apt-get install nginx -y

# Nginx 설정
sudo nano /etc/nginx/sites-available/ontology

# 다음 내용 입력:
server {
    listen 80;
    server_name tonicloud.org www.tonicloud.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# 설정 활성화
sudo ln -s /etc/nginx/sites-available/ontology /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5단계: Route 53 도메인 연결

```bash
# AWS Console > Route 53 > Hosted Zones
# 1. tonicloud.org 호스팅 영역 선택
# 2. 레코드 생성
#    - 레코드 이름: 비워두기 (또는 www)
#    - 레코드 타입: A
#    - 값: EC2 인스턴스의 Elastic IP
# 3. 레코드 생성 클릭
```

#### 6단계: SSL 인증서 설정 (HTTPS)

```bash
# Certbot 설치
sudo apt-get install certbot python3-certbot-nginx -y

# SSL 인증서 발급
sudo certbot --nginx -d tonicloud.org -d www.tonicloud.org

# 자동 갱신 설정
sudo certbot renew --dry-run
```

### Option 2: AWS Elastic Beanstalk

#### 1단계: EB CLI 설치

```bash
pip install awsebcli
```

#### 2단계: 애플리케이션 초기화

```bash
cd /path/to/coffeeland-ontology-viewer
eb init

# 리전 선택: ap-northeast-2 (서울)
# 애플리케이션 이름: coffeeland-ontology
# Node.js 플랫폼 선택
```

#### 3단계: 환경 생성 및 배포

```bash
eb create production-env
eb deploy
```

#### 4단계: 도메인 연결

```bash
# EB 환경 URL 확인
eb status

# Route 53에서 CNAME 레코드 생성
# 이름: www 또는 ontology
# 값: EB 환경 URL
```

### Option 3: AWS Amplify

#### 1단계: GitHub 저장소 연결

```bash
# AWS Console > Amplify > New App > Host web app
# GitHub 선택 후 저장소 연결
```

#### 2단계: 빌드 설정

```yaml
# amplify.yml 파일 생성
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: /
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### 3단계: 도메인 연결

```bash
# Amplify Console > Domain management
# tonicloud.org 추가
# Route 53 자동 설정 옵션 사용
```

## 🔧 환경 변수

`.env` 파일에 다음 변수를 설정하세요:

```env
PORT=3000
NODE_ENV=production
MAX_FILE_SIZE=52428800
SESSION_SECRET=your-secret-key-change-this
```

## 📊 API 엔드포인트

### RDF 처리
- `POST /api/upload` - RDF 파일 업로드
- `POST /api/rdf/parse` - RDF 파싱
- `POST /api/rdf/stats` - 통계 정보
- `POST /api/rdf/convert` - 포맷 변환
- `POST /api/rdf/hierarchy` - 계층 구조

### SPARQL 쿼리
- `POST /api/sparql/query` - 쿼리 실행
- `GET /api/sparql/examples` - 예제 쿼리

## 🔒 보안 고려사항

- Helmet.js를 사용한 보안 헤더 설정
- 파일 업로드 크기 제한 (50MB)
- 허용된 파일 확장자만 업로드 가능
- CORS 설정
- 입력 데이터 검증

## 📝 라이선스

MIT License

## 👥 기여

이슈 및 풀 리퀘스트 환영합니다!

## 📧 문의

프로젝트 관련 문의사항은 이슈로 남겨주세요.

---

**Powered by Node.js, Express, and Cytoscape.js**
