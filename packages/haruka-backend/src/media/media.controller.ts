import {
  Body,
  Controller,
  Get,
  Headers,
  Response,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';
import {
  GenerateAudioDTO,
  GenerateVideoDTO,
  // MediaStreamDTO,
  UploadBaseVideoDTO,
} from './media.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FileValidationPipe } from 'src/pipes/filevalidation.pipe';
import { Request, Response as ExpressResponse } from 'express';
import {
  SessionNotFoundException,
  UserNotFoundException,
} from 'src/exceptions/exceptions';
import { createReadStream } from 'fs';
import { Public } from 'src/decorators/public.decorator';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('audio/generate')
  async generateAudio(
    @Body() body: GenerateAudioDTO,
    @Headers() headers: Request['headers'],
  ) {
    const userIdStr = headers['User-ID'];

    if (!userIdStr) {
      throw new UserNotFoundException();
    }

    const sessionUUID = body.sessionUUID;
    const userId = parseInt(userIdStr as string);

    const result = await this.mediaService.generateAudio(sessionUUID, userId);
    return result.audioUUID;
  }

  @Post('video/generate')
  async generateVideo(
    @Body() body: GenerateVideoDTO,
    @Headers() headers: Request['headers'],
  ) {
    const userIdStr = headers['User-ID'];

    if (!userIdStr) {
      throw new UserNotFoundException();
    }

    const sessionUUID = body.sessionUUID;
    const userId = parseInt(userIdStr as string);

    const result = await this.mediaService.generateVideo(sessionUUID, userId);
    return result.videoUUID;
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传用于视频合成的原视频文件',
    type: UploadBaseVideoDTO,
  })
  @Post('video/base/upload')
  @UsePipes(
    new FileValidationPipe(20 * 1024 * 1024, '视频文件大小超出限制，最多20MB'),
  )
  @UseInterceptors(FileInterceptor('file'))
  async uploadBaseVideo(
    @UploadedFile()
    file: Express.Multer.File,
    @Headers() headers: Request['headers'],
    @Body() body: UploadBaseVideoDTO,
  ) {
    const userIdStr = headers['User-ID'];
    const sessionUUID = body.sessionUUID;

    if (!userIdStr) {
      throw new UserNotFoundException();
    }

    if (!sessionUUID) {
      throw new SessionNotFoundException();
    }

    const result = await this.mediaService.uploadFile(
      file,
      userIdStr as string,
      sessionUUID,
    );
    return result;
  }

  @Get('stream')
  @ApiQuery({ name: 'sessionUUID', required: true })
  @ApiQuery({ name: 'resourceUUID', required: true })
  @Public()
  async getMediaStream(
    @Query('sessionUUID') sessionUUID: string,
    @Query('resourceUUID') resourceUUID: string,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    if (!sessionUUID) {
      throw new SessionNotFoundException();
    }

    const { path, mime, prefix } = await this.mediaService.getMediaFilePath(
      sessionUUID,
      resourceUUID,
    );

    res.set({
      'Content-Type': mime,
      'Content-Disposition': `attachment; filename=${resourceUUID}.${prefix}`,
    });

    const fileStream = createReadStream(path);

    return new StreamableFile(fileStream);
  }
}
