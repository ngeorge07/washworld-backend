import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { Role } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';
import { PasswordValidator } from './validators/PasswordValidator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  constructor(
    fullName?: string,
    email?: string,
    password?: string,
    role?: Role,
  ) {
    super();
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Invalid email format. Please provide a valid email address.',
    },
  )
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  @Validate(PasswordValidator, {
    message:
      'Password must be at least 6 characters long and contain at least one uppercase letter and one number.',
  })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
