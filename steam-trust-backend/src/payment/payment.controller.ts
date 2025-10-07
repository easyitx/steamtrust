import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Put,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePayReq, PaymentsHistoryListReq } from './pay.dto';
import { PayMethodsListReq, UpdateMethodReq, CreateMethodReq } from './methods';
import {
  BodyValidationInterceptor,
  QueryValidationInterceptor,
} from '@app/common';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('fiat/pay')
  @UseInterceptors(new BodyValidationInterceptor(CreatePayReq))
  async createNewPay(@Body() data: CreatePayReq) {
    const result = await this.paymentService.createNewPay(data);

    return {
      success: true,
      data: result,
    };
  }

  @Get('payments/history')
  @UseInterceptors(new QueryValidationInterceptor(PaymentsHistoryListReq))
  async getPaymentsHistory(@Query() query: PaymentsHistoryListReq) {
    const result = await this.paymentService.getPayments(query);

    return {
      success: true,
      data: result,
    };
  }

  @Get('methods')
  @UseInterceptors(new QueryValidationInterceptor(PayMethodsListReq))
  async getPayMethods(@Query() query: PayMethodsListReq) {
    const result = await this.paymentService.getPayMethods(query);

    return {
      success: true,
      data: result,
    };
  }

  @Post('methods')
  @UseInterceptors(new BodyValidationInterceptor(CreateMethodReq))
  async createPayMethod(@Body() data: CreateMethodReq) {
    const result = await this.paymentService.createMethod(data);

    return {
      success: true,
      data: result,
    };
  }

  @Put('methods/:id')
  @UseInterceptors(new BodyValidationInterceptor(UpdateMethodReq))
  async updatePayMethod(
    @Param('id') id: string,
    @Body() data: UpdateMethodReq,
  ) {
    const result = await this.paymentService.updateMethod(id, data);

    return {
      success: true,
      data: result,
    };
  }
}
