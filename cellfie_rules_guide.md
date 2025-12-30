# 📋 Protégé Cellfie Rules - Coffee Farm Data Import Guide

## 🔧 Cellfie 플러그인이란?

**Cellfie**는 Protégé에서 CSV/Excel 데이터를 OWL 온톨로지로 변환하는 플러그인입니다.
- **DSL (Domain Specific Language)** 기반의 매핑 규칙 사용
- Excel/CSV의 각 행을 OWL Individual로 변환
- Object Properties와 Data Properties 자동 생성

---

## 📊 Coffee_Farms_Data.csv 구조

```csv
Country,Farm_Name,Region,Coffee_Variety,Altitude_Range_meters,Processing_Method,Certifications,Cooperative_Membership,Farm_Size,Annual_Production_bags
Ethiopia,Yirgacheffe_Kochere_Farm,Yirgacheffe,Arabica_Heirloom,1800-2200,Washed,"Fair Trade, Organic",Cooperative_Yirgacheffe,Medium,150
```

**열 (Column) 정보:**
- A: Country
- B: Farm_Name
- C: Region
- D: Coffee_Variety
- E: Altitude_Range_meters
- F: Processing_Method
- G: Certifications
- H: Cooperative_Membership
- I: Farm_Size
- J: Annual_Production_bags

---

## 🎯 Cellfie Rule 기본 구조

### Rule 구문:
```
Individual: <Individual_Expression>
    Types: <Class_Expression>
    Facts: <Property_Expression>
```

### 표현식 종류:
1. **Individual Expression**: 생성할 Individual의 이름
2. **Class Expression**: Individual이 속할 클래스
3. **Property Expression**: Object Property 또는 Data Property 관계

---

## 📝 Coffee Farm Data를 위한 Complete Cellfie Rules

### Rule 1: Farm Individual 생성

```cellfie
Individual: @B
    Types: Farm
    Facts: 
        isLocatedIn @A,
        hasRegion @C,
        cultivates @D,
        uses @F,
        memberOf @H,
        farmSize @I,
        annualProduction @J(xsd:integer),
        altitudeRange @E
```

#### 설명:
- `@B`: B열(Farm_Name)의 값을 Individual 이름으로 사용
  - 예: `Yirgacheffe_Kochere_Farm`
- `Types: Farm`: 모든 Individual을 Farm 클래스의 인스턴스로 생성
- `isLocatedIn @A`: A열(Country)와 Object Property 관계 생성
- `farmSize @I`: I열(Farm_Size) 값을 Data Property로 저장
- `annualProduction @J(xsd:integer)`: J열 값을 정수형으로 변환

---

### Rule 2: Country Individual 자동 생성 (참조)

```cellfie
Individual: @A
    Types: Country
```

#### 설명:
- A열의 각 고유 값(Ethiopia, Colombia, Brazil 등)을 Country Individual로 생성
- 이미 Country Individual이 존재하면 재사용

---

### Rule 3: CoffeeVariety Individual 자동 생성

```cellfie
Individual: @D
    Types: CoffeeVariety
```

#### 설명:
- D열의 각 품종(Arabica_Heirloom, Caturra, Robusta 등)을 CoffeeVariety Individual로 생성

---

### Rule 4: Cooperative Individual 자동 생성

```cellfie
Individual: @H
    Types: Cooperative
```

#### 설명:
- H열의 협동조합 이름을 Cooperative Individual로 생성

---

### Rule 5: ProcessingMethod Individual 자동 생성

```cellfie
Individual: @F
    Types: ProcessingMethod
```

#### 설명:
- F열의 가공 방식(Washed, Natural, Honey 등)을 ProcessingMethod Individual로 생성

---

## 🔥 완전한 Cellfie Rule Set (복사해서 사용)

```cellfie
# Rule 1: Create Farm Individuals with all properties
Individual: @B
    Types: Farm
    Facts: 
        isLocatedIn @A,
        hasRegion @C,
        cultivates @D,
        uses @F,
        memberOf @H,
        farmSize @I(xsd:string),
        annualProduction @J(xsd:integer),
        altitudeRange @E(xsd:string),
        processingMethod @F(xsd:string)

# Rule 2: Create Country Individuals (if not exists)
Individual: @A
    Types: Country

# Rule 3: Create CoffeeVariety Individuals
Individual: @D
    Types: CoffeeVariety

# Rule 4: Create Cooperative Individuals
Individual: @H
    Types: Cooperative

# Rule 5: Create ProcessingMethod Individuals
Individual: @F
    Types: ProcessingMethod
```

