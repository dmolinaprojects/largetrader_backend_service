import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User registration date',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  dateRegister?: Date;

  @ApiProperty({
    description: 'User nickname',
    example: 'juan123',
    required: false,
  })
  nickName?: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Juan',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Pérez',
    required: false,
  })
  surname?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'User Google name',
    example: 'Juan Google',
    required: false,
  })
  googleName?: string;

  @ApiProperty({
    description: 'User Google surname',
    example: 'Pérez Google',
    required: false,
  })
  googleSurname?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'juan.perez@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User Google ID',
    example: 'google123',
    required: false,
  })
  googleId?: string;

  @ApiProperty({
    description: 'User Google avatar',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  googleAvatar?: string;

  @ApiProperty({
    description: 'User Google gender',
    example: 'male',
    required: false,
  })
  googleGender?: string;

  @ApiProperty({
    description: 'User Facebook name',
    example: 'Juan Facebook',
    required: false,
  })
  facebookName?: string;

  @ApiProperty({
    description: 'User Facebook ID',
    example: 'facebook123',
    required: false,
  })
  facebookId?: string;

  @ApiProperty({
    description: 'User company',
    example: 'Mi Empresa',
    required: false,
  })
  company?: string;

  @ApiProperty({
    description: 'User country',
    example: 1,
    required: false,
  })
  country?: number;

  @ApiProperty({
    description: 'User address',
    example: 'Calle 123, Ciudad',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'User postal code',
    example: '12345',
    required: false,
  })
  postalCode?: string;

  @ApiProperty({
    description: 'User city',
    example: 'Madrid',
    required: false,
  })
  city?: string;

  @ApiProperty({
    description: 'Whether the user is an administrator',
    example: false,
  })
  admin: boolean;

  @ApiProperty({
    description: 'Whether the user is a publisher',
    example: false,
  })
  publisher: boolean;

  @ApiProperty({
    description: 'User token',
    example: 'token123',
    required: false,
  })
  token?: string;

  @ApiProperty({
    description: 'User application token',
    example: 'app_token123',
    required: false,
  })
  tokenApp?: string;

  @ApiProperty({
    description: 'User IP address',
    example: '192.168.1.1',
    required: false,
  })
  ip?: string;

  @ApiProperty({
    description: 'User browser',
    example: 'Chrome',
    required: false,
  })
  browser?: string;

  @ApiProperty({
    description: 'User language',
    example: 'es',
    required: false,
  })
  language?: string;

  @ApiProperty({
    description: 'Whether the user is in ActiveCampaign',
    example: false,
  })
  activeCampaign: boolean;

  @ApiProperty({
    description: 'Whether the user is in Bitrix',
    example: false,
    required: false,
  })
  bitrix?: boolean;

  @ApiProperty({
    description: 'User restoration date',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  restoreDate?: Date;

  @ApiProperty({
    description: 'User restoration key',
    example: 'restore_key123',
    required: false,
  })
  restoreKey?: string;

  @ApiProperty({
    description: 'User PushWoosh ID',
    example: 'pushwoosh123',
    required: false,
  })
  pushWooshId?: string;
}
