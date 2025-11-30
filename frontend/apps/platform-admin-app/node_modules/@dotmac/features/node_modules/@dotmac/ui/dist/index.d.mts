import * as react_jsx_runtime from 'react/jsx-runtime';
import { ColumnDef, Row, Column } from '@tanstack/react-table';
export { ColumnDef, Row } from '@tanstack/react-table';
import * as React$1 from 'react';
import React__default, { ReactNode } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { DialogProps } from '@radix-ui/react-dialog';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { LucideIcon } from 'lucide-react';
import * as _radix_ui_react_slot from '@radix-ui/react-slot';
import * as react_hook_form from 'react-hook-form';
import { FieldValues, FormProviderProps, FieldPath, ControllerProps } from 'react-hook-form';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { DayPickerProps, DateRange } from 'react-day-picker';
import { ClassValue } from 'clsx';

/**
 * Reusable ConfirmDialog component
 * Used for confirmation dialogs across the application
 * Supports different variants (default, destructive, warning)
 */
type ConfirmDialogVariant = "default" | "destructive" | "warning";
interface ConfirmDialogProps {
    /**
     * Whether the dialog is open
     */
    open: boolean;
    /**
     * Callback when the open state changes
     */
    onOpenChange: (open: boolean) => void;
    /**
     * Dialog title
     */
    title: string;
    /**
     * Dialog description/message
     */
    description: string;
    /**
     * Text for the confirm button
     */
    confirmText?: string;
    /**
     * Text for the cancel button
     */
    cancelText?: string;
    /**
     * Callback when confirmed
     */
    onConfirm: () => void | Promise<void>;
    /**
     * Callback when cancelled
     */
    onCancel?: () => void;
    /**
     * Visual variant
     */
    variant?: ConfirmDialogVariant;
    /**
     * Whether the action is loading
     */
    isLoading?: boolean;
}
declare function ConfirmDialog({ open, onOpenChange, title, description, confirmText, cancelText, onConfirm, onCancel, variant, isLoading, }: ConfirmDialogProps): react_jsx_runtime.JSX.Element;

type TranslationFormatter = (value: number) => string;
interface EnhancedDataTableTranslations {
    searchPlaceholder: string;
    filtersLabel: string;
    clearFilters: string;
    quickFiltersClear: string;
    exportLabel: string;
    columnsLabel: string;
    bulkActionsLabel: string;
    selectedCount: (selected: number, total: number) => string;
    totalCount: TranslationFormatter;
    loadingLabel: string;
    rowsPerPage: string;
    pageOf: (page: number, pageCount: number) => string;
    previous: string;
    next: string;
}
interface BulkAction<TData> {
    label: string;
    icon?: React$1.ElementType;
    action: (selectedRows: TData[]) => void | Promise<void>;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    disabled?: (selectedRows: TData[]) => boolean;
    confirmMessage?: string;
    confirmTitle?: string;
    confirmConfirmText?: string;
    confirmVariant?: ConfirmDialogVariant;
}
interface QuickFilter<TData> {
    label: string;
    icon?: React$1.ComponentType<{
        className?: string;
    }>;
    description?: string;
    defaultActive?: boolean;
    filter: (row: TData) => boolean;
}
interface FilterConfig {
    column: string;
    label: string;
    type: "text" | "select" | "date" | "number";
    options?: {
        label: string;
        value: string;
    }[];
}
interface SearchConfig<TData> {
    placeholder?: string;
    searchableFields?: (keyof TData)[];
}
interface EnhancedDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchable?: boolean;
    searchPlaceholder?: string;
    searchColumn?: string;
    searchKey?: string;
    searchConfig?: SearchConfig<TData>;
    paginated?: boolean;
    pagination?: boolean;
    pageSizeOptions?: number[];
    defaultPageSize?: number;
    selectable?: boolean;
    bulkActions?: BulkAction<TData>[];
    filterable?: boolean;
    filters?: FilterConfig[];
    quickFilters?: QuickFilter<TData>[];
    exportable?: boolean;
    exportFilename?: string;
    exportColumns?: (keyof TData)[];
    columnVisibility?: boolean;
    emptyMessage?: string;
    className?: string;
    isLoading?: boolean;
    onRowClick?: (row: TData) => void;
    getRowId?: (row: TData, index: number, parent?: Row<TData>) => string | number;
    toolbarActions?: React$1.ReactNode;
    errorMessage?: string;
    error?: string;
    hideToolbar?: boolean;
    translations?: Partial<EnhancedDataTableTranslations>;
    enableResponsiveCards?: boolean;
    renderMobileCard?: (row: Row<TData>) => React$1.ReactNode;
    responsiveCardBreakpoint?: number;
}
/**
 * Export table data to CSV
 */
declare function exportToCSV<TData>(data: TData[], columns: (keyof TData)[], filename: string): void;
declare function EnhancedDataTable<TData, TValue>({ columns, data, searchable, searchPlaceholder, searchColumn, searchKey, searchConfig, paginated, pagination, pageSizeOptions, defaultPageSize, selectable, bulkActions, filterable, filters, quickFilters, exportable, exportFilename, exportColumns, columnVisibility, emptyMessage, className, isLoading, onRowClick, getRowId, toolbarActions, hideToolbar, errorMessage, error, translations, enableResponsiveCards, renderMobileCard, responsiveCardBreakpoint, }: EnhancedDataTableProps<TData, TValue>): react_jsx_runtime.JSX.Element;
/**
 * Export utilities for external use
 */
declare const DataTableUtils: {
    exportToCSV: typeof exportToCSV;
};

declare const AlertDialog: React$1.FC<AlertDialogPrimitive.AlertDialogProps>;
declare const AlertDialogTrigger: React$1.ForwardRefExoticComponent<AlertDialogPrimitive.AlertDialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const AlertDialogPortal: React$1.FC<AlertDialogPrimitive.AlertDialogPortalProps>;
declare const AlertDialogOverlay: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const AlertDialogContent: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const AlertDialogHeader: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const AlertDialogFooter: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const AlertDialogTitle: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
declare const AlertDialogDescription: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const AlertDialogAction: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogActionProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const AlertDialogCancel: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogCancelProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

