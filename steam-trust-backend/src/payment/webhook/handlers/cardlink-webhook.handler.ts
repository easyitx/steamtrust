import { Injectable } from '@nestjs/common';
import { PayStatus } from '../../pay.schema';
import { BaseWebhookHandler } from '../base-webhook-handler';
import {
  WebhookProcessingResult,
  WebhookValidationResult,
  DepositProcessingData,
} from '../webhook.types';
import { CardlinkPayWebhookDto } from '../../providers/cardlink/cardlink.dto';
import { CardlinkService } from '../../providers/cardlink/cardlink.service';
import { CustomException } from '@app/common';
import Decimal from 'decimal.js';

@Injectable()
export class CardlinkWebhookHandler extends BaseWebhookHandler {
  constructor(private readonly cardlinkService: CardlinkService) {
    super();
  }

  /**
   * Обрабатывает вебхук от Cardlink
   */
  async processWebhook(
    data: CardlinkPayWebhookDto,
  ): Promise<WebhookProcessingResult> {
    try {
      const paymentId = data.InvId;

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
      const status = this.getPaymentStatus(data);

      // Логируем информацию
      this.logWebhookInfo(
        'cardlink',
        paymentId,
        status,
        depositData.amount.toString(),
      );

      return this.createSuccessResult(
        paymentId,
        status,
        'Cardlink webhook processed successfully',
        depositData,
      );
    } catch (error) {
      const paymentId = data?.InvId || 'unknown';
      this.logWebhookError('cardlink', paymentId, error);
      return this.createErrorResult(
        paymentId,
        error.message || 'Processing failed',
      );
    }
  }

  /**
   * Валидирует вебхук Cardlink
   */
  async validateWebhook(
    data: CardlinkPayWebhookDto,
  ): Promise<WebhookValidationResult> {
    try {
      // Проверяем обязательные поля
      if (
        !data.InvId ||
        !data.OutSum ||
        !data.CurrencyIn ||
        !data.Status ||
        !data.SignatureValue
      ) {
        return {
          isValid: false,
          error:
            'Missing required fields: InvId, OutSum, CurrencyIn, Status, or SignatureValue',
        };
      }

      // Проверяем подпись через существующий сервис
      const isSignatureValid = this.cardlinkService.verifySignature(data);
      if (!isSignatureValid) {
        throw CustomException.webhookSignatureInvalid('cardlink');
      }

      // Проверяем валюту
      if (data.CurrencyIn !== 'RUB') {
        return {
          isValid: false,
          error: `Unsupported currency: ${data.CurrencyIn}. Only RUB is supported.`,
        };
      }

      return {
        isValid: true,
        data: data,
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
    data: CardlinkPayWebhookDto,
  ): Promise<DepositProcessingData> {
    return {
      amount: new Decimal(data.OutSum),
      currency: 'RUB',
      paymentId: data.InvId,
    };
  }

  /**
   * Определяет статус платежа
   */
  getPaymentStatus(data: CardlinkPayWebhookDto): PayStatus {
    // Используем существующий метод из CardlinkService
    return this.cardlinkService.getPayStatus(data.Status);
  }
}
