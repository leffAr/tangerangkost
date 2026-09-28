import re

with open('apps/api/src/contact/contact.controller.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';", "import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';")

with open('apps/api/src/contact/contact.controller.ts', 'w', encoding='utf-8') as f:
    f.write(content)
