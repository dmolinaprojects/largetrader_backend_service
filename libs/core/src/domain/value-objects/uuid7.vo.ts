import { Uuid } from '@uuid-ts/uuid';
import { CommonErrorsDefinition } from '../definitions';
import { ActionResultsFactory } from '../factories';
import { IValueObject } from './value-object.vo';

export class UUID7VO implements IValueObject<string> {
  private constructor(readonly value: string) {}

  private isValidate(value: string): boolean {
    return Uuid.isUuidHexString(value);
  }

  public build(value: string): ActionResultsFactory<UUID7VO> {
    return this.isValidate(value)
      ? ActionResultsFactory.createSuccess(new UUID7VO(value))
      : ActionResultsFactory.createError(
          CommonErrorsDefinition.valueIsNotUUID7,
        );
  }
}
