/**
 * Interactive Chart Components for ISP Management Platform
 * Enhanced data visualizations with hover states, tooltips, and animations
 * Security-hardened with input validation and XSS protection
 */
import type { RevenueChartProps, NetworkUsageChartProps, ServiceStatusChartProps, BandwidthChartProps } from "../types/chart";
declare const COLORS: {
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
};
declare const ChartGradients: () => import("react/jsx-runtime").JSX.Element;
export declare const RevenueChart: React.FC<RevenueChartProps>;
export declare const NetworkUsageChart: React.FC<NetworkUsageChartProps>;
export declare const ServiceStatusChart: React.FC<ServiceStatusChartProps>;
export declare const BandwidthChart: React.FC<BandwidthChartProps>;
export { COLORS, ChartGradients };
//# sourceMappingURL=InteractiveChart.d.ts.map