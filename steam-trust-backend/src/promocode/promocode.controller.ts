import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePromocodeReq, PromocodeListReq, ApplyPromoReq } from './promocode.dto';
import {
  BodyValidationInterceptor,
  QueryValidationInterceptor,
  ParamsValidationInterceptor,
} from '@app/common';
import { Request } from 'express';
import { PromocodeService } from './promocode.service';
import { PromoCode } from './promocode.schema';

@Controller('/promocode')
export class PromocodeController {
  constructor(private readonly promocodeService: PromocodeService) {}

  @Post('/create')
  @UseInterceptors(new BodyValidationInterceptor(CreatePromocodeReq))
  async createPromocode(@Body() data: CreatePromocodeReq) {
    return this.promocodeService.createPromocode(data);
  }

  @Get('/list')
  @UseInterceptors(new QueryValidationInterceptor(PromocodeListReq))
  async getPromocodes(@Query() query: PromocodeListReq) {
    return this.promocodeService.getPromocodes(query);
  }

  @Get('/:code')
  @UseInterceptors(new ParamsValidationInterceptor(String))
  async getPromocode(@Param('code') code: string) {
    return this.promocodeService.getPromocode(code);
  }

  @Put('/:id')
  @UseInterceptors(new BodyValidationInterceptor(CreatePromocodeReq))
  async updatePromocode(
    @Param('id') id: string,
    @Body() data: CreatePromocodeReq,
  ) {
    return this.promocodeService.updatePromocode(id, data);
  }

  @Post('/activate/:code')
  @UseInterceptors(new BodyValidationInterceptor(ApplyPromoReq))
  async activatePromocode(
    @Param('code') code: string,
    @Body() data: ApplyPromoReq,
  ) {
    return this.promocodeService.activatePromocode(code, data.email);
  }
}
