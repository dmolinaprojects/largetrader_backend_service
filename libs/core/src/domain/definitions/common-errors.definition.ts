import { BadRequestError } from '../errors';

export class CommonErrorsDefinition {
  static readonly valueIsNotBoolean = new BadRequestError(
    'Value is not boolean',
    'com-1000',
  );

  static readonly valueIsNotEmail = new BadRequestError(
    'Value is not email',
    'com-1001',
  );

  static readonly valueIsNotName = new BadRequestError(
    'Value is not name',
    'com-1002',
  );

  static readonly valueIsNotNumber = new BadRequestError(
    'Value is not number',
    'com-1003',
  );

  static readonly valueIsNotPositive = new BadRequestError(
    'Value is not positive',
    'com-1004',
  );

  static readonly valueIsNotString = new BadRequestError(
    'Value is not string',
    'com-1005',
  );

  static readonly valueIsNotUsername = new BadRequestError(
    'Value is not username',
    'com-1006',
  );

  static readonly valueIsNotUUID7 = new BadRequestError(
    'Value is not UUID v7',
    'com-1007',
  );
}
