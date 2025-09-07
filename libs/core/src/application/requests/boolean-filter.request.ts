// import { Field, InputType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TBooleanFilterRequest } from '../../domain';

// @InputType('BooleanFilterBaseInput')
class BooleanFilterBaseRequest implements TBooleanFilterRequest {
  @ApiPropertyOptional({ type: Boolean })
  // @Field(() => Boolean, { nullable: true })
  equals?: boolean;
}

// @InputType('BooleanFilterInput')
export class BooleanFilterRequest extends BooleanFilterBaseRequest {
  @ApiPropertyOptional({ type: () => BooleanFilterBaseRequest })
  // @Field(() => BooleanFilterBaseRequest, { nullable: true })
  not?: Omit<TBooleanFilterRequest, 'not'>;
}
