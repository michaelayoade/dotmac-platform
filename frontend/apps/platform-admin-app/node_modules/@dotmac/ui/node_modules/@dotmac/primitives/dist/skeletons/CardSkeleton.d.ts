/**
 * CardSkeleton Component
 *
 * Provides skeleton loading states for card components.
 * Supports various card layouts including metrics, info cards, and content cards.
 */
export interface CardSkeletonProps {
    /**
     * Card variant
     * @default "default"
     */
    variant?: "default" | "metric" | "info" | "detailed" | "compact";
    /**
     * Show header section
     * @default true
     */
    showHeader?: boolean;
    /**
     * Show footer section
     * @default false
     */
    showFooter?: boolean;
    /**
     * Show icon/avatar
     * @default false
     */
    showIcon?: boolean;
    /**
     * Number of content lines
     * @default 3
     */
    contentLines?: number;
    /**
     * Card height (if fixed)
     */
    height?: string;
    /**
     * Custom className for container
     */
    className?: string;
}
/**
 * CardSkeleton Component
 *
 * @example
 * ```tsx
 * <CardSkeleton variant="metric" showIcon />
 * ```
 *
 * @example Info card
 * ```tsx
 * <CardSkeleton
 *   variant="info"
 *   showHeader
 *   showIcon
 *   contentLines={4}
 * />
 * ```
 *
 * @example Grid of metric cards
 * ```tsx
 * <div className="grid grid-cols-4 gap-4">
 *   {[...Array(4)].map((_, i) => (
 *     <CardSkeleton key={i} variant="metric" showIcon />
 *   ))}
 * </div>
 * ```
 */
export declare function CardSkeleton({ variant, showHeader, showFooter, showIcon, contentLines, height, className, }: CardSkeletonProps): import("react/jsx-runtime").JSX.Element;
/**
 * CardGrid Skeleton
 * Renders a grid of card skeletons
 */
export interface CardGridSkeletonProps {
    /**
     * Number of cards
     * @default 6
     */
    count?: number;
    /**
     * Grid columns
     * @default 3
     */
    columns?: 2 | 3 | 4;
    /**
     * Card variant
     * @default "default"
     */
    variant?: CardSkeletonProps["variant"];
    /**
     * Props to pass to each card
     */
    cardProps?: Omit<CardSkeletonProps, "variant" | "className">;
    /**
     * Custom className for grid container
     */
    className?: string;
}
/**
 * CardGridSkeleton Component
 *
 * @example
 * ```tsx
 * <CardGridSkeleton count={6} columns={3} variant="metric" />
 * ```
 */
export declare function CardGridSkeleton({ count, columns, variant, cardProps, className, }: CardGridSkeletonProps): import("react/jsx-runtime").JSX.Element;
/**
 * Preset card skeletons for common use cases
 */
export declare const CardSkeletons: {
    /**
     * Metric card for KPIs
     */
    Metric: () => import("react/jsx-runtime").JSX.Element;
    /**
     * Info card with header
     */
    Info: () => import("react/jsx-runtime").JSX.Element;
    /**
     * Detailed content card
     */
    Detailed: () => import("react/jsx-runtime").JSX.Element;
    /**
     * Compact list item
     */
    Compact: () => import("react/jsx-runtime").JSX.Element;
    /**
     * Grid of metric cards
     */
    MetricGrid: () => import("react/jsx-runtime").JSX.Element;
    /**
     * Grid of info cards
     */
    InfoGrid: () => import("react/jsx-runtime").JSX.Element;
};
//# sourceMappingURL=CardSkeleton.d.ts.map