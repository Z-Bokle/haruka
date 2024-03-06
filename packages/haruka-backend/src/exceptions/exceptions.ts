import { HttpException, HttpStatus } from '@nestjs/common';

/** 基础业务异常，http code均为200，用error code区分业务异常类型 */
export class BaseHttpException extends HttpException {
  errorCode: string | number;
  constructor(message: string) {
    super(message, HttpStatus.OK);
  }
}

export class RegisterFailException extends BaseHttpException {
  constructor() {
    super('注册失败，用户名已存在');
    this.errorCode = 601;
  }
}

export class UserNotFoundException extends BaseHttpException {
  constructor() {
    super('未找到用户或未登录');
    this.errorCode = 602;
  }
}

export class WrongPasswordException extends BaseHttpException {
  constructor() {
    super('密码错误');
    this.errorCode = 603;
  }
}

export class SessionNotFoundException extends BaseHttpException {
  constructor() {
    super('未找到会话');
    this.errorCode = 604;
  }
}

export class UnexpectedSessionStatusException extends BaseHttpException {
  constructor() {
    super('会话状态异常');
    this.errorCode = 605;
  }
}

export class FileOversizeException extends BaseHttpException {
  constructor(errorMessage?: string) {
    super(errorMessage ?? '文件大小超过限制');
    this.errorCode = 606;
  }
}

export class UnexpectedPromptException extends BaseHttpException {
  constructor() {
    super('提示词异常');
    this.errorCode = 607;
  }
}

export class AssetsLostException extends BaseHttpException {
  constructor() {
    super('本次操作缺少必须的输入资源，请检查');
    this.errorCode = 608;
  }
}

export class ModelNotFoundException extends BaseHttpException {
  constructor() {
    super('模型不存在');
    this.errorCode = 609;
  }
}

export class ScriptRuntimeException extends BaseHttpException {
  constructor(message?: string) {
    super(`脚本运行异常\n${message ?? '请检查脚本是否正确'}`);
    this.errorCode = 610;
  }
}
