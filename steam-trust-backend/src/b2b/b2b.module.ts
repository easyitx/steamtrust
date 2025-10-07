import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { B2bService } from './b2b.service';
import { B2bExecuteService } from './b2b-execute.service';
import { B2bController } from './b2b.controller';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [ConfigModule, forwardRef(() => PaymentModule)],
  controllers: [B2bController],
  providers: [B2bService, B2bExecuteService],
  exports: [B2bService, B2bExecuteService],
})
export class B2bModule {}
