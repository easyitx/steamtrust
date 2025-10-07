import { Injectable } from '@nestjs/common';
import { PayStatus } from '../../pay.schema';
import { BaseWebhookHandler } from '../base-webhook-handler';
import {
  WebhookProcessingResult,
  WebhookValidationResult,
  DepositProcessingData,
} from '../webhook.types';
import {
  CryptopayPayPayStatus,
  CryptopayPayWebhookDto,
} from '../../providers/cryptopay/cryptopay.dto';
import { CryptopayService } from '../../providers/cryptopay/cryptopay.service';
import { B2bService } from '../../../b2b/b2b.service';
import Decimal from 'decimal.js';
import { BadRequestException } from '@app/common';

@Injectable()
export class CryptopayWebhookHandler extends BaseWebhookHandler {
  constructor(
    private readonly cryptopayService: CryptopayService,
    private readonly b2bService: B2bService,
  ) {
    super();
  }

  /**
   * Обрабатывает вебхук от Cryptopay
   */
  async processWebhook(
    data: CryptopayPayWebhookDto,
  ): Promise<WebhookProcessingResult> {
    try {
      const paymentId = data.orderId;

      // Валидируем вебхук
      const validation = await this.validateWebhook(data);
      if (!validation.isValid) {
        return this.createErrorResult(
          paymentId,
          validation.error || 'Validation failed',
        );
      }

      // Извлекаем данные для обработки
      const depositData = await this.extractDepositData(data);
      const status = this.getPaymentStatus(
        depositData.status as CryptopayPayPayStatus,
      );

      // Логируем информацию
      this.logWebhookInfo(
        'cryptopay',
        paymentId,
        status,
        depositData.amount.toString(),
      );

      return this.createSuccessResult(
        paymentId,
        status,
        'Cryptopay webhook processed successfully',
        depositData,
      );
    } catch (error) {
      const paymentId = data?.orderId || 'unknown';
      this.logWebhookError('cryptopay', paymentId, error);
      return this.createErrorResult(
        paymentId,
        error.message || 'Processing failed',
      );
    }
  }

  /**
   * Валидирует вебхук Cryptopay
   */
  async validateWebhook(
    data: CryptopayPayWebhookDto,
  ): Promise<WebhookValidationResult> {
    try {
      if (!data.orderId) {
        return {
          isValid: false,
          error: 'Missing required field: orderId',
        };
      }

      // Получаем детали транзакции для дополнительной валидации
      const transaction = await this.cryptopayService.getTransaction(data);
      if (!transaction) {
        return {
          isValid: false,
          error: 'Transaction not found',
        };
      }

      return {
        isValid: true,
        data: transaction,
      };
    } catch (error) {
      return {
        isValid: false,
        error: `Validation error: ${error.message}`,
      };
    }
  }

  /**
   * Извлекает данные для обработки депозита
   */
  async extractDepositData(
    data: CryptopayPayWebhookDto,
  ): Promise<DepositProcessingData> {
    // Получаем детали транзакции через существующий сервис
    const transaction = await this.cryptopayService.getTransaction(data);
    const amountToken = transaction.amount;

    const rates = await this.cryptopayService.getRates();
    const rate = rates.rub[transaction.token];

    if (!rates.rub || !rate) {
      throw new BadRequestException('Unknown rate');
    }

    // Конвертируем токены в рубли
    const rubAmount = parseFloat(amountToken) * parseFloat(rate); // переводим в рубли

    return {
      amount: new Decimal(rubAmount.toFixed(2)), // Сколько было пополнено
      currency: 'RUB',
      paymentId: data.orderId,
      status: transaction.status,
    };
  }

  /**
   * Определяет статус платежа
   */
  getPaymentStatus(status: CryptopayPayPayStatus): PayStatus {
    return this.cryptopayService.getPayStatus(status);
  }
}
