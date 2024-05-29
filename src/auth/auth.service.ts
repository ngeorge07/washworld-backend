import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(signupDTO: CreateUserDto): Promise<User> {
    return this.userService.createUser(signupDTO);
  }

  async signIn({
    email,
    password,
  }: LoginDto): Promise<{ access_token: string }> {
    const foundUser = await this.userService.findOneByEmail(email);
    if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: foundUser.id,
      fullName: foundUser.fullName,
      roles: foundUser.roles,
      washCoins: foundUser.washCoins,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
