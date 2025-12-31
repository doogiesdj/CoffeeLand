#!/usr/bin/env python3
"""
CSV to RDF Converter for Port and Warehouse Individuals
Simple string-based approach for clean RDF generation
"""

import csv

NAMESPACE = "http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#"

def create_port_rdf(csv_file, output_file):
    """Convert Port CSV to RDF/XML"""
    
    # RDF header
    rdf_content = '''<?xml version="1.0"?>
<rdf:RDF xmlns="http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2/"
     xml:base="http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2/"
     xmlns:owl="http://www.w3.org/2002/07/owl#"
     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
     xmlns:xml="http://www.w3.org/XML/1998/namespace"
     xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
     xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#">

    <!-- Port Individuals -->

'''
    
    # Read CSV and create individuals
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rdf_content += f'''    <!-- {NAMESPACE}{row['PortID']} -->

    <owl:NamedIndividual rdf:about="{NAMESPACE}{row['PortID']}">
        <rdf:type rdf:resource="{NAMESPACE}Port"/>
        <hasName rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['PortName']}</hasName>
        <hasCity rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['City']}</hasCity>
        <hasCountry rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['Country']}</hasCountry>
        <hasCapacity rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">{row['HasCapacity']}</hasCapacity>
        <handlesProduct rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['HandlesProduct']}</handlesProduct>
        <yearlyThroughput rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">{row['YearlyThroughput']}</yearlyThroughput>
        <hasLatitude rdf:datatype="http://www.w3.org/2001/XMLSchema#double">{row['Latitude']}</hasLatitude>
        <hasLongitude rdf:datatype="http://www.w3.org/2001/XMLSchema#double">{row['Longitude']}</hasLongitude>
    </owl:NamedIndividual>

'''
    
    # Close RDF tag
    rdf_content += '</rdf:RDF>\n'
    
    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(rdf_content)
    
    print(f"✅ Port RDF created: {output_file}")
    
    # Count individuals
    count = sum(1 for _ in open(csv_file)) - 1  # Subtract header
    print(f"   📊 Created {count} Port individuals")
    return output_file

def create_warehouse_rdf(csv_file, output_file):
    """Convert Warehouse CSV to RDF/XML"""
    
    # RDF header
    rdf_content = '''<?xml version="1.0"?>
<rdf:RDF xmlns="http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2/"
     xml:base="http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2/"
     xmlns:owl="http://www.w3.org/2002/07/owl#"
     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
     xmlns:xml="http://www.w3.org/XML/1998/namespace"
     xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
     xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#">

    <!-- Warehouse Individuals -->

'''
    
    # Read CSV and create individuals
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rdf_content += f'''    <!-- {NAMESPACE}{row['WarehouseID']} -->

    <owl:NamedIndividual rdf:about="{NAMESPACE}{row['WarehouseID']}">
        <rdf:type rdf:resource="{NAMESPACE}Warehouse"/>
        <hasName rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['WarehouseName']}</hasName>
        <hasCity rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['City']}</hasCity>
        <hasCountry rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['Country']}</hasCountry>
        <storageCapacity rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">{row['StorageCapacity']}</storageCapacity>
        <storesProduct rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['StoresProduct']}</storesProduct>
        <temperatureControl rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['Temperature']}</temperatureControl>
        <hasLatitude rdf:datatype="http://www.w3.org/2001/XMLSchema#double">{row['Latitude']}</hasLatitude>
        <hasLongitude rdf:datatype="http://www.w3.org/2001/XMLSchema#double">{row['Longitude']}</hasLongitude>
        <managedBy rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['ManagedBy']}</managedBy>
    </owl:NamedIndividual>

'''
    
    # Close RDF tag
    rdf_content += '</rdf:RDF>\n'
    
    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(rdf_content)
    
    print(f"✅ Warehouse RDF created: {output_file}")
    
    # Count individuals
    count = sum(1 for _ in open(csv_file)) - 1  # Subtract header
    print(f"   📊 Created {count} Warehouse individuals")
    return output_file

