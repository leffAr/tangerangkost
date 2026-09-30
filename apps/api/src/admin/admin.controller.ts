import { Controller, Get, Post, Param, UseGuards, Body, Patch, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id/role')
  updateUserRole(@Param('id') id: string, @Body() data: { role: string }) {
    return this.adminService.updateUserRole(id, data.role as any);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() data: { name?: string; email?: string; password?: string }) {
    return this.adminService.updateUser(id, data);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('verifications')
  getVerifications() {
    return this.adminService.getVerifications();
  }

  @Post('verifications/:id/approve')
  approveOwner(@Param('id') id: string) {
    return this.adminService.approveOwner(id);
  }

  @Get('kos')
  getKoses() {
    return this.adminService.getKoses();
  }

  @Post('kos/:id/delete')
  deleteKos(@Param('id') id: string) {
    return this.adminService.deleteKos(id);
  }

  @Get('popular-areas')
  getPopularAreas() {
    return this.adminService.getPopularAreas();
  }

  @Post('popular-areas')
  createPopularArea(@Body() data: { name: string; imageUrl: string; order: number; isActive?: boolean }) {
    return this.adminService.createPopularArea(data);
  }

  @Patch('popular-areas/:id')
  updatePopularArea(@Param('id') id: string, @Body() data: { name?: string; imageUrl?: string; order?: number; isActive?: boolean }) {
    return this.adminService.updatePopularArea(id, data);
  }

  @Delete('popular-areas/:id')
  deletePopularArea(@Param('id') id: string) {
    return this.adminService.deletePopularArea(id);
  }

  @Post('upload')
  @Post('upload')
  uploadFile(@Body('url') url: string) {
    if (!url) throw new BadRequestException('URL is required');
    return { url };
  }
}
