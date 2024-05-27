import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from '../data.source';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dbConfig),
    UserModule,
    AuthModule,
    SubscriptionModule,
  ],
  controllers: [],
})
export class AppModule {}
