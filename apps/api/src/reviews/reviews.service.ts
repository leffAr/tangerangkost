import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: string, kosId: string, rating: number, comment: string) {
    if (rating < 1 || rating > 5) throw new BadRequestException('Rating must be between 1 and 5');
    
    const existing = await this.prisma.review.findFirst({
      where: { userId, kosId }
    });
    if (existing) throw new BadRequestException('You already reviewed this kos');

    return this.prisma.review.create({
      data: {
        userId,
        kosId,
        rating,
        comment
      }
    });
  }

  async getKosReviews(kosId: string) {
    return this.prisma.review.findMany({
      where: { kosId },
      include: {
        user: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOwnerReviews(userId: string) {
    const profile = await this.prisma.ownerProfile.findUnique({ where: { userId } });
    if (!profile) throw new ForbiddenException('Not an owner');

    return this.prisma.review.findMany({
      where: {
        kos: { ownerId: profile.id }
      },
      include: {
        user: { select: { name: true } },
        kos: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async replyReview(userId: string, reviewId: string, reply: string) {
    const profile = await this.prisma.ownerProfile.findUnique({ where: { userId } });
    if (!profile) throw new ForbiddenException('Not an owner');

    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { kos: true }
    });

    if (!review) throw new NotFoundException('Review not found');
    if (review.kos.ownerId !== profile.id) throw new ForbiddenException('Not your kos');

    return this.prisma.review.update({
      where: { id: reviewId },
      data: { reply }
    });
  }
}
