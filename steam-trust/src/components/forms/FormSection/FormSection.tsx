import React from 'react';
import clsx from 'clsx';
import { Typography } from '@/components/ui/Text/Text';
import styles from './FormSection.module.scss';

interface FormSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const FormSection = ({ title, children, className }: FormSectionProps) => {
    return (
        <div className={clsx(styles.formSection, className)}>
            <Typography as="div" className={styles.title} weight="bold" size="2">
                {title}
            </Typography>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}; 