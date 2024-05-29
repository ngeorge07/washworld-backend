import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubscriptionDto {
  //   @IsNotEmpty()
  //   @IsNumber()
  //   packageId: number;

  @IsNotEmpty()
  @IsNumber()
  carId: number;
}