---

## 📐 고급 Rule: Altitude를 Min/Max로 분리

### Altitude_Range가 "1800-2200" 형식일 때:

```cellfie
Individual: @B
    Types: Farm
    Facts: 
        isLocatedIn @A,
        altitudeMin SPLIT(@E, "-", 0)(xsd:integer),
        altitudeMax SPLIT(@E, "-", 1)(xsd:integer)
```

#### SPLIT 함수:
- `SPLIT(@E, "-", 0)`: E열 값을 "-"로 분리하여 첫 번째 값 (1800)
- `SPLIT(@E, "-", 1)`: E열 값을 "-"로 분리하여 두 번째 값 (2200)

---

## 🎨 조건부 Rule: Certification 처리

### Certifications가 "Fair Trade, Organic" 형식일 때:

```cellfie
Individual: @B
    Types: Farm
    Facts: 
        hasCertification SPLIT(@G, ",", *),
        hasOrganicCertification IF(CONTAINS(@G, "Organic"), "true", "false")(xsd:boolean),
        hasFairTradeCertification IF(CONTAINS(@G, "Fair Trade"), "true", "false")(xsd:boolean)
```

#### 함수 설명:
- `SPLIT(@G, ",", *)`: G열을 쉼표로 분리하여 모든 값을 배열로 처리
- `CONTAINS(@G, "Organic")`: G열에 "Organic"이 포함되어 있는지 확인
- `IF(조건, true_값, false_값)`: 조건부 처리

---

## 🚀 Protégé에서 Cellfie 사용 방법

### Step 1: Cellfie 플러그인 설치
1. Protégé 실행
2. **File** → **Check for plugins...**
3. **Available** 탭 → **Cellfie** 검색
4. **Install** → Protégé 재시작

### Step 2: CSV 파일 준비
1. `coffee_farms_data.csv` 파일 다운로드
2. Excel이나 텍스트 에디터로 열어서 데이터 확인

### Step 3: Cellfie 실행
1. Protégé에서 `coffeeland.rdf` 열기
2. **Tools** → **Cellfie**
3. Cellfie 창이 열림

### Step 4: CSV 파일 로드
1. Cellfie 창에서 **Load CSV** 버튼 클릭
2. `coffee_farms_data.csv` 선택
3. 미리보기 확인

### Step 5: Rule 작성
1. **Rules** 탭 선택
2. 위의 **Complete Cellfie Rule Set** 복사
3. Rule Editor에 붙여넣기

### Step 6: Rule 검증
1. **Validate** 버튼 클릭
2. 에러가 있으면 수정
3. 녹색 체크마크 확인

### Step 7: Individuals 생성
1. **Generate Individuals** 버튼 클릭
2. 진행 상황 확인
3. 완료 메시지 확인

### Step 8: 결과 확인
1. Protégé의 **Individuals** 탭으로 이동
2. Farm 클래스 선택
3. 24개의 Farm Individual 확인
4. 각 Individual의 Properties 확인

---

## 🔍 Rule 문법 상세 설명

### 1. Column 참조
```
@A, @B, @C, ...  : 열 참조 (A=1번째, B=2번째, ...)
@A(xsd:integer)  : 정수형으로 변환
@A(xsd:string)   : 문자열 (기본값)
@A(xsd:boolean)  : 불린
@A(xsd:float)    : 실수
```

### 2. 함수
```
SPLIT(@E, "-", 0)           : 문자열 분리
CONCAT(@A, "_", @B)         : 문자열 결합
IF(조건, true, false)       : 조건부
CONTAINS(@G, "Organic")     : 포함 여부
REPLACE(@A, "_", " ")       : 문자열 치환
UPPER(@A), LOWER(@A)        : 대소문자 변환
```

### 3. 관계 (Facts)
```
Object Property:
    isLocatedIn @A          : Farm → Country
    cultivates @D           : Farm → CoffeeVariety

Data Property:
    farmSize @I(xsd:string) : Farm → "Medium"
    annualProduction @J(xsd:integer) : Farm → 150
```

---

## 💡 실전 예제: 첫 번째 행 처리

### CSV 데이터:
```
Ethiopia,Yirgacheffe_Kochere_Farm,Yirgacheffe,Arabica_Heirloom,1800-2200,Washed,"Fair Trade, Organic",Cooperative_Yirgacheffe,Medium,150
```

