import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsIn, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetHistoricalDataDto {
  @ApiProperty({
    description: 'Financial symbol code',
    example: 'AAPL',
  })
  @IsString()
  symbol: string;

  @ApiProperty({
    description: 'Timeframe resolution',
    enum: ['1D', '5', '15', '60'],
    example: '1D',
  })
  @IsString()
  @IsIn(['1D', '5', '15', '60'])
  resolution: string;

  @ApiProperty({
    description: 'Start date timestamp',
    example: 1640995200,
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  from: number;

  @ApiProperty({
    description: 'End date timestamp',
    example: 1672531200,
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  to: number;

  @ApiProperty({
    description: 'Bar limit (optional)',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10000)
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  countback?: number;
}

export class HistoricalDataResponseDto {
  @ApiProperty({
    description: 'Response status',
    example: 'ok',
  })
  s: string;

  @ApiProperty({
    description: 'Array of timestamps',
    type: [Number],
    example: [1640995200, 1641081600],
  })
  t: number[];

  @ApiProperty({
    description: 'Array of open prices',
    type: [Number],
    example: [150.0, 151.0],
  })
  o: number[];

  @ApiProperty({
    description: 'Array of high prices',
    type: [Number],
    example: [155.0, 156.0],
  })
  h: number[];

  @ApiProperty({
    description: 'Array of low prices',
    type: [Number],
    example: [149.0, 150.0],
  })
  l: number[];

  @ApiProperty({
    description: 'Array of close prices',
    type: [Number],
    example: [152.0, 153.0],
  })
  c: number[];

  @ApiProperty({
    description: 'Array of volumes',
    type: [Number],
    example: [1000000, 1200000],
  })
  v: number[];
}
