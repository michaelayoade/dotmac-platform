/**
 * Universal Data Table Component
 * Advanced data table with sorting, filtering, pagination, and export capabilities
 */
import React from "react";
export interface TableColumn<T = any> {
    key: string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    searchable?: boolean;
    width?: string | number;
    align?: "left" | "center" | "right";
    render?: (value: any, row: T, index: number) => React.ReactNode;
    format?: "text" | "number" | "currency" | "percentage" | "date" | "status" | "badge";
    currency?: string;
    precision?: number;
    filterType?: "text" | "select" | "date" | "number" | "boolean";
    filterOptions?: Array<{
        label: string;
        value: any;
    }>;
    headerClassName?: string;
    cellClassName?: string | ((value: any, row: T) => string);
}
export interface TableAction<T = any> {
    id: string;
    label: string;
    icon?: React.ComponentType<{
        className?: string;
    }>;
    onClick: (row: T, index: number) => void;
    variant?: "primary" | "secondary" | "danger" | "ghost";
    condition?: (row: T) => boolean;
}
export interface UniversalDataTableProps<T = any> {
    data: T[];
    columns: TableColumn<T>[];
    actions?: TableAction<T[]>[];
    rowActions?: TableAction<T>[];
    bulkActions?: TableAction<T[]>[];
    sortable?: boolean;
    filterable?: boolean;
    searchable?: boolean;
    paginated?: boolean;
    selectable?: boolean;
    exportable?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    onSelectionChange?: (selectedRows: T[]) => void;
    rowSelection?: "single" | "multiple";
    variant?: "default" | "striped" | "bordered" | "compact";
    size?: "sm" | "md" | "lg";
    stickyHeader?: boolean;
    loading?: boolean;
    error?: string | null;
    emptyMessage?: string;
    onRowClick?: (row: T, index: number) => void;
    onSort?: (column: string, direction: "asc" | "desc") => void;
    onFilter?: (filters: Record<string, any>) => void;
    onSearch?: (query: string) => void;
    title?: string;
    subtitle?: string;
    className?: string;
    maxHeight?: number | string;
}
export declare function UniversalDataTable<T extends Record<string, any>>({ data, columns, actions, rowActions, bulkActions, sortable, filterable, searchable, paginated, selectable, exportable, pageSize, pageSizeOptions, onSelectionChange, rowSelection, variant, size, stickyHeader, loading, error, emptyMessage, onRowClick, onSort, onFilter, onSearch, title, subtitle, className, maxHeight, }: UniversalDataTableProps<T>): import("react/jsx-runtime").JSX.Element;
export default UniversalDataTable;
//# sourceMappingURL=UniversalDataTable.d.ts.map