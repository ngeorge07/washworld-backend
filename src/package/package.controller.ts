import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PackageService } from './package.service';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.createPackage(createPackageDto);
  }

  @Get()
  findAll() {
    return this.packageService.findAllPackages();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.validatePackageId(id);
    return this.packageService.findOnePackage(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.updatePackage(+id, updatePackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageService.removePackage(+id);
  }

  validatePackageId(id: string) {
    if (isNaN(+id)) {
      throw new BadRequestException('Package id is not a number');
    }
  }
}
