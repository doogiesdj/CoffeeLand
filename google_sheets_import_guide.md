# 🟢 Google Sheets로 Coffee Farm 데이터 Import 하기

## 📥 방법 1: CSV 파일 다운로드 후 Google Sheets에 Import

### Step 1: CSV 파일 다운로드
아래 3개의 CSV 파일을 다운로드하세요:

1. **coffee_farms_data.csv** - 24개 농장 데이터
2. **farm_object_properties.csv** - 8개 Object Properties
3. **farm_data_properties.csv** - 20개 Data Properties

### Step 2: Google Sheets에서 Import

#### 각 CSV 파일을 별도 시트로 import:

1. Google Sheets 새 문서 생성: https://sheets.google.com
2. 파일 → 가져오기 (Import)
3. 업로드 탭 → "찾아보기" 클릭
4. **coffee_farms_data.csv** 선택
5. Import 옵션:
   - Import 위치: "새 스프레드시트 만들기" 또는 "새 시트 삽입"
   - 구분 기호 유형: 쉼표
   - 텍스트를 숫자 및 날짜로 변환: ✅ 체크
6. "데이터 가져오기" 클릭

#### 추가 시트 import:
7. 하단의 "+" 버튼으로 새 시트 추가
8. 파일 → 가져오기 → **farm_object_properties.csv** 선택
9. Import 위치: "현재 스프레드시트에 새 시트 삽입"
10. 동일하게 **farm_data_properties.csv**도 import

### Step 3: 시트 이름 변경
- Sheet1 → "Farms Data (24개)"
- Sheet2 → "Object Properties (8개)"
- Sheet3 → "Data Properties (20개)"

---

## 🔗 방법 2: 온라인에서 직접 열기 (추천)

아래 링크에서 CSV 파일을 바로 다운로드하세요:

### 다운로드 링크:
- **Farms Data**: `/coffee_farms_data.csv`
- **Object Properties**: `/farm_object_properties.csv`
- **Data Properties**: `/farm_data_properties.csv`

---

## 📊 Google Sheets 템플릿 구조

### Sheet 1: Farms Data (24개 농장)

| Country | Farm_Name | Region | Coffee_Variety | Altitude_Range_meters | Processing_Method | Certifications | Cooperative_Membership | Farm_Size | Annual_Production_bags |
|---------|-----------|--------|----------------|----------------------|-------------------|----------------|------------------------|-----------|------------------------|
| Ethiopia | Yirgacheffe_Kochere_Farm | Yirgacheffe | Arabica_Heirloom | 1800-2200 | Washed | Fair Trade, Organic | Cooperative_Yirgacheffe | Medium | 150 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

### Sheet 2: Object Properties (8개)

| Property_Name | Domain | Range | Description_Korean | Example |
|---------------|--------|-------|-------------------|---------|
| cultivates | Farm | CoffeeVariety | Farm에서 재배하는 커피 품종 | 예: Yirgacheffe_Kochere_Farm cultivates Arabica_Heirloom |
| ... | ... | ... | ... | ... |

### Sheet 3: Data Properties (20개)

| Property_Name | Data_Type | Description_Korean | Example_Value |
|---------------|-----------|-------------------|---------------|
| farmName | string | 농장 이름 | Yirgacheffe_Kochere_Farm |
| ... | ... | ... | ... |

---

## 🎨 Google Sheets 서식 권장사항

### 헤더 행 서식:
- 배경색: 파란색 (#1e3a8a)
- 글자색: 흰색
- 굵게: ✅
- 정렬: 가운데
- 고정: ✅ (View → Freeze → 1 row)

### 데이터 행 서식:
- 자동 필터 추가: Data → Create a filter
- 교대 색상: Format → Alternating colors
- 텍스트 줄바꿈: Format → Text wrapping → Wrap

### 조건부 서식 (Farm_Size):
1. Farm_Size 열 선택 (I열)
2. Format → Conditional formatting
3. 규칙:
   - "Small" → 노란색 배경 (#fef3c7)
   - "Medium" → 파란색 배경 (#dbeafe)
   - "Large" → 녹색 배경 (#d1fae5)

---

## 💡 Protégé 통합 팁

Google Sheets에서 데이터를 정리한 후:

1. **CSV Export**: 파일 → 다운로드 → 쉼표로 구분된 값(.csv)
2. **Protégé Cellfie 플러그인** 사용:
   - File → Check for plugins... → Cellfie → Install
   - Tools → Cellfie → Load CSV
   - Mapping 설정 후 Bulk Import
3. **수동 추가**: 위 CSV 데이터를 참고하여 Individuals 탭에서 하나씩 추가

---

## 📱 웹에서 확인

CSV 파일들은 다음 위치에서 다운로드 가능합니다:

- 웹 브라우저로 접속: `https://5180-iq167hrnwb18xvsq7sd61-de59bda9.sandbox.novita.ai/`
- 파일 경로:
  - `/coffee_farms_data.csv`
  - `/farm_object_properties.csv`
  - `/farm_data_properties.csv`

---

## ✅ 완료 체크리스트

- [ ] CSV 파일 3개 다운로드
- [ ] Google Sheets 새 문서 생성
- [ ] CSV 파일들을 각각 새 시트로 import
- [ ] 시트 이름 변경
- [ ] 헤더 행 서식 적용 (파란색 배경, 굵게, 고정)
- [ ] 자동 필터 추가
- [ ] 조건부 서식 적용 (Farm_Size)
- [ ] Google Sheets 공유 설정 (필요시)

---

🎉 **이제 Google Sheets에서 Coffee Farm 데이터를 관리할 수 있습니다!**

추가 도움이 필요하시면 말씀해주세요! 😊
