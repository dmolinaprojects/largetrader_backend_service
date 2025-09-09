import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetDataLimitsDto {
  @ApiProperty({
    description: 'Symbol code',
    example: 'AAPL',
  })
  @IsString()
  symbol: string;
}

export class DataLimitsResponseDto {
  @ApiProperty({
    description: 'Earliest available date timestamp',
    example: 1640995200,
  })
  earliestDate: number;

  @ApiProperty({
    description: 'Latest available date timestamp',
    example: 1672531200,
  })
  latestDate: number;

  @ApiProperty({
    description: 'Total number of data points available',
    example: 1000,
  })
  totalDataPoints: number;

  @ApiProperty({
    description: 'Symbol code',
    example: 'AAPL',
  })
  symbol: string;

  @ApiProperty({
    description: 'Resolution of the data',
    example: '1D',
  })
  resolution: string;
}
