import re

# 1. Update contact.service.ts
with open('apps/api/src/contact/contact.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_service_method = """  async markAsRead(id: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async remove(id: string) {
    return this.prisma.contactMessage.delete({
      where: { id },
    });
  }"""
content = content.replace("  async markAsRead(id: string) {\n    return this.prisma.contactMessage.update({\n      where: { id },\n      data: { isRead: true },\n    });\n  }", new_service_method)

with open('apps/api/src/contact/contact.service.ts', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update contact.controller.ts
with open('apps/api/src/contact/contact.controller.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_controller_method = """  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }"""
content = content.replace("  @UseGuards(JwtAuthGuard, RolesGuard)\n  @Roles('ADMIN')\n  @Patch(':id/read')\n  markAsRead(@Param('id') id: string) {\n    return this.contactService.markAsRead(id);\n  }", new_controller_method)

# Add Delete to imports
if 'Delete' not in content:
    content = content.replace('Controller, Get, Post, Body, Patch, Param, UseGuards', 'Controller, Get, Post, Body, Patch, Param, Delete, UseGuards')

with open('apps/api/src/contact/contact.controller.ts', 'w', encoding='utf-8') as f:
    f.write(content)
