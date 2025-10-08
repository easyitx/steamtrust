// Типы для API транзакций
export interface TransactionQueryParams {
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  from_date?: string;
  to_date?: string;
  search_field?: string;
  search_value?: string;
}

export interface ITransaction {
  id: number;
  code: string;
  code_api: string;
  currency: string;
  date: string;
  issue_date: string | null;
  steam_login: string;
  amount: number;
  amount_usd: number;
  cashback: number | null;
  status_code: string;
  user_login: string | null;
  parent_id: number | null;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    limit: number;
    offset: number;
    items: ITransaction[];
  };
}

// Типы для баланса
export interface BalanceData {
  id: number;
  balance: number;
  cashback: number;
  currency: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
}

// Типы для платежей
export const PayStatus = {
  pending: 'pending',
  success: 'success',
  completed: 'completed',
  failed: 'failed',
  externalProcess: 'externalProcess',
  externalError: 'externalError',
  insufficientFunds: 'insufficientFunds',
  duplicateTransaction: 'duplicateTransaction',
  paymentVerificationFailed: 'paymentVerificationFailed',
  paymentConfirmationFailed: 'paymentConfirmationFailed',
  purchaseNotFound: 'purchaseNotFound',
  calculationError: 'calculationError',
  topUpError: 'topUpError',
} as const;

export type PayStatus = typeof PayStatus[keyof typeof PayStatus];

export const PaymentProvider = {
  cryptopay: 'cryptopay',
  cardlink: 'cardlink',
} as const;

export type PaymentProvider = typeof PaymentProvider[keyof typeof PaymentProvider];

export interface Payment {
  _id: string;
  provider: PaymentProvider;
  providerTransactionId: string;
  userId: string; // Email пользователя
  currency: string; // Валюта платежа (всегда RUB для Steam)
  amount: string; // Сумма, которую пользователь должен оплатить
  paidAmount: string; // Фактически оплаченная сумма
  finalAmount: string; // Сумма к зачислению
  bonus: string; // Бонус
  commission: string; // Общая комиссия
  status: PayStatus;
  paymentLink: string; // Ссылка для оплаты
  account: string; // Steam аккаунт для пополнения
  b2bTransactionId: string; // ID транзакции в B2B
  metadata: {
    ip?: string;
    userAgent?: string;
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentsHistoryParams {
  page?: number;
  limit?: number;
  status?: PayStatus;
  email?: string;
  account?: string;
}

// Типы для промокодов
export interface Promocode {
  _id: string;
  code: string;
  bonusPercent: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreatePromocodeRequest {
  code: string;
  bonusPercent: number;
}

export interface PromocodesListResponse {
  data: Promocode[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PromocodesListParams {
  page?: number;
  limit?: number;
  code?: string;
}

export interface PaymentsListResponse {
  success: boolean;
  data: {
    items: Payment[];
    total: number;
    page: number;
    limit: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}