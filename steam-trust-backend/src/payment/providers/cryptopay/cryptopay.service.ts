import { Injectable, Logger } from '@nestjs/common';
import { PayDocument, PayStatus } from '../../pay.schema';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@app/common';
import {
  CreateCryptopayPayDto,
  CreateCryptopayPayResponse,
  CryptopayPayGetTransactionDto,
  CryptopayPayPayStatus,
  CryptopayPayWebhookDto,
  CurrencyRates,
} from './cryptopay.dto';
import { PayMethod } from '../../methods/pay-method.schema';

@Injectable()
export class CryptopayService {
  private readonly logger = new Logger(CryptopayService.name);

  private readonly baseUrl: string;
  private readonly CRYPTOPAY_API_KEY: string;
  private readonly CRYPTOPAY_WEBHOOK_URL: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>(
      'CRYPTOPAY_PAY_BASE_URL',
      'https://lk.cryptopayo.net',
    );
    this.CRYPTOPAY_API_KEY =
      this.configService.get<string>('CRYPTOPAY_API_KEY');
    this.CRYPTOPAY_WEBHOOK_URL = this.configService.get<string>(
      'CRYPTOPAY_WEBHOOK_URL',
      'https://api.steamtrust.ru/api/cryptopay/pay',
    );
  }

  async createPayReq(
    pay: PayDocument,
    method?: PayMethod,
  ): Promise<{ paymentLink: string; providerTransactionId: string }> {
    const rates = await this.getRates();

    const rubAmount = pay.fromAmount; // Количество рублей
    const currencyCode = method.toCurrencyCode;

    if (!rates.rub || !rates.rub[currencyCode]) {
      throw new BadRequestException('Error rates API');
    }

    const rate = parseFloat(rates.rub[currencyCode]);

    const tokenDecimals = {
      btc: 8,
      eth: 8,
      usdt: 4,
      trx: 6,
      ton: 8,
    };

    const requestBody: Partial<CreateCryptopayPayDto> = {
      orderId: pay._id,
      clientId: pay.userId,
      description: this.configService.get<string>(
        'CRYPTOPAY_PAYMENT_DESCRIPTION',
        'Пополнение баланса сайта',
      ),
      allowChangeAmount: true,
      amount: String(
        Number(Number(rubAmount) / rate).toFixed(
          tokenDecimals[method.fromCurrencyCode] || 2,
        ),
      ),
      type: 'deposit',
      token: method.toCurrencyCode,
      network: method.fromCurrencyCode, // Используем fromCurrencyCode как network
      webhookUrl: this.CRYPTOPAY_WEBHOOK_URL,
      successUrl: this.configService.get<string>(
        'CRYPTOPAY_SUCCESS_URL',
        'https://steamtrust.ru/pay/success',
      ),
      failUrl: this.configService.get<string>(
        'CRYPTOPAY_FAIL_URL',
        'https://steamtrust.ru/pay/fail',
      ),
    };

    const response = await this.sendPaymentRequest(requestBody);
    pay.metadata = {
      ...pay.metadata,
      providerCreatePayBody: requestBody,
      providerCreatePayResponse: response,
    };
    return this.handlePaymentResponse(response);
  }

  private async sendPaymentRequest(
    body: Partial<CreateCryptopayPayDto>,
  ): Promise<CreateCryptopayPayResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/transaction/create`, {
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${this.CRYPTOPAY_API_KEY}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        return await response.json();
      }

      throw new BadRequestException('Error during request to payment API');
    } catch (error) {
      this.logger.error(
        `Network or other error: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Network or other error');
    }
  }

  private async handlePaymentResponse(
    response: CreateCryptopayPayResponse,
  ): Promise<{ paymentLink: string; providerTransactionId: string }> {
    return {
      paymentLink: response.payLink,
      providerTransactionId: String(response.id),
    };
  }

  async getTransaction(
    data: CryptopayPayWebhookDto,
  ): Promise<CryptopayPayGetTransactionDto> {
    const response = await fetch(`${this.baseUrl}/api/transaction/get`, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${this.CRYPTOPAY_API_KEY}`,
      },
    });

    if (response.status === 200 || response.status === 201) {
      return await response.json();
    }

    throw new BadRequestException('Error during request to payment API');
  }

  async getRates(): Promise<CurrencyRates> {
    const response = await fetch(`${this.baseUrl}/api/token/rates`, {
      body: JSON.stringify({ currency: 'rub' }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${this.CRYPTOPAY_API_KEY}`,
      },
    });

    if (response.status === 200 || response.status === 201) {
      return await response.json();
    }

    throw new BadRequestException('Error rates API');
  }

  getPayStatus(providerStatus: CryptopayPayPayStatus): PayStatus {
    switch (providerStatus) {
      case CryptopayPayPayStatus.success:
        return PayStatus.success;
      case CryptopayPayPayStatus.pending:
        return PayStatus.pending;
      case CryptopayPayPayStatus.failed:
        return PayStatus.failed;

      default:
        return PayStatus.pending;
    }
  }
}
