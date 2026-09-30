import re

# 1. Update backend admin.service.ts
path_service = 'apps/api/src/admin/admin.service.ts'
with open(path_service, 'r', encoding='utf-8') as f:
    service_content = f.read()

# Replace getUsers select object
service_target = r"select:\s*\{\s*id:\s*true,\s*name:\s*true,\s*email:\s*true,\s*role:\s*true,\s*createdAt:\s*true,\s*\}"
service_replacement = """select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        }"""
service_content = re.sub(service_target, service_replacement, service_content)

with open(path_service, 'w', encoding='utf-8') as f:
    f.write(service_content)

# 2. Update frontend apps/web/src/app/admin/users/page.tsx
path_page = 'apps/web/src/app/admin/users/page.tsx'
with open(path_page, 'r', encoding='utf-8') as f:
    page_content = f.read()

# Add MessageCircle to imports
if 'MessageCircle' not in page_content:
    page_content = page_content.replace(
        "import { ArrowLeft, Trash2, Shield, User, Store, Edit3, X, Save } from 'lucide-react';",
        "import { ArrowLeft, Trash2, Shield, User, Store, Edit3, X, Save, MessageCircle } from 'lucide-react';"
    )

# Add WhatsApp button under email
page_target = r'<p className="text-sm text-gray-500 truncate" title=\{user\.email\}>\{user\.email\}</p>'
page_replacement = """<p className="text-sm text-gray-500 truncate" title={user.email}>{user.email}</p>
                    {user.phone && user.role === 'OWNER' && (
                      <a 
                        href={`https://wa.me/${user.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-green-700 bg-green-100 hover:bg-green-200 px-2 py-1 rounded-md w-fit transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Chat via WA ({user.phone})
                      </a>
                    )}"""
page_content = re.sub(page_target, page_replacement, page_content)

with open(path_page, 'w', encoding='utf-8') as f:
    f.write(page_content)
