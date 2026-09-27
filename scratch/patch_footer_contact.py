import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add useQuery for contact settings
target_query = r'const \{ data: heroSlidesData \} = useQuery\(\{'
replacement_query = """const { data: contactSettings } = useQuery({
    queryKey: ['contact-settings'],
    queryFn: async () => {
      try {
        const res = await api.get('/settings/contact');
        return res.data;
      } catch (error) {
        return null;
      }
    },
  });

  const { data: heroSlidesData } = useQuery({"""

content = re.sub(target_query, replacement_query, content)

# Replace the hardcoded list items
target_html = r"""<li className="flex items-start gap-3">\s*<MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />\s*<span>Jl\. Raya Pemda Tigaraksa, Kabupaten Tangerang, Banten 15720</span>\s*</li>\s*<li className="flex items-center gap-3">\s*<Smartphone className="w-5 h-5 text-blue-400 shrink-0" />\s*<span>\+62 812-3456-7890</span>\s*</li>\s*<li className="flex items-center gap-3">\s*<MessageCircle className="w-5 h-5 text-blue-400 shrink-0" />\s*<span>halo@tangerangkost\.com</span>\s*</li>"""

replacement_html = """<li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{contactSettings?.address || 'Jl. Raya Pemda Tigaraksa, Kabupaten Tangerang, Banten 15720'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>{contactSettings?.whatsapp || '+62 812-3456-7890'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>{contactSettings?.email || 'halo@tangerangkost.com'}</span>
                  </li>"""

content = re.sub(target_html, replacement_html, content)

with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
