import { Request } from 'express';
import { IResponseError, IResponseHash } from '../interfaces/response-format';

export const GlobalResponseError: (
  statusCode: number,
  message: string,
  code: string,
  request: Request,
) => IResponseError | IResponseHash = (
  statusCode: number,
  message: string,
  code: string,
  request: Request,
): IResponseError | IResponseHash => {
  const error = {
    statusCode: statusCode,
    message: message || 'Uncatched error message!',
    timestamp: new Date().toISOString(),
    method: request.method,
  };

  return error;
};
