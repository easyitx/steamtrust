import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookProcessingResult } from './webhook.types';

/**
 * Контроллер для обработки вебхуков от платежных провайдеров
 */
@Controller()
export class PaymentWebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  /**
   * Универсальный обработчик вебхуков
   */
  @Post(':provider/pay')
  @HttpCode(HttpStatus.OK)
  async processWebhook(
    @Param('provider') pathProvider: string,
    @Headers('x-webhook-provider') headerProvider: string,
    @Body() data: any,
  ): Promise<WebhookProcessingResult> {
    // Используем provider из пути, если он есть, иначе из заголовка
    const provider = pathProvider || headerProvider;
    if (!provider) {
      return {
        success: false,
        paymentId: 'unknown',
        status: 'failed' as any,
        error: 'Missing provider header',
      };
    }

    return this.webhookService.processWebhook(provider as any, data);
  }
}
