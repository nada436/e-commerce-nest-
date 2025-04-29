import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Brand, Category, SubCategory, User } from './index';
import { ImageDetails } from 'src/common/types/types';
import slugify from 'slugify';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Product {
   @Prop({ type: String, required: true, trim: true, minLength: 2 })
    name: string;
  
    @Prop({
      type: String,
      default: function () {
        return slugify(this.name, { lower: true, trim: true, replacement: '-' });
      },
    })
    slug: string;


    @Prop({ type: String, required: true, trim: true, minLength: 10 })
    description: string;
  @Prop({ type: Object, required: true })
  mainImage: ImageDetails;

  @Prop({ type: [Object] })
  subImages: ImageDetails[];

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true, max: 100,default:0 })
  discount: number;

  @Prop({ type: Number, required: true })
  subPrice: number;

 
  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
    category: Types.ObjectId;
  
  @Prop({ type: Types.ObjectId, ref: SubCategory.name, required: true })
    subCategory: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Brand.name, required: true })
    brand: Types.ObjectId;

  @Prop({ type: Number })
  rateNum: number;

  @Prop({ type: Number })
  rateAvg: number;

  
  @Prop({ type: Number })
  product_no: number;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, trim: true, replacement: '-' });
  }
  next();
});

export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
]);