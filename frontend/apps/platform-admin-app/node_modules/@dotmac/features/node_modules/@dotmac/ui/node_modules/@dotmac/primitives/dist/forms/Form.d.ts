/**
 * Unstyled, composable Form primitives with React Hook Form integration
 *
 * This module provides accessible, headless form components that integrate seamlessly
 * with React Hook Form for validation and state management. All components follow
 * WAI-ARIA guidelines and support keyboard navigation.
 *
 * @example
 * ```tsx
 * const form = useForm<FormData>();
 *
 * <Form form={form} onSubmit={handleSubmit}>
 *   <FormField name="email">
 *     {({ value, onChange, error, invalid }) => (
 *       <FormItem>
 *         <FormLabel required>Email Address</FormLabel>
 *         <Input
 *           value={value}
 *           onChange={onChange}
 *           state={invalid ? 'error' : 'default'}
 *         />
 *         {error && <FormMessage>{error}</FormMessage>}
 *       </FormItem>
 *     )}
 *   </FormField>
 * </Form>
 * ```
 */
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import type { VariantProps } from "class-variance-authority";
import { type FieldValues, type RegisterOptions, type UseFormReturn } from "react-hook-form";
import type { ValidationRule } from "../types";
declare const formVariants: (props?: ({
    layout?: "inline" | "horizontal" | "vertical" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const inputVariants: (props?: ({
    variant?: "default" | "outlined" | "filled" | "underlined" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
    state?: "default" | "error" | "warning" | "success" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
interface FormContextValue {
    form: UseFormReturn<FieldValues>;
}
export declare const useFormContext: () => FormContextValue;
/**
 * Form Provider component that manages form state and validation
 *
 * Wraps children with form context and handles form submission. Uses React Hook Form
 * for state management and validation. Supports different layouts and sizes.
 *
 * @param form - React Hook Form instance created with useForm()
 * @param onSubmit - Function called when form is submitted with valid data
 * @param layout - Visual layout of the form: 'vertical' | 'horizontal' | 'inline'
 * @param size - Size variant: 'sm' | 'md' | 'lg'
 * @param asChild - Merge props into child element instead of rendering a form
 * @param children - Form fields and content
 *
 * @example
 * ```tsx
 * const form = useForm<LoginData>();
 *
 * return (
 *   <Form
 *     form={form}
 *     layout="vertical"
 *     size="md"
 *     onSubmit={(data) => console.log('Submitted:', data)}
 *   >
 *     <FormField name="username">
 *       Field content here
 *     </FormField>
 *   </Form>
 * );
 * ```
 */
export interface FormProps<TFieldValues extends FieldValues = FieldValues> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">, VariantProps<typeof formVariants> {
    /** React Hook Form instance */
    form: UseFormReturn<TFieldValues>;
    /** Callback function called when form is submitted with valid data */
    onSubmit: (data: TFieldValues) => void | Promise<void>;
    /** Render as child element instead of form tag */
    asChild?: boolean;
}
export declare function Form<TFieldValues extends FieldValues = FieldValues>({ form, onSubmit, children, layout, size, className, asChild, ...props }: FormProps<TFieldValues>): import("react/jsx-runtime").JSX.Element;
export interface FormFieldProps {
    name: string;
    rules?: ValidationRule;
    defaultValue?: unknown;
    children: (field: {
        value: unknown;
        onChange: (value: unknown) => void;
        onBlur: () => void;
        error?: string;
        invalid: boolean;
    }) => React.ReactNode;
}
export declare function FormField({ name, rules, defaultValue, children }: FormFieldProps): import("react/jsx-runtime").JSX.Element;
export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const FormItem: React.ForwardRefExoticComponent<FormItemProps & React.RefAttributes<HTMLDivElement>>;
export interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
    required?: boolean;
}
export declare const FormLabel: React.ForwardRefExoticComponent<FormLabelProps & React.RefAttributes<HTMLLabelElement>>;
export declare const FormDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>>;
export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
    variant?: "error" | "success" | "warning" | "info";
}
export declare const FormMessage: React.ForwardRefExoticComponent<FormMessageProps & React.RefAttributes<HTMLParagraphElement>>;
/**
 * Accessible input component with support for icons and validation states
 *
 * Provides a flexible input field that supports various visual states and
 * accessibility features. Can include start/end icons and integrates with
 * form validation systems.
 *
 * @param variant - Visual style: 'default' | 'outlined' | 'filled' | 'underlined'
 * @param size - Size variant: 'sm' | 'md' | 'lg'
 * @param state - Validation state: 'default' | 'error' | 'success' | 'warning'
 * @param type - HTML input type (text, email, password, etc.)
 * @param startIcon - Icon element to display at the start of the input
 * @param endIcon - Icon element to display at the end of the input
 * @param asChild - Merge props into child element instead of rendering input
 *
 * @example
 * ```tsx
 * return (
 *   <Input
 *     type="email"
 *     variant="outlined"
 *     size="md"
 *     state="error"
 *     startIcon={MailIcon}
 *     placeholder="Enter your email"
 *     aria-describedby="email-error"
 *   />
 * );
 * ```
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, VariantProps<typeof inputVariants> {
    /** Render as child element instead of input tag */
    asChild?: boolean;
    /** Icon to display at the start of the input */
    startIcon?: React.ReactNode;
    /** Icon to display at the end of the input */
    endIcon?: React.ReactNode;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof inputVariants> {
    asChild?: boolean;
    resize?: "none" | "vertical" | "horizontal" | "both";
}
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">, VariantProps<typeof inputVariants> {
    asChild?: boolean;
    placeholder?: string;
    options?: Array<{
        value: string;
        label: string;
        disabled?: boolean;
    }>;
}
export declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    "data-testid"?: string;
    label?: string;
    description?: string;
    indeterminate?: boolean;
    id?: string;
}
export declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    "data-testid"?: string;
    label?: string;
    description?: string;
    id?: string;
}
export declare const Radio: React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>>;
export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    value?: string;
    onValueChange?: (value: string) => void;
    options: Array<{
        value: string;
        label: string;
        description?: string;
        disabled?: boolean;
    }>;
    orientation?: "horizontal" | "vertical";
}
export declare const RadioGroup: React.ForwardRefExoticComponent<RadioGroupProps & React.RefAttributes<HTMLDivElement>>;
export declare function createValidationRules(rules: ValidationRule): RegisterOptions;
export declare const validationPatterns: {
    email: {
        value: RegExp;
        message: string;
    };
    phone: {
        value: RegExp;
        message: string;
    };
    url: {
        value: RegExp;
        message: string;
    };
    ipAddress: {
        value: RegExp;
        message: string;
    };
};
export {};
//# sourceMappingURL=Form.d.ts.map