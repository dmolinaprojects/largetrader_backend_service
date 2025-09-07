// import { Field, Float, InputType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TFloatFilterRequest } from '../../domain';

// @InputType('FloatFilterBaseInput')
class FloatFilterBaseRequest implements TFloatFilterRequest {
  @ApiPropertyOptional({ type: [Number] })
  // @Field(() => [Float], { nullable: true })
  in?: number[];

  @ApiPropertyOptional({ type: [Number] })
  // @Field(() => [Float], { nullable: true })
  notIn?: number[];

  @ApiPropertyOptional({ type: Number })
  // @Field(() => Float, { nullable: true })
  lt?: number;

  @ApiPropertyOptional({ type: Number })
  // @Field(() => Float, { nullable: true })
  lte?: number;

  @ApiPropertyOptional({ type: Number })
  // @Field(() => Float, { nullable: true })
  gt?: number;

  @ApiPropertyOptional({ type: Number })
  // @Field(() => Float, { nullable: true })
  gte?: number;
}

// @InputType('FloatFilterInput')
export class FloatFilterRequest extends FloatFilterBaseRequest {
  @ApiPropertyOptional({ type: () => FloatFilterBaseRequest })
  // @Field(() => FloatFilterBaseRequest, { nullable: true })
  not?: Omit<TFloatFilterRequest, 'not'>;
}
