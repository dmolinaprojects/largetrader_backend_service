import { EmailRegex } from '../constants';
import { CommonErrorsDefinition } from '../definitions';
import { ActionResultsFactory } from '../factories';
import { IValueObject } from './value-object.vo';

export class EmailVO implements IValueObject<string> {
  private constructor(readonly value: string) {}

  private isValidate(value: string): boolean {
    return EmailRegex.test(value);
  }

  public build(value: string): ActionResultsFactory<EmailVO> {
    return this.isValidate(value)
      ? ActionResultsFactory.createSuccess(new EmailVO(value))
      : ActionResultsFactory.createError(
          CommonErrorsDefinition.valueIsNotEmail,
        );
  }
}
