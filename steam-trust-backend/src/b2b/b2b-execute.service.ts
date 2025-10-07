import { Injectable, Logger } from '@nestjs/common';
import { mongooseTransaction } from '@app/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { PaymentService } from '../payment/payment.service';
import { PayStatus } from '../payment/pay.schema';
import { B2bService } from './b2b.service';
import { StatusCode } from './b2b.dto';

@Injectable()
export class B2bExecuteService {
  private readonly logger = new Logger(B2bExecuteService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly paymentService: PaymentService,
    private readonly b2bService: B2bService,
  ) {}

  /**
   * Автоматическое выполнение выплат каждые 10 секунд
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async makePayments() {
    try {
      await mongooseTransaction(this.connection, async (session) => {
        const payments = await this.paymentService.getSuccessPayments(session);

        if (payments.length > 0) {
          await Promise.all(
            payments.map((payment) => this.processPayment(payment, session)),
          );
        }
      });
    } catch (error) {
      this.logger.error('Error in automatic payment execution:', error);
    }
  }

  /**
   * Обработка отдельного платежа
   */
  private async processPayment(payment: any, session: any) {
    const { account, b2bTransactionId } = payment;

    if (!b2bTransactionId) {
      return;
    }

    if (!account) {
      return;
    }

    try {
      const executeResponse =
        await this.b2bService.paymentExecute(b2bTransactionId);

      if (!executeResponse.success) {
        payment.status = PayStatus.externalError;
        payment.metadata = {
          ...payment.metadata,
          b2bCronResponse: executeResponse.data,
        };
        await payment.save({ session });
        return;
      }

      const statusCode = executeResponse.data.status_code;
      if (!statusCode) {
        payment.status = PayStatus.externalError;
        await payment.save({ session });
        payment.metadata = {
          ...payment.metadata,
          b2bCronResponse: executeResponse.data,
        };
        return;
      }

      await this.updatePaymentStatus(payment, statusCode);
      payment.metadata = {
        ...payment.metadata,
        b2bCronResponse: executeResponse.data,
      };
      await payment.save({ session });
    } catch (error) {
      this.logger.error(`Payment execution error for ${payment._id}`);
      payment.status = PayStatus.externalError;
      payment.metadata = {
        ...payment.metadata,
        b2bCronError:
          error?.response?.data || error.message || 'Payment execution error',
      };
    } finally {
      await payment.save({ session });
    }
  }

  /**
   * Обновление статуса платежа на основе B2B статуса
   */
  private async updatePaymentStatus(payment: any, statusCode: string) {
    const mappedStatus = this.mapB2bStatusToPayStatus(statusCode);

    if (mappedStatus) {
      payment.status = mappedStatus;
    } else {
      this.logger.warn(
        `Unknown B2B status code: ${statusCode} for payment ${payment._id}`,
      );
      payment.status = PayStatus.externalError;
      payment.metadata = {
        ...payment.metadata,
        updatePaymentStatus: `Unknown B2B status code: ${statusCode} for payment ${payment._id}`,
      };
    }
  }

  /**
   * Маппинг статусов B2B в статусы платежей
   */
  private mapB2bStatusToPayStatus(b2bStatusCode: string): PayStatus | null {
    switch (b2bStatusCode) {
      case StatusCode.DUPLICATE_TRANSACTION:
        return PayStatus.duplicateTransaction;

      case StatusCode.INSUFFICIENT_FUNDS:
        return PayStatus.insufficientFunds;

      case StatusCode.PAYMENT_VERIFICATION_FAILED:
        return PayStatus.paymentVerificationFailed;

      case StatusCode.PAYMENT_CONFIRMATION_FAILED:
        return PayStatus.paymentConfirmationFailed;

      case StatusCode.PURCHASE_NOT_FOUND:
        return PayStatus.purchaseNotFound;

      case StatusCode.CALCULATION_ERROR:
        return PayStatus.calculationError;

      case StatusCode.TOP_UP_ERROR:
        return PayStatus.topUpError;

      case StatusCode.PAYMENT_SUCCESS:
        return PayStatus.completed;

      case StatusCode.PAYMENT_IN_PROGRESS:
      case StatusCode.REQUEST_ACCEPTED:
        return PayStatus.externalProcess;

      default:
        return null;
    }
  }

  /**
   * Проверка статусов платежей каждую минуту
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async makeStatusPayments() {
    try {
      await mongooseTransaction(this.connection, async (session) => {
        const payments =
          await this.paymentService.getExternalProcessPayments(session);

        if (payments.length > 0) {
          await Promise.all(
            payments.map((payment) =>
              this.checkPaymentStatus(payment, session),
            ),
          );
        }
      });
    } catch (error) {
      this.logger.error('Error in status check:', error);
    }
  }

  /**
   * Проверка статуса отдельного платежа
   */
  private async checkPaymentStatus(payment: any, session: any) {
    const { b2bTransactionId } = payment;

    if (!b2bTransactionId) {
      return;
    }

    try {
      const statusResponse =
        await this.b2bService.getPaymentStatus(b2bTransactionId);

      if (statusResponse.data.status_code) {
        await this.updatePaymentStatus(
          payment,
          statusResponse.data.status_code,
        );
        payment.metadata = {
          ...payment.metadata,
          checkPaymentStatusResponse: statusResponse.data,
        };
        await payment.save({ session });
      }
    } catch (error) {
      this.logger.error(
        `Status check failed for payment ${payment._id}:`,
        error,
      );
    }
  }
}
