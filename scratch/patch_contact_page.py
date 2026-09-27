import re

with open('apps/web/src/app/contact/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'import ContactForm' not in content:
    content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport ContactForm from './contact-form';")

# Replace form
pattern = r'<div className="lg:col-span-3 p-8 md:p-12">.*?</div>\s*<!-- Side Info Section -->'
# wait, there are no comments like <!-- Side Info Section --> in jsx, it's {/* Side Info Section */}
pattern = r'<div className="lg:col-span-3 p-8 md:p-12">.*?</div>\s*\{\/\* Side Info Section \*\/\}'

# The regex approach might be brittle for such a large block.
# Let's replace exactly from `<div className="lg:col-span-3 p-8 md:p-12">` up to the closing `</div>` right before `{/* Side Info Section */}`
# Let's do a simple split.

parts = content.split('{/* Form Section */}')
if len(parts) == 2:
    part1 = parts[0]
    part2 = parts[1]
    
    parts2 = part2.split('{/* Side Info Section */}')
    if len(parts2) == 2:
        new_content = part1 + '{/* Form Section */}\n            <ContactForm />\n\n            {/* Side Info Section */}' + parts2[1]
        
        with open('apps/web/src/app/contact/page.tsx', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Patched contact page")
    else:
        print("Failed split 2")
else:
    print("Failed split 1")
