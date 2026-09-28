import re

path = 'apps/api/prisma/schema.prisma'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "kosType     KosType       @default(STANDAR)",
    "kosType     KosType       @default(STANDAR)\n  availableRooms Int        @default(0)"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
