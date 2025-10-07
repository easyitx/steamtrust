// Основные DTO для B2B API G-Engine 2.0

import {
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

// Get user balance response
export interface WalletResponse {
  id: number;
  balance: number;
  cashback: number;
  currency: string;
}

// Transaction response
export interface TransactionResponse {
  id: number;
  code: string;
  code_api?: string | null;
  currency: Currency;
  date?: string | null; // ISO date-time
  issue_date?: string | null; // ISO date-time
  steam_login?: string | null;
  amount?: number | null;
  amount_usd?: number | null;
  cashback?: number | null;
  status_code?: StatusCode | null;
  user_login?: string | null;
}

export interface CurrencyRateResponse {
  id: number;
  currency: string;
  source: string;
  rate: number;
  updated_at: string;
}

export interface PayResponse {
  id: number;
  code: string;
  code_api: string;
  currency: Currency;
  date: string;
  issue_date: string;
  steam_login: string;
  amount: number;
  amount_usd: number;
  cashback: number;
  status_code: StatusCode;
  user_login: string;
  parent_id: number;
}

export interface ResponseBase<T> {
  success: boolean;
  message: string;
  data?: T;
}

export type PaymentExecuteResponse = ResponseBase<
  PayResponse | Record<string, any>
>;

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// Enums
export enum StatusCode {
  DUPLICATE_TRANSACTION = 'DUPLICATE_TRANSACTION',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  PAYMENT_VERIFICATION_FAILED = 'PAYMENT_VERIFICATION_FAILED',
  PAYMENT_CONFIRMATION_FAILED = 'PAYMENT_CONFIRMATION_FAILED',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_IN_PROGRESS = 'PAYMENT_IN_PROGRESS',
  PURCHASE_NOT_FOUND = 'PURCHASE_NOT_FOUND',
  REQUEST_ACCEPTED = 'REQUEST_ACCEPTED',
  CALCULATION_ERROR = 'CALCULATION_ERROR',
  TOP_UP_ERROR = 'TOP_UP_ERROR',
}

export class TransactionCreateAPIDto {
  @IsString()
  @MinLength(6)
  @MaxLength(36)
  @IsNotEmpty()
  code: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  account: string;

  @IsNotEmpty()
  amount: number | string;

  @IsString()
  @IsIn([
    'USD',
    'RUB',
    'EUR',
    'GBP',
    'JPY',
    'CNY',
    'AUD',
    'CAD',
    'CHF',
    'SEK',
    'NZD',
    'KZT',
    'UAH',
    'BYN',
    'AMD',
    'AZN',
    'GEL',
    'TJS',
    'UZS',
  ])
  @IsNotEmpty()
  currency: Currency;
}

// Интерфейс оставьте для типизации
export interface TransactionCreateAPI {
  code: string;
  account: string;
  amount: number | string;
  currency: Currency;
}

export interface ResponseBaseAPI<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface ConvertCurrencyResponse {
  from_currency: string;
  to_currency: string;
  amount: number;
  converted_amount: number;
}

export interface PaginationResponse<T> {
  total: number;
  limit?: number | null;
  offset?: number | null;
  items: T[];
}

export interface TransactionCreateAPI {
  code: string;
  account: string;
  amount: number | string;
  currency: Currency;
}

export type Currency =
  | 'USD'
  | 'RUB'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'CNY'
  | 'AUD'
  | 'CAD'
  | 'CHF'
  | 'SEK'
  | 'NZD'
  | 'KZT'
  | 'UAH'
  | 'BYN'
  | 'AMD'
  | 'AZN'
  | 'GEL'
  | 'TJS'
  | 'UZS';

// Transaction query parameters
export class TransactionQueryParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 25;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  sort_by?: string = 'id';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sort_order?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsDateString()
  from_date?: string;

  @IsOptional()
  @IsDateString()
  to_date?: string;

  @IsOptional()
  @IsString()
  search_field?: string;

  @IsOptional()
  @IsString()
  search_value?: string;
}
