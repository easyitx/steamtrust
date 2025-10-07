'use client'
import React from 'react';

import cls from "./styles.module.scss"
import {Typography} from "@/components/ui/Text/Text";
import {getPrice} from "@/lib/getPrice";
import {Button} from "@/components/ui/Button/button";
import Image from "next/image";
import {PaymentMethod, CurrencyPair} from "@/types/index";
import {IFormData} from "@/lib/hooks/useSteamDepositForm";
import {ErrorFallback} from "@/components/ui/ErrorFallback/ErrorFallback";
import {useCurrencyRates} from "@/lib/hooks/useCurrencyRates";

interface Props {
    methodsFiat: PaymentMethod[];
    formData: IFormData
    handleMethodChange(method: PaymentMethod | null): void
    activeMethod: PaymentMethod | null;
    handleSubmitChange(): void
    loading: boolean
    isApplyPromo: boolean
    promoDiscount: number
}

export const PayMethodForm = ({
                                  loading,
                                  methodsFiat,
                                  formData,
                                  activeMethod,
                                  handleMethodChange,
                                  handleSubmitChange,
                                  isApplyPromo,
                                  promoDiscount
}: Props) => {
    const { rates, loading: ratesLoading, hasError: ratesHasError, fetchRates } = useCurrencyRates();

    const onSelectMethod = (method: PaymentMethod | null) => {
        handleMethodChange(method);
    }

    const costBank = (Number(formData.amount) * Number(activeMethod?.relativeProviderCommission) / 100) || 0;
    const serviceCoastPercent = isApplyPromo ? Number(activeMethod?.relativeCommission) - promoDiscount : Number(activeMethod?.relativeCommission) || 0;
    const costService = (Number(formData.amount) * serviceCoastPercent / 100);
    const totalAmount = (Number(formData.amount) + costBank + costService) || 0;

    // Запрашиваем курсы валют только когда есть сумма и выбран метод оплаты
    React.useEffect(() => {
        if (formData.amount && activeMethod && Number(formData.amount) > 0 && rates.length === 0 && !ratesLoading && !ratesHasError) {
            fetchRates();
        }
    }, [formData.amount, activeMethod, rates.length, ratesLoading, ratesHasError, fetchRates]);

    // Функция для конвертации суммы в разные валюты
    const getConvertedAmounts = (rubAmount: number) => {
        if (!rubAmount || rubAmount <= 0 || rates.length === 0) {
            return [{ currency: 'RUB', amount: rubAmount.toFixed(0) }];
        }

        const results: { currency: string; amount: string }[] = [
            { currency: 'RUB', amount: rubAmount.toFixed(0) }
        ];

        rates.forEach(rate => {
            const rateValue = parseFloat(rate.currency_rate);
            if (rate.pair === CurrencyPair.USD_RUB && rateValue > 0) {
                const usdAmount = rubAmount / rateValue;
                results.push({ currency: 'USD', amount: usdAmount.toFixed(2) });
            }
            if (rate.pair === CurrencyPair.EUR_RUB && rateValue > 0) {
                const eurAmount = rubAmount / rateValue;
                results.push({ currency: 'EUR', amount: eurAmount.toFixed(2) });
            }
        });

        return results;
    };

    const convertedAmounts = getConvertedAmounts(Number(formData.amount) || 0);
    const shouldShowCurrencies = formData.amount && activeMethod && Number(formData.amount) > 0 && !ratesHasError;

    const disable = React.useMemo(() => {
        if (!formData) return true
        if (!activeMethod) return true
        if (!formData.amount) return true;
        if (!formData.confirm) return true;
        if (!formData.email) return true;
        if (!formData.steamLogin) return true;
        if (totalAmount < activeMethod.min) return true;

        return false
    }, [activeMethod, formData.amount, formData.confirm, formData.email, formData.steamLogin])

    // Если нет методов оплаты, показываем fallback
    if (!methodsFiat || methodsFiat.length === 0) {
        return (
            <div className={cls.payMethodsForm}>
                <ErrorFallback 
                    title="Методы оплаты недоступны"
                    description="Не удалось загрузить способы оплаты. Попробуйте обновить страницу."
                />
            </div>
        );
    }

    return (
        <div className={cls.payMethodsForm}>
            <div className={cls.methodsList}>
                {methodsFiat
                    .sort((a, b) => {
                        // Определяем приоритет для каждого метода
                        const priorityOrder = {
                            'SBP': 1,
                            'BANK_CARD': 2,
                            'tron_usdt': 3,
                            'ethereum_usdt': 4,
                            'ton_usdt': 5
                        };

                        // @ts-ignore
                        const priorityA = priorityOrder[a.providerMethod] || 6;
                        // @ts-ignore
                        const priorityB = priorityOrder[b.providerMethod] || 6;

                        return priorityA - priorityB;
                    })
                    .map(method => (
                        <div className={`${cls.methodItem} ${activeMethod?.providerMethod === method.providerMethod ? cls.active : ''}`}
                             key={method._id}
                             onClick={() => onSelectMethod(method)}>
                            <div className={cls.label}>
                                <Typography className={cls.discount}>{method.relativeProviderCommission} %</Typography>
                                {method.providerMethod === "tron_usdt" && (
                                    <Typography className={cls.text}>
                                        TRC 20
                                    </Typography>
                                )}
                                {method.providerMethod === "ethereum_usdt" && (
                                    <Typography className={cls.text}>
                                        ETH
                                    </Typography>
                                )}
                                {method.providerMethod === "ton_usdt" && (
                                    <Typography className={cls.text}>
                                        TON
                                    </Typography>
                                )}
                            </div>

                            <Image className={cls.image}
                                   width={76}
                                   height={76}
                                   src={`/methods/${method.image}`}
                                   alt='pay method'/>
                        </div>
                    ))}
            </div>

            <div className={cls.payInfo}>
                <div className={cls.item}>
                    <Typography className={cls.text} weight='bold' size='2' wrap='nowrap'>
                        Будет зачислено
                    </Typography>
                    <div className={cls.hr}/>
                    <Typography className={cls.price} weight='bold' size='2' wrap='nowrap'>
                        {getPrice(formData.amount || "0")}
                    </Typography>
                </div>
                {shouldShowCurrencies && convertedAmounts.length > 1 && (
                    <div className={cls.item}>
                        <Typography className={cls.text} weight='bold' size='2' wrap='nowrap'>
                            В других валютах
                        </Typography>
                        <div className={cls.hr}/>
                        <Typography className={cls.price} weight='bold' size='2' wrap='nowrap'>
                            {convertedAmounts.map((amount, index) => (
                                <span key={amount.currency}>
                                    {amount.currency}: {amount.amount}
                                    {index < convertedAmounts.length - 1 ? ' | ' : ''}
                                </span>
                            ))}
                        </Typography>
                    </div>
                )}
                {isApplyPromo && promoDiscount && (
                    <div className={cls.item}>
                        <Typography className={cls.text} weight='bold' size='2' wrap='nowrap'>
                            Бонусы за промокод
                        </Typography>
                        <div className={cls.hr}/>
                        <Typography className={cls.price} weight='bold' size='2' wrap='nowrap'>
                            {String(promoDiscount)} %
                        </Typography>
                    </div>
                )}
                <div className={cls.item}>
                    <Typography className={cls.text} weight='bold' size='2' wrap='nowrap'>
                        Комиссия сервиса
                    </Typography>
                    <div className={cls.hr}/>
                    <Typography className={cls.price} weight='bold' size='2' wrap='nowrap'>
                        {getPrice(String(costService.toFixed(2)))}
                    </Typography>
                </div>

                <div className={cls.item}>
                    <Typography className={cls.text} weight='bold' size='2' wrap='nowrap'>
                        Банковские издержки
                    </Typography>
                    <div className={cls.hr}/>
                    <Typography className={cls.price} weight='bold' size='2' wrap='nowrap'>
                        {getPrice(String(costBank.toFixed(2)))}
                    </Typography>
                </div>

                <div className={cls.item}>
                    <Typography className={cls.text} weight='bold' size='2' wrap='nowrap'>
                        Всего к оплате
                    </Typography>
                    <div className={cls.hr}/>
                    <Typography className={cls.price} weight='bold' size='2' wrap='nowrap'>
                        {getPrice(String(totalAmount.toFixed(2)))}
                    </Typography>
                </div>

                {activeMethod && totalAmount < activeMethod.min && (
                    <div className={cls.item}>
                        <Typography className={cls.textDanger} weight='bold' size='2' wrap='nowrap'>
                            Минимальная сумма
                        </Typography>
                        <div className={cls.hr}/>
                        <Typography className={cls.priceDanger} weight='bold' size='2' wrap='nowrap'>
                            {getPrice(String(activeMethod?.min))}
                        </Typography>
                    </div>
                )}
            </div>

            <Button size='lg' fullWidth onClick={handleSubmitChange} disabled={disable}>
                {loading ? <Typography size='4'>Подождите...</Typography> : <Typography size='4'>Оплатить всего {getPrice(String(totalAmount.toFixed(2)))}</Typography>}
            </Button>
        </div>
    );
};