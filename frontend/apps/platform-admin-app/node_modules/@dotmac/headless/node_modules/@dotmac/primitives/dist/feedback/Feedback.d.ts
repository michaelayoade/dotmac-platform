import * as ToastPrimitive from "@radix-ui/react-toast";
import { type VariantProps } from "class-variance-authority";
import React from "react";
declare const toastVariants: (props?: ({
    variant?: "default" | "error" | "warning" | "success" | "info" | null | undefined;
    position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const alertVariants: (props?: ({
    variant?: "default" | "error" | "warning" | "success" | "info" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const loadingVariants: (props?: ({
    variant?: "pulse" | "spinner" | "dots" | "skeleton" | null | undefined;
    size?: "sm" | "md" | "lg" | "xl" | "xs" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const feedbackVariants: (props?: ({
    variant?: "default" | "error" | "warning" | "success" | "info" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface FeedbackProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof feedbackVariants> {
    dismissible?: boolean;
    onDismiss?: () => void;
    autoHide?: boolean;
    autoHideDelay?: number;
    loading?: boolean;
}
export declare const Feedback: React.ForwardRefExoticComponent<FeedbackProps & React.RefAttributes<HTMLDivElement>>;
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export interface FeedbackTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: HeadingTag;
}
export declare const FeedbackTitle: React.ForwardRefExoticComponent<FeedbackTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export declare const FeedbackDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>>;
export declare const FeedbackActions: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
interface ToastContextValue {
    toasts: ToastData[];
    addToast: (toast: Omit<ToastData, "id">) => string;
    removeToast: (id: string) => void;
    removeAllToasts: () => void;
}
interface ToastData {
    id: string;
    title?: string;
    description?: string;
    variant?: "default" | "success" | "error" | "warning" | "info";
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
        altText?: string;
    };
    onClose?: () => void;
}
export declare function useToast(): ToastContextValue;
export interface ToastProviderProps {
    children: React.ReactNode;
    swipeDirection?: "right" | "left" | "up" | "down";
    swipeThreshold?: number;
    duration?: number;
}
export declare function ToastProvider({ children, swipeDirection, swipeThreshold, duration, }: ToastProviderProps): import("react/jsx-runtime").JSX.Element;
declare const ToastViewport: React.ForwardRefExoticComponent<Omit<ToastPrimitive.ToastViewportProps & React.RefAttributes<HTMLOListElement>, "ref"> & React.RefAttributes<HTMLOListElement>>;
export interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>, VariantProps<typeof toastVariants> {
}
declare const Toast: React.ForwardRefExoticComponent<ToastProps & React.RefAttributes<HTMLLIElement>>;
declare const ToastContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const ToastTitle: React.ForwardRefExoticComponent<Omit<ToastPrimitive.ToastTitleProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ToastDescription: React.ForwardRefExoticComponent<Omit<ToastPrimitive.ToastDescriptionProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ToastAction: React.ForwardRefExoticComponent<Omit<ToastPrimitive.ToastActionProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
declare const ToastClose: React.ForwardRefExoticComponent<Omit<ToastPrimitive.ToastCloseProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
    asChild?: boolean;
    icon?: React.ReactNode;
    closable?: boolean;
    onClose?: () => void;
}
export declare const Alert: React.ForwardRefExoticComponent<AlertProps & React.RefAttributes<HTMLDivElement>>;
export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    asChild?: boolean;
}
export declare const AlertTitle: React.ForwardRefExoticComponent<AlertTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const AlertDescription: React.ForwardRefExoticComponent<AlertDescriptionProps & React.RefAttributes<HTMLDivElement>>;
export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof loadingVariants> {
    asChild?: boolean;
    text?: string;
    overlay?: boolean;
}
export declare const Loading: React.ForwardRefExoticComponent<LoadingProps & React.RefAttributes<HTMLDivElement>>;
export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
    lines?: number;
    avatar?: boolean;
    width?: string | number;
    height?: string | number;
}
export declare const LoadingSkeleton: React.ForwardRefExoticComponent<LoadingSkeletonProps & React.RefAttributes<HTMLDivElement>>;
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
    indeterminate?: boolean;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "success" | "error" | "warning";
    showValue?: boolean;
    label?: string;
}
export declare const Progress: React.ForwardRefExoticComponent<ProgressProps & React.RefAttributes<HTMLDivElement>>;
export interface PresenceIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
    status: "online" | "offline" | "busy" | "away" | "idle";
    size?: "sm" | "md" | "lg";
    withPulse?: boolean;
    label?: string;
}
export declare const PresenceIndicator: React.ForwardRefExoticComponent<PresenceIndicatorProps & React.RefAttributes<HTMLDivElement>>;
export { ToastViewport, Toast, ToastContent, ToastTitle, ToastDescription, ToastAction, ToastClose, };
//# sourceMappingURL=Feedback.d.ts.map