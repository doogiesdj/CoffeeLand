# 🚀 CoffeeLand 온톨로지 뷰어 배포 가이드

## 📋 전체 프로세스 개요

```
Step 1: Protege 온톨로지 준비 (5분)
    ↓
Step 2: 로컬 테스트 (10분) - 선택사항
    ↓
Step 3: AWS EC2 인스턴스 생성 (15분)
    ↓
Step 4: 애플리케이션 배포 (10분)
    ↓
Step 5: 도메인 연결 (5분)
    ↓
Step 6: SSL 인증서 설치 (5분)
    ↓
Step 7: 최종 테스트 (10분)

총 소요 시간: 약 1시간
```

---

## 📍 Step 1: Protege에서 온톨로지 파일 Export

### 1-1. Protege 실행 및 온톨로지 열기
```
1. Protege 프로그램 실행
2. File > Open 으로 coffeeland 온톨로지 프로젝트 열기
```

### 1-2. RDF/OWL 형식으로 Export
```
1. File > Save as... 클릭
2. Format 선택:
   ✅ 추천: RDF/XML (확장자: .owl 또는 .rdf)
   - Turtle (.ttl) - 가독성 좋음
   - N-Triples (.nt) - 단순함
   
3. 파일명 입력: coffeeland.owl
4. 저장 위치: 바탕화면 또는 쉽게 찾을 수 있는 곳
5. Save 클릭
```

### 1-3. 파일 확인
```
✓ 파일 크기가 0이 아닌지 확인
✓ 텍스트 에디터로 열어서 내용이 있는지 확인
✓ <?xml version="1.0"?> 또는 @prefix로 시작하는지 확인
```

**🎯 결과**: `coffeeland.owl` 파일이 준비됨

---

## 📍 Step 2: 로컬 테스트 (선택사항)

> 💡 이 단계는 선택사항입니다. 바로 AWS 배포로 진행해도 됩니다.

### 2-1. 프로젝트 클론 (이미 있다면 스킵)
```bash
# 터미널 또는 명령 프롬프트 열기
git clone https://github.com/doogiesdj/CoffeeLand.git
cd CoffeeLand
```

### 2-2. 의존성 설치
```bash
npm install
```

### 2-3. 서버 실행
```bash
npm start
```

### 2-4. 브라우저 테스트
```
1. 브라우저에서 http://localhost:3000 접속
2. 좌측 사이드바에서 "파일 선택" 클릭
3. Step 1에서 export한 coffeeland.owl 파일 업로드
4. 그래프 시각화, SPARQL 쿼리 등 기능 테스트
```

**🎯 결과**: 로컬에서 정상 작동 확인

---

## 📍 Step 3: AWS EC2 인스턴스 생성

### 3-1. AWS 콘솔 로그인
```
1. https://aws.amazon.com/console/ 접속
2. AWS 계정으로 로그인
3. 리전 선택: 서울 (ap-northeast-2)
```

### 3-2. EC2 대시보드 접속
```
1. 상단 검색창에 "EC2" 입력
2. EC2 서비스 클릭
3. "인스턴스 시작" 버튼 클릭
```

### 3-3. AMI 선택
```
✅ Ubuntu Server 22.04 LTS (HVM), SSD Volume Type
   - 64-bit (x86) 선택
```

### 3-4. 인스턴스 타입 선택
```
권장:
✅ t2.small (2 vCPU, 2GB RAM) - 안정적인 성능
   또는
⚠️  t2.micro (1 vCPU, 1GB RAM) - 프리티어, 메모리 제한

선택 후 "다음" 클릭
```

### 3-5. 키 페어 생성/선택
```
신규 생성:
1. "새 키 페어 생성" 클릭
2. 키 페어 이름: coffeeland-key
3. 키 페어 유형: RSA
4. 프라이빗 키 파일 형식: .pem
5. "키 페어 생성" 클릭
6. ⚠️ 다운로드된 .pem 파일 안전하게 보관!

기존 키 사용:
- 드롭다운에서 기존 키 페어 선택
```

### 3-6. 네트워크 설정 (보안 그룹)
```
"네트워크 설정 편집" 클릭

보안 그룹 규칙 추가:
┌──────────┬──────────┬──────┬─────────────┐
│   유형    │ 프로토콜  │ 포트 │    소스     │
├──────────┼──────────┼──────┼─────────────┤
│   SSH    │   TCP   │  22  │  내 IP      │
│   HTTP   │   TCP   │  80  │ 0.0.0.0/0   │
│  HTTPS   │   TCP   │ 443  │ 0.0.0.0/0   │
└──────────┴──────────┴──────┴─────────────┘

✓ "보안 그룹 규칙 추가" 클릭하여 각 규칙 추가
```

