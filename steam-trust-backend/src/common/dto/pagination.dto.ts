import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum Order {
  asc = 'asc',
  desc = 'desc',
}

export class PaginationQuery {
  @IsOptional()
  @IsEnum(Order, { message: 'Order must be asc or desc' })
  readonly order?: Order = Order.desc;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @Max(parseInt(process.env.PAGINATION_MAX_PAGE || '10000'), {
    message: 'Page cannot exceed 10000',
  })
  @Transform(({ value }) => {
    const num = parseInt(value);
    return isNaN(num) ? 1 : Math.max(1, num);
  })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(parseInt(process.env.PAGINATION_MAX_LIMIT || '1000'), {
    message: 'Limit cannot exceed 1000',
  })
  @Transform(({ value }) => {
    const num = parseInt(value);
    return isNaN(num)
      ? 10
      : Math.max(
          1,
          Math.min(parseInt(process.env.PAGINATION_MAX_LIMIT || '1000'), num),
        );
  })
  limit?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  get sortDirection() {
    return this.order === Order.desc ? -1 : 1;
  }
}

export class PaginationResp {
  total: number;
  page: number;
  limit: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor(total: number, page: number, limit: number) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.pageCount = Math.ceil(this.total / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
