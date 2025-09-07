import { CommonErrorsDefinition } from '../definitions';
import { ActionResultsFactory } from '../factories';
import { IValueObject } from './value-object.vo';

export class NumberVO implements IValueObject<number> {
  private constructor(readonly value: number) {}

  private isValidate(value: number): boolean {
    return typeof value === 'number';
  }

  public build(value: number): ActionResultsFactory<NumberVO> {
    return this.isValidate(value)
      ? ActionResultsFactory.createSuccess(new NumberVO(value))
      : ActionResultsFactory.createError(
          CommonErrorsDefinition.valueIsNotNumber,
        );
  }
}
