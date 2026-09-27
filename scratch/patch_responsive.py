import re

with open('apps/web/src/app/admin/settings/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add react-hot-toast import
if 'react-hot-toast' not in content:
    content = content.replace("import { Button } from '@/components/ui/button';", "import { Button } from '@/components/ui/button';\nimport toast from 'react-hot-toast';")

# Fix About layout responsiveness
content = content.replace('<div className="flex gap-6 items-start">', '<div className="flex flex-col md:flex-row gap-6 items-start">')
content = content.replace('<div className="w-1/2 aspect-video bg-gray-100', '<div className="w-full md:w-1/2 aspect-video bg-gray-100')
content = content.replace('<div className="w-1/2 space-y-4">', '<div className="w-full md:w-1/2 space-y-4">')

# Fix Hero URL input responsiveness
content = content.replace('<div className="mt-4 flex gap-2 items-center">', '<div className="mt-4 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">')

# Replace setMessage with toast for Contact
content = re.sub(
    r'setMessage\(\'Pengaturan kontak berhasil diperbarui!\'\);\n\s*setTimeout\(\(\) => setMessage\(\'\'\), 3000\);',
    r"toast.success('Pengaturan kontak berhasil diperbarui!');",
    content
)
content = re.sub(
    r'setMessage\(\'Gagal memperbarui pengaturan kontak\.\'\);',
    r"toast.error('Gagal memperbarui pengaturan kontak.');",
    content
)

# Replace setMessage with toast for About
content = re.sub(
    r'setMessage\(\'Gambar Tentang Kami berhasil diperbarui!\'\);\n\s*setTimeout\(\(\) => setMessage\(\'\'\), 3000\);',
    r"toast.success('Gambar Tentang Kami berhasil diperbarui!');",
    content
)
content = re.sub(
    r'setMessage\(\'Gagal memperbarui gambar Tentang Kami\.\'\);',
    r"toast.error('Gagal memperbarui gambar Tentang Kami.');",
    content
)

# Replace setMessage with toast for Hero
content = re.sub(
    r'setMessage\(\'Gambar Slide Beranda berhasil diperbarui!\'\);\n\s*setTimeout\(\(\) => setMessage\(\'\'\), 3000\);',
    r"toast.success('Gambar Slide Beranda berhasil diperbarui!');",
    content
)
content = re.sub(
    r'setMessage\(\'Gagal memperbarui gambar slide beranda\.\'\);',
    r"toast.error('Gagal memperbarui gambar slide beranda.');",
    content
)

# Remove the old {message && ...} block since we use toast now
content = re.sub(
    r'\{message && \(\s*<div className=\{`p-4 rounded-lg \$\{message\.includes\(\'berhasil\'\) \? \'bg-green-50 text-green-700 border border-green-200\' : \'bg-red-50 text-red-700 border border-red-200\'\}`\}>\s*\{message\}\s*</div>\s*\)\}',
    '',
    content
)

with open('apps/web/src/app/admin/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Responsive and Toast Patched!")