### 생성되는 OWL:
```turtle
:Yirgacheffe_Kochere_Farm a :Farm ;
    :isLocatedIn :Ethiopia ;
    :hasRegion "Yirgacheffe"^^xsd:string ;
    :cultivates :Arabica_Heirloom ;
    :uses :Washed ;
    :memberOf :Cooperative_Yirgacheffe ;
    :farmSize "Medium"^^xsd:string ;
    :annualProduction 150 ;
    :altitudeRange "1800-2200"^^xsd:string .

:Ethiopia a :Country .
:Arabica_Heirloom a :CoffeeVariety .
:Washed a :ProcessingMethod .
:Cooperative_Yirgacheffe a :Cooperative .
```

---

## ⚠️ 주의사항

### 1. 공백 처리
- CSV에서 `"Fair Trade, Organic"` 같이 쉼표가 포함된 경우 큰따옴표로 감싸기
- Cellfie는 자동으로 처리하지만, 확인 필요

### 2. 특수문자
- `_` (언더스코어) 사용 권장
- `-` (하이픈)은 일부 경우 문제 발생 가능
- 공백은 `_`로 치환

### 3. 중복 Individual
- 같은 이름의 Individual이 이미 존재하면 **업데이트**됨
- 새로운 관계가 추가됨

### 4. 데이터 타입
- 숫자는 반드시 `(xsd:integer)` 또는 `(xsd:float)` 지정
- 불린은 `"true"` 또는 `"false"` 문자열

---

## 🎯 최종 권장 Rule (복사용)

```cellfie
# Main Rule: Create Farm Individuals
Individual: @B
    Types: Farm
    Facts: 
        isLocatedIn @A,
        cultivates @D,
        uses @F,
        memberOf @H,
        farmSize @I(xsd:string),
        annualProduction @J(xsd:integer),
        altitudeRange @E(xsd:string)

# Supporting Rules
Individual: @A
    Types: Country

Individual: @D
    Types: CoffeeVariety

Individual: @F
    Types: ProcessingMethod

Individual: @H
    Types: Cooperative
```

---

## 📹 단계별 스크린샷 가이드

### 1. Cellfie 실행
```
Tools → Cellfie
```

### 2. CSV 로드
```
Load CSV → coffee_farms_data.csv 선택
```

### 3. Rule 입력
```
Rules 탭 → 위의 Rule 복사 붙여넣기
```

### 4. 검증
```
Validate 버튼 → ✓ 녹색 확인
```

### 5. 생성
```
Generate Individuals → 완료 대기
```

### 6. 확인
```
Individuals 탭 → Farm 선택 → 24개 확인
```

---

## ✅ 성공 확인 방법

### 생성된 Individual 확인:
1. **Classes** 탭 → **Farm** 클래스 선택
2. **Individuals by class** 탭 확인
3. 24개의 Farm Individual이 보여야 함:
   - Yirgacheffe_Kochere_Farm
   - Sidamo_Guji_Farm
   - Harrar_Estate
   - ... (총 24개)

### Object Properties 확인:
1. 특정 Farm Individual 선택 (예: Yirgacheffe_Kochere_Farm)
2. **Object property assertions** 탭 확인
3. 다음 관계들이 보여야 함:
   - `isLocatedIn` → Ethiopia
   - `cultivates` → Arabica_Heirloom
   - `memberOf` → Cooperative_Yirgacheffe

### Data Properties 확인:
1. **Data property assertions** 탭 확인
2. 다음 데이터들이 보여야 함:
   - `farmSize` → "Medium"
   - `annualProduction` → 150
   - `altitudeRange` → "1800-2200"

---

## 🔧 트러블슈팅

### 문제 1: "Column not found" 에러
**원인**: CSV의 열 번호가 맞지 않음
**해결**: CSV 파일의 열 순서 확인, @A, @B, ... 순서 맞추기

### 문제 2: Data type mismatch
**원인**: 숫자 열에 문자 포함
**해결**: CSV에서 해당 열의 모든 값이 숫자인지 확인

### 문제 3: Property not found
**원인**: RDF에 해당 Property가 정의되지 않음
**해결**: Protégé에서 먼저 Object/Data Property 정의

### 문제 4: Individual 중복
**원인**: 같은 이름의 Individual이 이미 존재
**해결**: 정상 동작 (기존 Individual에 새 관계 추가됨)

---

🎉 **이제 Cellfie Rules를 사용하여 CSV 데이터를 RDF로 변환할 수 있습니다!**

추가 질문이나 특정 Rule에 대한 설명이 필요하시면 말씀해주세요! 😊
