import React from "react";
import {Page, PageContent} from "@/components/ui/page/page";
import { Typography } from "@/components/ui/Text/Text";
import cls from "./styles.module.scss"
import Image from "next/image";
import {Accordion} from "@/components/ui/Accordion/accordion";

// Метаданные для SEO
export const metadata = {
    title: "FAQ по пополнению Steam | Частые вопросы и ответы | Steam Trust",
    description: "❓ Ответы на все вопросы о пополнении баланса Steam. Мгновенное зачисление, безопасные платежи, решение проблем. Работаем 24/7 для клиентов из России и СНГ.",
    keywords: [
        "пополнение steam вопросы",
        "не пришли деньги на steam",
        "ошибка при пополнении стим",
        "поддержка steam trust",
        "как быстро пополняется steam",
        "steam trust не работает",
        "помощь по платежам steam",
        "часто задаваемые вопросы steam"
    ],
    alternates: {
        canonical: "https://steamtrust.ru/faq"
    }
};

// Структурированные данные для FAQPage (Schema.org)
const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Что такое Логин в Steam?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Логин — это уникальный идентификатор пользователя для входа в аккаунт Steam. В отличие от никнейма, логин неизменен и используется для идентификации кошелька при пополнении."
            }
        },
        {
            "@type": "Question",
            "name": "Как быстро приходят деньги на Steam после оплаты?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Средства зачисляются автоматически в течение 1-3 минут после подтверждения платежа. В 95% случаев перевод выполняется мгновенно."
            }
        },
        {
            "@type": "Question",
            "name": "Что делать если платеж не прошел?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "1) Проверьте историю платежей в личном кабинете 2) Убедитесь в списании средств 3) Свяжитесь с поддержкой Steam Trust — среднее время ответа 7 минут."
            }
        }
    ]
};

const accordions = [
    {
        title: "Что такое Логин в Steam и где его найти?",
        description: "Логин — это уникальный идентификатор пользователя, который используется для входа в аккаунт Steam (не путать с никнеймом). Найти его можно: 1) В клиенте Steam → Настройки → Аккаунт 2) На сайте steamcommunity.com в профиле 3) В мобильном приложении во вкладке 'Аккаунт'."
    },
    {
        title: "Как быстро приходят средства на Steam после оплаты?",
        description: "Время зачисления зависит от платежной системы: • Карты/Visa/MC — 1-3 минуты • QIWI/ЮMoney — до 5 минут • Криптовалюта — 2-7 минут (зависит от сети блокчейна). В 98% случаев платежи обрабатываются мгновенно."
    },
    {
        title: "Что делать если деньги не пришли на Steam?",
        description: "Пошаговая инструкция: 1) Обновите баланс в клиенте Steam 2) Проверьте email, указанный при оплате 3) Напишите в наш Telegram-чат (@steamtrust_support) — среднее время решения проблемы 12 минут. Гарантируем возврат средств при технических сбоях."
    },
    {
        title: "Я указал неверный логин Steam. Как вернуть деньги?",
        description: "При ошибке в логине: 1) Система автоматически отклонит платеж, если логин не существует 2) При ошибочном зачислении другому пользователю — обратитесь в поддержку с чеком оплаты. Возврат возможен только при подтверждении ошибки нашей системой."
    },
    {
        title: "Какие гарантии безопасности платежей?",
        description: "Steam Trust обеспечивает: • SSL-шифрование всех операций • Автоматическую проверку транзакций • Подтверждение по SMS • 24/7 мониторинг подозрительных операций. За 8 лет работы — 0 случаев утечки данных."
    }
];

const FaqPage = async () => {
    return (
        <Page>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
            />

            <PageContent>
                <div className={cls.faq}>
                    <div className={cls.title}>
                        <Image
                            src="/icon/faq.svg"
                            alt='Иконка вопрос-ответ'
                            width='46'
                            height='46'
                            loading="lazy"
                        />
                        <Typography weight='bold' size='4' as='h1'>FAQ по пополнению Steam Trust</Typography>
                        <Typography as="p" className={cls.subtitle}>
                            Ответы на {accordions.length} самых частых вопросов о платежах
                        </Typography>
                    </div>

                    <div className={cls.accordions}>
                        {accordions.map((item, index) => (
                            <Accordion
                                key={index}
                                title={item.title}
                                description={item.description}
                            />
                        ))}
                    </div>
                </div>
            </PageContent>
        </Page>
    )
}

export default FaqPage;