import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseRepository } from './database.repository.service';
import { User, UserDocument } from 'src/database/models/user.model';
import { Order, OrderDocument } from 'src/database/models/Order.Model';

@Injectable()
export class orderRepository extends DatabaseRepository<OrderDocument> {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {
    super(orderModel);
  }
}
