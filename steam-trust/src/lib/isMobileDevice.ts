import {headers} from "next/headers";

export async function isMobileDevice(): Promise<boolean> {
    // Получаем user-agent из заголовков запроса
    const userAgent = (await headers()).get('user-agent') || '';
    return /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent);
}