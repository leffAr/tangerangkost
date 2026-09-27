import re

with open('apps/web/src/app/admin/settings/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add imports
target_import1 = r"import \{ Save, Phone, Mail, MapPin, Image as ImageIcon, Upload \} from 'lucide-react';"
replacement_import1 = "import { Save, Phone, Mail, MapPin, Image as ImageIcon, Upload, ArrowLeft } from 'lucide-react';\nimport Link from 'next/link';"
content = re.sub(target_import1, replacement_import1, content)

# 2. Add Back button in the JSX
target_jsx = r"""<div>\s*<h1 className="text-2xl font-bold text-gray-900 mb-2">Pengaturan Situs</h1>\s*<p className="text-gray-500">Kelola informasi kontak dan pengaturan umum situs Anda.</p>\s*</div>"""
replacement_jsx = """<div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600 flex-shrink-0" title="Kembali ke Dashboard">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Pengaturan Situs</h1>
          <p className="text-gray-500 text-sm md:text-base">Kelola informasi kontak dan pengaturan umum situs Anda.</p>
        </div>
      </div>"""
content = re.sub(target_jsx, replacement_jsx, content)

with open('apps/web/src/app/admin/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
