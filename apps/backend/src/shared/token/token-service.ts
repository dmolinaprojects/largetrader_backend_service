export abstract class TokenService {
  abstract generateAccessToken(payload: Record<string, any>): string;
  abstract generateRefreshToken(payload: Record<string, any>): string;
  abstract validateToken(
    token: string,
    type: 'access' | 'refresh' | 'socialLogin',
  ): Record<string, any>;
}
