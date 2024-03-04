import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Model {
  @ApiProperty({ description: '模型名称' })
  @Column({ name: 'model_name' })
  modelName: string;

  @ApiProperty({ description: '模型ID' })
  @PrimaryGeneratedColumn({ name: 'model_id' })
  modelId: number;

  @Column({ name: 'endpoint' })
  @Exclude()
  endpoint: string;
}

@Entity()
export class PrePrompt {
  @ApiProperty({ description: '提示词预设方案ID' })
  @PrimaryGeneratedColumn({ name: 'pre_prompt_id' })
  id: number;

  @ApiProperty({ description: '提示词预设方案名称' })
  @Column({ name: 'pre_prompt_name' })
  name: string;

  @ApiProperty({ description: '提示词预设方案描述' })
  @Column({ name: 'pre_prompt_description' })
  description: string;
}
