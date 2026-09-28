import { Controller, Get   @Get('debug-env')
  debugEnv() {
    return {
      googleId: process.env.GOOGLE_CLIENT_ID ? 'SET (' + process.env.GOOGLE_CLIENT_ID.substring(0, 5) + '...)' : 'MISSING',
      googleSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
      dbUrl: process.env.DATABASE_URL ? 'SET' : 'MISSING'
    };
  }
} from '@nestjs/common';
import { AppService   @Get('debug-env')
  debugEnv() {
    return {
      googleId: process.env.GOOGLE_CLIENT_ID ? 'SET (' + process.env.GOOGLE_CLIENT_ID.substring(0, 5) + '...)' : 'MISSING',
      googleSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
      dbUrl: process.env.DATABASE_URL ? 'SET' : 'MISSING'
    };
  }
} from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {  @Get('debug-env')
  debugEnv() {
    return {
      googleId: process.env.GOOGLE_CLIENT_ID ? 'SET (' + process.env.GOOGLE_CLIENT_ID.substring(0, 5) + '...)' : 'MISSING',
      googleSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
      dbUrl: process.env.DATABASE_URL ? 'SET' : 'MISSING'
    };
  }
}

  @Get()
  getHello(): string {
    return this.appService.getHello();
    @Get('debug-env')
  debugEnv() {
    return {
      googleId: process.env.GOOGLE_CLIENT_ID ? 'SET (' + process.env.GOOGLE_CLIENT_ID.substring(0, 5) + '...)' : 'MISSING',
      googleSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
      dbUrl: process.env.DATABASE_URL ? 'SET' : 'MISSING'
    };
  }
}
  @Get('debug-env')
  debugEnv() {
    return {
      googleId: process.env.GOOGLE_CLIENT_ID ? 'SET (' + process.env.GOOGLE_CLIENT_ID.substring(0, 5) + '...)' : 'MISSING',
      googleSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
      dbUrl: process.env.DATABASE_URL ? 'SET' : 'MISSING'
    };
  }
}
