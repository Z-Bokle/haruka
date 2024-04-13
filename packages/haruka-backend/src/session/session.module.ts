import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/entities/session.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Session]),
    NotificationModule,
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
