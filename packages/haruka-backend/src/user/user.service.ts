import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  RegisterFailException,
  UserNotFoundException,
  WrongPasswordException,
} from 'src/exceptions/exceptions';

export interface JwtPayload {
  userName: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // compare password
  async isMatchPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  // hash password
  async generateHash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  // register
  async register(userName: string, password: string) {
    const user = await this.findOne(userName);
    if (user) {
      throw new RegisterFailException();
    }
    const newUser = this.userRepository.create({ password, userName });
    const result = await this.userRepository.insert(newUser);
    return result;
  }

  /**
   * 仅获取jwt token，查表验证由LocalAuthGuard负责
   */
  async login(userName: string) {
    const payload: JwtPayload = {
      userName: userName,
    };

    const token = this.jwtService.sign(payload);
    return token;
  }

  async validateUser(userName: string, password: string) {
    const user = await this.findOne(userName);
    if (!user) {
      throw new UserNotFoundException();
    }

    // 密码匹配
    const isMatch = await this.isMatchPassword(password, user.password);

    if (isMatch) {
      const result = {
        userName: user.userName,
        userId: user.userId,
      };
      return result;
    } else {
      throw new WrongPasswordException();
    }
  }

  // find user
  async findOne(userName: string) {
    const result = await this.userRepository.findOne({
      where: {
        userName,
      },
    });
    return result;
  }
}
