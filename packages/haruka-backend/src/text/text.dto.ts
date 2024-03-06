import { ApiProperty } from '@nestjs/swagger';

export class GenerateTextDTO {
  @ApiProperty({ description: '会话UUID' })
  sessionUUID: string;
}

export class UpdateItemsDTO {
  @ApiProperty({
    example: '00a6fa25-df29-4701-9077-557932591766',
    description: '会话UUID',
  })
  sessionUUID: string;

  @ApiProperty({ example: 1, description: '当前会话的模型id' })
  modelId: number;

  @ApiProperty({
    example: '请生成一段有关...',
    description: '当前会话的提示词',
  })
  prompt: string;

  @ApiProperty({ description: '调用文本模型需要的API Key', type: String })
  apiKey: string;
}
