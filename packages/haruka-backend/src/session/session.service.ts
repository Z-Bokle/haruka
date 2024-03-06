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

  async findAll(configs: Partial<Session>) {
    const sessions = await this.sessionRepository.find({
      where: configs,
    });
    return sessions;
  }

  async getSessionList(userId: number) {
    const list = await this.findAll({ userId, isAvailable: 1 });
    return list;
  }

  async findOne(sessionUUID: string, userId: number) {
    const session = await this.sessionRepository.findOne({
      where: {
        userId,
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
      lastModified: new Date().getTime(),
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

  async updateSession(
    userId: number,
    uuid: string,
    configs: Partial<
      Omit<Session, 'userId' | 'uuid' | 'lastModified' | 'isAvailable' | 'step'>
    >,
  ) {
    const result = await this.sessionRepository.update(
      {
        userId,
        sessionUUID: uuid,
        isAvailable: 1,
      },
      {
        ...configs,
        lastModified: new Date().getTime(),
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

    const result = await this.sessionRepository.increment(
      { sessionUUID: uuid },
      'step',
      stepOffset,
    );
    return (result.affected ?? 0) > 0;
  }
}
