import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Encrypt } from 'src/common/security/encrypt';
import { hash } from 'src/common/security/hash';
import { UserRoles } from 'src/common/types/types';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 10,
  })
  name: string;

  @Prop({ type: String, required: true, trim: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, trim: true })
  password: string;

  @Prop({ type: Date, required: true })
  DOB: Date;

  @Prop({ type: Boolean, default: false, required: true })
  confirmed?: boolean;

  @Prop({ type: Boolean })
  isDeleted?: boolean;

  @Prop({ type: String, enum: UserRoles, default: UserRoles.user })
  role: string;

  @Prop({ type: String, required: true, minLength: 11, maxLength: 11 })
  phone: string;

  @Prop({ type: String, required: true })
  address: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password);
  }
  
  next();
});
UserSchema.pre('save', async function (next) {
  if (this.isModified('phone')) {
    this.phone = await Encrypt(this.phone);
  }
  next();
});

export const usermodel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);
