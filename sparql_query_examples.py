#!/usr/bin/env python3
"""
Coffeeland 온톨로지 SPARQL 쿼리 실행 예제
"""

from rdflib import Graph, Namespace
from rdflib.plugins.sparql import prepareQuery
import json

# RDF 파일 로드
print("🔄 RDF 파일 로딩 중...")
g = Graph()
g.parse("/home/user/uploaded_files/coffeeland_final_v2.rdf", format="xml")
print(f"✅ 로딩 완료! 총 {len(g)} 개의 트리플\n")

# 네임스페이스 정의
RDF = Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")
RDFS = Namespace("http://www.w3.org/2000/01/rdf-schema#")
OWL = Namespace("http://www.w3.org/2002/07/owl#")
ONTO = Namespace("http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#")

# 네임스페이스 바인딩
g.bind("rdf", RDF)
g.bind("rdfs", RDFS)
g.bind("owl", OWL)
g.bind("", ONTO)

def run_query(query_name, query_string, limit=10):
    """SPARQL 쿼리 실행 및 결과 출력"""
    print(f"\n{'='*60}")
    print(f"📊 쿼리: {query_name}")
    print(f"{'='*60}")
    
    try:
        results = g.query(query_string)
        result_list = list(results)
        
        if not result_list:
            print("❌ 결과 없음")
            return
        
        print(f"✅ 총 {len(result_list)}개 결과 (최대 {limit}개 표시)\n")
        
        for i, row in enumerate(result_list[:limit], 1):
            print(f"{i}. {row}")
        
        if len(result_list) > limit:
            print(f"\n... 외 {len(result_list) - limit}개 더 있음")
            
    except Exception as e:
        print(f"❌ 쿼리 실행 오류: {e}")

# =============================================================================
# 예제 쿼리들
# =============================================================================

# 1. 모든 클래스 조회
query_1 = """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT ?class ?label
WHERE {
    ?class rdf:type owl:Class .
    OPTIONAL { ?class rdfs:label ?label }
}
ORDER BY ?class
"""
run_query("1. 모든 클래스 조회", query_1, limit=15)

# 2. 커피 브랜드 조회
query_2 = """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?brand
WHERE {
    ?brand rdf:type :CoffeeBrand .
}
LIMIT 20
"""
run_query("2. 커피 브랜드 조회", query_2)

# 3. 커피 체인 조회
query_3 = """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?chain
WHERE {
    ?chain rdf:type :CoffeeChain .
}
LIMIT 20
"""
run_query("3. 커피 체인 조회", query_3)

# 4. 농장(Farm) 조회
query_4 = """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?farm
WHERE {
    ?farm rdf:type :Farm .
}
LIMIT 20
"""
run_query("4. 농장 조회", query_4)

# 5. 국가(Country) 조회
query_5 = """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?country
WHERE {
    ?country rdf:type :Country .
}
LIMIT 20
"""
run_query("5. 국가 조회", query_5)

# 6. 커피 품종 조회
query_6 = """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?variety
WHERE {
    ?variety rdf:type :CoffeeVariety .
}
LIMIT 20
"""
run_query("6. 커피 품종 조회", query_6)

# 7. 중개인(Broker) 조회
query_7 = """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?broker
WHERE {
    ?broker rdf:type :Broker .
}
LIMIT 20
"""
run_query("7. 중개인 조회", query_7)

# 8. 로스터리(Roaster) 조회
query_8 = """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?roaster
WHERE {
    ?roaster rdf:type :Roaster .
}
LIMIT 20
"""
run_query("8. 로스터리 조회", query_8)

# 9. 데이터 속성이 있는 엔티티 조회
query_9 = """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?entity ?property ?value
WHERE {
    ?entity ?property ?value .
    FILTER(
        ?property = :hasCountry || 
        ?property = :hasCity ||
        ?property = :hasLatitude ||
        ?property = :hasLongitude
    )
}
LIMIT 30
"""
run_query("9. 위치 정보가 있는 엔티티", query_9, limit=15)

# 10. 객체 속성 관계 조회
query_10 = """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#>

SELECT ?subject ?predicate ?object
WHERE {
    ?subject ?predicate ?object .
    FILTER(
        ?predicate = :suppliesTo ||
        ?predicate = :locatedIn ||
        ?predicate = :cultivates ||
        ?predicate = :usesProcessingMethod
    )
}
LIMIT 30
"""
run_query("10. 공급망 관계", query_10, limit=15)

# 통계 출력
print(f"\n{'='*60}")
print("📈 온톨로지 통계")
print(f"{'='*60}")

# 클래스 개수
classes = list(g.query("""
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    SELECT (COUNT(DISTINCT ?class) as ?count)
    WHERE { ?class a owl:Class }
"""))
print(f"총 클래스 수: {classes[0][0] if classes else 0}")

# 인스턴스 개수
instances = list(g.query("""
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    SELECT (COUNT(DISTINCT ?instance) as ?count)
    WHERE { ?instance a owl:NamedIndividual }
"""))
print(f"총 인스턴스 수: {instances[0][0] if instances else 0}")

# 속성 개수
properties = list(g.query("""
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    SELECT (COUNT(DISTINCT ?property) as ?count)
    WHERE { 
        { ?property a owl:ObjectProperty } 
        UNION 
        { ?property a owl:DatatypeProperty }
    }
"""))
print(f"총 속성 수: {properties[0][0] if properties else 0}")

print(f"\n{'='*60}")
print("✅ 쿼리 실행 완료!")
print(f"{'='*60}\n")
