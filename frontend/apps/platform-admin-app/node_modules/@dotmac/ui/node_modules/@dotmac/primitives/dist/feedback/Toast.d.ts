/**
 * Toast Components for Notifications
 */
import React from "react";
interface ToastProps {
    id: string;
    title?: string;
    description?: string;
    type?: "default" | "success" | "error" | "warning" | "info";
    duration?: number;
    action?: React.ReactNode;
}
interface ToastContextType {
    toasts: ToastProps[];
    addToast: (toast: Omit<ToastProps, "id">) => string;
    removeToast: (id: string) => void;
    clearToasts: () => void;
}
export declare const ToastProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useToast: () => ToastContextType;
export declare const Toast: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & {
    type?: ToastProps["type"];
} & React.RefAttributes<HTMLDivElement>>;
export declare const ToastTitle: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLParagraphElement>>;
export declare const ToastDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>>;
export declare const ToastAction: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
export declare const ToastClose: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
export declare const ToastContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
export declare const ToastViewport: () => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Toast.d.ts.map