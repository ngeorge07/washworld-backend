import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarService } from 'src/car/car.service';
import { PackageService } from 'src/package/package.service';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly packageService: PackageService,
    private readonly carService: CarService,
  ) {}

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const foundPackage = await this.packageService.findOnePackage(
      createSubscriptionDto.packageId,
    );

    if (!foundPackage) {
      throw new NotFoundException('Package not found');
    }

    const car = await this.carService.findOneCar(createSubscriptionDto.carId);
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    const newSubscription = this.subscriptionRepository.create({
      ...createSubscriptionDto,
      package: foundPackage,
      car,
    });
    return await this.subscriptionRepository.save(newSubscription);
  }

  findAllSubscriptions() {
    return this.subscriptionRepository.find({ relations: ['package'] });
  }

  async findOneSubscription(id: number) {
    const foundSubscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['package'],
    });
    if (!foundSubscription) {
      throw new NotFoundException('Subscription not found');
    }
    return foundSubscription;
  }

  async findAllSubscriptionsByUserId(userId: number) {
    const foundSubscriptions = await this.subscriptionRepository.find({
      where: { car: { user: { id: userId } } },
      relations: ['package', 'car', 'car.user'],
    });
    return foundSubscriptions;
  }

  async findSubscriptionByCarId(carId: number) {
    const foundSubscription = await this.subscriptionRepository.findOne({
      where: { car: { id: carId } },
      relations: ['package', 'car', 'car.user'],
    });
    return foundSubscription;
  }

  async updateSubscription(
    id: number,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    const foundSubscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['package', 'car'],
    });
    if (!foundSubscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (updateSubscriptionDto.packageId) {
      const foundPackage = await this.packageService.findOnePackage(
        updateSubscriptionDto.packageId,
      );
      if (!foundPackage) {
        throw new NotFoundException('Package not found');
      }
      foundSubscription.package = foundPackage;
    }

    if (updateSubscriptionDto.isActive !== undefined) {
      foundSubscription.isActive = updateSubscriptionDto.isActive;
    }

    if (updateSubscriptionDto.expiresAt) {
      foundSubscription.expiresAt = updateSubscriptionDto.expiresAt;
    }
    return this.subscriptionRepository.save(foundSubscription);
  }

  async removeSubscription(id: number) {
    const foundSubscription = await this.subscriptionRepository.findOneBy({
      id,
    });
    if (!foundSubscription) {
      throw new NotFoundException('Subscription not found');
    }
    return this.subscriptionRepository.delete(id);
  }
}
