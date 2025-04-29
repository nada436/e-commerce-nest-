import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseRepository } from './database.repository.service';
import { User, UserDocument } from 'src/database/models/user.model';
import { coupon, couponDocument } from 'src/database/models/Copoun.Model';

@Injectable()
export class copounRepository extends DatabaseRepository<couponDocument> {
  constructor(
    @InjectModel(coupon.name) private readonly couponModel: Model<couponDocument>,
  ) {
    super(couponModel);
  }
}
