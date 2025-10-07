import {Page, PageContent} from "@/components/ui/page/page";
import cls from "./styles.module.scss"
import Image from "next/image";
import {Typography} from "@/components/ui/Text/Text";
import React from "react";
import Link from "next/link";
import {socialLinks} from "@/lib/social";

export default function Home() {

    return (
        <Page>
            <PageContent>
                <div className={cls.section}>
                    <Image
                        src='/card_success.png'
                        alt='credit card'
                        width={560}
                        height={366}
                        className={cls.image}
                        priority
                    />
                    <div className={cls.paymentDetails}>
                        <Typography size='9' weight='extra' align='center' className={cls.title}>
                            Платеж прошел успешно!
                        </Typography>
                        <Typography size='4' weight='medium' className={cls.desc} align='center'>
                            Подписывайтесь на наши соцсети — получайте эксклюзивные бонусы и промокоды!
                        </Typography>

                        <div className={cls.social}>
                            <Link className={cls.item} href={socialLinks?.telegram} aria-label="Telegram">
                                <Image
                                    src="/social/telegram.svg"
                                    alt=""
                                    width={34}
                                    height={34}
                                    aria-hidden
                                />
                            </Link>
                            <Link className={cls.item} href={socialLinks?.vk} aria-label="VKontakte">
                                <Image
                                    src="/social/vk.svg"
                                    alt=""
                                    width={34}
                                    height={34}
                                    aria-hidden
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </PageContent>
        </Page>
    );
}