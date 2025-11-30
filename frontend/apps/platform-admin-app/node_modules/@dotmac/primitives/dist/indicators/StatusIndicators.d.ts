/**
 * Enhanced Status Indicators for ISP Management Platform
 * Improved visual hierarchy and ISP-specific status types
 * Security-hardened with input validation and XSS protection
 */
import type { StatusBadgeProps, UptimeIndicatorProps, NetworkPerformanceProps, ServiceTierProps, AlertSeverityProps, StatusVariant } from "../types/status";
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
export declare const StatusBadge: React.FC<StatusBadgeProps>;
export declare const UptimeIndicator: React.FC<UptimeIndicatorProps>;
export declare const NetworkPerformanceIndicator: React.FC<NetworkPerformanceProps>;
export declare const ServiceTierIndicator: React.FC<ServiceTierProps>;
export declare const AlertSeverityIndicator: React.FC<AlertSeverityProps>;
export interface StatusIndicatorsProps extends Omit<StatusBadgeProps, "variant" | "children"> {
    status: StatusVariant;
    showLabel?: boolean;
    label?: string;
    children?: React.ReactNode;
}
export declare const StatusIndicators: React.FC<StatusIndicatorsProps>;
export { statusBadgeVariants, statusDotVariants };
//# sourceMappingURL=StatusIndicators.d.ts.map