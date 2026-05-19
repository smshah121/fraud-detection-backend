/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FraudEntity } from './entities/fraud.entity';
import { MLResponse } from './interfaces/ml-response.interface';
import { FraudInputDto } from './dto/create-fraud.dto';


@Injectable()
export class FraudService {
  private readonly ML_API_URL = 'http://127.0.0.1:8000/predict';

  constructor(
    @InjectRepository(FraudEntity)
    private fraudRepository: Repository<FraudEntity>,
  ) {}


  private buildFeatures(data: FraudInputDto): number[] {
  const features = Array(30).fill(0);


  features[0] = data.time / 24;
  features[1] = data.amount / 10000;

  features[2] = data.isForeign ? 1 : 0;
  features[3] = data.isOnline ? 1 : 0;

  features[4] = data.merchantRisk;

  return features;
}


  async detectFraud(data: FraudInputDto) {
    try {
  
      const features = this.buildFeatures(data);

   
      const response = await axios.post<MLResponse>(
        this.ML_API_URL,
        { features },
      );

      const ml = response.data;

      if (!ml || typeof ml.result === 'undefined') {
        throw new Error('Invalid ML response from Python API');
      }

      const saved = await this.fraudRepository.save({
        amount: data.amount,
        name: data.name,
  cnic: data.cnic,
        features,
        result: ml.result ?? 'UNKNOWN',
        confidence: ml.confidence ?? 0,
      });


      return {
        success: true,
        id: saved.id,
         name: saved.name,
         amount: saved.amount,
  cnic: saved.cnic,
        result: ml.result,
        fraud: ml.fraud,
        confidence: ml.confidence,
      };
    } catch (error: unknown) {
      let message = 'Unknown error occurred';

      if (error instanceof Error) {
        message = error.message;
      }

      return {
        success: false,
        message,
      };
    }
  }


  findAll() {
    return this.fraudRepository.find({
      order: { createdAt: 'DESC' },

    });
  }


  async getStats() {
  const total = await this.fraudRepository.count();

  const fraud = await this.fraudRepository.count({
    where: { result: 'FRAUD' },
  });

  const safe = await this.fraudRepository.count({
    where: { result: 'SAFE' },
  });

  return {
    total,
    fraud,
    safe,
  };
}
}