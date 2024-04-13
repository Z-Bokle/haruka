import { Injectable } from '@nestjs/common';
import { Notification, notificationEmitter } from './notification.controller';

@Injectable()
export class NotificationService {
  constructor() {}

  async sendNotification(notification: Notification) {
    notificationEmitter.emit('notification', notification);
  }
}
