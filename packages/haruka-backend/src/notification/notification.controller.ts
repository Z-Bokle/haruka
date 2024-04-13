import { Controller } from '@nestjs/common';

export interface Notification {
  message: string;
  title: string;
}

@Controller()
export class NotificationController {}
