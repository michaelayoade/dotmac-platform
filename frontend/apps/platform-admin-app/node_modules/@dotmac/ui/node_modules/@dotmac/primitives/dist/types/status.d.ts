/**
 * Strongly typed interfaces for status indicator components
 */
export type StatusVariant = "online" | "offline" | "maintenance" | "degraded" | "active" | "suspended" | "pending" | "paid" | "overdue" | "processing" | "critical" | "high" | "medium" | "low";
export type StatusSize = "sm" | "md" | "lg";
export type ServiceTier = "basic" | "standard" | "premium" | "enterprise";
export type AlertSeverity = "info" | "warning" | "error" | "critical";
export interface StatusBadgeProps {
    variant?: StatusVariant;
    size?: StatusSize;
    animated?: boolean;
    children: React.ReactNode;
    className?: string;
    showDot?: boolean;
    pulse?: boolean;
    onClick?: () => void;
    "aria-label"?: string;
}
export interface StatusDotConfig {
    status: StatusVariant;
    size: StatusSize;
    pulse: boolean;
}
export interface UptimeIndicatorProps {
    uptime: number;
    className?: string;
    showLabel?: boolean;
    "aria-label"?: string;
}
export interface UptimeStatus {
    status: "excellent" | "good" | "fair" | "poor";
    color: string;
    bg: string;
    label: string;
}
export interface NetworkPerformanceProps {
    latency: number;
    packetLoss: number;
    bandwidth: number;
    className?: string;
    onMetricClick?: (metric: "latency" | "packetLoss" | "bandwidth") => void;
}
export interface NetworkMetrics {
    latency: {
        value: number;
        status: "excellent" | "good" | "fair" | "poor";
        variant: StatusVariant;
    };
    packetLoss: {
        value: number;
        status: "excellent" | "good" | "fair" | "poor";
        variant: StatusVariant;
    };
    bandwidth: {
        value: number;
        status: "high" | "medium" | "low";
        variant: StatusVariant;
    };
}
export interface ServiceTierProps {
    tier: ServiceTier;
    className?: string;
    onClick?: () => void;
    "aria-label"?: string;
}
export interface ServiceTierConfig {
    label: string;
    variant: StatusVariant;
    icon: string;
    description?: string;
}
export interface AlertSeverityProps {
    severity: AlertSeverity;
    message: string;
    timestamp?: Date;
    className?: string;
    onDismiss?: () => void;
    "aria-label"?: string;
}
export interface AlertSeverityConfig {
    variant: StatusVariant;
    icon: string;
    bg: string;
    border: string;
    textColor: string;
    description: string;
}
export interface StatusConfigurations {
    uptime: Record<UptimeStatus["status"], UptimeStatus>;
    networkMetrics: {
        latency: Record<string, {
            variant: StatusVariant;
            label: string;
        }>;
        packetLoss: Record<string, {
            variant: StatusVariant;
            label: string;
        }>;
        bandwidth: Record<string, {
            variant: StatusVariant;
            label: string;
        }>;
    };
    serviceTiers: Record<ServiceTier, ServiceTierConfig>;
    alertSeverity: Record<AlertSeverity, AlertSeverityConfig>;
}
export interface StatusError {
    component: string;
    message: string;
    code: string;
    timestamp: Date;
}
//# sourceMappingURL=status.d.ts.map