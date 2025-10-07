import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentProvider } from '../pay.schema';

export type PayMethodDocument = PayMethod & Document;

@Schema({ timestamps: true })
export class PayMethod {
  @Prop({ required: true })
  providerMethod: string;

  @Prop({ enum: PaymentProvider, required: true })
  provider: PaymentProvider;

  @Prop({ required: true })
  fromCurrencyCode: string;

  @Prop({ required: true })
  toCurrencyCode: string;

  @Prop({ required: true })
  min: number;

  @Prop({ required: true })
  max: number;

  @Prop({ required: true })
  relativeCommission: number;

  @Prop({ required: true })
  relativeProviderCommission: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: false, default: '' })
  image: string;
}

export const PayMethodSchema = SchemaFactory.createForClass(PayMethod);
