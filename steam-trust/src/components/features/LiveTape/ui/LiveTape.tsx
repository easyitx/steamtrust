'use client'
import React, {useEffect, useState} from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

import cls from "./styles.module.scss"
import {Typography} from "@/components/ui/Text/Text";
import {PageContent} from "@/components/ui/page/page";
import {Button} from "@/components/ui/Button/button";
import {getPrice} from "@/lib/getPrice";
import {Payment} from "@/types/index";
import {truncateString} from "@/lib/truncateString";
import {NoDataFallback} from "@/components/ui/ErrorFallback/ErrorFallback";
import {getPayment} from "@/api";

export const LiveTape = () => {
    const [data, setData] = useState<Payment[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getPayment({
                    page: 1,
                    limit: 10,
                    status: 'completed'
                });
                
                if (response.success && response.data?.items) {
                    setData(prevData => {
                        if (JSON.stringify(prevData) !== JSON.stringify(response.data.items)) {
                            return response.data.items;
                        }
                        return prevData;
                    });
                }
            } catch (error) {
                console.error('Ошибка загрузки истории платежей:', error);
                // Компонент продолжает работать с пустым массивом
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={cls.liveTape}>
            <PageContent>
                <div className={cls.title}>
                    <div className={cls.pointBorder}>
                        <div className={cls.point}/>
                    </div>
                    <Typography weight='extra' size='6' as='h2'>Недавние пополнения</Typography>
                </div>

                <div className={cls.list}>
                    {data && data.length > 0 ? (
                        data.map((item: Payment, index: number) => {
                            const createdAt = new Date(item.createdAt);
                            const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true, locale: ru });
                            return (
                                <div className={cls.item} key={item._id}>
                                    <Typography weight='extra' size='2'>{truncateString(item.account)}***</Typography>
                                    <Typography weight='light' size='1'>пополнил кошелек Steam</Typography>

                                    <div className={cls.bottom}>
                                        <Button size='sm'>{getPrice(item.amount)}</Button>
                                        <Typography weight='light' size='1'>{timeAgo}</Typography>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <NoDataFallback message="История пополнений временно недоступна" />
                    )}
                </div>
            </PageContent>
        </div>
    );
};