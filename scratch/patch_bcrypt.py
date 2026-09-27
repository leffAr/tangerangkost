import json
import os
import glob

# 1. Edit package.json
with open('apps/api/package.json', 'r') as f:
    pkg = json.load(f)

if 'bcrypt' in pkg['dependencies']:
    del pkg['dependencies']['bcrypt']
pkg['dependencies']['bcryptjs'] = '^2.4.3'

if 'devDependencies' in pkg and '@types/bcrypt' in pkg['devDependencies']:
    del pkg['devDependencies']['@types/bcrypt']
if 'devDependencies' not in pkg:
    pkg['devDependencies'] = {}
pkg['devDependencies']['@types/bcryptjs'] = '^2.4.6'

with open('apps/api/package.json', 'w') as f:
    json.dump(pkg, f, indent=2)

# 2. Edit all files importing bcrypt
files_to_check = glob.glob('apps/api/src/**/*.ts', recursive=True) + glob.glob('apps/api/prisma/**/*.ts', recursive=True)
for filepath in files_to_check:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "from 'bcrypt'" in content or "from \"bcrypt\"" in content:
        content = content.replace("from 'bcrypt'", "from 'bcryptjs'")
        content = content.replace("from \"bcrypt\"", "from 'bcryptjs'")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {filepath}")

print("Done")
