import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

import { CustomException } from '@app/common';
import { PayDocument, PayStatus } from '../../pay.schema';
import { PayMethod } from '../../methods';
import {
  CardlinkPayStatus,
  CardlinkPayWebhookDto,
  CreateCardlinkPayDto,
  CreateCardlinkPayResponse,
} from './cardlink.dto';

@Injectable()
export class CardlinkService {
  private readonly baseUrl: string;
  private readonly shopId: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.getConfigValue(
      'CARDLINK_BASE_URL',
      'https://cardlink.link/api/v1',
    );
    this.shopId = this.getRequiredConfigValue('CARDLINK_SHOP_ID');
    this.apiKey = this.getRequiredConfigValue('CARDLINK_API_TOKEN');
  }

  // Создание платежа на оплату
  async createPayReq(
    pay: PayDocument,
    method?: PayMethod,
  ): Promise<{ paymentLink: string; providerTransactionId: string }> {
    const requestBody = this.buildPaymentRequestBody(pay, method);
    const response = await this.sendPaymentRequest(requestBody);

    this.updatePayMetadata(pay, response);

    return this.handlePaymentResponse(response);
  }

  private buildPaymentRequestBody(
    pay: PayDocument,
    method?: PayMethod,
  ): CreateCardlinkPayDto {
    return {
      amount: String(pay.fromAmount),
      shop_id: this.shopId,
      order_id: pay._id,
      currency_in: 'RUB',
      payer_pays_commission: 0,
      payer_email: pay.userId || '',
      payment_method: method?.providerMethod as 'BANK_CARD' | 'SBP',
    };
  }

  private async sendPaymentRequest(
    body: CreateCardlinkPayDto,
  ): Promise<CreateCardlinkPayResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/bill/create`, body, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (this.isSuccessfulResponse(response.data)) {
        return response.data;
      }

      throw CustomException.paymentRequestError(
        response.data?.message || 'Payment request failed',
      );
    } catch (error) {
      throw CustomException.paymentRequestError(
        error.response?.data?.message || 'Payment request failed',
      );
    }
  }

  private isSuccessfulResponse(response: any): boolean {
    return response.success === true || Boolean(response.success) === true;
  }

  private updatePayMetadata(
    pay: PayDocument,
    response: CreateCardlinkPayResponse,
  ): void {
    pay.metadata = {
      ...pay.metadata,
      providerCreatePayResponse: response,
    };
  }

  private handlePaymentResponse(response: CreateCardlinkPayResponse): {
    paymentLink: string;
    providerTransactionId: string;
  } {
    return {
      paymentLink: response.link_page_url,
      providerTransactionId: response.bill_id,
    };
  }

  getPayStatus(providerStatus: CardlinkPayStatus): PayStatus {
    const statusMap: Record<CardlinkPayStatus, PayStatus> = {
      [CardlinkPayStatus.SUCCESS]: PayStatus.success,
      [CardlinkPayStatus.FAIL]: PayStatus.failed,
      [CardlinkPayStatus.UNDERPAID]: PayStatus.failed,
      [CardlinkPayStatus.OVERPAID]: PayStatus.failed,
    };

    return statusMap[providerStatus] || PayStatus.pending;
  }

  public verifySignature(data: CardlinkPayWebhookDto): boolean {
    const { OutSum, InvId, SignatureValue } = data;

    const signatureString = this.buildSignatureString(OutSum, InvId);
    const generatedSignature = this.generateSignature(signatureString);

    return generatedSignature === SignatureValue;
  }

  private buildSignatureString(outSum: string, invId: string): string {
    return `${outSum}:${invId}:${this.apiKey}`;
  }

  private generateSignature(signatureString: string): string {
    return crypto
      .createHash('md5')
      .update(signatureString)
      .digest('hex')
      .toUpperCase();
  }

  private getConfigValue<T>(key: string, defaultValue: T): T {
    return this.configService.get<T>(key, defaultValue);
  }

  private getRequiredConfigValue(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Missing required configuration: ${key}`);
    }
    return value;
  }
}
