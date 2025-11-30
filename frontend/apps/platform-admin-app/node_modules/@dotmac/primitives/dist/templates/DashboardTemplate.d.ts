import React from "react";
interface MetricCard {
    id: string;
    title: string;
    value: string | number;
    change?: {
        value: number;
        type: "increase" | "decrease" | "neutral";
        period: string;
    };
    icon?: React.ComponentType<any>;
    color?: "blue" | "green" | "yellow" | "red" | "gray";
}
interface ChartWidget {
    id: string;
    title: string;
    component: React.ComponentType<any>;
    size: "small" | "medium" | "large" | "full";
    data?: any;
}
interface QuickAction {
    id: string;
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<any>;
    disabled?: boolean;
}
interface DashboardTemplateProps {
    title: string;
    subtitle?: string;
    metrics: MetricCard[];
    charts: ChartWidget[];
    quickActions?: QuickAction[];
    customContent?: React.ReactNode;
    refreshData?: () => void;
    loading?: boolean;
    className?: string;
}
export declare const DashboardTemplate: React.FC<DashboardTemplateProps>;
export {};
//# sourceMappingURL=DashboardTemplate.d.ts.map