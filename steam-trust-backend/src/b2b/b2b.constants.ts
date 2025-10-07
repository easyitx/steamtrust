// Константы для B2B API G-Engine 2.0

export const B2B_CONFIG = {
  API_URL: 'https://api.g-engine.net/v2.1',
  TIMEOUT: 60000,
};

export const B2B_ENDPOINTS = {
  AUTH_TOKEN: '/auth/token',
  USER_BALANCE: '/users/balance',
  TRANSACTIONS: '/transactions',
  CURRENCIES: '/currencies',
  PAYMENT_VERIFY: '/payments',
  PAYMENT_EXECUTE: '/payments',
  PAYMENT_STATUS: '/payments',
};

export const B2B_SERVICE_IDS = {
  STEAM_TRUST: parseInt(process.env.B2B_STEAM_TRUST_SERVICE_ID || '92'), // Основной сервис Steam Trust
};

export const B2B_CURRENCIES = {
  RUB: 'RUB',
  USD: 'USD',
  EUR: 'EUR',
};

export const B2B_DEFAULTS = {
  LIMIT: parseInt(process.env.B2B_DEFAULT_LIMIT || '100'),
  OFFSET: parseInt(process.env.B2B_DEFAULT_OFFSET || '0'),
  SORT_BY: process.env.B2B_DEFAULT_SORT_BY || 'date',
  SORT_ORDER: process.env.B2B_DEFAULT_SORT_ORDER || 'desc',
  USER_CACHE: process.env.B2B_USER_CACHE === 'true',
};
