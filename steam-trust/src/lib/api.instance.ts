import axios, { CreateAxiosDefaults, AxiosError, AxiosResponse } from "axios";
import { SERVER_URL } from "@/config";

const baseConfig: CreateAxiosDefaults = {
    baseURL: `${SERVER_URL}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
};

export const $api = axios.create(baseConfig);

// Интерфейс для структурированной ошибки бекенда
export interface BackendError {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
}

export interface ApiErrorResponse {
    statusCode: number;
    timestamp: string;
    path: string;
    message: BackendError;
}

export interface ApiError extends ApiErrorResponse {
    originalError?: AxiosError;
    isApiError: boolean;
}

// Функция для создания структурированной ошибки
const createStructuredError = (error: AxiosError): ApiError => {
    // Если есть ответ от сервера с нашей структурой ошибки
    if (error.response?.data && typeof error.response.data === 'object') {
        const responseData = error.response.data as any;

        // Проверяем, соответствует ли структура нашему формату
        if (responseData.message && typeof responseData.message === 'object' &&
            'code' in responseData.message && 'message' in responseData.message) {

            return {
                statusCode: responseData.statusCode || error.response.status,
                timestamp: responseData.timestamp || new Date().toISOString(),
                path: responseData.path || error.config?.url || '',
                message: {
                    code: responseData.message.code,
                    message: responseData.message.message,
                    details: responseData.message.details,
                    timestamp: responseData.message.timestamp || new Date().toISOString()
                },
                originalError: error,
                isApiError: true
            };
        }
    }

    // Если структура не соответствует ожидаемой или это сетевая ошибка
    return {
        statusCode: error.response?.status || 0,
        timestamp: new Date().toISOString(),
        path: error.config?.url || '',
        message: {
            code: error.response?.status ? 'HTTP_ERROR' : 'NETWORK_ERROR',
            message: error.message || (error.response?.status ? `HTTP Error ${error.response.status}` : 'Network error occurred'),
            timestamp: new Date().toISOString()
        },
        originalError: error,
        isApiError: false
    };
};

// Интерцептор для обработки ошибок
$api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        const structuredError = createStructuredError(error);
        return Promise.reject(structuredError);
    }
);

// Утилиты для работы с ошибками
export const isApiError = (error: any): error is ApiError => {
    return error && typeof error === 'object' && error.isApiError !== undefined;
};

export default $api;