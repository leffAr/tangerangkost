import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(r"\'", "'")
content = content.replace(r"\}", "}")
content = content.replace(r"\{", "{")
content = content.replace(r"\$", "$")
content = content.replace(r"\(", "(")
content = content.replace(r"\)", ")")

# But wait, my previous python script might have injected literal backslashes for all these!
# target1 = r'<a href=\{`https://wa\.me/\$\{contactSettings\.whatsapp\.replace\(/\\D/g,\'\'`\} target="_blank"'
# replacement1 = r'<a href={`https://wa.me/${contactSettings?.whatsapp?.replace(/\\D/g,\'\') || \'\'}`} target="_blank"'
# Python raw string r'' treats \' as \'. 
# Let me just replace the whole line cleanly.

target_line_bad = """<a href={`https://wa.me/${contactSettings?.whatsapp?.replace(/\\D/g,'') || ''}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-500 hover:text-white hover:scale-110 transition-all shadow-lg text-slate-300">"""

# wait, is \D correct? Yes, /\D/g is correct JS.
# Let's just fix ANY instance of \'\', \}, \{, \$, \(, \)

with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
