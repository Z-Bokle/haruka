import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { UserDto } from './user.dto';
import { Public } from 'src/decorators/public.decorator';
import { LocalAuthGuard } from 'src/guards/guards';
import { ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { UserNotFoundException } from 'src/exceptions/exceptions';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async register(@Body() body: UserDto, @Res() res: Response) {
    const { userName, password } = body;
    const securePassword = await this.userService.generateHash(password);
    const result = await this.userService.register(userName, securePassword);
    if (result.identifiers.length > 0) {
      res.status(200).json({
        message: '注册成功',
      });
    }
  }

  /**
   * 鉴权查询用户数据和校验已在AuthGuard('local')中实现
   * login方法只需要使用userName生成token即可
   */
  @UseGuards(LocalAuthGuard)
  // 装饰器从下往上依次执行，需要先用Public清除全局JWT的守卫，接入Local守卫
  @Public()
  @Post('login')
  async login(@Body() body: UserDto, @Res() res: Response) {
    const { userName } = body;
    // 生成jwt token
    const token = await this.userService.login(userName);
    res.status(200).json({
      message: '登录成功',
      token,
    });
  }

  @Get('info')
  @ApiHeader({
    name: 'User-ID',
    required: false,
  })
  @ApiHeader({
    name: 'User-Name',
    required: false,
  })
  @Public()
  async getUserInfo(@Headers() headers: Request['headers']) {
    const token = headers['Authorization'] as string;
    if (!token) {
      throw new UserNotFoundException();
    }
    const userIdStr = headers['User-ID'] as string;
    const result = {
      userId: userIdStr ? parseInt(userIdStr) : null,
      userName: headers['User-Name'],
    };
    return result;
  }
}
