import { CommonErrorsDefinition } from '../definitions/common-errors.definition';
import { ActionResultsFactory } from '../factories';
import { IValueObject } from './value-object.vo';

export class BooleanVO implements IValueObject<boolean> {
  private constructor(readonly value: boolean) {}

  private isValidate(value: boolean): boolean {
    return typeof value === 'boolean';
  }

  public build(value: boolean): ActionResultsFactory<BooleanVO> {
    return this.isValidate(value)
      ? ActionResultsFactory.createSuccess(new BooleanVO(value))
      : ActionResultsFactory.createError(
          CommonErrorsDefinition.valueIsNotBoolean,
        );
  }
}
