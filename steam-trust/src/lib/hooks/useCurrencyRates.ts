import { useState, useCallback } from 'react';
import { getCurrencyRates, GetCurrencyRatesParams } from '@/api';
import { CurrencyRate, RateSource, CurrencyPair } from '@/types';

interface UseCurrencyRatesReturn {
    rates: CurrencyRate[];
    loading: boolean;
    error: string | null;
    hasError: boolean;
    fetchRates: () => Promise<void>;
}

export const useCurrencyRates = (): UseCurrencyRatesReturn => {
    const [rates, setRates] = useState<CurrencyRate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);

    const fetchRates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setHasError(false);
            
            // // Получаем курсы для всех нужных валютных пар
            // const ratesPromises = [
            //     getCurrencyRates({ source: RateSource.CB_RF, pair: CurrencyPair.USD_RUB }),
            //     getCurrencyRates({ source: RateSource.CB_RF, pair: CurrencyPair.EUR_RUB }),
            // ];
            //
            // const responses = await Promise.allSettled(ratesPromises);
            // const allRates: CurrencyRate[] = [];
            //
            // responses.forEach((response) => {
            //     if (response.status === 'fulfilled' && response.value.success) {
            //         allRates.push(...response.value.data);
            //     }
            // });
            //
            // // Если не удалось получить ни одного курса, считаем это ошибкой
            // if (allRates.length === 0) {
            //     setHasError(true);
            //     setError('Курсы валют временно недоступны');
            // } else {
            //     setRates(allRates);
            // }
        } catch (err) {
            setHasError(true);
            setError('Курсы валют временно недоступны');
            console.error('Currency rates fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        rates,
        loading,
        error,
        hasError,
        fetchRates,
    };
}; 