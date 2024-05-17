import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  constructor(fullName: string, email: string, password: string) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
  }

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
