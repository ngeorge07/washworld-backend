import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Benefit } from 'src/enums/benefit.enum';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  washCoinsAwarded: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(Benefit, { each: true })
  @ArrayMinSize(1)
  benefits: Benefit[];
}
