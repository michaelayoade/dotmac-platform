/**
 * Strongly typed interfaces for chart components
 */
export interface ChartDataPoint {
    name: string;
    value: number;
    color?: string;
}
export interface TooltipPayload {
    value: number | string;
    name: string;
    dataKey: string;
    color: string;
    payload: Record<string, unknown>;
}
export interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
    formatter?: (value: number | string, name: string) => [string, string];
}
export interface RevenueData {
    month: string;
    revenue: number;
    target: number;
    previousYear: number;
}
export interface RevenueChartProps {
    data: RevenueData[];
    height?: number;
    className?: string;
    onDataPointClick?: (data: RevenueData, index: number) => void;
}
export interface NetworkUsageData {
    hour: string;
    download: number;
    upload: number;
    peak: number;
}
export interface NetworkUsageChartProps {
    data: NetworkUsageData[];
    height?: number;
    className?: string;
    onDataPointClick?: (data: NetworkUsageData, index: number) => void;
}
export interface ServiceStatusData {
    name: string;
    value: number;
    status: "online" | "maintenance" | "offline";
}
export interface ServiceStatusChartProps {
    data: ServiceStatusData[];
    height?: number;
    className?: string;
    onDataPointClick?: (data: ServiceStatusData, index: number) => void;
}
export interface BandwidthData {
    time: string;
    utilization: number;
    capacity: number;
}
export interface BandwidthChartProps {
    data: BandwidthData[];
    height?: number;
    className?: string;
    onDataPointClick?: (data: BandwidthData, index: number) => void;
}
export interface ChartColors {
    primary: string;
    secondary: string;
    accent: string;
    warning: string;
    danger: string;
    success: string;
    gradient: {
        primary: string;
        secondary: string;
        accent: string;
    };
}
export interface ChartConfig {
    colors: ChartColors;
    responsive: boolean;
    animations: boolean;
    showTooltips: boolean;
    showLegend: boolean;
}
export interface ChartError {
    message: string;
    code: string;
    recoverable: boolean;
}
export interface ChartLoadingState {
    isLoading: boolean;
    message?: string;
}
//# sourceMappingURL=chart.d.ts.map