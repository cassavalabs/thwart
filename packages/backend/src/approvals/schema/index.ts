import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApprovalKind } from 'src/types';

@Schema({
  collection: 'approvals',
  autoIndex: true,
  toJSON: { virtuals: true },
})
export class Approval {
  @Prop({ type: String, required: true, enum: ApprovalKind })
  approvalKind: ApprovalKind;

  @Prop({ type: String, required: true, index: true, lowercase: true })
  contractAddress: string;

  @Prop({ type: String, required: true, index: true, lowercase: true })
  owner: string;

  @Prop({ type: String, required: true, index: true, lowercase: true })
  spender: string;

  @Prop({ type: Boolean, required: false, default: null })
  approved?: boolean;

  @Prop({ type: [String], required: false, default: null })
  methods?: string[];

  @Prop({ type: String, required: false, default: null })
  value?: string;

  @Prop({ type: [String], required: false, default: null })
  values?: string[];

  @Prop({ type: String, required: true })
  transactionHash: string;

  @Prop({ type: Number, required: true })
  blockNumber: number;

  @Prop({ type: String, required: true })
  blockHash: string;

  @Prop({ type: Number, required: false, default: null })
  dateApproved?: number;

  @Prop({ type: Boolean, required: false, default: false })
  isUpdated: boolean;
}

export const ApprovalSchema = SchemaFactory.createForClass(Approval);
export type ApprovalDocument = Approval & Document;

ApprovalSchema.virtual('contract', {
  ref: 'Account',
  localField: 'contractAddress',
  foreignField: 'account',
  justOne: true,
});

ApprovalSchema.virtual('operator', {
  ref: 'Account',
  localField: 'spender',
  foreignField: 'account',
  justOne: true,
});
