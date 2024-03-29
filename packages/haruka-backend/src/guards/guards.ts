import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

/**
 * 本地登录守卫
 * 查表，表中包含用户就通过
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

/**
 * JWT登录守卫
 * 验证JWT，合法就通过
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    } else {
      return super.canActivate(context);
    }
  }
}
