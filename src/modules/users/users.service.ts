import {
  Injectable,
  UnauthorizedException,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { UsersRepository } from 'src/repository/user.repository.service';
import { send_email } from 'src/common/services/send_email';
import { AuthService } from 'src/common/security/jwt_service';
import { compare } from 'src/common/security/hash';
import { OTPRepository } from 'src/repository/OTP.repository.service';
import { OTPTypes } from 'src/common/types/types';

@Injectable()
export class UsersService {
  constructor(
    private readonly UsersRepository: UsersRepository,
    private readonly AuthService: AuthService,
    private readonly OTPRepository: OTPRepository,
  ) {}

  async signup(data) {
    
    const user = await this.UsersRepository.findOne({email: data.email });
    
    if(user){ throw new BadRequestException('email already exist')}
    const createduser = await this.UsersRepository.create(data);
    const otp_code = Math.floor(1000 + Math.random() * 9000).toString();
    await send_email({
      to: data.email,
      subject: 'confirm mail',
      html: `<h1> ${otp_code}<h1>`,
    });
    const new_otp = await this.OTPRepository.create({
      userId: createduser._id,
      code: otp_code,
    });
 
    return createduser;
  }

  async confirm_email(body: { email: string; code: string }) {
    const { email, code } = body;
    const user = await this.UsersRepository.findOne({
      email,
      confirmed: false,
    });
    if (!user) {
      throw new UnauthorizedException(
        'Email does not exist or is already confirmed.',
      );
    }
    const otp = await this.OTPRepository.findOne({
      userId: user._id,
      otp_type: OTPTypes.confirmation,
    });
    if (!otp) {
      throw new BadRequestException('Invalid code.');
    }

    if (otp.expirein < new Date()) {
      throw new BadRequestException(' expired code.');
    }
    const isCodeValid = await compare(code, otp.code);
    if (!isCodeValid) {
      throw new BadRequestException(' wronge code.');
    }

    // Confirm the user's email
    await this.UsersRepository.update({ _id: user._id }, { confirmed: true });

    // Delete OTP after successful confirmation
    await this.OTPRepository.delete({ _id: otp._id });

    return { message: 'Email confirmed successfully.' };
  }

  async login(data) {
    const is_exist = await this.UsersRepository.findOne({ email: data.email });
    if (!is_exist) {
      throw new UnauthorizedException(' email not exist');
    } else {
      const match = await compare(data.password, is_exist.password);
      if (!match) {
        throw new UnauthorizedException('wronge password,try again');
      }
      return this.AuthService.generateToken(
        { _id: is_exist._id, email: data.email },
        { secret: process.env.secret_key },
      );
    }
  }

  async get_profile(req) {
    return req.user;
  }
}
