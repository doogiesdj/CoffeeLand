#!/usr/bin/env python3
"""
Insert Port and Warehouse individuals into coffeeland.rdf
"""

# Read the original coffeeland.rdf
with open('coffeeland-react/public/coffeeland.rdf', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Read the individuals to insert
with open('port_warehouse_individuals_only.txt', 'r', encoding='utf-8') as f:
    individuals = f.read()

# Find the insertion point (before line 1900, which is "<!-- http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#Volcafe(ED&FMan) -->")
insertion_point = None
for i, line in enumerate(lines):
    if 'Volcafe(ED&amp;FMan)' in line and '<!--' in line:
        insertion_point = i
        break

if insertion_point is None:
    print("❌ Could not find insertion point")
    exit(1)

print(f"✅ Found insertion point at line {insertion_point + 1}")

# Insert the individuals
new_lines = lines[:insertion_point]
new_lines.append("\n    <!-- \n    ///////////////////////////////////////////////////////////////////////////////////////\n    //\n    // Port and Warehouse Individuals\n    //\n    ///////////////////////////////////////////////////////////////////////////////////////\n     -->\n\n")
new_lines.append(individuals)
new_lines.append("\n\n")
new_lines.extend(lines[insertion_point:])

# Write the new file
with open('coffeeland-react/public/coffeeland.rdf', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"✅ Successfully inserted {len(individuals.splitlines())} lines")
print(f"✅ New file has {len(new_lines)} lines")
print("\n🎯 Port and Warehouse individuals have been added to coffeeland.rdf")
print("\n📝 Next steps:")
print("   1. Open Protégé")
print("   2. Open the updated coffeeland.rdf")
print("   3. Go to Individuals tab")
print("   4. Select Port class → should see 15 individuals")
print("   5. Select Warehouse class → should see 20 individuals")
