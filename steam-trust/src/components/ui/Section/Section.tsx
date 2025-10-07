import React from 'react';
import clsx from 'clsx';
import { Typography } from '../Text/Text';
import Image from 'next/image';
import styles from './Section.module.scss';

interface SectionProps {
    children: React.ReactNode;
    className?: string;
}

interface SectionHeaderProps {
    icon?: string;
    title: string;
    className?: string;
}

export const Section = ({ children, className }: SectionProps) => {
    return (
        <div className={clsx(styles.section, className)}>
            {children}
        </div>
    );
};

export const SectionHeader = ({ icon, title, className }: SectionHeaderProps) => {
    return (
        <div className={clsx(styles.sectionHeader, className)}>
            {icon && <Image src={icon} alt={title} width={46} height={46} />}
            <Typography weight="bold" size="4" as="h2">
                {title}
            </Typography>
        </div>
    );
}; 