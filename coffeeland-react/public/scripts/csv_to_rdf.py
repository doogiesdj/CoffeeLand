#!/usr/bin/env python3
"""
🔄 CSV to RDF Converter
Converts CSV templates to RDF individuals
"""

import csv
import sys
from pathlib import Path

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent))
from restore_and_import_ontology import UniversalInstanceGenerator

NAMESPACE = "http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2"

# Property mappings for each class
CSV_MAPPINGS = {
    'Farmer': {
        'csv_file': 'farmers.csv',
        'class_name': 'Farmer',
        'property_mappings': {
            'name': 'hasName',
            'country': 'hasCountry',
            'region': 'hasRegion',
            'farmSize': 'farmSize',
            'experienceYears': 'experienceYears',
            'certification': 'certifications'
        },
        'id_field': 'name'
    },
    'Cooperative': {
        'csv_file': 'cooperatives.csv',
        'class_name': 'Cooperative',
        'property_mappings': {
            'name': 'hasName',
            'country': 'hasCountry',
            'memberCount': 'memberCount',
            'foundedYear': 'foundedYear',
            'mainProduct': 'mainProduct',
            'certification': 'certifications'
        },
        'id_field': 'name'
    },
    'Certification': {
        'csv_file': 'certifications.csv',
        'class_name': 'Certification',
        'property_mappings': {
            'name': 'hasName',
            'certificationBody': 'certificationBody',
            'establishedYear': 'establishedYear',
            'scope': 'certificationScope',
            'issuedBy': 'issuedBy'
        },
        'id_field': 'name'
    },
    'ProcessingMethod': {
        'csv_file': 'processing_methods.csv',
        'class_name': 'ProcessingMethod',
        'property_mappings': {
            'name': 'hasName',
            'methodType': 'methodType',
            'description': 'description',
            'waterUsage': 'waterUsage',
            'flavorProfile': 'flavorProfile',
            'dryingTime': 'dryingTime'
        },
        'id_field': 'name'
    },
    'Retailer': {
        'csv_file': 'retailers.csv',
        'class_name': 'Retailer',
        'property_mappings': {
            'name': 'hasName',
            'country': 'hasCountry',
            'retailType': 'retailType',
            'storeCount': 'storeCount'
        },
        'id_field': 'name'
    },
    'Roaster': {
        'csv_file': 'roasters.csv',
        'class_name': 'Roaster',
        'property_mappings': {
            'name': 'hasName',
            'country': 'hasCountry',
            'city': 'hasCity',
            'roastingCapacity': 'roastingCapacity',
            'roastProfiles': 'roastProfiles',
            'specialtyGrade': 'specialtyGrade'
        },
        'id_field': 'name'
    }
}


def csv_to_rdf(class_key: str, csv_dir: str = "templates/csv_sources", 
               output_dir: str = "generated_imports"):
    """Convert a CSV file to RDF individuals"""
    
    if class_key not in CSV_MAPPINGS:
        print(f"❌ Unknown class: {class_key}")
        return None
    
    config = CSV_MAPPINGS[class_key]
    csv_file = Path(csv_dir) / config['csv_file']
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_file}")
        return None
    
    print(f"\n🔄 Converting: {csv_file.name} → {config['class_name']}")
    print("-" * 70)
    
    generator = UniversalInstanceGenerator(NAMESPACE)
    
    # Read CSV
    instances = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            properties = {}
            
            for csv_col, prop_name in config['property_mappings'].items():
                if csv_col in row and row[csv_col]:
                    value = row[csv_col]
                    
                    # Handle pipe-separated lists (e.g., certifications)
                    if '|' in value:
                        properties[prop_name] = [
                            {'resource': v.strip()} for v in value.split('|')
                        ]
                    # Handle boolean
                    elif value.lower() in ('true', 'false'):
                        properties[prop_name] = value.lower() == 'true'
                    # Handle numbers
                    elif value.isdigit():
                        properties[prop_name] = int(value)
                    # Handle references (country, etc.)
                    elif csv_col in ('country', 'mainProduct'):
                        properties[prop_name] = {'resource': value}
                    else:
                        properties[prop_name] = value
            
            # Generate ID
            id_value = row.get(config['id_field'], '').replace(' ', '_').replace(',', '')
            individual_id = f"{config['class_name']}_{id_value}"
            
            instances.append({
                'id': individual_id,
                'properties': properties
            })
    
    if not instances:
        print("⚠️  No instances found in CSV")
        return None
    
    # Generate RDF
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    output_file = output_path / f"{config['class_name'].lower()}_individuals.rdf"
    
    xml_lines = []
    xml_lines.append('<?xml version="1.0" encoding="utf-8"?>')
    xml_lines.append(f'<rdf:RDF xmlns:owl="http://www.w3.org/2002/07/owl#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">')
    xml_lines.append('')
    
    for instance in instances:
        xml_lines.append(generator.create_individual_xml(
            config['class_name'], 
            instance['id'], 
            instance['properties']
        ))
        xml_lines.append('')
    
    xml_lines.append('</rdf:RDF>')
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(xml_lines))
    
    print(f"✅ Generated {len(instances)} individuals → {output_file.name}")
    return output_file


def convert_all():
    """Convert all CSV files to RDF"""
    
    print("🚀 CSV to RDF Batch Converter")
    print("=" * 70)
    
    generated = []
    total_instances = 0
    
    for class_key in CSV_MAPPINGS.keys():
        result = csv_to_rdf(class_key)
        if result:
            generated.append(result)
            # Count instances
            with open(result, 'r', encoding='utf-8') as f:
                count = f.read().count('owl:NamedIndividual')
                total_instances += count
    
    print("\n" + "=" * 70)
    print(f"✅ Conversion Complete:")
    print(f"  • Files generated: {len(generated)}")
    print(f"  • Total instances: {total_instances}")
    print(f"  • Output directory: generated_imports/")
    print("=" * 70)
    
    return generated


def main():
    """Main entry point"""
    
    if len(sys.argv) > 1:
        # Convert specific class
        class_key = sys.argv[1]
        csv_to_rdf(class_key)
    else:
        # Convert all
        convert_all()


if __name__ == "__main__":
    main()
