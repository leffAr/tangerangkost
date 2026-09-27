import re

with open('apps/web/src/app/admin/settings/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'<div className="flex items-center gap-4">\s*<Link href="/admin" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600 flex-shrink-0" title="Kembali ke Dashboard">\s*<ArrowLeft className="w-5 h-5" />\s*</Link>\s*<div>\s*<h1 className="text-2xl font-bold text-gray-900 mb-1">Pengaturan Situs</h1>\s*<p className="text-gray-500 text-sm md:text-base">Kelola informasi kontak dan pengaturan umum situs Anda.</p>\s*</div>\s*</div>'

replacement = """<div className="flex flex-col gap-3">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Pengaturan Situs</h1>
          <p className="text-gray-500 text-sm md:text-base">Kelola informasi kontak dan pengaturan umum situs Anda.</p>
        </div>
      </div>"""

content = re.sub(target, replacement, content)

with open('apps/web/src/app/admin/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
