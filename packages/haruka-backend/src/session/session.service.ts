import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/entities/session.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async findAll() {
    return [];
  }

  /** 校验SessionUUID是否合法，如果UUID存在但不属于当前用户也归结为非法 */
  async isSessionValid(sessionUUID: string, userId: number) {
    const session = await this.sessionRepository.findOne({
      where: {
        userId,
        sessionUUID,
      },
    });

    return !!session;
  }
}
