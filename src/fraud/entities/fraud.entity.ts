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

   @Column()
  name!: string;


  @Column({ type: 'varchar', length: 20 })
  cnic!: string;

  @Column({ nullable: true })
  transactionId!: string;

  @Column()
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
