import re

# 1. Update contact.service.ts
with open('apps/api/src/contact/contact.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_service_method = """  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount() {
    const count = await this.prisma.contactMessage.count({
      where: { isRead: false },
    });
    return { count };
  }"""
content = content.replace("  async findAll() {\n    return this.prisma.contactMessage.findMany({\n      orderBy: { createdAt: 'desc' },\n    });\n  }", new_service_method)

with open('apps/api/src/contact/contact.service.ts', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update contact.controller.ts
with open('apps/api/src/contact/contact.controller.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_controller_method = """  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('unread-count')
  getUnreadCount() {
    return this.contactService.getUnreadCount();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/read')"""
content = content.replace("  @UseGuards(JwtAuthGuard, RolesGuard)\n  @Roles('ADMIN')\n  @Patch(':id/read')", new_controller_method)

with open('apps/api/src/contact/contact.controller.ts', 'w', encoding='utf-8') as f:
    f.write(content)
