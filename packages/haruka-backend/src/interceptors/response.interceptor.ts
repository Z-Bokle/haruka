import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
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
