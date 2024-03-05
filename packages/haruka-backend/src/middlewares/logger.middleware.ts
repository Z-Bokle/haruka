import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    console.log(
      `[Log] ${new Date()} Method:${request.method} Route:${
        request.originalUrl
      } IP:${request.ip}`,
    );
    next();
  }
}
