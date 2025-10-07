import * as React from 'react';
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import cls from "./styles.module.scss";
import {CheckIcon } from "lucide-react";
import clsx from "clsx";

const CheckboxRootPrimitive = CheckboxPrimitive.Root;
const CheckboxIndicatorPrimitive = CheckboxPrimitive.Indicator;

interface Props {
    label: string;
    checked?: boolean
    setChecked: (checked: boolean) => void
}

const CheckboxSection = ({ label, checked = false, setChecked }: Props) => {

    return (
        <div className={cls.CheckboxSection}>
            <CheckboxRoot
                defaultChecked id="c1"
                checked={checked}
                onCheckedChange={setChecked}
                className={cls.CheckboxRoot}
            >
                <CheckboxIndicator className={cls.CheckboxIndicator}>
                    <CheckIcon size='22'/>
                </CheckboxIndicator>
            </CheckboxRoot>

            <label className="Label" style={{ fontSize: 10 }} htmlFor="c1">
                {label}
            </label>
        </div>
    )
}

const CheckboxIndicator = React.forwardRef<
    React.ComponentRef<typeof CheckboxIndicatorPrimitive>,
    React.ComponentPropsWithoutRef<typeof CheckboxIndicatorPrimitive> & {}
>(
    ({ children, className, ...props }, forwardedRef) => (
        <CheckboxIndicatorPrimitive
            className={clsx(cls.CheckboxIndicator, className)}
            {...props}
            ref={forwardedRef}
        >
            {children}
        </CheckboxIndicatorPrimitive>
    ),
);
CheckboxIndicator.displayName = CheckboxIndicatorPrimitive.displayName

const CheckboxRoot = React.forwardRef<
    React.ComponentRef<typeof CheckboxRootPrimitive>,
    React.ComponentPropsWithoutRef<typeof CheckboxRootPrimitive> & {}
>(
    ({ children, className, ...props }, forwardedRef) => (
        <CheckboxRootPrimitive
            className={clsx(cls.CheckboxRoot, className)}
            {...props}
            ref={forwardedRef}
        >
            {children}
        </CheckboxRootPrimitive>
    ),
);
CheckboxRoot.displayName = CheckboxRootPrimitive.displayName

export {
    CheckboxRoot,
    CheckboxIndicator,
    CheckboxSection
};