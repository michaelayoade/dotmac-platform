/**
 * Bundle Optimization Utilities
 * Code splitting, tree shaking, and dynamic loading optimizations
 */
import React from "react";
import type { ComponentType, LazyExoticComponent } from "react";
export interface BundleAnalysis {
    totalSize: number;
    componentSizes: Map<string, number>;
    recommendations: string[];
    splitPoints: string[];
}
export declare const createDynamicImport: <T extends ComponentType<any>>(importFunc: () => Promise<{
    default: T;
}>, componentName: string, preloadCondition?: () => boolean) => LazyExoticComponent<T>;
export declare const SplitPoints: {
    readonly CHARTS: {
        readonly threshold: 50000;
        readonly priority: "high";
        readonly preloadCondition: () => boolean;
    };
    readonly FORMS: {
        readonly threshold: 30000;
        readonly priority: "medium";
        readonly preloadCondition: () => boolean;
    };
    readonly ADMIN: {
        readonly threshold: 25000;
        readonly priority: "low";
        readonly preloadCondition: () => boolean;
    };
    readonly ANIMATIONS: {
        readonly threshold: 20000;
        readonly priority: "low";
        readonly preloadCondition: () => boolean;
    };
};
export declare const LazyCharts: {
    RevenueChart: React.LazyExoticComponent<React.FC<import("../types/chart").RevenueChartProps>>;
    NetworkUsageChart: React.LazyExoticComponent<React.FC<import("../types/chart").NetworkUsageChartProps>>;
    ServiceStatusChart: React.LazyExoticComponent<React.FC<import("../types/chart").ServiceStatusChartProps>>;
    BandwidthChart: React.LazyExoticComponent<React.FC<import("../types/chart").BandwidthChartProps>>;
};
export declare const LazyStatusIndicators: {
    StatusBadge: React.LazyExoticComponent<React.FC<import("../types/status").StatusBadgeProps>>;
    UptimeIndicator: React.LazyExoticComponent<React.FC<import("../types/status").UptimeIndicatorProps>>;
    NetworkPerformanceIndicator: React.LazyExoticComponent<React.FC<import("../types/status").NetworkPerformanceProps>>;
};
export declare const TreeShakableUtils: {
    a11y: {
        announceToScreenReader: () => Promise<(message: string, priority?: "polite" | "assertive") => void>;
        generateChartDescription: () => Promise<(chartType: "line" | "bar" | "area" | "pie", data: any[], title?: string) => string>;
        useKeyboardNavigation: () => Promise<(items: HTMLElement[], options?: {
            loop?: boolean;
            orientation?: "horizontal" | "vertical" | "both";
            onSelect?: (index: number) => void;
            disabled?: boolean;
        }) => {
            currentIndex: number;
            setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
            handleKeyDown: (event: KeyboardEvent) => void;
        }>;
    };
    security: {
        sanitizeText: () => Promise<(text: string) => string>;
        validateData: () => Promise<(<T>(schema: import("zod").ZodType<T>, data: unknown) => T)>;
        validateArray: () => Promise<(<T>(schema: import("zod").ZodType<T>, data: unknown[]) => T[])>;
    };
    performance: {
        useRenderProfiler: () => Promise<(componentName: string, props?: any) => {
            renderCount: number;
            getProfile: () => import("../utils/performance").RenderProfile | undefined;
            getAllProfiles: () => import("../utils/performance").RenderProfile[];
            getRecentMetrics: () => import("../utils/performance").PerformanceMetrics[];
        }>;
        useThrottledState: () => Promise<(<T>(initialValue: T, delay?: number) => [T, (value: T) => void, T])>;
        useDebouncedState: () => Promise<(<T>(initialValue: T, delay?: number) => [T, (value: T) => void, T])>;
    };
};
export declare const analyzeBundleSize: () => Promise<BundleAnalysis>;
export declare const PreloadingStrategies: {
    onHover: (importFunc: () => Promise<any>, delay?: number) => {
        onMouseEnter: () => void;
        onMouseLeave: () => void;
    };
    onVisible: (importFunc: () => Promise<any>, rootMargin?: string) => {
        ref: (element: HTMLElement | null) => void;
    };
    onIdle: (importFunc: () => Promise<any>) => void;
    onIntent: (importFunc: () => Promise<any>) => {
        onMouseMove: (event: MouseEvent, targetElement: HTMLElement) => void;
    };
};
export declare const addResourceHints: () => void;
export declare const bundleSplitConfig: {
    vendor: {
        name: string;
        test: RegExp;
        priority: number;
        chunks: string;
    };
    common: {
        name: string;
        minChunks: number;
        priority: number;
        chunks: string;
        reuseExistingChunk: boolean;
    };
    charts: {
        name: string;
        test: RegExp;
        priority: number;
        chunks: string;
    };
    indicators: {
        name: string;
        test: RegExp;
        priority: number;
        chunks: string;
    };
};
export declare const PerformanceBudgets: {
    sizes: {
        initial: number;
        asyncChunks: number;
        assets: number;
    };
    metrics: {
        firstContentfulPaint: number;
        largestContentfulPaint: number;
        firstInputDelay: number;
        cumulativeLayoutShift: number;
    };
    checkBudgets: (actualSizes: any, actualMetrics: any) => string[];
};
export declare const generateBundleReport: () => Promise<{
    timestamp: string;
    analysis: BundleAnalysis;
    recommendations: string[];
    splitPoints: string[];
    optimizations: {
        lazyComponents: string[];
        treeShakableUtilities: string[];
        preloadingStrategies: string[];
    };
    performanceBudgets: {
        initial: number;
        asyncChunks: number;
        assets: number;
    };
}>;
//# sourceMappingURL=bundle-optimization.d.ts.map