import useNotificationStore from "@/types/notification/model";
import { isApiError, ApiError } from "@/lib/api.instance";

// Функция для обработки ошибок API с автоматическим отображением уведомлений
export const handleApiError = (error: unknown): void => {
    const { show } = useNotificationStore.getState();

    if (isApiError(error)) {
        const apiError = error as ApiError;
        const { message, details, code } = apiError.message;

        switch (code) {
            case 'B2B_VERIFICATION_FAILED':
                show({
                    type: 'error',
                    message: `Ошибка B2B: ${details?.b2bStatusCode}`,
                    description: `${details?.reason} ${details?.account}`,
                });
                break;

            case 'B2B_REQUEST_REJECTED':
                show({
                    type: 'error',
                    message: 'Ошибка B2B',
                    description: `${details?.reason}`
                });
                break;

            case 'PAYMENT_METHOD_INACTIVE':
                show({
                    type: 'error',
                    message: 'Неактивный метод оплаты',
                    description: `Метод оплаты ${details?.methodId} временно не доступен`
                });
                break;

            case 'PAYMENT_AMOUNT_TOO_LOW':
                show({
                    type: 'warning',
                    message: 'Сумма слишком мала',
                    description: `Минимальная сумма для оплаты: ${details?.minAmount}`
                });
                break;

            case 'PAYMENT_AMOUNT_TOO_HIGH':
                show({
                    type: 'warning',
                    message: 'Сумма слишком велика',
                    description: `Максимальная сумма для оплаты: ${details?.maxAmount}`
                });
                break;

            case 'DAILY_LIMIT_EXCEEDED':
                show({
                    type: 'warning',
                    message: 'Превышен лимит',
                    description: `Дневной лимит операций превышен. Лимит: ${details?.limit}`
                });
                break;

            case 'TOO_MANY_ACTIVE_PAYMENTS':
                show({
                    type: 'warning',
                    message: 'Слишком много операций',
                    description: `Максимальное количество активных операций: ${details?.maxCount}`
                });
                break;

            case 'VALIDATION_ERROR':
                show({
                    type: 'error',
                    message: 'Ошибка валидации',
                    description: 'Проверьте правильность введенных данных'
                });
                break;

            case 'NOT_FOUND':
                show({
                    type: 'error',
                    message: 'Не найдено',
                    description: 'Запрашиваемый ресурс не найден'
                });
                break;

            case 'UNAUTHORIZED':
                show({
                    type: 'error',
                    message: 'Не авторизован',
                    description: 'Требуется авторизация для выполнения операции'
                });
                break;

            case 'PAYMENT_METHOD_NOT_FOUND':
                show({
                    type: 'error',
                    message: 'Метод оплаты не найден',
                    description: `Метод оплаты ${details?.methodId} не существует`
                });
                break;

            case 'PROMOCODE_NOT_FOUND':
                show({
                    type: 'warning',
                    message: 'Промокод не найден',
                    description: `Промокод "${details?.promocode}" не действителен`
                });
                break;

            case 'PROMOCODE_ALREADY_USED':
                show({
                    type: 'warning',
                    message: 'Промокод уже использован',
                    description: `Промокод "${details?.promocode}" уже был использован`
                });
                break;

            case 'WEBHOOK_SIGNATURE_INVALID':
                show({
                    type: 'error',
                    message: 'Неверная подпись',
                    description: `Недействительная подпись для провайдера: ${details?.provider}`
                });
                break;

            default:
                // Для всех остальных ошибок показываем общее сообщение
                show({
                    type: 'error',
                    message: 'Ошибка',
                    description: message || 'Произошла неизвестная ошибка'
                });
        }
    } else if (error instanceof Error) {
        // Обработка обычных JavaScript ошибок
        show({
            type: 'error',
            message: 'Ошибка',
            description: error.message || 'Произошла неизвестная ошибка'
        });
    } else {
        // Неизвестная ошибка
        show({
            type: 'error',
            message: 'Ошибка',
            description: 'Произошла неизвестная ошибка'
        });
    }
};

// Дополнительная утилита для обработки ошибок в async функциях с автоматическим уведомлением
export const withErrorHandling = async <T>(
    operation: () => Promise<T>,
    customErrorHandler?: (error: unknown) => void
): Promise<T | null> => {
    try {
        return await operation();
    } catch (error) {
        if (customErrorHandler) {
            customErrorHandler(error);
        } else {
            handleApiError(error);
        }
        return null;
    }
};