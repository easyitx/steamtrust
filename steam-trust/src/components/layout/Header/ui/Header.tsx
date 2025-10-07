import React from 'react';

import cls from "./styles.module.scss"

import Link from 'next/link';
import { Typography } from "@/components/ui/Text/Text";
import Image from "next/image";
import {AppLogo} from "@/components/layout/AppLogo/AppLogo";
import {socialLinks} from "@/lib/social";
import { OnlineUsers } from './OnlineUsers/OnlineUsers';
import { getRouteFaq } from '@/lib/router/router';

export const Header = () => {
    return (
        <div className={cls.header}>
            <div className={cls.header__inner}>
                <div className={cls.left__wrapper}>
                    <AppLogo/>

                    <OnlineUsers/>

                    <div className={cls.nav__wrapper}>
                        <nav className={cls.navigation}>
                            <div className={cls.item}>
                                <Link href='/'><Typography weight='bold'>Пополнить Steam</Typography></Link>
                            </div>
                            <div className={cls.item}>
                                <Link href={getRouteFaq()}><Typography weight='bold'>F.A.Q</Typography></Link>
                            </div>
                        </nav>
                    </div>
                </div>

                <div className={cls.right__wrapper}>
                    <div className={cls.social}>
                        <Link className={cls.item} href={socialLinks.telegram}>
                            <Image src="/social/telegram.svg" alt="telegram logo" width={22} height={22}/>
                        </Link>
                        <Link className={cls.item} href={socialLinks.vk}>
                            <Image src="/social/vk.svg" alt="vk logo" width={22} height={22}/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};