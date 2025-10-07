import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { WebhookService } from './webhook';
import { PaymentWebhookController } from './webhook';
import { Pay, PaySchema } from './pay.schema';
import { PayMethod, PayMethodSchema } from './methods';
import { TelegramModule } from '../telegram';
import { B2bModule } from '../b2b';
import { PromocodeModule } from '../promocode/promocode.module';

// Провайдеры платежей
import { CryptopayService } from './providers/cryptopay/cryptopay.service';
import { CardlinkService } from './providers/cardlink/cardlink.service';
import { B2bService } from '../b2b';

// Новые сервисы для вебхуков
import { WebhookHandlerFactory } from './webhook';
import { DepositProcessorService } from './webhook';
import { CryptopayWebhookHandler } from './webhook';
import { CardlinkWebhookHandler } from './webhook';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Pay.name, schema: PaySchema },
      { name: PayMethod.name, schema: PayMethodSchema },
    ]),
    TelegramModule,
    forwardRef(() => B2bModule),
    PromocodeModule,
  ],
  controllers: [PaymentController, PaymentWebhookController],
  providers: [
    PaymentService,
    WebhookService,
    // Провайдеры платежей
    CryptopayService,
    CardlinkService,
    // B2B сервис для курсов валют
    B2bService,
    // Новые сервисы для вебхуков
    WebhookHandlerFactory,
    DepositProcessorService,
    CryptopayWebhookHandler,
    CardlinkWebhookHandler,
  ],
  exports: [PaymentService, WebhookService],
})
export class PaymentModule {}
