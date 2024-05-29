import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class UpdateSubscriptionDto {
  constructor(isActive?: boolean, expiresAt?: Date) {
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
