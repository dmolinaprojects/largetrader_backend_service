import { BadRequestError } from '@app/core';

export class SmartWalletErrorsDefinition {
  static readonly notExists = new BadRequestError(
    'Smart wallet does not exist',
    'smw-1000',
  );
}
