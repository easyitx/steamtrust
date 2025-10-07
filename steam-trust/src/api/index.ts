// Экспорт всех API методов
export { createPay } from './createPay';
export { getPayment } from './getPayment';  
export { applyPromo } from './applyPromo';
export { getPaymentMethods } from './getPaymentMethods';
export { getPromocode } from './getPromocode';
export { getCurrencyRates } from './getCurrencyRates';

// Экспорт типов для удобства
export type { CreatePayReq, CreatePayResp } from './createPay';
export type { PaymentsHistoryParams, PaymentsListResp } from './getPayment';
export type { PayMethodsParams, PayMethodsResp } from './getPaymentMethods';
export type { GetPromocodeResp } from './getPromocode';
export type { ApplyPromoReq, ApplyPromoResp } from './applyPromo';
export type { GetCurrencyRatesParams } from './getCurrencyRates'; 