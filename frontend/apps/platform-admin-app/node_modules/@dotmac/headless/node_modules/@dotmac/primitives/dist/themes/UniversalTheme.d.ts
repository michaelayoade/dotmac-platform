/**
 * Universal Theme System
 * Extends the ISP Brand Theme with variant-based theming for all portal types
 */
import type { ReactNode } from "react";
import { ISPColors } from "./ISPBrandTheme";
interface UniversalThemeConfig {
    variant: "admin" | "customer" | "reseller" | "technician" | "management";
    density: "compact" | "comfortable" | "spacious";
    colorScheme: "light" | "dark" | "system";
    accentColor: keyof typeof ISPColors;
    showBrandElements: boolean;
    animationsEnabled: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
}
declare const portalThemes: {
    admin: {
        name: string;
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        surfaceColor: string;
        textColor: string;
        gradient: string;
        accent: "primary";
    };
    customer: {
        name: string;
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        surfaceColor: string;
        textColor: string;
        gradient: string;
        accent: "network";
    };
    reseller: {
        name: string;
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        surfaceColor: string;
        textColor: string;
        gradient: string;
        accent: "primary";
    };
    technician: {
        name: string;
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        surfaceColor: string;
        textColor: string;
        gradient: string;
        accent: "network";
    };
    management: {
        name: string;
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        surfaceColor: string;
        textColor: string;
        gradient: string;
        accent: "alert";
    };
};
interface UniversalThemeProviderProps {
    children: ReactNode;
    config?: Partial<UniversalThemeConfig>;
}
export declare function UniversalThemeProvider({ children, config }: UniversalThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useUniversalTheme(): {
    config: UniversalThemeConfig;
    portalTheme: (typeof portalThemes)[keyof typeof portalThemes];
    updateConfig: (updates: Partial<UniversalThemeConfig>) => void;
    getThemeClasses: () => string;
    getCSSVariables: () => Record<string, string>;
};
interface ThemeAwareProps {
    children: ReactNode;
    variant?: "surface" | "elevated" | "outlined";
    className?: string;
}
export declare function ThemeAware({ children, variant, className }: ThemeAwareProps): import("react/jsx-runtime").JSX.Element;
interface PortalBrandProps {
    showLogo?: boolean;
    showIcon?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}
export declare function PortalBrand({ showLogo, showIcon, size, className, }: PortalBrandProps): import("react/jsx-runtime").JSX.Element;
export declare const UniversalThemeUtils: {
    getVariantTheme: (variant: UniversalThemeConfig["variant"]) => {
        name: string;
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        surfaceColor: string;
        textColor: string;
        gradient: string;
        accent: "primary";
    } | {
        name: string;
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        surfaceColor: string;
        textColor: string;
        gradient: string;
        accent: "network";
    } | {
        name: string;
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        surfaceColor: string;
        textColor: string;
        gradient: string;
        accent: "primary";
    } | {
        name: string;
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        surfaceColor: string;
        textColor: string;
        gradient: string;
        accent: "network";
    } | {
        name: string;
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        surfaceColor: string;
        textColor: string;
        gradient: string;
        accent: "alert";
    };
    applyPortalStyles: (variant: UniversalThemeConfig["variant"], element: HTMLElement) => void;
    generateThemeCSS: (config: UniversalThemeConfig) => string;
    getPortalGradient: (portal: string) => string;
    getServiceIcon: (serviceType: string) => string;
    getStatusIcon: (status: string) => string;
};
export { portalThemes };
export type { UniversalThemeConfig };
//# sourceMappingURL=UniversalTheme.d.ts.map