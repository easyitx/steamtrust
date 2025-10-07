import {$api} from "@/lib/api.instance";

export interface GetPromocodeResp {
    success: boolean
    data: {
        _id: string
        code: string
        bonusPercent: number
        createdAt: string
        updatedAt: string
    }
}

export const getPromocode = async (code: string): Promise<GetPromocodeResp> => {
    const res = await $api.request({
        method: 'GET',
        url: `/promocode/${code}`
    });

    return res.data;
} 