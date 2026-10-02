import re

path = 'apps/api/src/auth/auth.controller.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the incorrect fallback Vercel URL
content = content.replace(
    "'https://tangerangkost.vercel.app/dashboard'",
    "'https://tangerangkost-web.vercel.app/dashboard'"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
