import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Metadata {
  @Prop({ type: String, required: true })
  blockchain: string;

  @Prop({ type: Number, required: true, default: 0 })
  blockHeight: number;
}

export const MetadataShema = SchemaFactory.createForClass(Metadata);
export type MetadataDocument = Metadata & Document;
