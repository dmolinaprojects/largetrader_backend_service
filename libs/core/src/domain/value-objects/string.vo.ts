import { CommonErrorsDefinition } from '../definitions';
import { ActionResultsFactory } from '../factories';
import { IValueObject } from './value-object.vo';

export class StringVO implements IValueObject<string> {
  private constructor(readonly value: string) {}

  private isValidate(value: string): boolean {
    return typeof value === 'string';
  }

  public build(value: string): ActionResultsFactory<StringVO> {
    return this.isValidate(value)
      ? ActionResultsFactory.createSuccess(new StringVO(value))
      : ActionResultsFactory.createError(
          CommonErrorsDefinition.valueIsNotString,
        );
  }
}
