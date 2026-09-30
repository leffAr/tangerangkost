import re

# 1. Update user/profile/page.tsx
path_profile = 'apps/web/src/app/user/profile/page.tsx'
with open(path_profile, 'r', encoding='utf-8') as f:
    content_profile = f.read()

# Add ArrowLeft to imports and Link if missing
if 'ArrowLeft' not in content_profile:
    content_profile = content_profile.replace("import { UserCircle } from 'lucide-react';", "import { UserCircle, ArrowLeft } from 'lucide-react';")
if "import Link from 'next/link';" not in content_profile:
    content_profile = content_profile.replace("import { UserCircle, ArrowLeft } from 'lucide-react';", "import { UserCircle, ArrowLeft } from 'lucide-react';\nimport Link from 'next/link';")

target_profile = r'(<div className="max-w-2xl mx-auto py-8">)'
replacement_profile = r'\1\n        <Link href="/user" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00288E] transition-colors mb-4">\n          <ArrowLeft className="w-4 h-4 mr-2" />\n          Kembali ke Dashboard\n        </Link>'
content_profile = re.sub(target_profile, replacement_profile, content_profile)

with open(path_profile, 'w', encoding='utf-8') as f:
    f.write(content_profile)


# 2. Update user/favorites/page.tsx
path_fav = 'apps/web/src/app/user/favorites/page.tsx'
with open(path_fav, 'r', encoding='utf-8') as f:
    content_fav = f.read()

if 'ArrowLeft' not in content_fav:
    content_fav = content_fav.replace("import { MapPin, Heart } from 'lucide-react';", "import { MapPin, Heart, ArrowLeft } from 'lucide-react';")

target_fav = r'(<div>\s*<div className="mb-8">)'
replacement_fav = r'<div>\n      <Link href="/user" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00288E] transition-colors mb-4">\n        <ArrowLeft className="w-4 h-4 mr-2" />\n        Kembali ke Dashboard\n      </Link>\n      <div className="mb-8">'
content_fav = re.sub(target_fav, replacement_fav, content_fav)

with open(path_fav, 'w', encoding='utf-8') as f:
    f.write(content_fav)
