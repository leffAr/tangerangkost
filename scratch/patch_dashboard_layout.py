import re

with open('apps/web/src/components/dashboard-layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Mail icon import
if 'Mail' not in content:
    content = content.replace("import { Home, MapPin", "import { Home, MapPin, Mail")

# Add Pesan Masuk to ADMIN navItems
admin_nav = """const ADMIN_NAV = [
  { title: 'Dashboard', href: '/admin', icon: Home },
  { title: 'Daftar Kost', href: '/admin/kos', icon: Building2 },
  { title: 'Verifikasi Pemilik', href: '/admin/verifications', icon: CheckSquare },
  { title: 'Pesan Masuk', href: '/admin/messages', icon: Mail },
  { title: 'Manajemen Pengguna', href: '/admin/users', icon: Users },
  { title: 'Area Populer', href: '/admin/popular-areas', icon: MapPin },
  { title: 'Pengaturan Global', href: '/admin/settings', icon: Settings },
];"""

content = re.sub(r'const ADMIN_NAV = \[.*?\];', admin_nav, content, flags=re.DOTALL)

with open('apps/web/src/components/dashboard-layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched dashboard layout")
