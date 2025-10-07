import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import cls from "./styles.module.scss";

const DialogRootPrimitive = DialogPrimitive.Root;
const DialogTriggerPrimitive = DialogPrimitive.Trigger;
const DialogPortalPrimitive = DialogPrimitive.Portal;
const DialogOverlayPrimitive = DialogPrimitive.Overlay;
const DialogContentPrimitive = DialogPrimitive.Content;
const DialogTitlePrimitive = DialogPrimitive.Title;
const DialogDescriptionPrimitive = DialogPrimitive.Description;
const DialogClosePrimitive = DialogPrimitive.Close;


const DialogRoot = React.forwardRef<
    React.ComponentRef<typeof DialogRootPrimitive>,
    React.ComponentPropsWithRef<typeof DialogRootPrimitive & {}>
>(({ children, ...props }, forwardedRef) => (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    <DialogRootPrimitive className={cls.DialogRoot} {...props} ref={forwardedRef}>
        {children}
    </DialogRootPrimitive>
));
DialogRoot.displayName = DialogRootPrimitive.displayName;

const DialogTrigger = React.forwardRef<
    React.ComponentRef<typeof DialogTriggerPrimitive>,
    React.ComponentPropsWithoutRef<typeof DialogTriggerPrimitive>
>(({ children, className, ...props }, forwardedRef) => (
    <DialogTriggerPrimitive
        className={clsx(cls.DialogTrigger, className)}
        {...props}
        ref={forwardedRef}
    >
        {children}
    </DialogTriggerPrimitive>
));
DialogTrigger.displayName = DialogTriggerPrimitive.displayName;

const DialogPortal = React.forwardRef<
    React.ComponentRef<typeof DialogPortalPrimitive>,
    React.ComponentPropsWithoutRef<typeof DialogPortalPrimitive>
>(({ children, ...props }, forwardedRef) => (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    <DialogPortalPrimitive className={cls.DialogPortal} {...props} ref={forwardedRef}>
        {children}
    </DialogPortalPrimitive>
));
DialogPortal.displayName = DialogPortalPrimitive.displayName;

const DialogOverlay = React.forwardRef<
    React.ComponentRef<typeof DialogOverlayPrimitive>,
    React.ComponentPropsWithoutRef<typeof DialogOverlayPrimitive>
>(({ className, ...props }, forwardedRef) => (
    <DialogOverlayPrimitive
        className={clsx(cls.DialogOverlay, className)}
        {...props}
        ref={forwardedRef}
    />
));
DialogOverlay.displayName = DialogOverlayPrimitive.displayName;

const DialogContent = React.forwardRef<
    React.ComponentRef<typeof DialogContentPrimitive>,
    React.ComponentPropsWithoutRef<typeof DialogContentPrimitive>
>(({ children, className, ...props }, forwardedRef) => (
    <DialogContentPrimitive
        className={clsx(cls.DialogContent, className)}
        {...props}
        ref={forwardedRef}
    >
        {children}
    </DialogContentPrimitive>
));
DialogContent.displayName = DialogContentPrimitive.displayName;

const DialogTitle = React.forwardRef<
    React.ComponentRef<typeof DialogTitlePrimitive>,
    React.ComponentPropsWithoutRef<typeof DialogTitlePrimitive>
>(({ children, className, ...props }, forwardedRef) => (
    <DialogTitlePrimitive
        className={clsx(cls.DialogTitle, className)}
        {...props}
        ref={forwardedRef}
    >
        {children}
    </DialogTitlePrimitive>
));
DialogTitle.displayName = DialogTitlePrimitive.displayName;

const DialogDescription = React.forwardRef<
    React.ComponentRef<typeof DialogDescriptionPrimitive>,
    React.ComponentPropsWithoutRef<typeof DialogDescriptionPrimitive>
>(({ children, className, ...props }, forwardedRef) => (
    <DialogDescriptionPrimitive
        className={clsx(cls.DialogDescription, className)}
        {...props}
        ref={forwardedRef}
    >
        {children}
    </DialogDescriptionPrimitive>
));
DialogDescription.displayName = DialogDescriptionPrimitive.displayName;

const DialogClose = React.forwardRef<
    React.ComponentRef<typeof DialogClosePrimitive>,
    React.ComponentPropsWithoutRef<typeof DialogClosePrimitive>
>(({ children, className, ...props }, forwardedRef) => (
    <DialogClosePrimitive
        className={clsx(cls.DialogClose, className)}
        {...props}
        ref={forwardedRef}
    >
        {children}
    </DialogClosePrimitive>
));
DialogClose.displayName = DialogClosePrimitive.displayName;

export {
    DialogRoot,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
}