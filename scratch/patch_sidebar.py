import re

path_layout = 'apps/web/src/components/dashboard-layout.tsx'
with open(path_layout, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Heart to lucide-react imports if missing
if ' Heart' not in content:
    content = content.replace(
        "import { Home, Users, Building, ShieldCheck, LogOut, ClipboardList, Star, UserCircle, ArrowLeft, MapPin, Settings, Menu, X, Mail } from 'lucide-react';",
        "import { Home, Users, Building, ShieldCheck, LogOut, ClipboardList, Star, UserCircle, ArrowLeft, MapPin, Settings, Menu, X, Mail, Heart } from 'lucide-react';"
    )

# Add Favorites to userLinks
target = r"const userLinks = \[\s*\{ name: 'Pencarian Kos', href: '/search', icon: Home \},\s*\{ name: 'Pesanan Saya', href: '/user', icon: ClipboardList \},"
replacement = r"""const userLinks = [
    { name: 'Pencarian Kos', href: '/search', icon: Home },
    { name: 'Pesanan Saya', href: '/user', icon: ClipboardList },
    { name: 'Kos Tersimpan', href: '/user/favorites', icon: Heart },"""
content = re.sub(target, replacement, content)

with open(path_layout, 'w', encoding='utf-8') as f:
    f.write(content)
