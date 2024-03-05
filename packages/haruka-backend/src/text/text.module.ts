import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [TaskModule],
  providers: [TextService],
  controllers: [TextController],
})
export class TextModule {}
