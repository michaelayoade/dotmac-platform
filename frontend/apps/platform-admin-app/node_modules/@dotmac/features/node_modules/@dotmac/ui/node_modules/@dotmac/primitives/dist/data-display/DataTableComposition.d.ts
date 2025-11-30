/**
 * Data Table Composition Components
 *
 * Breaks down the complex AdvancedDataTable into composable parts
 */
import React from "react";
export interface DataTableState {
    filters: Record<string, unknown>;
    sorting: Array<{
        id: string;
        desc: boolean;
    }>;
    grouping: string[];
    selection: string[];
    pagination: {
        page: number;
        size: number;
    };
}
export interface DataTableActions {
    setFilters: (filters: Record<string, unknown>) => void;
    setSorting: (sorting: Array<{
        id: string;
        desc: boolean;
    }>) => void;
    setGrouping: (grouping: string[]) => void;
    setSelection: (selection: string[]) => void;
    setPagination: (pagination: {
        page: number;
        size: number;
    }) => void;
}
export declare const useDataTableFilters: (initialFilters?: Record<string, unknown>) => {
    filters: Record<string, unknown>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
    handleFilterChange: (key: string, value: unknown) => void;
    clearFilters: () => void;
};
export declare const useDataTableSelection: (multiSelect?: boolean) => {
    selection: string[];
    setSelection: React.Dispatch<React.SetStateAction<string[]>>;
    handleSelect: (id: string) => void;
    selectAll: (ids: string[]) => void;
    clearSelection: () => void;
};
export declare const useDataTableSorting: (initialSorting?: Array<{
    id: string;
    desc: boolean;
}>) => {
    sorting: {
        id: string;
        desc: boolean;
    }[];
    setSorting: React.Dispatch<React.SetStateAction<{
        id: string;
        desc: boolean;
    }[]>>;
    handleSort: (columnId: string) => void;
};
export declare const useDataTablePagination: (initialPage?: number, initialSize?: number) => {
    pagination: {
        page: number;
        size: number;
    };
    setPagination: React.Dispatch<React.SetStateAction<{
        page: number;
        size: number;
    }>>;
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (page: number) => void;
    setPageSize: (size: number) => void;
};
export declare const useDataTableComposition: (options: {
    initialFilters?: Record<string, unknown>;
    initialSorting?: Array<{
        id: string;
        desc: boolean;
    }>;
    initialPage?: number;
    initialPageSize?: number;
    multiSelect?: boolean;
}) => {
    filters: {
        filters: Record<string, unknown>;
        setFilters: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
        handleFilterChange: (key: string, value: unknown) => void;
        clearFilters: () => void;
    };
    selection: {
        selection: string[];
        setSelection: React.Dispatch<React.SetStateAction<string[]>>;
        handleSelect: (id: string) => void;
        selectAll: (ids: string[]) => void;
        clearSelection: () => void;
    };
    sorting: {
        sorting: {
            id: string;
            desc: boolean;
        }[];
        setSorting: React.Dispatch<React.SetStateAction<{
            id: string;
            desc: boolean;
        }[]>>;
        handleSort: (columnId: string) => void;
    };
    pagination: {
        pagination: {
            page: number;
            size: number;
        };
        setPagination: React.Dispatch<React.SetStateAction<{
            page: number;
            size: number;
        }>>;
        nextPage: () => void;
        prevPage: () => void;
        goToPage: (page: number) => void;
        setPageSize: (size: number) => void;
    };
};
//# sourceMappingURL=DataTableComposition.d.ts.map