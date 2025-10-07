import { Injectable, Logger } from '@nestjs/common';
import { WebhookHandlerFactory } from './webhook-handler-factory';
import { DepositProcessorService } from './deposit-processor.service';
import { WebhookProcessingResult, PaymentProvider } from './webhook.types';

/**
 * Основной сервис для обработки вебхуков
 */
@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly webhookHandlerFactory: WebhookHandlerFactory,
    private readonly depositProcessor: DepositProcessorService,
  ) {}

  /**
   * Обрабатывает вебхук от указанного провайдера
   */
  async processWebhook(
    provider: PaymentProvider,
    data: any,
  ): Promise<WebhookProcessingResult> {
    try {
      if (!this.webhookHandlerFactory.isProviderSupported(provider)) {
        return {
          success: false,
          paymentId: 'unknown',
          status: 'failed' as any,
          message: 'Error provider validation',
          error: `Unsupported provider: ${provider}`,
        };
      }

      const handler = this.webhookHandlerFactory.createHandler(provider);
      const result = await handler.processWebhook(data);

      if (result.success && result.status) {
        const paymentId = this.extractPaymentId(provider, data);

        await this.depositProcessor.processDeposit(
          paymentId,
          result.depositData,
          result.status,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(`Failed to process ${provider} webhook:`);
      return {
        success: false,
        paymentId: 'unknown',
        status: 'failed' as any,
        message: 'Error processing webhook',
        error: error.message || 'Processing failed',
      };
    }
  }

  /**
   * Извлекает ID платежа из данных вебхука
   */
  private extractPaymentId(provider: PaymentProvider, data: any): string {
    switch (provider) {
      case 'cryptopay':
        return data.orderId;
      case 'cardlink':
        return data.InvId;
      default:
        return 'unknown';
    }
  }

  /**
   * Получает список поддерживаемых провайдеров
   */
  getSupportedProviders(): PaymentProvider[] {
    return this.webhookHandlerFactory.getSupportedProviders();
  }

  /**
   * Проверяет, поддерживается ли провайдер
   */
  isProviderSupported(provider: string): boolean {
    return this.webhookHandlerFactory.isProviderSupported(provider);
  }
}
