import React from 'react';
import { Typography } from '../Text/Text';
import { Card } from '../Card/Card';
import styles from './ErrorFallback.module.scss';

interface ErrorFallbackProps {
    title: string;
    description: string;
    className?: string;
}

export const ErrorFallback = ({ title, description, className }: ErrorFallbackProps) => {
    return (
        <Card className={`${styles.errorFallback} ${className || ''}`}>
            <div className={styles.icon}>⚠️</div>
            <Typography weight="bold" size="3" className={styles.title}>
                {title}
            </Typography>
            <Typography size="2" className={styles.description}>
                {description}
            </Typography>
        </Card>
    );
};

interface NoDataFallbackProps {
    message: string;
    className?: string;
}

export const NoDataFallback = ({ message, className }: NoDataFallbackProps) => {
    return (
        <div className={`${styles.noDataFallback} ${className || ''}`}>
            <Typography size="2" className={styles.noDataMessage}>
                {message}
            </Typography>
        </div>
    );
}; 