import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from '../entities/user.entity';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

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
  @IsEmail()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
