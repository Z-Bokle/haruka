import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseHttpException } from 'src/exceptions/exceptions';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error(exception);
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    // const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      errorCode:
        exception instanceof BaseHttpException ? exception.errorCode : status,
      errorMessage: exception.message ?? '服务器异常',
      data: null,
      timestamp: new Date().getTime(),
      message: null,
    });
  }
}
