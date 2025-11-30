/**
 * Unstyled, composable Table primitive
 */
import { type VariantProps } from "class-variance-authority";
import React from "react";
declare const tableVariants: (props?: ({
    size?: "sm" | "md" | "lg" | null | undefined;
    variant?: "default" | "bordered" | "striped" | "hover" | null | undefined;
    density?: "compact" | "comfortable" | "spacious" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement>, VariantProps<typeof tableVariants> {
    asChild?: boolean;
}
export interface Column<T = any> {
    key: string;
    title: string;
    dataIndex?: keyof T;
    render?: (value: unknown, record: T, index: number) => React.ReactNode;
    sortable?: boolean;
    width?: string | number;
    align?: "left" | "center" | "right";
    fixed?: "left" | "right";
    hidden?: boolean;
}
export interface TableData<T = any> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    pagination?: {
        current: number;
        pageSize: number;
        total: number;
        showSizeChanger?: boolean;
        showQuickJumper?: boolean;
        onChange?: (page: number, pageSize: number) => void;
    };
    sorting?: {
        field?: string;
        order?: "asc" | "desc";
        onChange?: (field: string, order: "asc" | "desc") => void;
    };
    selection?: {
        selectedKeys: string[];
        onChange?: (selectedKeys: string[]) => void;
        getRowKey?: (record: T) => string;
    };
    expandable?: {
        expandedKeys: string[];
        onExpand?: (expanded: boolean, record: T) => void;
        expandedRowRender?: (record: T) => React.ReactNode;
    };
}
declare const Table: React.ForwardRefExoticComponent<TableProps & React.RefAttributes<HTMLTableElement>>;
declare const TableHeader: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>>;
declare const TableBody: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>>;
declare const TableFooter: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>>;
declare const TableRow: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableRowElement> & {
    selected?: boolean;
    expandable?: boolean;
    expanded?: boolean;
} & React.RefAttributes<HTMLTableRowElement>>;
declare const TableHead: React.ForwardRefExoticComponent<React.ThHTMLAttributes<HTMLTableCellElement> & {
    sortable?: boolean;
    sorted?: "asc" | "desc" | false;
    onSort?: () => void;
} & React.RefAttributes<HTMLTableCellElement>>;
declare const TableCell: React.ForwardRefExoticComponent<React.TdHTMLAttributes<HTMLTableCellElement> & {
    align?: "left" | "center" | "right";
} & React.RefAttributes<HTMLTableCellElement>>;
declare const TableCaption: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableCaptionElement> & React.RefAttributes<HTMLTableCaptionElement>>;
export interface DataTableProps<T = any> extends TableProps, TableData<T> {
    emptyText?: string;
    loadingText?: string;
}
export declare function DataTable<T = any>({ columns, data, loading, pagination, sorting, selection, expandable, emptyText, loadingText, className, ...tableProps }: DataTableProps<T>): import("react/jsx-runtime").JSX.Element;
export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption, DataTable as UniversalTable, };
//# sourceMappingURL=Table.d.ts.map