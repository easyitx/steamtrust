import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { Pay, PayDocument, PayStatus, PaymentProvider } from './pay.schema';
import { PayMethod, PayMethodDocument } from './methods/pay-method.schema';
import { B2bService } from '../b2b/b2b.service';
import { TelegramService } from '../telegram/telegram.service';
import { CryptopayService } from './providers/cryptopay/cryptopay.service';
import { CardlinkService } from './providers/cardlink/cardlink.service';
import {
  CreatePayReq,
  CreatePayResp,
  PaymentsListResp,
  CreatePayDto,
} from './pay.dto';
import { CustomException } from '@app/common';
import { ConfigService } from '@nestjs/config';
import Decimal from 'decimal.js';
import {
  PayMethodsListReq,
  PayMethodsListResp,
  UpdateMethodReq,
} from './methods/methods.dto';
import { CreateMethodReq } from './methods/methods.dto';

interface ClientInfo {
  email: string;
  ip: string;
}

@Injectable()
export class PaymentService {
  private readonly numberValidActiveDepositOrders =
    this.configService.get<number>('PAYMENT_ACTIVE_DEPOSIT_ORDERS_LIMIT', 20);

  constructor(
    @InjectModel(Pay.name) private readonly payModel: Model<PayDocument>,
    @InjectModel(PayMethod.name)
    private readonly payMethodModel: Model<PayMethodDocument>,
    private readonly cardlinkService: CardlinkService,
    private readonly cryptopayService: CryptopayService,
    private readonly telegramService: TelegramService,
    private readonly b2bService: B2bService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    // for (const method of methods) {
    //   const exist = await this.payMethodModel.findOne({
    //     providerMethod: method.providerMethod,
    //   });
    //
    //   if (!exist) {
    //     await this.payMethodModel.create({
    //       ...method,
    //     });
    //   }
    // }
  }

  async updateMethod(id: string, data: UpdateMethodReq) {
    try {
      const updatedPromocode = await this.payMethodModel.findByIdAndUpdate(
        id,
        data,
        { new: true },
      );

      if (!updatedPromocode) {
        throw CustomException.notFound('Pay Method');
      }

      return updatedPromocode;
    } catch (error) {
      throw CustomException.validationError({ error: error.message });
    }
  }

  async createMethod(data: CreateMethodReq) {
    try {
      const newMethod = new this.payMethodModel({
        ...data,
        isActive: data.isActive ?? true,
      });

      return await newMethod.save();
    } catch (error) {
      throw CustomException.validationError({ error: error.message });
    }
  }

