import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OwnerService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const profile = await this.prisma.ownerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Owner profile not found');

    const totalKos = await this.prisma.kos.count({ where: { ownerId: profile.id } });
    
    const totalRooms = await this.prisma.room.count({
      where: {
        kos: { ownerId: profile.id }
      }
    });

    const totalReviews = await this.prisma.review.count({
      where: {
        kos: { ownerId: profile.id }
      }
    });

    return {
      totalKos,
      totalRooms,
      totalReviews,
      verificationStatus: profile.verificationStatus,
    };
  }

  async getKos(userId: string) {
    const profile = await this.prisma.ownerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Owner profile not found');

    return this.prisma.kos.findMany({
      where: { ownerId: profile.id },
      include: {
        rooms: { select: { id: true } },
        kosImages: { select: { url: true }, take: 1 }
      }
    });
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string; email?: string; password?: string }) {
    // Check if email is being changed and is already taken
    if (data.email) {
      const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Email ini sudah digunakan oleh akun lain');
      }
    }

    const updateData: any = {
      name: data.name,
      phone: data.phone,
    };

    if (data.email) {
      updateData.email = data.email;
    }

    if (data.password) {
      const bcrypt = require('bcrypt');
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    
    return {
      message: 'Profil berhasil diperbarui',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }
    };
  }
}
