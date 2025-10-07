'use client'
import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import clsx from 'clsx';
import cls from './styles.module.scss';

const buttonVariants = cva(cls.button, {
    variants: {
        variant: {
            default: cls.buttonDefault,
            destructive: cls.buttonDestructive,
            outline: cls.buttonOutline,
            secondary: cls.buttonSecondary,
            ghost: cls.buttonGhost,
            link: cls.buttonLink
        },
        size: {
            default: cls.size__default,
            sm: cls.size__sm,
            l: cls.size__l,
            lg: cls.size__lg,
            icon: cls.size__icon
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
                                                                     className,
                                                                     variant,
                                                                     size,
                                                                     asChild = false,
                                                                     fullWidth = false,
                                                                     ...props
                                                                 }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
        <Comp
            className={clsx(buttonVariants({ variant, size, className }), fullWidth ? cls.fullWidth : "")}
            ref={ref}
            {...props}
        />
    );
});
Button.displayName = 'Button';

export {Button, buttonVariants};
