import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';
import { Category } from './CategoryModel';
import { ImageDetails } from 'src/common/types/types';

export type SubCategoryDocument = HydratedDocument<SubCategory>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class SubCategory {
  @Prop({ type: String, required: true, trim: true, minLength: 2 })
  name: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name, { lower: true, trim: true, replacement: '-' });
    },
  })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category: Types.ObjectId;

  @Prop({ type: Object })
  image: ImageDetails;
  @Prop({ type:Number})
  subcategory_no:Number
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
SubCategorySchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, trim: true, replacement: '-' });
  }
  next();
});
export const SubCategoryModel = MongooseModule.forFeature([
  { name: SubCategory.name, schema: SubCategorySchema },
]);
