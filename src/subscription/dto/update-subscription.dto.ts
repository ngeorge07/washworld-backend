import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import { CreateSubscriptionDto } from './create-subscription.dto';

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
  constructor(isActive?: boolean, expiresAt?: Date) {
    super();
    this.isActive = isActive;
    this.expiresAt = expiresAt;
  }

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsDate()
  expiresAt: Date;
}
