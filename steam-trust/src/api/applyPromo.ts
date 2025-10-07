import {$api} from "@/lib/api.instance";

export interface ApplyPromoReq {
   email: string
    code: string
}

export interface ApplyPromoResp {
    message?: string
    code?: string
    [key: string]: unknown
}

export const applyPromo = async (code: string, data: ApplyPromoReq): Promise<ApplyPromoResp> => {
    const res = await $api.request({
        method: 'POST',
        url: `/promocode/activate/${code}`,
        data: data
    });

    return res.data;
}