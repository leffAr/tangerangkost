import re

with open('apps/api/src/auth/auth.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = "import { HttpException } from '@nestjs/common';\n" + content

with open('apps/api/src/auth/auth.service.ts', 'w', encoding='utf-8') as f:
    f.write(content)
