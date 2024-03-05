import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: '用户id' })
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @ApiProperty({ example: 'user1', description: '用户名' })
  @Column({ name: 'user_name' })
  userName: string;

  @Exclude()
  @Column({ name: 'user_password' })
  password: string;
}
