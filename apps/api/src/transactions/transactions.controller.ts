import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Roles('USER')
  @Post(':bookingId/pay')
  payBooking(
    @CurrentUser() user: User,
    @Param('bookingId') bookingId: string,
    @Body('paymentMethod') paymentMethod: string
  ) {
    return this.transactionsService.payBooking(user.id, bookingId, paymentMethod || 'TRANSFER');
  }
}
