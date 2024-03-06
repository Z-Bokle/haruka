import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';
import { TaskModule } from 'src/task/task.module';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [TaskModule, SessionModule],
  providers: [TextService],
  controllers: [TextController],
})
export class TextModule {}
