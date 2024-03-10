import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Request } from 'express';

const exculdedPath = ['/media/stream'];

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    if (exculdedPath.includes(request.path)) {
      // 排除一些不需要做处理的路由
      return next.handle();
    }

    return next.handle().pipe(
      map((data: any) => {
        return {
          errorCode: 0,
          data,
          errorMessage: null,
          message: typeof data === 'boolean' && data ? '操作成功' : null,
          timestamp: new Date().getTime(),
        };
      }),
    );
  }
}
