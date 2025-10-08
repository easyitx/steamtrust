import axios from 'axios';
import type { TransactionQueryParams, TransactionResponse, CreatePromocodeRequest, PromocodesListResponse, PromocodesListParams } from '../types/api';

// Получаем базовый URL из переменных окружения
const baseURL = import.meta.env.VITE_API_URL || 'https://api.steamtrust.ru';

// Создаем axios инстанс с базовым URL
const api = axios.create({
  baseURL: `${baseURL}/api`,
  timeout: 10000, // 10 секунд таймаут
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для запросов (добавление токена авторизации если нужно)
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для ответов (обработка ошибок)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Обработка ошибок
    if (error.response?.status === 401) {
      // Обработка неавторизованного доступа
      console.error('Unauthorized access');
      // Можно добавить редирект на страницу логина
    }
    
    if (error.response?.status === 500) {
      console.error('Server error');
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Экспорт типизированных методов API
export const apiService = {
  // Методы для работы с балансом
  getBalance: () => api.get('/b2b/user/balance'),
  
  // Методы для работы с платежами
  getPayments: (params?: any) => api.get('/payments', { params }),
  getPaymentsHistory: (params?: any) => api.get('/payment/payments/history', { params }),
  
  // Методы для работы с транзакциями
  getTransactions: (params?: TransactionQueryParams) => api.get<TransactionResponse>('/b2b/transactions', { params }),
  executePayment: (transactionCode: string) => api.post(`/b2b/payment/execute/${transactionCode}`),
  
  // Методы для работы с промокодами
  getPromocodes: (params?: PromocodesListParams) => api.get<PromocodesListResponse>('/promocode/list', { params }),
  createPromocode: (data: CreatePromocodeRequest) => api.post('/promocode/create', data),
  updatePromocode: (id: string, data: CreatePromocodeRequest) => api.put(`/promocode/${id}`, data),
  getPromocode: (code: string) => api.get(`/promocode/${code}`),
  
  // Методы для работы с методами оплаты
  getPaymentMethods: (params?: any) => api.get('/payment/methods', { params }),
  updatePaymentMethod: (id: string, data: any) => api.put(`/payment/methods/${id}`, data),
  createPaymentMethod: (data: any) => api.post('/payment/methods', data),
  
  // Общие методы
  get: (url: string, config?: any) => api.get(url, config),
  post: (url: string, data?: any, config?: any) => api.post(url, data, config),
  put: (url: string, data?: any, config?: any) => api.put(url, data, config),
  delete: (url: string, config?: any) => api.delete(url, config),
};