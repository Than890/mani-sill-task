import {
  Catch,
  Logger,
  ArgumentsHost,
  BadRequestException,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { GlobalResponseError } from './response-error';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    Logger.error((exception as any).stack, `${request.method} ${request.url}`);

    const code = 'HttpException';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message =
      (exception as any).message.message || 'Internal server error!';

    switch (exception.constructor) {
      // http errors
      case HttpException:
      case NotFoundException:
        status = (exception as HttpException).getStatus();
        message = (exception as HttpException).message;
        break;
      case UnauthorizedException:
        status = HttpStatus.UNAUTHORIZED;
        message = (exception as any).message;
        break;

      // Prisma Errors
      case PrismaClientKnownRequestError:
        status = HttpStatus.CONFLICT;
        message = (exception as PrismaClientKnownRequestError).message.replace(
          /\n/g,
          '',
        );
        break;
      case PrismaClientValidationError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as PrismaClientValidationError).message.replace(
          /\n/g,
          '',
        );
      case PrismaClientRustPanicError:
        status = HttpStatus.BAD_REQUEST;
        message = (exception as PrismaClientRustPanicError).message.replace(
          /\n/g,
          '',
        );
      case PrismaClientUnknownRequestError:
        status = HttpStatus.BAD_REQUEST;
        message = (
          exception as PrismaClientUnknownRequestError
        ).message.replace(/\n/g, '');
      case PrismaClientInitializationError:
        status = HttpStatus.BAD_REQUEST;
        message = (
          exception as PrismaClientInitializationError
        ).message.replace(/\n/g, '');

      case ForbiddenException:
        status = HttpStatus.FORBIDDEN;
        message = (exception as any)?.response.message;
        break;

      case BadRequestException:
        status = HttpStatus.BAD_REQUEST;
        message = (exception as any)?.response?.message;
        break;

      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response
      .status(status)
      .json(GlobalResponseError(status, message, code, request));
  }
}
