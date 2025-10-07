import {$api} from "@/lib/api.instance";
import {withErrorHandling} from "@/lib/error";
import {AxiosResponse} from "axios";

export interface CreatePayReq {
    amount: string
    methodCode: string
    account: string
    email: string
    meta?: string
}

export interface CreatePayResp {
    data: {
        paymentLink: string;
    };
}

export const createPay = async (data: CreatePayReq): Promise<AxiosResponse<CreatePayResp> | null> => {
    return await withErrorHandling<AxiosResponse<CreatePayResp>>(
        () => $api.request({
            method: 'POST',
            url: `/payment/fiat/pay`,
            data: data
        })
    );
};