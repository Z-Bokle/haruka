import { NotImplementedException } from '@nestjs/common';
import { getUUID } from 'src/utils/uuid';
import { execFile } from 'child_process';
import { join, posix } from 'path';

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

export interface TextTaskConfig {
  prompt: string;
  apiKey: string | null;
  endpoint: string;
  modelName: string;
  scriptFileName: string;
}

export interface AudioTaskResult {
  audioUUID: string;
  audioFilePath: string;
}

export interface VideoTaskResult {
  videoUUID: string;
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
    const uuid = getUUID();
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
  private apiKey: string | null;
  private endpoint: string;
  private modelName: string;
  private scriptFileName: string;

  constructor(uuid: string, config: TextTaskConfig) {
    super(uuid, TaskType.TEXT);
    const { prompt, apiKey, endpoint, modelName, scriptFileName } = config;
    this.prompt = prompt;
    this.apiKey = apiKey;
    this.endpoint = endpoint;
    this.modelName = modelName;
    this.scriptFileName = scriptFileName;
  }

  protected runScript() {
    // const { onOut, onErr } = callbacks;

    return new Promise<string>((resolve, reject) => {
      const scriptFilePath = posix.join('scripts', this.scriptFileName);
      const props = [
        this.prompt,
        this.apiKey ?? '',
        this.endpoint,
        this.modelName,
      ];

      // console.log(props);

      try {
        const cp = execFile('bash', [scriptFilePath, ...props]);

        cp.stdout?.on('data', (out) => {
          resolve(out);
        });
        cp.stderr?.on('data', (err) => {
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async doTask() {
    try {
      const result = await this.runScript();
      return result;
    } catch (error) {
      console.error(error);
      // 必须在这里把异常处理，否则服务器将卡死，无法再处理任何请求
      // throw new ScriptRuntimeException(error.message);
    }
    return '';
  }
}

export class AudioTask extends Task<AudioTaskResult> {
  /** 可能会有其他参数 */
  private text: string;

  constructor(uuid: string, text: string) {
    super(uuid, TaskType.AUDIO);
    this.text = text;
  }

  protected runScript() {
    return new Promise<{ audioUUID: string; audioFilePath: string }>(
      (resolve, reject) => {
        const scriptFilePath = join(process.cwd(), 'scripts', 'audio.py');
        const targetFilePath = join(
          process.cwd(),
          'statics',
          'audio',
          `${this.uuid}.wav`,
        );
        // 生成的文本可能会有换行符，末尾的换行符会导致shell传递参数时出现错误，因此trim
        const args = [scriptFilePath, this.text.trim(), targetFilePath];
        try {
          const cp = execFile('python3', args, { shell: true });
          // const cp = spawn('python3', [scriptFilePath, this.text, this,], {shell: true})

          cp.stdout?.on('data', (out) => {
            if (out) {
              const result = {
                audioUUID: this.uuid,
                audioFilePath: targetFilePath,
              };
              console.log('stdout:', out);
              resolve(result);
            }
            reject('error');
          });
          cp.stderr?.on('data', (err) => {
            console.error('stderr:', err.toString('utf8'));
            // reject(err);
          });
        } catch (error) {
          reject(error);
        }
      },
    );
  }

  async doTask() {
    // TODO Audio Task 与路径
    // console.log('Audio task', this.text);
    const result = await this.runScript();
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

  runScript() {
    return new Promise<{ videoUUID: string; videoFilePath: string }>(
      (resolve, reject) => {
        const scriptFilePath = join(process.cwd(), 'scripts', 'video.py');
        const targetFilePath = join(
          process.cwd(),
          'statics',
          'video',
          `${this.uuid}.mp4`,
        );
        const args = [
          scriptFilePath,
          this.baseVideoFilePath,
          this.audioFilePath,
          targetFilePath,
        ];

        try {
          const cp = execFile('sh', [scriptFilePath, ...args], { shell: true });

          cp.stdout?.on('data', (out) => {
            if (out) {
              const result = {
                videoUUID: this.uuid,
                videoFilePath: targetFilePath,
              };
              console.log('stdout:', out);
              resolve(result);
            }
            reject('error');
          });
          cp.stderr?.on('data', (err) => {
            console.error('stderr:', err.toString('utf8'));
            // reject(err);
          });
        } catch (error) {
          reject(error);
        }
      },
    );
  }

  async doTask() {
    const result = await this.runScript();
    return result;
  }
}
