'use client'
import React, { useEffect, useState } from 'react';
import { Radio } from "lucide-react";
import { Typography } from "@/components/ui/Text/Text";
import cls from "./styles.module.scss"

export const OnlineUsers = () => {
    const [onlineCount, setOnlineCount] = useState(0);

    const getFakeOnlineCount = () => {
        const now = new Date();
        const hours = now.getHours();

        let baseOnline;

        if (hours >= 6 && hours < 12) { // Утро
            baseOnline = 8; // Средний онлайн утром
        } else if (hours >= 12 && hours < 18) { // День
            baseOnline = 20; // Средний онлайн днем
        } else if (hours >= 18 && hours < 24) { // Вечер
            baseOnline = 25; // Средний онлайн вечером
        } else { // Ночь
            baseOnline = 2; // Средний онлайн ночью
        }

        // Добавляем случайные колебания от -5 до +5
        const fluctuation = Math.floor(Math.random() * 11) - 5; // От -5 до +5
        const newOnline = baseOnline + fluctuation;

        // Ограничиваем онлайн в диапазоне от 6 до 30
        return Math.max(6, Math.min(30, newOnline));
    };

    useEffect(() => {
        const updateOnlineCount = () => {
            setOnlineCount(getFakeOnlineCount());
        };

        // Обновляем значение сразу при монтировании компонента
        updateOnlineCount();

        // Обновляем значение каждые 5 секунд
        const interval = setInterval(updateOnlineCount, 5000);

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={cls.online}>
            <Radio color="var(--green)" size={20}/>
            <Typography weight='bold' size='4'>{onlineCount}</Typography>
        </div>
    );
};