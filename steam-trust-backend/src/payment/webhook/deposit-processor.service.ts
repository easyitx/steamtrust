import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { mongooseTransaction } from '@app/common';
import { PayStatus } from '../pay.schema';
import { PaymentService } from '../payment.service';
import { PromocodeService } from '../../promocode/promocode.service';
import { TelegramService } from '../../telegram/telegram.service';
import { DepositProcessingData } from './webhook.types';
import Decimal from 'decimal.js';

/**
 * Сервис для обработки депозитов
 */
@Injectable()
export class DepositProcessorService {
  private readonly logger = new Logger(DepositProcessorService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly paymentService: PaymentService,
    private readonly promocodeService: PromocodeService,
    private readonly telegramService: TelegramService,
  ) {}

  /**
   * Обрабатывает депозит на основе данных вебхука
   */
  async processDeposit(
    paymentId: string,
    depositData: DepositProcessingData,
    status: PayStatus,
  ): Promise<boolean> {
    try {
      return await mongooseTransaction(this.connection, async (session) => {
        // Получаем платеж
        const payment = await this.paymentService.getPendingPayOrFail(
          paymentId,
          session,
        );

        // Обновляем статус
        payment.status = status;

        // Обрабатываем бонусы от промокодов
        await this.processPromocodeBonus(payment, depositData, session);

        // Обрабатываем успешный платеж
        if (status === PayStatus.success) {
          await this.processSuccessfulPayment(payment, depositData);
        }

        // Сохраняем изменения
        await payment.save({ session });

        this.logger.log(
          `Deposit processed successfully - Payment: ${paymentId}, Status: ${status}, Amount: ${depositData.amount}`,
        );

        return true;
      });
    } catch (error) {
      this.logger.error(
        `Failed to process deposit - Payment: ${paymentId}`,
        error.stack || error.message || error,
      );
      throw error;
    }
  }

  /**
   * Обрабатывает бонусы от промокодов
   */
  private async processPromocodeBonus(
    payment: any,
    depositData: DepositProcessingData,
    session: any,
  ): Promise<void> {
    const userEmail = payment.userId;
    if (!userEmail) {
      return;
    }

    try {
      const promoActive =
        await this.promocodeService.getActiveUserActivation(userEmail);
      if (!promoActive) {
        return;
      }

      // Рассчитываем бонус
      const bonus = new Decimal(depositData.amount)
        .mul(promoActive.bonusPercent)
        .div(100);

      payment.bonus = new Decimal(bonus.toFixed(2));

      // Отмечаем промокод как использованный
      await this.promocodeService.bonusPaidPromo(userEmail);

      this.logger.log(
        `Promocode bonus applied - Payment: ${payment._id}, Bonus: ${payment.bonus}`,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to process promocode bonus - Payment: ${payment._id}, Error: ${error.message}`,
      );
      // Не прерываем обработку платежа из-за ошибки с промокодом
    }
  }

  /**
   * Обрабатывает успешный платеж
   */
  private async processSuccessfulPayment(
    payment: any,
    depositData: DepositProcessingData,
  ): Promise<void> {
    // Устанавливаем суммы
    payment.paidAmount = new Decimal(depositData.amount);
    payment.finalAmount = new Decimal(depositData.amount)
      .minus(payment.commission || 0)
      .plus(payment.bonus || 0);
    payment.currency = depositData.currency;

    // Отправляем уведомление в Telegram
    try {
      await this.telegramService.sendWebhookNotification({
        provider: 'unknown',
        paymentId: payment._id.toString(),
        status: payment.status,
        amount: payment.paidAmount.toString(),
        timestamp: new Date(),
      });
    } catch (error) {
      this.logger.warn(
        `Failed to send Telegram notification - Payment: ${payment._id}, Error: ${error.message}`,
      );
      // Не прерываем обработку платежа из-за ошибки с уведомлением
    }
  }
}
