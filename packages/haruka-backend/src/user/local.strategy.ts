import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from './user.service';
import { UserNotFoundException } from 'src/exceptions/exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'userName' });
  }

  async validate(userName: string, password: string) {
    const user = await this.userService.validateUser(userName, password);

    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }
}
