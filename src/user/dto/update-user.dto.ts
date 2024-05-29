import { PartialType } from '@nestjs/mapped-types';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { Role } from 'src/enums/role.enum';
import { CreateUserDto } from './create-user.dto';
import { PasswordValidator } from './validators/PasswordValidator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  constructor(
    fullName?: string,
    email?: string,
    password?: string,
    roles?: Role[],
    washCoins?: number,
  ) {
    super();
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.washCoins = washCoins;
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
  @IsInt()
  washCoins: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(Role, { each: true })
  @ArrayMinSize(1)
  roles: Role[];
}
