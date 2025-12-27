# AWS Amplify 배포 가이드

## 사전 준비사항

- AWS 계정 ID: 452897072617
- 도메인: tonicloud.org
- GitHub 저장소에 코드 푸시 완료

## 1단계: AWS Amplify 콘솔 접속

1. AWS Management Console에 로그인
2. 서비스 검색에서 "AWS Amplify" 검색
3. AWS Amplify 콘솔 열기

## 2단계: 새 앱 생성

1. **"New app" > "Host web app"** 클릭
2. GitHub 선택
3. GitHub 계정 연결 (처음인 경우)
4. 저장소 선택
5. 브랜치 선택 (main 또는 master)
6. **"Next"** 클릭

## 3단계: 빌드 설정 구성

Amplify가 자동으로 `amplify.yml` 파일을 감지합니다.

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd coffeeland-react
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: coffeeland-react/dist
    files:
      - '**/*'
  cache:
    paths:
      - coffeeland-react/node_modules/**/*
```

### 빌드 설정 확인:
- **App name**: coffeeland (원하는 이름)
- **Environment**: production
- **Build command**: `npm run build`
- **Build output directory**: `coffeeland-react/dist`

**"Next"** 클릭

## 4단계: 검토 및 배포

1. 모든 설정 확인
2. **"Save and deploy"** 클릭
3. 첫 배포가 시작됩니다 (약 5-10분 소요)

### 배포 단계:
1. ✅ Provision - 리소스 프로비저닝
2. ✅ Build - 애플리케이션 빌드
3. ✅ Deploy - CDN에 배포
4. ✅ Verify - 배포 확인

## 5단계: 커스텀 도메인 설정 (tonicloud.org)

### Route 53 사용 (권장)

1. Amplify 콘솔에서 배포된 앱 선택
2. 왼쪽 메뉴에서 **"Domain management"** 클릭
3. **"Add domain"** 클릭
4. 도메인 입력: `tonicloud.org`
5. **"Configure domain"** 클릭

### DNS 레코드 설정:

Amplify가 자동으로 제공하는 DNS 레코드를 Route 53에 추가:

```
Type: CNAME
Name: www
Value: [Amplify가 제공하는 URL]

Type: A
Name: @
Value: [Amplify가 제공하는 IP]
```

### 외부 DNS 제공업체 사용

Route 53을 사용하지 않는 경우:

1. Amplify 콘솔에서 제공하는 DNS 레코드 확인
2. 도메인 등록 업체(GoDaddy, Namecheap 등)의 DNS 관리 페이지로 이동
3. 다음 레코드 추가:

```
Type: CNAME
Host: www
Value: [your-amplify-app].amplifyapp.com

Type: ANAME/ALIAS (또는 A 레코드)
Host: @
Value: [Amplify 제공 주소]
```

4. DNS 전파 대기 (최대 48시간, 보통 몇 시간)

### SSL 인증서

- Amplify가 자동으로 SSL 인증서를 프로비저닝합니다
- Let's Encrypt를 사용하여 무료 SSL 제공
- 인증서 갱신도 자동으로 처리됩니다

## 6단계: 환경 변수 설정 (선택사항)

현재 프로젝트는 환경 변수가 필요 없지만, 필요한 경우:

1. Amplify 콘솔에서 앱 선택
2. **"Environment variables"** 클릭
3. **"Manage variables"** 클릭
4. 변수 추가:
   - Key: `VITE_API_URL`
   - Value: `https://api.example.com`
5. **"Save"** 클릭

## 7단계: 자동 배포 확인

GitHub와 연결되어 있어 자동 배포가 활성화됩니다:

1. 코드를 GitHub에 푸시
2. Amplify가 자동으로 빌드 시작
3. 빌드 완료 후 자동 배포
4. 배포 상태를 Amplify 콘솔에서 확인

## 8단계: 배포 모니터링

### 빌드 로그 확인:
1. Amplify 콘솔에서 앱 선택
2. 최근 빌드 선택
3. 각 단계별 로그 확인

### 일반적인 오류 해결:

#### 빌드 실패
```bash
# package.json 확인
# dependencies가 올바른지 확인
cd coffeeland-react
npm install
npm run build
```

#### 경로 오류
```yaml
# amplify.yml의 baseDirectory 확인
baseDirectory: coffeeland-react/dist
```

#### 메모리 부족
```yaml
# amplify.yml에 메모리 설정 추가
frontend:
  phases:
    build:
      commands:
        - export NODE_OPTIONS="--max-old-space-size=4096"
        - npm run build
```

## 9단계: 성능 최적화

### 캐싱 설정:
1. Amplify 콘솔에서 **"Rewrites and redirects"** 클릭
2. 다음 규칙 추가:

```
Source: /<*>
Target: /index.html
Type: 200 (Rewrite)
```

### Gzip 압축:
Amplify가 자동으로 처리하지만, 확인:
1. **"General"** 설정
2. **"Compression"** 활성화 확인

## 10단계: 도메인 확인

배포 완료 후:

1. `https://tonicloud.org` 접속
2. `https://www.tonicloud.org` 접속
3. SSL 인증서 확인 (자물쇠 아이콘)
4. 모든 페이지 정상 작동 확인

## 추가 기능

### Branch 배포:
개발/스테이징 환경을 위한 별도 브랜치 배포:

1. Amplify 콘솔에서 **"Branch"** 탭
2. **"Connect branch"** 클릭
3. develop 또는 staging 브랜치 선택
4. 각 브랜치마다 별도 URL 생성

### 액세스 제어:
특정 브랜치에 암호 보호:

1. Branch 설정에서 **"Access control"** 클릭
2. **"Manage access"** 클릭
3. 사용자명과 비밀번호 설정

### 알림 설정:
배포 상태 알림:

1. **"Notifications"** 탭
2. **"Add notification"** 클릭
3. 이메일 또는 SNS 토픽 설정

## 비용 예상

AWS Amplify Hosting 비용:
- 빌드 시간: $0.01/분
- 호스팅: $0.15/GB (저장)
- 데이터 전송: $0.15/GB

예상 월 비용: $5-10 (소규모 트래픽)

## 문제 해결

### 도메인이 연결되지 않음:
1. DNS 레코드 확인
2. DNS 전파 대기 (24-48시간)
3. `nslookup tonicloud.org` 명령으로 확인

### 빌드가 실패함:
1. 로컬에서 `npm run build` 테스트
2. amplify.yml 경로 확인
3. 빌드 로그 상세 확인

### 페이지가 404 오류:
1. Rewrites 설정 확인
2. React Router 설정 확인
3. baseDirectory 경로 확인

## 지원 및 문서

- [AWS Amplify 공식 문서](https://docs.aws.amazon.com/amplify/)
- [Amplify Hosting 가이드](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [커스텀 도메인 설정](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html)

---

## 요약 체크리스트

- [ ] AWS Amplify 콘솔에서 새 앱 생성
- [ ] GitHub 저장소 연결
- [ ] amplify.yml 구성 확인
- [ ] 첫 배포 완료
- [ ] 커스텀 도메인 추가 (tonicloud.org)
- [ ] DNS 레코드 설정
- [ ] SSL 인증서 프로비저닝 확인
- [ ] 자동 배포 테스트
- [ ] 웹사이트 접속 확인
- [ ] 모든 기능 테스트

배포 완료 후 `https://tonicloud.org`에서 CoffeeLand 애플리케이션을 확인할 수 있습니다! ☕
