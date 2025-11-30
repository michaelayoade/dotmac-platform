/**
 * ISP Brand Theme System
 * Centralized theme configuration with ISP-specific branding elements
 */
import type { ReactNode } from "react";
export declare const ISPColors: {
    primary: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };
    network: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };
    alert: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };
    critical: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };
};
export declare const ISPGradients: {
    primary: string;
    network: string;
    signal: string;
    speed: string;
    data: string;
    billing: string;
    premium: string;
    enterprise: string;
};
export declare const ISPIcons: {
    signal: string;
    wifi: string;
    network: string;
    connection: string;
    speed: string;
    fiber: string;
    broadband: string;
    phone: string;
    tv: string;
    online: string;
    offline: string;
    warning: string;
    excellent: string;
    maintenance: string;
    billing: string;
    payment: string;
    report: string;
    analytics: string;
    support: string;
    ticket: string;
    help: string;
    chat: string;
};
interface ISPThemeConfig {
    portal: "admin" | "customer" | "reseller";
    density: "compact" | "comfortable" | "spacious";
    accentColor: keyof typeof ISPColors;
    showBrandElements: boolean;
    animationsEnabled: boolean;
}
interface ISPThemeProviderProps {
    children: ReactNode;
    config?: Partial<ISPThemeConfig>;
}
export declare function ISPThemeProvider({ children, config }: ISPThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useISPTheme(): ISPThemeConfig;
interface ISPBrandHeaderProps {
    title: string;
    subtitle?: string;
    icon?: string;
    gradient?: keyof typeof ISPGradients;
    className?: string;
}
export declare function ISPBrandHeader({ title, subtitle, icon, gradient, className, }: ISPBrandHeaderProps): import("react/jsx-runtime").JSX.Element;
interface ServiceTierBadgeProps {
    tier: "basic" | "standard" | "premium" | "enterprise";
    size?: "sm" | "md" | "lg";
    className?: string;
}
export declare function ServiceTierBadge({ tier, size, className }: ServiceTierBadgeProps): import("react/jsx-runtime").JSX.Element;
interface NetworkStatusProps {
    status: "excellent" | "good" | "fair" | "poor" | "offline";
    showLabel?: boolean;
    animated?: boolean;
    className?: string;
}
export declare function NetworkStatusIndicator({ status, showLabel, animated, className, }: NetworkStatusProps): import("react/jsx-runtime").JSX.Element;
interface SpeedGaugeProps {
    speed: number;
    maxSpeed: number;
    unit?: string;
    label?: string;
    className?: string;
}
export declare function SpeedGauge({ speed, maxSpeed, unit, label, className, }: SpeedGaugeProps): import("react/jsx-runtime").JSX.Element;
export declare const ISPThemeUtils: {
    getPortalGradient: (portal: string) => string;
    getServiceIcon: (serviceType: string) => string;
    getStatusIcon: (status: string) => string;
};
export {};
//# sourceMappingURL=ISPBrandTheme.d.ts.map