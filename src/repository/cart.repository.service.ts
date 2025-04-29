import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseRepository } from './database.repository.service';
import { User, UserDocument } from 'src/database/models/user.model';
import { cart, cartDocument } from 'src/database/models/Cart.Model';

@Injectable()
export class cartRepository extends DatabaseRepository<cartDocument> {
  constructor(
    @InjectModel(cart.name) private readonly cartModel: Model<cartDocument>,
  ) {
    super(cartModel);
  }
}
