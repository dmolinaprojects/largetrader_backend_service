import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Fecha de registro del usuario',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  dateRegister?: Date;

  @ApiProperty({
    description: 'Apodo del usuario',
    example: 'juan123',
    required: false,
  })
  nickName?: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
    required: false,
  })
  surname?: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '+1234567890',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'Nombre de Google del usuario',
    example: 'Juan Google',
    required: false,
  })
  googleName?: string;

  @ApiProperty({
    description: 'Apellido de Google del usuario',
    example: 'Pérez Google',
    required: false,
  })
  googleSurname?: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'ID de Google del usuario',
    example: 'google123',
    required: false,
  })
  googleId?: string;

  @ApiProperty({
    description: 'Avatar de Google del usuario',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  googleAvatar?: string;

  @ApiProperty({
    description: 'Género de Google del usuario',
    example: 'male',
    required: false,
  })
  googleGender?: string;

  @ApiProperty({
    description: 'Nombre de Facebook del usuario',
    example: 'Juan Facebook',
    required: false,
  })
  facebookName?: string;

  @ApiProperty({
    description: 'ID de Facebook del usuario',
    example: 'facebook123',
    required: false,
  })
  facebookId?: string;

  @ApiProperty({
    description: 'Empresa del usuario',
    example: 'Mi Empresa',
    required: false,
  })
  company?: string;

  @ApiProperty({
    description: 'País del usuario',
    example: 1,
    required: false,
  })
  country?: number;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Calle 123, Ciudad',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'Código postal del usuario',
    example: '12345',
    required: false,
  })
  postalCode?: string;

  @ApiProperty({
    description: 'Ciudad del usuario',
    example: 'Madrid',
    required: false,
  })
  city?: string;

  @ApiProperty({
    description: 'Si el usuario es administrador',
    example: false,
  })
  admin: boolean;

  @ApiProperty({
    description: 'Si el usuario es publisher',
    example: false,
  })
  publisher: boolean;

  @ApiProperty({
    description: 'Token del usuario',
    example: 'token123',
    required: false,
  })
  token?: string;

  @ApiProperty({
    description: 'Token de aplicación del usuario',
    example: 'app_token123',
    required: false,
  })
  tokenApp?: string;

  @ApiProperty({
    description: 'IP del usuario',
    example: '192.168.1.1',
    required: false,
  })
  ip?: string;

  @ApiProperty({
    description: 'Navegador del usuario',
    example: 'Chrome',
    required: false,
  })
  browser?: string;

  @ApiProperty({
    description: 'Idioma del usuario',
    example: 'es',
    required: false,
  })
  language?: string;

  @ApiProperty({
    description: 'Si el usuario está en ActiveCampaign',
    example: false,
  })
  activeCampaign: boolean;

  @ApiProperty({
    description: 'Si el usuario está en Bitrix',
    example: false,
    required: false,
  })
  bitrix?: boolean;

  @ApiProperty({
    description: 'Fecha de restauración del usuario',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  restoreDate?: Date;

  @ApiProperty({
    description: 'Clave de restauración del usuario',
    example: 'restore_key123',
    required: false,
  })
  restoreKey?: string;

  @ApiProperty({
    description: 'ID de PushWoosh del usuario',
    example: 'pushwoosh123',
    required: false,
  })
  pushWooshId?: string;
}
