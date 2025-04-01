import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDetailsDocument = UserDetails & Document;

@Schema()
export class UserDetails {
  @Prop()
  address?: string;

  @Prop()
  phone?: string;

  @Prop()
  dob?: string;
}

export const UserDetailsSchema = SchemaFactory.createForClass(UserDetails);
