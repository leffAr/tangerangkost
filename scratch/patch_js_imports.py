import re

# Fix rooms.module.ts
with open('apps/api/src/rooms/rooms.module.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("from './rooms.service.js'", "from './rooms.service'")
content = content.replace("from './rooms.controller.js'", "from './rooms.controller'")

with open('apps/api/src/rooms/rooms.module.ts', 'w', encoding='utf-8') as f:
    f.write(content)

# Fix app.controller.ts
with open('apps/api/src/app.controller.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("from './app.service.js'", "from './app.service'")

with open('apps/api/src/app.controller.ts', 'w', encoding='utf-8') as f:
    f.write(content)

# Fix auth.module.ts (just in case)
import os
def scan_and_fix(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace any relative import ending in .js with nothing
                # e.g., from './something.js' -> from './something'
                new_content = re.sub(r"from '(\./[^']+)\.js'", r"from '\1'", content)
                new_content = re.sub(r"from '(\.\./[^']+)\.js'", r"from '\1'", new_content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                        print(f"Fixed {filepath}")

scan_and_fix('apps/api/src')
