import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { join } from 'path';
import {
  SessionNotFoundException,
  UnexpectedSessionStatusException,
} from 'src/exceptions/exceptions';
import { SessionService } from 'src/session/session.service';
import { TaskService } from 'src/task/task.service';
import { FileManager } from 'src/utils/file';

@Injectable()
export class MediaService {
  constructor(
    private readonly taskService: TaskService,
    private readonly sessionService: SessionService,
  ) {}

  async generateAudio(sessionUUID: string, userId: number) {
    /**
     * 查数据库，先确保用户与Session合法
     * (session存在、可用、用户匹配、步骤已经完成了文本生成)，
     * 再查找文本
     */

    const session = await this.sessionService.findOne(sessionUUID, userId);

    if (!session) {
      throw new SessionNotFoundException();
    }

    if (session.step !== 1 && session.step !== 2) {
      // Session状态不处于可以生成音频的阶段
      throw new UnexpectedSessionStatusException();
    }

    const text = session.text;

    const result = await this.taskService.doAudioTask(text);
    return result;
  }

  async generateVideo(sessionUUID: string, userId: number) {
    const session = await this.sessionService.findOne(sessionUUID, userId);

    if (!session) {
      throw new SessionNotFoundException();
    }

    if (session.step !== 2 && session.step !== 3) {
      // Session状态不处于可以生成视频的阶段
      throw new UnexpectedSessionStatusException();
    }

    const baseVideoFilePath = session.baseVideoFilePath;
    const audioFilePath = session.audioFilePath;

    const result = await this.taskService.doVideoTask(
      baseVideoFilePath,
      audioFilePath,
    );
    return result;
  }

  async uploadFile(file: Express.Multer.File, userIdStr: string) {
    const targetPath = join('statics', 'uploads', userIdStr);
    FileManager.createDir(targetPath);
    await FileManager.writeFile({
      file,
      targetPath,
      targetName: `${randomUUID()}.mp4`,
    });
  }
}
