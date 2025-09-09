import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret:
    process.env.JWT_ACCESS_SECRET ||
    'default-access-secret-change-in-production',
  refreshSecret:
    process.env.JWT_REFRESH_SECRET ||
    'default-refresh-secret-change-in-production',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  socialLoginSecret:
    process.env.JWT_SOCIAL_LOGIN_SECRET ||
    'default-social-login-secret-change-in-production',
  recoverAccountSecret:
    process.env.JWT_RECOVER_ACCOUNT_SECRET ||
    'default-recover-account-secret-change-in-production',
}));
