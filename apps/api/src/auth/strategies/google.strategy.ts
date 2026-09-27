import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'mock-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-client-secret',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'https://tangerangkost.onrender.com/api/v1/auth/google/callback',
      proxy: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name: `${name.givenName || ''} ${name.familyName || ''}`.trim(),
      picture: photos && photos.length > 0 ? photos[0].value : null,
      accessToken
    };
    done(null, user);
  }
}
