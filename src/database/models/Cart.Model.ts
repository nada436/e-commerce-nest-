import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';
import { Product } from './productModel';

export type cartDocument = HydratedDocument<cart>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class cart {
  @Prop([{
    type: {
      productId: { type: Types.ObjectId, ref: Product.name },
      quantity: { type: Number, required: true },
      total_price: { type: Number, required: true },
    }
  }])
  products: {
    productId: Types.ObjectId;
    quantity: number;
    total_price: number;
  }[];
  

  @Prop({ type: Types.ObjectId, ref: User.name,required: true})
  userId: Types.ObjectId;

 
  @Prop({ type: Number })
  subtotal:Number
}


export const cartSchema = SchemaFactory.createForClass(cart);
cartSchema.pre("save", function (next) {
  this.subtotal = this.products.reduce((acc, prod) => acc + prod.total_price, 0);
  next();
});
export const cartModel = MongooseModule.forFeature([
  { name: cart.name, schema: cartSchema },
]);
