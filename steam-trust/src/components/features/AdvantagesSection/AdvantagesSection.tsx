import React from 'react';
import { Typography } from '@/components/ui/Text/Text';
import Image from 'next/image';
import styles from './AdvantagesSection.module.scss';

const advantages = [
    {
        icon: "/icon/comiss.svg",
        title: "Самая низкая комиссия"
    },
    {
        icon: "/icon/speed.svg", 
        title: "Быстрые пополнения"
    },
    {
        icon: "/icon/lock.svg",
        title: "Гарантии безопасности"
    }
];

export const AdvantagesSection = () => {
    return (
        <div className={styles.advantagesSection}>
            <div className={styles.cards}>
                {advantages.map((advantage, index) => (
                    <div key={index} className={styles.card}>
                        <Image src={advantage.icon} alt={advantage.title} width={44} height={44} />
                        <Typography weight="bold">{advantage.title}</Typography>
                    </div>
                ))}
            </div>
            
            <div className={styles.rightCards}>
                <div className={styles.card3D}>
                    <Image 
                        className={styles.image} 
                        src="/trust3D.svg" 
                        alt="support" 
                        width={124}
                        height={148}
                    />
                    <Typography weight="bold">
                        Поддержка <br/>24/7
                    </Typography>
                </div>
                
                <div className={styles.promoCard}>
                    <Image 
                        className={styles.image} 
                        src="/gift.svg" 
                        alt="gift" 
                        width={142} 
                        height={142} 
                    />
                    <Typography className={styles.text} weight="bold" as="div">
                        Промокод для новых клиентов
                    </Typography>
                </div>
            </div>
        </div>
    );
}; 