'use client'
import React from 'react';
import {PayForm} from "@/components/forms/PayForm";
import {PayMethodForm} from "@/components/forms/PayMethodForm/PayMethodForm";
import {PaymentMethod} from "@/types/index";
import {getPrice} from "@/lib/getPrice";
import {useSteamDepositForm} from "@/lib/hooks/useSteamDepositForm";

import cls from './styles.module.scss'

interface Props {
    methodsFiat: PaymentMethod[];
}

export const SteamDeposit = ({methodsFiat}: Props) => {
    const {
        formData,
        formErrors,
        activeMethod,
        loading,
        promoLoading,
        isApplyPromo,
        promoDiscount,
        setActiveMethod,
        handleInputChange,
        handleCheckboxChange,
        applyPromoCode,
        handleSubmit
    } = useSteamDepositForm({ methodsFiat });

    return (
        <div className={cls.steamDeposit}>
            <div className={cls.depositForm}>
                <PayForm
                    handleInputChange={handleInputChange}
                    handleCheckboxChange={handleCheckboxChange}
                    applyPromoCode={applyPromoCode}
                    promoLoading={promoLoading}
                    isApplyPromo={isApplyPromo}
                    formData={formData}
                    formErrors={formErrors}
                />
            </div>

            <div className={cls.paymentMethods}>
                <PayMethodForm
                    methodsFiat={methodsFiat}
                    formData={formData}
                    loading={loading}
                    activeMethod={activeMethod}
                    handleMethodChange={setActiveMethod}
                    handleSubmitChange={handleSubmit}
                    promoDiscount={promoDiscount}
                    isApplyPromo={isApplyPromo}
                />
            </div>
        </div>
    );
};