import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { User } from 'src/entities/user.entity';
import { jwtConstants } from 'src/user/constants';
import { JwtPayload } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class JwtDecodeMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token === undefined || token === null || token.length === 0) {
      next();
      return;
    }

    const payload = this.jwtService.verify<JwtPayload>(token, {
      secret: jwtConstants.secret,
    });
    const user = await this.userRepository.findOne({
      where: {
        userName: payload.userName,
      },
    });
    if (!user) {
      next();
    } else {
      req.headers['User-ID'] = user.userId.toString();
      req.headers['User-Name'] = user.userName;
      next();
    }
  }
}
