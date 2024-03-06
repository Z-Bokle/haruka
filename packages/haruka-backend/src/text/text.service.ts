import { Injectable } from '@nestjs/common';
import { UpdateItemsDTO } from './text.dto';
import { TaskService } from 'src/task/task.service';
import { SessionService } from 'src/session/session.service';
import {
  ModelNotFoundException,
  SessionNotFoundException,
  UnexpectedPromptException,
  UnexpectedSessionStatusException,
} from 'src/exceptions/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Model, PrePrompt } from 'src/entities/text.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TextService {
  constructor(
    private readonly taskService: TaskService,
    private readonly sessionService: SessionService,
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    @InjectRepository(PrePrompt)
    private readonly prePromptRepository: Repository<PrePrompt>,
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

    const { prompt, apiKey, modelId } = session;

    const modelInfo = await this.modelRepository.findOne({
      where: { modelId: modelId },
    });

    if (!modelInfo) {
      throw new ModelNotFoundException();
    }

    if (!prompt) {
      throw new UnexpectedPromptException();
    }

    const { modelName, endpoint, scriptFileName } = modelInfo;

    const text = await this.taskService.doTextTask({
      prompt,
      apiKey,
      modelName,
      endpoint,
      scriptFileName,
    });

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
    const list = await this.modelRepository.find();
    return list;
  }

  async findModelById(modelId: number) {
    const model = await this.modelRepository.findOne({ where: { modelId } });
    return model;
  }

  // 查找提示词预设方案列表
  async getPrePromptList() {
    const list = await this.prePromptRepository.find();
    return list;
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
