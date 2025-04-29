import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Category {
  @Prop({ type: String, required: true, trim: true, minLength: 2 })
  name: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name, { lower: true, trim: true, replacement: '-' });
    },
  })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: User.name})
  userId: Types.ObjectId;

  @Prop({ type: Object })
  image: object;
  @Prop({ type: Number })
  category_no:Number
}


export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, trim: true, replacement: '-' });
  }
  next();
});
export const CategoryModel = MongooseModule.forFeature([
  { name: Category.name, schema: CategorySchema },
]);
