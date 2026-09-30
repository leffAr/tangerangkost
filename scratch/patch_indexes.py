import re

path_schema = 'apps/api/prisma/schema.prisma'
with open(path_schema, 'r', encoding='utf-8') as f:
    content = f.read()

# Add indexes to Kos
target_kos = r'(kosType     KosType       @default\(STANDAR\)\n\s+createdAt   DateTime      @default\(now\(\)\)\n\s+updatedAt   DateTime      @updatedAt\n\n\s+kosImages   KosImage\[\]\n\s+rooms       Room\[\]\n\s+facilities  KosFacility\[\]\n\s+reviews     Review\[\]\n\s+favorites   Favorite\[\]\n\s+reports     Report\[\]\n)'
replacement_kos = r'\1\n  @@index([name])\n  @@index([regency, district])\n  @@index([priceFrom])\n  @@index([genderType])\n  @@index([createdAt])\n'
content = re.sub(target_kos, replacement_kos, content)

# Add indexes to KosImage
target_img = r'(createdAt DateTime @default\(now\(\)\)\n\s+updatedAt DateTime @updatedAt\n)'
replacement_img = r'\1\n  @@index([kosId])\n  @@index([order])\n'
content = re.sub(target_img, replacement_img, content)

# Add indexes to Review
target_rev = r'(updatedAt DateTime @updatedAt\n)'
replacement_rev = r'\1\n  @@index([kosId])\n  @@index([rating])\n'
content = re.sub(target_rev, replacement_rev, content)

# Add index to Favorite
target_fav = r'(@@id\(\[userId, kosId\]\)\n)'
replacement_fav = r'\1  @@index([kosId])\n'
content = re.sub(target_fav, replacement_fav, content)

# Add index to User
target_user = r'(bookings      Booking\[\]\n)'
replacement_user = r'\1\n  @@index([role])\n'
content = re.sub(target_user, replacement_user, content)

with open(path_schema, 'w', encoding='utf-8') as f:
    f.write(content)
