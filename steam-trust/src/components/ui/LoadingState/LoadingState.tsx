import React from 'react';
import { Typography } from '../Text/Text';
import styles from './LoadingState.module.scss';

interface LoadingStateProps {
    message?: string;
    className?: string;
}

export const LoadingState = ({ message = "Загрузка...", className }: LoadingStateProps) => {
    return (
        <div className={`${styles.loadingState} ${className || ''}`}>
            <div className={styles.spinner}></div>
            <Typography size="2" className={styles.message}>
                {message}
            </Typography>
        </div>
    );
}; 