### 3-7. 스토리지 설정
```
✅ 크기: 20 GB (권장)
✅ 볼륨 유형: gp3 (또는 gp2)
```

### 3-8. 인스턴스 시작
```
1. 오른쪽 요약 확인
2. "인스턴스 시작" 버튼 클릭
3. "인스턴스 보기" 클릭
```

### 3-9. Elastic IP 할당 (중요!)
```
1. EC2 대시보드 > 네트워크 및 보안 > 탄력적 IP
2. "탄력적 IP 주소 할당" 클릭
3. "할당" 클릭
4. 새로 생성된 IP 선택
5. "작업" > "탄력적 IP 주소 연결"
6. 인스턴스 선택: 방금 만든 EC2 인스턴스
7. "연결" 클릭

📝 Elastic IP 주소 기록:
   예: 13.125.XX.XXX
```

**🎯 결과**: EC2 인스턴스와 고정 IP 준비 완료

---

## 📍 Step 4: EC2에 애플리케이션 배포

### 4-1. SSH 접속 준비 (Windows)
```
PowerShell 또는 Git Bash 실행

# 키 파일 권한 설정 (Git Bash)
chmod 400 coffeeland-key.pem

# 또는 Windows에서:
icacls coffeeland-key.pem /inheritance:r
icacls coffeeland-key.pem /grant:r "%username%:R"
```

### 4-2. SSH 접속
```bash
ssh -i coffeeland-key.pem ubuntu@YOUR_ELASTIC_IP

# 예시:
ssh -i coffeeland-key.pem ubuntu@13.125.XX.XXX

# 첫 접속 시 "yes" 입력
```

### 4-3. GitHub에서 프로젝트 클론
```bash
# EC2 서버 안에서 실행
cd ~
git clone https://github.com/doogiesdj/CoffeeLand.git
cd CoffeeLand
```

### 4-4. 자동 배포 스크립트 실행
```bash
# 스크립트 실행 권한 부여
chmod +x deploy-aws.sh

# 자동 배포 시작
./deploy-aws.sh
```

### 4-5. 프롬프트 응답
```
스크립트 실행 중 질문이 나타나면:

1. "도메인을 입력하세요:"
   → tonicloud.org 입력

2. PM2 startup 명령어가 출력되면:
   → 그대로 복사해서 실행

3. 완료 메시지 확인
```

### 4-6. 애플리케이션 상태 확인
```bash
# PM2 프로세스 확인
pm2 status

# 로그 확인
pm2 logs ontology-viewer --lines 50

# Nginx 상태 확인
sudo systemctl status nginx

# 포트 확인
sudo netstat -tuln | grep :3000
```

**🎯 결과**: Node.js 앱이 EC2에서 실행 중

---

## 📍 Step 5: Route 53 도메인 연결

### 5-1. Route 53 콘솔 접속
```
1. AWS 콘솔에서 Route 53 검색
2. Route 53 서비스 클릭
3. "호스팅 영역" 메뉴 클릭
```

### 5-2. tonicloud.org 호스팅 영역 선택
```
1. 호스팅 영역 목록에서 "tonicloud.org" 클릭
2. "레코드 생성" 버튼 클릭
```

### 5-3. A 레코드 생성 (루트 도메인)
```
┌─────────────────┬──────────────────────┐
│ 레코드 이름      │ (비워두기)           │
│ 레코드 유형      │ A                    │
│ 값              │ YOUR_ELASTIC_IP      │
│                 │ 예: 13.125.XX.XXX    │
│ TTL             │ 300                  │
│ 라우팅 정책      │ 단순 라우팅          │
└─────────────────┴──────────────────────┘

"레코드 생성" 클릭
```

### 5-4. A 레코드 생성 (www 서브도메인)
```
다시 "레코드 생성" 클릭

┌─────────────────┬──────────────────────┐
│ 레코드 이름      │ www                  │
│ 레코드 유형      │ A                    │
│ 값              │ YOUR_ELASTIC_IP      │
│ TTL             │ 300                  │
│ 라우팅 정책      │ 단순 라우팅          │
└─────────────────┴──────────────────────┘

"레코드 생성" 클릭
```

### 5-5. DNS 전파 확인 (5-15분 소요)
```bash
# 로컬 PC 터미널에서 실행
nslookup tonicloud.org

# 또는
ping tonicloud.org

# Elastic IP가 반환되면 성공!
```

