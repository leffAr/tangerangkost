import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getContactSettings() {
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
  }

  async updateContactSettings(data: { whatsapp?: string; email?: string; address?: string }) {
    if (data.whatsapp) {
      await this.prisma.siteSetting.upsert({
        where: { key: 'CONTACT_WHATSAPP' },
        update: { value: data.whatsapp },
        create: { key: 'CONTACT_WHATSAPP', value: data.whatsapp },
      });
    }
    if (data.email) {
      await this.prisma.siteSetting.upsert({
        where: { key: 'CONTACT_EMAIL' },
        update: { value: data.email },
        create: { key: 'CONTACT_EMAIL', value: data.email },
      });
    }
    if (data.address) {
      await this.prisma.siteSetting.upsert({
        where: { key: 'CONTACT_ADDRESS' },
        update: { value: data.address },
        create: { key: 'CONTACT_ADDRESS', value: data.address },
      });
    }
    return this.getContactSettings();
  }

  async getAboutSettings() {
    const setting = await this.prisma.siteSetting.findUnique({
      where: { key: 'ABOUT_IMAGE' }
    });
    return {
      imageUrl: setting?.value || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'
    };
  }

  async updateAboutSettings(data: { imageUrl: string }) {
    await this.prisma.siteSetting.upsert({
      where: { key: 'ABOUT_IMAGE' },
      update: { value: data.imageUrl },
      create: { key: 'ABOUT_IMAGE', value: data.imageUrl },
    });
    return this.getAboutSettings();
  }

  async getHeroSettings() {
    const setting = await this.prisma.siteSetting.findUnique({
      where: { key: 'HERO_SLIDES' }
    });
    
    let slides = [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1e50bb3b37?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop"
    ];

    if (setting?.value) {
      try {
        slides = JSON.parse(setting.value);
      } catch (e) {
        // use defaults
      }
    }

    return { slides };
  }

  async updateHeroSettings(data: { slides: string[] }) {
    const value = JSON.stringify(data.slides);
    await this.prisma.siteSetting.upsert({
      where: { key: 'HERO_SLIDES' },
      update: { value },
      create: { key: 'HERO_SLIDES', value },
    });
    return this.getHeroSettings();
  }
}
