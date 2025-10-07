import { cache } from "react";
import {Payment} from "@/types/index";
import {$api} from "@/lib/api.instance"; 

export interface PaymentsHistoryParams {
    page?: number
    limit?: number
    status?: string
    email?: string
    account?: string
}

export interface PaymentsListResp {
    success: boolean
    data: {
        items: Payment[]
        total: number
        page: number
        limit: number
        pageCount: number
        hasPreviousPage: boolean
        hasNextPage: boolean
    }
}

export const getPayment = cache(async (params: PaymentsHistoryParams): Promise<PaymentsListResp> => {
    const res = await $api.request({
        method: 'GET',
        url: `/payment/payments/history`,
        params: params
    });

    return res.data;
})