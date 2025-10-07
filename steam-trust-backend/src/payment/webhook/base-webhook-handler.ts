import { Logger } from '@nestjs/common';
import { PayStatus } from '../pay.schema';
import {
  WebhookProcessingResult,
  WebhookValidationResult,
  DepositProcessingData,
} from './webhook.types';

/**
 * Абстрактный базовый класс для обработки вебхуков
 */
export abstract class BaseWebhookHandler {
  protected readonly logger = new Logger(this.constructor.name);

  /**
   * Обрабатывает входящий вебхук
   */
  abstract processWebhook(data: any): Promise<WebhookProcessingResult>;

  /**
   * Валидирует данные вебхука
   */
  abstract validateWebhook(data: any): Promise<WebhookValidationResult>;

  /**
   * Извлекает данные для обработки депозита
   */
  abstract extractDepositData(data: any): Promise<DepositProcessingData>;

  /**
   * Получает статус платежа из данных вебхука
   */
  abstract getPaymentStatus(data: any): PayStatus;

  /**
   * Логирует информацию о вебхуке
   */
  protected logWebhookInfo(
    provider: string,
    paymentId: string,
    status: PayStatus,
    amount?: string,
  ): void {
    this.logger.log(
      `Вебхук получен from ${provider} - Payment: ${paymentId}, Status: ${status}, Amount: ${amount || 'N/A'}`,
    );
  }

  /**
   * Логирует ошибку обработки вебхука
   */
  protected logWebhookError(
    provider: string,
    paymentId: string,
    error: any,
  ): void {
    this.logger.error(
      `Webhook processing error from ${provider} - Payment: ${paymentId}`,
      error.stack || error.message || error,
    );
  }

  /**
   * Создает успешный результат обработки
   */
  protected createSuccessResult(
    paymentId: string,
    status: PayStatus,
    message: string,
    depositData: DepositProcessingData,
  ): WebhookProcessingResult {
    return {
      success: true,
      paymentId,
      status,
      message: message || 'Webhook processed successfully',
      depositData,
    };
  }

  /**
   * Создает результат с ошибкой
   */
  protected createErrorResult(
    paymentId: string,
    error: string,
  ): WebhookProcessingResult {
    return {
      success: false,
      paymentId,
      status: PayStatus.failed,
      message: '',
      error,
    };
  }
}
