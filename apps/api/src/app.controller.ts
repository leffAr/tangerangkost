import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('debug-env')
  debugEnv() {
    return {
      googleId: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
      googleSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
      dbUrl: process.env.DATABASE_URL ? 'SET' : 'MISSING'
    };
  }
}
