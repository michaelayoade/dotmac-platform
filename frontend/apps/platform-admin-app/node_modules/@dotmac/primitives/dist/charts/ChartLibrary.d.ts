/**
 * Universal Chart Library
 * Pre-configured chart templates for common ISP use cases
 */
import type { UniversalChartProps, ChartDataPoint } from "./UniversalChart";
export interface RevenueChartData extends ChartDataPoint {
    date: string;
    revenue: number;
    target?: number;
    previousYear?: number;
}
export interface RevenueChartProps extends Omit<UniversalChartProps, "data" | "series" | "type"> {
    data: RevenueChartData[];
    showTarget?: boolean;
    showComparison?: boolean;
    currency?: string;
}
export declare function RevenueChart({ data, showTarget, showComparison, currency, ...props }: RevenueChartProps): import("react/jsx-runtime").JSX.Element;
export interface NetworkUsageData extends ChartDataPoint {
    time: string;
    upload: number;
    download: number;
    total?: number;
}
export interface NetworkUsageChartProps extends Omit<UniversalChartProps, "data" | "series" | "type"> {
    data: NetworkUsageData[];
    showTotal?: boolean;
    unit?: "MB" | "GB" | "TB";
}
export declare function NetworkUsageChart({ data, showTotal, unit, ...props }: NetworkUsageChartProps): import("react/jsx-runtime").JSX.Element;
export interface CustomerGrowthData extends ChartDataPoint {
    period: string;
    newCustomers: number;
    churnedCustomers: number;
    totalCustomers: number;
}
export interface CustomerGrowthChartProps extends Omit<UniversalChartProps, "data" | "series" | "type"> {
    data: CustomerGrowthData[];
}
export declare function CustomerGrowthChart({ data, ...props }: CustomerGrowthChartProps): import("react/jsx-runtime").JSX.Element;
export interface ServiceStatusData extends ChartDataPoint {
    status: string;
    count: number;
    percentage: number;
}
export interface ServiceStatusChartProps extends Omit<UniversalChartProps, "data" | "series" | "type"> {
    data: ServiceStatusData[];
    chartType?: "pie" | "donut";
}
export declare function ServiceStatusChart({ data, chartType, ...props }: ServiceStatusChartProps): import("react/jsx-runtime").JSX.Element;
export interface PerformanceData extends ChartDataPoint {
    timestamp: string;
    latency: number;
    throughput: number;
    errorRate: number;
    uptime: number;
}
export interface PerformanceChartProps extends Omit<UniversalChartProps, "data" | "series" | "type"> {
    data: PerformanceData[];
    metrics?: ("latency" | "throughput" | "errorRate" | "uptime")[];
}
export declare function PerformanceChart({ data, metrics, ...props }: PerformanceChartProps): import("react/jsx-runtime").JSX.Element;
export interface BandwidthData extends ChartDataPoint {
    timeSlot: string;
    residential: number;
    business: number;
    enterprise: number;
}
export interface BandwidthChartProps extends Omit<UniversalChartProps, "data" | "series" | "type"> {
    data: BandwidthData[];
    showStacked?: boolean;
}
export declare function BandwidthChart({ data, showStacked, ...props }: BandwidthChartProps): import("react/jsx-runtime").JSX.Element;
export interface TicketVolumeData extends ChartDataPoint {
    date: string;
    created: number;
    resolved: number;
    backlog: number;
}
export interface TicketVolumeChartProps extends Omit<UniversalChartProps, "data" | "series" | "type"> {
    data: TicketVolumeData[];
}
export declare function TicketVolumeChart({ data, ...props }: TicketVolumeChartProps): import("react/jsx-runtime").JSX.Element;
export interface FinancialData extends ChartDataPoint {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
    margin: number;
}
export interface FinancialChartProps extends Omit<UniversalChartProps, "data" | "series" | "type"> {
    data: FinancialData[];
    currency?: string;
}
export declare function FinancialChart({ data, currency, ...props }: FinancialChartProps): import("react/jsx-runtime").JSX.Element;
declare const _default: {
    RevenueChart: typeof RevenueChart;
    NetworkUsageChart: typeof NetworkUsageChart;
    CustomerGrowthChart: typeof CustomerGrowthChart;
    ServiceStatusChart: typeof ServiceStatusChart;
    PerformanceChart: typeof PerformanceChart;
    BandwidthChart: typeof BandwidthChart;
    TicketVolumeChart: typeof TicketVolumeChart;
    FinancialChart: typeof FinancialChart;
};
export default _default;
//# sourceMappingURL=ChartLibrary.d.ts.map