def create_combined_rdf(port_csv, warehouse_csv, output_file):
    """Create combined RDF with both Port and Warehouse individuals"""
    
    # RDF header
    rdf_content = '''<?xml version="1.0"?>
<rdf:RDF xmlns="http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2/"
     xml:base="http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2/"
     xmlns:owl="http://www.w3.org/2002/07/owl#"
     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
     xmlns:xml="http://www.w3.org/XML/1998/namespace"
     xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
     xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#">

    <!-- 
    ///////////////////////////////////////////////////////////////////////////////////////
    //
    // Port and Warehouse Individuals for CoffeeLand Ontology
    //
    ///////////////////////////////////////////////////////////////////////////////////////
     -->

    <!-- Port Individuals -->

'''
    
    # Process Ports
    port_count = 0
    with open(port_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            port_count += 1
            rdf_content += f'''    <!-- {NAMESPACE}{row['PortID']} -->

    <owl:NamedIndividual rdf:about="{NAMESPACE}{row['PortID']}">
        <rdf:type rdf:resource="{NAMESPACE}Port"/>
        <hasName rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['PortName']}</hasName>
        <hasCity rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['City']}</hasCity>
        <hasCountry rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['Country']}</hasCountry>
        <hasCapacity rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">{row['HasCapacity']}</hasCapacity>
        <handlesProduct rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['HandlesProduct']}</handlesProduct>
        <yearlyThroughput rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">{row['YearlyThroughput']}</yearlyThroughput>
        <hasLatitude rdf:datatype="http://www.w3.org/2001/XMLSchema#double">{row['Latitude']}</hasLatitude>
        <hasLongitude rdf:datatype="http://www.w3.org/2001/XMLSchema#double">{row['Longitude']}</hasLongitude>
    </owl:NamedIndividual>

'''
    
    # Add Warehouse section
    rdf_content += '''
    <!-- Warehouse Individuals -->

'''
    
    # Process Warehouses
    warehouse_count = 0
    with open(warehouse_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            warehouse_count += 1
            rdf_content += f'''    <!-- {NAMESPACE}{row['WarehouseID']} -->

    <owl:NamedIndividual rdf:about="{NAMESPACE}{row['WarehouseID']}">
        <rdf:type rdf:resource="{NAMESPACE}Warehouse"/>
        <hasName rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['WarehouseName']}</hasName>
        <hasCity rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['City']}</hasCity>
        <hasCountry rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['Country']}</hasCountry>
        <storageCapacity rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">{row['StorageCapacity']}</storageCapacity>
        <storesProduct rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['StoresProduct']}</storesProduct>
        <temperatureControl rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['Temperature']}</temperatureControl>
        <hasLatitude rdf:datatype="http://www.w3.org/2001/XMLSchema#double">{row['Latitude']}</hasLatitude>
        <hasLongitude rdf:datatype="http://www.w3.org/2001/XMLSchema#double">{row['Longitude']}</hasLongitude>
        <managedBy rdf:datatype="http://www.w3.org/2001/XMLSchema#string">{row['ManagedBy']}</managedBy>
    </owl:NamedIndividual>

'''
    
    # Close RDF tag
    rdf_content += '</rdf:RDF>\n'
    
    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(rdf_content)
    
    print(f"✅ Combined RDF created: {output_file}")
    print(f"   📊 Port individuals: {port_count}")
    print(f"   📊 Warehouse individuals: {warehouse_count}")
    print(f"   📊 Total: {port_count + warehouse_count} individuals")
    return output_file

if __name__ == "__main__":
    print("🔄 Converting CSV to RDF...\n")
    
    # Create individual RDF files
    create_port_rdf('coffee_ports_data.csv', 'coffee_ports_individuals.rdf')
    print()
    create_warehouse_rdf('coffee_warehouses_data.csv', 'coffee_warehouses_individuals.rdf')
    print()
    
    # Create combined RDF file
    create_combined_rdf('coffee_ports_data.csv', 'coffee_warehouses_data.csv', 
                       'coffee_logistics_individuals.rdf')
    
    print("\n" + "="*60)
    print("✅ All RDF files created successfully!")
    print("="*60)
    print("\n📦 Generated files:")
    print("   1. coffee_ports_individuals.rdf (Ports only)")
    print("   2. coffee_warehouses_individuals.rdf (Warehouses only)")
    print("   3. coffee_logistics_individuals.rdf ⭐ (Combined - RECOMMENDED)")
    print("\n🎯 Import Instructions:")
    print("   Method 1 - Import via Protégé GUI:")
    print("      1. Open Protégé")
    print("      2. Open your coffeeland.rdf ontology")
    print("      3. File → Merge with Imported Ontology...")
    print("      4. Select: coffee_logistics_individuals.rdf")
    print("      5. Click 'OK' to merge")
    print("      6. Save the ontology (Ctrl+S)")
    print("\n   Method 2 - Direct file merge:")
    print("      1. Open coffeeland.rdf in a text editor")
    print("      2. Copy the content between <owl:NamedIndividual> tags")
    print("         from coffee_logistics_individuals.rdf")
    print("      3. Paste before the closing </rdf:RDF> tag")
    print("      4. Save and open in Protégé")
    print("\n✨ Next: View in Protégé Individuals tab!")
