import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromocodeController } from './promocode.controller';
import { PromocodeService } from './promocode.service';
import { PromoCode, PromoCodeSchema } from './promocode.schema';
import { PromoActivation, PromoActivationSchema } from './promo-activation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromoCode.name, schema: PromoCodeSchema },
      { name: PromoActivation.name, schema: PromoActivationSchema },
    ]),
  ],
  controllers: [PromocodeController],
  providers: [PromocodeService],
  exports: [PromocodeService],
})
export class PromocodeModule {}
