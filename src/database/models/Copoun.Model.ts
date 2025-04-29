import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';

export type couponDocument = HydratedDocument<coupon>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class coupon {
  @Prop({ type: String, required: true, trim: true, length: 4 })
  code: String;

  @Prop({ type: Types.ObjectId, ref: User.name,required: true})
  userId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: User.name })
   used_by: Types.ObjectId[];

  @Prop({ type: Date,required: true })
  from_date: Date;

  @Prop({ type: Date ,required: true})
  to_date: Date;

  @Prop({ type: Number , required: true })
  amount:Number
}


export const couponSchema = SchemaFactory.createForClass(coupon);

export const couponModel = MongooseModule.forFeature([
  { name: coupon.name, schema: couponSchema },
]);
