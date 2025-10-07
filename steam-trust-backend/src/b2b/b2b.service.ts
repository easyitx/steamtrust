import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ResponseBaseAPI,
  WalletResponse,
  CurrencyRateResponse,
  ConvertCurrencyResponse,
  PaginationResponse,
  TransactionCreateAPI,
  Currency,
  PaymentExecuteResponse,
  PayResponse,
  TransactionResponse,
  TransactionQueryParams,
} from './b2b.dto';
import {
  B2B_CONFIG,
  B2B_ENDPOINTS,
  B2B_SERVICE_IDS,
  B2B_CURRENCIES,
  B2B_DEFAULTS,
} from './b2b.constants';
import { CustomException } from '@app/common';

@Injectable()
export class B2bService {
  private readonly logger = new Logger(B2bService.name);
  private readonly httpClient: AxiosInstance;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>(
      'B2B_API_KEY',
      'xp4nr70cc8diwwzwhz64hv35x5tp8bkg',
    );

    this.httpClient = axios.create({
      baseURL: B2B_CONFIG.API_URL,
      timeout: B2B_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey, // Добавлен API ключ в заголовки
      },
    });

    // Добавляем interceptor для автоматического обновления токена
    this.httpClient.interceptors.request.use(async (config) => {
      return config;
    });
  }

  /**
   * Получение баланса пользователя
   */
  async getBalance(): Promise<ResponseBaseAPI<WalletResponse[]>> {
    try {
      const response: AxiosResponse<ResponseBaseAPI<WalletResponse[]>> =
        await this.httpClient.get(B2B_ENDPOINTS.USER_BALANCE);

      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to get user balance: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  /**
   * Получение списка транзакций
   */
  async getTransactions(
    params: TransactionQueryParams = {},
  ): Promise<ResponseBaseAPI<PaginationResponse<TransactionResponse>>> {
    try {
      const queryParams = {
        limit: B2B_DEFAULTS.LIMIT,
        offset: B2B_DEFAULTS.OFFSET,
        sort_by: B2B_DEFAULTS.SORT_BY,
        sort_order: B2B_DEFAULTS.SORT_ORDER,
        ...params,
      };

      const response: AxiosResponse<
        ResponseBaseAPI<PaginationResponse<TransactionResponse>>
      > = await this.httpClient.get(B2B_ENDPOINTS.TRANSACTIONS, {
        params: queryParams,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to get transactions list: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  /**
   * Получение всех курсов валют
   */
  async getAllCurrencies(): Promise<ResponseBaseAPI<CurrencyRateResponse[]>> {
    try {
      const response: AxiosResponse<ResponseBaseAPI<CurrencyRateResponse[]>> =
        await this.httpClient.get(B2B_ENDPOINTS.CURRENCIES);

      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to get currency rates: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  /**
   * Конвертация валют
   */
  async convertCurrency(
    fromCurrency: Currency,
    toCurrency: Currency,
    amount: number | string,
  ): Promise<ResponseBaseAPI<ConvertCurrencyResponse>> {
    try {
      this.logger.debug(
        `Converting ${amount} ${fromCurrency} to ${toCurrency}`,
      );

      const response: AxiosResponse<ResponseBaseAPI<ConvertCurrencyResponse>> =
        await this.httpClient.get(
          `${B2B_ENDPOINTS.CURRENCIES}/${fromCurrency}:${toCurrency}/${amount}`,
        );

      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to convert currency: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  /**
   * Верификация платежа
   */
  async paymentVerify(
    code: string,
    account: string,
    amount: number | string,
    currency: Currency = B2B_CURRENCIES.RUB as Currency,
  ): Promise<ResponseBaseAPI<PayResponse>> {
    try {
      const verifyData: TransactionCreateAPI = {
        code: code,
        account: account.trim(),
        amount: amount,
        currency: currency,
      };

      const response: AxiosResponse<ResponseBaseAPI<PayResponse>> =
        await this.httpClient.post(
          `${B2B_ENDPOINTS.PAYMENT_VERIFY}?service_id=${B2B_SERVICE_IDS.STEAM_TRUST}`,
          verifyData,
        );

      return response.data;
    } catch (error: any) {
      console.error(error);
      console.log(error.response?.data || error);
      if (error.response?.data) {
        const validationError = error.response.data;
        throw CustomException.b2bRequestRejected(
          account,
          validationError.message,
        );
      }

      throw error;
    }
  }

  /**
   * Выполнение платежа
   */
  async paymentExecute(code: string): Promise<PaymentExecuteResponse> {
    try {
      const response: AxiosResponse<ResponseBaseAPI<PaymentExecuteResponse>> =
        await this.httpClient.post(
          `${B2B_ENDPOINTS.PAYMENT_EXECUTE}/${code}/execute`,
        );

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Получение статуса платежа
   */
  async getPaymentStatus(code: string): Promise<ResponseBaseAPI<PayResponse>> {
    try {
      const response: AxiosResponse<ResponseBaseAPI<PayResponse>> =
        await this.httpClient.get(`${B2B_ENDPOINTS.PAYMENT_STATUS}/${code}`);

      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed get status: ${error.response?.data?.message || error.message}`,
      );
    }
  }
}
