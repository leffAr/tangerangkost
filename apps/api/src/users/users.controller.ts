import { Controller, Get, Post, Param, UseGuards, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  getFavorites(@CurrentUser() user: User) {
    return this.usersService.getFavorites(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorites/:kosId')
  toggleFavorite(@CurrentUser() user: User, @Param('kosId') kosId: string) {
    return this.usersService.toggleFavorite(user.id, kosId);
  }
}
