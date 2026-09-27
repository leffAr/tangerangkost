import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async payBooking(userId: string, bookingId: string, paymentMethod: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { transaction: true }
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException('Not your booking');
    if (booking.status !== 'APPROVED') throw new BadRequestException('Booking must be approved before payment');
    
    if (booking.transaction && booking.transaction.status === 'SUCCESS') {
      throw new BadRequestException('Already paid');
    }

    // Simulate successful payment
    const transaction = await this.prisma.transaction.upsert({
      where: { bookingId },
      create: {
        bookingId,
        amount: booking.totalPrice,
        paymentMethod,
        status: 'SUCCESS'
      },
      update: {
        paymentMethod,
        status: 'SUCCESS'
      }
    });

    // Update booking status to ACTIVE
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'ACTIVE' }
    });

    return transaction;
  }
}
