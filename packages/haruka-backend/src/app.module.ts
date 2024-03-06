import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TextModule } from './text/text.module';
import { JwtAuthGuard } from './guards/guards';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { SessionModule } from './session/session.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { MediaModule } from './media/media.module';
import { TaskModule } from './task/task.module';
import { JwtDecodeMiddleware } from './middlewares/jwtdecode.middleware';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database/database.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    // 给中间件使用
    TypeOrmModule.forFeature([User]),
    UserModule,
    TextModule,
    SessionModule,
    MediaModule,
    TaskModule,
  ],
  controllers: [],
  providers: [
    {
      /* 
        APP_GUARD会将守卫应用到所有路由上，且无法被覆盖
        在合适的位置使用Public装饰器可以略过该守卫对JWT的校验
        虽然Public装饰器对其它守卫无效，但是也尽可能写在其他装饰器的下方
        这样，Public装饰器会在其他守卫生效之前略过JWT的验证，减少问题出现的可能
      */
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      // 全局序列化拦截器，用于屏蔽一些不该返回给用户的字段
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      // 全局格式化拦截器，用于格式化返回的结构
      useClass: ResponseInterceptor,
    },
    // 给中间件使用
    JwtService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(JwtDecodeMiddleware).forRoutes('*');
  }
}
