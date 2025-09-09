import { ApiProperty } from '@nestjs/swagger';

export class SignalsResponseDto {
  @ApiProperty({
    description: 'Unique signal ID',
    example: 1,
  })
  Id: number;

  @ApiProperty({
    description: 'Signals group ID',
    example: 1,
  })
  IdGroup: number;

  @ApiProperty({
    description: 'Signals group name',
    example: 'Trading Signals',
  })
  GroupName: string;

  @ApiProperty({
    description: 'Signal date',
    example: '2024-01-15',
  })
  DateSignal: Date;

  @ApiProperty({
    description: 'Signal time',
    example: '09:30:00',
  })
  TimeSignal: string;

  @ApiProperty({
    description: 'Stock ticker',
    example: 'AAPL',
  })
  Ticker: string;

  @ApiProperty({
    description: 'Order type',
    example: 'BUY',
  })
  OrderType: string;

  @ApiProperty({
    description: 'Signal price',
    example: 150.25,
  })
  Price: number;

  @ApiProperty({
    description: 'Stop loss price',
    example: 145.0,
  })
  Stop: number;

  @ApiProperty({
    description: 'Take profit price',
    example: 160.0,
  })
  Take: number;

  @ApiProperty({
    description: 'Additional value 1',
    example: 1.5,
  })
  Val1: number;
}
