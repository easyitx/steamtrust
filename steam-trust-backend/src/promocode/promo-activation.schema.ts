import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PromoActivationStatus {
  active = 'active',
  applied = 'applied',
  expired = 'expired',
}

@Schema({ timestamps: true })
export class PromoActivation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'PromoCode', required: true })
  promocodeId: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop()
  ip?: string;

  @Prop({ type: String, enum: PromoActivationStatus, default: PromoActivationStatus.active })
  status: PromoActivationStatus;

  @Prop()
  activatedAt?: Date;

  @Prop()
  appliedAt?: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const PromoActivationSchema = SchemaFactory.createForClass(PromoActivation);
