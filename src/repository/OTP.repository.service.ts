import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { DatabaseRepository } from './database.repository.service';
import { User, UserDocument } from 'src/database/models/user.model';
import { OTP, OTPDocument } from 'src/database/models';
import { OTPTypes } from 'src/common/types/types';

@Injectable()
export class OTPRepository extends DatabaseRepository<OTPDocument> {
  constructor(
    @InjectModel(OTP.name) private readonly OTPModel: Model<OTPDocument>,
  ) {
    super(OTPModel);
  }
  async create(data: Partial<OTPDocument>): Promise<OTPDocument> {
    const otp = await this.OTPModel.create({
      expirein: new Date(new Date().getTime() + 10 * 60000), // 10 minutes in milliseconds,
      otp_type: OTPTypes.confirmation,
      ...data,
    });
    return otp;
  }
}
