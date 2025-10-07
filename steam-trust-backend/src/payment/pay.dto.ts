import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumberString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQuery, PaginationResp } from '@app/common';
import { Pay, PayStatus, PaymentProvider } from './pay.schema';

// Внутренний DTO для создания платежа в сервисе
export interface CreatePayDto {
  currency: string;
  commission: number;
  provider: PaymentProvider;
  email: string;
  account: string;
  metadata: Record<string, any>;
  amount: string;
}

export class CreatePayReq {
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumberString({}, { message: 'Amount must be a valid number string' })
  @MinLength(1, { message: 'Amount cannot be empty' })
  @MaxLength(10, { message: 'Amount is too long' })
  @Transform(({ value }) => value?.toString().trim())
  amount: string; // сумма для оплаты

  @IsNotEmpty({ message: 'Method code is required' })
  @IsString({ message: 'Method code must be a string' })
  @MinLength(3, { message: 'Method code must be at least 3 characters' })
  @MaxLength(50, { message: 'Method code is too long' })
  @Transform(({ value }) => value?.toString().trim())
  methodCode: string;

  @IsNotEmpty({ message: 'Account is required' })
  @IsString({ message: 'Account must be a string' })
  @MinLength(3, { message: 'Account must be at least 3 characters' })
  @MaxLength(100, { message: 'Account is too long' })
  @Transform(({ value }) => value?.toString().trim())
  account: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255, { message: 'Email is too long' })
  @Transform(({ value }) => value?.toString().trim().toLowerCase())
  email: string;

  @IsOptional()
  @IsString({ message: 'Meta must be a string' })
  @MaxLength(1000, { message: 'Meta is too long' })
  @Transform(({ value }) => value?.toString().trim())
  meta?: string; // JSON строка с метаданными
}

export class CreatePayResp {
  paymentLink: string;
  details: any;
}

export class PaymentsHistoryListReq extends PaginationQuery {
  @IsOptional()
  @IsEnum(PayStatus, { message: 'Invalid payment status' })
  status?: PayStatus;

  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Transform(({ value }) => value?.toString().trim().toLowerCase())
  email?: string;

  @IsOptional()
  @IsString({ message: 'Account must be a string' })
  @MinLength(3, { message: 'Account must be at least 3 characters' })
  @Transform(({ value }) => value?.toString().trim())
  account?: string;
}

export class PaymentsListResp extends PaginationResp {
  items: Pay[];

  constructor(items: Pay[], total: number, page: number, limit: number) {
    super(total, page, limit);
    this.items = items;
  }
}
