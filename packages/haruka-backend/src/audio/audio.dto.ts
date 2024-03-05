import { ApiProperty } from '@nestjs/swagger';

export class GenerateAudioDTO {
  @ApiProperty({ required: true, description: '需要合成音频的 Session UUID' })
  sessionUUID: string;
}
