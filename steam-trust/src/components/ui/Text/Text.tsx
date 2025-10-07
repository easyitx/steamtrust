import React from 'react';
import './text.scss';

interface TextProps {
    as?: 'span' | 'div' | 'label' | 'p' | 'h1' | 'h2'; // Define the allowed HTML elements
    className?: string;
    size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    weight?: 'light' | 'regular' | 'medium' | 'bold' | 'extra'; // Define font weights
    align?: 'left' | 'center' | 'right'; // Define text alignment
    trim?: 'normal' | 'start' | 'end' | 'both'; // Define trimming options
    truncate?: boolean; // Boolean for truncation
    wrap?: 'wrap' | 'nowrap' | 'pretty' | 'balance'; // Define wrapping options
    color?: string; // You can define specific color options if needed
    children: React.ReactNode; // Define children as React nodes
}

export const Typography: React.FC<TextProps> = ({
                                                    as: Component = 'span',
                                                    className,
                                                    size,
                                                    weight,
                                                    align,
                                                    trim,
                                                    truncate,
                                                    wrap,
                                                    color,
                                                    children,
                                                }) => {
    const classes = [
        className,
        size ? `size-${size}` : '',
        weight ? `weight-${weight}` : '',
        align ? `align-${align}` : '',
        trim ? `trim-${trim}` : '',
        truncate ? 'truncate' : '',
        wrap ? `wrap-${wrap}` : '',
        color ? `color-${color}` : '',
    ].join(' ');

    return <Component className={classes}>{children}</Component>;
};