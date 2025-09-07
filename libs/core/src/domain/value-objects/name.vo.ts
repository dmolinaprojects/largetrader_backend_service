import { NameRegex } from '../constants';
import { CommonErrorsDefinition } from '../definitions';
import { ActionResultsFactory } from '../factories';
import { IValueObject } from './value-object.vo';

export class NameVO implements IValueObject<string> {
  private constructor(readonly value: string) {}

  protected isValidate(value: string): boolean {
    return NameRegex.test(value);
  }

  public build(value: string): ActionResultsFactory<NameVO> {
    return this.isValidate(value)
      ? ActionResultsFactory.createSuccess(new NameVO(value))
      : ActionResultsFactory.createError(CommonErrorsDefinition.valueIsNotName);
  }
}
