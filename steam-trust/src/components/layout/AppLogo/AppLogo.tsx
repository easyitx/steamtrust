'use client'
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import {getRouteMain} from "@/lib/router/router";
import { useDevice } from "@/lib/useDeviceType";

export const AppLogo = () => {
    const { isMobile } = useDevice()

    return (
        <Link href={getRouteMain()}>
            <Image
                src="/st_logo.svg"
                alt='appLogo'
                width={isMobile ? 150 : 180}
                height={isMobile ? 28 : 37}
                objectFit="contain"
            />
        </Link>
    );
};