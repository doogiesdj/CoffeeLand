#!/usr/bin/env python3
"""
🔄 Universal Instance Import Generator
Processes JSON templates and generates RDF files for batch import
"""

import json
import sys
from pathlib import Path

# Add parent directory to path to import the manager
sys.path.insert(0, str(Path(__file__).parent.parent))
from restore_and_import_ontology import UniversalInstanceGenerator, OntologyInstanceManager

NAMESPACE = "http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2"

def process_template(json_file: str, output_dir: str = "generated_imports"):
    """Process a JSON template and generate individual RDF files per class"""
    
    print(f"\n🔄 Processing: {json_file}")
    print("-" * 70)
    
    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    # Load JSON template
    with open(json_file, 'r', encoding='utf-8') as f:
        template = json.load(f)
    
    description = template.get('description', 'No description')
    print(f"📋 {description}")
    
    generator = UniversalInstanceGenerator(NAMESPACE)
    
    classes = template.get('classes', {})
    generated_files = []
    total_instances = 0
    
    for class_key, class_data in classes.items():
        class_name = class_data.get('class_name')
        instances = class_data.get('instances', [])
        
        if not instances:
            print(f"  ⚠️  {class_name}: No instances defined")
            continue
        
        # Generate output filename
        output_file = output_path / f"{class_name.lower()}_individuals.rdf"
        
        # Generate RDF content
        xml_lines = []
        xml_lines.append('<?xml version="1.0" encoding="utf-8"?>')
        xml_lines.append(f'<rdf:RDF xmlns:owl="http://www.w3.org/2002/07/owl#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">')
        xml_lines.append('')
        
        for instance in instances:
            individual_id = instance.get('id')
            properties = instance.get('properties', {})
            xml_lines.append(generator.create_individual_xml(class_name, individual_id, properties))
            xml_lines.append('')
        
        xml_lines.append('</rdf:RDF>')
        
        # Write to file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(xml_lines))
        
        print(f"  ✅ {class_name}: {len(instances)} instances → {output_file.name}")
        generated_files.append(output_file)
        total_instances += len(instances)
    
    return generated_files, total_instances


def import_all_generated(import_dir: str = "generated_imports"):
    """Import all generated RDF files into coffeeland.rdf"""
    
    print(f"\n📦 Importing all generated files into coffeeland.rdf")
    print("=" * 70)
    
    manager = OntologyInstanceManager()
    import_path = Path(import_dir)
    
    if not import_path.exists():
        print(f"❌ Import directory not found: {import_dir}")
        return
    
    rdf_files = list(import_path.glob("*.rdf"))
    
    if not rdf_files:
        print(f"⚠️  No RDF files found in {import_dir}")
        return
    
    print(f"Found {len(rdf_files)} files to import:\n")
    
    # Backup once before all imports
    manager.backup_ontology()
    
    total_imported = 0
    
    for rdf_file in sorted(rdf_files):
        print(f"\n📥 Importing: {rdf_file.name}")
        try:
            # Count individuals in file
            with open(rdf_file, 'r', encoding='utf-8') as f:
                content = f.read()
                count = content.count('owl:NamedIndividual')
            
            manager.import_individuals(str(rdf_file))
            total_imported += count
            print(f"  ✅ Successfully imported {count} individuals")
        except Exception as e:
            print(f"  ❌ Error importing {rdf_file.name}: {e}")
    
    print(f"\n" + "=" * 70)
    print(f"✅ Import Complete: {total_imported} total individuals imported")
    print("=" * 70)


def main():
    """Main workflow"""
    
    print("🚀 CoffeeLand Universal Instance Import System")
    print("=" * 70)
    
    # Process all templates
    templates_dir = Path("templates/imports")
    
    if not templates_dir.exists():
        print(f"❌ Templates directory not found: {templates_dir}")
        return
    
    template_files = list(templates_dir.glob("*_instances.json"))
    
    if not template_files:
        print(f"⚠️  No template files found in {templates_dir}")
        return
    
    print(f"\n📚 Found {len(template_files)} template file(s):")
    for tf in template_files:
        print(f"  • {tf.name}")
    
    # Process each template
    all_generated = []
    total_instances = 0
    
    for template_file in template_files:
        files, count = process_template(str(template_file))
        all_generated.extend(files)
        total_instances += count
    
    print("\n" + "=" * 70)
    print(f"✅ Generation Complete:")
    print(f"  • Files generated: {len(all_generated)}")
    print(f"  • Total instances: {total_instances}")
    print("=" * 70)
    
    # Ask user if they want to import
    print("\n🤔 Do you want to import these into coffeeland.rdf?")
    print("   (This will add all generated instances to the main ontology)")
    response = input("   Import now? [y/N]: ").strip().lower()
    
    if response == 'y':
        import_all_generated()
    else:
        print("\n📌 Skipped import. Files are ready in generated_imports/")
        print("   To import later, run:")
        print("   python3 scripts/generate_imports.py --import-only")
    
    print("\n" + "=" * 70)
    print("✅ Done!")
    print("\nGenerated files location: generated_imports/")
    print("Next steps:")
    print("  1. Review generated RDF files")
    print("  2. Import into Protégé or use import_all_generated()")
    print("  3. Validate in Protégé Individuals tab")
    print("=" * 70)


if __name__ == "__main__":
    import sys
    
    # Check for import-only flag
    if len(sys.argv) > 1 and sys.argv[1] == "--import-only":
        print("🚀 Import-Only Mode")
        import_all_generated()
    else:
        main()
