import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { longId, stringType } from '@app/common';

export type PromocodeDocument = HydratedDocument<PromoCode>;

@Schema({ timestamps: true, id: false, toObject: { virtuals: true } })
export class PromoCode {
  @Prop(longId)
  _id: string;

  @Prop(stringType({ required: true, unique: true }))
  code: string;

  @Prop({ type: Number, default: 2 })
  bonusPercent: number;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);
