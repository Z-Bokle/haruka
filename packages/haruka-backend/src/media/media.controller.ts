import { Body, Controller, Post } from '@nestjs/common';
import { MediaService } from './media.service';
import { GenerateAudioDTO } from './media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('audio/generate')
  async generateAudio(@Body() body: GenerateAudioDTO) {
    const sessionUUID = body.sessionUUID;

    const text = await this.mediaService.getTextBySessionUUID(sessionUUID);
    return await this.mediaService.generateAudio(text);
  }
}
