import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken href
target1 = r'<a href=\{`https://wa\.me/\$\{contactSettings\.whatsapp\.replace\(/\\D/g,\'\'`\} target="_blank"'
replacement1 = r'<a href={`https://wa.me/${contactSettings?.whatsapp?.replace(/\\D/g,\'\') || \'\'}`} target="_blank"'

content = re.sub(target1, replacement1, content)

# Fix the second broken href
target2 = r'<a href=\{`https://wa\.me/\$\{\(contactSettings\?\.whatsapp \|\| \'6281234567890\'\)\.replace\(/\\D/g,\'\'\)\}`\}'
replacement2 = r'<a href={`https://wa.me/${(contactSettings?.whatsapp || \'6281234567890\').replace(/\\D/g,\'\')}`} '

content = re.sub(target2, replacement2, content)

# Actually, the easiest way to fix it is to do a manual replace of the broken line.
# Let's find exactly what is broken.
# "contactSettings.whatsapp.replace(/\D/g,''"
content = content.replace("contactSettings.whatsapp.replace(/\\D/g,''} target=\"_blank\"", "contactSettings?.whatsapp?.replace(/\\D/g,'') || ''}`} target=\"_blank\"")
content = content.replace("contactSettings.whatsapp.replace(/\\D/g,''`} target=\"_blank\"", "contactSettings?.whatsapp?.replace(/\\D/g,'') || ''}`} target=\"_blank\"")


with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
