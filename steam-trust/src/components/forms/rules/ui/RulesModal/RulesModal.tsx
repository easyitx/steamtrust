'use client'
import {
    DialogClose,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogRoot, DialogTitle,
    DialogTrigger
} from "@/components/ui/Modal/modal"
import {CircleX, TriangleAlert} from "lucide-react";
import React, { useState } from "react";
import {Button} from "@/components/ui/Button/button";

import cls from "./styles.module.scss"
import {Typography} from "@/components/ui/Text/Text";

export const RulesModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DialogRoot open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className={cls.rules}>
                    <TriangleAlert/>
                    <Typography
                        as='div'
                        size='1'
                        weight='bold'
                    >
                        Если у вас на аккаунте до этого не было пополнений прочтите <a>инструкцию</a>
                    </Typography>
                </div>
            </DialogTrigger>

            <DialogPortal>
                <DialogOverlay>
                    <DialogContent>
                        <DialogTitle>Инструкция при первом пополнении</DialogTitle>
                        <div className={cls.content}>

                            <div
                                className={cls.article}
                                dangerouslySetInnerHTML={{
                                    __html: `
            <p>
                Если вы пополняете аккаунт, на котором до этого не было финансовых операций, его регион может измениться на Казахстан, Узбекистан или другой похожий регион, а валюта на CIS $ (или другие). Чтобы этого избежать и сохранить тот регион (страну), из которой Вы заходите в аккаунт, следуйте этой инструкции:
            </p>
            <ol>
                <li>Авторизуйтесь в Steam в браузере или программе.</li>
                <li>Добавьте на свой аккаунт минимум две бесплатные игры. Например, PUBG и Dota 2. <br/>Рекомендуем добавлять игры, используя библиотеку Steam в приложении на смартфоне.</li>
                <li>Наиграйте не менее 2-3 часов в добавленной игре.</li>
                <li>Не забудьте выключить VPN. Получение бесплатных игр на Steam должно происходить<br/> в домашнем регионе.</li>
            </ol>
            <p>
                <strong>PROFIT.</strong> Ваш аккаунт даже после первого пополнения будет иметь валюту домашнего региона, а значит все цены на игры будут показываться как для домашнего региона.<br/> (Данный способ не является 100% гарантом и в некоторых случаях всё же может не сработать. <br/>Для первого пополнения рекомендуем попробовать пополнить баланс на минимальную сумму.)
            </p>
            <p>
                <strong>P.S:</strong> Используя этот способ для страны Россия, Вы так же получаете региональные ограничения, связанные с РФ аккаунтами. Некоторые игры из библиотеки Steam будут недоступны для покупки в этом регионе.
            </p>
        `
                                }}
                            />
                        </div>

                        <DialogClose asChild className={cls.dialogCloseBtn}>
                            <Button variant='link' size='sm' aria-label="Close">
                                <CircleX/>
                            </Button>
                        </DialogClose>
                    </DialogContent>
                </DialogOverlay>
            </DialogPortal>
        </DialogRoot>
    )
}