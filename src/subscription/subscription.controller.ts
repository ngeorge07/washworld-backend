import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/gurads/auth.guard';
import { RolesGuard } from 'src/gurads/roles.guard';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(createSubscriptionDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.subscriptionService.findAllSubscriptions();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionService.findOneSubscription(+id);
  }

  @UseGuards(AuthGuard)
  @Get('/users/:userId')
  findSubscriptionsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.subscriptionService.findAllSubscriptionsByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Get('/cars/:carId')
  findSubscriptionByCarId(@Param('carId', ParseIntPipe) carId: number) {
    return this.subscriptionService.findSubscriptionByCarId(carId);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    this.validateId(id);
    return this.subscriptionService.updateSubscription(
      +id,
      updateSubscriptionDto,
    );
  }

  validateId(id: string) {
    if (isNaN(+id)) {
      throw new BadRequestException('Id is not a number');
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.removeSubscription(+id);
  }
}
