export interface IPaginationResponse<T> {
  data: T[];
  page: number;
  elementsByPage: number;
  totalElements: number;
  totalPages: number;
}

export interface IPaginationArgsResponse<T>
  extends Omit<
    IPaginationResponse<T>,
    'page' | 'elementsByPage' | 'totalPages'
  > {
  skip: number;
  take: number;
}
