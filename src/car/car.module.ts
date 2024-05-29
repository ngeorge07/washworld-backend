import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { Car } from './entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, Subscription, User])],
  controllers: [CarController],
  providers: [CarService, UserService],
  exports: [CarService],
})
export class CarModule {}
