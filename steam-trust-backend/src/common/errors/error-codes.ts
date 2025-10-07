export enum ErrorCode {
  // Общие ошибки
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Ошибки платежей
  PAYMENT_REQUEST_ERROR = 'PAYMENT_REQUEST_ERROR',
  PAYMENT_METHOD_NOT_FOUND = 'PAYMENT_METHOD_NOT_FOUND',
  PAYMENT_METHOD_INACTIVE = 'PAYMENT_METHOD_INACTIVE',
  INVALID_PAYMENT_AMOUNT = 'INVALID_PAYMENT_AMOUNT',
  PAYMENT_AMOUNT_TOO_LOW = 'PAYMENT_AMOUNT_TOO_LOW',
  PAYMENT_AMOUNT_TOO_HIGH = 'PAYMENT_AMOUNT_TOO_HIGH',
  DAILY_LIMIT_EXCEEDED = 'DAILY_LIMIT_EXCEEDED',
  TOO_MANY_ACTIVE_PAYMENTS = 'TOO_MANY_ACTIVE_PAYMENTS',
  B2B_VERIFICATION_FAILED = 'B2B_VERIFICATION_FAILED',
  B2B_ACCOUNT_BANNED = 'B2B_ACCOUNT_BANNED',
  B2B_ACCOUNT_INVALID = 'B2B_ACCOUNT_INVALID',
  B2B_INSUFFICIENT_FUNDS = 'B2B_INSUFFICIENT_FUNDS',
  B2B_DUPLICATE_TRANSACTION = 'B2B_DUPLICATE_TRANSACTION',
  B2B_TIMEOUT = 'B2B_TIMEOUT',
  B2B_AUTHORIZATION_FAILED = 'B2B_AUTHORIZATION_FAILED',

  // Ошибки промокодов
  PROMOCODE_NOT_FOUND = 'PROMOCODE_NOT_FOUND',
  PROMOCODE_EXPIRED = 'PROMOCODE_EXPIRED',
  PROMOCODE_ALREADY_USED = 'PROMOCODE_ALREADY_USED',
  PROMOCODE_INVALID = 'PROMOCODE_INVALID',
  PROMOCODE_LIMIT_EXCEEDED = 'PROMOCODE_LIMIT_EXCEEDED',

  // Ошибки webhook
  WEBHOOK_SIGNATURE_INVALID = 'WEBHOOK_SIGNATURE_INVALID',
  WEBHOOK_DATA_INVALID = 'WEBHOOK_DATA_INVALID',
  WEBHOOK_PAYMENT_NOT_FOUND = 'WEBHOOK_PAYMENT_NOT_FOUND',

  // Ошибки B2B
  B2B_REQUEST_REJECTED = 'B2B_REQUEST_REJECTED',
  B2B_REQUEST_FAILED = 'B2B_REQUEST_FAILED',
  B2B_REQUEST_TIMEOUT = 'B2B_REQUEST_TIMEOUT',
  B2B_REQUEST_INVALID = 'B2B_REQUEST_INVALID',
  B2B_REQUEST_UNAUTHORIZED = 'B2B_REQUEST_UNAUTHORIZED',
  B2B_REQUEST_FORBIDDEN = 'B2B_REQUEST_FORBIDDEN',
  B2B_REQUEST_NOT_FOUND = 'B2B_REQUEST_NOT_FOUND',
  B2B_REQUEST_CONFLICT = 'B2B_REQUEST_CONFLICT',
  B2B_REQUEST_TOO_MANY = 'B2B_REQUEST_TOO_MANY',
  B2B_INTERNAL_ERROR = 'B2B_INTERNAL_ERROR',
  B2B_BAD_GATEWAY = 'B2B_BAD_GATEWAY',
  B2B_SERVICE_UNAVAILABLE = 'B2B_SERVICE_UNAVAILABLE',
  B2B_GATEWAY_TIMEOUT = 'B2B_GATEWAY_TIMEOUT',

  // Ошибки провайдеров
  PROVIDER_SERVICE_UNAVAILABLE = 'PROVIDER_SERVICE_UNAVAILABLE',
  PROVIDER_INVALID_RESPONSE = 'PROVIDER_INVALID_RESPONSE',
  PROVIDER_TIMEOUT = 'PROVIDER_TIMEOUT',
  PROVIDER_AUTHORIZATION_FAILED = 'PROVIDER_AUTHORIZATION_FAILED',
}

