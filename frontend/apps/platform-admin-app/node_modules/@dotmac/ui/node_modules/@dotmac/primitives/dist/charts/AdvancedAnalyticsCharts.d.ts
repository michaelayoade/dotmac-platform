/**
 * Advanced Analytics Charts Component
 *
 * High-performance, interactive charts for business intelligence
 * and customer analytics with real-time data visualization.
 *
 * Features:
 * - Revenue analytics with trend analysis
 * - Customer growth metrics
 * - Service usage patterns
 * - Geographic distribution
 * - Performance indicators
 * - Customizable time ranges
 */
import React from "react";
export interface AnalyticsMetric {
    id: string;
    name: string;
    value: number;
    previousValue?: number;
    change?: number;
    changePercent?: number;
    trend?: "up" | "down" | "stable";
    target?: number;
    unit?: string;
}
export interface TimeSeriesData {
    timestamp: string;
    date: string;
    revenue: number;
    customers: number;
    services: number;
    churn: number;
    arpu: number;
    costs: number;
    profit: number;
}
export interface CustomerSegment {
    segment: string;
    count: number;
    revenue: number;
    percentage: number;
    color: string;
}
export interface GeographicData {
    region: string;
    state?: string;
    city?: string;
    latitude: number;
    longitude: number;
    customers: number;
    revenue: number;
    growth: number;
}
export interface ServiceMetrics {
    service: string;
    subscribers: number;
    revenue: number;
    churn: number;
    satisfaction: number;
    arpu: number;
}
export interface AdvancedAnalyticsChartsProps {
    metrics: AnalyticsMetric[];
    timeSeriesData: TimeSeriesData[];
    customerSegments: CustomerSegment[];
    geographicData: GeographicData[];
    serviceMetrics: ServiceMetrics[];
    dateRange: {
        start: string;
        end: string;
    };
    onDateRangeChange?: (range: {
        start: string;
        end: string;
    }) => void;
    refreshInterval?: number;
    className?: string;
}
export declare const AdvancedAnalyticsCharts: React.FC<AdvancedAnalyticsChartsProps>;
export default AdvancedAnalyticsCharts;
//# sourceMappingURL=AdvancedAnalyticsCharts.d.ts.map