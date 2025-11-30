/**
 * Button Primitive Component
 *
 * Enhanced base button component with comprehensive TypeScript support,
 * accessibility features, loading states, and security considerations
 */
import { type VariantProps } from "class-variance-authority";
import * as React from "react";
declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "secondary" | "outline" | "ghost" | "admin" | "customer" | "reseller" | "technician" | "management" | "destructive" | null | undefined;
    size?: "default" | "sm" | "lg" | "xl" | "icon" | null | undefined;
    loading?: boolean | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    /** Whether the button is in a loading state */
    isLoading?: boolean;
    /** Text to display during loading state */
    loadingText?: string;
    /** Custom loading component */
    loadingComponent?: React.ReactNode;
    /** Icon to display on the left */
    leftIcon?: React.ReactNode;
    /** Icon to display on the right */
    rightIcon?: React.ReactNode;
    /** Icon to display (uses leftIcon by default, rightIcon if iconPosition is 'right') */
    icon?: React.ReactNode;
    /** Position of the icon */
    iconPosition?: "left" | "right";
    /** Whether to prevent form submission */
    preventFormSubmission?: boolean;
    /** Custom click handler with security considerations */
    onSecureClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
    /** Whether to show loading state during async operations */
    showAsyncLoading?: boolean;
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { Button, buttonVariants };
//# sourceMappingURL=Button.d.ts.map