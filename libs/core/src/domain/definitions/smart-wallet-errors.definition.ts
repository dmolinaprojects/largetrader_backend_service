import { ConflictError } from '../errors';

export class SmartWalletErrorsDefinition {
  static readonly notFound = new ConflictError(
    'Smart wallet not found',
    'smw-1000',
  );
}
