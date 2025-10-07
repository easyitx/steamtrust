import * as React from 'react';
import clsx from "clsx";

import cls from "./styles.module.scss"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={clsx(cls.input, className)}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = 'Input';

export { Input };
