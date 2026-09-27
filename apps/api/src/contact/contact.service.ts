import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; phone: string; subject?: string; message: string }) {
    return this.prisma.contactMessage.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount() {
    const count = await this.prisma.contactMessage.count({
      where: { isRead: false },
    });
    return { count };
  }

  async markAsRead(id: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async remove(id: string) {
    return this.prisma.contactMessage.delete({
      where: { id },
    });
  }
}
