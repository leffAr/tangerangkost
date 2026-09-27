import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('contact')
  getContactSettings() {
    return this.settingsService.getContactSettings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('contact')
  updateContactSettings(@Body() data: { whatsapp?: string; email?: string; address?: string; instagram?: string; tiktok?: string }) {
    return this.settingsService.updateContactSettings(data);
  }

  @Get('about')
  getAboutSettings() {
    return this.settingsService.getAboutSettings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('about')
  updateAboutSettings(@Body() data: { imageUrl: string }) {
    return this.settingsService.updateAboutSettings(data);
  }

  @Get('hero')
  getHeroSettings() {
    return this.settingsService.getHeroSettings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('hero')
  updateHeroSettings(@Body() data: { slides: string[] }) {
    return this.settingsService.updateHeroSettings(data);
  }
}
