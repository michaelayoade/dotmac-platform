/**
 * Universal Chart Component
 * Unified charting system supporting all chart types with consistent theming
 */
import React from "react";
export type ChartType = "line" | "area" | "bar" | "pie" | "donut" | "combo";
export interface ChartDataPoint {
    [key: string]: string | number | Date | null | undefined;
}
export interface ChartSeries {
    key: string;
    name: string;
    color?: string;
    type?: "line" | "area" | "bar";
    yAxisId?: "left" | "right" | string;
    strokeWidth?: number;
    strokeDasharray?: string;
    fill?: string;
    stackId?: string;
}
export interface ChartVariant {
    admin: {
        primary: "#3B82F6";
        secondary: "#1E40AF";
        accent: "#60A5FA";
        success: "#10B981";
        warning: "#F59E0B";
        danger: "#EF4444";
        gradient: string[];
    };
    customer: {
        primary: "#10B981";
        secondary: "#047857";
        accent: "#34D399";
        success: "#22C55E";
        warning: "#F59E0B";
        danger: "#EF4444";
        gradient: string[];
    };
    reseller: {
        primary: "#8B5CF6";
        secondary: "#7C3AED";
        accent: "#A78BFA";
        success: "#10B981";
        warning: "#F59E0B";
        danger: "#EF4444";
        gradient: string[];
    };
    technician: {
        primary: "#EF4444";
        secondary: "#DC2626";
        accent: "#F87171";
        success: "#10B981";
        warning: "#F59E0B";
        danger: "#B91C1C";
        gradient: string[];
    };
    management: {
        primary: "#F97316";
        secondary: "#EA580C";
        accent: "#FB923C";
        success: "#10B981";
        warning: "#F59E0B";
        danger: "#EF4444";
        gradient: string[];
    };
}
export interface UniversalChartProps {
    data: ChartDataPoint[];
    series: ChartSeries[];
    type: ChartType;
    variant?: keyof ChartVariant;
    width?: number | string;
    height?: number | string;
    aspectRatio?: number;
    xAxis?: {
        dataKey: string;
        label?: string;
        format?: (value: any) => string;
        hide?: boolean;
        angle?: number;
    };
    yAxis?: {
        left?: {
            label?: string;
            format?: (value: any) => string;
            hide?: boolean;
            domain?: [number | string, number | string];
        };
        right?: {
            label?: string;
            format?: (value: any) => string;
            hide?: boolean;
            domain?: [number | string, number | string];
        };
    };
    showGrid?: boolean;
    showLegend?: boolean;
    showTooltip?: boolean;
    showBrush?: boolean;
    smooth?: boolean;
    stacked?: boolean;
    onDataPointClick?: (data: any, series: string) => void;
    onLegendClick?: (series: string) => void;
    referenceLines?: Array<{
        y?: number;
        x?: number | string;
        label?: string;
        color?: string;
        strokeDasharray?: string;
    }>;
    title?: string;
    subtitle?: string;
    loading?: boolean;
    error?: string | null;
    actions?: Array<{
        id: string;
        label: string;
        icon?: React.ComponentType<{
            className?: string;
        }>;
        onClick: () => void;
    }>;
    className?: string;
    cardWrapper?: boolean;
    animationDuration?: number;
    animationEasing?: string;
}
export declare function UniversalChart({ data, series, type, variant, width, height, aspectRatio, xAxis, yAxis, showGrid, showLegend, showTooltip, showBrush, smooth, stacked, onDataPointClick, onLegendClick, referenceLines, title, subtitle, loading, error, actions, className, cardWrapper, animationDuration, animationEasing, }: UniversalChartProps): import("react/jsx-runtime").JSX.Element | null;
export default UniversalChart;
//# sourceMappingURL=UniversalChart.d.ts.map