import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(userId: string, roomId: string, startDate: string, durationMonths: number) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');
    if (room.stock <= 0) throw new BadRequestException('Room is out of stock');

    const totalPrice = Number(room.price) * durationMonths;

    return this.prisma.booking.create({
      data: {
        userId,
        roomId,
        startDate: new Date(startDate),
        durationMonths,
        totalPrice,
      }
    });
  }

  async getMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        room: {
          include: { kos: true }
        },
        transaction: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOwnerBookings(userId: string) {
    const profile = await this.prisma.ownerProfile.findUnique({ where: { userId } });
    if (!profile) throw new ForbiddenException('Not an owner');

    return this.prisma.booking.findMany({
      where: {
        room: {
          kos: { ownerId: profile.id }
        }
      },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        room: { include: { kos: true } },
        transaction: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateBookingStatus(userId: string, bookingId: string, status: 'APPROVED' | 'REJECTED') {
    const profile = await this.prisma.ownerProfile.findUnique({ where: { userId } });
    if (!profile) throw new ForbiddenException('Not an owner');

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: { include: { kos: true } } }
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.room.kos.ownerId !== profile.id) {
      throw new ForbiddenException('You do not own this kos');
    }

    if (booking.status !== 'PENDING') {
      throw new BadRequestException(`Cannot change status from ${booking.status}`);
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status }
    });
  }
}