  async createNewPay(data: CreatePayReq): Promise<CreatePayResp> {
    const method = await this.getActivePayMethodByCodeOrFail(data.methodCode);

    if (!method.isActive) {
      throw CustomException.paymentMethodInactive(data.methodCode);
    }

    // Проверяем сумму платежа
    if (Number(data.amount) < method.min) {
      throw CustomException.paymentAmountTooLow(
        Number(data.amount),
        method.min,
      );
    }

    if (Number(data.amount) > method.max) {
      throw CustomException.paymentAmountTooHigh(
        Number(data.amount),
        method.max,
      );
    }

    // Проверяем количество активных платежей
    const activePayments = await this.getUserActivePaymentsCount(
      data.email, // используем email из data
      method.provider,
    );

    if (activePayments >= this.numberValidActiveDepositOrders) {
      throw CustomException.tooManyActivePayments(
        activePayments,
        this.numberValidActiveDepositOrders,
      );
    }

    // Проверяем лимиты пользователя
    const totalAmount = await this.getTotalUserPaymentsInLast24Hours(
      data.email, // используем email из data
      data.account,
    );

    if (
      Number(totalAmount) >=
      this.configService.get<number>('PAYMENT_DAILY_LIMIT', 30000)
    ) {
      throw CustomException.dailyLimitExceeded(
        Number(totalAmount),
        this.configService.get<number>('PAYMENT_DAILY_LIMIT', 30000),
      );
    }

    const transaction_id = uuidv4();

    console.log(transaction_id);
    // Сначала проверяем возможность пополнения через B2B
    const b2bVerification = await this.b2bService.paymentVerify(
      transaction_id,
      data.account,
      String(data.amount),
    );

    console.log(b2bVerification);

    // Если B2B не разрешает пополнение, возвращаем причину
    if (b2bVerification.data.status_code !== 'REQUEST_ACCEPTED') {
      const reason = this.getB2bErrorMessage(b2bVerification.data.status_code);

      // Отправляем уведомление в Telegram об отказе
      void this.telegramService.sendSystemAlert({
        type: 'warning',
        title: 'Отказ в создании платежа',
        message: `B2B не разрешает пополнение аккаунта ${data.account}`,
        timestamp: new Date(),
        metadata: {
          email: data.email,
          account: data.account.trim(),
          amount: data.amount,
          status: b2bVerification.data.status_code,
          reason: reason,
        },
      });

      throw CustomException.b2bVerificationFailed(
        b2bVerification.data.status_code,
        data.account,
        reason,
      );
    }

    // Если B2B разрешает, создаем платеж в системе
    const bankCommission = new Decimal(data.amount)
      .mul(method.relativeProviderCommission)
      .div(100);

    const serviceCommission = new Decimal(data.amount)
      .mul(method.relativeCommission)
      .div(100);

    const commission = new Decimal(bankCommission).plus(serviceCommission);

    const createPayDto: CreatePayDto = {
      currency: method.fromCurrencyCode,
      commission: Number(commission),
      provider: method.provider,
      email: data.email, // используем email из data
      account: b2bVerification.data.steam_login,
      metadata: {
        b2bResponseVerify: b2bVerification.data,
      },
      amount: String(new Decimal(data.amount).plus(commission)),
    };

    const newPay = await this.createNewPayInstance(createPayDto);

    // Отправляем уведомление о создании платежа
    void this.telegramService.sendPaymentNotification({
      paymentId: newPay._id,
      amount: newPay.amount.toString(),
      currency: newPay.currency,
      provider: newPay.provider,
      status: newPay.status,
      account: newPay.account,
      timestamp: new Date(),
    });

    // Создаем платеж у провайдера
    const provider = this.getPaymentProviderService(method.provider);
    const details = await provider.createPayReq(newPay, method);

    newPay.paymentLink = details.paymentLink;
    newPay.providerTransactionId = details.providerTransactionId;
    newPay.b2bTransactionId = b2bVerification.data.code;
    await newPay.save();

    return {
      paymentLink: newPay.paymentLink,
      details: details,
    };
  }

  async getSuccessPayments(session: ClientSession): Promise<PayDocument[]> {
    return this.payModel
      .find(
        {
          status: PayStatus.success,
        },
        {},
        { session },
      )
      .sort({ createdAt: -1 });
  }

  async getExternalProcessPayments(
    session: ClientSession,
  ): Promise<PayDocument[]> {
    return this.payModel
      .find(
        {
          status: PayStatus.externalProcess,
        },
        {},
        { session },
      )
      .sort({ createdAt: -1 });
  }

  async getPayments(query: any): Promise<any> {
    const { limit, page, status } = query;

    const filters = {
      ...(status ? { status } : {}),
    };

    const skip = (page - 1) * limit;
    const payments = await this.payModel
      .find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.payModel.countDocuments(filters).exec();

    return new PaymentsListResp(payments, total, page, limit);
  }

