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
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(createSubscriptionDto);
  }

  @Get()
  findAll() {
    return this.subscriptionService.findAllSubscriptions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionService.findOneSubscription(+id);
  }

  @Get('/users/:userId')
  findSubscriptionsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.subscriptionService.findAllSubscriptionsByUserId(userId);
  }

  @Get('/cars/:carId')
  findSubscriptionByCarId(@Param('carId', ParseIntPipe) carId: number) {
    return this.subscriptionService.findSubscriptionByCarId(carId);
  }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.removeSubscription(+id);
  }
}
