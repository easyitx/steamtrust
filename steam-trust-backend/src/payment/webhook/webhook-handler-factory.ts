import { Injectable } from '@nestjs/common';
import { PaymentProvider } from './webhook.types';
import { CryptopayWebhookHandler } from './handlers/cryptopay-webhook.handler';
import { CardlinkWebhookHandler } from './handlers/cardlink-webhook.handler';
import { BaseWebhookHandler } from './base-webhook-handler';

/**
 * Фабрика для создания обработчиков вебхуков
 */
@Injectable()
export class WebhookHandlerFactory {
  constructor(
    private readonly cryptopayHandler: CryptopayWebhookHandler,
    private readonly cardlinkHandler: CardlinkWebhookHandler,
  ) {}

  /**
   * Создает обработчик вебхука для указанного провайдера
   */
  createHandler(provider: PaymentProvider): BaseWebhookHandler {
    switch (provider) {
      case 'cryptopay':
        return this.cryptopayHandler;
      case 'cardlink':
        return this.cardlinkHandler;
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }

  /**
   * Получает список поддерживаемых провайдеров
   */
  getSupportedProviders(): PaymentProvider[] {
    return ['cryptopay', 'cardlink'];
  }

  /**
   * Проверяет, поддерживается ли провайдер
   */
  isProviderSupported(provider: string): provider is PaymentProvider {
    return this.getSupportedProviders().includes(provider as PaymentProvider);
  }
}
