import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() password?: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER')
@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Get('stats')
  getStats(@CurrentUser() user: User) {
    return this.ownerService.getStats(user.id);
  }

  @Get('kos')
  getKos(@CurrentUser() user: User) {
    return this.ownerService.getKos(user.id);
  }

  @Patch('profile')
  updateProfile(@CurrentUser() user: User, @Body() data: UpdateProfileDto) {
    return this.ownerService.updateProfile(user.id, data);
  }
}
