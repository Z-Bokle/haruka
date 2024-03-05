import { NotImplementedException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export enum TaskType {
  TEXT,
  AUDIO,
  VIDEO,
}

export enum TaskStatus {
  WAITING,
  PROCESSING,
  FINISHED,
  FAILED,
}

export interface AudioTaskResult {
  uuid: string;
  audioFilePath: string;
}

export interface VideoTaskResult {
  uuid: string;
  videoFilePath: string;
}

export class Task<T> {
  protected constructor(uuid: string, type: TaskType) {
    this.uuid = uuid;
    this.type = type;
    this.status = TaskStatus.WAITING;
  }

  uuid: string;
  type: TaskType;
  status: TaskStatus;

  private updateStatus(status: TaskStatus) {
    this.status = status;
  }

  static create(type: TaskType) {
    const uuid = randomUUID();
    return new this(uuid, type);
  }

  /**
   *  启动任务调用的实例方法，
   *  任务运行失败将抛出异常并将状态置于FAILED，
   *  否则将状态置于PROCESSING，
   *  任务成功后将状态置于FINISHED，并返回结果 */
  async run() {
    let result;
    try {
      this.updateStatus(TaskStatus.PROCESSING);
      result = await this.doTask();
      this.updateStatus(TaskStatus.FINISHED);
    } catch (error) {
      this.updateStatus(TaskStatus.FAILED);
      throw error;
    }
    return result;
  }

  /** 具体的任务只需要override该方法即可 */
  async doTask(): Promise<T> {
    throw new NotImplementedException();
  }
}

export class TextTask extends Task<string> {
  private prompt: string;
  private apiKey: string;

  constructor(uuid: string, prompt: string, apiKey: string) {
    super(uuid, TaskType.TEXT);
    this.prompt = prompt;
    this.apiKey = apiKey;
  }

  async doTask() {
    console.log('Text task', this.prompt, this.apiKey);
    const result = '大模型返回的结果';
    return result;
  }
}

export class AudioTask extends Task<AudioTaskResult> {
  /** 可能会有其他参数 */
  private text: string;

  constructor(uuid: string, text: string) {
    super(uuid, TaskType.AUDIO);
    this.text = text;
  }

  async doTask() {
    console.log('Audio task', this.text);
    const result = {
      uuid: this.uuid,
      audioFilePath: '完整路径',
    };
    return result;
  }
}

export class VideoTask extends Task<VideoTaskResult> {
  /** 可能会有其他参数 */
  private baseVideoFilePath: string;
  private audioFilePath: string;

  constructor(uuid: string, baseVideoFilePath: string, audioFilePath: string) {
    super(uuid, TaskType.VIDEO);
    this.baseVideoFilePath = baseVideoFilePath;
    this.audioFilePath = audioFilePath;
  }

  async doTask() {
    console.log('Video task', this.baseVideoFilePath, this.audioFilePath);
    const result = {
      uuid: this.uuid,
      videoFilePath: '完整路径',
    };
    return result;
  }
}
