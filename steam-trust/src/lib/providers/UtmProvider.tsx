'use client'
import React, {useEffect} from 'react';
import {$api} from "@/lib/api.instance";
import ym from "react-yandex-metrika";


interface Props {
    children?: React.ReactNode;
}

export const UtmProvider = ({children}: Props) => {
    const isBrowser = typeof window !== 'undefined';

    const searchParams = isBrowser ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const utm_source = searchParams.get('utm_source') || '';
    const utm_medium = searchParams.get('utm_medium') || '';
    const utm_campaign = searchParams.get('utm_campaign') || '';

    useEffect(() => {
        if (isBrowser && (utm_source && utm_medium && utm_campaign)) {
            ym("params", { utm_source, utm_medium, utm_campaign });
        }
    }, [utm_source, utm_medium, utm_campaign, isBrowser]);

    return (
        <>
            {children}
        </>
    );
};