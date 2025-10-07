import * as React from 'react';
import clsx from "clsx";

import cls from "./styles.module.scss"

export type InputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const TextArea = React.forwardRef<HTMLTextAreaElement, InputProps>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={clsx(cls.textarea, className)}
            ref={ref}
            {...props}
        />
    );
});
TextArea.displayName = 'TextArea';

export { TextArea };
