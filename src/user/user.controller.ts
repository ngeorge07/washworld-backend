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
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/gurads/auth.guard';
import { RolesGuard } from 'src/gurads/roles.guard';
import { UpdateUserGuard } from 'src/gurads/update.guard';
import { Roles } from '../decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.userService.findAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    this.checkId(id);
    return this.userService.findOneUser(+id);
  }

  @UseGuards(AuthGuard, UpdateUserGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.checkId(id);
    return this.userService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    this.checkId(id);
    return this.userService.removeUser(+id);
  }

  checkId(id: string) {
    if (isNaN(+id)) {
      throw new BadRequestException('User id is not a number');
    }
  }
}
