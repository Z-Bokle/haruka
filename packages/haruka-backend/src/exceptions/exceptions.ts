import { HttpException, HttpStatus } from '@nestjs/common';

export class RegisterFailException extends HttpException {
  constructor() {
    super('注册失败，用户名已存在', HttpStatus.OK);
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super('未找到用户', HttpStatus.OK);
  }
}

// export class LoginException extends HttpException {
//   constructor() {
//     super('登录失败', HttpStatus.OK);
//   }
// }

export class WrongPasswordException extends HttpException {
  constructor() {
    super('密码错误', HttpStatus.OK);
  }
}
