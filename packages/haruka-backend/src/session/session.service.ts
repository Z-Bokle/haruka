import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/entities/session.entity';
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

  /** 校验SessionUUID是否合法，如果UUID存在但不属于当前用户也归结为非法 */
  // async isSessionValid(sessionUUID: string, userId: number) {
  //   const session = await this.sessionRepository.findOne({
  //     where: {
  //       userId,
  //       sessionUUID,
  //     },
  //   });

  //   return !!session;
  // }

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
    });
    return await this.sessionRepository.save(session);
  }
}
