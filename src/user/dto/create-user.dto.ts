import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { PasswordValidator } from './validators/PasswordValidator';
export class CreateUserDto {
  constructor(fullName: string, email: string, password: string) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
  }

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail(
    {},
    {
      message: 'Invalid email format. Please provide a valid email address.',
    },
  )
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Validate(PasswordValidator, {
    message:
      'Password must be at least 6 characters long and contain at least one uppercase letter and one number.',
  })
  password: string;
}
