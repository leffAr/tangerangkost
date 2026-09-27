import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Roles('USER')
  @Post('bookings')
  createBooking(
    @CurrentUser() user: User,
    @Body() body: { roomId: string; startDate: string; durationMonths: number }
  ) {
    return this.bookingsService.createBooking(user.id, body.roomId, body.startDate, body.durationMonths);
  }

  @Roles('USER')
  @Get('bookings/my-bookings')
  getMyBookings(@CurrentUser() user: User) {
    return this.bookingsService.getMyBookings(user.id);
  }

  @Roles('OWNER')
  @Get('owner/bookings')
  getOwnerBookings(@CurrentUser() user: User) {
    return this.bookingsService.getOwnerBookings(user.id);
  }

  @Roles('OWNER')
  @Patch('owner/bookings/:id/status')
  updateStatus(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body('status') status: 'APPROVED' | 'REJECTED'
  ) {
    return this.bookingsService.updateBookingStatus(user.id, id, status);
  }
}
