import React from 'react';
import clsx from 'clsx';
import { Typography } from '../Text/Text';
import Image from 'next/image';
import styles from './Card.module.scss';

interface CardProps {
    className?: string;
    children?: React.ReactNode;
}

interface AdvantageCardProps {
    icon: string;
    title: string;
    className?: string;
}

interface PromoCardProps {
    icon: string;
    title: string;
    className?: string;
}

export const Card = ({ className, children }: CardProps) => {
    return (
        <div className={clsx(styles.card, className)}>
            {children}
        </div>
    );
};

export const AdvantageCard = ({ icon, title, className }: AdvantageCardProps) => {
    return (
        <Card className={clsx(styles.advantageCard, className)}>
            <Image src={icon} alt={title} width={44} height={44} />
            <Typography weight="bold">{title}</Typography>
        </Card>
    );
};

export const PromoCard = ({ icon, title, className }: PromoCardProps) => {
    return (
        <Card className={clsx(styles.promoCard, className)}>
            <Image className={styles.image} src={icon} alt={title} width={142} height={142} />
            <Typography className={styles.text} weight="bold" as="div">
                {title}
            </Typography>
        </Card>
    );
}; 