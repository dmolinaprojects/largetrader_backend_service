import { ApiProperty } from '@nestjs/swagger';
import { SignalsResponseDto } from './signals-response.dto';

export class GetSignalsResponseDto {
  @ApiProperty({
    description: 'Signals list',
    type: [SignalsResponseDto],
  })
  signals: SignalsResponseDto[];

  @ApiProperty({
    description: 'Total available signals',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Items limit per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total pages',
    example: 10,
  })
  totalPages: number;
}
