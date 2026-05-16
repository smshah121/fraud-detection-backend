import { Module } from '@nestjs/common';
import { FraudService } from './fraud.service';
import { FraudController } from './fraud.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FraudEntity } from './entities/fraud.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FraudEntity])],
  controllers: [FraudController],
  providers: [FraudService],
})
export class FraudModule {}
