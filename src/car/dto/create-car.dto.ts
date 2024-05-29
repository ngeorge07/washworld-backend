import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CreateCarDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z]{2}\d{5}$/, {
    message:
      'Car Registration Number must be 2 capital letters followed by 5 numbers',
  })
  registrationNumber: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
