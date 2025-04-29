import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Request,
  RequestTimeoutException,
  SetMetadata,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { AuthGuard } from 'src/common/guards/Authentication';
import { RolesGuard } from 'src/common/guards/Authorization guard';
import { UserRoles } from 'src/common/types/types';
import { Auth } from 'src/common/decorator/auth.decorator';
import {  confirm_email_Dto,
  CreateUserDto,
  login_Dto} from 'src/common/dto/user.dto';

@Controller('user')
export class UsersController {
  constructor(private userservice: UsersService) {}
  @Post('/signup')
  @UsePipes(new ValidationPipe())
  async create(@Body() body: CreateUserDto) {
    return await this.userservice.signup(body);
  }
  @Patch('/confirm_email')
  @UsePipes(new ValidationPipe())
  async confirm_email(@Body() body: confirm_email_Dto) {
    return await this.userservice.confirm_email(body);
  }

  @Get('/login')
  async login(@Body(new ValidationPipe()) body: login_Dto) {
    return await this.userservice.login(body);
  }

  @Get('/profile')
  @Auth([UserRoles.admin])
  async get_profile(@Req() request) {
    return await this.userservice.get_profile(request);
  }
}
