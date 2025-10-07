import { PaymentProvider } from '../pay.schema';

export interface PaymentMethod {
  providerMethod: string;
  provider: PaymentProvider;
  fromCurrencyCode: string;
  toCurrencyCode: string;
  min: number;
  max: number;
  relativeCommission: number;
  relativeProviderCommission: number;
  image?: string;
}

export const methods: PaymentMethod[] = [
  {
    providerMethod: 'tron_usdt',
    provider: PaymentProvider.cryptopay,
    fromCurrencyCode: 'tron', // network
    toCurrencyCode: 'usdt', // token
    min: 100,
    max: 15000,
    relativeCommission: 2.5,
    relativeProviderCommission: 0.4,
    image: 'usdt.svg',
  },
  {
    providerMethod: 'tron_trx',
    provider: PaymentProvider.cryptopay,
    fromCurrencyCode: 'tron', // network
    toCurrencyCode: 'trx', // token
    min: 100,
    max: 15000,
    relativeCommission: 2.5,
    relativeProviderCommission: 0.4,
    image: 'trx.svg',
  },
  {
    providerMethod: 'ethereum_usdt',
    provider: PaymentProvider.cryptopay,
    fromCurrencyCode: 'ethereum', // network
    toCurrencyCode: 'usdt', // token
    min: 100,
    max: 15000,
    relativeCommission: 2.5,
    relativeProviderCommission: 0.4,
    image: 'usdt.svg',
  },
  {
    providerMethod: 'ethereum_eth',
    provider: PaymentProvider.cryptopay,
    fromCurrencyCode: 'ethereum', // network
    toCurrencyCode: 'eth', // token
    min: 100,
    max: 15000,
    relativeCommission: 2.5,
    relativeProviderCommission: 0.4,
    image: 'eth.svg',
  },
  {
    providerMethod: 'ton_usdt',
    provider: PaymentProvider.cryptopay,
    fromCurrencyCode: 'ton', // network
    toCurrencyCode: 'usdt', // token
    min: 100,
    max: 15000,
    relativeCommission: 2.5,
    relativeProviderCommission: 0.4,
    image: 'usdt.svg',
  },
  {
    providerMethod: 'ton_ton',
    provider: PaymentProvider.cryptopay,
    fromCurrencyCode: 'ton', // network
    toCurrencyCode: 'ton', // token
    min: 100,
    max: 15000,
    relativeCommission: 2.5,
    relativeProviderCommission: 0.4,
    image: 'ton.svg',
  },
  {
    providerMethod: 'bitcoin_btc',
    provider: PaymentProvider.cryptopay,
    fromCurrencyCode: 'bitcoin', // network
    toCurrencyCode: 'btc', // token
    min: 100,
    max: 15000,
    relativeCommission: 2.5,
    relativeProviderCommission: 0.4,
    image: 'btc.svg',
  },
];
