import { IsBoolean, IsNumber, IsString } from "class-validator";

export class FraudInputDto {
  @IsString()
  name!: string;

  @IsString()
  cnic!: string;

  @IsNumber()
  amount!: number;

  @IsNumber()
  time!: number;

  @IsBoolean()
  isForeign!: boolean;

  @IsBoolean()
  isOnline!: boolean;

  @IsNumber()
  merchantRisk!: number;
}