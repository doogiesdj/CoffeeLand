#!/usr/bin/env python3
"""
CSV to RDF Converter for Port and Warehouse Individuals
Converts CSV data files into RDF/XML format for Protégé import
"""

import csv
import xml.etree.ElementTree as ET
from xml.dom import minidom

# Define namespace
NAMESPACE = "http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#"
RDF_NS = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
XSD_NS = "http://www.w3.org/2001/XMLSchema#"

def prettify(elem):
    """Return a pretty-printed XML string for the Element."""
    rough_string = ET.tostring(elem, encoding='unicode')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="    ")

def create_port_rdf(csv_file, output_file):
    """Convert Port CSV to RDF/XML"""
    
    # Register namespaces
    ET.register_namespace('', NAMESPACE)
    ET.register_namespace('owl', 'http://www.w3.org/2002/07/owl#')
    ET.register_namespace('rdf', RDF_NS)
    ET.register_namespace('xsd', XSD_NS)
    ET.register_namespace('rdfs', 'http://www.w3.org/2000/01/rdf-schema#')
    
    # Create root element with proper namespaces
    rdf = ET.Element('{' + RDF_NS + '}RDF', {
        '{http://www.w3.org/2000/xmlns/}': NAMESPACE,
        'xml:base': NAMESPACE,
        '{http://www.w3.org/2000/xmlns/}owl': 'http://www.w3.org/2002/07/owl#',
        '{http://www.w3.org/2000/xmlns/}rdf': RDF_NS,
        '{http://www.w3.org/2000/xmlns/}xsd': XSD_NS,
        '{http://www.w3.org/2000/xmlns/}rdfs': 'http://www.w3.org/2000/01/rdf-schema#'
    })
    
    # Read CSV and create individuals
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Create individual
            individual = ET.SubElement(rdf, 'owl:NamedIndividual')
            individual.set('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}about', NAMESPACE + row['PortID'])
            
            # Add type
            rdf_type = ET.SubElement(individual, '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}type')
            rdf_type.set('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}resource', NAMESPACE + 'Port')
            
            # Add data properties
            properties = [
                ('hasName', row['PortName']),
                ('hasCity', row['City']),
                ('hasCountry', row['Country']),
                ('hasCapacity', row['HasCapacity']),
                ('handlesProduct', row['HandlesProduct']),
                ('yearlyThroughput', row['YearlyThroughput']),
                ('hasLatitude', row['Latitude']),
                ('hasLongitude', row['Longitude'])
            ]
            
            for prop_name, prop_value in properties:
                if prop_value:
                    prop = ET.SubElement(individual, prop_name)
                    prop.set('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}datatype', XSD_NS + 'string')
                    prop.text = str(prop_value)
    
    # Write to file
    xml_str = prettify(rdf)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(xml_str)
    
    print(f"✅ Port RDF created: {output_file}")
    return output_file

def create_warehouse_rdf(csv_file, output_file):
    """Convert Warehouse CSV to RDF/XML"""
    
    # Create root element
    rdf = ET.Element('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}RDF')
    rdf.set('xmlns', NAMESPACE)
    rdf.set('xml:base', NAMESPACE)
    rdf.set('xmlns:owl', 'http://www.w3.org/2002/07/owl#')
    rdf.set('xmlns:rdf', RDF_NS)
    rdf.set('xmlns:xsd', XSD_NS)
    rdf.set('xmlns:rdfs', 'http://www.w3.org/2000/01/rdf-schema#')
    
    # Read CSV and create individuals
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Create individual
            individual = ET.SubElement(rdf, 'owl:NamedIndividual')
            individual.set('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}about', NAMESPACE + row['WarehouseID'])
            
            # Add type
            rdf_type = ET.SubElement(individual, '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}type')
            rdf_type.set('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}resource', NAMESPACE + 'Warehouse')
            
            # Add data properties
            properties = [
                ('hasName', row['WarehouseName']),
                ('hasCity', row['City']),
                ('hasCountry', row['Country']),
                ('storageCapacity', row['StorageCapacity']),
                ('storesProduct', row['StoresProduct']),
                ('temperatureControl', row['Temperature']),
                ('hasLatitude', row['Latitude']),
                ('hasLongitude', row['Longitude']),
                ('managedBy', row['ManagedBy'])
            ]
            
            for prop_name, prop_value in properties:
                if prop_value:
                    prop = ET.SubElement(individual, prop_name)
                    prop.set('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}datatype', XSD_NS + 'string')
                    prop.text = str(prop_value)
    
    # Write to file
    xml_str = prettify(rdf)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(xml_str)
    
    print(f"✅ Warehouse RDF created: {output_file}")
    return output_file

