# 🎉 Farm Instances Restored + Universal Import System

## Problem Solved

**Issue**: Farm instances disappeared from coffeeland.rdf when Port/Warehouse data was added.

**Solution**: 
1. ✅ Restored all 24 Farm instances 
2. ✅ Created universal import system to prevent future data loss
3. ✅ Provided templates for ALL requested subclasses

---

## 📊 Current Ontology Status

**File**: `coffeeland-react/public/coffeeland.rdf`  
**Total Individuals**: 375

| Class | Count | Status |
|-------|-------|--------|
| Farm | 24 | ✅ Restored |
| Port | 15 | ✅ Present |
| Warehouse | 20 | ✅ Present |
| Others | 316 | ✅ Present |

### Download Latest Ontology
```
https://5173-iq167hrnwb18xvsq7sd61-de59bda9.sandbox.novita.ai/coffeeland.rdf
```

---

## 🚀 Universal Import System

Instead of manually editing `coffeeland.rdf`, use this automated system:

### Features
- ✅ **JSON Templates**: Structured data with relationships
- ✅ **CSV Templates**: Bulk data import
- ✅ **Automation Scripts**: Convert templates → RDF
- ✅ **Safe Import**: Automatic backup, no data loss
- ✅ **Extensible**: Easy to add custom classes

### Coverage (12 Subclasses)

#### MarketAndEconomics (4 subclasses)
- Consumer ✅
- Price ✅
- Season/Harvest ✅
- TradeAgreement ✅

#### Organization (5 subclasses)
- Cooperative ✅
- Farmer ✅
- ProcessingMill ✅
- Retailer ✅
- Roaster ✅

#### QualityAndProcessing (3 subclasses)
- Certification ✅
- ProcessingMethod ✅
- QualityGrade ✅

---

## 📥 Quick Start

### Verify Farm Restoration

1. Download `coffeeland.rdf` (link above)
2. Open in Protégé
3. Go to **Individuals** tab
4. Select **Farm** class
5. Verify 24 instances appear

Expected instances:
- Farm_Yirgacheffe_Kochere_Farm
- Farm_Sidamo_Guji_Farm
- Farm_Harrar_Estate
- ... (21 more)

### Import Additional Instances

```bash
cd /home/user/webapp

# Import all generated instances
python3 scripts/generate_imports.py --import-only
```

Or manually in Protégé:
1. Open `coffeeland.rdf`
2. **Active Ontology** tab → **[+]** button
3. Select file from `generated_imports/`
4. Save

---

## 📁 Directory Structure

```
/home/user/webapp/
│
├── coffeeland-react/public/
│   ├── coffeeland.rdf          ← Main ontology (375 individuals)
│   ├── coffeeland.rdf.backup   ← Automatic backup
│   │
│   ├── templates/
│   │   ├── imports/            ← JSON templates
│   │   └── csv_sources/        ← CSV templates
│   │
│   ├── scripts/
│   │   ├── generate_imports.py ← JSON → RDF
│   │   └── csv_to_rdf.py       ← CSV → RDF
│   │
│   └── generated_imports/      ← Ready-to-import RDF files
│       └── (12 files, 56 instances)
│
└── restore_and_import_ontology.py  ← Core engine
```

---

## 🎯 Usage Guide

### Method 1: Use JSON Templates

1. **Edit template** (or create new):
   ```bash
   nano templates/imports/organization_instances.json
   ```

2. **Generate RDF**:
   ```bash
   python3 scripts/generate_imports.py
   ```

3. **Import**:
   - Automatic: Answer 'y' when prompted
   - Manual: Import via Protégé

### Method 2: Use CSV Files

1. **Edit CSV** (or create new):
   ```bash
   nano templates/csv_sources/farmers.csv
   ```

2. **Convert to RDF**:
   ```bash
   python3 scripts/csv_to_rdf.py
   ```

3. **Import** (same as above)

### Method 3: Direct Import (Existing Files)

56 instances already generated in `generated_imports/`:

```bash
# Import all at once
python3 scripts/generate_imports.py --import-only

# Or import selectively via Protégé
```

---

## 📦 Ready-to-Import Instances

All files are in `generated_imports/`:

| File | Instances | Class |
|------|-----------|-------|
| certification_individuals.rdf | 6 | Certification |
| consumer_individuals.rdf | 3 | Consumer |
| cooperative_individuals.rdf | 6 | Cooperative |
| farmer_individuals.rdf | 7 | Farmer |
| price_individuals.rdf | 2 | Price |
| processingmethod_individuals.rdf | 6 | ProcessingMethod |
| processingmill_individuals.rdf | 2 | ProcessingMill |
| qualitygrade_individuals.rdf | 5 | QualityGrade |
| retailer_individuals.rdf | 7 | Retailer |
| roaster_individuals.rdf | 7 | Roaster |
| season_individuals.rdf | 3 | Season |
| tradeagreement_individuals.rdf | 2 | TradeAgreement |
| **Total** | **56** | — |

---

## 🎓 Adding Custom Instances

### Option A: JSON Template

Create `templates/imports/my_custom.json`:

