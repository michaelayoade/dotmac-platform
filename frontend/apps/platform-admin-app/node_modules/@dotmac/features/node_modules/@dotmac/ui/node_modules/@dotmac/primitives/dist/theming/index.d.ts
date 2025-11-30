/**
 * Theming utilities for DotMac platform
 */
export interface PortalThemeConfig {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        foreground: string;
        muted: string;
        accent: string;
        destructive: string;
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    typography: {
        fontFamily: string;
        fontSize: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
    };
}
export declare const defaultTheme: PortalThemeConfig;
export declare const adminTheme: PortalThemeConfig;
export declare const customerTheme: PortalThemeConfig;
export declare const resellerTheme: PortalThemeConfig;
export declare function createPortalTheme(portal: "admin" | "customer" | "reseller"): PortalThemeConfig;
export declare function applyTheme(theme: PortalThemeConfig): void;
export declare const themes: {
    default: PortalThemeConfig;
    admin: PortalThemeConfig;
    customer: PortalThemeConfig;
    reseller: PortalThemeConfig;
};
//# sourceMappingURL=index.d.ts.map