import {
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsEmail,
  Matches,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PromoCode } from './promocode.schema';
import { PaginationQuery, PaginationResp } from '@app/common';

export class ApplyPromoReq {
  @IsNotEmpty({ message: 'Promo code is required' })
  @IsString({ message: 'Promo code must be a string' })
  @MinLength(3, { message: 'Promo code must be at least 3 characters' })
  @MaxLength(50, { message: 'Promo code is too long' })
  @Transform(({ value }) => value?.toString().trim().toLowerCase())
  code: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255, { message: 'Email is too long' })
  @Transform(({ value }) => value?.toString().trim().toLowerCase())
  email: string;
}

export class GetActiveActivationResp extends PromoCode {}

export class UpdatePromocodeBonusReq {
  @IsNotEmpty({ message: 'Bonus percent is required' })
  @IsNumber({}, { message: 'Bonus percent must be a number' })
  @Min(0, { message: 'Bonus percent cannot be negative' })
  @Max(100, { message: 'Bonus percent cannot exceed 100%' })
  @Type(() => Number)
  bonusPercent: number;
}

export class CreatePromocodeReq {
  @IsNotEmpty({ message: 'Promo code is required' })
  @IsString({ message: 'Promo code must be a string' })
  @MinLength(3, { message: 'Promo code must be at least 3 characters' })
  @MaxLength(50, { message: 'Promo code is too long' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      'Promo code can only contain letters, numbers, underscores and hyphens',
  })
  @Transform(({ value }) => value?.toString().trim().toLowerCase())
  code: string;

  @IsNotEmpty({ message: 'Bonus percent is required' })
  @IsNumber({}, { message: 'Bonus percent must be a number' })
  @Min(0, { message: 'Bonus percent cannot be negative' })
  @Max(100, { message: 'Bonus percent cannot exceed 100%' })
  @Type(() => Number)
  bonusPercent: number;
}

export class PromocodeListReq extends PaginationQuery {
  @IsOptional()
  @IsString({ message: 'ID must be a string' })
  @MinLength(1, { message: 'ID cannot be empty' })
  @MaxLength(100, { message: 'ID is too long' })
  @Transform(({ value }) => value?.toString().trim())
  id?: string;

  @IsOptional()
  @IsString({ message: 'Code must be a string' })
  @MinLength(3, { message: 'Code must be at least 3 characters' })
  @MaxLength(50, { message: 'Code is too long' })
  @Transform(({ value }) => value?.toString().trim().toLowerCase())
  code?: string;
}

export class PromocodeListResp extends PaginationResp {
  items: PromoCode[];

  constructor(items: PromoCode[], total: number, page: number, limit: number) {
    super(total, page, limit);
    this.items = items;
  }
}
