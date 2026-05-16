import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('fraud_logs')
export class FraudEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  transactionId!: string;

  @Column('float', { nullable: true })
  amount!: number;

  @Column('jsonb')
  features!: number[];

 @Column({ nullable: false })
result!: string;

@Column({ type: 'float', nullable: false })
confidence!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
