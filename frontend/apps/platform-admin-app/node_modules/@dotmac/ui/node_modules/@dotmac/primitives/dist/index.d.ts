/**
 * @dotmac/primitives - Unstyled, composable UI primitives for DotMac platform
 *
 * This package provides headless UI components that can be styled with any design system.
 * Components are built with accessibility, composition, and flexibility in mind.
 */
export { Slot } from "@radix-ui/react-slot";
export { cva, type VariantProps } from "class-variance-authority";
export { clsx } from "clsx";
export * from "./composition";
export * from "./data-display";
export * from "./dashboard";
export * from "./charts";
export * from "./maps";
export * from "./visualizations";
export * from "./error";
export * from "./feedback";
export * from "./forms";
export * from "./layout";
export { VirtualizedTable } from "./performance/VirtualizedTable";
export * from "./navigation";
export * from "./theming";
export { UniversalThemeProvider, useUniversalTheme, ThemeAware, PortalBrand, } from "./themes/UniversalTheme";
export * from "./ui";
export * from "./utils/bundle-optimization";
export * from "./utils/performance";
export * from "./utils/ssr";
export * from "./utils/accessibility";
export * from "./utils/icon-helpers";
export * from "./skeletons";
export * from "./performance";
export { ErrorBoundary as ComponentErrorBoundary } from "./components/ErrorBoundary";
export * from "./utils/security";
export * from "./animations/Animations";
export * from "./themes/ISPBrandTheme";
export * from "./security/CSRFProtection";
export declare const version = "1.0.0";
export declare const defaultConfig: {
    readonly toast: {
        readonly duration: 5000;
        readonly position: "top-right";
    };
    readonly table: {
        readonly pageSize: 10;
        readonly showPagination: true;
    };
    readonly chart: {
        readonly responsive: true;
        readonly height: 300;
    };
    readonly form: {
        readonly layout: "vertical";
        readonly size: "md";
    };
    readonly modal: {
        readonly closeOnOverlayClick: true;
        readonly closeOnEscape: true;
    };
};
//# sourceMappingURL=index.d.ts.map