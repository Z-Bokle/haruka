import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';

export interface Notification {
  message: string;
  title: string;
}

export const notificationEmitter = new EventEmitter2();

@Controller()
export class NotificationController {
  @Sse('notification')
  notification(): Observable<MessageEvent> {
    return new Observable<any>((observer) => {
      notificationEmitter.on('notification', (notification: Notification) => {
        observer.next({ data: notification });
      });
    });
  }
}
