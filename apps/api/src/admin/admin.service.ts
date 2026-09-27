import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalOwners, totalKos, pendingVerifications] = await Promise.all([
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.user.count({ where: { role: 'OWNER' } }),
      this.prisma.kos.count(),
      this.prisma.ownerProfile.count({ where: { verificationStatus: 'PENDING' } }),
    ]);

    return {
      totalUsers,
      totalOwners,
      totalKos,
      pendingVerifications,
    };
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });
  }

  async getVerifications() {
    return this.prisma.ownerProfile.findMany({
      where: { verificationStatus: 'PENDING' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async approveOwner(id: string) {
    const profile = await this.prisma.ownerProfile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Owner profile not found');

    return this.prisma.ownerProfile.update({
      where: { id },
      data: { verificationStatus: 'VERIFIED' }
    });
  }

  async getKoses() {
    return this.prisma.kos.findMany({
      include: {
        owner: {
          include: {
            user: { select: { name: true, email: true } }
          }
        },
        kosImages: { take: 1, orderBy: { order: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async deleteKos(id: string) {
    return this.prisma.kos.delete({
      where: { id }
    });
  }

  async getPopularAreas() {
    return this.prisma.popularArea.findMany({
      orderBy: { order: 'asc' }
    });
  }

  async createPopularArea(data: { name: string; imageUrl: string; order: number; isActive?: boolean }) {
    return this.prisma.popularArea.create({ data });
  }

  async updatePopularArea(id: string, data: { name?: string; imageUrl?: string; order?: number; isActive?: boolean }) {
    return this.prisma.popularArea.update({ where: { id }, data });
  }

  async deletePopularArea(id: string) {
    return this.prisma.popularArea.delete({ where: { id } });
  }

  async updateUserRole(id: string, role: any) {
    return this.prisma.user.update({
      where: { id },
      data: { role }
    });
  }

  async updateUser(id: string, data: { name?: string; email?: string; password?: string }) {
    const updateData: any = { name: data.name, email: data.email };
    if (data.password && data.password.trim().length > 0) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }
    
    return this.prisma.user.update({
      where: { id },
      data: updateData
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}
