/**
 * Unstyled, composable Chart primitives using Recharts
 */
import { type VariantProps } from "class-variance-authority";
import type React from "react";
declare const chartVariants: (props?: ({
    size?: "sm" | "md" | "lg" | "xl" | null | undefined;
    variant?: "default" | "minimal" | "detailed" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface BaseChartProps extends VariantProps<typeof chartVariants> {
    data: unknown[];
    width?: number | string;
    height?: number | string;
    className?: string;
    loading?: boolean;
    error?: string;
    emptyText?: string;
    title?: string;
    description?: string;
}
export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    loading?: boolean;
    error?: string;
    emptyText?: string;
    title?: string;
    description?: string;
    actions?: React.ReactNode;
}
declare const ChartContainer: React.ForwardRefExoticComponent<ChartContainerProps & React.RefAttributes<HTMLDivElement>>;
export interface LineChartProps extends BaseChartProps {
    lines?: Array<{
        key: string;
        stroke?: string;
        strokeWidth?: number;
        strokeDasharray?: string;
        dot?: boolean;
        activeDot?: boolean;
    }>;
    showGrid?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
    xAxisKey?: string;
    yAxisDomain?: [number, number] | ["auto", "auto"];
}
export declare function LineChart({ data, lines, width, height, showGrid, showTooltip, showLegend, xAxisKey, yAxisDomain, size, variant, className, loading, error, emptyText, title, description, }: LineChartProps): import("react/jsx-runtime").JSX.Element;
export interface BarChartProps extends BaseChartProps {
    bars?: Array<{
        key: string;
        fill?: string;
        stackId?: string;
    }>;
    showGrid?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
    xAxisKey?: string;
    yAxisDomain?: [number, number] | ["auto", "auto"];
    layout?: "horizontal" | "vertical";
}
export declare function BarChart({ data, bars, width, height, showGrid, showTooltip, showLegend, xAxisKey, yAxisDomain, layout, size, variant, className, loading, error, emptyText, title, description, }: BarChartProps): import("react/jsx-runtime").JSX.Element;
export interface AreaChartProps extends BaseChartProps {
    areas?: Array<{
        key: string;
        stroke?: string;
        fill?: string;
        stackId?: string;
    }>;
    showGrid?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
    xAxisKey?: string;
    yAxisDomain?: [number, number] | ["auto", "auto"];
}
export declare function AreaChart({ data, areas, width, height, showGrid, showTooltip, showLegend, xAxisKey, yAxisDomain, size, variant, className, loading, error, emptyText, title, description, }: AreaChartProps): import("react/jsx-runtime").JSX.Element;
export interface PieChartProps extends BaseChartProps {
    dataKey: string;
    nameKey?: string;
    colors?: string[];
    innerRadius?: number;
    outerRadius?: number;
    showTooltip?: boolean;
    showLegend?: boolean;
    showLabels?: boolean;
}
export declare function PieChart({ data, dataKey, nameKey, colors, innerRadius, outerRadius, width, height, showTooltip, showLegend, showLabels, size, variant, className, loading, error, emptyText, title, description, }: PieChartProps): import("react/jsx-runtime").JSX.Element;
export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: {
        value: number;
        direction: "up" | "down" | "neutral";
    };
    icon?: React.ReactNode;
    loading?: boolean;
    size?: "sm" | "md" | "lg";
}
export declare const MetricCard: React.ForwardRefExoticComponent<MetricCardProps & React.RefAttributes<HTMLDivElement>>;
export declare const chartUtils: {
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
    formatCurrency: (value: number, currency?: string) => string;
    formatPercentage: (value: number) => string;
    generateColors: (count: number, hue?: number, saturation?: number) => string[];
};
export { ChartContainer };
//# sourceMappingURL=Chart.d.ts.map