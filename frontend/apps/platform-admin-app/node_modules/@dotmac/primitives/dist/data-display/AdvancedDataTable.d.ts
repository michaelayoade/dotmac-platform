/**
 * Advanced data table with filtering, sorting, grouping, and virtual scrolling
 */
import type React from "react";
import { type Column } from "./Table";
export interface AdvancedColumn<T = Record<string, unknown>> extends Column<T> {
    filterable?: boolean;
    filterType?: "text" | "select" | "date" | "number" | "boolean" | "custom";
    filterOptions?: Array<{
        label: string;
        value: T[keyof T];
    }>;
    filterComponent?: React.ComponentType<{
        value: T[keyof T];
        onChange: (value: T[keyof T]) => void;
        column: AdvancedColumn<T>;
    }>;
    groupable?: boolean;
    sortCompare?: (a: T, b: T) => number;
    sticky?: boolean;
    resizable?: boolean;
    minWidth?: number;
    maxWidth?: number;
    editable?: boolean;
    editComponent?: React.ComponentType<{
        value: T[keyof T];
        onChange: (value: T[keyof T]) => void;
        record: T;
        column: AdvancedColumn<T>;
    }>;
}
export interface FilterState {
    [key: string]: unknown;
}
export interface SortState {
    field?: string;
    order?: "asc" | "desc";
    multiSort?: Array<{
        field: string;
        order: "asc" | "desc";
    }>;
}
export interface GroupState {
    groupBy?: string;
    expanded?: Set<string>;
}
export interface TableState {
    filters: FilterState;
    sorting: SortState;
    grouping: GroupState;
    pagination: {
        page: number;
        pageSize: number;
    };
    selection: {
        selectedKeys: Set<string>;
    };
}
export interface AdvancedDataTableProps<T = Record<string, unknown>> {
    data: T[];
    columns: AdvancedColumn<T>[];
    keyExtractor: (record: T) => string;
    filterable?: boolean;
    sortable?: boolean;
    groupable?: boolean;
    selectable?: boolean;
    editable?: boolean;
    resizable?: boolean;
    virtualScrolling?: boolean;
    rowHeight?: number;
    containerHeight?: number;
    pagination?: {
        enabled: boolean;
        pageSize?: number;
        showSizeChanger?: boolean;
        pageSizeOptions?: number[];
    };
    controlled?: boolean;
    state?: Partial<TableState>;
    onStateChange?: (state: TableState) => void;
    onRowClick?: (record: T, index: number) => void;
    onRowDoubleClick?: (record: T, index: number) => void;
    onSelectionChange?: (selectedKeys: string[], selectedRecords: T[]) => void;
    onCellEdit?: (record: T, field: string, value: T[keyof T]) => void;
    loading?: boolean;
    error?: string;
    emptyText?: string;
    className?: string;
    rowClassName?: (record: T, index: number) => string;
    exportable?: boolean;
    onExport?: (format: "csv" | "excel" | "pdf") => void;
}
export declare const AdvancedDataTable: React.ForwardRefExoticComponent<AdvancedDataTableProps<Record<string, unknown>> & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=AdvancedDataTable.d.ts.map