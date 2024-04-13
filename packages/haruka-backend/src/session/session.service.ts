import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/entities/session.entity';
import {
  SessionNotFoundException,
  UnexpectedSessionStatusException,
} from 'src/exceptions/exceptions';

import { UserService } from 'src/user/user.service';
import { getUUID } from 'src/utils/uuid';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async getSessionList(userId: number) {
    const list = await this.findAll({ userId, isAvailable: 1 });
    return list;
  }

  async sessionGoBack(userId: number, uuid: string) {
    const { result, currentStep } = await this.updateSessionStep(
      userId,
      uuid,
      -1,
    );

    if (currentStep === 2) {
      // 清除视频资源
      await this.updateSession(userId, uuid, {
        videoUUID: null,
        videoFilePath: null,
        baseVideoFilePath: null,
        baseVideoUUID: null,
      });
    } else if (currentStep === 1) {
      // 清除音频资源
      await this.updateSession(userId, uuid, {
        audioUUID: null,
        audioFilePath: null,
      });
    } else if (currentStep === 0) {
      // 清除文本资源，实际上客户端逻辑中，step为0或1时均禁用该操作，因此常规情况不会触发
      await this.updateSession(userId, uuid, {
        text: null,
        prompt: null,
        apiKey: null,
        modelId: null,
      });
    }

    return result;
  }

  async findOne(sessionUUID: string, userId: number) {
    if (!sessionUUID) {
      throw new SessionNotFoundException();
    }
    const session = await this.sessionRepository.findOne({
      where: {
        userId,
        sessionUUID,
        isAvailable: 1,
      },
    });

    return session;
  }

  async findAll(configs: Partial<Session>) {
    const sessions = await this.sessionRepository.find({
      where: configs,
    });
    return sessions.sort((s1, s2) => s2.lastModified - s1.lastModified);
  }

  async findOneWithoutUserId(sessionUUID: string) {
    if (!sessionUUID) {
      throw new SessionNotFoundException();
    }
    const session = await this.sessionRepository.findOne({
      where: {
        sessionUUID,
        isAvailable: 1,
      },
    });

    return session;
  }

  async createSession(userId: number) {
    const session = this.sessionRepository.create({
      sessionUUID: getUUID(),
      userId,
      isAvailable: 1,
      step: 0,
      lastModified: Date.now(),
    });
    return await this.sessionRepository.save(session);
  }

  async removeSession(userId: number, uuid: string) {
    const result = await this.sessionRepository.update(
      {
        userId,
        sessionUUID: uuid,
        isAvailable: 1,
      },
      {
        isAvailable: 0,
      },
    );
    return (result.affected ?? 0) > 0;
  }

  async updateSession(userId: number, uuid: string, configs: any) {
    const result = await this.sessionRepository.update(
      {
        userId,
        sessionUUID: uuid,
        isAvailable: 1,
      },
      {
        ...configs,
        lastModified: Date.now(),
      },
    );
    return (result.affected ?? 0) > 0;
  }

  async updateSessionStep(userId: number, uuid: string, stepOffset: 1 | -1) {
    const session = await this.findOne(uuid, userId);
    if (!session) {
      throw new SessionNotFoundException();
    }

    if (session.step + stepOffset < 0 || session.step + stepOffset > 3) {
      throw new UnexpectedSessionStatusException();
    }

    const nextStep = (session.step + stepOffset) as 0 | 1 | 2 | 3;

    const result = await this.sessionRepository.update(
      { sessionUUID: uuid },
      {
        step: nextStep,
        lastModified: Date.now(),
      },
    );
    return {
      result: (result.affected ?? 0) > 0,
      currentStep: nextStep,
    };
  }
}