```json
{
  "description": "My custom instances",
  "classes": {
    "MyClass": {
      "class_name": "MyClass",
      "instances": [
        {
          "id": "MyClass_Instance1",
          "properties": {
            "hasName": "Instance 1",
            "hasCountry": {"resource": "USA"},
            "numericProp": 100
          }
        }
      ]
    }
  }
}
```

Then: `python3 scripts/generate_imports.py`

### Option B: CSV Template

Create `templates/csv_sources/myclass.csv`:

```csv
name,country,property1
Instance1,USA,Value1
Instance2,Brazil,Value2
```

Edit `scripts/csv_to_rdf.py` to add mapping:

```python
CSV_MAPPINGS = {
    'MyClass': {
        'csv_file': 'myclass.csv',
        'class_name': 'MyClass',
        'property_mappings': {
            'name': 'hasName',
            'country': 'hasCountry',
            'property1': 'property1'
        },
        'id_field': 'name'
    }
}
```

Then: `python3 scripts/csv_to_rdf.py`

---

## 📚 Documentation

- **Full Guide**: [ONTOLOGY_IMPORT_SYSTEM_GUIDE.md](ONTOLOGY_IMPORT_SYSTEM_GUIDE.md)
- **Validation Report**: [VALIDATION_REPORT.txt](VALIDATION_REPORT.txt)
- **Quick Summary**: [QUICK_SUMMARY.txt](QUICK_SUMMARY.txt)

### Online Access

All files available at:
```
https://5173-iq167hrnwb18xvsq7sd61-de59bda9.sandbox.novita.ai/
```

---

## ✅ Validation Checklist

- [✅] Farm instances restored (24)
- [✅] Port instances present (15)
- [✅] Warehouse instances present (20)
- [✅] Total individuals correct (375)
- [✅] JSON templates working
- [✅] CSV templates working
- [✅] Automation scripts functional
- [✅] Documentation complete
- [✅] All changes committed to Git

---

## 🔧 Core Components

### `restore_and_import_ontology.py`

Main import engine with two key classes:

```python
# Import manager
manager = OntologyInstanceManager("coffeeland.rdf")
manager.import_individuals("source.rdf")

# Instance generator
generator = UniversalInstanceGenerator(namespace)
generator.generate_from_json("template.json", "output.rdf")
generator.generate_from_csv("data.csv", "MyClass", "output.rdf", mappings)
```

### `scripts/generate_imports.py`

Batch processor for JSON templates:

```bash
# Generate all
python3 scripts/generate_imports.py

# Import only (skip generation)
python3 scripts/generate_imports.py --import-only
```

### `scripts/csv_to_rdf.py`

CSV to RDF converter:

```bash
# Convert all CSVs
python3 scripts/csv_to_rdf.py

# Convert specific class
python3 scripts/csv_to_rdf.py Farmer
```

---

## 🐛 Troubleshooting

### Issue: Instances not appearing in Protégé

**Solution**:
1. Reload ontology (File → Reload)
2. Start Reasoner
3. Refresh Individuals tab

### Issue: Import fails with XML error

**Solution**:
1. Validate RDF file syntax
2. Check for duplicate IDs
3. Ensure all referenced individuals exist

### Issue: Farm instances still missing

**Solution**:
1. Check backup: `coffeeland.rdf.backup`
2. Re-run: `python3 restore_and_import_ontology.py`
3. Verify in Protégé

---

## 📈 Statistics

### Current State
- **Individuals in ontology**: 375
- **Farm instances**: 24 ✅
- **Port instances**: 15 ✅
- **Warehouse instances**: 20 ✅

### Available to Import
- **JSON templates**: 38 instances
- **CSV templates**: 39 instances
- **Generated RDF**: 56 instances
- **Potential total**: 431+ individuals

### Files Created
- **Core scripts**: 3
- **Templates**: 9 (3 JSON + 6 CSV)
- **Generated RDF**: 12
- **Documentation**: 3
- **Total**: 27 files

---

## 🔗 Links

- **GitHub Repository**: https://github.com/doogiesdj/CoffeeLand
- **Latest Commit**: db2bb2f
- **Commit Message**: "docs: Add quick summary for Farm restoration and import system"

### Download URLs
- Ontology: `/coffeeland.rdf`
- Templates: `/templates/`
- Generated: `/generated_imports/`
- Scripts: `/scripts/`
- Docs: `/ONTOLOGY_IMPORT_SYSTEM_GUIDE.md`

*(All relative to: https://5173-iq167hrnwb18xvsq7sd61-de59bda9.sandbox.novita.ai/)*

---

## 🎉 Success Summary

✅ **Problem**: Farm instances were lost  
✅ **Solution**: Restored + reusable import system  
✅ **Result**: 375 individuals, 56 more ready to import  
✅ **Future-proof**: Templates for 12+ subclasses  
✅ **Automated**: No manual RDF editing needed  

**You now have a complete, production-ready ontology management system!** 🚀☕

---

*Last updated: 2025-12-31*  
*Version: 1.0.0*  
*Status: Complete and tested*
