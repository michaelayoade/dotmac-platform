import React from "react";
interface ActionButton {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
    icon?: React.ComponentType<any>;
    disabled?: boolean;
}
interface FilterOption {
    key: string;
    label: string;
    options: {
        value: string;
        label: string;
    }[];
}
interface ManagementPageTemplateProps<T = any> {
    title: string;
    subtitle?: string;
    data: T[];
    columns: {
        key: keyof T;
        label: string;
        sortable?: boolean;
        render?: (value: any, item: T) => React.ReactNode;
    }[];
    onSearch?: (query: string) => void;
    onSort?: (key: keyof T, direction: "asc" | "desc") => void;
    onFilter?: (filters: Record<string, string>) => void;
    onItemClick?: (item: T) => void;
    onItemSelect?: (items: T[]) => void;
    actions?: ActionButton[];
    filters?: FilterOption[];
    searchPlaceholder?: string;
    emptyMessage?: string;
    loading?: boolean;
    selectable?: boolean;
    className?: string;
}
export declare function ManagementPageTemplate<T = any>({ title, subtitle, data, columns, onSearch, onSort, onFilter, onItemClick, onItemSelect, actions, filters, searchPlaceholder, emptyMessage, loading, selectable, className, }: ManagementPageTemplateProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ManagementPageTemplate.d.ts.map