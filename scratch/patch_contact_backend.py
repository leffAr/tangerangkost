import re

# 1. Update contact.service.ts
with open('apps/api/src/contact/contact.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("email: string;", "phone: string;")
content = content.replace("email, subject", "phone, subject") # Just in case

with open('apps/api/src/contact/contact.service.ts', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update contact.controller.ts
with open('apps/api/src/contact/contact.controller.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("email: string;", "phone: string;")

# Add JwtAuthGuard to Post
if '@UseGuards(JwtAuthGuard)' not in content.split('@Post()')[0] and '@Post()' in content:
    content = content.replace("@Post()", "@UseGuards(JwtAuthGuard)\n  @Post()")

with open('apps/api/src/contact/contact.controller.ts', 'w', encoding='utf-8') as f:
    f.write(content)
