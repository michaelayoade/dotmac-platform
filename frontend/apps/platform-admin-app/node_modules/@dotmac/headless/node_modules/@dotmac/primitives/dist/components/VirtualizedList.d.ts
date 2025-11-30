/**
 * High-Performance Virtualized List Component
 * Optimized for large datasets with accessibility and performance focus
 */
export interface VirtualizedListProps<T> {
    items: T[];
    itemHeight: number | ((index: number) => number);
    height: number;
    width?: number | string;
    className?: string;
    overscan?: number;
    renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
    getItemKey?: (item: T, index: number) => string | number;
    onItemsRendered?: (visibleRange: {
        start: number;
        end: number;
    }) => void;
    onScroll?: (scrollOffset: number) => void;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    role?: string;
    throttleMs?: number;
    enableKeyboardNavigation?: boolean;
}
export interface VirtualizedGridProps<T> {
    items: T[];
    itemWidth: number;
    itemHeight: number;
    width: number;
    height: number;
    className?: string;
    overscan?: number;
    renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
    getItemKey?: (item: T, index: number) => string | number;
    onItemsRendered?: (visibleRange: {
        start: number;
        end: number;
        startRow: number;
        endRow: number;
    }) => void;
}
export declare const VirtualizedList: <T>(props: VirtualizedListProps<T>) => React.ReactElement;
export declare const VirtualizedGrid: <T>(props: VirtualizedGridProps<T>) => React.ReactElement;
export interface VirtualizedTableProps<T> {
    items: T[];
    columns: Array<{
        key: keyof T;
        header: string;
        width: number;
        render?: (value: any, item: T, index: number) => React.ReactNode;
    }>;
    rowHeight: number;
    height: number;
    width: number;
    className?: string;
    overscan?: number;
    onRowClick?: (item: T, index: number) => void;
    getRowKey?: (item: T, index: number) => string | number;
}
export declare const VirtualizedTable: <T extends Record<string, any>>(props: VirtualizedTableProps<T>) => React.ReactElement;
declare const _default: {
    VirtualizedList: <T>(props: VirtualizedListProps<T>) => React.ReactElement;
    VirtualizedGrid: <T>(props: VirtualizedGridProps<T>) => React.ReactElement;
    VirtualizedTable: <T extends Record<string, any>>(props: VirtualizedTableProps<T>) => React.ReactElement;
};
export default _default;
//# sourceMappingURL=VirtualizedList.d.ts.map