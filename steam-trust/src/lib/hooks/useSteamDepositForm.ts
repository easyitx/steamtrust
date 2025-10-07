'use client'
import { useState } from 'react';
import { PaymentMethod } from '@/types/index';
import { createPay } from '@/api/createPay';
import { applyPromo } from '@/api/applyPromo';
import { useNotificationActions } from '@/types/notification/model';
import { isEmail } from '@/lib/isEmail';

export interface IFormData {
    steamLogin: string;
    email: string;
    amount: string;
    confirm: boolean;
    promocode: string;
}

export interface IFormErrors {
    steamLogin?: string;
    email?: string;
    amount?: string;
}

interface UseSteamDepositFormProps {
    methodsFiat: PaymentMethod[];
}

export const useSteamDepositForm = ({ methodsFiat }: UseSteamDepositFormProps) => {
    const [activeMethod, setActiveMethod] = useState<PaymentMethod | null>(
        methodsFiat.length > 0 ? methodsFiat[0] : null
    );
    const [loading, setLoading] = useState(false);
    const [promoLoading, setPromoLoading] = useState(false);
    const [isApplyPromo, setIsApplyPromo] = useState(false);
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [formErrors, setFormErrors] = useState<IFormErrors>({});
    const { show } = useNotificationActions();

    const [formData, setFormData] = useState<IFormData>({
        steamLogin: '',
        email: '',
        amount: '',
        confirm: false,
        promocode: ''
    });

    const validateSteamLogin = (value: string): string | undefined => {
        if (!value.trim()) return undefined;

        if (value.length < 3) {
            return 'Логин должен содержать минимум 3 символа';
        }
        if (value.length > 100) {
            return 'Логин не может содержать более 100 символов';
        }
        return undefined;
    };

    const validateEmail = (value: string): string | undefined => {
        if (!value.trim()) return undefined;
        if (!isEmail(value)) {
            return 'Введите корректный email адрес';
        }
        return undefined;
    };

    const validateAmount = (value: string): string | undefined => {
        if (!value.trim()) return undefined;
        
        const amount = Number(value);
        if (isNaN(amount) || amount <= 0) {
            return 'Введите корректную сумму';
        }
        if (activeMethod) {
            if (amount < activeMethod.min) {
                return `Минимальная сумма: ${activeMethod.min} ₽`;
            }
            if (amount > activeMethod.max) {
                return `Максимальная сумма: ${activeMethod.max} ₽`;
            }
        }
        return undefined;
    };

    const handleInputChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value
        });

        // Валидация в реальном времени
        let error: string | undefined;
        if (name === 'steamLogin') {
            error = validateSteamLogin(value);
        } else if (name === 'email') {
            error = validateEmail(value);
        } else if (name === 'amount') {
            error = validateAmount(value);
        }

        setFormErrors({
            ...formErrors,
            [name]: error
        });
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData({
            ...formData,
            confirm: checked
        });
    };

    const applyPromoCode = async () => {
        if (!formData.email) {
            show({
                type: 'error',
                message: 'Заполните поля!',
                description: `Введите email`
            });
            return;
        }

        if (!formData.promocode) {
            show({
                type: 'error',
                message: 'Заполните поля!',
                description: `Введите промокод`
            });
            return;
        }

        setPromoLoading(true);
        try {
            const result = await applyPromo(formData.promocode, {
                email: formData.email,
                code: formData.promocode
            });

            console.log(result)

            if (result) {
                // Предполагаем что в данных есть информация о скидке
                setPromoDiscount(Number(result.bonusPercent) || 0);
                setIsApplyPromo(true);
                show({
                    type: 'success',
                    message: 'Промокод применен!',
                    description: `Скидка ${result.bonusPercent || 0}%`
                });
            }
        } catch (error) {
            show({
                type: 'error',
                message: 'Ошибка',
                description: 'Не удалось применить промокод'
            });
        } finally {
            setPromoLoading(false);
        }
    };

    const handleSubmit = async () => {
        // Проверка обязательных полей
        if (!formData.steamLogin.trim()) {
            show({
                type: 'error',
                message: 'Не указан логин Steam',
                description: 'Введите ваш логин Steam аккаунта'
            });
            return;
        }

        if (!formData.email.trim()) {
            show({
                type: 'error',
                message: 'Не указан email',
                description: 'Введите ваш email адрес'
            });
            return;
        }

        if (!formData.amount.trim()) {
            show({
                type: 'error',
                message: 'Не указана сумма',
                description: 'Введите сумму для пополнения'
            });
            return;
        }

        if (!formData.confirm) {
            show({
                type: 'error',
                message: 'Требуется подтверждение',
                description: 'Подтвердите, что указали верный логин Steam'
            });
            return;
        }

        // Валидация email
        if (!isEmail(formData.email)) {
            show({
                type: 'error',
                message: 'Некорректный email',
                description: 'Введите корректный email адрес'
            });
            return;
        }

        if (formData.steamLogin.length < 3) {
            show({
                type: 'error',
                message: 'Слишком короткий логин Steam',
                description: 'Логин должен содержать минимум 3 символа'
            });
            return;
        }

        if (formData.steamLogin.length > 100) {
            show({
                type: 'error',
                message: 'Слишком длинный логин Steam',
                description: 'Логин не может содержать более 100 символов'
            });
            return;
        }

        // Валидация суммы
        const amount = Number(formData.amount);
        if (isNaN(amount) || amount <= 0) {
            show({
                type: 'error',
                message: 'Некорректная сумма',
                description: 'Введите корректную сумму для пополнения'
            });
            return;
        }

        if (!activeMethod) {
            show({
                type: 'error',
                message: 'Методы оплаты недоступны',
                description: 'Способы оплаты не загружены. Попробуйте обновить страницу.'
            });
            return;
        }

        // Проверка лимитов метода платежа
        if (amount < activeMethod.min) {
            show({
                type: 'error',
                message: 'Сумма слишком мала',
                description: `Минимальная сумма: ${activeMethod.min} ₽`
            });
            return;
        }

        if (amount > activeMethod.max) {
            show({
                type: 'error',
                message: 'Сумма слишком велика',
                description: `Максимальная сумма: ${activeMethod.max} ₽`
            });
            return;
        }

        setLoading(true);
        try {
            const result = await createPay({
                amount: formData.amount,
                methodCode: activeMethod.providerMethod,
                account: formData.steamLogin,
                email: formData.email
            });

            if (result?.data?.data?.paymentLink) {
                window.location.href = result.data.data.paymentLink;
            }
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return {
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
    };
}; 