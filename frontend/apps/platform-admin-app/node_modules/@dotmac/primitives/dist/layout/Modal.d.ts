import { type VariantProps } from "class-variance-authority";
import React from "react";
declare const modalVariants: (props?: ({
    size?: "sm" | "md" | "lg" | "xl" | "full" | null | undefined;
    variant?: "default" | "centered" | "drawer" | "sidebar" | null | undefined;
    state?: "open" | "closed" | "opening" | "closing" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export declare const ModalFocusUtils: {
    getFocusableElements: (container: HTMLElement) => HTMLElement[];
    trapFocus: (container: HTMLElement, event: KeyboardEvent) => void;
    setInitialFocus: (container: HTMLElement) => void;
};
export declare const useModalState: (defaultOpen?: boolean, onOpenChange?: (open: boolean) => void) => {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
};
export interface ModalBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
    onClick?: () => void;
    closeOnClick?: boolean;
    "data-testid"?: string;
}
export declare const ModalBackdrop: React.ForwardRefExoticComponent<ModalBackdropProps & React.RefAttributes<HTMLDivElement>>;
export interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof modalVariants> {
    showClose?: boolean;
    closeOnEscape?: boolean;
    trapFocus?: boolean;
    "data-testid"?: string;
    onClose?: () => void;
}
export declare const ModalContent: React.ForwardRefExoticComponent<ModalContentProps & React.RefAttributes<HTMLDivElement>>;
export interface ModalHeaderProps extends React.HTMLAttributes<HTMLElement> {
    as?: keyof JSX.IntrinsicElements;
}
export declare const ModalHeader: React.ForwardRefExoticComponent<ModalHeaderProps & React.RefAttributes<HTMLElement>>;
export interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    "data-testid"?: string;
}
export declare const ModalTitle: React.ForwardRefExoticComponent<ModalTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export declare const ModalDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & {
    "data-testid"?: string;
} & React.RefAttributes<HTMLParagraphElement>>;
export declare const ModalBody: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & {
    "data-testid"?: string;
} & React.RefAttributes<HTMLDivElement>>;
export declare const ModalFooter: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & {
    "data-testid"?: string;
} & React.RefAttributes<HTMLDivElement>>;
export interface ModalTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    "data-testid"?: string;
}
export declare const ModalTrigger: React.ForwardRefExoticComponent<ModalTriggerProps & React.RefAttributes<HTMLButtonElement>>;
export interface ModalProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}
export declare const Modal: React.FC<ModalProps>;
export {};
//# sourceMappingURL=Modal.d.ts.map