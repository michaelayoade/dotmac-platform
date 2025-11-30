import { type VariantProps } from "class-variance-authority";
declare const inputVariants: (props?: ({
    variant?: "default" | "error" | "warning" | "success" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, VariantProps<typeof inputVariants> {
    /** Label for the input */
    label?: string;
    /** Helper text displayed below the input */
    helperText?: string;
    /** Error message to display */
    error?: string;
    /** Success message to display */
    success?: string;
    /** Warning message to display */
    warning?: string;
    /** Whether the input is in a loading state */
    isLoading?: boolean;
    /** Icon to display on the left */
    leftIcon?: React.ReactNode;
    /** Icon to display on the right */
    rightIcon?: React.ReactNode;
    /** Whether to show password toggle for password inputs */
    showPasswordToggle?: boolean;
    /** Custom validation function */
    validate?: (value: string) => string | null;
    /** Whether to validate on blur */
    validateOnBlur?: boolean;
    /** Whether to validate on change */
    validateOnChange?: boolean;
    /** Whether to sanitize input */
    sanitize?: boolean;
    /** Maximum character count */
    maxLength?: number;
    /** Whether to show character count */
    showCharCount?: boolean;
}
export declare const Input: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement>>;
export { inputVariants };
//# sourceMappingURL=Input.d.ts.map