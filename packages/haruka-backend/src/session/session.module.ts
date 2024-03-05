import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  providers: [SessionController, SessionService],
})
export class SessionModule {}
