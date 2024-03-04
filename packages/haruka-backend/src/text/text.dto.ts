import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateTextDTO {
  @ApiProperty({ required: true, description: '调用的模型代号' })
  modelId: number;

  @ApiProperty({ required: true, description: '调用模型的提示词' })
  prompt: string;

  @ApiPropertyOptional({ description: '调用模型使用的API Key' })
  apiKey: string;
}
