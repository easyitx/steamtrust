import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ERROR_MESSAGES } from './error-codes';

export interface CustomExceptionOptions {
  code: ErrorCode;
  statusCode?: HttpStatus;
  details?: Record<string, any>;
  language?: 'en' | 'ru';
}

export class CustomException extends HttpException {
  public readonly code: ErrorCode;
  public readonly details?: Record<string, any>;
  public readonly language: 'en' | 'ru';

  constructor(options: CustomExceptionOptions) {
    const {
      code,
      statusCode = HttpStatus.BAD_REQUEST,
      details,
      language = 'ru',
    } = options;

    const errorMessages = ERROR_MESSAGES[code];
    const message = errorMessages[language];

    super(
      {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );

    this.code = code;
    this.details = details;
    this.language = language;
  }

  // Статические методы для удобного создания исключений
  static validationError(
    details?: Record<string, any>,
    language: 'en' | 'ru' = 'en',
  ) {
    return new CustomException({
      code: ErrorCode.VALIDATION_ERROR,
      statusCode: HttpStatus.BAD_REQUEST,
      details,
      language,
    });
  }

  static notFound(resource: string, language: 'en' | 'ru' = 'en') {
    return new CustomException({
      code: ErrorCode.NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
      details: { resource },
      language,
    });
  }

  static unauthorized(language: 'en' | 'ru' = 'en') {
    return new CustomException({
      code: ErrorCode.UNAUTHORIZED,
      statusCode: HttpStatus.UNAUTHORIZED,
      language,
    });
  }

  // Ошибки платежей
  static paymentMethodNotFound(methodId: string, language: 'en' | 'ru' = 'en') {
    return new CustomException({
      code: ErrorCode.PAYMENT_METHOD_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
      details: { methodId },
      language,
    });
  }

  static paymentMethodInactive(methodId: string, language: 'en' | 'ru' = 'en') {
    return new CustomException({
      code: ErrorCode.PAYMENT_METHOD_INACTIVE,
      statusCode: HttpStatus.BAD_REQUEST,
      details: { methodId },
      language,
    });
  }

  static paymentAmountTooLow(
    amount: number,
    minAmount: number,
    language: 'en' | 'ru' = 'en',
  ) {
    return new CustomException({
      code: ErrorCode.PAYMENT_AMOUNT_TOO_LOW,
      statusCode: HttpStatus.BAD_REQUEST,
      details: { amount, minAmount },
      language,
    });
  }

  static paymentAmountTooHigh(
    amount: number,
    maxAmount: number,
    language: 'en' | 'ru' = 'en',
  ) {
    return new CustomException({
      code: ErrorCode.PAYMENT_AMOUNT_TOO_HIGH,
      statusCode: HttpStatus.BAD_REQUEST,
      details: { amount, maxAmount },
      language,
    });
  }

  static dailyLimitExceeded(
    currentAmount: number,
    limit: number,
    language: 'en' | 'ru' = 'en',
  ) {
    return new CustomException({
      code: ErrorCode.DAILY_LIMIT_EXCEEDED,
      statusCode: HttpStatus.BAD_REQUEST,
      details: { currentAmount, limit },
      language,
    });
  }

  static tooManyActivePayments(
    currentCount: number,
    maxCount: number,
    language: 'en' | 'ru' = 'en',
  ) {
    return new CustomException({
      code: ErrorCode.TOO_MANY_ACTIVE_PAYMENTS,
      statusCode: HttpStatus.BAD_REQUEST,
      details: { currentCount, maxCount },
      language,
    });
  }

  // Ошибки B2B
  static b2bVerificationFailed(
    statusCode: string,
    account: string,
    reason: string,
    language: 'en' | 'ru' = 'en',
  ) {
    return new CustomException({
      code: ErrorCode.B2B_VERIFICATION_FAILED,
      statusCode: HttpStatus.BAD_REQUEST,
      details: { b2bStatusCode: statusCode, account, reason },
      language,
    });
  }

  static b2bRequestRejected(
    account: string,
    reason: string,
    language: 'en' | 'ru' = 'en',
  ) {
    return new CustomException({
      code: ErrorCode.B2B_REQUEST_REJECTED,
      statusCode: HttpStatus.BAD_REQUEST,
      details: { account, reason },
      language,
    });
  }

  static paymentRequestError(reason: string, language: 'en' | 'ru' = 'ru') {
    return new CustomException({
      code: ErrorCode.PAYMENT_REQUEST_ERROR,
      statusCode: HttpStatus.BAD_REQUEST,
      details: { reason },
      language,
    });
  }

  // Ошибки промокодов
  static promocodeNotFound(code: string, language: 'en' | 'ru' = 'en') {
    return new CustomException({
      code: ErrorCode.PROMOCODE_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
      details: { promocode: code },
      language,
    });
  }

  static promocodeAlreadyUsed(code: string, language: 'en' | 'ru' = 'en') {
    return new CustomException({
      code: ErrorCode.PROMOCODE_ALREADY_USED,
      statusCode: HttpStatus.BAD_REQUEST,
      details: { promocode: code },
      language,
    });
  }

  // Ошибки webhook
  static webhookSignatureInvalid(
    provider: string,
    language: 'en' | 'ru' = 'en',
  ) {
    return new CustomException({
      code: ErrorCode.WEBHOOK_SIGNATURE_INVALID,
      statusCode: HttpStatus.BAD_REQUEST,
      details: { provider },
      language,
    });
  }

  // Метод для получения сообщения на определенном языке
  getMessage(language: 'en' | 'ru'): string {
    return ERROR_MESSAGES[this.code][language];
  }

  // Метод для получения полного ответа на определенном языке
  getResponse(language: 'en' | 'ru' = 'en') {
    return {
      code: this.code,
      message: this.getMessage(language),
      details: this.details,
      timestamp: new Date().toISOString(),
    };
  }
}
