import { ApiProperty } from '@nestjs/swagger';

export class GenerateAudioDTO {
  @ApiProperty({ required: true, description: '需要合成音频的 Session UUID' })
  sessionUUID: string;
}

export class GenerateVideoDTO {
  @ApiProperty({ required: true, description: '需要合成视频的 Session UUID' })
  sessionUUID: string;
}

export class UploadBaseVideoDTO {
  @ApiProperty({
    required: true,
    description: '需要上传的视频文件',
    format: 'binary',
  })
  file: any;

  @ApiProperty({ required: true, description: '上传视频的 Session UUID' })
  sessionUUID: string;
}

// export class MediaStreamDTO {
//   @ApiProperty({ required: true, description: '需要查看资源的Session UUID' })
//   sessionUUID: string;

//   @ApiProperty({ required: true, description: '资源UUID' })
//   resourceUUID: string;
// }
