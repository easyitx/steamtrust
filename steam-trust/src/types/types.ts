// Типы платежей и методов оплаты
export interface Payment {
    _id: string;
    provider: string;
    providerTransactionId: string;
    userId: string; // Email пользователя
    currency: string; // Валюта платежа (всегда RUB для Steam)
    amount: string; // Сумма, которую пользователь должен оплатить  
    paidAmount: string; // Фактически оплаченная сумма
    finalAmount: string; // Сумма к зачислению
    bonus: string; // Бонус от промокода
    commission: string; // Общая комиссия
    status: string;
    paymentLink: string; // Ссылка для оплаты
    account: string; // Steam аккаунт для пополнения
    meta: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export enum PayMethodType {
    common = 'common',
    card = 'card',
    sbp = 'sbp',
    eWallets = 'eWallets',
    crypto = 'crypto',
}

export interface PaymentMethod {
    _id: string;
    providerMethod: string; // Код метода платежа от провайдера
    provider: string; // Провайдер платежа (cryptopay, cardlink)
    fromCurrencyCode: string;
    toCurrencyCode: string;
    min: number;
    max: number;
    relativeProviderCommission: number;
    relativeCommission: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    image?: string;
}

// Типы для курсов валют
export enum RateSource {
    CB_RF = 'cb_rf',
    STEAM = 'steam',
}

export enum CurrencyPair {
    USD_RUB = 'USD:RUB',
    EUR_RUB = 'EUR:RUB',
}

export interface CurrencyRate {
    source: RateSource;
    pair: CurrencyPair;
    currency_rate: string;
}

export interface CurrencyRatesResponse {
    success: boolean;
    data: CurrencyRate[];
}