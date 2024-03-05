import { BaseVO } from 'src/base.vo';
import { Session } from 'src/entities/session.entity';

export class SessionListVO extends BaseVO {
  data: Session[];
}
