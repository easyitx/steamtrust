import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

// Статусы платежа
export enum CryptopayPayPayStatus {
  'success' = 'success',
  'pending' = 'pending',
  'failed' = 'failed',
}

// Ответ в webhook
export class CryptopayPayWebhookDto {
  @IsNotEmpty({ message: 'Order ID is required' })
  @IsString({ message: 'Order ID must be a string' })
  @Transform(({ value }) => value?.toString().trim())
  orderId: string;
}

// Ответ в get transaction
export interface CryptopayPayGetTransactionDto {
  id: 0;
  orderId: string;
  clientId: string;
  description: string;
  amountChanged: true;
  cex: true;
  allowChangeAmount: true;
  amountBeforeChange: string;
  payLink: string;
  address: string;
  type: 'deposit';
  status: CryptopayPayPayStatus;
  createdAt: string;
  amount: string;
  commission: string;
  network: string;
  token: string;
}

// Параметры для создания платежа
export interface CreateCryptopayPayDto {
  orderId: string;
  clientId: string;
  description: string;
  allowChangeAmount: true;
  amount: string;
  type: 'deposit';
  token: string;
  walletId: 0;
  network: string;
  address: string;
  webhookUrl: string;
  tag: string;
  failUrl: string;
  successUrl: string;
}

// Ответ при создании платежа
export interface CreateCryptopayPayResponse {
  id: 0;
  orderId: string;
  clientId: string;
  description: string;
  amountChanged: true;
  cex: true;
  allowChangeAmount: true;
  amountBeforeChange: string;
  payLink: string;
  address: string;
  type: 'deposit';
  status: CryptopayPayPayStatus;
  createdAt: string;
  amount: string;
  commission: string;
  network: string;
  token: string;
}

export interface CurrencyRates {
  [currency: string]: {
    btc: string;
    usdt: string;
    trx: string;
    eth: string;
    ton: string;
  };
}
