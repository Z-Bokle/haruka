import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { TaskModule } from 'src/task/task.module';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [TaskModule, SessionModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
