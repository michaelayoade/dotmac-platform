import React from "react";
interface PortalBranding {
    logo?: string;
    companyName: string;
    primaryColor: string;
    secondaryColor?: string;
}
interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
}
interface HeaderAction {
    id: string;
    label: string;
    icon: React.ComponentType<{
        className?: string;
    }>;
    onClick: () => void;
    badge?: number;
    variant?: "default" | "ghost" | "outline";
}
interface UniversalHeaderProps {
    variant: "admin" | "customer" | "reseller" | "technician" | "management";
    user?: UserProfile;
    branding?: PortalBranding;
    tenant?: {
        id: string;
        name: string;
    };
    actions?: HeaderAction[];
    onLogout: () => void;
    onMenuToggle?: () => void;
    showMobileMenu?: boolean;
    className?: string;
}
export default function UniversalHeader({ variant, user, branding, tenant, actions, onLogout, onMenuToggle, showMobileMenu, className, }: UniversalHeaderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=UniversalHeader.d.ts.map