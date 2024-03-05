import { Body, Controller, Post } from '@nestjs/common';
import { AudioService } from './audio.service';
import { GenerateAudioDTO } from './audio.dto';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('generate')
  async generateAudio(@Body() body: GenerateAudioDTO) {
    const sessionUUID = body.sessionUUID;

    const text = await this.audioService.getTextBySessionUUID(sessionUUID);
    return await this.audioService.generateAudio(text);
  }
}
