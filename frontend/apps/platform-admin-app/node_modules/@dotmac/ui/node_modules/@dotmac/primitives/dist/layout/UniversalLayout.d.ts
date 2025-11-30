import React from "react";
import type { ComponentType, ReactNode } from "react";
interface NavigationItem {
    id: string;
    label: string;
    icon: ComponentType<{
        className?: string;
    }>;
    href: string;
    badge?: number;
    children?: NavigationItem[];
}
interface PortalBranding {
    logo?: string;
    companyName: string;
    primaryColor: string;
    secondaryColor?: string;
    favicon?: string;
}
interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
}
interface UniversalLayoutProps {
    variant: "admin" | "customer" | "reseller" | "technician" | "management";
    children: ReactNode;
    user?: UserProfile;
    branding?: PortalBranding;
    tenant?: {
        id: string;
        name: string;
    };
    navigation?: NavigationItem[];
    onLogout: () => void;
    className?: string;
    layoutType?: "dashboard" | "sidebar" | "mobile" | "simple";
    showSidebar?: boolean;
    sidebarCollapsible?: boolean;
    mobileBreakpoint?: number;
    showHeader?: boolean;
    headerActions?: Array<{
        id: string;
        label: string;
        icon: React.ComponentType<{
            className?: string;
        }>;
        onClick: () => void;
        badge?: number;
    }>;
    maxWidth?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "7xl";
    padding?: "none" | "sm" | "md" | "lg";
    requireAuth?: boolean;
    requiredRoles?: string[];
    requiredPermissions?: string[];
}
export declare function UniversalLayout({ variant, children, user, branding, tenant, navigation, onLogout, className, layoutType, showSidebar, sidebarCollapsible, mobileBreakpoint, showHeader, headerActions, maxWidth, padding, requireAuth, requiredRoles, requiredPermissions, }: UniversalLayoutProps): import("react/jsx-runtime").JSX.Element;
export default UniversalLayout;
//# sourceMappingURL=UniversalLayout.d.ts.map