def create_combined_rdf(port_csv, warehouse_csv, output_file):
    """Create combined RDF with both Port and Warehouse individuals"""
    
    # Create root element
    rdf = ET.Element('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}RDF')
    rdf.set('xmlns', NAMESPACE)
    rdf.set('xml:base', NAMESPACE)
    rdf.set('xmlns:owl', 'http://www.w3.org/2002/07/owl#')
    rdf.set('xmlns:rdf', RDF_NS)
    rdf.set('xmlns:xsd', XSD_NS)
    rdf.set('xmlns:rdfs', 'http://www.w3.org/2000/01/rdf-schema#')
    
    # Add comment
    comment = ET.Comment(' Port and Warehouse Individuals for CoffeeLand Ontology ')
    rdf.append(comment)
    
    # Process Ports
    port_comment = ET.Comment(' Port Individuals ')
    rdf.append(port_comment)
    
    with open(port_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            individual = ET.SubElement(rdf, 'owl:NamedIndividual')
            individual.set('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}about', NAMESPACE + row['PortID'])
            
            rdf_type = ET.SubElement(individual, '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}type')
            rdf_type.set('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}resource', NAMESPACE + 'Port')
            
            properties = [
                ('hasName', row['PortName']),
                ('hasCity', row['City']),
                ('hasCountry', row['Country']),
                ('hasCapacity', row['HasCapacity']),
                ('handlesProduct', row['HandlesProduct']),
                ('yearlyThroughput', row['YearlyThroughput']),
                ('hasLatitude', row['Latitude']),
                ('hasLongitude', row['Longitude'])
            ]
            
            for prop_name, prop_value in properties:
                if prop_value:
                    prop = ET.SubElement(individual, prop_name)
                    prop.set('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}datatype', XSD_NS + 'string')
                    prop.text = str(prop_value)
    
    # Process Warehouses
    warehouse_comment = ET.Comment(' Warehouse Individuals ')
    rdf.append(warehouse_comment)
    
    with open(warehouse_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            individual = ET.SubElement(rdf, 'owl:NamedIndividual')
            individual.set('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}about', NAMESPACE + row['WarehouseID'])
            
            rdf_type = ET.SubElement(individual, '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}type')
            rdf_type.set('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}resource', NAMESPACE + 'Warehouse')
            
            properties = [
                ('hasName', row['WarehouseName']),
                ('hasCity', row['City']),
                ('hasCountry', row['Country']),
                ('storageCapacity', row['StorageCapacity']),
                ('storesProduct', row['StoresProduct']),
                ('temperatureControl', row['Temperature']),
                ('hasLatitude', row['Latitude']),
                ('hasLongitude', row['Longitude']),
                ('managedBy', row['ManagedBy'])
            ]
            
            for prop_name, prop_value in properties:
                if prop_value:
                    prop = ET.SubElement(individual, prop_name)
                    prop.set('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}datatype', XSD_NS + 'string')
                    prop.text = str(prop_value)
    
    # Write to file
    xml_str = prettify(rdf)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(xml_str)
    
    print(f"✅ Combined RDF created: {output_file}")
    print(f"   - Port individuals: 15")
    print(f"   - Warehouse individuals: 20")
    print(f"   - Total: 35 individuals")
    return output_file

if __name__ == "__main__":
    # Create individual RDF files
    print("🔄 Converting CSV to RDF...\n")
    
    create_port_rdf('coffee_ports_data.csv', 'coffee_ports_individuals.rdf')
    create_warehouse_rdf('coffee_warehouses_data.csv', 'coffee_warehouses_individuals.rdf')
    
    # Create combined RDF file
    create_combined_rdf('coffee_ports_data.csv', 'coffee_warehouses_data.csv', 
                       'coffee_logistics_individuals.rdf')
    
    print("\n✅ All RDF files created successfully!")
    print("\n📦 Generated files:")
    print("   1. coffee_ports_individuals.rdf (15 Ports)")
    print("   2. coffee_warehouses_individuals.rdf (20 Warehouses)")
    print("   3. coffee_logistics_individuals.rdf (Combined: 35 individuals)")
    print("\n🎯 Next steps:")
    print("   1. Open Protégé")
    print("   2. Open your coffeeland.rdf ontology")
    print("   3. File → Merge with Imported Ontology...")
    print("   4. Select coffee_logistics_individuals.rdf")
    print("   5. Save the ontology")
