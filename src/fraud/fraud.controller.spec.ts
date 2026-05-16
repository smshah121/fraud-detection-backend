import { Test, TestingModule } from '@nestjs/testing';
import { FraudController } from './fraud.controller';
import { FraudService } from './fraud.service';

describe('FraudController', () => {
  let controller: FraudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FraudController],
      providers: [FraudService],
    }).compile();

    controller = module.get<FraudController>(FraudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
