import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class GetSymbolInfoDto {
  @ApiProperty({
    description: 'Symbol code',
    example: 'AAPL',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  symbol: string;
}

export class SymbolInfoResponseDto {
  @ApiProperty({
    description: 'Symbol name',
    example: 'Apple Inc.',
  })
  name: string;

  @ApiProperty({
    description: 'Asset type',
    example: 'stock',
  })
  type: string;

  @ApiProperty({
    description: 'Timezone',
    example: 'America/New_York',
  })
  timezone: string;

  @ApiProperty({
    description: 'Trading session',
    example: '0930-1630',
  })
  session: string;

  @ApiProperty({
    description: 'Price scale',
    example: 100,
  })
  pricescale: number;

  @ApiProperty({
    description: 'Minimum movement',
    example: 1,
  })
  minmov: number;

  @ApiProperty({
    description: 'Minimum movement 2',
    example: 0,
  })
  minmov2: number;

  @ApiProperty({
    description: 'Point value',
    example: 1,
  })
  pointvalue: number;

  @ApiProperty({
    description: 'Data status',
    example: 'streaming',
  })
  data_status: string;

  @ApiProperty({
    description: 'Daily data support',
    example: true,
  })
  has_daily: boolean;

  @ApiProperty({
    description: 'Intraday data support',
    example: true,
  })
  has_intraday: boolean;

  @ApiProperty({
    description: 'No volume',
    example: false,
  })
  has_no_volume: boolean;

  @ApiProperty({
    description: 'Symbol description',
    example: 'Apple Inc.',
  })
  description: string;

  @ApiProperty({
    description: 'Ticker code',
    example: 'AAPL',
  })
  ticker: string;
}
