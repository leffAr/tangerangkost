import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('reviews/:kosId')
  getKosReviews(@Param('kosId') kosId: string) {
    return this.reviewsService.getKosReviews(kosId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('reviews/:kosId')
  createReview(
    @CurrentUser() user: User,
    @Param('kosId') kosId: string,
    @Body() body: { rating: number; comment: string }
  ) {
    return this.reviewsService.createReview(user.id, kosId, body.rating, body.comment);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @Get('owner/reviews')
  getOwnerReviews(@CurrentUser() user: User) {
    return this.reviewsService.getOwnerReviews(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @Patch('owner/reviews/:id/reply')
  replyReview(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body('reply') reply: string
  ) {
    return this.reviewsService.replyReview(user.id, id, reply);
  }
}
