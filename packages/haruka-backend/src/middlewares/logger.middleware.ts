import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    console.log(
      `[Log] ${new Date()} METHOD: ${request.method} URL:${request.url} IP:${
        request.ip
      }`,
    );
    next();
  }
}