### 5-6. HTTP 접속 테스트
```
브라우저에서:
http://tonicloud.org

✓ 웹사이트가 표시되면 성공!
⚠️ 아직 HTTPS는 작동 안 함 (다음 단계에서 설정)
```

**🎯 결과**: 도메인으로 웹사이트 접속 가능

---

## 📍 Step 6: SSL 인증서 설치

### 6-1. EC2 서버에 SSH 재접속 (필요시)
```bash
ssh -i coffeeland-key.pem ubuntu@YOUR_ELASTIC_IP
cd ~/CoffeeLand
```

### 6-2. Certbot 설치
```bash
# 시스템 업데이트
sudo apt-get update

# Certbot 설치
sudo apt-get install certbot python3-certbot-nginx -y
```

### 6-3. SSL 인증서 발급
```bash
sudo certbot --nginx -d tonicloud.org -d www.tonicloud.org
```

### 6-4. Certbot 프롬프트 응답
```
1. "Enter email address (used for urgent renewal and security notices)"
   → 본인 이메일 입력

2. "Please read the Terms of Service"
   → A (Agree) 입력

3. "Would you be willing to share your email address..."
   → N (No) 입력

4. "Please choose whether or not to redirect HTTP traffic to HTTPS"
   → 2 (Redirect) 선택 - HTTP를 HTTPS로 자동 리다이렉트

5. "Congratulations!" 메시지 확인
```

### 6-5. 자동 갱신 테스트
```bash
# 갱신 테스트 (실제로 갱신하지는 않음)
sudo certbot renew --dry-run

# 성공 메시지가 표시되면 OK
```

### 6-6. 방화벽 설정
```bash
# UFW 방화벽 설정
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# 상태 확인
sudo ufw status
```

**🎯 결과**: HTTPS가 활성화됨

---

## 📍 Step 7: 최종 테스트 및 확인

### 7-1. HTTPS 접속 테스트
```
브라우저에서:
https://tonicloud.org

✅ 자물쇠 아이콘이 표시되면 성공!
✅ 인증서 정보: Let's Encrypt
```

### 7-2. 웹사이트 기능 테스트

#### 📌 파일 업로드 테스트
```
1. 좌측 사이드바에서 "파일 선택" 클릭
2. coffeeland.owl 파일 선택
3. "✅ 업로드 성공!" 메시지 확인
4. 자동으로 그래프 뷰로 전환되는지 확인
```

#### 📌 그래프 시각화 테스트
```
1. 사이드바에서 "그래프 시각화" 클릭
2. 노드-엣지 다이어그램이 표시되는지 확인
3. 레이아웃 변경 테스트 (Force-Directed, Circle 등)
4. 노드 클릭 시 정보 패널 표시 확인
5. 확대/축소 버튼 작동 확인
```

#### 📌 계층 구조 테스트
```
1. 사이드바에서 "계층 구조" 클릭
2. 클래스 트리가 표시되는지 확인
3. "모두 펼치기" / "모두 접기" 버튼 작동 확인
```

#### 📌 SPARQL 쿼리 테스트
```
1. 사이드바에서 "SPARQL 쿼리" 클릭
2. "모든 트리플" 예제 버튼 클릭
3. "쿼리 실행" 버튼 클릭
4. 결과 테이블이 표시되는지 확인
5. 커스텀 쿼리 작성 및 실행 테스트
```

#### 📌 RDF 내용 테스트
```
1. 사이드바에서 "RDF 내용" 클릭
2. 포맷 선택 (Turtle) 후 "변환" 클릭
3. RDF 내용이 표시되는지 확인
4. "복사" 버튼 작동 확인
5. "다운로드" 버튼 작동 확인
```

#### 📌 통계 정보 테스트
```
1. 사이드바에서 "통계 정보" 클릭
2. 클래스, 속성, 인스턴스 개수 확인
3. 네임스페이스 목록 표시 확인
4. 클래스 목록 표시 확인
```

### 7-3. 모바일 테스트 (선택사항)
```
스마트폰 브라우저에서:
1. https://tonicloud.org 접속
2. 햄버거 메뉴(☰) 클릭으로 사이드바 토글 확인
3. 기본 기능 작동 확인
```

### 7-4. 성능 확인
```bash
# EC2 서버에서
# CPU/메모리 사용량 확인
htop

# 프로세스 상태
pm2 monit

# Nginx 로그
sudo tail -f /var/log/nginx/access.log
```

