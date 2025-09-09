import { ApiProperty } from '@nestjs/swagger';

export class SignalsGroupsResponseDto {
  @ApiProperty({
    description: 'Unique group ID',
    example: 1,
  })
  Id: number;

  @ApiProperty({
    description: 'Group name',
    example: 'Trading Signals',
  })
  Name: string;

  @ApiProperty({
    description: 'Number of signals in the group',
    example: 25,
  })
  signalsCount?: number;
}
