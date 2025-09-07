// import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TIntFilterRequest } from '../../domain';

// @InputType('IntFilterBaseInput')
class IntFilterBaseRequest implements TIntFilterRequest {
  @ApiPropertyOptional({ type: [Number] })
  // @Field(() => [Int], { nullable: true })
  in?: number[];

  @ApiPropertyOptional({ type: [Number] })
  // @Field(() => [Int], { nullable: true })
  notIn?: number[];

  @ApiPropertyOptional({ type: Number })
  // @Field(() => Int, { nullable: true })
  lt?: number;

  @ApiPropertyOptional({ type: Number })
  // @Field(() => Int, { nullable: true })
  lte?: number;

  @ApiPropertyOptional({ type: Number })
  // @Field(() => Int, { nullable: true })
  gt?: number;

  @ApiPropertyOptional({ type: Number })
  // @Field(() => Int, { nullable: true })
  gte?: number;
}

// @InputType('IntFilterInput')
export class IntFilterRequest extends IntFilterBaseRequest {
  @ApiPropertyOptional({ type: () => IntFilterBaseRequest })
  // @Field(() => IntFilterBaseRequest, { nullable: true })
  not?: Omit<TIntFilterRequest, 'not'>;
}
