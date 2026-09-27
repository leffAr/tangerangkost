import re

with open('apps/api/prisma/schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("token     String   @unique", "token     String   @db.Text")

with open('apps/api/prisma/schema.prisma', 'w', encoding='utf-8') as f:
    f.write(content)
