import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('onboarding_config')
export class OnboardingConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  page2: string[];

  @Column('jsonb')
  page3: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}