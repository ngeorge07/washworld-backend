import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarService } from 'src/car/car.service';
import { Car } from 'src/car/entities/car.entity';
import { Package } from 'src/package/entities/package.entity';
import { PackageService } from 'src/package/package.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Car, User, Package])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, UserService, CarService, PackageService],
})
export class SubscriptionModule {}
