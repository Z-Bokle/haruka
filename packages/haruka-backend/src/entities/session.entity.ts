import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Session {
  @ApiProperty({
    example: '00a6fa25-df29-4701-9077-557932591766',
    description: '会话UUID',
  })
  @PrimaryColumn({ name: 'session_uuid' })
  sessionUUID: string;

  @ApiProperty({
    example: 1,
    description:
      '该会话是否可用，1即可用，则用户可见；0即不可用，则用户不可见。用户对会话执行删除操作时将从可用变为不可用。',
  })
  @Column({ name: 'is_available' })
  @Exclude()
  isAvailable: 0 | 1;

  @ApiProperty({
    example: 1709714333609,
    description: '该会话最后一次修改时间的时间戳',
  })
  @Column({ name: 'last_modified' })
  lastModified: number;

  @ApiProperty({
    example: 1,
    description: '该会话属于哪个用户',
  })
  @Column({ name: 'user_id' })
  userId: number;

  /**
   * 0 - 未开始
   * 1 - 已确认文本
   * 2 - 已确认音频
   * 3 - 已确认视频(结束)
   * 每确认一个阶段，就冻结该阶段的内容，使其只读
   */
  @ApiProperty({ example: 0, description: '当前会话处于哪个阶段' })
  @Column({ name: 'step' })
  step: 0 | 1 | 2 | 3;

  /** 文本部分 */
  @ApiProperty({ example: 1, description: '当前会话的模型id' })
  @Column({ name: 'model_id' })
  modelId: number;

  @ApiProperty({
    example: '请生成一段有关...',
    description: '当前会话的提示词',
  })
  @Column({ name: 'prompt' })
  prompt: string;

  @ApiProperty({
    example: '新闻的内容是...',
    description: '当前会话来自大模型生成的文本内容',
  })
  @Column({ name: 'text' })
  text: string;
  /** 音频部分 */
  @ApiProperty({
    example: '00a6fa25-df29-4701-9077-557932591766',
    description: '当前会话的音频UUID',
  })
  @Column({ name: 'audio_uuid' })
  audioUUID: string;

  @ApiProperty({
    example: '/audio/00a6fa25-df29-4701-9077-557932591766.wav',
    description: '生成音频的文件路径',
  })
  @Column({ name: 'audio_file_path' })
  @Exclude()
  audioFilePath: string;

  /** 视频部分 */
  @ApiProperty({
    example: '00a6fa25-df29-4701-9077-557932591766',
    description: '当前会话的生成视频UUID',
  })
  @Column({ name: 'video_uuid' })
  videoUUID: string;

  @ApiProperty({
    example: '/video/00a6fa25-df29-4701-9077-557932591766.mp4',
    description: '生成视频的文件路径',
  })
  @Column({ name: 'video_file_path' })
  @Exclude()
  videoFilePath: string;

  @ApiProperty({
    example: '/baseVideo/00a6fa25-df29-4701-9077-557932591766.mp4',
  })
  @Column({ name: 'base_video_file_path' })
  @Exclude()
  baseVideoFilePath: string;
}
