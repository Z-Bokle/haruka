import { Injectable } from '@nestjs/common';
import { AudioTask, TextTask, VideoTask } from './task';
import { randomUUID } from 'crypto';

@Injectable()
export class TaskService {
  private static getNewUUID() {
    return randomUUID();
  }

  async doTextTask(prompt: string, apiKey: string) {
    const uuid = TaskService.getNewUUID();
    const task = new TextTask(uuid, prompt, apiKey);
    const result = await task.run();
    return result;
  }

  async doAudioTask(text: string) {
    const uuid = TaskService.getNewUUID();
    const task = new AudioTask(uuid, text);
    const result = await task.run();
    return result;
  }

  async doVideoTask(baseVideoFilePath: string, audioFilePath: string) {
    const uuid = TaskService.getNewUUID();
    const task = new VideoTask(uuid, baseVideoFilePath, audioFilePath);
    const result = await task.run();
    return result;
  }
}
