import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { UserDetails } from '../../user-details/schemas/user-details.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true }) // ✅ Ensures `_id` is auto-generated
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, default: null })
  refreshToken: string | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'UserDetails' }) // ✅ Link to UserDetails
  userDetails: Types.ObjectId | UserDetails;
}

export const UserSchema = SchemaFactory.createForClass(User);
