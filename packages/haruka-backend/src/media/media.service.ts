import { Injectable } from '@nestjs/common';

import { join } from 'path';
import {
  AssetsLostException,
  SessionNotFoundException,
  UnexpectedSessionStatusException,
} from 'src/exceptions/exceptions';
import { SessionService } from 'src/session/session.service';
import { TaskService } from 'src/task/task.service';
import { FileManager } from 'src/utils/file';
import { getUUID } from 'src/utils/uuid';

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

    if (!text) {
      throw new AssetsLostException();
    }

    const result = await this.taskService.doAudioTask(text);

    if (session.step === 1) {
      const { result: stepResult } =
        await this.sessionService.updateSessionStep(userId, sessionUUID, 1);
      if (!stepResult) {
        throw new UnexpectedSessionStatusException();
      }
    }

    const sqlResult = await this.sessionService.updateSession(
      userId,
      sessionUUID,
      result,
    );

    if (!sqlResult) {
      throw new UnexpectedSessionStatusException();
    }

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

    if (!baseVideoFilePath || !audioFilePath) {
      throw new AssetsLostException();
    }

    const result = await this.taskService.doVideoTask(
      baseVideoFilePath,
      audioFilePath,
    );

    if (session.step === 2) {
      const { result: stepResult } =
        await this.sessionService.updateSessionStep(userId, sessionUUID, 1);
      if (!stepResult) {
        throw new UnexpectedSessionStatusException();
      }
    }

    const sqlResult = await this.sessionService.updateSession(
      userId,
      sessionUUID,
      result,
    );

    if (!sqlResult) {
      throw new UnexpectedSessionStatusException();
    }

    return result;
  }

  async uploadFile(
    file: Express.Multer.File,
    userIdStr: string,
    sessionUUID: string,
  ) {
    const targetPath = join(process.cwd(), 'statics', 'uploads', userIdStr);
    FileManager.createDir(targetPath);

    const baseVideoUUID = getUUID();

    await FileManager.writeFile({
      file,
      targetPath,
      targetName: `${baseVideoUUID}.mp4`,
    });

    const userId = parseInt(userIdStr);

    const result = await this.sessionService.updateSession(
      userId,
      sessionUUID,
      {
        baseVideoFilePath: join(targetPath, `${baseVideoUUID}.mp4`),
        baseVideoUUID,
      },
    );

    if (result) {
      return baseVideoUUID;
    } else {
      throw new UnexpectedSessionStatusException();
    }
  }

  async getMediaFilePath(sessionUUID: string, resuorceUUID: string) {
    const session = await this.sessionService.findOneWithoutUserId(sessionUUID);
    if (session?.audioUUID === resuorceUUID) {
      return { path: session.audioFilePath, mime: 'audio/wav', prefix: 'wav' };
    } else if (session?.videoUUID === resuorceUUID) {
      return { path: session.videoFilePath, mime: 'video/mp4', prefix: 'mp4' };
    } else if (session?.baseVideoUUID === resuorceUUID) {
      return {
        path: session.baseVideoFilePath,
        mime: 'video/mp4',
        prefix: 'mp4',
      };
    } else {
      throw new AssetsLostException();
    }
  }
}
