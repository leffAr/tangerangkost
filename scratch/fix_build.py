import re

with open('apps/api/src/auth/auth.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add HttpException to imports
if 'HttpException' not in content:
    content = content.replace("import { Injectable, UnauthorizedException } from '@nestjs/common';", "import { Injectable, UnauthorizedException, HttpException } from '@nestjs/common';")

# Fix the throw
content = content.replace("throw new import('@nestjs/common').HttpException", "throw new HttpException")

with open('apps/api/src/auth/auth.service.ts', 'w', encoding='utf-8') as f:
    f.write(content)
