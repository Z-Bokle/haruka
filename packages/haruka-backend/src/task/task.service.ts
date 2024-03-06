import { Injectable } from '@nestjs/common';
import { AudioTask, TextTask, TextTaskConfig, VideoTask } from './task';
import { getUUID } from 'src/utils/uuid';

@Injectable()
export class TaskService {
  async doTextTask(config: TextTaskConfig) {
    const uuid = getUUID();
    const task = new TextTask(uuid, config);
    const result = await task.run();
    return result;
  }

  async doAudioTask(text: string) {
    const uuid = getUUID();
    const task = new AudioTask(uuid, text);
    const result = await task.run();
    return result;
  }

  async doVideoTask(baseVideoFilePath: string, audioFilePath: string) {
    const uuid = getUUID();
    const task = new VideoTask(uuid, baseVideoFilePath, audioFilePath);
    const result = await task.run();
    return result;
  }
}
