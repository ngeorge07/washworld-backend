import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (user) {
      throw new ConflictException('Email already registered');
    }

    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneUser(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async updateUser(
    id: number,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (user.email === updateUserDto.email) {
      throw new ConflictException('Email already registered');
    }

    const updatedUser = this.userRepository.create({
      ...user,
      ...updateUserDto,
    });
    return await this.userRepository.save(updatedUser);
  }

  async removeUser(id: number): Promise<DeleteResult> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.userRepository.delete(id);
  }
}
