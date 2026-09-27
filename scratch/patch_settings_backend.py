import re

with open('apps/api/src/settings/settings.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace getContactSettings
get_block = """  async getContactSettings() {
    const whatsapp = await this.prisma.siteSetting.findUnique({ where: { key: 'CONTACT_WHATSAPP' } });
    const email = await this.prisma.siteSetting.findUnique({ where: { key: 'CONTACT_EMAIL' } });
    const address = await this.prisma.siteSetting.findUnique({ where: { key: 'CONTACT_ADDRESS' } });
    const instagram = await this.prisma.siteSetting.findUnique({ where: { key: 'CONTACT_INSTAGRAM' } });
    const tiktok = await this.prisma.siteSetting.findUnique({ where: { key: 'CONTACT_TIKTOK' } });

    return {
      whatsapp: whatsapp?.value || '',
      email: email?.value || '',
      address: address?.value || '',
      instagram: instagram?.value || '',
      tiktok: tiktok?.value || '',
    };
  }"""

content = re.sub(r'  async getContactSettings\(\) \{[\s\S]*?return \{[\s\S]*?\};\n  \}', get_block, content)

# Replace updateContactSettings
update_block = """  async updateContactSettings(data: { whatsapp?: string; email?: string; address?: string; instagram?: string; tiktok?: string }) {
    if (data.whatsapp !== undefined) {
      await this.prisma.siteSetting.upsert({ where: { key: 'CONTACT_WHATSAPP' }, update: { value: data.whatsapp }, create: { key: 'CONTACT_WHATSAPP', value: data.whatsapp } });
    }
    if (data.email !== undefined) {
      await this.prisma.siteSetting.upsert({ where: { key: 'CONTACT_EMAIL' }, update: { value: data.email }, create: { key: 'CONTACT_EMAIL', value: data.email } });
    }
    if (data.address !== undefined) {
      await this.prisma.siteSetting.upsert({ where: { key: 'CONTACT_ADDRESS' }, update: { value: data.address }, create: { key: 'CONTACT_ADDRESS', value: data.address } });
    }
    if (data.instagram !== undefined) {
      await this.prisma.siteSetting.upsert({ where: { key: 'CONTACT_INSTAGRAM' }, update: { value: data.instagram }, create: { key: 'CONTACT_INSTAGRAM', value: data.instagram } });
    }
    if (data.tiktok !== undefined) {
      await this.prisma.siteSetting.upsert({ where: { key: 'CONTACT_TIKTOK' }, update: { value: data.tiktok }, create: { key: 'CONTACT_TIKTOK', value: data.tiktok } });
    }
    return { success: true };
  }"""

content = re.sub(r'  async updateContactSettings\(data: \{ whatsapp\?: string; email\?: string; address\?: string \}\) \{[\s\S]*?return \{ success: true \};\n  \}', update_block, content)

with open('apps/api/src/settings/settings.service.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
