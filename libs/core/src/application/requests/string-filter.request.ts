// import { Field, InputType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TStringFilterRequest } from '../../domain';

// @InputType('StringFilterBaseInput')
class StringFilterBaseRequest implements TStringFilterRequest {
  @ApiPropertyOptional({ type: String })
  // @Field(() => String, { nullable: true })
  equals?: string;

  @ApiPropertyOptional({ type: [String] })
  // @Field(() => [String], { nullable: true })
  in?: string[];

  @ApiPropertyOptional({ type: [String] })
  // @Field(() => [String], { nullable: true })
  notIn?: string[];

  @ApiPropertyOptional({ type: String })
  // @Field(() => String, { nullable: true })
  lt?: string;

  @ApiPropertyOptional({ type: String })
  // @Field(() => String, { nullable: true })
  lte?: string;

  @ApiPropertyOptional({ type: String })
  // @Field(() => String, { nullable: true })
  gt?: string;

  @ApiPropertyOptional({ type: String })
  // @Field(() => String, { nullable: true })
  gte?: string;

  @ApiPropertyOptional({ type: String })
  // @Field(() => String, { nullable: true })
  contains?: string;

  @ApiPropertyOptional({ type: String })
  // @Field(() => String, { nullable: true })
  startsWith?: string;

  @ApiPropertyOptional({ type: String })
  // @Field(() => String, { nullable: true })
  endsWith?: string;
}

// @InputType('StringFilterInput')
export class StringFilterRequest extends StringFilterBaseRequest {
  @ApiPropertyOptional({ type: () => StringFilterBaseRequest })
  // @Field(() => StringFilterBaseRequest, { nullable: true })
  not?: Omit<TStringFilterRequest, 'not'>;
}
