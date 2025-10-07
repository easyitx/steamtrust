import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ClientInfoDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255, { message: 'Email is too long' })
  @Transform(({ value }) => value?.toString().trim().toLowerCase())
  email: string;

  @IsOptional()
  @IsString({ message: 'IP address must be a string' })
  @MaxLength(45, { message: 'IP address is too long' })
  @Transform(({ value }) => value?.toString().trim())
  ip?: string;
}
