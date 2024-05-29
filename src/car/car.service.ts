import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car) private readonly carRepository: Repository<Car>,
    private readonly userService: UserService,
  ) {}

  async createCar(createCarDto: CreateCarDto): Promise<Car> {
    const foundUser: User = await this.userService.findOneUser(
      createCarDto.userId,
    );
    if (!foundUser) {
      throw new BadRequestException('User not found');
    }

    const newCar = this.carRepository.create({
      ...createCarDto,
      user: foundUser,
    });

    try {
      return await this.carRepository.save(newCar);
    } catch (error) {
      if (error.code === '23505') {
        // 23505 is the code for unique_violation in PostgreSQL
        throw new ConflictException('Registration number already exists');
      }
      throw error;
    }
  }

  findAllCars(): Promise<Car[]> {
    return this.carRepository.find();
  }

  async findOneCar(id: number): Promise<Car> {
    const car = await this.carRepository.findOneBy({ id });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  async findAllByUserId(userId: number): Promise<Car[]> {
    return await this.carRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'subscription'],
    });
  }

  async update(id: number, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.findOneCar(id);

    const updatedCar = this.carRepository.create({
      ...car,
      ...updateCarDto,
    });

    return await this.carRepository.save(updatedCar);
  }

  async removeUser(id: number): Promise<DeleteResult> {
    const foundCar = await this.carRepository.findOneBy({ id });
    if (!foundCar) {
      throw new NotFoundException('Car not found');
    }
    return this.carRepository.delete(id);
  }
}
