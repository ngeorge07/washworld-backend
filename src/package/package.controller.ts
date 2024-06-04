import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/gurads/auth.guard';
import { RolesGuard } from 'src/gurads/roles.guard';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PackageService } from './package.service';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packageService: PackageService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.createPackage(createPackageDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.packageService.findAllPackages();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    this.validatePackageId(id);
    return this.packageService.findOnePackage(+id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.updatePackage(+id, updatePackageDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
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
