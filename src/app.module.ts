import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ConfigModule,
    LoggerModule,
    UsersModule,
    OnboardingModule,
  ],
})
export class AppModule {}