import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class GoogleLoginRequestDto {
  @ApiProperty({
    description: 'ID de Google del usuario',
    example: '123456789012345678901',
  })
  @IsNotEmpty()
  @IsString()
  googleId: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty({
    description: 'URL del avatar de Google',
    example: 'https://lh3.googleusercontent.com/a/ACg8ocJ...',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'Género del usuario',
    example: 'male',
    required: false,
  })
  @IsOptional()
  @IsString()
  gender?: string;
}
