import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarService } from 'src/car/car.service';
import { Car } from 'src/car/entities/car.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Car, User])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, UserService, CarService],
})
export class SubscriptionModule {}
