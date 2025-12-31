# 🔄 CoffeeLand Universal Ontology Instance Import System

## 📋 Overview

This system provides a **reusable, scalable mechanism** for adding instances to the CoffeeLand ontology without manually editing `coffeeland.rdf`. It supports:

✅ **JSON-based templates** for structured data  
✅ **CSV-to-RDF conversion** for bulk data  
✅ **Automated batch import** into main ontology  
✅ **All subclasses** under MarketAndEconomics, Organization, and QualityAndProcessing

---

## 🎯 Problem Solved

**Before**: Farm instances disappeared when adding Port/Warehouse data  
**After**: Automated import system that safely adds instances without data loss

---

## 📁 Directory Structure

```
/home/user/webapp/
├── coffeeland-react/public/
│   └── coffeeland.rdf              # Main ontology (DO NOT EDIT MANUALLY)
├── templates/
│   ├── imports/                    # JSON templates
│   │   ├── market_economics_instances.json
│   │   ├── organization_instances.json
│   │   └── quality_processing_instances.json
│   └── csv_sources/                # CSV data sources
│       ├── farmers.csv
│       ├── cooperatives.csv
│       ├── certifications.csv
│       ├── processing_methods.csv
│       ├── retailers.csv
│       └── roasters.csv
├── scripts/
│   ├── generate_imports.py         # JSON → RDF generator
│   └── csv_to_rdf.py               # CSV → RDF converter
├── generated_imports/              # Generated RDF files (auto-created)
└── restore_and_import_ontology.py  # Core import engine
```

---

## 🚀 Quick Start

### Step 1: Restore Farm Instances (Already Done ✅)

```bash
cd /home/user/webapp
python3 restore_and_import_ontology.py
```

**Result**: 24 Farm instances restored to coffeeland.rdf

---

### Step 2: Generate Instances from JSON Templates

```bash
cd /home/user/webapp
python3 scripts/generate_imports.py
```

**What it does**:
- Reads all JSON templates in `templates/imports/`
- Generates RDF files in `generated_imports/`
- Optionally imports into `coffeeland.rdf`

**Classes covered**:
- **MarketAndEconomics**: Consumer, Price, Season, TradeAgreement
- **Organization**: Cooperative, Farmer, ProcessingMill, Retailer, Roaster
- **QualityAndProcessing**: Certification, ProcessingMethod, QualityGrade

---

### Step 3: Generate Instances from CSV Files

```bash
cd /home/user/webapp
python3 scripts/csv_to_rdf.py
```

**What it does**:
- Converts all CSV files in `templates/csv_sources/` to RDF
- Outputs to `generated_imports/`

**CSV files included**:
- `farmers.csv` → Farmer instances
- `cooperatives.csv` → Cooperative instances
- `certifications.csv` → Certification instances
- `processing_methods.csv` → ProcessingMethod instances
- `retailers.csv` → Retailer instances
- `roasters.csv` → Roaster instances

---

### Step 4: Import into Protégé

**Option A: Automated Import (Recommended)**

```bash
python3 scripts/generate_imports.py
# When prompted, type 'y' to import
```

**Option B: Manual Import in Protégé**

1. Open Protégé
2. Load `coffeeland.rdf`
3. Active Ontology tab → [+] button
4. Select RDF file from `generated_imports/`
5. Save

---

## 📝 Template Format

### JSON Template Example

```json
{
  "description": "Template description",
  "classes": {
    "ClassName": {
      "class_name": "ClassName",
      "instances": [
        {
          "id": "ClassName_UniqueID",
          "properties": {
            "hasName": "Instance Name",
            "propertyName": "value",
            "objectProperty": {"resource": "ReferencedClass_ID"},
            "multipleValues": [
              {"resource": "Value1"},
              {"resource": "Value2"}
            ],
            "numericProperty": 100
          }
        }
      ]
    }
  }
}
```

### CSV Template Example

```csv
name,country,region,farmSize,experienceYears,certification
John Doe,USA,California,10,15,Organic|Fair_Trade
```

**Property Mappings** (defined in `scripts/csv_to_rdf.py`):
```python
'property_mappings': {
    'name': 'hasName',
    'country': 'hasCountry',
    'region': 'hasRegion',
    'farmSize': 'farmSize',
    'experienceYears': 'experienceYears',
    'certification': 'certifications'  # Pipe-separated → multiple values
}
```

---

## 🔧 Advanced Usage

### Add Custom Class

1. **Create JSON template** in `templates/imports/`:

```json
{
  "description": "My custom class instances",
  "classes": {
    "MyClass": {
      "class_name": "MyClass",
      "instances": [
        {
          "id": "MyClass_Instance1",
          "properties": {
            "hasName": "Instance 1",
            "customProperty": "value"
          }
        }
      ]
    }
  }
}
```

2. **Generate RDF**:

```bash
python3 scripts/generate_imports.py
```

3. **Import**:
   - Automated: Answer 'y' when prompted
   - Manual: Import via Protégé

---

### Add Custom CSV Source

1. **Create CSV file** in `templates/csv_sources/myclass.csv`:

```csv
name,property1,property2
Instance1,Value1,Value2
Instance2,Value3,Value4
```

2. **Add mapping** in `scripts/csv_to_rdf.py`:

