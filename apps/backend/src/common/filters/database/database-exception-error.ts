export class DatabaseExceptionError extends Error {
  public readonly code: string;
  public readonly detail: string;

  constructor(message: string, code: string, detail: string) {
    super(message);
    this.name = 'DatabaseExceptionError';
    this.code = code;
    this.detail = detail;
  }
}
