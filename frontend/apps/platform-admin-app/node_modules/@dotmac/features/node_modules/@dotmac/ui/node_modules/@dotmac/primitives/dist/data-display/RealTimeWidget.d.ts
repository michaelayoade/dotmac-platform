import { type VariantProps } from "class-variance-authority";
import type React from "react";
declare const widgetVariants: (props?: ({
    size?: "sm" | "md" | "lg" | "xl" | null | undefined;
    variant?: "default" | "minimal" | "outlined" | "filled" | null | undefined;
    status?: "normal" | "warning" | "critical" | "offline" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface BaseRealTimeWidgetProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof widgetVariants> {
    title: string;
    subtitle?: string;
    refreshInterval?: number;
    onRefresh?: () => void;
    loading?: boolean;
    error?: string;
    lastUpdated?: Date;
    actions?: React.ReactNode;
}
export interface StatusIndicatorProps {
    status: "online" | "offline" | "warning" | "critical";
    pulse?: boolean;
    size?: "sm" | "md" | "lg";
}
export declare function StatusIndicator({ status, pulse, size }: StatusIndicatorProps): import("react/jsx-runtime").JSX.Element;
declare const BaseRealTimeWidget: React.ForwardRefExoticComponent<BaseRealTimeWidgetProps & React.RefAttributes<HTMLDivElement>>;
export interface NetworkDeviceWidgetProps extends Omit<BaseRealTimeWidgetProps, "title"> {
    device: {
        id: string;
        name: string;
        type: string;
        status: "online" | "offline" | "warning" | "critical";
        ipAddress: string;
        uptime: number;
        lastSeen: Date;
        metrics: {
            cpuUsage: number;
            memoryUsage: number;
            networkUtilization: number;
            temperature?: number;
        };
    };
}
export declare function NetworkDeviceWidget({ device, className, ...props }: NetworkDeviceWidgetProps): import("react/jsx-runtime").JSX.Element;
export declare namespace NetworkDeviceWidget {
    var displayName: string;
}
export interface ServiceHealthWidgetProps extends Omit<BaseRealTimeWidgetProps, "title"> {
    service: {
        name: string;
        status: "healthy" | "degraded" | "unhealthy" | "unknown";
        responseTime: number;
        uptime: number;
        version: string;
        endpoints: Array<{
            name: string;
            status: "up" | "down" | "degraded";
            responseTime: number;
        }>;
    };
}
export declare function ServiceHealthWidget({ service, className, ...props }: ServiceHealthWidgetProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ServiceHealthWidget {
    var displayName: string;
}
export interface RealTimeMetricsWidgetProps extends Omit<BaseRealTimeWidgetProps, "title"> {
    title: string;
    metrics: Array<{
        label: string;
        value: number;
        unit?: string;
        trend?: {
            direction: "up" | "down" | "stable";
            percentage: number;
        };
        threshold?: {
            warning: number;
            critical: number;
        };
    }>;
}
export declare function RealTimeMetricsWidget({ title, metrics, className, ...props }: RealTimeMetricsWidgetProps): import("react/jsx-runtime").JSX.Element;
export declare namespace RealTimeMetricsWidget {
    var displayName: string;
}
export { BaseRealTimeWidget };
//# sourceMappingURL=RealTimeWidget.d.ts.map