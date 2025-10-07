import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

// Параметры для создания платежа
export interface CreateCardlinkPayDto {
  amount: string; // Сумма счета на оплату
  shop_id: string; // Уникальный идентификатор магазина
  order_id?: string; // Уникальный идентификатор заказа
  description?: string; // Описание платежа
  type?: 'normal' | 'multi'; // Тип платежа
  currency_in?: 'RUB' | 'USD' | 'EUR'; // Валюта оплаты
  custom?: string; // Произвольное поле
  payer_pays_commission?: 0 | 1; // Кто оплачивает комиссию
  payer_email?: string; // Email клиента
  name?: string; // Название ссылки
  ttl?: number; // Время жизни счета в секундах
  success_url?: string; // Страница успешной оплаты
  fail_url?: string; // Страница неуспешной оплаты
  payment_method?: 'BANK_CARD' | 'SBP'; // Способ оплаты
  request_fields?: {
    email?: boolean; // Запрос email
    phone?: boolean; // Запрос телефона
    name?: boolean; // Запрос ФИО
    comment?: boolean; // Запрос комментария
  };
  items?: Array<{
    name: string; // Название товара
    price: string; // Цена
    quantity: string; // Количество
    category: string; // Категория
    extra?: Record<string, string>; // Дополнительные поля
  }>;
}

// Ответ при создании платежа
export interface CreateCardlinkPayResponse {
  success: boolean; // Флаг успешности запроса
  link_url: string; // Ссылка на страницу с QR кодом
  link_page_url: string; // Ссылка на оплату
  bill_id: string; // Уникальный идентификатор счета
}

// Статусы платежа
export enum CardlinkPayStatus {
  'SUCCESS' = 'SUCCESS',
  'UNDERPAID' = 'UNDERPAID',
  'OVERPAID' = 'OVERPAID',
  'FAIL' = 'FAIL',
}

// Ответ в webhook
export class CardlinkPayWebhookDto {
  @IsNotEmpty({ message: 'InvId is required' })
  @IsString({ message: 'InvId must be a string' })
  @Transform(({ value }) => value?.toString().trim())
  InvId: string; // Уникальный идентификатор заказа

  @IsNotEmpty({ message: 'OutSum is required' })
  @IsString({ message: 'OutSum must be a string' })
  @Transform(({ value }) => value?.toString().trim())
  OutSum: string; // Сумма платежа

  @IsNotEmpty({ message: 'Commission is required' })
  @IsString({ message: 'Commission must be a string' })
  @Transform(({ value }) => value?.toString().trim())
  Commission: string; // Комиссия с платежа

  @IsNotEmpty({ message: 'TrsId is required' })
  @IsString({ message: 'TrsId must be a string' })
  @Transform(({ value }) => value?.toString().trim())
  TrsId: string; // Уникальный идентификатор платежа

  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(CardlinkPayStatus, { message: 'Invalid payment status' })
  Status: CardlinkPayStatus; // Статус платежа

  @IsNotEmpty({ message: 'CurrencyIn is required' })
  @IsEnum(['RUB', 'USD', 'EUR'], { message: 'Invalid currency' })
  CurrencyIn: 'RUB' | 'USD' | 'EUR'; // Валюта оплаты

  @IsOptional()
  @IsString({ message: 'custom must be a string' })
  @Transform(({ value }) => value?.toString().trim())
  custom?: string; // Произвольное поле

  @IsOptional()
  @IsEnum(['BANK_CARD', 'SBP'], { message: 'Invalid account type' })
  AccountType?: 'BANK_CARD' | 'SBP'; // Метод оплаты

  @IsOptional()
  @IsString({ message: 'AccountNumber must be a string' })
  @Transform(({ value }) => value?.toString().trim())
  AccountNumber?: string; // Информация о методе оплаты

  @IsOptional()
  @IsString({ message: 'BalanceAmount must be a string' })
  @Transform(({ value }) => value?.toString().trim())
  BalanceAmount?: string; // Сумма зачисления на баланс

  @IsOptional()
  @IsEnum(['RUB', 'USD', 'EUR'], { message: 'Invalid balance currency' })
  BalanceCurrency?: 'RUB' | 'USD' | 'EUR'; // Валюта зачисления

  @IsOptional()
  @IsNumber({}, { message: 'ErrorCode must be a number' })
  ErrorCode?: number; // Код ошибки

  @IsOptional()
  @IsString({ message: 'ErrorMessage must be a string' })
  @Transform(({ value }) => value?.toString().trim())
  ErrorMessage?: string; // Описание ошибки

  @IsNotEmpty({ message: 'SignatureValue is required' })
  @IsString({ message: 'SignatureValue must be a string' })
  @Transform(({ value }) => value?.toString().trim())
  SignatureValue: string; // Подпись запроса
}