declare const alertVariants: (props?: ({
    variant?: "default" | "destructive" | "warning" | "success" | "info" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface AlertProps extends React$1.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
}
declare const Alert: React$1.ForwardRefExoticComponent<AlertProps & React$1.RefAttributes<HTMLDivElement>>;
declare const AlertTitle: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLHeadingElement> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const AlertDescription: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLParagraphElement> & React$1.RefAttributes<HTMLParagraphElement>>;

declare const Avatar: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const AvatarImage: React$1.ForwardRefExoticComponent<React$1.ImgHTMLAttributes<HTMLImageElement> & React$1.RefAttributes<HTMLImageElement>>;
declare const AvatarFallback: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;

declare const badgeVariants: (props?: ({
    variant?: "default" | "secondary" | "destructive" | "outline" | "warning" | "success" | "info" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface BadgeProps extends React$1.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
}
declare function Badge({ className, variant, ...props }: BadgeProps): react_jsx_runtime.JSX.Element;

interface BreadcrumbItem {
    label: string;
    href?: string;
}
interface BreadcrumbProps {
    items: BreadcrumbItem[];
}
declare function Breadcrumb({ items }: BreadcrumbProps): react_jsx_runtime.JSX.Element;

declare const buttonVariants: (props?: ({
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface ButtonProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
declare const Button: React$1.ForwardRefExoticComponent<ButtonProps & React$1.RefAttributes<HTMLButtonElement>>;

declare const cardVariants: (props?: ({
    variant?: "default" | "outline" | "ghost" | "elevated" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface CardProps extends React$1.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
}
declare const Card: React$1.ForwardRefExoticComponent<CardProps & React$1.RefAttributes<HTMLDivElement>>;
declare const CardHeader: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CardTitle: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLHeadingElement> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const CardDescription: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLParagraphElement> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const CardContent: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CardFooter: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;

interface CheckboxProps extends React$1.InputHTMLAttributes<HTMLInputElement> {
}
declare const Checkbox: React$1.ForwardRefExoticComponent<CheckboxProps & React$1.RefAttributes<HTMLInputElement>>;

declare const Command: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "asChild" | "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    label?: string;
    shouldFilter?: boolean;
    filter?: (value: string, search: string, keywords?: string[]) => number;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    loop?: boolean;
    disablePointerSelection?: boolean;
    vimBindings?: boolean;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
interface CommandDialogProps extends DialogProps {
}
declare const CommandDialog: ({ children, ...props }: CommandDialogProps) => react_jsx_runtime.JSX.Element;
declare const CommandInput: React$1.ForwardRefExoticComponent<Omit<Omit<Pick<Pick<React$1.DetailedHTMLProps<React$1.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "key" | keyof React$1.InputHTMLAttributes<HTMLInputElement>> & {
    ref?: React$1.Ref<HTMLInputElement>;
} & {
    asChild?: boolean;
}, "asChild" | "key" | keyof React$1.InputHTMLAttributes<HTMLInputElement>>, "type" | "value" | "onChange"> & {
    value?: string;
    onValueChange?: (search: string) => void;
} & React$1.RefAttributes<HTMLInputElement>, "ref"> & React$1.RefAttributes<HTMLInputElement>>;
declare const CommandList: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "asChild" | "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    label?: string;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandEmpty: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "asChild" | "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandGroup: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Omit<Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "asChild" | "key" | keyof React$1.HTMLAttributes<HTMLDivElement>>, "value" | "heading"> & {
    heading?: React$1.ReactNode;
    value?: string;
    forceMount?: boolean;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandSeparator: React$1.ForwardRefExoticComponent<Omit<Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "asChild" | "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    alwaysRender?: boolean;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandItem: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Omit<Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "asChild" | "key" | keyof React$1.HTMLAttributes<HTMLDivElement>>, "disabled" | "value" | "onSelect"> & {
    disabled?: boolean;
    onSelect?: (value: string) => void;
    value?: string;
    keywords?: string[];
    forceMount?: boolean;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandShortcut: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLSpanElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};

interface ConfirmDialogOptions {
    title?: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmDialogVariant;
    isLoading?: boolean;
}
declare function ConfirmDialogProvider({ children }: {
    children: React.ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function useConfirmDialog(): (options: ConfirmDialogOptions) => Promise<boolean>;

interface DataTableProps<TData, TValue> {
    /**
     * Column definitions for the table
     */
    columns: ColumnDef<TData, TValue>[];
    /**
     * Data to display in the table
     */
    data: TData[];
    /**
     * Enable global search/filter
     */
    searchable?: boolean;
    /**
     * Placeholder for search input
     */
    searchPlaceholder?: string;
    /**
     * Column ID to search on
     */
    searchColumn?: string;
    /**
     * Enable pagination
     */
    paginated?: boolean;
    /**
     * Page size options
     */
    pageSizeOptions?: number[];
    /**
     * Default page size
     */
    defaultPageSize?: number;
    /**
     * Enable column visibility toggle
     */
    columnVisibility?: boolean;
    /**
     * Custom empty state message
     */
    emptyMessage?: string;
    /**
     * Additional className for table wrapper
     */
    className?: string;
    /**
     * Loading state
     */
    isLoading?: boolean;
    /**
     * Callback when row is clicked
     */
    onRowClick?: (row: TData) => void;
}
declare function DataTable<TData, TValue>({ columns, data, searchable, searchPlaceholder, searchColumn, paginated, pageSizeOptions, defaultPageSize, columnVisibility, emptyMessage, className, isLoading, onRowClick, }: DataTableProps<TData, TValue>): react_jsx_runtime.JSX.Element;
/**
 * Helper function to create a sortable column header
 * Usage: column.header = createSortableHeader("Name")
 */
declare function createSortableHeader<TData, TValue>(label: string): {
    ({ column }: {
        column: Column<TData, TValue>;
    }): react_jsx_runtime.JSX.Element;
    displayName: string;
};

declare const Dialog: React$1.FC<DialogPrimitive.DialogProps>;
declare const DialogTrigger: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DialogPortal: React$1.FC<DialogPrimitive.DialogPortalProps>;
declare const DialogClose: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DialogOverlay: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DialogContent: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DialogHeader: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const DialogFooter: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const DialogTitle: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
declare const DialogDescription: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;

declare const DropdownMenu: {
    ({ modal, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Root>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const DropdownMenuTrigger: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DropdownMenuGroup: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuPortal: React$1.FC<DropdownMenuPrimitive.DropdownMenuPortalProps>;
declare const DropdownMenuSub: React$1.FC<DropdownMenuPrimitive.DropdownMenuSubProps>;
declare const DropdownMenuRadioGroup: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuRadioGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubTrigger: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSubTriggerProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubContent: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSubContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuContent: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuCheckboxItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuCheckboxItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuRadioItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuRadioItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuLabel: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuLabelProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSeparator: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuShortcut: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLSpanElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};

interface EmptyStateProps {
    /**
     * Icon to display
     */
    icon?: LucideIcon;
    /**
     * Title text
     */
    title: string;
    /**
     * Description text or element
     */
    description?: ReactNode;
    /**
     * Primary action button
     */
    action?: {
        label: string;
        onClick: () => void;
        icon?: LucideIcon;
    };
    /**
     * Secondary action button
     */
    secondaryAction?: {
        label: string;
        onClick: () => void;
        icon?: LucideIcon;
    };
    /**
     * Custom content to render below description
     */
    children?: ReactNode;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Size variant
     */
    size?: "sm" | "md" | "lg";
}
declare function EmptyState({ icon: Icon, title, description, action, secondaryAction, children, className, size, }: EmptyStateProps): react_jsx_runtime.JSX.Element;
declare namespace EmptyState {
    var List: ({ entityName, onCreateClick, createLabel, icon: Icon, className, }: {
        entityName: string;
        onCreateClick?: () => void;
        createLabel?: string;
        icon?: LucideIcon;
        className?: string;
    }) => react_jsx_runtime.JSX.Element;
    var Search: ({ searchTerm, onClearSearch, icon: Icon, className, }: {
        searchTerm?: string;
        onClearSearch?: () => void;
        icon?: LucideIcon;
        className?: string;
    }) => react_jsx_runtime.JSX.Element;
    var Error: ({ title, description, onRetry, retryLabel, icon: Icon, className, }: {
        title?: string;
        description?: string;
        onRetry?: () => void;
        retryLabel?: string;
        icon?: LucideIcon;
        className?: string;
    }) => react_jsx_runtime.JSX.Element;
}

interface ErrorStateProps {
    title?: string;
    message: string;
    icon?: LucideIcon;
    onRetry?: () => void;
    retryLabel?: string;
    className?: string;
    variant?: "inline" | "card" | "full";
}
declare function ErrorState({ title, message, icon: Icon, onRetry, retryLabel, className, variant, }: ErrorStateProps): react_jsx_runtime.JSX.Element;
interface ErrorBoundaryFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}
declare function ErrorBoundaryFallback({ error, resetErrorBoundary }: ErrorBoundaryFallbackProps): react_jsx_runtime.JSX.Element;

declare const Form: <TFieldValues extends FieldValues = FieldValues>({ children, ...props }: FormProviderProps<TFieldValues>) => react_jsx_runtime.JSX.Element;
declare const FormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ ...props }: ControllerProps<TFieldValues, TName>) => react_jsx_runtime.JSX.Element;
declare const useFormField: () => {
    invalid: boolean;
    isDirty: boolean;
    isTouched: boolean;
    isValidating: boolean;
    error?: react_hook_form.FieldError;
    id: string;
    name: string;
    formItemId: string;
    formDescriptionId: string;
    formMessageId: string;
};
declare const FormItem: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const FormLabel: React$1.ForwardRefExoticComponent<Omit<LabelPrimitive.LabelProps & React$1.RefAttributes<HTMLLabelElement>, "ref"> & React$1.RefAttributes<HTMLLabelElement>>;
declare const FormControl: React$1.ForwardRefExoticComponent<Omit<_radix_ui_react_slot.SlotProps & React$1.RefAttributes<HTMLElement>, "ref"> & React$1.RefAttributes<HTMLElement>>;
declare const FormDescription: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLParagraphElement> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const FormMessage: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLParagraphElement> & React$1.RefAttributes<HTMLParagraphElement>>;

interface FormErrorProps {
    id?: string;
    error?: string;
    className?: string;
}
declare function FormError({ id, error, className }: FormErrorProps): react_jsx_runtime.JSX.Element | null;

interface InputProps extends React$1.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}
declare const Input: React$1.ForwardRefExoticComponent<InputProps & React$1.RefAttributes<HTMLInputElement>>;

interface LabelProps extends React$1.LabelHTMLAttributes<HTMLLabelElement> {
}
declare const Label: React$1.ForwardRefExoticComponent<LabelProps & React$1.RefAttributes<HTMLLabelElement>>;

interface LiveIndicatorProps {
    lastUpdated?: Date | null;
    isRefreshing?: boolean;
    onRefresh?: () => void;
    className?: string;
}
declare function LiveIndicator({ lastUpdated, isRefreshing, onRefresh, className, }: LiveIndicatorProps): react_jsx_runtime.JSX.Element;

interface LoadingOverlayProps {
    loading?: boolean;
    message?: string;
    className?: string;
    variant?: "spinner" | "pulse" | "dots";
    size?: "sm" | "md" | "lg";
}
declare function LoadingOverlay({ loading, message, className, variant, size, }: LoadingOverlayProps): react_jsx_runtime.JSX.Element | null;
interface InlineLoaderProps {
    message?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}
declare function InlineLoader({ message, size, className }: InlineLoaderProps): react_jsx_runtime.JSX.Element;

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    label?: string;
}
/**
 * Standard loading spinner
 */
declare function LoadingSpinner({ size, className, label }: LoadingSpinnerProps): react_jsx_runtime.JSX.Element;
interface LoadingCardProps {
    lines?: number;
    showAvatar?: boolean;
    className?: string;
}
/**
 * Skeleton loading card
 */
declare function LoadingCard({ lines, showAvatar, className }: LoadingCardProps): react_jsx_runtime.JSX.Element;
interface LoadingTableProps {
    rows?: number;
    columns?: number;
    className?: string;
}
/**
 * Skeleton loading table
 */
declare function LoadingTable({ rows, columns, className }: LoadingTableProps): react_jsx_runtime.JSX.Element;
interface LoadingGridProps {
    items?: number;
    columns?: number;
    className?: string;
}
/**
 * Skeleton loading grid
 */
declare function LoadingGrid({ items, columns, className }: LoadingGridProps): react_jsx_runtime.JSX.Element;
interface LoadingStateProps {
    loading: boolean;
    error?: Error | null;
    empty?: boolean;
    children: React__default.ReactNode;
    loadingComponent?: React__default.ReactNode;
    errorComponent?: React__default.ReactNode;
    emptyComponent?: React__default.ReactNode;
    emptyMessage?: string;
    emptyIcon?: React__default.ReactNode;
}
/**
 * Wrapper component for consistent loading states
 */
declare function LoadingState({ loading, error, empty, children, loadingComponent, errorComponent, emptyComponent, emptyMessage, emptyIcon, }: LoadingStateProps): react_jsx_runtime.JSX.Element;
interface AsyncStateProps<T> {
    data?: T;
    loading: boolean;
    error?: Error | null;
    children: (data: T) => React__default.ReactNode;
    loadingComponent?: React__default.ReactNode;
    errorComponent?: React__default.ReactNode;
    emptyComponent?: React__default.ReactNode;
    isEmpty?: (data: T) => boolean;
}
/**
 * Generic async state wrapper
 */
declare function AsyncState<T>({ data, loading, error, children, loadingComponent, errorComponent, emptyComponent, isEmpty, }: AsyncStateProps<T>): react_jsx_runtime.JSX.Element;
interface ButtonLoadingProps {
    loading?: boolean;
    children: React__default.ReactNode;
    loadingText?: string;
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
}
/**
 * Button with loading state
 */
declare function ButtonLoading({ loading, children, loadingText, className, onClick, type, variant, disabled, }: ButtonLoadingProps): react_jsx_runtime.JSX.Element;
/**
 * Progress indicator for multi-step processes
 */
interface ProgressIndicatorProps {
    steps: Array<{
        label: string;
        status: "pending" | "active" | "completed" | "error";
    }>;
    className?: string;
}
declare function ProgressIndicator({ steps, className }: ProgressIndicatorProps): react_jsx_runtime.JSX.Element;

interface MetricCardEnhancedProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    href?: string;
    currency?: boolean;
    loading?: boolean;
    error?: string;
    emptyStateMessage?: string;
    className?: string;
}
declare function MetricCardEnhanced({ title, value, subtitle, icon: Icon, trend, href, currency, loading, error, emptyStateMessage, className, }: MetricCardEnhancedProps): react_jsx_runtime.JSX.Element;

interface PageHeaderProps {
    /**
     * Page title
     */
    title: string;
    /**
     * Optional subtitle/description
     */
    description?: string;
    /**
     * Optional icon to display before title
     */
    icon?: LucideIcon;
    /**
     * Action buttons or elements to display on the right
     */
    actions?: ReactNode;
    /**
     * Additional content below title/description
     */
    children?: ReactNode;
    /**
     * Custom className for the container
     */
    className?: string;
    /**
     * Whether to show a bottom border
     */
    showBorder?: boolean;
}
declare function PageHeader({ title, description, icon: Icon, actions, children, className, showBorder, }: PageHeaderProps): react_jsx_runtime.JSX.Element;
declare namespace PageHeader {
    var Actions: ({ children, className, }: {
        children: React.ReactNode;
        className?: string;
    }) => react_jsx_runtime.JSX.Element;
    var Stat: ({ label, value, icon: Icon, className, }: {
        label: string;
        value: string | number;
        icon?: LucideIcon;
        className?: string;
    }) => react_jsx_runtime.JSX.Element;
    var Breadcrumb: ({ items, className, }: {
        items: Array<{
            label: string;
            href?: string;
        }>;
        className?: string;
    }) => react_jsx_runtime.JSX.Element;
}

/**
 * Portal Badge Component
 *
 * Visual indicator showing which portal the user is currently viewing
 * Uses portal theme colors and metadata
 */
interface PortalBadgeProps {
    /** Show icon alongside text */
    showIcon?: boolean;
    /** Use short name instead of full name */
    shortName?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Size variant */
    size?: "sm" | "md" | "lg";
}
/**
 * Portal Badge - Shows current portal with color-coded indicator
 *
 * @example
 * ```tsx
 * // Default usage
 * <PortalBadge />
 *
 * // With icon and short name
 * <PortalBadge showIcon shortName size="sm" />
 * ```
 */
declare function PortalBadge({ showIcon, shortName, className, size, }: PortalBadgeProps): react_jsx_runtime.JSX.Element;
/**
 * Portal Badge Compact - Minimal version with just icon
 */
declare function PortalBadgeCompact({ className }: {
    className?: string;
}): react_jsx_runtime.JSX.Element;
/**
 * Portal User Type Badge - Shows what type of user is expected in this portal
 */
declare function PortalUserTypeBadge({ className }: {
    className?: string;
}): react_jsx_runtime.JSX.Element;
/**
 * Portal Indicator Dot - Subtle colored dot for navigation items
 */
declare function PortalIndicatorDot({ className }: {
    className?: string;
}): react_jsx_runtime.JSX.Element;

declare const portalButtonVariants: (props?: ({
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | "accent" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface PortalButtonProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof portalButtonVariants> {
}
declare const PortalButton: React$1.ForwardRefExoticComponent<PortalButtonProps & React$1.RefAttributes<HTMLButtonElement>>;

/**
 * Portal-Aware Card Component
 *
 * Card component that adapts styling based on current portal
 * Includes portal-specific animations and spacing
 */

interface PortalCardProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** Enable hover effect */
    hoverable?: boolean;
    /** Enable click interaction */
    interactive?: boolean;
    /** Portal-specific animation variant */
    variant?: "default" | "elevated" | "outlined" | "flat";
}
declare const PortalCard: React$1.ForwardRefExoticComponent<PortalCardProps & React$1.RefAttributes<HTMLDivElement>>;
declare const PortalCardHeader: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const PortalCardTitle: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLHeadingElement> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const PortalCardDescription: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLParagraphElement> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const PortalCardContent: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const PortalCardFooter: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;

interface ProgressProps extends React$1.HTMLAttributes<HTMLDivElement> {
    value?: number;
    indicatorClassName?: string;
}
declare const Progress: React$1.ForwardRefExoticComponent<ProgressProps & React$1.RefAttributes<HTMLDivElement>>;

interface RadioGroupProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "onChange"> {
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    name?: string;
}
declare const RadioGroup: React$1.ForwardRefExoticComponent<RadioGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const RadioGroupItem: React$1.ForwardRefExoticComponent<React$1.InputHTMLAttributes<HTMLInputElement> & React$1.RefAttributes<HTMLInputElement>>;

declare const ScrollArea: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const ScrollBar: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;

type SelectProps = React$1.ComponentProps<typeof SelectPrimitive.Root>;
declare const Select: {
    ({ children, open: openProp, defaultOpen, onOpenChange, ...props }: SelectProps): react_jsx_runtime.JSX.Element;
    displayName: string | undefined;
};
declare const SelectGroup: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectGroupProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectValue: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectValueProps & React$1.RefAttributes<HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;
declare const SelectTrigger: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const SelectContent: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectLabel: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectLabelProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectItem: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectSeparator: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectSeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectScrollUpButton: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectScrollUpButtonProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectScrollDownButton: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectScrollDownButtonProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

interface SeparatorProps extends React$1.HTMLAttributes<HTMLDivElement> {
    className?: string;
    orientation?: "horizontal" | "vertical";
}
declare const Separator: React$1.ForwardRefExoticComponent<SeparatorProps & React$1.RefAttributes<HTMLDivElement>>;

interface SkeletonProps extends React$1.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "text" | "circular" | "rectangular";
}
declare function Skeleton({ className, variant, ...props }: SkeletonProps): react_jsx_runtime.JSX.Element;
declare function SkeletonCard(): react_jsx_runtime.JSX.Element;
declare function SkeletonMetricCard(): react_jsx_runtime.JSX.Element;
declare function SkeletonTable({ rows }: {
    rows?: number;
}): react_jsx_runtime.JSX.Element;

declare function SkipLink(): react_jsx_runtime.JSX.Element;

/**
 * Reusable StatusBadge component
 * Used across the application for consistent status display
 * Supports dark mode and various status types
 */
type StatusVariant = "success" | "warning" | "error" | "info" | "pending" | "active" | "inactive" | "suspended" | "terminated" | "paid" | "unpaid" | "overdue" | "draft" | "published" | "archived" | "default";
interface StatusBadgeProps {
    /**
     * The status text to display
     */
    children: React.ReactNode;
    /**
     * Visual variant of the badge
     * Maps to predefined color schemes
     */
    variant?: StatusVariant;
    /**
     * Optional custom className for additional styling
     */
    className?: string;
    /**
     * Size variant
     */
    size?: "sm" | "md" | "lg";
    /**
     * Show a dot indicator
     */
    showDot?: boolean;
}
declare function StatusBadge({ children, variant, className, size, showDot, }: StatusBadgeProps): react_jsx_runtime.JSX.Element;
/**
 * Helper function to automatically determine variant from status string
 * Usage: <StatusBadge variant={getStatusVariant(status)}>{status}</StatusBadge>
 */
declare function getStatusVariant(status: string): StatusVariant;

interface SwitchProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement> {
    checked?: boolean | undefined;
    onCheckedChange?: (checked: boolean) => void;
}
declare const Switch: React$1.ForwardRefExoticComponent<SwitchProps & React$1.RefAttributes<HTMLButtonElement>>;

declare const Table: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableElement> & React$1.RefAttributes<HTMLTableElement>>;
declare const TableHeader: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableSectionElement> & React$1.RefAttributes<HTMLTableSectionElement>>;
declare const TableBody: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableSectionElement> & React$1.RefAttributes<HTMLTableSectionElement>>;
declare const TableFooter: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableSectionElement> & React$1.RefAttributes<HTMLTableSectionElement>>;
declare const TableRow: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableRowElement> & React$1.RefAttributes<HTMLTableRowElement>>;
declare const TableHead: React$1.ForwardRefExoticComponent<React$1.ThHTMLAttributes<HTMLTableCellElement> & React$1.RefAttributes<HTMLTableCellElement>>;
declare const TableCell: React$1.ForwardRefExoticComponent<React$1.TdHTMLAttributes<HTMLTableCellElement> & React$1.RefAttributes<HTMLTableCellElement>>;
declare const TableCaption: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableCaptionElement> & React$1.RefAttributes<HTMLTableCaptionElement>>;

/**
 * Reusable Table Pagination component
 * Extracted from DataTable to support both client-side and server-side pagination
 */
interface TablePaginationProps {
    /**
     * Current page index (0-based)
     */
    pageIndex: number;
    /**
     * Total number of pages
     */
    pageCount: number;
    /**
     * Current page size
     */
    pageSize: number;
    /**
     * Available page size options
     */
    pageSizeOptions?: number[];
    /**
     * Total number of items (optional, for display)
     */
    totalItems?: number;
    /**
     * Whether there's a next page available (for server-side pagination)
     */
    canNextPage?: boolean;
    /**
     * Whether there's a previous page available (for server-side pagination)
     */
    canPreviousPage?: boolean;
    /**
     * Callback when page changes
     */
    onPageChange: (pageIndex: number) => void;
    /**
     * Callback when page size changes
     */
    onPageSizeChange: (pageSize: number) => void;
    /**
     * Number of selected rows (optional)
     */
    selectedCount?: number;
    /**
     * Total filtered items (optional)
     */
    filteredCount?: number;
    /**
     * Additional className
     */
    className?: string;
}
declare function TablePagination({ pageIndex, pageCount, pageSize, pageSizeOptions, totalItems, canNextPage, canPreviousPage, onPageChange, onPageSizeChange, selectedCount, filteredCount, className, }: TablePaginationProps): react_jsx_runtime.JSX.Element;
/**
 * Hook for managing pagination state
 */
declare function usePagination(defaultPageSize?: number): {
    pageIndex: number;
    pageSize: number;
    offset: number;
    limit: number;
    onPageChange: (newPageIndex: number) => void;
    onPageSizeChange: (newPageSize: number) => void;
    resetPagination: () => void;
};

interface TabsProps extends React$1.HTMLAttributes<HTMLDivElement> {
    children: React$1.ReactNode;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    orientation?: "horizontal" | "vertical";
}
interface TabsListProps extends React$1.HTMLAttributes<HTMLDivElement> {
    children: React$1.ReactNode;
    className?: string;
}
interface TabsTriggerProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React$1.ReactNode;
    className?: string;
    value: string;
}
interface TabsContentProps extends React$1.HTMLAttributes<HTMLDivElement> {
    children: React$1.ReactNode;
    className?: string;
    value: string;
}
declare const Tabs: React$1.ForwardRefExoticComponent<TabsProps & React$1.RefAttributes<HTMLDivElement>>;
declare const TabsList: React$1.ForwardRefExoticComponent<TabsListProps & React$1.RefAttributes<HTMLDivElement>>;
declare const TabsTrigger: React$1.ForwardRefExoticComponent<TabsTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const TabsContent: React$1.ForwardRefExoticComponent<TabsContentProps & React$1.RefAttributes<HTMLDivElement>>;

interface TextareaProps extends React$1.TextareaHTMLAttributes<HTMLTextAreaElement> {
}
declare const Textarea: React$1.ForwardRefExoticComponent<TextareaProps & React$1.RefAttributes<HTMLTextAreaElement>>;

interface ThemeToggleProps {
    className?: string;
    labels?: {
        light?: string;
        dark?: string;
        system?: string;
        switchTo?: (theme: string) => string;
        modeTitle?: (theme: string) => string;
    };
}
declare function ThemeToggle({ className, labels }: ThemeToggleProps): react_jsx_runtime.JSX.Element;
interface ThemeToggleButtonProps {
    className?: string;
    labels?: {
        light?: string;
        dark?: string;
        switchTo?: (theme: string) => string;
    };
}
declare function ThemeToggleButton({ className, labels }: ThemeToggleButtonProps): react_jsx_runtime.JSX.Element;

declare const toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
};
declare function ToastContainer(): react_jsx_runtime.JSX.Element;

declare const TooltipProvider: ({ children, delayDuration, skipDelayDuration, disableHoverableContent, ...props }: React$1.ComponentProps<typeof TooltipPrimitive.Provider>) => react_jsx_runtime.JSX.Element;
declare const Tooltip: React$1.FC<TooltipPrimitive.TooltipProps>;
declare const TooltipTrigger: React$1.ForwardRefExoticComponent<TooltipPrimitive.TooltipTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const TooltipContent: React$1.ForwardRefExoticComponent<Omit<TooltipPrimitive.TooltipContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const Sheet: React$1.FC<DialogPrimitive.DialogProps>;
declare const SheetTrigger: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const SheetClose: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const SheetPortal: React$1.FC<DialogPrimitive.DialogPortalProps>;
declare const SheetOverlay: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const sheetVariants: (props?: ({
    side?: "top" | "right" | "bottom" | "left" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface SheetContentProps extends React$1.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, VariantProps<typeof sheetVariants> {
}
declare const SheetContent: React$1.ForwardRefExoticComponent<SheetContentProps & React$1.RefAttributes<HTMLDivElement>>;
declare const SheetHeader: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const SheetFooter: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const SheetTitle: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
declare const SheetDescription: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;

declare const Popover: ({ children, ...props }: React$1.ComponentProps<typeof PopoverPrimitive.Root>) => react_jsx_runtime.JSX.Element;
declare const PopoverTrigger: React$1.ForwardRefExoticComponent<Omit<PopoverPrimitive.PopoverTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const PopoverAnchor: React$1.ForwardRefExoticComponent<PopoverPrimitive.PopoverAnchorProps & React$1.RefAttributes<HTMLDivElement>>;
declare const PopoverContent: React$1.ForwardRefExoticComponent<Omit<PopoverPrimitive.PopoverContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

/**
 * Combobox Component
 *
 * A searchable select component that combines input and dropdown functionality.
 * Built on top of Command component with Popover for accessibility.
 */
interface ComboboxOption {
    value: string;
    label: string;
    disabled?: boolean;
}
interface ComboboxProps {
    options: ComboboxOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    disabled?: boolean;
    className?: string;
}
declare function Combobox({ options, value, onValueChange, placeholder, searchPlaceholder, emptyText, disabled, className, }: ComboboxProps): react_jsx_runtime.JSX.Element;
/**
 * Multi-select Combobox variant
 */
interface MultiComboboxProps extends Omit<ComboboxProps, "value" | "onValueChange"> {
    value?: string[];
    onValueChange?: (value: string[]) => void;
}
declare function MultiCombobox({ options, value, onValueChange, placeholder, searchPlaceholder, emptyText, disabled, className, }: MultiComboboxProps): react_jsx_runtime.JSX.Element;

type CalendarProps = DayPickerProps;
declare function Calendar({ className, classNames, showOutsideDays, defaultMonth, month, mode, ...props }: CalendarProps): react_jsx_runtime.JSX.Element;
declare namespace Calendar {
    var displayName: string;
}

interface DatePickerProps {
    date?: Date;
    onDateChange?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}
declare function DatePicker({ date, onDateChange, placeholder, disabled, className, }: DatePickerProps): react_jsx_runtime.JSX.Element;
interface DateRangePickerProps {
    dateRange?: DateRange;
    onDateRangeChange?: (range: DateRange | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}
declare function DateRangePicker({ dateRange, onDateRangeChange, placeholder, disabled, className, }: DateRangePickerProps): react_jsx_runtime.JSX.Element;

interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
}
declare function useToast(): {
    toast: ({ title, description, variant }: Omit<Toast, "id">) => void;
    toasts: Toast[];
};

/**
 * Portal utility functions (DEPRECATED)
 *
 * These utilities are maintained for backward compatibility only.
 * New code should use @dotmac/primitives UniversalTheme instead.
 */

type PortalType$1 = "admin" | "customer" | "reseller" | "technician" | "management";
interface PortalColorType {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
}
/**
 * Get portal configuration colors
 * @deprecated Use UniversalTheme from @dotmac/primitives instead
 */
declare function getPortalConfig(portal: PortalType$1): PortalColorType;
/**
 * Generate CSS variables for portal theme
 * @deprecated Use UniversalTheme from @dotmac/primitives instead
 */
declare function generatePortalCSSVariables(portal: PortalType$1): Record<string, string>;
/**
 * Get portal theme class name
 * @deprecated Use UniversalTheme from @dotmac/primitives instead
 */
declare function getPortalThemeClass(portal: PortalType$1): string;
/**
 * Combine class names using clsx + tailwind-merge to avoid style conflicts.
 */
declare function cn(...classNames: ClassValue[]): string;

/**
 * Design System - Color Tokens
 *
 * Portal-specific color schemes for visual differentiation
 * Each portal has a unique primary color to help users identify where they are
 */
declare const colorTokens: {
    /**
     * Portal 1: Platform Admin
     * Deep Blue - Authority, Trust, Technical Excellence
     */
    readonly platformAdmin: {
        readonly primary: {
            readonly 50: "hsl(217, 91%, 95%)";
            readonly 100: "hsl(217, 91%, 90%)";
            readonly 200: "hsl(217, 91%, 80%)";
            readonly 300: "hsl(217, 91%, 70%)";
            readonly 400: "hsl(217, 91%, 60%)";
            readonly 500: "hsl(217, 91%, 50%)";
            readonly 600: "hsl(217, 91%, 40%)";
            readonly 700: "hsl(217, 91%, 30%)";
            readonly 800: "hsl(217, 91%, 20%)";
            readonly 900: "hsl(217, 91%, 10%)";
        };
        readonly accent: {
            readonly DEFAULT: "hsl(189, 85%, 47%)";
        };
        readonly sidebar: "dark";
    };
    /**
     * Portal 2: Platform Resellers (Partners)
     * Orange - Energy, Sales, Action-Oriented
     */
    readonly platformResellers: {
        readonly primary: {
            readonly 50: "hsl(24, 95%, 95%)";
            readonly 100: "hsl(24, 95%, 90%)";
            readonly 200: "hsl(24, 95%, 80%)";
            readonly 300: "hsl(24, 95%, 70%)";
            readonly 400: "hsl(24, 95%, 60%)";
            readonly 500: "hsl(24, 95%, 53%)";
            readonly 600: "hsl(24, 95%, 43%)";
            readonly 700: "hsl(24, 95%, 33%)";
            readonly 800: "hsl(24, 95%, 23%)";
            readonly 900: "hsl(24, 95%, 13%)";
        };
        readonly accent: {
            readonly DEFAULT: "hsl(142, 71%, 45%)";
        };
        readonly sidebar: "light";
    };
    /**
     * Portal 3: Platform Tenants (ISPs)
     * Purple - Premium, Business, Professional
     */
    readonly platformTenants: {
        readonly primary: {
            readonly 50: "hsl(262, 83%, 95%)";
            readonly 100: "hsl(262, 83%, 90%)";
            readonly 200: "hsl(262, 83%, 80%)";
            readonly 300: "hsl(262, 83%, 70%)";
            readonly 400: "hsl(262, 83%, 60%)";
            readonly 500: "hsl(262, 83%, 58%)";
            readonly 600: "hsl(262, 83%, 48%)";
            readonly 700: "hsl(262, 83%, 38%)";
            readonly 800: "hsl(262, 83%, 28%)";
            readonly 900: "hsl(262, 83%, 18%)";
        };
        readonly accent: {
            readonly DEFAULT: "hsl(217, 91%, 60%)";
        };
        readonly sidebar: "light";
    };
    /**
     * Portal 4: ISP Admin
     * Blue - Professional, Operations, Reliable
     */
    readonly ispAdmin: {
        readonly primary: {
            readonly 50: "hsl(207, 90%, 95%)";
            readonly 100: "hsl(207, 90%, 90%)";
            readonly 200: "hsl(207, 90%, 80%)";
            readonly 300: "hsl(207, 90%, 70%)";
            readonly 400: "hsl(207, 90%, 60%)";
            readonly 500: "hsl(207, 90%, 54%)";
            readonly 600: "hsl(207, 90%, 44%)";
            readonly 700: "hsl(207, 90%, 34%)";
            readonly 800: "hsl(207, 90%, 24%)";
            readonly 900: "hsl(207, 90%, 14%)";
        };
        readonly accent: {
            readonly DEFAULT: "hsl(142, 71%, 45%)";
        };
        readonly sidebar: "dark";
    };
    /**
     * Portal 5: ISP Reseller
     * Green - Money, Success, Growth
     */
    readonly ispReseller: {
        readonly primary: {
            readonly 50: "hsl(142, 71%, 95%)";
            readonly 100: "hsl(142, 71%, 90%)";
            readonly 200: "hsl(142, 71%, 80%)";
            readonly 300: "hsl(142, 71%, 70%)";
            readonly 400: "hsl(142, 71%, 60%)";
            readonly 500: "hsl(142, 71%, 45%)";
            readonly 600: "hsl(142, 71%, 35%)";
            readonly 700: "hsl(142, 71%, 25%)";
            readonly 800: "hsl(142, 71%, 15%)";
            readonly 900: "hsl(142, 71%, 10%)";
        };
        readonly accent: {
            readonly DEFAULT: "hsl(24, 95%, 53%)";
        };
        readonly sidebar: "none";
    };
    /**
     * Portal 6: ISP Customer
     * Friendly Blue - Approachable, Trustworthy, Simple
     */
    readonly ispCustomer: {
        readonly primary: {
            readonly 50: "hsl(207, 90%, 95%)";
            readonly 100: "hsl(207, 90%, 90%)";
            readonly 200: "hsl(207, 90%, 80%)";
            readonly 300: "hsl(207, 90%, 70%)";
            readonly 400: "hsl(207, 90%, 60%)";
            readonly 500: "hsl(207, 90%, 54%)";
            readonly 600: "hsl(207, 90%, 44%)";
            readonly 700: "hsl(207, 90%, 34%)";
            readonly 800: "hsl(207, 90%, 24%)";
            readonly 900: "hsl(207, 90%, 14%)";
        };
        readonly accent: {
            readonly DEFAULT: "hsl(142, 71%, 45%)";
        };
        readonly sidebar: "none";
    };
    /**
     * Semantic Colors (Shared across all portals)
     */
    readonly semantic: {
        readonly success: "hsl(142, 71%, 45%)";
        readonly warning: "hsl(45, 93%, 47%)";
        readonly error: "hsl(0, 84%, 60%)";
        readonly info: "hsl(207, 90%, 54%)";
    };
    /**
     * Status Colors (Network/Service Status)
     */
    readonly status: {
        readonly online: "hsl(142, 71%, 45%)";
        readonly offline: "hsl(0, 84%, 60%)";
        readonly degraded: "hsl(45, 93%, 47%)";
        readonly unknown: "hsl(220, 9%, 46%)";
    };
};
/**
 * Portal Type Definition
 */
type PortalType = "platformAdmin" | "platformResellers" | "platformTenants" | "ispAdmin" | "ispReseller" | "ispCustomer";
/**
 * Get color palette for a specific portal
 */
declare function getPortalColors(portal: PortalType): {
    readonly primary: {
        readonly 50: "hsl(217, 91%, 95%)";
        readonly 100: "hsl(217, 91%, 90%)";
        readonly 200: "hsl(217, 91%, 80%)";
        readonly 300: "hsl(217, 91%, 70%)";
        readonly 400: "hsl(217, 91%, 60%)";
        readonly 500: "hsl(217, 91%, 50%)";
        readonly 600: "hsl(217, 91%, 40%)";
        readonly 700: "hsl(217, 91%, 30%)";
        readonly 800: "hsl(217, 91%, 20%)";
        readonly 900: "hsl(217, 91%, 10%)";
    };
    readonly accent: {
        readonly DEFAULT: "hsl(189, 85%, 47%)";
    };
    readonly sidebar: "dark";
} | {
    readonly primary: {
        readonly 50: "hsl(24, 95%, 95%)";
        readonly 100: "hsl(24, 95%, 90%)";
        readonly 200: "hsl(24, 95%, 80%)";
        readonly 300: "hsl(24, 95%, 70%)";
        readonly 400: "hsl(24, 95%, 60%)";
        readonly 500: "hsl(24, 95%, 53%)";
        readonly 600: "hsl(24, 95%, 43%)";
        readonly 700: "hsl(24, 95%, 33%)";
        readonly 800: "hsl(24, 95%, 23%)";
        readonly 900: "hsl(24, 95%, 13%)";
    };
    readonly accent: {
        readonly DEFAULT: "hsl(142, 71%, 45%)";
    };
    readonly sidebar: "light";
} | {
    readonly primary: {
        readonly 50: "hsl(262, 83%, 95%)";
        readonly 100: "hsl(262, 83%, 90%)";
        readonly 200: "hsl(262, 83%, 80%)";
        readonly 300: "hsl(262, 83%, 70%)";
        readonly 400: "hsl(262, 83%, 60%)";
        readonly 500: "hsl(262, 83%, 58%)";
        readonly 600: "hsl(262, 83%, 48%)";
        readonly 700: "hsl(262, 83%, 38%)";
        readonly 800: "hsl(262, 83%, 28%)";
        readonly 900: "hsl(262, 83%, 18%)";
    };
    readonly accent: {
        readonly DEFAULT: "hsl(217, 91%, 60%)";
    };
    readonly sidebar: "light";
} | {
    readonly primary: {
        readonly 50: "hsl(207, 90%, 95%)";
        readonly 100: "hsl(207, 90%, 90%)";
        readonly 200: "hsl(207, 90%, 80%)";
        readonly 300: "hsl(207, 90%, 70%)";
        readonly 400: "hsl(207, 90%, 60%)";
        readonly 500: "hsl(207, 90%, 54%)";
        readonly 600: "hsl(207, 90%, 44%)";
        readonly 700: "hsl(207, 90%, 34%)";
        readonly 800: "hsl(207, 90%, 24%)";
        readonly 900: "hsl(207, 90%, 14%)";
    };
    readonly accent: {
        readonly DEFAULT: "hsl(142, 71%, 45%)";
    };
    readonly sidebar: "dark";
} | {
    readonly primary: {
        readonly 50: "hsl(142, 71%, 95%)";
        readonly 100: "hsl(142, 71%, 90%)";
        readonly 200: "hsl(142, 71%, 80%)";
        readonly 300: "hsl(142, 71%, 70%)";
        readonly 400: "hsl(142, 71%, 60%)";
        readonly 500: "hsl(142, 71%, 45%)";
        readonly 600: "hsl(142, 71%, 35%)";
        readonly 700: "hsl(142, 71%, 25%)";
        readonly 800: "hsl(142, 71%, 15%)";
        readonly 900: "hsl(142, 71%, 10%)";
    };
    readonly accent: {
        readonly DEFAULT: "hsl(24, 95%, 53%)";
    };
    readonly sidebar: "none";
} | {
    readonly primary: {
        readonly 50: "hsl(207, 90%, 95%)";
        readonly 100: "hsl(207, 90%, 90%)";
        readonly 200: "hsl(207, 90%, 80%)";
        readonly 300: "hsl(207, 90%, 70%)";
        readonly 400: "hsl(207, 90%, 60%)";
        readonly 500: "hsl(207, 90%, 54%)";
        readonly 600: "hsl(207, 90%, 44%)";
        readonly 700: "hsl(207, 90%, 34%)";
        readonly 800: "hsl(207, 90%, 24%)";
        readonly 900: "hsl(207, 90%, 14%)";
    };
    readonly accent: {
        readonly DEFAULT: "hsl(142, 71%, 45%)";
    };
    readonly sidebar: "none";
};
/**
 * Portal route prefixes for automatic detection
 */
declare const portalRoutes: Record<PortalType, string>;
/**
 * Detect portal type from current route
 */
declare function detectPortalFromRoute(pathname: string): PortalType;

/**
 * Design System - Animation Tokens
 *
 * Portal-specific animations and transitions
 * Each portal has unique animation characteristics matching its personality
 */

/**
 * Animation durations (ms)
 */
declare const duration: {
    readonly instant: 0;
    readonly fast: 150;
    readonly normal: 250;
    readonly slow: 350;
    readonly slower: 500;
    readonly slowest: 750;
};
/**
 * Easing functions
 */
declare const easing: {
    readonly linear: "linear";
    readonly ease: "ease";
    readonly easeIn: "ease-in";
    readonly easeOut: "ease-out";
    readonly easeInOut: "ease-in-out";
    readonly smooth: "cubic-bezier(0.4, 0.0, 0.2, 1)";
    readonly sharp: "cubic-bezier(0.4, 0.0, 0.6, 1)";
    readonly snappy: "cubic-bezier(0.0, 0.0, 0.2, 1)";
    readonly bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    readonly elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
};
/**
 * Portal-specific animation preferences
 * Each portal has a personality that influences animation style
 */
declare const portalAnimations: {
    /**
     * Platform Admin - Fast, efficient, minimal
     * Staff need speed and clarity, not fancy animations
     */
    readonly platformAdmin: {
        readonly duration: 150;
        readonly easing: "cubic-bezier(0.4, 0.0, 0.6, 1)";
        readonly hoverScale: 1.02;
        readonly activeScale: 0.98;
        readonly reducedMotion: true;
        readonly pageTransition: "fade";
    };
    /**
     * Platform Resellers - Energetic, responsive, engaging
     * Sales-focused, needs to feel dynamic and exciting
     */
    readonly platformResellers: {
        readonly duration: 250;
        readonly easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        readonly hoverScale: 1.05;
        readonly activeScale: 0.95;
        readonly reducedMotion: false;
        readonly pageTransition: "slideUp";
    };
    /**
     * Platform Tenants - Professional, smooth, polished
     * Business users expect refinement
     */
    readonly platformTenants: {
        readonly duration: 250;
        readonly easing: "cubic-bezier(0.4, 0.0, 0.2, 1)";
        readonly hoverScale: 1.03;
        readonly activeScale: 0.97;
        readonly reducedMotion: false;
        readonly pageTransition: "slideRight";
    };
    /**
     * ISP Admin - Fast, precise, functional
     * Operational work requires efficiency
     */
    readonly ispAdmin: {
        readonly duration: 150;
        readonly easing: "cubic-bezier(0.4, 0.0, 0.6, 1)";
        readonly hoverScale: 1.02;
        readonly activeScale: 0.98;
        readonly reducedMotion: true;
        readonly pageTransition: "fade";
    };
    /**
     * ISP Reseller - Playful, mobile-optimized, fun
     * Often on mobile, needs to feel responsive and enjoyable
     */
    readonly ispReseller: {
        readonly duration: 250;
        readonly easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        readonly hoverScale: 1.08;
        readonly activeScale: 0.92;
        readonly reducedMotion: false;
        readonly pageTransition: "scale";
    };
    /**
     * ISP Customer - Gentle, accessible, reassuring
     * Non-technical users need calm, predictable animations
     */
    readonly ispCustomer: {
        readonly duration: 350;
        readonly easing: "cubic-bezier(0.4, 0.0, 0.2, 1)";
        readonly hoverScale: 1.02;
        readonly activeScale: 0.98;
        readonly reducedMotion: true;
        readonly pageTransition: "fade";
    };
};
/**
 * Keyframe animations (for Tailwind)
 */
declare const keyframes: {
    readonly fadeIn: {
        readonly "0%": {
            readonly opacity: "0";
        };
        readonly "100%": {
            readonly opacity: "1";
        };
    };
    readonly fadeOut: {
        readonly "0%": {
            readonly opacity: "1";
        };
        readonly "100%": {
            readonly opacity: "0";
        };
    };
    readonly slideInUp: {
        readonly "0%": {
            readonly transform: "translateY(100%)";
            readonly opacity: "0";
        };
        readonly "100%": {
            readonly transform: "translateY(0)";
            readonly opacity: "1";
        };
    };
    readonly slideOutDown: {
        readonly "0%": {
            readonly transform: "translateY(0)";
            readonly opacity: "1";
        };
        readonly "100%": {
            readonly transform: "translateY(100%)";
            readonly opacity: "0";
        };
    };
    readonly scaleIn: {
        readonly "0%": {
            readonly transform: "scale(0.9)";
            readonly opacity: "0";
        };
        readonly "100%": {
            readonly transform: "scale(1)";
            readonly opacity: "1";
        };
    };
    readonly scaleOut: {
        readonly "0%": {
            readonly transform: "scale(1)";
            readonly opacity: "1";
        };
        readonly "100%": {
            readonly transform: "scale(0.9)";
            readonly opacity: "0";
        };
    };
    readonly bounce: {
        readonly "0%, 100%": {
            readonly transform: "translateY(0)";
        };
        readonly "50%": {
            readonly transform: "translateY(-10px)";
        };
    };
    readonly pulse: {
        readonly "0%, 100%": {
            readonly opacity: "1";
        };
        readonly "50%": {
            readonly opacity: "0.5";
        };
    };
    readonly shimmer: {
        readonly "0%": {
            readonly backgroundPosition: "-1000px 0";
        };
        readonly "100%": {
            readonly backgroundPosition: "1000px 0";
        };
    };
    readonly wave: {
        readonly "0%": {
            readonly transform: "translateX(-100%)";
        };
        readonly "100%": {
            readonly transform: "translateX(100%)";
        };
    };
    readonly spin: {
        readonly "0%": {
            readonly transform: "rotate(0deg)";
        };
        readonly "100%": {
            readonly transform: "rotate(360deg)";
        };
    };
    readonly ping: {
        readonly "0%": {
            readonly transform: "scale(1)";
            readonly opacity: "1";
        };
        readonly "75%, 100%": {
            readonly transform: "scale(2)";
            readonly opacity: "0";
        };
    };
};

/**
 * Design System - Spacing Tokens
 *
 * Consistent spacing scale across all portals
 * Based on 4px grid system
 */
declare const spacing: {
    readonly 0: "0";
    readonly px: "1px";
    readonly 0.5: "0.125rem";
    readonly 1: "0.25rem";
    readonly 1.5: "0.375rem";
    readonly 2: "0.5rem";
    readonly 2.5: "0.625rem";
    readonly 3: "0.75rem";
    readonly 3.5: "0.875rem";
    readonly 4: "1rem";
    readonly 5: "1.25rem";
    readonly 6: "1.5rem";
    readonly 7: "1.75rem";
    readonly 8: "2rem";
    readonly 9: "2.25rem";
    readonly 10: "2.5rem";
    readonly 11: "2.75rem";
    readonly 12: "3rem";
    readonly 14: "3.5rem";
    readonly 16: "4rem";
    readonly 20: "5rem";
    readonly 24: "6rem";
    readonly 28: "7rem";
    readonly 32: "8rem";
    readonly 36: "9rem";
    readonly 40: "10rem";
    readonly 44: "11rem";
    readonly 48: "12rem";
    readonly 52: "13rem";
    readonly 56: "14rem";
    readonly 60: "15rem";
    readonly 64: "16rem";
    readonly 72: "18rem";
    readonly 80: "20rem";
    readonly 96: "24rem";
};
/**
 * Portal-specific spacing adjustments
 * Customer portal uses more generous spacing for accessibility
 */
declare const portalSpacing: {
    readonly platformAdmin: {
        readonly componentGap: "1rem";
        readonly sectionGap: "1.5rem";
        readonly pageGutter: "1.5rem";
    };
    readonly platformResellers: {
        readonly componentGap: "1rem";
        readonly sectionGap: "2rem";
        readonly pageGutter: "2rem";
    };
    readonly platformTenants: {
        readonly componentGap: "1rem";
        readonly sectionGap: "2rem";
        readonly pageGutter: "2rem";
    };
    readonly ispAdmin: {
        readonly componentGap: "1rem";
        readonly sectionGap: "1.5rem";
        readonly pageGutter: "1.5rem";
    };
    readonly ispReseller: {
        readonly componentGap: "1.5rem";
        readonly sectionGap: "2rem";
        readonly pageGutter: "1rem";
    };
    readonly ispCustomer: {
        readonly componentGap: "2rem";
        readonly sectionGap: "3rem";
        readonly pageGutter: "1.5rem";
    };
};
/**
 * Touch target sizes (especially for mobile portals)
 */
declare const touchTargets: {
    readonly minimum: "2.75rem";
    readonly comfortable: "3rem";
    readonly generous: "3.5rem";
};

/**
 * Design System - Typography Tokens
 *
 * Font scales optimized for each portal's use case
 * Customer portal uses larger sizes for accessibility
 */

/**
 * Base font families
 */
declare const fontFamily: {
    readonly sans: string;
    readonly mono: string;
};
/**
 * Portal-specific font scales
 */
declare const portalFontSizes: {
    /**
     * Admin Portals - Standard sizes for dense information
     */
    readonly platformAdmin: {
        readonly xs: readonly ["0.75rem", {
            readonly lineHeight: "1rem";
        }];
        readonly sm: readonly ["0.875rem", {
            readonly lineHeight: "1.25rem";
        }];
        readonly base: readonly ["1rem", {
            readonly lineHeight: "1.5rem";
        }];
        readonly lg: readonly ["1.125rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly xl: readonly ["1.25rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly "2xl": readonly ["1.5rem", {
            readonly lineHeight: "2rem";
        }];
        readonly "3xl": readonly ["1.875rem", {
            readonly lineHeight: "2.25rem";
        }];
        readonly "4xl": readonly ["2.25rem", {
            readonly lineHeight: "2.5rem";
        }];
    };
    readonly platformResellers: {
        readonly xs: readonly ["0.75rem", {
            readonly lineHeight: "1rem";
        }];
        readonly sm: readonly ["0.875rem", {
            readonly lineHeight: "1.25rem";
        }];
        readonly base: readonly ["1rem", {
            readonly lineHeight: "1.5rem";
        }];
        readonly lg: readonly ["1.125rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly xl: readonly ["1.25rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly "2xl": readonly ["1.5rem", {
            readonly lineHeight: "2rem";
        }];
        readonly "3xl": readonly ["1.875rem", {
            readonly lineHeight: "2.25rem";
        }];
        readonly "4xl": readonly ["2.25rem", {
            readonly lineHeight: "2.5rem";
        }];
    };
    readonly platformTenants: {
        readonly xs: readonly ["0.75rem", {
            readonly lineHeight: "1rem";
        }];
        readonly sm: readonly ["0.875rem", {
            readonly lineHeight: "1.25rem";
        }];
        readonly base: readonly ["1rem", {
            readonly lineHeight: "1.5rem";
        }];
        readonly lg: readonly ["1.125rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly xl: readonly ["1.25rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly "2xl": readonly ["1.5rem", {
            readonly lineHeight: "2rem";
        }];
        readonly "3xl": readonly ["1.875rem", {
            readonly lineHeight: "2.25rem";
        }];
        readonly "4xl": readonly ["2.25rem", {
            readonly lineHeight: "2.5rem";
        }];
    };
    readonly ispAdmin: {
        readonly xs: readonly ["0.75rem", {
            readonly lineHeight: "1rem";
        }];
        readonly sm: readonly ["0.875rem", {
            readonly lineHeight: "1.25rem";
        }];
        readonly base: readonly ["1rem", {
            readonly lineHeight: "1.5rem";
        }];
        readonly lg: readonly ["1.125rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly xl: readonly ["1.25rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly "2xl": readonly ["1.5rem", {
            readonly lineHeight: "2rem";
        }];
        readonly "3xl": readonly ["1.875rem", {
            readonly lineHeight: "2.25rem";
        }];
        readonly "4xl": readonly ["2.25rem", {
            readonly lineHeight: "2.5rem";
        }];
    };
    /**
     * Reseller Portal - Slightly larger for mobile
     */
    readonly ispReseller: {
        readonly xs: readonly ["0.875rem", {
            readonly lineHeight: "1.25rem";
        }];
        readonly sm: readonly ["1rem", {
            readonly lineHeight: "1.5rem";
        }];
        readonly base: readonly ["1.125rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly lg: readonly ["1.25rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly xl: readonly ["1.5rem", {
            readonly lineHeight: "2rem";
        }];
        readonly "2xl": readonly ["1.875rem", {
            readonly lineHeight: "2.25rem";
        }];
        readonly "3xl": readonly ["2.25rem", {
            readonly lineHeight: "2.5rem";
        }];
        readonly "4xl": readonly ["3rem", {
            readonly lineHeight: "3.5rem";
        }];
    };
    /**
     * Customer Portal - Largest sizes for accessibility
     */
    readonly ispCustomer: {
        readonly xs: readonly ["1rem", {
            readonly lineHeight: "1.5rem";
        }];
        readonly sm: readonly ["1.125rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly base: readonly ["1.25rem", {
            readonly lineHeight: "1.875rem";
        }];
        readonly lg: readonly ["1.5rem", {
            readonly lineHeight: "2rem";
        }];
        readonly xl: readonly ["1.875rem", {
            readonly lineHeight: "2.25rem";
        }];
        readonly "2xl": readonly ["2.25rem", {
            readonly lineHeight: "2.5rem";
        }];
        readonly "3xl": readonly ["3rem", {
            readonly lineHeight: "3.5rem";
        }];
        readonly "4xl": readonly ["3.75rem", {
            readonly lineHeight: "4rem";
        }];
    };
};
/**
 * Font weights
 */
declare const fontWeight: {
    readonly thin: "100";
    readonly extralight: "200";
    readonly light: "300";
    readonly normal: "400";
    readonly medium: "500";
    readonly semibold: "600";
    readonly bold: "700";
    readonly extrabold: "800";
    readonly black: "900";
};

/**
 * Portal metadata for display
 */
declare const portalMetadata: {
    readonly platformAdmin: {
        readonly name: "Platform Administration";
        readonly shortName: "Platform Admin";
        readonly description: "Manage the entire multi-tenant platform";
        readonly icon: "🏢";
        readonly userType: "DotMac Staff";
    };
    readonly platformResellers: {
        readonly name: "Partner Portal";
        readonly shortName: "Partners";
        readonly description: "Channel partner management and commissions";
        readonly icon: "🤝";
        readonly userType: "Channel Partner";
    };
    readonly platformTenants: {
        readonly name: "Tenant Portal";
        readonly shortName: "Tenant";
        readonly description: "Manage your ISP business relationship";
        readonly icon: "🏬";
        readonly userType: "ISP Owner";
    };
    readonly ispAdmin: {
        readonly name: "ISP Operations";
        readonly shortName: "ISP Admin";
        readonly description: "Full ISP operations and network management";
        readonly icon: "📡";
        readonly userType: "ISP Staff";
    };
    readonly ispReseller: {
        readonly name: "Sales Portal";
        readonly shortName: "Sales";
        readonly description: "Generate referrals and track commissions";
        readonly icon: "💰";
        readonly userType: "Sales Agent";
    };
    readonly ispCustomer: {
        readonly name: "Customer Portal";
        readonly shortName: "My Account";
        readonly description: "Manage your internet service";
        readonly icon: "🏠";
        readonly userType: "Customer";
    };
};
/**
 * Complete portal theme configuration
 */
interface PortalTheme {
    portal: PortalType;
    metadata: (typeof portalMetadata)[PortalType];
    colors: PortalColorPalette;
    fontSize: (typeof portalFontSizes)[PortalType];
    spacing: (typeof portalSpacing)[PortalType];
    animations: (typeof portalAnimations)[PortalType];
    cssVars: Record<string, string>;
    mode: "light" | "dark";
}
/**
 * Generate CSS custom properties for a portal theme
 */
type PortalColorPalette = {
    primary: (typeof colorTokens)[PortalType]["primary"];
    accent: {
        DEFAULT: string;
    };
    sidebar: (typeof colorTokens)[PortalType]["sidebar"];
    surface: {
        background: string;
        foreground: string;
        muted: string;
        border: string;
    };
};
/**
 * Portal Theme Context
 */
interface PortalThemeContextValue {
    currentPortal: PortalType;
    theme: PortalTheme;
    setPortal: (portal: PortalType) => void;
}
/**
 * Portal Theme Provider
 * Automatically detects and applies the correct theme based on the current route
 */
declare function PortalThemeProvider({ children }: {
    children: React.ReactNode;
}): react_jsx_runtime.JSX.Element;
/**
 * Hook to access current portal theme
 */
declare function usePortalTheme(): PortalThemeContextValue;

export { Alert, AlertDescription, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, type AlertProps, AlertTitle, AsyncState, Avatar, AvatarFallback, AvatarImage, Badge, type BadgeProps, Breadcrumb, type BulkAction, Button, ButtonLoading, type ButtonProps, Calendar, type CalendarProps, Card, CardContent, CardDescription, CardFooter, CardHeader, type CardProps, CardTitle, Checkbox, type CheckboxProps, Combobox, type ComboboxOption, type ComboboxProps, Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut, ConfirmDialog, type ConfirmDialogOptions, ConfirmDialogProvider, type ConfirmDialogVariant, DataTable, DataTableUtils, DatePicker, type DatePickerProps, DateRangePicker, type DateRangePickerProps, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, EmptyState, EnhancedDataTable, type EnhancedDataTableProps, type EnhancedDataTableTranslations, ErrorBoundaryFallback, ErrorState, type FilterConfig, Form, FormControl, FormDescription, FormError, FormField, FormItem, FormLabel, FormMessage, InlineLoader, Input, type InputProps, Label, type LabelProps, LiveIndicator, LoadingCard, LoadingGrid, LoadingOverlay, LoadingSpinner, LoadingState, LoadingTable, MetricCardEnhanced, MultiCombobox, type MultiComboboxProps, PageHeader, Popover, PopoverAnchor, PopoverContent, PopoverTrigger, PortalBadge, PortalBadgeCompact, PortalButton, type PortalButtonProps, PortalCard, PortalCardContent, PortalCardDescription, PortalCardFooter, PortalCardHeader, type PortalCardProps, PortalCardTitle, type PortalColorType, type PortalType as PortalDesignType, PortalIndicatorDot, type PortalTheme, type PortalThemeContextValue, PortalThemeProvider, type PortalType$1 as PortalType, PortalUserTypeBadge, Progress, ProgressIndicator, type ProgressProps, type QuickFilter, RadioGroup, RadioGroupItem, ScrollArea, ScrollBar, type SearchConfig, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, Separator, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetPortal, SheetTitle, SheetTrigger, Skeleton, SkeletonCard, SkeletonMetricCard, SkeletonTable, SkipLink, StatusBadge, type StatusVariant, Switch, type SwitchProps, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TablePagination, type TablePaginationProps, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, type TextareaProps, ThemeToggle, ThemeToggleButton, type Toast, ToastContainer, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, alertVariants, badgeVariants, buttonVariants, cardVariants, cn, colorTokens, createSortableHeader, detectPortalFromRoute, duration, easing, fontFamily, fontWeight, generatePortalCSSVariables, getPortalColors, getPortalConfig, getPortalThemeClass, getStatusVariant, keyframes, portalAnimations, portalButtonVariants, portalFontSizes, portalMetadata, portalRoutes, portalSpacing, spacing, toast, touchTargets, useConfirmDialog, useFormField, usePagination, usePortalTheme, useToast };
