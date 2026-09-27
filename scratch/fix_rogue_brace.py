import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'</svg>\s*</a>\s*\)\}\s*</div>\s*</div>'
replacement = r"""</svg>
                    </a>
                </div>
              </div>"""

content = re.sub(target, replacement, content)

with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
