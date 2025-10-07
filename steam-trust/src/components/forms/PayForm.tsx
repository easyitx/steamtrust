'use client'
import React, { useState } from 'react';

import cls from "./styles.module.scss"
import Image from "next/image";
import {Typography} from "@/components/ui/Text/Text";
import {Input} from "@/components/ui/Input/input";
import {CheckboxSection} from "@/components/ui/Checkbox/checkbox";
import Link from "next/link";
import {RussianRuble, TicketPercent, TriangleAlert} from "lucide-react";
import {Button} from "@/components/ui/Button/button";
import {getPrice} from "@/lib/getPrice";
import {useDevice} from "@/lib/useDeviceType";
import {IFormData, IFormErrors} from "@/lib/hooks/useSteamDepositForm";
import {RulesModal} from "@/components/forms/rules/ui/RulesModal/RulesModal";

interface Props {
    handleInputChange: (name: string, value: string) => void
    handleCheckboxChange: (checked: boolean) => void
    applyPromoCode: () => void
    promoLoading: boolean
    isApplyPromo: boolean
    formData: IFormData
    formErrors: IFormErrors
}

export const PayForm = ({
                            handleInputChange,
                            handleCheckboxChange,
                            formData,
                            formErrors,
                            promoLoading,
                            applyPromoCode,
                            isApplyPromo
}: Props) => {
    const { isMobile } = useDevice();

    const onHandleInputChange = (name: string, value: string) => {
        handleInputChange(name, value);
    };

    return (
        <div className={cls.payForm}>
            <div className={cls.title}>
                <Image src="/icon/steam.svg" alt='steam icon' width={24} height={24}/>
                <Typography weight='bold' size='6' as='h1'>Пополнение Steam</Typography>
            </div>

            <div className={cls.form}>
                <Typography as='div' className={cls.label} weight='bold' size='2'>
                    Ваши данные
                </Typography>

                <div className={cls.fields}>
                    <div className={cls.steamNameInput}>
                        <Input
                            name="steamLogin"
                            placeholder='Логин Steam '
                            value={formData.steamLogin}
                            onChange={(e) => onHandleInputChange('steamLogin', e.target.value)}
                        />
                        {formErrors.steamLogin && (
                            <Typography size='1' color='error' className={cls.errorText}>
                                {formErrors.steamLogin}
                            </Typography>
                        )}

                        <div className={cls.steamNameInputLabel}>
                            <Link href='https://store.steampowered.com/account' target='_blank'>
                                <Typography size='1' weight='bold'>Где взять логин?</Typography>
                            </Link>
                        </div>
                    </div>

                    <div className={cls.emailInput}>
                        <Input
                            name="email"
                            placeholder='Ваш Email'
                            type="email"
                            value={formData.email}
                            onChange={(e) => onHandleInputChange('email', e.target.value)}
                        />
                        {formErrors.email && (
                            <Typography size='1' color='error' className={cls.errorText}>
                                {formErrors.email}
                            </Typography>
                        )}
                    </div>
                </div>

                <div className={cls.confirm}>
                    <CheckboxSection
                        checked={formData.confirm}
                        label={'Я подтверждаю, что указал верный логин Steam и понимаю, что средства будут зачислены на указанный аккаунт'}
                        setChecked={handleCheckboxChange}
                    />
                </div>

                <Typography as='div' className={cls.label2} weight='bold' size='2'>
                    Сумма
                </Typography>

                <div className={cls.fields}>
                    <div className={cls.summInput}>
                        <Input
                            name="amount"
                            placeholder='Сумма'
                            className={cls.input}
                            value={formData.amount}
                            onChange={(e) => onHandleInputChange('amount', e.target.value)}
                        />

                        <div className={cls.icon}>
                            <RussianRuble color='var(--green)' size='15'/>
                        </div>
                    </div>
                    {formErrors.amount && (
                        <Typography size='1' color='error' className={cls.errorText}>
                            {formErrors.amount}
                        </Typography>
                    )}

                    <div className={cls.placeholders}>
                        {isMobile ? (
                            <>
                                <Button size='l' variant={formData.amount === '150' ? 'default' : 'secondary'} fullWidth
                                        onClick={() => onHandleInputChange('amount', '150')}>{getPrice("150")}</Button>
                                <Button size='l' variant={formData.amount === '200' ? 'default' : 'secondary'} fullWidth
                                        onClick={() => onHandleInputChange('amount', '200')}>{getPrice("200")}</Button>
                                <Button size='l' variant={formData.amount === '500' ? 'default' : 'secondary'} fullWidth
                                        onClick={() => onHandleInputChange('amount', '500')}>{getPrice("500")}</Button>
                                <Button size='l' variant={formData.amount === '1000' ? 'default' : 'secondary'}
                                        fullWidth
                                        onClick={() => onHandleInputChange('amount', '1000')}>{getPrice("1000")}</Button>
                            </>
                        ) : (
                            <>
                                <Button size='l' variant={formData.amount === '150' ? 'default' : 'secondary'} fullWidth
                                        onClick={() => onHandleInputChange('amount', '150')}>{getPrice("150")}</Button>
                                <Button size='l' variant={formData.amount === '200' ? 'default' : 'secondary'} fullWidth
                                        onClick={() => onHandleInputChange('amount', '200')}>{getPrice("200")}</Button>
                                <Button size='l' variant={formData.amount === '500' ? 'default' : 'secondary'} fullWidth
                                        onClick={() => onHandleInputChange('amount', '500')}>{getPrice("500")}</Button>
                                <Button size='l' variant={formData.amount === '1000' ? 'default' : 'secondary'}
                                        fullWidth
                                        onClick={() => onHandleInputChange('amount', '1000')}>{getPrice("1000")}</Button>
                                <Button size='l' variant={formData.amount === '2000' ? 'default' : 'secondary'}
                                        fullWidth
                                        onClick={() => onHandleInputChange('amount', '2000')}>{getPrice("2000")}</Button>
                                <Button size='l' variant={formData.amount === '5000' ? 'default' : 'secondary'}
                                        fullWidth
                                        onClick={() => onHandleInputChange('amount', '5000')}>{getPrice("5000")}</Button>
                            </>
                        )}
                    </div>

                    <RulesModal/>
                </div>

                <div className={cls.promocode}>
                    <div className={cls.title}>
                        <Image width={24} height={24} src="/icon/promo.svg" alt='promo code'/>
                        <Typography size='6'>Промокод</Typography>
                    </div>

                    <div className={cls.promoInput}>
                        <Input
                            disabled={isApplyPromo}
                            name="promocode"
                            className={cls.input}
                            placeholder='Введите код'
                            value={formData.promocode}
                            onChange={(e) => onHandleInputChange('promocode', e.target.value)}
                        />

                        <Button className={cls.button} size='sm' disabled={promoLoading || isApplyPromo}
                                onClick={applyPromoCode}>
                            <Typography weight='regular' size='1'>
                                {isApplyPromo ? "Применен" : "Применить"}
                            </Typography>
                        </Button>
                    </div>
                </div>
            </div>

            {/* <Link
                href='https://unboxcs.io/?p=CvkMBkFT'
                target='_blank'
                rel='noreferrer noopener'
                aria-label='Перейти на Unbox'
            >
                <div className={cls.banner}>
                    <img
                        className={cls.bannerImage}
                        src="/banner.png"
                        alt='Рекламный баннер Unbox'
                        loading='lazy'
                    />
                </div>
            </Link> */}
        </div>
    );
};