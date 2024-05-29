import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCarDto {
  constructor(name: string) {
    this.name = name;
  }

  @IsNotEmpty()
  @IsString()
  name: string;
}
