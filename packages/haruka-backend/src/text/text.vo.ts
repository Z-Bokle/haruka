import { ApiProperty } from '@nestjs/swagger';
import { BaseVO } from 'src/base.vo';
import { Model, PrePrompt } from 'src/entities/text.entity';

export class ModelListVO extends BaseVO {
  @ApiProperty({ type: [Model] })
  data: Model[];
}

export class PrePromptListVO extends BaseVO {
  @ApiProperty({ type: [PrePrompt] })
  data: PrePrompt[];
}

export class GenerateTextVO extends BaseVO {
  @ApiProperty({ type: String, description: '生成的文本' })
  data: string;
}
