import os

base_dir = 'apps/api/src/contact'
os.makedirs(base_dir, exist_ok=True)

service = """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; email: string; subject?: string; message: string }) {
    return this.prisma.contactMessage.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
"""

controller = """import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('v1/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() data: { name: string; email: string; subject?: string; message: string }) {
    return this.contactService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }
}
"""

module = """import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
"""

with open(f'{base_dir}/contact.service.ts', 'w', encoding='utf-8') as f:
    f.write(service)

with open(f'{base_dir}/contact.controller.ts', 'w', encoding='utf-8') as f:
    f.write(controller)

with open(f'{base_dir}/contact.module.ts', 'w', encoding='utf-8') as f:
    f.write(module)

print("Created API files")

# Modify app.module.ts
with open('apps/api/src/app.module.ts', 'r', encoding='utf-8') as f:
    app_mod = f.read()

if 'ContactModule' not in app_mod:
    app_mod = app_mod.replace("import { Module } from '@nestjs/common';", "import { Module } from '@nestjs/common';\nimport { ContactModule } from './contact/contact.module';")
    app_mod = app_mod.replace("imports: [", "imports: [\n    ContactModule,")
    with open('apps/api/src/app.module.ts', 'w', encoding='utf-8') as f:
        f.write(app_mod)
    print("Injected into AppModule")
