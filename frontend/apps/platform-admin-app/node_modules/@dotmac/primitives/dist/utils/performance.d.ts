/**
 * Performance Optimization Utilities
 * Tools for React performance optimization, memoization, and rendering efficiency
 */
export interface PerformanceMetrics {
    renderTime: number;
    componentName: string;
    timestamp: number;
    renderCount: number;
    propsChanges: number;
}
export interface RenderProfile {
    component: string;
    totalRenders: number;
    avgRenderTime: number;
    maxRenderTime: number;
    minRenderTime: number;
    lastRender: number;
    propsHistory: any[];
}
export declare const useRenderProfiler: (componentName: string, props?: any) => {
    renderCount: number;
    getProfile: () => RenderProfile | undefined;
    getAllProfiles: () => RenderProfile[];
    getRecentMetrics: () => PerformanceMetrics[];
};
export declare const createMemoizedSelector: <T, R>(selector: (data: T) => R, dependencies?: (data: T) => any[]) => (data: T) => R;
export declare const useDeepMemo: <T>(factory: () => T, deps: any[]) => T;
export declare const useThrottledState: <T>(initialValue: T, delay?: number) => [T, (value: T) => void, T];
export declare const useDebouncedState: <T>(initialValue: T, delay?: number) => [T, (value: T) => void, T];
export declare const useLazyComponent: <T extends React.ComponentType<any>>(importFunction: () => Promise<{
    default: T;
}>, fallback?: React.ComponentType) => {
    Component: import("react").ComponentType<{}> | null;
    loading: boolean;
    error: Error | null;
    loadComponent: () => Promise<void>;
};
export declare const useVirtualizedList: <T>({ items, itemHeight, containerHeight, overscan, }: {
    items: T[];
    itemHeight: number;
    containerHeight: number;
    overscan?: number;
}) => {
    visibleItems: {
        item: T;
        index: number;
        style: {
            position: "absolute";
            top: number;
            height: number;
        };
    }[];
    totalHeight: number;
    handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
    scrollTop: number;
};
export declare const analyzeBundleImpact: (componentName: string, size: number) => {
    component: string;
    size: number;
    percentage: number;
    recommendation: string;
};
export declare const useMemoryMonitor: (componentName: string) => {
    used: number;
    total: number;
    percentage: number;
} | null;
export declare const getPerformanceRecommendations: (profile: RenderProfile) => string[];
export declare const generatePerformanceReport: () => {
    summary: {
        totalComponents: number;
        avgRenderTime: number;
        slowestComponent: string;
        fastestComponent: string;
        totalRenders: number;
    };
    components: RenderProfile[];
    recommendations: {
        component: string;
        suggestions: string[];
    }[];
};
export declare const exportPerformanceData: () => string;
//# sourceMappingURL=performance.d.ts.map