import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { OAuth2Client } from 'google-auth-library';

export interface GoogleTokenPayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

@Injectable()
export class GoogleAuthService {
  private readonly client: OAuth2Client;
  private readonly allowedAudiences: string[];

  constructor(
    @InjectPinoLogger(GoogleAuthService.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.client = new OAuth2Client();
    this.allowedAudiences = [
      this.configService.getOrThrow<string>('GOOGLE_WEB_CLIENT_ID'),
      this.configService.getOrThrow<string>('GOOGLE_ANDROID_CLIENT_ID'),
      this.configService.getOrThrow<string>('GOOGLE_IOS_CLIENT_ID'),
    ];
  }

  async verifyIdToken(idToken: string): Promise<GoogleTokenPayload> {
    this.logger.info(
      '[GoogleAuthService.verifyIdToken] Verifying Google ID token',
    );

    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.allowedAudiences,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        this.logger.error(
          '[GoogleAuthService.verifyIdToken] Invalid token - no payload',
        );
        throw new Error('Invalid token');
      }

      const {
        sub,
        email,
        email_verified,
        name,
        picture,
        given_name,
        family_name,
      } = payload;

      if (!email || email_verified === false) {
        this.logger.error(
          '[GoogleAuthService.verifyIdToken] Email not verified or missing',
        );
        throw new Error('Email not verified');
      }

      this.logger.info(
        `[GoogleAuthService.verifyIdToken] Token verified successfully for email: ${email}`,
      );

      return {
        sub,
        email,
        email_verified: email_verified || false,
        name: name || '',
        picture,
        given_name,
        family_name,
      };
    } catch (error) {
      this.logger.error(
        `[GoogleAuthService.verifyIdToken] Token verification failed: ${error.message}`,
      );
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
}
