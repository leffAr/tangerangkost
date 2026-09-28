import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() data: { name: string; phone: string; subject?: string; message: string }) {
    return this.contactService.create(data);
  }

  @Get('debug-env')
  getDebugEnv() {
    return {
      keys: Object.keys(process.env).filter(k => k.includes('GOOGLE') || k.includes('JWT') || k.includes('DATABASE')),
      allKeys: Object.keys(process.env)
    };
  }

  @Get('debug')
  getDebug() {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID || 'undefined',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'undefined'
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('unread-count')
  getUnreadCount() {
    return this.contactService.getUnreadCount();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
