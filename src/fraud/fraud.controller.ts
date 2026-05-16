import { Controller, Post, Body, Get } from '@nestjs/common';
import { FraudService } from './fraud.service';
import { FraudInputDto } from './dto/create-fraud.dto';



@Controller('fraud')
export class FraudController {
  constructor(private readonly fraudService: FraudService) {}

  @Post('check')
  detectFraud(@Body() body: FraudInputDto) {
    return this.fraudService.detectFraud(body);
  }
  @Get()
findAll() {
  return this.fraudService.findAll();
}

@Get('stats')
async getStats() {
  return this.fraudService.getStats();
}
}
