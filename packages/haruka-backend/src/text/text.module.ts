import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';

@Module({
  imports: [],
  providers: [TextService],
  controllers: [TextController],
})
export class TextModule {}