```python
CSV_MAPPINGS = {
    # ... existing mappings ...
    'MyClass': {
        'csv_file': 'myclass.csv',
        'class_name': 'MyClass',
        'property_mappings': {
            'name': 'hasName',
            'property1': 'property1',
            'property2': 'property2'
        },
        'id_field': 'name'
    }
}
```

3. **Convert**:

```bash
python3 scripts/csv_to_rdf.py MyClass
```

---

## 📊 Instance Summary

### Current Ontology Content (After Restoration)

| Class | Instances | Source |
|-------|-----------|--------|
| **Farm** | 24 | coffee_farms_individuals.rdf |
| **Port** | 15 | coffee_ports_individuals.rdf |
| **Warehouse** | 20 | coffee_warehouses_individuals.rdf |
| **Total** | **59** | Existing |

### Available via Templates

#### MarketAndEconomics (10 instances)
- **Consumer**: 3 instances
- **Price**: 2 instances
- **Season**: 3 instances
- **TradeAgreement**: 2 instances

#### Organization (18 instances)
- **Cooperative**: 3 instances
- **Farmer**: 3 instances
- **ProcessingMill**: 2 instances
- **Retailer**: 2 instances
- **Roaster**: 3 instances

#### QualityAndProcessing (18 instances)
- **Certification**: 5 instances
- **ProcessingMethod**: 5 instances
- **QualityGrade**: 5 instances

### CSV Sources (Additional 39+ instances)
- **Farmer**: 7 instances
- **Cooperative**: 6 instances
- **Certification**: 6 instances
- **ProcessingMethod**: 6 instances
- **Retailer**: 7 instances
- **Roaster**: 7 instances

**Grand Total Possible**: **105+ instances**

---

## 🛠️ API Reference

### `OntologyInstanceManager`

```python
from restore_and_import_ontology import OntologyInstanceManager

manager = OntologyInstanceManager("path/to/coffeeland.rdf")

# Import individuals from RDF file
manager.import_individuals("source.rdf")

# Backup ontology
manager.backup_ontology()
```

### `UniversalInstanceGenerator`

```python
from restore_and_import_ontology import UniversalInstanceGenerator

generator = UniversalInstanceGenerator(namespace="http://...")

# Generate from JSON
generator.generate_from_json("template.json", "output.rdf")

# Generate from CSV
generator.generate_from_csv(
    csv_file="data.csv",
    class_name="MyClass",
    output_file="output.rdf",
    property_mappings={'col1': 'prop1'}
)
```

---

## ✅ Validation Checklist

After importing:

1. **Open Protégé**
2. **Load coffeeland.rdf**
3. **Check Individuals tab**:
   - Farm: 24 instances ✅
   - Port: 15 instances ✅
   - Warehouse: 20 instances ✅
   - Consumer: 3 instances ✅
   - Certification: 5 instances ✅
   - ProcessingMethod: 5 instances ✅
   - (etc.)
4. **Start Reasoner**: Ensure no inconsistencies
5. **Verify properties**: Click an instance, check Object/Data properties

---

## 🔄 Workflow Summary

```
1. CREATE DATA
   ├─ JSON template (structured, detailed)
   └─ CSV file (bulk, simple)
         ↓
2. GENERATE RDF
   ├─ scripts/generate_imports.py (JSON)
   └─ scripts/csv_to_rdf.py (CSV)
         ↓
3. OUTPUT
   └─ generated_imports/*.rdf
         ↓
4. IMPORT
   ├─ Automated: generate_imports.py --import-only
   └─ Manual: Protégé → Active Ontology → Import
         ↓
5. VALIDATE
   └─ Protégé → Individuals tab → Reasoner
```

---

## 🎯 Best Practices

1. **Always backup** before importing (automatic with scripts)
2. **Use JSON** for complex instances with multiple relationships
3. **Use CSV** for bulk data with simple properties
4. **Validate in Protégé** after each import
5. **Keep templates** for reproducibility
6. **Document custom mappings** in CSV_MAPPINGS

---

## 🐛 Troubleshooting

### Issue: "No instances found in CSV"
**Solution**: Check CSV header names match property mappings

### Issue: "Farm instances disappeared"
**Solution**: Run `restore_and_import_ontology.py` to restore

### Issue: "XML parsing error"
**Solution**: Ensure RDF files have valid XML structure

### Issue: "Reasoner shows inconsistencies"
**Solution**: Check that referenced individuals exist (e.g., countries, varieties)

---

## 📚 Related Files

- **Main ontology**: `coffeeland-react/public/coffeeland.rdf`
- **Backup**: `coffeeland-react/public/coffeeland.rdf.backup`
- **Individual files**: `coffee_*_individuals.rdf`
- **Documentation**: 
  - `FINAL_SOLUTION_PORT_WAREHOUSE.txt`
  - `PORT_WAREHOUSE_FIX_GUIDE.txt`
  - `PROTEGE_IMPORT_CORRECT_METHOD.txt`

---

## 🔗 Namespace

All instances use the namespace:
```
http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#
```

---

## 📞 Support

For issues or questions:
1. Check `generated_imports/` for output files
2. Review Protégé console for error messages
3. Validate RDF syntax with online validators
4. Check backup files if data is lost

---

## 🎉 Success!

You now have a **complete, reusable system** for managing ontology instances!

**Next steps**:
1. ✅ Farm instances restored
2. 📦 Templates ready for 12+ subclasses
3. 🔄 Automated import workflow
4. 📝 Documentation complete

**Happy ontology building! 🚀☕**
