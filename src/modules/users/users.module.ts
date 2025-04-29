import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from 'src/repository/user.repository.service';
import { OTPModel, usermodel } from 'src/database/models/index';
import { OTPRepository } from 'src/repository/OTP.repository.service';


@Module({
  providers: [
    UsersService,
    UsersRepository,
    OTPRepository
  ],
  controllers: [UsersController],
  imports: [usermodel, OTPModel],
  exports: [UsersRepository],
})
export class UsersModule {}
