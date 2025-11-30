/**
 * DashboardSkeleton Component
 *
 * Provides skeleton loading states for dashboard pages.
 * Supports multiple layout variants for different dashboard types.
 */
export interface DashboardSkeletonProps {
    /**
     * Layout variant for different dashboard types
     * @default "default"
     */
    variant?: "default" | "metrics" | "network" | "compact";
    /**
     * Number of metric cards to show
     * @default 4
     */
    metricCards?: number;
    /**
     * Show header section
     * @default true
     */
    showHeader?: boolean;
    /**
     * Number of content sections to show
     * @default 2
     */
    contentSections?: number;
    /**
     * Custom className for container
     */
    className?: string;
}
/**
 * DashboardSkeleton Component
 *
 * @example
 * ```tsx
 * <DashboardSkeleton variant="metrics" metricCards={4} />
 * ```
 *
 * @example With custom layout
 * ```tsx
 * <DashboardSkeleton
 *   variant="network"
 *   metricCards={6}
 *   contentSections={3}
 * />
 * ```
 */
export declare function DashboardSkeleton({ variant, metricCards, showHeader, contentSections, className, }: DashboardSkeletonProps): import("react/jsx-runtime").JSX.Element;
/**
 * Preset dashboard skeletons for common use cases
 */
export declare const DashboardSkeletons: {
    /**
     * Network monitoring dashboard
     */
    Network: () => import("react/jsx-runtime").JSX.Element;
    /**
     * Metrics dashboard with cards
     */
    Metrics: () => import("react/jsx-runtime").JSX.Element;
    /**
     * Compact dashboard
     */
    Compact: () => import("react/jsx-runtime").JSX.Element;
    /**
     * Default dashboard
     */
    Default: () => import("react/jsx-runtime").JSX.Element;
};
//# sourceMappingURL=DashboardSkeleton.d.ts.map