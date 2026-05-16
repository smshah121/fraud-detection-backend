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

  /**
   * Convert human input → ML 30-feature vector
   */
  private buildFeatures(data: FraudInputDto): number[] {
  const features = Array(30).fill(0);

  // normalized values
  features[0] = data.time / 24;
  features[1] = data.amount / 10000;

  features[2] = data.isForeign ? 1 : 0;
  features[3] = data.isOnline ? 1 : 0;

  features[4] = data.merchantRisk;

  return features;
}

  /**
   * Main fraud detection function
   */
  async detectFraud(data: FraudInputDto) {
    try {
      // 1. Convert input → ML features
      const features = this.buildFeatures(data);

      // 2. Call Python ML API
      const response = await axios.post<MLResponse>(
        this.ML_API_URL,
        { features },
      );

      const ml = response.data;

      // 3. Validate ML response
      if (!ml || typeof ml.result === 'undefined') {
        throw new Error('Invalid ML response from Python API');
      }

      // 4. Save to database
      const saved = await this.fraudRepository.save({
        features,
        result: ml.result ?? 'UNKNOWN',
        confidence: ml.confidence ?? 0,
      });

      // 5. Return final response to frontend
      return {
        success: true,
        id: saved.id,
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

  /**
   * Get all fraud logs
   */
  findAll() {
    return this.fraudRepository.find();
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