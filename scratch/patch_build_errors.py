import re

# 1. Fix backend kos-images.controller.ts (Add Body import)
path_backend = 'apps/api/src/kos/kos-images.controller.ts'
with open(path_backend, 'r', encoding='utf-8') as f:
    backend_content = f.read()

# Add Body to the imports from @nestjs/common
if 'Body' not in backend_content[:300]:
    backend_content = backend_content.replace(
        "import {\n  Controller,\n  Post,\n  Param,\n  UseInterceptors,\n  UploadedFile,\n  UseGuards,\n  BadRequestException,\n  ForbiddenException,\n  NotFoundException,\n} from '@nestjs/common';",
        "import {\n  Controller,\n  Post,\n  Param,\n  UseInterceptors,\n  UploadedFile,\n  UseGuards,\n  BadRequestException,\n  ForbiddenException,\n  NotFoundException,\n  Body,\n} from '@nestjs/common';"
    )
    with open(path_backend, 'w', encoding='utf-8') as f:
        f.write(backend_content)

# 2. Fix edit/page.tsx
path_edit = 'apps/web/src/app/owner/kos/[id]/edit/page.tsx'
with open(path_edit, 'r', encoding='utf-8') as f:
    edit_content = f.read()

edit_target = r"id \? `/kos/\$\{id\}/images` : `/kos/\$\{kosId\}/images`"
edit_content = re.sub(edit_target, "`/kos/${id}/images`", edit_content)

with open(path_edit, 'w', encoding='utf-8') as f:
    f.write(edit_content)

# 3. Fix create/page.tsx
path_create = 'apps/web/src/app/owner/kos/create/page.tsx'
with open(path_create, 'r', encoding='utf-8') as f:
    create_content = f.read()

create_target = r"id \? `/kos/\$\{id\}/images` : `/kos/\$\{kosId\}/images`"
create_content = re.sub(create_target, "`/kos/${newKos.id}/images`", create_content)

with open(path_create, 'w', encoding='utf-8') as f:
    f.write(create_content)
