import re

with open('apps/api/.env', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('/sys?sslaccept=strict', '/test?sslaccept=strict')

with open('apps/api/.env', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
