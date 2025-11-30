import React from "react";
export interface VirtualizedColumn<T = Record<string, unknown>> {
    key: keyof T | string;
    label: string;
    width: number;
    minWidth?: number;
    maxWidth?: number;
    sortable?: boolean;
    render?: (value: unknown, row: T, index: number) => React.ReactNode;
    formatter?: (value: unknown) => string;
    align?: "left" | "center" | "right";
}
export interface VirtualizedDataTableProps<T = Record<string, unknown>> {
    data: T[];
    columns: VirtualizedColumn<T>[];
    height?: number;
    rowHeight?: number;
    onSort?: (columnKey: string, direction: "asc" | "desc") => void;
    onRowClick?: (row: T, index: number) => void;
    onSelectionChange?: (selectedRows: T[]) => void;
    loading?: boolean;
    loadMore?: () => void;
    hasNextPage?: boolean;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    selectable?: boolean;
    className?: string;
    forwardedScrollRef?: React.RefObject<HTMLDivElement>;
}
export declare function VirtualizedDataTable<T = Record<string, unknown>>({ data, columns, height, rowHeight, onSort, onRowClick, onSelectionChange, loading, loadMore, hasNextPage, searchValue, onSearchChange, selectable, className, forwardedScrollRef, }: VirtualizedDataTableProps<T>): import("react/jsx-runtime").JSX.Element;
export default VirtualizedDataTable;
//# sourceMappingURL=VirtualizedDataTable.d.ts.map