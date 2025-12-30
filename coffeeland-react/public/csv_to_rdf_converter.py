#!/usr/bin/env python3
"""
CSV to RDF Converter for Coffee Farm Data
CoffeeLand Ontology Project
Author: CoffeeLand Team
Date: 2025-12-29

This script converts Coffee_Farm_Data.csv to RDF/XML format
that can be directly imported into Protégé.

Usage:
  python csv_to_rdf_converter.py
"""

import csv
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom

# Ontology namespace
ONT_NS = "http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#"
RDF_NS = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
RDFS_NS = "http://www.w3.org/2000/01/rdf-schema#"
OWL_NS = "http://www.w3.org/2002/07/owl#"
XSD_NS = "http://www.w3.org/2001/XMLSchema#"

def clean_name(name):
    """Clean name for URI (remove spaces, special chars)"""
    return name.replace(" ", "_").replace(",", "").replace(".", "")

def create_rdf_header():
    """Create RDF/XML root element with namespaces"""
    from xml.etree.ElementTree import register_namespace
    
    # Register namespaces
    register_namespace('rdf', RDF_NS)
    register_namespace('rdfs', RDFS_NS)
    register_namespace('owl', OWL_NS)
    register_namespace('xsd', XSD_NS)
    register_namespace('', ONT_NS)
    
    root = Element("{%s}RDF" % RDF_NS)
    return root

def add_farm_individual(root, row):
    """
    Add a Farm individual to RDF
    
    row dict keys:
    - Country
    - Farm_Name
    - Region
    - Coffee_Variety
    - Altitude_Range_meters
    - Processing_Method
    - Certifications
    - Cooperative_Membership
    - Farm_Size
    - Annual_Production_bags
    """
    farm_name = clean_name(row['Farm_Name'])
    farm_uri = f"{ONT_NS}Farm_{farm_name}"
    
    # Create NamedIndividual element
    individual = SubElement(root, "{%s}NamedIndividual" % OWL_NS)
    individual.set("{%s}about" % RDF_NS, farm_uri)
    
    # Add rdf:type
    farm_type = SubElement(individual, "{%s}type" % RDF_NS)
    farm_type.set("{%s}resource" % RDF_NS, f"{ONT_NS}Farm")
    
    # Data Properties
    props = {
        'hasName': row['Farm_Name'],
        'hasRegion': row['Region'],
        'hasAltitudeRange': row['Altitude_Range_meters'],
        'hasFarmSize': row['Farm_Size'],
        'hasAnnualProduction': row['Annual_Production_bags']
    }
    
    for prop, value in props.items():
        if value:
            prop_elem = SubElement(individual, prop)
            if prop == 'hasAnnualProduction':
                prop_elem.set("{%s}datatype" % RDF_NS, f"{XSD_NS}integer")
            prop_elem.text = str(value)
    
    # Object Properties
    if row['Country']:
        country_elem = SubElement(individual, "isLocatedIn")
        country_elem.set("{%s}resource" % RDF_NS, 
                        f"{ONT_NS}{clean_name(row['Country'])}")
    
    if row['Coffee_Variety']:
        variety_elem = SubElement(individual, "cultivates")
        variety_elem.set("{%s}resource" % RDF_NS, 
                        f"{ONT_NS}{clean_name(row['Coffee_Variety'])}")
    
    if row['Processing_Method']:
        process_elem = SubElement(individual, "usesProcessingMethod")
        process_elem.set("{%s}resource" % RDF_NS, 
                        f"{ONT_NS}{clean_name(row['Processing_Method'])}")
    
    if row['Cooperative_Membership']:
        coop_elem = SubElement(individual, "memberOf")
        coop_elem.set("{%s}resource" % RDF_NS, 
                     f"{ONT_NS}{clean_name(row['Cooperative_Membership'])}")
    
    # Handle multiple certifications
    if row['Certifications'] and row['Certifications'] != 'None':
        certs = [c.strip() for c in row['Certifications'].split(',')]
        for cert in certs:
            cert_elem = SubElement(individual, "hasCertification")
            cert_elem.set("{%s}resource" % RDF_NS, 
                         f"{ONT_NS}{clean_name(cert)}")

def prettify_xml(elem):
    """Return a pretty-printed XML string"""
    rough_string = tostring(elem, encoding='utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ", encoding='utf-8').decode('utf-8')

def convert_csv_to_rdf(csv_file, output_file):
    """Main conversion function"""
    print(f"📖 Reading CSV: {csv_file}")
    
    root = create_rdf_header()
    farm_count = 0
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            add_farm_individual(root, row)
            farm_count += 1
            print(f"  ✓ Added: {row['Farm_Name']} ({row['Country']})")
    
    print(f"\n📝 Writing RDF: {output_file}")
    
    # Write to file
    xml_string = prettify_xml(root)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(xml_string)
    
    print(f"✅ Success! Created {farm_count} Farm individuals")
    print(f"\n📂 Output file: {output_file}")
    print(f"\n🚀 Next steps:")
    print(f"   1. Open Protégé")
    print(f"   2. Open coffeeland.rdf")
    print(f"   3. File > Merge ontologies")
    print(f"   4. Select: {output_file}")
    print(f"   5. Verify: Individuals tab > Farm class")

if __name__ == "__main__":
    import os
    
    csv_file = "coffee_farms_data.csv"
    output_file = "coffee_farms_individuals.rdf"
    
    if not os.path.exists(csv_file):
        print(f"❌ Error: {csv_file} not found!")
        print(f"   Please ensure the CSV file is in the same directory.")
        exit(1)
    
    try:
        convert_csv_to_rdf(csv_file, output_file)
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
