import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  Min,
  Max,
  IsInt,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaymentProvider } from '../pay.schema';
import { PaginationQuery, PaginationResp } from '@app/common';

export class PayMethodsListReq extends PaginationQuery {
  @IsOptional()
  @IsEnum(PaymentProvider, { message: 'Invalid payment provider' })
  provider?: PaymentProvider;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
}

export class PayMethodsListResp extends PaginationResp {
  items: any[];

  constructor(items: any[], total: number, page: number, limit: number) {
    super(total, page, limit);
    this.items = items;
  }
}

export class UpdateMethodReq {
  @IsNotEmpty({ message: 'Relative commission is required' })
  @IsNumber({}, { message: 'Relative commission must be a number' })
  @Min(0, { message: 'Relative commission cannot be negative' })
  @Max(100, { message: 'Relative commission cannot exceed 100%' })
  @Type(() => Number)
  relativeCommission: number;

  @IsNotEmpty({ message: 'Relative provider commission is required' })
  @IsNumber({}, { message: 'Relative provider commission must be a number' })
  @Min(0, { message: 'Relative provider commission cannot be negative' })
  @Max(100, { message: 'Relative provider commission cannot exceed 100%' })
  @Type(() => Number)
  relativeProviderCommission: number;
}

export class CreateMethodReq {
  @IsNotEmpty({ message: 'Provider method is required' })
  @IsString({ message: 'Provider method must be a string' })
  @MinLength(3, { message: 'Provider method must be at least 3 characters' })
  @MaxLength(50, { message: 'Provider method is too long' })
  @Transform(({ value }) => value?.toString().trim())
  providerMethod: string;

  @IsNotEmpty({ message: 'Provider is required' })
  @IsEnum(PaymentProvider, { message: 'Invalid payment provider' })
  provider: PaymentProvider;

  @IsNotEmpty({ message: 'From currency code is required' })
  @IsString({ message: 'From currency code must be a string' })
  @MinLength(3, { message: 'From currency code must be at least 3 characters' })
  @MaxLength(3, { message: 'From currency code must be exactly 3 characters' })
  @Transform(({ value }) => value?.toString().trim().toUpperCase())
  fromCurrencyCode: string;

  @IsNotEmpty({ message: 'To currency code is required' })
  @IsString({ message: 'To currency code must be a string' })
  @MinLength(3, { message: 'To currency code must be at least 3 characters' })
  @MaxLength(3, { message: 'To currency code must be exactly 3 characters' })
  @Transform(({ value }) => value?.toString().trim().toUpperCase())
  toCurrencyCode: string;

  @IsNotEmpty({ message: 'Min amount is required' })
  @IsInt({ message: 'Min amount must be an integer' })
  @Min(1, { message: 'Min amount must be at least 1' })
  @Max(1000000, { message: 'Min amount is too high' })
  @Type(() => Number)
  min: number;

  @IsNotEmpty({ message: 'Max amount is required' })
  @IsInt({ message: 'Max amount must be an integer' })
  @Min(1, { message: 'Max amount must be at least 1' })
  @Max(10000000, { message: 'Max amount is too high' })
  @Type(() => Number)
  max: number;

  @IsNotEmpty({ message: 'Relative commission is required' })
  @IsNumber({}, { message: 'Relative commission must be a number' })
  @Min(0, { message: 'Relative commission cannot be negative' })
  @Max(100, { message: 'Relative commission cannot exceed 100%' })
  @Type(() => Number)
  relativeCommission: number;

  @IsNotEmpty({ message: 'Relative provider commission is required' })
  @IsNumber({}, { message: 'Relative provider commission must be a number' })
  @Min(0, { message: 'Relative provider commission cannot be negative' })
  @Max(100, { message: 'Relative provider commission cannot exceed 100%' })
  @Type(() => Number)
  relativeProviderCommission: number;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean = true;
}
