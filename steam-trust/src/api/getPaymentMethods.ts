
import { PaymentMethod } from "@/types/index";
import {$api} from "@/lib/api.instance";

export interface PayMethodsParams {
    page?: number
    limit?: number
}

export interface PayMethodsResp {
    success: boolean
    data: {
        items: PaymentMethod[]
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

export const getPaymentMethods = async (params?: PayMethodsParams): Promise<PayMethodsResp> => {
    const res = await $api.request({
        method: 'GET',
        url: `/payment/methods`,
        params: params || {}
    });

    return res.data;
}