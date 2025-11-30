import type React from "react";
/**
 * Centralized type definitions for @dotmac/primitives
 */
export type { AreaChartProps, BarChartProps, BaseChartProps, ChartContainerProps, LineChartProps, MetricCardProps, PieChartProps, } from "./data-display/Chart";
export type { Column, DataTableProps, TableData, TableProps, } from "./data-display/Table";
export type { AlertDescriptionProps, AlertProps, AlertTitleProps, LoadingProps, LoadingSkeletonProps, PresenceIndicatorProps, ProgressProps, ToastProps, ToastProviderProps, } from "./feedback/Feedback";
export type { CheckboxProps, FormFieldProps, FormItemProps, FormLabelProps, FormMessageProps, FormProps, InputProps, RadioGroupProps, RadioProps, SelectProps, TextareaProps, } from "./forms";
export type { CardContentProps, CardFooterProps, CardHeaderProps, CardProps, CenterProps, ContainerProps, DashboardProps, DividerProps, GridItemProps, GridProps, HStackProps, SectionProps, SpacerProps, StackProps, VStackProps, } from "./layout/Layout";
export type { ModalBackdropProps, ModalContentProps, ModalHeaderProps, ModalTitleProps, ModalTriggerProps, ModalProps, } from "./layout/Modal";
export type { BreadcrumbEllipsisProps, BreadcrumbItemProps, BreadcrumbLinkProps, BreadcrumbPageProps, BreadcrumbProps, NavbarProps, NavigationItemProps, NavigationLinkProps, NavigationMenuProps, NavigationProviderProps, SidebarProps, TabItemProps, TabNavigationProps, } from "./navigation/Navigation";
export type Size = "xs" | "sm" | "md" | "lg" | "xl";
export type Variant = "default" | "primary" | "secondary" | "success" | "error" | "warning" | "info";
export type Orientation = "horizontal" | "vertical";
export type Alignment = "start" | "center" | "end" | "stretch" | "baseline";
export type Justification = "start" | "center" | "end" | "between" | "around" | "evenly";
export type ComponentState = "default" | "hover" | "active" | "focus" | "disabled" | "loading";
export type FeedbackState = "success" | "error" | "warning" | "info";
export type Spacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type Position = "static" | "relative" | "absolute" | "fixed" | "sticky";
export type Display = "block" | "inline" | "inline-block" | "flex" | "inline-flex" | "grid" | "inline-grid" | "none";
export type ColorScheme = "light" | "dark" | "auto";
export type ColorPalette = "gray" | "red" | "orange" | "yellow" | "green" | "teal" | "blue" | "cyan" | "purple" | "pink";
export interface ThemeConfig {
    colors: Record<string, string>;
    spacing: Record<Spacing, string>;
    typography: {
        fontFamily: Record<string, string[]>;
        fontSize: Record<Size, string>;
        fontWeight: Record<string, number>;
        lineHeight: Record<string, number>;
    };
    borderRadius: Record<Size, string>;
    shadows: Record<Size, string>;
    transitions: Record<string, string>;
    breakpoints: Record<string, string>;
}
export type EventHandler<T = Element, E = Event> = (event: E & {
    currentTarget: T;
}) => void;
export type ClickHandler<T = Element> = EventHandler<T, MouseEvent>;
export type ChangeHandler<T = Element> = EventHandler<T, Event>;
export type FocusHandler<T = Element> = EventHandler<T, FocusEvent>;
export type KeyboardHandler<T = Element> = EventHandler<T, KeyboardEvent>;
export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
    group?: string;
}
export interface MenuItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    children?: MenuItem[];
}
export interface BreadcrumbItemData {
    label: string;
    href?: string;
    current?: boolean;
}
export interface PaginationOptions {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    onChange?: (page: number, pageSize: number) => void;
}
export interface SortingOptions {
    field?: string;
    order?: "asc" | "desc";
    onChange?: (field: string, order: "asc" | "desc") => void;
}
export interface SelectionOptions<T = Record<string, unknown>> {
    selectedKeys: string[];
    onChange?: (selectedKeys: string[], selectedRecords: T[]) => void;
    getRowKey?: (record: T) => string;
}
export interface AriaProps {
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    "aria-expanded"?: boolean;
    "aria-selected"?: boolean;
    "aria-checked"?: boolean | "mixed";
    "aria-disabled"?: boolean;
    "aria-hidden"?: boolean;
    "aria-current"?: "page" | "step" | "location" | "date" | "time" | "true" | "false";
    role?: string;
}
export interface ValidationRule {
    required?: boolean | string;
    pattern?: RegExp | {
        value: RegExp;
        message: string;
    };
    min?: number | {
        value: number;
        message: string;
    };
    max?: number | {
        value: number;
        message: string;
    };
    minLength?: number | {
        value: number;
        message: string;
    };
    maxLength?: number | {
        value: number;
        message: string;
    };
    validate?: Record<string, (value: unknown) => boolean | string>;
}
export interface ValidationErrors {
    [field: string]: string | string[] | undefined;
}
export interface FieldConfig {
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    validation?: ValidationRule;
}
export interface ChartDataPoint {
    [key: string]: string | number | boolean | null | undefined;
    name?: string;
    value?: number;
}
export interface ChartSeries {
    key: string;
    name?: string;
    color?: string;
    type?: "line" | "bar" | "area";
    data?: ChartDataPoint[];
}
export interface ModalOptions {
    title?: string;
    content?: React.ReactNode;
    footer?: React.ReactNode;
    closable?: boolean;
    maskClosable?: boolean;
    keyboard?: boolean;
    width?: number | string;
    height?: number | string;
    centered?: boolean;
    zIndex?: number;
}
export interface ToastOptions {
    title?: string;
    description?: string;
    variant?: FeedbackState | "default";
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
    onClose?: () => void;
}
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
    asChild?: boolean;
}
export interface InteractiveComponentProps extends BaseComponentProps {
    disabled?: boolean;
    loading?: boolean;
    onClick?: ClickHandler;
    onFocus?: FocusHandler;
    onBlur?: FocusHandler;
    onKeyDown?: KeyboardHandler;
}
export interface FormComponentProps extends InteractiveComponentProps {
    name?: string;
    value?: unknown;
    defaultValue?: unknown;
    onChange?: ChangeHandler;
    onValueChange?: (value: unknown) => void;
    placeholder?: string;
    required?: boolean;
    invalid?: boolean;
    error?: string;
}
export interface ISPCustomer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    plan: string;
    status: "active" | "suspended" | "cancelled";
    createdAt: Date;
    updatedAt: Date;
}
export interface NetworkDevice {
    id: string;
    name: string;
    type: "router" | "switch" | "access_point" | "modem" | "firewall";
    model: string;
    ipAddress: string;
    macAddress: string;
    status: "online" | "offline" | "maintenance";
    location?: string;
    customerId?: string;
}
export interface ServicePlan {
    id: string;
    name: string;
    speed: string;
    price: number;
    description?: string;
    features: string[];
    active: boolean;
}
export interface SupportTicket {
    id: string;
    subject: string;
    description: string;
    status: "open" | "in_progress" | "resolved" | "closed";
    priority: "low" | "medium" | "high" | "urgent";
    customerId: string;
    assignedTo?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Invoice {
    id: string;
    customerId: string;
    amount: number;
    currency: string;
    status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
    dueDate: Date;
    paidDate?: Date;
    items: InvoiceItem[];
    createdAt: Date;
}
export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}
export interface PortalNavigation {
    main: MenuItem[];
    user: MenuItem[];
    footer?: MenuItem[];
}
export interface PortalConfig {
    name: string;
    theme: ColorScheme;
    navigation: PortalNavigation;
    features: string[];
}
//# sourceMappingURL=types.d.ts.map