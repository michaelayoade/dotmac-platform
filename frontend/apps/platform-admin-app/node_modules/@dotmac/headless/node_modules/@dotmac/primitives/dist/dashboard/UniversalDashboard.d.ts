/**
 * Universal Dashboard Component
 * Provides consistent dashboard layout patterns across all portal variants
 */
import type { ComponentType, ReactNode } from "react";
export interface DashboardVariant {
    admin: {
        primaryColor: "#0F172A";
        accentColor: "#3B82F6";
        gradientFrom: "from-blue-600";
        gradientTo: "to-indigo-700";
    };
    customer: {
        primaryColor: "#059669";
        accentColor: "#10B981";
        gradientFrom: "from-emerald-600";
        gradientTo: "to-teal-700";
    };
    reseller: {
        primaryColor: "#7C3AED";
        accentColor: "#8B5CF6";
        gradientFrom: "from-violet-600";
        gradientTo: "to-purple-700";
    };
    technician: {
        primaryColor: "#DC2626";
        accentColor: "#EF4444";
        gradientFrom: "from-red-600";
        gradientTo: "to-rose-700";
    };
    management: {
        primaryColor: "#EA580C";
        accentColor: "#F97316";
        gradientFrom: "from-orange-600";
        gradientTo: "to-amber-700";
    };
}
export interface DashboardUser {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
}
export interface DashboardTenant {
    id: string;
    name: string;
    companyName?: string;
    plan?: string;
    status?: "active" | "trial" | "suspended" | "inactive";
    trialDaysLeft?: number;
}
export interface DashboardHeaderAction {
    id: string;
    label: string;
    icon?: ComponentType<{
        className?: string;
    }>;
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost";
}
export interface UniversalDashboardProps {
    variant: keyof DashboardVariant;
    user?: DashboardUser;
    tenant?: DashboardTenant;
    title: string;
    subtitle?: string;
    actions?: DashboardHeaderAction[];
    children: ReactNode;
    isLoading?: boolean;
    error?: Error | string | null;
    onRefresh?: () => void;
    loadingMessage?: string;
    emptyStateMessage?: string;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
    padding?: "none" | "sm" | "md" | "lg" | "xl";
    spacing?: "tight" | "normal" | "relaxed";
    showGradientHeader?: boolean;
    showUserInfo?: boolean;
    showTenantInfo?: boolean;
    className?: string;
}
export declare function UniversalDashboard({ variant, user, tenant, title, subtitle, actions, children, isLoading, error, onRefresh, loadingMessage, emptyStateMessage, maxWidth, padding, spacing, showGradientHeader, showUserInfo, showTenantInfo, className, }: UniversalDashboardProps): import("react/jsx-runtime").JSX.Element;
export default UniversalDashboard;
//# sourceMappingURL=UniversalDashboard.d.ts.map