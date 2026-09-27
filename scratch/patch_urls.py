import os
import glob

files = glob.glob('apps/web/src/**/*.tsx', recursive=True)
files += glob.glob('apps/web/src/**/*.ts', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '192.168.137.1:3000' in content:
        content = content.replace('http://192.168.137.1:3000', 'https://tangerangkost.onrender.com')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {file}")
