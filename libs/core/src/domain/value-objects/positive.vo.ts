import { CommonErrorsDefinition } from '../definitions';
import { ActionResultsFactory } from '../factories';
import { IValueObject } from './value-object.vo';

export class PositiveVO implements IValueObject<number> {
  private constructor(readonly value: number) {}

  private isValidate(value: number): boolean {
    return typeof value === 'number' && value > 0;
  }

  public build(value: number): ActionResultsFactory<PositiveVO> {
    return this.isValidate(value)
      ? ActionResultsFactory.createSuccess(new PositiveVO(value))
      : ActionResultsFactory.createError(
          CommonErrorsDefinition.valueIsNotPositive,
        );
  }
}
