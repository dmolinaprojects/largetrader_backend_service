import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsIn, Min, Max, IsArray, ArrayMinSize } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEODHDHistoricalDataDto {
  @ApiProperty({
    description: 'Símbolo del activo financiero (formato: SYMBOL.EXCHANGE)',
    example: 'AAPL.US',
  })
  @IsString()
  symbol: string;

  @ApiProperty({
    description: 'Número de días de datos históricos a obtener',
    example: 30,
    minimum: 1,
    maximum: 3650,
  })
  @IsNumber()
  @Min(1)
  @Max(3650)
  @Transform(({ value }) => parseInt(value))
  days: number;

  @ApiProperty({
    description: 'Período de los datos',
    enum: ['d', 'w', 'm'],
    example: 'd',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['d', 'w', 'm'])
  period?: 'd' | 'w' | 'm' = 'd';
}

export class GetEODHDMultipleHistoricalDataDto {
  @ApiProperty({
    description: 'Array de símbolos de activos financieros',
    example: ['AAPL.US', 'TSLA.US', 'MSFT.US'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  symbols: string[];

  @ApiProperty({
    description: 'Número de días de datos históricos a obtener',
    example: 30,
    minimum: 1,
    maximum: 3650,
  })
  @IsNumber()
  @Min(1)
  @Max(3650)
  @Transform(({ value }) => parseInt(value))
  days: number;

  @ApiProperty({
    description: 'Período de los datos',
    enum: ['d', 'w', 'm'],
    example: 'd',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['d', 'w', 'm'])
  period?: 'd' | 'w' | 'm' = 'd';
}

export class GetEODHDLastPriceDto {
  @ApiProperty({
    description: 'Símbolo del activo financiero (formato: SYMBOL.EXCHANGE)',
    example: 'AAPL.US',
  })
  @IsString()
  symbol: string;
}

export class EODHDHistoricalDataItemDto {
  @ApiProperty({
    description: 'Fecha del dato',
    example: '2024-01-15',
  })
  date: string;

  @ApiProperty({
    description: 'Precio de apertura',
    example: 150.0,
  })
  open: number;

  @ApiProperty({
    description: 'Precio máximo',
    example: 155.0,
  })
  high: number;

  @ApiProperty({
    description: 'Precio mínimo',
    example: 149.0,
  })
  low: number;

  @ApiProperty({
    description: 'Precio de cierre',
    example: 152.0,
  })
  close: number;

  @ApiProperty({
    description: 'Precio de cierre ajustado',
    example: 152.0,
  })
  adjusted_close: number;

  @ApiProperty({
    description: 'Volumen',
    example: 1000000,
  })
  volume: number;
}

export class EODHDResponseDto {
  @ApiProperty({
    description: 'Código del símbolo',
    example: 'AAPL.US',
  })
  code: string;

  @ApiProperty({
    description: 'Nombre corto del exchange',
    example: 'US',
  })
  exchange_short_name: string;

  @ApiProperty({
    description: 'Nombre largo del exchange',
    example: 'US',
  })
  exchange_long_name: string;

  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'Apple Inc.',
  })
  name: string;

  @ApiProperty({
    description: 'Tipo de activo',
    example: 'Common Stock',
  })
  type: string;

  @ApiProperty({
    description: 'País',
    example: 'US',
  })
  country: string;

  @ApiProperty({
    description: 'Moneda',
    example: 'USD',
  })
  currency: string;

  @ApiProperty({
    description: 'Array de datos históricos',
    type: [EODHDHistoricalDataItemDto],
  })
  data: EODHDHistoricalDataItemDto[];
}

export class EODHDMultipleResponseDto {
  @ApiProperty({
    description: 'Array de respuestas con datos históricos',
    type: [EODHDResponseDto],
  })
  data: EODHDResponseDto[];

  @ApiProperty({
    description: 'Número total de símbolos procesados',
    example: 3,
  })
  total_symbols: number;

  @ApiProperty({
    description: 'Número de símbolos con datos exitosos',
    example: 2,
  })
  successful_symbols: number;

  @ApiProperty({
    description: 'Número de símbolos con errores',
    example: 1,
  })
  failed_symbols: number;
}

export class EODHDLastPriceResponseDto {
  @ApiProperty({
    description: 'Símbolo del activo',
    example: 'AAPL.US',
  })
  symbol: string;

  @ApiProperty({
    description: 'Último precio de cierre',
    example: 152.50,
  })
  last_close_price: number;

  @ApiProperty({
    description: 'Fecha del último precio',
    example: '2024-01-15',
  })
  date: string;
}

export class EODHDInternalFormatDto {
  @ApiProperty({
    description: 'Símbolo del activo',
    example: 'AAPL.US',
  })
  symbol: string;

  @ApiProperty({
    description: 'Exchange',
    example: 'US',
  })
  exchange: string;

  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'Apple Inc.',
  })
  name: string;

  @ApiProperty({
    description: 'Moneda',
    example: 'USD',
  })
  currency: string;

  @ApiProperty({
    description: 'Array de datos históricos en formato interno',
    type: [Object],
  })
  data: Array<{
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    adjusted_close: number;
    volume: number;
  }>;
}
