import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'rxjs';
import { Car } from 'src/car/entities/car.entity';
import { User } from 'src/user/entities/user.entity';
import { Package } from './entities/package.entity';
import { PackagesController } from './package.controller';
import { PackageService } from './package.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Car, User, Package])],
  controllers: [PackagesController],
  providers: [PackageService],
})
export class PackageModule {}
