import { Injectable } from '@nestjs/common';
import { Notification } from './notification.controller';

@Injectable()
export class NotificationService {
  constructor() {}

  async sendNotification(notification: Notification) {
    console.log('send', notification);
  }
}
