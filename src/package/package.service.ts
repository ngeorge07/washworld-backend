import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Package } from './entities/package.entity';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  async createPackage(createPackageDto: CreatePackageDto): Promise<Package> {
    const newPackage = this.packageRepository.create(createPackageDto);
    return await this.packageRepository.save(newPackage);
  }

  async findAllPackages(): Promise<Package[]> {
    return this.packageRepository.find();
  }

  async findOnePackage(id: number): Promise<Package> {
    const foundPackage = await this.packageRepository.findOne({
      where: { id },
    });
    if (!foundPackage) {
      throw new NotFoundException('Package not found');
    }
    return foundPackage;
  }

  async updatePackage(
    id: number,
    updatePackageDto: UpdatePackageDto,
  ): Promise<Package> {
    const foundPackage = await this.packageRepository.findOneBy({
      id,
    });

    const updatedPackage = this.packageRepository.create({
      ...foundPackage,
      ...updatePackageDto,
    });

    return this.packageRepository.save(updatedPackage);
  }

  async removePackage(id: number): Promise<void> {
    await this.packageRepository.delete(id);
  }
}
