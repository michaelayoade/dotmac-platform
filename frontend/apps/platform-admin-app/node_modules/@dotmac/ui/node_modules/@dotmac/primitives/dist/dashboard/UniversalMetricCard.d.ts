/**
 * Universal Metric Card Component
 * Standardized metric cards with progress indicators, trends, and status colors
 */
import React from "react";
export interface MetricTrend {
    direction: "up" | "down" | "flat";
    percentage: number;
    label?: string;
}
export interface MetricProgress {
    current: number;
    target: number;
    label?: string;
    showPercentage?: boolean;
}
export interface MetricStatus {
    type: "success" | "warning" | "error" | "info" | "neutral";
    label?: string;
    threshold?: number;
}
export interface UniversalMetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ComponentType<{
        className?: string;
    }>;
    variant?: "default" | "compact" | "featured";
    size?: "sm" | "md" | "lg";
    trend?: MetricTrend;
    progress?: MetricProgress;
    status?: MetricStatus;
    prefix?: string;
    suffix?: string;
    currency?: string;
    format?: "number" | "currency" | "percentage" | "duration" | "bytes";
    precision?: number;
    onClick?: () => void;
    href?: string;
    loading?: boolean;
    className?: string;
    contentClassName?: string;
}
export declare function UniversalMetricCard({ title, value, subtitle, icon: Icon, variant, size, trend, progress, status, prefix, suffix, currency, format, precision, onClick, href, loading, className, contentClassName, }: UniversalMetricCardProps): import("react/jsx-runtime").JSX.Element;
export default UniversalMetricCard;
//# sourceMappingURL=UniversalMetricCard.d.ts.map