/**
 * Whitelabel Theme Provider
 * Dynamic theming system for partner branding
 * Leverages existing ISPBrandTheme with runtime configuration
 */
import React from "react";
import type { ReactNode } from "react";
interface WhitelabelConfig {
    brand: {
        name: string;
        tagline?: string;
        logo: string;
        logo_dark?: string;
        favicon?: string;
    };
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    typography: {
        font_family: string;
        font_url?: string;
    };
    domain: {
        custom?: string;
        ssl: boolean;
        verified: boolean;
    };
    contact: {
        email: string;
        phone?: string;
        support_url?: string;
    };
    legal: {
        company_name: string;
        privacy_url?: string;
        terms_url?: string;
        address?: string;
    };
    social: {
        website?: string;
        facebook?: string;
        twitter?: string;
        linkedin?: string;
    };
    css_variables: Record<string, string>;
    custom_css?: string;
}
interface WhitelabelContextType {
    config: WhitelabelConfig | null;
    isWhitelabel: boolean;
    updateConfig: (config: WhitelabelConfig) => void;
    resetToDefault: () => void;
}
interface WhitelabelThemeProviderProps {
    children: ReactNode;
    partnerId?: string;
    domain?: string;
    fallbackConfig?: WhitelabelConfig;
    apiEndpoint?: string;
}
export declare const WhitelabelThemeProvider: React.FC<WhitelabelThemeProviderProps>;
export declare const useWhitelabel: () => WhitelabelContextType;
export declare const WhitelabelLogo: React.FC<{
    className?: string;
    variant?: "light" | "dark";
    fallbackText?: string;
}>;
export declare const WhitelabelContact: React.FC<{
    type: "email" | "phone" | "support";
    className?: string;
    fallback?: string;
}>;
export default WhitelabelThemeProvider;
//# sourceMappingURL=WhitelabelTheme.d.ts.map