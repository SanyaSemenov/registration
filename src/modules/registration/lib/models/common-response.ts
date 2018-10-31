export interface CommonResponse<T> {
  code: number;
  status: string;
  data: T;
}