export interface ErrorMessage {
  en: string;
  ru: string;
}

export const ERROR_MESSAGES: Record<ErrorCode, ErrorMessage> = {
  // Общие ошибки
  [ErrorCode.VALIDATION_ERROR]: {
    en: 'Validation error occurred',
    ru: 'Произошла ошибка валидации',
  },
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    en: 'Internal server error',
    ru: 'Внутренняя ошибка сервера',
  },
  [ErrorCode.NOT_FOUND]: {
    en: 'Resource not found',
    ru: 'Ресурс не найден',
  },
  [ErrorCode.UNAUTHORIZED]: {
    en: 'Unauthorized access',
    ru: 'Неавторизованный доступ',
  },
  [ErrorCode.FORBIDDEN]: {
    en: 'Access forbidden',
    ru: 'Доступ запрещен',
  },
  [ErrorCode.RATE_LIMIT_EXCEEDED]: {
    en: 'Rate limit exceeded',
    ru: 'Превышен лимит запросов',
  },

  // Ошибки платежей
  [ErrorCode.PAYMENT_METHOD_NOT_FOUND]: {
    en: 'Payment method not found',
    ru: 'Метод платежа не найден',
  },
  [ErrorCode.PAYMENT_REQUEST_ERROR]: {
    en: 'Payment request error',
    ru: 'Ошибка платежа',
  },
  [ErrorCode.PAYMENT_METHOD_INACTIVE]: {
    en: 'Payment method is not active',
    ru: 'Метод платежа неактивен',
  },
  [ErrorCode.INVALID_PAYMENT_AMOUNT]: {
    en: 'Invalid payment amount',
    ru: 'Некорректная сумма платежа',
  },
  [ErrorCode.PAYMENT_AMOUNT_TOO_LOW]: {
    en: 'Payment amount is too low',
    ru: 'Сумма платежа слишком мала',
  },
  [ErrorCode.PAYMENT_AMOUNT_TOO_HIGH]: {
    en: 'Payment amount is too high',
    ru: 'Сумма платежа слишком велика',
  },
  [ErrorCode.DAILY_LIMIT_EXCEEDED]: {
    en: 'Daily limit exceeded. Please try again tomorrow',
    ru: 'Превышен дневной лимит. Попробуйте завтра',
  },
  [ErrorCode.TOO_MANY_ACTIVE_PAYMENTS]: {
    en: 'Too many active payments. Please try again later',
    ru: 'Слишком много активных платежей. Попробуйте позже',
  },
  [ErrorCode.B2B_VERIFICATION_FAILED]: {
    en: 'B2B verification failed',
    ru: 'Ошибка верификации B2B',
  },
  [ErrorCode.B2B_SERVICE_UNAVAILABLE]: {
    en: 'B2B service is unavailable',
    ru: 'Сервис B2B недоступен',
  },
  [ErrorCode.B2B_ACCOUNT_BANNED]: {
    en: 'Steam account is banned',
    ru: 'Steam аккаунт заблокирован',
  },
  [ErrorCode.B2B_ACCOUNT_INVALID]: {
    en: 'Invalid Steam account',
    ru: 'Некорректный Steam аккаунт',
  },
  [ErrorCode.B2B_INSUFFICIENT_FUNDS]: {
    en: 'Insufficient funds in B2B system',
    ru: 'Недостаточно средств в системе B2B',
  },
  [ErrorCode.B2B_DUPLICATE_TRANSACTION]: {
    en: 'Duplicate transaction detected',
    ru: 'Обнаружена дублирующая транзакция',
  },
  [ErrorCode.B2B_TIMEOUT]: {
    en: 'B2B service timeout',
    ru: 'Таймаут сервиса B2B',
  },
  [ErrorCode.B2B_AUTHORIZATION_FAILED]: {
    en: 'B2B authorization failed',
    ru: 'Ошибка авторизации B2B',
  },

  // Ошибки промокодов
  [ErrorCode.PROMOCODE_NOT_FOUND]: {
    en: 'Promocode not found',
    ru: 'Промокод не найден',
  },
  [ErrorCode.PROMOCODE_EXPIRED]: {
    en: 'Promocode has expired',
    ru: 'Промокод истек',
  },
  [ErrorCode.PROMOCODE_ALREADY_USED]: {
    en: 'Promocode has already been used',
    ru: 'Промокод уже использован',
  },
  [ErrorCode.PROMOCODE_INVALID]: {
    en: 'Invalid promocode',
    ru: 'Некорректный промокод',
  },
  [ErrorCode.PROMOCODE_LIMIT_EXCEEDED]: {
    en: 'Promocode usage limit exceeded',
    ru: 'Превышен лимит использования промокода',
  },

  // Ошибки webhook
  [ErrorCode.WEBHOOK_SIGNATURE_INVALID]: {
    en: 'Invalid webhook signature',
    ru: 'Некорректная подпись webhook',
  },
  [ErrorCode.WEBHOOK_DATA_INVALID]: {
    en: 'Invalid webhook data',
    ru: 'Некорректные данные webhook',
  },
  [ErrorCode.WEBHOOK_PAYMENT_NOT_FOUND]: {
    en: 'Payment not found for webhook',
    ru: 'Платеж для webhook не найден',
  },

  // Ошибки B2B
  [ErrorCode.B2B_REQUEST_REJECTED]: {
    en: 'B2B request rejected',
    ru: 'Запрос B2B отклонен',
  },
  [ErrorCode.B2B_REQUEST_FAILED]: {
    en: 'B2B request failed',
    ru: 'Запрос B2B не выполнен',
  },
  [ErrorCode.B2B_REQUEST_TIMEOUT]: {
    en: 'B2B request timeout',
    ru: 'Таймаут запроса B2B',
  },
  [ErrorCode.B2B_REQUEST_INVALID]: {
    en: 'Invalid B2B request',
    ru: 'Некорректный запрос B2B',
  },
  [ErrorCode.B2B_REQUEST_UNAUTHORIZED]: {
    en: 'B2B request unauthorized',
    ru: 'Неавторизованный запрос B2B',
  },
  [ErrorCode.B2B_REQUEST_FORBIDDEN]: {
    en: 'B2B request forbidden',
    ru: 'Запрещенный запрос B2B',
  },
  [ErrorCode.B2B_REQUEST_NOT_FOUND]: {
    en: 'B2B request not found',
    ru: 'Запрос B2B не найден',
  },
  [ErrorCode.B2B_REQUEST_CONFLICT]: {
    en: 'B2B request conflict',
    ru: 'Конфликт запроса B2B',
  },
  [ErrorCode.B2B_REQUEST_TOO_MANY]: {
    en: 'Too many B2B requests',
    ru: 'Слишком много запросов B2B',
  },
  [ErrorCode.B2B_INTERNAL_ERROR]: {
    en: 'B2B internal server error',
    ru: 'Внутренняя ошибка сервера B2B',
  },
  [ErrorCode.B2B_BAD_GATEWAY]: {
    en: 'B2B bad gateway',
    ru: 'Плохой шлюз B2B',
  },
  [ErrorCode.B2B_GATEWAY_TIMEOUT]: {
    en: 'B2B gateway timeout',
    ru: 'Таймаут шлюза B2B',
  },

  // Ошибки провайдеров
  [ErrorCode.PROVIDER_SERVICE_UNAVAILABLE]: {
    en: 'Payment provider service unavailable',
    ru: 'Сервис провайдера платежей недоступен',
  },
  [ErrorCode.PROVIDER_INVALID_RESPONSE]: {
    en: 'Invalid response from payment provider',
    ru: 'Некорректный ответ от провайдера платежей',
  },
  [ErrorCode.PROVIDER_TIMEOUT]: {
    en: 'Payment provider timeout',
    ru: 'Таймаут провайдера платежей',
  },
  [ErrorCode.PROVIDER_AUTHORIZATION_FAILED]: {
    en: 'Payment provider authorization failed',
    ru: 'Ошибка авторизации провайдера платежей',
  },
};
