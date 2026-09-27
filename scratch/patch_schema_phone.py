import re

with open('apps/api/prisma/schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("  email     String\n  subject", "  phone     String\n  subject")

with open('apps/api/prisma/schema.prisma', 'w', encoding='utf-8') as f:
    f.write(content)
