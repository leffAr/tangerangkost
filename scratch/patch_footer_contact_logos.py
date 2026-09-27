import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'<li className="flex items-center gap-3">\s*<Smartphone className="w-5 h-5 text-blue-400 shrink-0" />\s*<span>\{contactSettings\?\.whatsapp \|\| \'\+62 812-3456-7890\'\}</span>\s*</li>\s*<li className="flex items-center gap-3">\s*<MessageCircle className="w-5 h-5 text-blue-400 shrink-0" />\s*<span>\{contactSettings\?\.email \|\| \'halo@tangerangkost\.com\'\}</span>\s*</li>'

replacement = """<li className="flex items-center gap-3">
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-[#25D366] shrink-0"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      <a href={`https://wa.me/${(contactSettings?.whatsapp || '6281234567890').replace(/\\D/g,'')}`} target="_blank" rel="noreferrer" className="hover:text-[#25D366] transition-colors">{contactSettings?.whatsapp || '+62 812-3456-7890'}</a>
                    </li>
                    <li className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-blue-400 shrink-0" />
                      <a href={`mailto:${contactSettings?.email || 'halo@tangerangkost.com'}`} className="hover:text-blue-400 transition-colors">{contactSettings?.email || 'halo@tangerangkost.com'}</a>
                    </li>
                    {contactSettings?.instagram && (
                      <li className="flex items-center gap-3">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-[#E1306C] shrink-0"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        <a href={contactSettings.instagram} target="_blank" rel="noreferrer" className="hover:text-[#E1306C] transition-colors">Instagram</a>
                      </li>
                    )}
                    {contactSettings?.tiktok && (
                      <li className="flex items-center gap-3">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white shrink-0"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                        <a href={contactSettings.tiktok} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">TikTok</a>
                      </li>
                    )}"""

def repl(m):
    return replacement

content = re.sub(target, repl, content, flags=re.DOTALL)

with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
