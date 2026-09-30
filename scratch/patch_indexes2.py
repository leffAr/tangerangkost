import re

path = 'apps/api/prisma/schema.prisma'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# For Kos
content = re.sub(
    r'(model Kos \{[\s\S]*?)(  kosType     KosType       @default\(STANDAR\))',
    r'\1  @@index([name])\n  @@index([regency, district])\n  @@index([priceFrom])\n  @@index([genderType])\n\n\2',
    content
)

# For KosImage
content = re.sub(
    r'(model KosImage \{[\s\S]*?)(  order     Int      @default\(0\))',
    r'\1  @@index([kosId])\n\n\2',
    content
)

# For Review
content = re.sub(
    r'(model Review \{[\s\S]*?)(  rating    Int)',
    r'\1  @@index([kosId])\n  @@index([rating])\n\n\2',
    content
)

# For Favorite
content = re.sub(
    r'(model Favorite \{[\s\S]*?)(  @@id\(\[userId, kosId\]\))',
    r'\1  @@index([kosId])\n\n\2',
    content
)

# For User
content = re.sub(
    r'(model User \{[\s\S]*?)(  role          Role          @default\(USER\))',
    r'\1  @@index([role])\n\n\2',
    content
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
