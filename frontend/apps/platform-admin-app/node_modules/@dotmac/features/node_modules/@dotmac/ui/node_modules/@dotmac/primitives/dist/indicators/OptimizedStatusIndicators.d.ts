/**
 * Performance-Optimized Status Indicators
 * Advanced state management and render optimization patterns
 */
import type { StatusBadgeProps, UptimeIndicatorProps } from "../types/status";
declare const statusBadgeVariants: (props?: ({
    variant?: "active" | "critical" | "offline" | "online" | "degraded" | "suspended" | "medium" | "low" | "high" | "maintenance" | "pending" | "paid" | "overdue" | "processing" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
    animated?: boolean | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const statusDotVariants: (props?: ({
    status?: "active" | "critical" | "offline" | "online" | "degraded" | "suspended" | "medium" | "low" | "high" | "maintenance" | "pending" | "paid" | "overdue" | "processing" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
    pulse?: boolean | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export declare const OptimizedStatusBadge: React.FC<StatusBadgeProps>;
export declare const OptimizedUptimeIndicator: React.FC<UptimeIndicatorProps>;
export { statusBadgeVariants, statusDotVariants };
//# sourceMappingURL=OptimizedStatusIndicators.d.ts.map