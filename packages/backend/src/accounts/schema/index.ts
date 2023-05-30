import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Account {
  @Prop({ type: String, required: true, unique: true, index: true })
  account: string;

  @Prop({ type: Boolean, required: true })
  isContract: boolean;

  @Prop({ type: String, required: false, default: null })
  name?: string;

  @Prop({ type: String, required: false, default: null })
  symbol?: string;

  @Prop({ type: Number, required: false, default: null })
  decimals?: number;

  @Prop({ type: String, required: false, default: null })
  logo?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
export type AccountDocument = Account & Document;
