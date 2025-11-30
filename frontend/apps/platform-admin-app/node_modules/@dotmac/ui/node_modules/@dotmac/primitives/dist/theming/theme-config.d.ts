/**
 * Dynamic Theme Configuration for White-labeling
 * Generates theme variants from configuration instead of hardcoding
 */
import type { BrandTheme, PortalVariant } from "./theme-provider";
export interface ThemeConfig {
    brandColor: string;
    accentColor?: string;
    brandName: string;
    logoUrl?: string;
    fontFamily?: string;
    customCss?: string;
}
export declare function generateThemeFromConfig(config: ThemeConfig): BrandTheme;
export declare const commonISPThemes: Record<string, ThemeConfig>;
export declare function generatePortalThemes(baseConfig: ThemeConfig): Record<PortalVariant, BrandTheme>;
export declare class ThemeConfigLoader {
    private static cache;
    static loadThemeConfig(source: "api" | "local" | "env", options?: {
        apiEndpoint?: string;
        tenantId?: string;
        portalVariant?: PortalVariant;
        fallbackConfig?: ThemeConfig;
    }): Promise<BrandTheme>;
    private static loadFromAPI;
    private static loadFromEnvironment;
    private static loadFromLocalConfig;
}
declare const _default: {
    generateThemeFromConfig: typeof generateThemeFromConfig;
    commonISPThemes: Record<string, ThemeConfig>;
    generatePortalThemes: typeof generatePortalThemes;
    ThemeConfigLoader: typeof ThemeConfigLoader;
};
export default _default;
//# sourceMappingURL=theme-config.d.ts.map