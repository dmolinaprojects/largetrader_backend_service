import { BadRequestError } from '@app/core';

export class LicenseContractErrorsDefinition {
  static readonly notExists = new BadRequestError(
    'License contract does not exist',
    'lic-1000',
  );

  static readonly startAndFinishDatesInvalid = new BadRequestError(
    'Start date must be less than finish date',
    'lic-1001',
  );

  static readonly minAndMaxTokensInvalid = new BadRequestError(
    'Min tokens must be less than max tokens',
    'lic-1002',
  );

  static readonly totalTokensInvalid = new BadRequestError(
    'Total tokens must be less than max tokens',
    'lic-1003',
  );

  static readonly soldTokensInvalid = new BadRequestError(
    'Sold tokens must be less than max tokens',
    'lic-1004',
  );
}
