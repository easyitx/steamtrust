import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Decimal } from 'decimal.js';
import mongoose, { HydratedDocument } from 'mongoose';
import { decimalType, id } from '@app/common';

export type PayDocument = HydratedDocument<Pay>;

export enum PaymentProvider {
  cryptopay = 'cryptopay',
  cardlink = 'cardlink',
}

export enum PayStatus {
  // Основные статусы жизненного цикла платежа
  pending = 'pending', // Ожидается оплата от клиента
  success = 'success', // Клиент оплатил (успешный платеж)
  completed = 'completed', // Платеж завершен (деньги зачислены на Steam)
  failed = 'failed', // Платеж не удался

  // Статусы для внешних сервисов (B2B)
  externalProcess = 'externalProcess', // Обрабатывается внешним сервисом
  externalError = 'externalError', // Ошибка внешнего сервиса

  // Специфичные статусы B2B
  insufficientFunds = 'insufficientFunds', // Недостаточно средств на балансе
  duplicateTransaction = 'duplicateTransaction', // Дублирующая транзакция
  paymentVerificationFailed = 'paymentVerificationFailed', // Ошибка верификации
  paymentConfirmationFailed = 'paymentConfirmationFailed', // Ошибка подтверждения
  purchaseNotFound = 'purchaseNotFound', // Покупка не найдена
  calculationError = 'calculationError', // Ошибка расчета
  topUpError = 'topUpError', // Ошибка пополнения
}

@Schema({
  timestamps: true,
  collection: 'payments',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Pay {
  @Prop(id)
  _id: string;

  @Prop({
    enum: PaymentProvider,
    required: true,
    index: true,
  })
  provider: PaymentProvider;

  @Prop({
    required: false,
    default: '',
    index: true,
  })
  providerTransactionId: string;

  @Prop({
    required: true,
    index: true,
  })
  userId: string; // Email пользователя

  @Prop({
    required: true,
    default: 'RUB',
  })
  currency: string; // Валюта платежа (всегда RUB для Steam)

  @Prop(
    decimalType({
      required: true,
      min: 0,
    }),
  )
  amount: Decimal; // Сумма, которую пользователь должен оплатить

  @Prop(
    decimalType({
      default: '0',
      min: 0,
    }),
  )
  paidAmount: Decimal; // Фактически оплаченная сумма

  @Prop(
    decimalType({
      default: '0',
      min: 0,
    }),
  )
  finalAmount: Decimal; // Сумма к зачислению (paidAmount - commission + bonus)

  @Prop(
    decimalType({
      default: '0',
      min: 0,
    }),
  )
  bonus: Decimal; // Бонус

  @Prop(
    decimalType({
      default: '0',
      min: 0,
    }),
  )
  commission: Decimal; // Общая комиссия

  @Prop({
    type: String,
    enum: PayStatus,
    default: PayStatus.pending,
    index: true,
  })
  status: PayStatus;

  @Prop({
    type: String,
    default: '',
  })
  paymentLink: string; // Ссылка для оплаты

  @Prop({
    type: String,
    default: '',
    index: true,
  })
  account: string; // Steam аккаунт для пополнения

  @Prop({
    type: String,
    default: '',
    index: true,
  })
  b2bTransactionId: string; // ID транзакции в B2B

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: {},
    _id: false,
  })
  metadata: {
    ip?: string; // Optional IP address of the user
    userAgent?: string; // Optional User-Agent string from browser
    [key: string]: unknown; // Index signature for additional properties
  };

  // Виртуальные поля для обратной совместимости
  get fromAmount(): Decimal {
    return this.amount;
  }

  get fromProviderAmount(): Decimal {
    return this.paidAmount;
  }

  get fromCurrencyCode(): string {
    return this.currency;
  }

  get toCurrencyCode(): string {
    return 'RUB';
  }

  get currencyCode(): string {
    return this.currency;
  }

  get meta(): Record<string, any> {
    return {
      ...this.metadata,
    };
  }
}

export const PaySchema = SchemaFactory.createForClass(Pay);

// Виртуальные поля для обратной совместимости
PaySchema.virtual('fromAmount').get(function () {
  return this.amount;
});

PaySchema.virtual('fromProviderAmount').get(function () {
  return this.paidAmount;
});

PaySchema.virtual('fromCurrencyCode').get(function () {
  return this.currency;
});

PaySchema.virtual('toCurrencyCode').get(function () {
  return 'RUB';
});

PaySchema.virtual('currencyCode').get(function () {
  return this.currency;
});

PaySchema.virtual('meta').get(function () {
  return {
    ...this.metadata,
  };
});
