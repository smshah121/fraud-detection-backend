export class FraudInputDto {
  amount!: number;
  time!: number;
  isForeign!: boolean;
  isOnline!: boolean;
  merchantRisk!: number;
}