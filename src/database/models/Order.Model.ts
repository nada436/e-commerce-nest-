import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';
import { User } from './user.model';
import { OrderStatusTypes, PaymentMethodTypes } from 'src/common/types/types';
import { cart } from './Cart.Model';
import { coupon } from './Copoun.Model';
import { Product } from './productModel';

@Schema()
export class Order {
  @Prop({ type: Types.ObjectId, ref: User.name,required: true})
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: Number, required: true })
  phone: Number;

  @Prop({ type: Number, required: true })
  total_price: Number;

  @Prop({ type: Types.ObjectId, ref: cart.name,required: true})
  cartId: Types.ObjectId;

  @Prop({ type: String, enum: PaymentMethodTypes, required: true })
  paymentMethod: string;
  @Prop({ type: String, })
    
  @Prop({ type: String, enum: OrderStatusTypes, required: true })
  status: string;

  @Prop({ type: Date, default: () => Date.now() + 3 * 24 * 60 * 60 * 1000 })
  arrivesAt: Date;

  @Prop({
    type: {
      paidAt: Date,
      deliveredAt: Date,
      deliveredBy: { type: Types.ObjectId, ref: User.name },
      cancelledAt: Date,
      cancelledBy: { type: Types.ObjectId, ref: User.name },
      refundedAt: Date,
      refundedBy: { type: Types.ObjectId, ref: User.name }
    }
  })
  orderChanges: Object;
  @Prop({type: Types.ObjectId, ref: coupon.name })
  copoun_id:string
  ;@Prop({type:String})
  payment_intent:string
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export const OrderModel = MongooseModule.forFeature([
  { name: Order.name, schema: OrderSchema }
]);

export type OrderDocument = HydratedDocument<Order>;
