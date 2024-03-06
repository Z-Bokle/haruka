import { Injectable } from '@nestjs/common';
import { UpdateItemsDTO } from './text.dto';
import { TaskService } from 'src/task/task.service';
import { SessionService } from 'src/session/session.service';
import { SessionNotFoundException } from 'src/exceptions/exceptions';

@Injectable()
export class TextService {
  constructor(
    private readonly taskService: TaskService,
    private readonly sessionService: SessionService,
  ) {}

  // 调用文本大模型生成文本
  async generateText(userId: number, sessionUUID: string) {
    const session = await this.sessionService.findOne(sessionUUID, userId);
    if (!session) {
      throw new SessionNotFoundException();
    }
    const { prompt, apiKey } = session;
    const text = await this.taskService.doTextTask(prompt, apiKey);

    return text;
  }

  // 查找模型列表
  async getModelList() {
    return [];
  }

  // 查找提示词预设方案列表
  async getPrePromptList() {
    return [];
  }

  async updateItems(userId: number, updateItemsDTO: UpdateItemsDTO) {
    const { sessionUUID, ...restProps } = updateItemsDTO;
    const result = await this.sessionService.updateSession(
      userId,
      sessionUUID,
      restProps,
    );
    return result;
  }
}
