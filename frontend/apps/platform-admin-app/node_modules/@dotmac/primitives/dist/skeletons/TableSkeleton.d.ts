/**
 * TableSkeleton Component
 *
 * Provides skeleton loading states for table components.
 * Matches the structure of data tables used throughout the platform.
 */
export interface TableSkeletonProps {
    /**
     * Number of columns
     * @default 5
     */
    columns?: number;
    /**
     * Number of rows
     * @default 5
     */
    rows?: number;
    /**
     * Show table header
     * @default true
     */
    showHeader?: boolean;
    /**
     * Show action column
     * @default true
     */
    showActions?: boolean;
    /**
     * Show checkbox column
     * @default false
     */
    showCheckbox?: boolean;
    /**
     * Show pagination
     * @default true
     */
    showPagination?: boolean;
    /**
     * Show search bar
     * @default true
     */
    showSearch?: boolean;
    /**
     * Show filters
     * @default false
     */
    showFilters?: boolean;
    /**
     * Variant for different table styles
     * @default "default"
     */
    variant?: "default" | "compact" | "detailed";
    /**
     * Custom className for container
     */
    className?: string;
}
/**
 * TableSkeleton Component
 *
 * @example
 * ```tsx
 * <TableSkeleton columns={5} rows={10} />
 * ```
 *
 * @example With all features
 * ```tsx
 * <TableSkeleton
 *   columns={7}
 *   rows={20}
 *   showCheckbox
 *   showActions
 *   showSearch
 *   showFilters
 * />
 * ```
 *
 * @example Compact variant
 * ```tsx
 * <TableSkeleton variant="compact" columns={4} rows={15} />
 * ```
 */
export declare function TableSkeleton({ columns, rows, showHeader, showActions, showCheckbox, showPagination, showSearch, showFilters, variant, className, }: TableSkeletonProps): import("react/jsx-runtime").JSX.Element;
/**
 * Preset table skeletons for common use cases
 */
export declare const TableSkeletons: {
    /**
     * Customer/Subscriber list table
     */
    CustomerList: () => import("react/jsx-runtime").JSX.Element;
    /**
     * Device list table
     */
    DeviceList: () => import("react/jsx-runtime").JSX.Element;
    /**
     * Compact list
     */
    Compact: () => import("react/jsx-runtime").JSX.Element;
    /**
     * Detailed table with all features
     */
    Detailed: () => import("react/jsx-runtime").JSX.Element;
    /**
     * Simple table without controls
     */
    Simple: () => import("react/jsx-runtime").JSX.Element;
};
//# sourceMappingURL=TableSkeleton.d.ts.map