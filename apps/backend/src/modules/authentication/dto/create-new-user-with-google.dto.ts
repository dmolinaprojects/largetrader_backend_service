import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateNewUserWithGoogleDto {
  id?: number;

  @ApiProperty({ required: true })
  @IsString()
  @MinLength(3)
  firstName: string;

  @ApiProperty({ required: true })
  @IsString()
  @MinLength(3)
  lastName: string;

  @ApiProperty({ required: true })
  @IsEmail()
  @MinLength(1)
  @IsString()
  email: string;

  @ApiProperty({ required: true })
  @MinLength(1)
  @IsString()
  providerId: string;

  @ApiProperty({ required: true })
  @MinLength(1)
  @IsString()
  providerName: string;

  @IsOptional()
  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsNumber()
  socialId: number;

  @IsOptional()
  @IsString()
  uuid: string;
}