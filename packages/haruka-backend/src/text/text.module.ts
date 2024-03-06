import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';
import { TaskModule } from 'src/task/task.module';
import { SessionModule } from 'src/session/session.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model, PrePrompt } from 'src/entities/text.entity';

@Module({
  imports: [
    TaskModule,
    SessionModule,
    TypeOrmModule.forFeature([PrePrompt, Model]),
  ],
  providers: [TextService],
  controllers: [TextController],
})
export class TextModule {}
