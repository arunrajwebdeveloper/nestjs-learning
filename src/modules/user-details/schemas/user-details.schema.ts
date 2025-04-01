import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDetailsDocument = UserDetails & Document;

@Schema({ timestamps: true })
export class UserDetails {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  dob: string;
}

export const UserDetailsSchema = SchemaFactory.createForClass(UserDetails);
