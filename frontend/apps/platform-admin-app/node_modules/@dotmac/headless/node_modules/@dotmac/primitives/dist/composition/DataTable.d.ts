/**
 * Simplified Data Table Component
 * Moved from patterns package during consolidation
 */
import React from "react";
export interface Column<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: any, item: T) => React.ReactNode;
}
export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    className?: string;
    onRowClick?: (item: T) => void;
    loading?: boolean;
    emptyMessage?: string;
}
export declare function DataTable<T extends Record<string, any>>({ data, columns, className, onRowClick, loading, emptyMessage, }: DataTableProps<T>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DataTable.d.ts.map