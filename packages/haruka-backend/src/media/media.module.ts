import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [TaskModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
