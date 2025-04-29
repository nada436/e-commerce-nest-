import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './index';
import { OTPTypes } from 'src/common/types/types';
import { hash } from 'src/common/security/hash';

export type OTPDocument = HydratedDocument<OTP>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class OTP {
  @Prop({ type: String, required: true })
  code: string;
  @Prop({ type: Date, required: true })
  expirein: Date;

  @Prop({ type: String, enum: OTPTypes, required: true })
  otp_type: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
OTPSchema.pre('save', async function (next) {
  if (this.isModified('code')) {
    this.code = await hash(this.code);
  }
  next();
});
export const OTPModel = MongooseModule.forFeature([
  { name: OTP.name, schema: OTPSchema },
]);
