import { Field, ID, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Types } from "mongoose";
import { OrderStatusTypes, PaymentMethodTypes } from "src/common/types/types";
import { Order } from "src/database/models/Order.Model";
registerEnumType(PaymentMethodTypes, {
    name: 'PaymentMethodTypes',
  });
  registerEnumType(OrderStatusTypes, {
    name: 'OrderStatusTypes',
  });
@ObjectType()
export class OrdersType  {
  @Field(() => ID,{ nullable: true })
  userId: Types.ObjectId;

  @Field(()=>String,{ nullable: true })
  address: string;

  @Field(() => Int,{ nullable: true })
  phone: number;

  @Field(() => Int,{ nullable: true })
  total_price: number;

  @Field(() => ID,{ nullable: true })
  cartId: Types.ObjectId;

  @Field(() => Date,{ nullable: true })
  arrivesAt: Date;

  @Field(() => ID, { nullable: true })
  copoun_id: string;

  @Field({ nullable: true })
  payment_intent: string;

  @Field(() => PaymentMethodTypes,{ nullable: true })
 paymentMethod: String;

@Field(() => OrderStatusTypes,{ nullable: true })
status:String;
  
}
