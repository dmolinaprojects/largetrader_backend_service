import { ApiProperty } from '@nestjs/swagger';
import { SignalsGroupsResponseDto } from './signals-groups-response.dto';

export class GetSignalsGroupsResponseDto {
  @ApiProperty({
    description: 'Signals groups list',
    type: [SignalsGroupsResponseDto],
  })
  groups: SignalsGroupsResponseDto[];

  @ApiProperty({
    description: 'Total groups found',
    example: 5,
  })
  total: number;
}
