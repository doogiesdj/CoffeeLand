#!/usr/bin/env python3
"""
🔄 Universal Ontology Instance Import System
Restores Farm instances and provides a reusable mechanism for all ontology subclasses
"""

import re
import json
import csv
from pathlib import Path
from typing import List, Dict, Any
from xml.etree import ElementTree as ET

# Namespace configuration
NAMESPACE = "http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2"
RDF_NS = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
OWL_NS = "http://www.w3.org/2002/07/owl#"
RDFS_NS = "http://www.w3.org/2000/01/rdf-schema#"
XSD_NS = "http://www.w3.org/2001/XMLSchema#"

class OntologyInstanceManager:
    """Manages importing instances into coffeeland.rdf without direct editing"""
    
    def __init__(self, ontology_file: str = "coffeeland-react/public/coffeeland.rdf"):
        self.ontology_file = Path(ontology_file)
        self.backup_file = self.ontology_file.with_suffix('.rdf.backup')
        
    def backup_ontology(self):
        """Create backup before modification"""
        import shutil
        shutil.copy(self.ontology_file, self.backup_file)
        print(f"✅ Backup created: {self.backup_file}")
        
    def find_insertion_point(self, content: str) -> int:
        """Find the best insertion point before </rdf:RDF>"""
        # Look for the closing tag
        match = re.search(r'</rdf:RDF>\s*$', content, re.MULTILINE)
        if match:
            return match.start()
        raise ValueError("Could not find </rdf:RDF> closing tag")
    
    def extract_individuals_from_file(self, source_file: str) -> List[str]:
        """Extract all NamedIndividual blocks from an RDF file"""
        with open(source_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all NamedIndividual blocks
        pattern = r'(<owl:NamedIndividual.*?</owl:NamedIndividual>)'
        individuals = re.findall(pattern, content, re.DOTALL)
        
        print(f"📦 Extracted {len(individuals)} individuals from {source_file}")
        return individuals
    
    def import_individuals(self, source_file: str):
        """Import individuals from source file into main ontology"""
        # Backup first
        self.backup_ontology()
        
        # Extract individuals
        individuals = self.extract_individuals_from_file(source_file)
        
        if not individuals:
            print(f"⚠️  No individuals found in {source_file}")
            return
        
        # Read main ontology
        with open(self.ontology_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find insertion point
        insert_pos = self.find_insertion_point(content)
        
        # Prepare individuals block with proper indentation
        individuals_block = "\n    <!-- Imported Individuals -->\n\n"
        for individual in individuals:
            # Clean up and indent
            clean_individual = individual.strip()
            # Add proper indentation (4 spaces)
            indented = '\n'.join('    ' + line if line.strip() else line 
                                for line in clean_individual.split('\n'))
            individuals_block += indented + "\n\n"
        
        # Insert individuals
        new_content = content[:insert_pos] + individuals_block + content[insert_pos:]
        
        # Write back
        with open(self.ontology_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Imported {len(individuals)} individuals into {self.ontology_file}")
        
        # Count total individuals now
        total = new_content.count('owl:NamedIndividual')
        print(f"📊 Total individuals in ontology: {total}")


class UniversalInstanceGenerator:
    """Generate instances for any ontology subclass from JSON/CSV templates"""
    
    def __init__(self, namespace: str = NAMESPACE):
        self.namespace = namespace
        
    def create_individual_xml(self, 
                             class_name: str, 
                             individual_id: str,
                             properties: Dict[str, Any]) -> str:
        """Create XML for a single individual"""
        
        xml_lines = []
        xml_lines.append(f'    <owl:NamedIndividual rdf:about="{self.namespace}#{individual_id}">')
        xml_lines.append(f'        <rdf:type rdf:resource="{self.namespace}#{class_name}"/>')
        
        for prop_name, prop_value in properties.items():
            if isinstance(prop_value, dict):
                # Object property (reference to another individual)
                if 'resource' in prop_value:
                    xml_lines.append(f'        <{prop_name} rdf:resource="{self.namespace}#{prop_value["resource"]}"/>')
            elif isinstance(prop_value, list):
                # Multiple values
                for val in prop_value:
                    if isinstance(val, dict) and 'resource' in val:
                        xml_lines.append(f'        <{prop_name} rdf:resource="{self.namespace}#{val["resource"]}"/>')
                    else:
                        xml_lines.append(f'        <{prop_name}>{self._escape_xml(str(val))}</{prop_name}>')
            elif isinstance(prop_value, int):
                xml_lines.append(f'        <{prop_name} rdf:datatype="{XSD_NS}#integer">{prop_value}</{prop_name}>')
            elif isinstance(prop_value, float):
                xml_lines.append(f'        <{prop_name} rdf:datatype="{XSD_NS}#double">{prop_value}</{prop_name}>')
            else:
                xml_lines.append(f'        <{prop_name}>{self._escape_xml(str(prop_value))}</{prop_name}>')
        
        xml_lines.append('    </owl:NamedIndividual>')
        return '\n'.join(xml_lines)
    
    def _escape_xml(self, text: str) -> str:
        """Escape XML special characters"""
        return (text.replace('&', '&amp;')
                   .replace('<', '&lt;')
                   .replace('>', '&gt;')
                   .replace('"', '&quot;')
                   .replace("'", '&apos;'))
    
    def generate_from_json(self, json_file: str, output_file: str):
        """Generate RDF from JSON template"""
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        xml_content = []
        xml_content.append('<?xml version="1.0" encoding="utf-8"?>')
        xml_content.append(f'<rdf:RDF xmlns:owl="{OWL_NS}" xmlns:rdf="{RDF_NS}">')
        xml_content.append('')
        
        class_name = data.get('class_name')
        instances = data.get('instances', [])
        
        for instance in instances:
            individual_id = instance.get('id')
            properties = instance.get('properties', {})
            xml_content.append(self.create_individual_xml(class_name, individual_id, properties))
            xml_content.append('')
        
        xml_content.append('</rdf:RDF>')
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(xml_content))
        
        print(f"✅ Generated {len(instances)} {class_name} instances → {output_file}")
    
    def generate_from_csv(self, csv_file: str, class_name: str, output_file: str, 
                         property_mappings: Dict[str, str]):
        """
        Generate RDF from CSV file
        
        Args:
            csv_file: Path to CSV file
            class_name: OWL class name
            output_file: Output RDF file
            property_mappings: Map CSV column names to property names
        """
        instances = []
        
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                properties = {}
                for csv_col, prop_name in property_mappings.items():
                    if csv_col in row and row[csv_col]:
                        properties[prop_name] = row[csv_col]
                
                # Generate ID from name or first column
                individual_id = row.get('name', row.get(list(row.keys())[0], '')).replace(' ', '_')
                instances.append({
                    'id': f"{class_name}_{individual_id}",
                    'properties': properties
                })
        
        # Create JSON structure and generate
        data = {'class_name': class_name, 'instances': instances}
        
        # Generate directly
        xml_content = []
        xml_content.append('<?xml version="1.0" encoding="utf-8"?>')
        xml_content.append(f'<rdf:RDF xmlns:owl="{OWL_NS}" xmlns:rdf="{RDF_NS}">')
        xml_content.append('')
        
        for instance in instances:
            xml_content.append(self.create_individual_xml(class_name, instance['id'], instance['properties']))
            xml_content.append('')
        
        xml_content.append('</rdf:RDF>')
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(xml_content))
        
        print(f"✅ Generated {len(instances)} {class_name} instances from CSV → {output_file}")


def main():
    """Main restoration and import workflow"""
    
    print("🔄 CoffeeLand Ontology Instance Management System")
    print("=" * 70)
    
    # Step 1: Restore Farm instances
    print("\n📋 Step 1: Restoring Farm Instances")
    print("-" * 70)
    
    manager = OntologyInstanceManager()
    farm_file = "coffee_farms_individuals.rdf"
    
    if Path(farm_file).exists():
        manager.import_individuals(farm_file)
        print("✅ Farm instances restored successfully!")
    else:
        print(f"⚠️  {farm_file} not found. Skipping Farm restoration.")
    
    # Step 2: Show available instance files
    print("\n📋 Step 2: Checking Available Instance Files")
    print("-" * 70)
    
    instance_files = list(Path('.').glob('coffee_*_individuals.rdf'))
    if instance_files:
        print(f"Found {len(instance_files)} instance files:")
        for f in instance_files:
            size = f.stat().st_size / 1024
            print(f"  • {f.name} ({size:.1f} KB)")
    
    print("\n" + "=" * 70)
    print("✅ Restoration Complete!")
    print("\nNext Steps:")
    print("  1. Open Protégé")
    print("  2. Load coffeeland.rdf")
    print("  3. Check Individuals tab for Farm instances")
    print("  4. Use the templates in templates/imports/ for batch imports")
    print("=" * 70)


if __name__ == "__main__":
    main()
