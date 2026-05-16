import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FraudEntity } from './fraud/entities/fraud.entity';
import { FraudModule } from './fraud/fraud.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'SmShah@12345',
      database: 'fraud_db',
      entities: [FraudEntity],
      synchronize: true,
    }),
    FraudModule
  ],
})
export class AppModule {}