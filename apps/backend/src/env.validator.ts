import { EndQuoteRegex, envValidatorUtil, StartQuoteRegex } from '@app/core';
import { z } from 'zod';

const appConfigSchema = z.object({
  APP_PORT: z
    .string()
    .min(1)
    .transform((value) =>
      parseInt(value.replace(StartQuoteRegex, '').replace(EndQuoteRegex, '')),
    )
    .pipe(z.number().min(1).max(65535)),
  STOCKS_DATABASE_URL: z
    .string()
    .transform((value) =>
      value.replace(StartQuoteRegex, '').replace(EndQuoteRegex, ''),
    )
    .pipe(z.string().url()),
  USERS_DATABASE_URL: z
    .string()
    .transform((value) =>
      value.replace(StartQuoteRegex, '').replace(EndQuoteRegex, ''),
    )
    .pipe(z.string().url()),
  // JWT Configuration
  JWT_ACCESS_SECRET: z
    .string()
    .min(1)
    .transform((value) =>
      value.replace(StartQuoteRegex, '').replace(EndQuoteRegex, ''),
    ),
  JWT_REFRESH_SECRET: z
    .string()
    .min(1)
    .transform((value) =>
      value.replace(StartQuoteRegex, '').replace(EndQuoteRegex, ''),
    ),
  JWT_ACCESS_EXPIRES_IN: z
    .string()
    .min(1)
    .transform((value) =>
      value.replace(StartQuoteRegex, '').replace(EndQuoteRegex, ''),
    ),
  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .min(1)
    .transform((value) =>
      value.replace(StartQuoteRegex, '').replace(EndQuoteRegex, ''),
    ),
  JWT_SOCIAL_LOGIN_SECRET: z
    .string()
    .min(1)
    .transform((value) =>
      value.replace(StartQuoteRegex, '').replace(EndQuoteRegex, ''),
    ),
  JWT_RECOVER_ACCOUNT_SECRET: z
    .string()
    .min(1)
    .transform((value) =>
      value.replace(StartQuoteRegex, '').replace(EndQuoteRegex, ''),
    ),
  // EOD Historical Data API
  EOD_API_TOKEN: z
    .string()
    .min(1)
    .transform((value) =>
      value.replace(StartQuoteRegex, '').replace(EndQuoteRegex, ''),
    ),
});

export function envValidator(config: Record<string, unknown>) {
  return envValidatorUtil(config, appConfigSchema);
}
