'use client'
import React from 'react';

import cls from "./styles.module.scss"
import {AppLogo} from "@/components/layout/AppLogo/AppLogo";
import {Typography} from "@/components/ui/Text/Text";
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/Button/button";
import {getRouteAgreement, getRoutePrivacyPolicy, getRouteSupport} from "@/lib/router/router";
import {socialLinks} from "@/lib/social";

export const Footer = () => {
    return (
        <div className={cls.footer}>
            <div className={cls.footer__inner}>
                <div className={cls.top__side}>
                    <div className={cls.left__wrapper}>
                        <div className={cls.logo}>
                            <AppLogo/>

                            <Typography className={cls.desc} align='center'>
                                SteamTrust — мгновенное пополнение Steam кошелька
                            </Typography>
                        </div>

                        <Typography size='1' className={cls.company}>
                            ОсОО «Альянс Торг Компани»<br/>
                            Адрес компании:
                            Кыргызская Республика, Бишкек, Октябрьский район,<br/> 7-мкр., ул. Безымянная, д. 37/2
                            Номер ОГРН: 310076-3301-ООО<br/>
                            ИНН:9909710244<br/>
                        </Typography>
                    </div>
                    <div className={cls.right__wrapper}>
                        <Typography className={cls.desc} as='span'>Наши соц. сети</Typography>

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
                <div className={cls.bottom__side}>
                    <div className={cls.menu}>
                        <div>
                            <Link className={cls.item} href={getRoutePrivacyPolicy()}>Политика конфиденциальности</Link>
                        </div>
                        <div>
                            <Link className={cls.item} href={getRouteAgreement()}>Пользовательское соглашение</Link>
                        </div>
                        <div>
                            <Link className={cls.item} href={getRouteSupport()}>Поддержка</Link>
                        </div>
                    </div>

                    <Button className={cls.btnSupport} variant='outline' size='default' onClick={() => window.location.href = 'mailto:support@steamtrust.online'}>
                        <Typography className={cls.textSupportBtn}>
                            support@steamtrust.online
                        </Typography>
                    </Button>
                </div>
            </div>
        </div>
    );
};