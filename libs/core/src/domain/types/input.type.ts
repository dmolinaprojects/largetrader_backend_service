export type TSelect<T> = { [k in keyof T]?: true };

// export type TEnumerable<T> = T | Array<T>;
export type TEnumerable<T> = Array<T>;

export type TSortType<T = unknown> = { [k in keyof T]?: TSortOrder };

export type TSortOrder = 'asc' | 'desc';

export type TQueryMode = 'default' | 'insensitive';

export type TBooleanFilterRequest = {
  equals?: boolean;
  not?: TBooleanFilterRequest | boolean;
};

export type TBooleanNullableFilterRequest = {
  equals?: boolean | null;
  not?: TBooleanNullableFilterRequest | boolean | null;
};

export type TBytesFilterRequest = {
  equals?: Uint8Array<ArrayBufferLike>;
  not?: TBytesFilterRequest | Uint8Array<ArrayBufferLike>;
};

export type TBytesNullableFilterRequest = {
  equals?: Uint8Array<ArrayBufferLike> | null;
  not?: TBytesNullableFilterRequest | Uint8Array<ArrayBufferLike> | null;
};

export type TStringFilterRequest = {
  equals?: string;
  in?: TEnumerable<string>;
  notIn?: TEnumerable<string>;
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  mode?: TQueryMode;
  // not?: Omit<TStringFilterRequest, 'mode'> | string;
  not?: Omit<TStringFilterRequest, 'mode' | 'not'>;
};

export type TStringNullableFilterRequest = {
  equals?: string | null;
  in?: TEnumerable<string> | null;
  notIn?: TEnumerable<string> | null;
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  mode?: TQueryMode;
  not?: Omit<TStringNullableFilterRequest, 'mode'> | string | null;
};

export type TIntFilterRequest = {
  in?: TEnumerable<number>;
  notIn?: TEnumerable<number>;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  mode?: TQueryMode;
};

export type TIntNullableFilterRequest = {
  in?: TEnumerable<number> | null;
  notIn?: TEnumerable<number> | null;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  mode?: TQueryMode;
};

export type TFloatFilterRequest = {
  in?: TEnumerable<number>;
  notIn?: TEnumerable<number>;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  mode?: TQueryMode;
};

export type TFloatNullableFilterRequest = {
  in?: TEnumerable<number> | null;
  notIn?: TEnumerable<number> | null;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  mode?: TQueryMode;
};

export type TBigIntFilterRequest = {
  in?: TEnumerable<bigint>;
  notIn?: TEnumerable<bigint>;
  lt?: bigint;
  lte?: bigint;
  gt?: bigint;
  gte?: bigint;
  mode?: TQueryMode;
};

export type TBigIntNullableFilterRequest = {
  in?: TEnumerable<bigint> | null;
  notIn?: TEnumerable<bigint> | null;
  lt?: bigint;
  lte?: bigint;
  gt?: bigint;
  gte?: bigint;
  mode?: TQueryMode;
};

export type TDateTimeFilterRequest = {
  // equals?: Date | string;
  equals?: Date;
  // in?: TEnumerable<Date> | TEnumerable<string>;
  in?: TEnumerable<Date>;
  // notIn?: TEnumerable<Date> | TEnumerable<string>;
  notIn?: TEnumerable<Date>;
  // lt?: Date | string;
  lt?: Date;
  // lte?: Date | string;
  lte?: Date;
  // gt?: Date | string;
  gt?: Date;
  // gte?: Date | string;
  gte?: Date;
  // not?: TDateTimeFilterRequest | Date | string;
  not?: Omit<TDateTimeFilterRequest, 'not'>;
};

export type TDateTimeNullableFilterRequest = {
  equals?: Date | string | null;
  in?: TEnumerable<Date> | TEnumerable<string> | null;
  notIn?: TEnumerable<Date> | TEnumerable<string> | null;
  lt?: Date | string;
  lte?: Date | string;
  gt?: Date | string;
  gte?: Date | string;
  not?: TDateTimeNullableFilterRequest | Date | string | null;
};

export type TEnumFilterRequest<T> = {
  equals?: T;
  in?: TEnumerable<T>;
  notIn?: TEnumerable<T>;
  not?: TEnumFilterRequest<T> | T;
};

export type TPaginationInput = {
  page: number;
  elementsByPage: number;
};

export type TPaginationDto = {
  skip: number;
  take: number;
};

export type TFindManyWhere<TModel> = {
  [k in keyof TModel]?: TModel[k] extends string
    ? TStringFilterRequest
    : TModel[k] extends number
      ? TIntFilterRequest
      : TModel[k] extends bigint
        ? TBigIntFilterRequest
        : TModel[k] extends boolean
          ? TBooleanFilterRequest
          : TModel[k] extends Date
            ? TDateTimeFilterRequest
            : TModel[k] extends Uint8Array<ArrayBufferLike>
              ? TBytesFilterRequest
              : TModel[k] extends string | null
                ? TStringNullableFilterRequest
                : TModel[k] extends boolean | null
                  ? TBooleanNullableFilterRequest
                  : TModel[k] extends number | null
                    ? TIntNullableFilterRequest
                    : TModel[k] extends bigint | null
                      ? TBigIntNullableFilterRequest
                      : TModel[k] extends Date | null
                        ? TDateTimeNullableFilterRequest
                        : TModel[k] extends Uint8Array<ArrayBufferLike> | null
                          ? TBytesNullableFilterRequest
                          : never;
};
