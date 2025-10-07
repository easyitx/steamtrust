import * as React from 'react';
import clsx from "clsx";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import cls from "./styles.module.scss";
import { ChevronDown } from "lucide-react";

const AccordionRootPrimitive = AccordionPrimitive.Root;
const AccordionTriggerPrimitive = AccordionPrimitive.Trigger;
const AccordionItemPrimitive = AccordionPrimitive.Item;
const AccordionHeaderPrimitive = AccordionPrimitive.Header;
const AccordionContentPrimitive = AccordionPrimitive.Content;

interface AccordionProps {
    title: string;
    description: string;
}

const Accordion = ({ title, description }: AccordionProps) => {
    return (
        <AccordionRootPrimitive type="single" collapsible className={cls.AccordionRoot}>
            <AccordionItemPrimitive className={cls.AccordionItem} value="item-1">
                <AccordionTrigger>
                    {title}
                </AccordionTrigger>
                <AccordionContent>
                    { description }
                </AccordionContent>
            </AccordionItemPrimitive>
        </AccordionRootPrimitive>
    )
}

const AccordionTrigger = React.forwardRef<
    React.ComponentRef<typeof AccordionTriggerPrimitive>,
    React.ComponentPropsWithoutRef<typeof AccordionTriggerPrimitive> & {}
>(
    ({ children, className, ...props }, forwardedRef) => (
        <AccordionHeaderPrimitive className={cls.AccordionHeader}>
            <AccordionTriggerPrimitive
                className={clsx(cls.AccordionTrigger, className)}
                {...props}
                ref={forwardedRef}
            >
                {children}
                <ChevronDown className={cls.AccordionChevron} aria-hidden size='16'/>
            </AccordionTriggerPrimitive>
        </AccordionHeaderPrimitive>
    ),
);
AccordionTrigger.displayName = AccordionHeaderPrimitive.displayName

const AccordionContent = React.forwardRef<
    React.ComponentRef<typeof AccordionContentPrimitive>,
    React.ComponentPropsWithoutRef<typeof AccordionContentPrimitive> & {}
>(
    ({ children, className, ...props }, forwardedRef) => (
        <AccordionContentPrimitive
            className={clsx(cls.AccordionContent, className)}
            {...props}
            ref={forwardedRef}
        >
            <div className={cls.AccordionContentText}>{children}</div>
        </AccordionContentPrimitive>
    ),
);

AccordionContent.displayName = AccordionContentPrimitive.displayName

export {
    Accordion
};