import React from 'react';
import { Section, SectionHeader } from '@/components/ui/Section/Section';
import { Accordion } from '@/components/ui/Accordion/accordion';
import styles from './FaqSection.module.scss';

const faqData = [
    {
        title: "Что такое \"Логин\"?",
        description: "Логин — это уникальный идентификатор пользователя, который используется для входа в аккаунт, узнать его можно на странице аккаунта Steam. Каждый логин является уникальным в отличие от никнейма."
    },
    {
        title: "Как быстро приходят средства на Steam после оплаты?",
        description: "Средства поступают мгновенно, как только подтвердиться платеж. Буквально через пару секунд"
    },
    {
        title: "Что делать если не пришли средства?",
        description: "Напишите в нашу поддержку, мы всегда на связи и отвечаем в течении 10 минут"
    },
    {
        title: "Я указал неверный логин Стим кошелька",
        description: "Если такого логина в Steam не существует, то Вы не сможете произвести оплату, система выдаст ошибку и попросит указать верный логин.\nЕсли такой логин существует тогда Ваши средства уйдут другому пользователю и мы не сможем их вернуть Внимательно проверяйте введенные данные ДО оплаты."
    },
    {
        title: "Не нашел ответ на свой вопрос",
        description: "Если вы не нашли ответ на свой вопрос в разделе часто задаваемых вопросов (FAQ), вы всегда можете связаться с нами. Мы оперативно ответим на ваш запрос!"
    },
];

export const FaqSection = () => {
    return (
        <Section className={styles.faqSection}>
            <SectionHeader 
                icon="/icon/faq.svg" 
                title="Вопросы и ответы" 
            />
            <div className={styles.accordions}>
                {faqData.map((item, index) => (
                    <Accordion 
                        key={index} 
                        title={item.title} 
                        description={item.description} 
                    />
                ))}
            </div>
        </Section>
    );
}; 