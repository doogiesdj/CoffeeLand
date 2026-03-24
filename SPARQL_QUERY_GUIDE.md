# Coffeeland 온톨로지 SPARQL 쿼리 가이드

## 📋 목차
1. [온톨로지 개요](#온톨로지-개요)
2. [SPARQL 기본 문법](#sparql-기본-문법)
3. [네임스페이스 정의](#네임스페이스-정의)
4. [기본 쿼리 예제](#기본-쿼리-예제)
5. [고급 쿼리 예제](#고급-쿼리-예제)
6. [실행 방법](#실행-방법)

---

## 온톨로지 개요

### 파일 정보
- **파일명**: `coffeeland_final_v2.rdf`
- **형식**: RDF/XML
- **크기**: 485KB
- **베이스 URI**: `http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#`

### 주요 클래스들
```
- AgriEvent        (농업 이벤트)
- Bakery           (베이커리)
- BeverageMenu     (음료 메뉴)
- Broker           (중개인)
- CoffeeBrand      (커피 브랜드)
- CoffeeChain      (커피 체인)
- CoffeeShop       (커피숍)
- CoffeeVariety    (커피 품종)
- Consumer         (소비자)
- Cooperative      (협동조합)
- Country          (국가)
- Farm             (농장)
- Farmer           (농부)
- Harvest          (수확)
- Location         (위치)
- Port             (항구)
- ProcessingMethod (가공 방법)
- Product          (제품)
- Retailer         (소매업자)
- Roaster          (로스터리)
- Warehouse        (창고)
```

### 주요 속성들
```
Data Properties (데이터 속성):
- hasAltitudeRange    (고도 범위)
- hasAnnualProduction (연간 생산량)
- hasCapacity         (용량)
- hasCertification    (인증)
- hasCity             (도시)
- hasCountry          (국가)
- hasFarmSize         (농장 크기)
- hasLatitude         (위도)
- hasLongitude        (경도)
- hasName             (이름)

Object Properties (객체 속성):
- cultivates          (재배하다)
- handlesProduct      (제품 처리)
- locatedIn           (위치하다)
- suppliesTo          (공급하다)
- usesProcessingMethod (가공 방법 사용)
```

---

## SPARQL 기본 문법

### SPARQL 쿼리 구조
```sparql
PREFIX prefix: <URI>          # 네임스페이스 정의

SELECT ?variable              # 검색할 변수
WHERE {                       # 조건절
    ?subject ?predicate ?object .
    FILTER (조건)              # 필터링 (선택사항)
}
LIMIT 결과수                   # 결과 제한 (선택사항)
```

### 기본 패턴 매칭
```sparql
# 트리플 패턴: 주어 - 술어 - 목적어
?subject rdf:type owl:Class .
?subject rdfs:label ?label .
?subject ex:hasProperty ?value .
```

---

## 네임스페이스 정의

모든 쿼리 시작 부분에 다음 PREFIX를 포함하세요:

```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>
```

---

## 기본 쿼리 예제

### 1. 모든 클래스 조회
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?class ?label
WHERE {
    ?class rdf:type owl:Class .
    OPTIONAL { ?class rdfs:label ?label }
}
ORDER BY ?class
LIMIT 100
```

### 2. 특정 클래스의 모든 인스턴스 조회
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

# 모든 커피 브랜드 조회
SELECT ?brand ?name
WHERE {
    ?brand rdf:type :CoffeeBrand .
    OPTIONAL { ?brand :hasName ?name }
}
LIMIT 50
```

### 3. 모든 농장(Farm) 조회
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?farm ?name ?size ?altitude
WHERE {
    ?farm rdf:type :Farm .
    OPTIONAL { ?farm :hasName ?name }
    OPTIONAL { ?farm :hasFarmSize ?size }
    OPTIONAL { ?farm :hasAltitudeRange ?altitude }
}
LIMIT 50
```

### 4. 특정 국가의 위치 조회
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?location ?country
WHERE {
    ?location :hasCountry ?country .
    FILTER(CONTAINS(LCASE(?country), "korea"))
}
LIMIT 50
```

### 5. 모든 커피 체인 조회
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?chain ?name
WHERE {
    ?chain rdf:type :CoffeeChain .
    OPTIONAL { ?chain :hasName ?name }
}
LIMIT 50
```

### 6. 모든 속성과 값 조회
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?subject ?predicate ?object
WHERE {
    ?subject ?predicate ?object .
}
LIMIT 100
```

---

## 고급 쿼리 예제

### 7. 특정 인증을 가진 농장 조회
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?farm ?certification
WHERE {
    ?farm rdf:type :Farm .
    ?farm :hasCertification ?certification .
    FILTER(CONTAINS(LCASE(?certification), "organic"))
}
LIMIT 50
```

### 8. 공급망 관계 추적
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

# 농장에서 로스터리까지의 공급망
SELECT ?farm ?product ?roaster
WHERE {
    ?farm rdf:type :Farm .
    ?farm :suppliesTo ?product .
    ?product :suppliesTo ?roaster .
    ?roaster rdf:type :Roaster .
}
LIMIT 50
```

### 9. 위치 기반 쿼리 (위도/경도)
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?location ?lat ?lon
WHERE {
    ?location :hasLatitude ?lat .
    ?location :hasLongitude ?lon .
    FILTER(?lat > 30 && ?lat < 40)
}
LIMIT 50
```

### 10. 커피 품종과 재배 농장
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?farm ?variety
WHERE {
    ?farm rdf:type :Farm .
    ?farm :cultivates ?variety .
    ?variety rdf:type :CoffeeVariety .
}
LIMIT 50
```

### 11. 연간 생산량이 높은 농장
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?farm ?production
WHERE {
    ?farm rdf:type :Farm .
    ?farm :hasAnnualProduction ?production .
    FILTER(?production > 1000)
}
ORDER BY DESC(?production)
LIMIT 20
```

### 12. 가공 방법별 농장 조회
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?farm ?method
WHERE {
    ?farm rdf:type :Farm .
    ?farm :usesProcessingMethod ?method .
}
LIMIT 50
```

### 13. 중개인(Broker) 네트워크
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?broker ?type ?product
WHERE {
    ?broker rdf:type ?type .
    ?broker :handlesProduct ?product .
    FILTER(?type = :ExportBroker || ?type = :ImportBroker)
}
LIMIT 50
```

### 14. 클래스 계층 구조 조회
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT ?subclass ?superclass
WHERE {
    ?subclass rdfs:subClassOf ?superclass .
    ?subclass rdf:type owl:Class .
    ?superclass rdf:type owl:Class .
}
LIMIT 100
```

### 15. 복합 조건 쿼리 (AND, OR)
```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

# 한국에 있는 대규모 농장
SELECT ?farm ?country ?size
WHERE {
    ?farm rdf:type :Farm .
    ?farm :hasCountry ?country .
    ?farm :hasFarmSize ?size .
    FILTER(
        CONTAINS(LCASE(?country), "korea") && 
        ?size > 100
    )
}
LIMIT 50
```

---

## 실행 방법

### 방법 1: 웹 인터페이스 사용

1. **CoffeeLand 온톨로지 뷰어 접속**
   - URL: https://3000-i06uld37vaw5bk62kar62-2e77fc33.sandbox.novita.ai
   
2. **RDF 파일 업로드**
   - 좌측 사이드바에서 "파일 업로드" 클릭
   - `coffeeland_final_v2.rdf` 파일 선택
   
3. **SPARQL 쿼리 실행**
   - 좌측 메뉴에서 "SPARQL 쿼리" 선택
   - 위 예제 중 하나를 복사하여 입력
   - "쿼리 실행" 버튼 클릭

### 방법 2: Python으로 실행

```python
from rdflib import Graph

# RDF 파일 로드
g = Graph()
g.parse("coffeeland_final_v2.rdf", format="xml")

# SPARQL 쿼리 실행
query = """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?brand ?name
WHERE {
    ?brand rdf:type :CoffeeBrand .
    OPTIONAL { ?brand :hasName ?name }
}
LIMIT 10
"""

results = g.query(query)

# 결과 출력
for row in results:
    print(f"Brand: {row.brand}, Name: {row.name}")
```

### 방법 3: Apache Jena Fuseki 서버

```bash
# Fuseki 서버 시작
./fuseki-server --file=coffeeland_final_v2.rdf /coffeeland

# 웹 브라우저에서 접속
# http://localhost:3030/coffeeland/query
```

### 방법 4: Protégé에서 실행

1. Protégé 열기
2. File → Open → `coffeeland_final_v2.rdf` 선택
3. Window → Tabs → SPARQL Query 선택
4. 쿼리 입력 후 Execute 클릭

---

## 유용한 팁

### 1. OPTIONAL 사용
속성이 없을 수도 있는 경우 OPTIONAL을 사용:
```sparql
OPTIONAL { ?subject :hasProperty ?value }
```

### 2. FILTER 조건
결과를 필터링하려면:
```sparql
FILTER(?value > 100)
FILTER(CONTAINS(?string, "keyword"))
FILTER(LANG(?label) = "ko")
```

### 3. COUNT 집계
결과를 카운트하려면:
```sparql
SELECT (COUNT(?subject) AS ?count)
WHERE { ?subject rdf:type :Farm }
```

### 4. DISTINCT 중복 제거
중복을 제거하려면:
```sparql
SELECT DISTINCT ?subject
WHERE { ?subject ?predicate ?object }
```

### 5. ORDER BY 정렬
결과를 정렬하려면:
```sparql
ORDER BY ASC(?value)   # 오름차순
ORDER BY DESC(?value)  # 내림차순
```

---

## 문제 해결

### 쿼리가 결과를 반환하지 않는 경우:
1. PREFIX가 올바른지 확인
2. 클래스/속성 이름의 대소문자 확인
3. OPTIONAL을 사용하여 필수가 아닌 속성 처리
4. LIMIT을 늘려보기

### 성능이 느린 경우:
1. LIMIT으로 결과 수 제한
2. 더 구체적인 조건 추가
3. 인덱싱이 가능한 트리플 스토어 사용

---

## 추가 리소스

- **SPARQL 공식 문서**: https://www.w3.org/TR/sparql11-query/
- **RDFLib 문서**: https://rdflib.readthedocs.io/
- **Apache Jena**: https://jena.apache.org/
- **Protégé**: https://protege.stanford.edu/

---

**작성일**: 2026-03-24  
**버전**: 1.0  
**온톨로지**: Coffeeland Final v2
