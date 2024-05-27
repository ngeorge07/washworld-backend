import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard, RequestWithUser } from '../gurads/auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  signup(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginDto) {
    return this.authService.signIn(body);
  }

  @UseGuards(AuthGuard)
  @Get('validate')
  @HttpCode(200)
  validateToken(@Req() request: RequestWithUser) {
    return {
      user: request.user,
    };
  }
}
