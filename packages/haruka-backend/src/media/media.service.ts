import { Injectable } from '@nestjs/common';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class MediaService {
  constructor(private readonly taskService: TaskService) {}

  async generateAudio(text: string) {
    const result = await this.taskService.doAudioTask(text);
    return result;
  }

  async generateVideo(baseVideoFilePath: string, audioFilePath: string) {
    const result = await this.taskService.doVideoTask(
      baseVideoFilePath,
      audioFilePath,
    );
    return result;
  }

  async getTextBySessionUUID(sessionUUID: string) {
    /** 查数据库，先确保用户与Session合法(session存在、可用、用户匹配、步骤已经完成了文本生成)，再查找文本 */

    const text = `这个是根据sessionUUID:${sessionUUID}查出来的文本`;
    return text;
  }
}