  async getPayMethods(query: PayMethodsListReq): Promise<PayMethodsListResp> {
    const { limit, page, provider, isActive } = query;

    const filters = {
      ...(provider ? { provider } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    };

    const skip = (page - 1) * limit;
    const methods = await this.payMethodModel
      .find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.payMethodModel.countDocuments(filters).exec();

    return new PayMethodsListResp(methods, total, page, limit);
  }

  private async getActivePayMethodByCodeOrFail(
    methodCode: string,
  ): Promise<PayMethodDocument> {
    const method = await this.payMethodModel.findOne({
      providerMethod: methodCode,
      isActive: true,
    });

    if (!method) {
      throw CustomException.paymentMethodNotFound(methodCode);
    }

    return method;
  }

  async getPendingPayOrFail(
    payId: string,
    session: ClientSession,
  ): Promise<PayDocument> {
    const payment = await this.payModel.findOne(
      {
        _id: payId,
        status: PayStatus.pending,
      },
      {},
      { session },
    );

    if (!payment) {
      throw CustomException.notFound('Payment');
    }

    return payment;
  }

  async getTotalUserPaymentsInLast24Hours(
    email: string,
    account: string,
  ): Promise<number> {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await this.payModel.aggregate([
      {
        $match: {
          userId: email,
          account: account,
          createdAt: { $gte: yesterday },
          status: PayStatus.completed,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalAmount : 0;
  }

  async getUserActivePaymentsCount(
    email: string,
    provider: PaymentProvider,
  ): Promise<number> {
    return this.payModel.countDocuments({
      userId: email,
      provider,
      status: PayStatus.pending,
    });
  }

  async createNewPayInstance(data: CreatePayDto): Promise<PayDocument> {
    const amount = new Decimal(data.amount);

    const payData: Partial<Pay> = {
      provider: data.provider,
      userId: data.email,
      currency: data.currency,
      amount: amount,
      account: data.account,
      status: PayStatus.pending,
      commission: new Decimal(data.commission),
      metadata: data.metadata,
    };

    return await this.payModel.create(payData);
  }

  private getPaymentProviderService(provider: PaymentProvider) {
    switch (provider) {
      case PaymentProvider.cryptopay:
        return this.cryptopayService;
      case PaymentProvider.cardlink:
        return this.cardlinkService;
      default:
        throw CustomException.validationError({
          message: `Unsupported provider: ${provider}`,
          supportedProviders: Object.values(PaymentProvider),
        });
    }
  }

  private getB2bErrorMessage(statusCode: string): string {
    switch (statusCode) {
      case 'REQUEST_REJECTED':
        return 'B2B отклонил запрос на пополнение.';
      case 'REQUEST_FAILED':
        return 'B2B не смог обработать запрос на пополнение.';
      case 'REQUEST_TIMEOUT':
        return 'B2B не ответил в течение таймаута.';
      case 'REQUEST_INVALID':
        return 'B2B получил некорректный запрос на пополнение.';
      case 'REQUEST_UNAUTHORIZED':
        return 'B2B не авторизован для обработки запроса на пополнение.';
      case 'REQUEST_FORBIDDEN':
        return 'B2B запретил обработку запроса на пополнение.';
      case 'REQUEST_NOT_FOUND':
        return 'B2B не смог найти аккаунт для пополнения.';
      case 'REQUEST_CONFLICT':
        return 'B2B получил конфликтный запрос на пополнение.';
      case 'REQUEST_TOO_MANY_REQUESTS':
        return 'B2B получил слишком много запросов на пополнение.';
      case 'REQUEST_INTERNAL_SERVER_ERROR':
        return 'B2B получил внутреннюю ошибку сервера.';
      case 'REQUEST_BAD_GATEWAY':
        return 'B2B получил плохой шлюз.';
      case 'REQUEST_SERVICE_UNAVAILABLE':
        return 'B2B получил недоступный сервис.';
      case 'REQUEST_GATEWAY_TIMEOUT':
        return 'B2B получил таймаут шлюза.';
      case 'PAYMENT_VERIFICATION_FAILED':
        return 'Невозможно пополнить текущий аккаунт';
      default:
        return 'Неизвестная ошибка B2B.';
    }
  }
}
