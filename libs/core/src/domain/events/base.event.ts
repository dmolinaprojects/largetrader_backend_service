export interface IBaseEvent<T> {
  readonly specversion: string;
  readonly type: string;
  readonly source: string;
  readonly id: string;
  readonly time: string;
  readonly datacontenttype: string;
  readonly correlationId: string;
  readonly data: T;
}
