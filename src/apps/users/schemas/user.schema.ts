import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  userCode: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true})
  email: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Role', default: null})
  role: Types.ObjectId;

  @Prop({ default: false })
  deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
