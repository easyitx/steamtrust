import { PayStatus } from '../pay.schema';
import Decimal from 'decimal.js';

/**
 * Интерфейс для обработки депозита
 */
export interface DepositProcessingData {
  amount: Decimal;
  currency: string;
  paymentId: string;
  status?: string;
}

/**
 * Интерфейс для результата обработки вебхука
 */
export interface WebhookProcessingResult {
  success: boolean;
  paymentId: string;
  status: PayStatus;
  message?: string;
  depositData?: DepositProcessingData;
  error?: string;
}

/**
 * Интерфейс для валидации вебхука
 */
export interface WebhookValidationResult {
  isValid: boolean;
  error?: string;
  data?: any;
}

/**
 * Типы провайдеров платежей
 */
export type PaymentProvider = 'cryptopay' | 'cardlink';