### 7-5. SSL 등급 확인 (선택사항)
```
1. https://www.ssllabs.com/ssltest/ 접속
2. "tonicloud.org" 입력
3. "Submit" 클릭
4. A 또는 A+ 등급 확인
```

**🎯 결과**: 모든 기능 정상 작동 확인!

---

## 🎉 완료 체크리스트

### ✅ 준비 단계
- [ ] Protege에서 coffeeland.owl 파일 export 완료
- [ ] AWS 계정 로그인 완료

### ✅ AWS 인프라
- [ ] EC2 인스턴스 생성 완료
- [ ] Elastic IP 할당 완료
- [ ] 보안 그룹 설정 완료 (22, 80, 443 포트)

### ✅ 애플리케이션 배포
- [ ] GitHub에서 코드 클론 완료
- [ ] 자동 배포 스크립트 실행 완료
- [ ] Node.js 앱 실행 확인 (pm2 status)
- [ ] Nginx 실행 확인

### ✅ 도메인 & SSL
- [ ] Route 53 A 레코드 생성 완료
- [ ] DNS 전파 확인 완료
- [ ] SSL 인증서 설치 완료
- [ ] HTTPS 접속 확인

### ✅ 기능 테스트
- [ ] 파일 업로드 작동
- [ ] 그래프 시각화 작동
- [ ] 계층 구조 작동
- [ ] SPARQL 쿼리 작동
- [ ] RDF 내용 표시 작동
- [ ] 통계 정보 작동

---

## 🆘 문제 해결

### ❌ 문제: SSH 접속 안 됨
```bash
# 해결책 1: 키 파일 권한 확인
chmod 400 coffeeland-key.pem

# 해결책 2: 보안 그룹 확인
# EC2 > 보안 그룹 > 인바운드 규칙에 SSH(22) 있는지 확인

# 해결책 3: Elastic IP 확인
# 올바른 IP 주소를 사용하고 있는지 확인
```

### ❌ 문제: 웹사이트가 안 열림
```bash
# EC2 서버에서 확인
pm2 status                    # 앱이 running 상태인지
sudo systemctl status nginx   # Nginx가 active 상태인지
sudo netstat -tuln | grep :80 # 80 포트 리스닝 중인지

# 로그 확인
pm2 logs ontology-viewer
sudo tail -f /var/log/nginx/error.log
```

### ❌ 문제: DNS가 안 됨
```bash
# 5-15분 기다린 후 다시 확인
nslookup tonicloud.org

# Route 53 설정 재확인
# A 레코드 값이 Elastic IP와 일치하는지 확인
```

### ❌ 문제: SSL 설치 실패
```bash
# 확인사항:
# 1. DNS가 먼저 설정되어 있어야 함
# 2. 도메인이 EC2 IP를 가리켜야 함

# 재시도
sudo certbot --nginx -d tonicloud.org -d www.tonicloud.org --force-renewal
```

### ❌ 문제: 파일 업로드 안 됨
```bash
# uploads 디렉토리 권한 확인
cd ~/CoffeeLand
chmod 755 uploads

# Nginx 업로드 크기 제한 확인
sudo nano /etc/nginx/sites-available/ontology
# client_max_body_size 50M; 있는지 확인

sudo systemctl restart nginx
```

---

## 📞 추가 지원

### 📚 문서
- README.md
- AWS_DEPLOYMENT.md (상세 가이드)
- DEPLOYMENT_GUIDE.md (요약 가이드)

### 🐛 문제 보고
- GitHub Issues: https://github.com/doogiesdj/CoffeeLand/issues

### 💬 명령어 모음
```bash
# 서버 상태 확인
pm2 status
pm2 logs ontology-viewer
sudo systemctl status nginx

# 서버 재시작
pm2 restart ontology-viewer
sudo systemctl restart nginx

# 로그 확인
pm2 logs --lines 100
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 업데이트 배포
cd ~/CoffeeLand
git pull origin main
npm install
pm2 reload ontology-viewer
```

---

## 🎯 최종 목표

```
✅ https://tonicloud.org 접속 가능
✅ 팔란티어 스타일 사이드바 UI
✅ 온톨로지 파일 업로드 및 시각화
✅ 모든 기능 정상 작동
✅ HTTPS 보안 연결
✅ 빠른 로딩 속도
```

---

## 💪 시작하세요!

**Step 1부터 시작하시면 됩니다.**

각 단계는 순차적으로 진행하시고, 문제가 발생하면 "문제 해결" 섹션을 참고하세요.

**예상 소요 시간**: 약 1시간
**난이도**: 중급
**성공률**: 높음 (자동 스크립트 사용)

화이팅! 🚀
