import { config } from 'dotenv';
config();
import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { MessageTemplates } from './templates/message.templates';
import {
  TelegramMessage,
  PaymentNotification,
  SystemAlert,
  WebhookNotification,
} from './telegram.interface';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly bot: TelegramBot;
  private readonly chatId: string = process.env.TELEGRAM_CHAT_ID;
  private readonly botToken: string = process.env.TELEGRAM_BOT_TOKEN;
  private readonly retryAttempts: number = 3;
  private readonly retryDelay: number = 1000;

  constructor() {
    if (!this.botToken) {
      return;
    }

    // Инициализация Telegram бота
    const botToken = this.botToken;
    if (botToken) {
      try {
        this.bot = new TelegramBot(botToken);
      } catch (error) {
        this.logger.error('Failed to initialize Telegram bot', error);
      }
    } else {
      this.logger.warn('TELEGRAM_BOT_TOKEN not provided, bot will not work');
    }
  }

  // Основные методы отправки сообщений
  private async sendMessage(message: TelegramMessage): Promise<boolean> {
    if (!this.bot || !message.chatId) {
      return false;
    }

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        await this.bot.sendMessage(message.chatId, message.text, {
          parse_mode: message.parseMode || 'HTML',
          disable_web_page_preview: message.disableWebPagePreview || true,
        });

        return true;
      } catch (error) {
        this.logger.error(`Attempt ${attempt} failed to send message`, error);

        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay);
        }
      }
    }

    this.logger.error(
      `Failed to send message after ${this.retryAttempts} attempts`,
    );
    return false;
  }

  // Уведомления о платежах
  async sendPaymentNotification(data: PaymentNotification): Promise<void> {
    const message = MessageTemplates.paymentNotification(data);
    await this.sendMessage({
      chatId: this.chatId,
      text: message,
      parseMode: 'HTML',
    });
  }

  // Системные алерты
  async sendSystemAlert(data: SystemAlert): Promise<void> {
    const message = MessageTemplates.systemAlert(data);
    const chatId = this.chatId;

    await this.sendMessage({
      chatId,
      text: message,
      parseMode: 'HTML',
    });
  }

  // Webhook уведомления
  async sendWebhookNotification(data: WebhookNotification): Promise<void> {
    const message = MessageTemplates.webhookNotification(data);
    await this.sendMessage({
      chatId: this.chatId,
      text: message,
      parseMode: 'HTML',
    });
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
