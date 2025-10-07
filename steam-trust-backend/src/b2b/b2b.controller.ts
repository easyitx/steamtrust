import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { B2bService } from './b2b.service';
import { B2bExecuteService } from './b2b-execute.service';
import {
  Currency,
  TransactionCreateAPIDto,
  TransactionQueryParams,
} from './b2b.dto';
import { BodyValidationInterceptor } from '@app/common';

@Controller('b2b')
export class B2bController {
  constructor(
    private readonly b2bService: B2bService,
    private readonly b2bExecuteService: B2bExecuteService,
  ) {}

  // ===== USER ENDPOINTS =====

  /**
   * Баланс пользователя
   * GET /b2b/user/balance
   */
  @Get('user/balance')
  async getUserBalance() {
    return this.b2bService.getBalance();
  }

  // ===== TRANSACTION ENDPOINTS =====

  /**
   * Список транзакций
   * GET /b2b/transactions
   */
  @Get('transactions')
  async getTransactions(@Query() query: TransactionQueryParams) {
    return this.b2bService.getTransactions(query);
  }

  // ===== CURRENCY ENDPOINTS =====

  /**
   * Все курсы валют
   * GET /b2b/currencies
   */
  @Get('currencies')
  async getAllCurrencies() {
    return this.b2bService.getAllCurrencies();
  }

  /**
   * Конвертация валют
   * GET /b2b/currencies/convert/:fromCurrency/:toCurrency/:amount
   */
  @Get('currencies/convert/:fromCurrency/:toCurrency/:amount')
  async convertCurrency(
    @Param('fromCurrency') fromCurrency: Currency,
    @Param('toCurrency') toCurrency: Currency,
    @Param('amount') amount: number | string,
  ) {
    return this.b2bService.convertCurrency(fromCurrency, toCurrency, amount);
  }

  // ===== PAYMENT ENDPOINTS =====

  @Post('payment/verify')
  @UseInterceptors(new BodyValidationInterceptor(TransactionCreateAPIDto))
  async verifyPayment(@Body() data: TransactionCreateAPIDto) {
    return this.b2bService.paymentVerify(
      data.code,
      data.account,
      data.amount,
      data.currency,
    );
  }

  /**
   * Выполнение платежа
   * POST /b2b/payment/execute/:transactionId
   */
  @Post('payment/execute/:transactionId')
  async executePayment(@Param('transactionId') transactionId: string) {
    return this.b2bService.paymentExecute(transactionId);
  }

  /**
   * Статус платежа
   * GET /b2b/payment/status/:transactionId
   */
  @Get('payment/status/:transactionId')
  async getPaymentStatus(@Param('transactionId') transactionId: string) {
    return this.b2bService.getPaymentStatus(transactionId);
  }
}
