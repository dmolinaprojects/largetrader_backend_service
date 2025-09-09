import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn, MinLength, MaxLength } from 'class-validator';

export class SearchSymbolsDto {
  @ApiProperty({
    description: 'Search term',
    example: 'AAPL',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  query: string;

  @ApiProperty({
    description: 'Asset type',
    enum: ['stock', 'crypto', 'forex', 'index', 'commodity', 'cfd'],
    example: 'stock',
  })
  @IsString()
  @IsIn(['stock', 'crypto', 'forex', 'index', 'commodity', 'cfd'])
  type: string;

  @ApiProperty({
    description: 'Results limit',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  limit?: string;
}

export class SymbolSearchResultDto {
  @ApiProperty({
    description: 'Symbol code',
    example: 'AAPL',
  })
  symbol: string;

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
    description: 'Country',
    example: 'USA',
  })
  country: string;

  @ApiProperty({
    description: 'Exchange',
    example: 'NASDAQ',
  })
  exchange: string;

  @ApiProperty({
    description: 'Currency',
    example: 'USD',
  })
  currency: string;
}

export class SearchSymbolsResponseDto {
  @ApiProperty({
    description: 'Array of search results',
    type: [SymbolSearchResultDto],
  })
  results: SymbolSearchResultDto[];

  @ApiProperty({
    description: 'Total results found',
    example: 25,
  })
  total: number;
}
