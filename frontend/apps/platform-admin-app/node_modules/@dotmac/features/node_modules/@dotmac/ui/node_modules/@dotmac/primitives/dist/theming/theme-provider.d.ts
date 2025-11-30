/**
 * Dynamic Theme Provider for ISP Framework
 * Supports white-labeling, multi-tenant theming, and brand customization
 *
 * ELIMINATES HARDCODED THEMES: Dynamic theme injection from configuration
 */
import type { ReactNode } from "react";
export interface BrandTheme {
    id: string;
    name: string;
    colors: {
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
            950: string;
        };
        secondary: {
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
            950: string;
        };
        accent?: {
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
            950: string;
        };
        neutral: {
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
            950: string;
        };
        success: {
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
            950: string;
        };
        warning: {
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
            950: string;
        };
        error: {
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
            950: string;
        };
    };
    typography: {
        fontFamily: {
            sans: string[];
            serif: string[];
            mono: string[];
        };
        fontSize: {
            xs: [string, {
                lineHeight: string;
                letterSpacing: string;
            }];
            sm: [string, {
                lineHeight: string;
                letterSpacing: string;
            }];
            base: [string, {
                lineHeight: string;
                letterSpacing: string;
            }];
            lg: [string, {
                lineHeight: string;
                letterSpacing: string;
            }];
            xl: [string, {
                lineHeight: string;
                letterSpacing: string;
            }];
            "2xl": [string, {
                lineHeight: string;
                letterSpacing: string;
            }];
            "3xl": [string, {
                lineHeight: string;
                letterSpacing: string;
            }];
            "4xl": [string, {
                lineHeight: string;
                letterSpacing: string;
            }];
        };
        fontWeight: {
            light: string;
            normal: string;
            medium: string;
            semibold: string;
            bold: string;
            extrabold: string;
        };
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        "2xl": string;
        "3xl": string;
        "4xl": string;
    };
    borderRadius: {
        none: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        "2xl": string;
        full: string;
    };
    shadows: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        "2xl": string;
    };
    brand: {
        logo?: {
            light: string;
            dark: string;
        };
        favicon?: string;
        name: string;
        tagline?: string;
        customCss?: string;
    };
    portals?: {
        [portalType: string]: Partial<BrandTheme>;
    };
}
export type PortalVariant = "admin" | "customer" | "reseller" | "technician" | "management" | "whitelabel";
interface ThemeContextType {
    currentTheme: BrandTheme;
    portalVariant: PortalVariant;
    setTheme: (theme: BrandTheme) => void;
    setPortalVariant: (variant: PortalVariant) => void;
    getPortalTheme: () => BrandTheme;
    getCSSVariables: () => Record<string, string>;
}
interface ThemeProviderProps {
    children: ReactNode;
    theme?: BrandTheme;
    portalVariant?: PortalVariant;
    configEndpoint?: string;
    tenantId?: string;
}
export declare function ThemeProvider({ children, theme: initialTheme, portalVariant, configEndpoint, tenantId, }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useTheme(): ThemeContextType;
export declare function useThemedClasses(): {
    primary: string;
    primaryHover: string;
    secondary: string;
    border: string;
    background: string;
    surface: string;
    text: {
        primary: string;
        secondary: string;
        muted: string;
    };
    shadow: string;
    rounded: string;
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
    };
};
export default ThemeProvider;
//# sourceMappingURL=theme-provider.d.ts.map