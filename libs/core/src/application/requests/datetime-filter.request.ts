// import { Field, InputType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
// import { DateTimeResolver } from 'graphql-scalars';
import { TDateTimeFilterRequest } from '../../domain';

// @InputType('DateTimeFilterBaseInput')
class DateTimeFilterBaseRequest implements TDateTimeFilterRequest {
  @ApiPropertyOptional({ type: Date })
  // @Field(() => DateTimeResolver, { nullable: true })
  equals?: Date;

  @ApiPropertyOptional({ type: [Date] })
  // @Field(() => [DateTimeResolver], { nullable: true })
  in?: Date[];

  @ApiPropertyOptional({ type: [Date] })
  // @Field(() => [DateTimeResolver], { nullable: true })
  notIn?: Date[];

  @ApiPropertyOptional({ type: Date })
  // @Field(() => DateTimeResolver, { nullable: true })
  lt?: Date;

  @ApiPropertyOptional({ type: Date })
  // @Field(() => DateTimeResolver, { nullable: true })
  lte?: Date;

  @ApiPropertyOptional({ type: Date })
  // @Field(() => DateTimeResolver, { nullable: true })
  gt?: Date;

  @ApiPropertyOptional({ type: Date })
  // @Field(() => DateTimeResolver, { nullable: true })
  gte?: Date;
}

// @InputType('DateTimeFilterInput')
export class DateTimeFilterRequest extends DateTimeFilterBaseRequest {
  @ApiPropertyOptional({ type: () => DateTimeFilterBaseRequest })
  // @Field(() => DateTimeFilterBaseRequest, { nullable: true })
  not?: Omit<TDateTimeFilterRequest, 'not'>;
}
