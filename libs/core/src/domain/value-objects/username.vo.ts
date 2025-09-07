import { UsernameRegex } from '../constants';
import { CommonErrorsDefinition } from '../definitions';
import { ActionResultsFactory } from '../factories';
import { IValueObject } from './value-object.vo';

export class UsernameVO implements IValueObject<string> {
  private constructor(readonly value: string) {}

  private isValidate(value: string): boolean {
    return UsernameRegex.test(value);
  }

  public build(value: string): ActionResultsFactory<UsernameVO> {
    return this.isValidate(value)
      ? ActionResultsFactory.createSuccess(new UsernameVO(value))
      : ActionResultsFactory.createError(
          CommonErrorsDefinition.valueIsNotUsername,
        );
  }
}
