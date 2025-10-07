import { CurrencyRatesResponse, RateSource, CurrencyPair } from "@/types/index";
import { $api } from "@/lib/api.instance";

export interface GetCurrencyRatesParams {
    source?: RateSource;
    pair?: CurrencyPair;
}

export const getCurrencyRates = async (params?: GetCurrencyRatesParams): Promise<CurrencyRatesResponse> => {
    const res = await $api.request({
        method: 'GET',
        url: `/b2b/currencies`,
        params: params || {}
    });

    return res.data;
}; 