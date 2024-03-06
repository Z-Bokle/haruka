import { Injectable } from '@nestjs/common';
import { UpdateItemsDTO } from './text.dto';
import { TaskService } from 'src/task/task.service';
import { SessionService } from 'src/session/session.service';
import {
  SessionNotFoundException,
  UnexpectedPromptException,
  UnexpectedSessionStatusException,
} from 'src/exceptions/exceptions';

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

    if (session.step !== 0 && session.step !== 1) {
      // 不处于可以生成文本的状态
      throw new UnexpectedSessionStatusException();
    }

    const { prompt, apiKey } = session;

    if (!prompt) {
      throw new UnexpectedPromptException();
    }

    const text = await this.taskService.doTextTask(prompt, apiKey);

    // 第一次生成，则更新Session步骤
    if (session.step === 0) {
      const { result } = await this.sessionService.updateSessionStep(
        userId,
        sessionUUID,
        1,
      );
      if (!result) {
        throw new UnexpectedSessionStatusException();
      }
    }

    const result = await this.sessionService.updateSession(
      userId,
      sessionUUID,
      { text },
    );
    if (!result) {
      throw new UnexpectedSessionStatusException();
    }

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

  // 更新文本表单项
  async updateItems(userId: number, updateItemsDTO: UpdateItemsDTO) {
    const { sessionUUID, ...restProps } = updateItemsDTO;

    const session = await this.sessionService.findOne(sessionUUID, userId);
    if (!session) {
      throw new SessionNotFoundException();
    }

    if (session.step !== 0 && session.step !== 1) {
      // 不处于可以生成文本的状态
      throw new UnexpectedSessionStatusException();
    }

    const result = await this.sessionService.updateSession(
      userId,
      sessionUUID,
      restProps,
    );
    if (!result) {
      throw new UnexpectedSessionStatusException();
    }
    return result;
  }
}
