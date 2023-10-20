export interface IResponseData<T> {
  method: string;
  timestamp: string;
  statusCode: number;
  message: string;
  data: T;
}

export interface IResponseHash {
  result: string;
}

export interface IResponseError {
  method: string;
  timestamp: string;
  statusCode: number;
  message: string;
}
