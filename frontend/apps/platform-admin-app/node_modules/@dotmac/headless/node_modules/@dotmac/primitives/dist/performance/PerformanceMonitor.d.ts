interface PerformanceMetrics {
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
    renderTime?: number;
    commitTime?: number;
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    domContentLoaded?: number;
    loadComplete?: number;
}
interface PerformanceThresholds {
    lcp: {
        good: number;
        poor: number;
    };
    fid: {
        good: number;
        poor: number;
    };
    cls: {
        good: number;
        poor: number;
    };
    fcp: {
        good: number;
        poor: number;
    };
    ttfb: {
        good: number;
        poor: number;
    };
}
interface PerformanceMonitorProps {
    /**
     * Enable real-time monitoring
     */
    enabled?: boolean;
    /**
     * Performance thresholds
     */
    thresholds?: Partial<PerformanceThresholds>;
    /**
     * Callback for performance issues
     */
    onPerformanceIssue?: (metric: string, value: number, threshold: number) => void;
    /**
     * Show detailed metrics
     */
    showDetails?: boolean;
    /**
     * Update interval in milliseconds
     */
    updateInterval?: number;
}
export declare function PerformanceMonitor({ enabled, thresholds, onPerformanceIssue, showDetails, updateInterval, }: PerformanceMonitorProps): import("react/jsx-runtime").JSX.Element | null;
export type { PerformanceMetrics, PerformanceThresholds, PerformanceMonitorProps };
//# sourceMappingURL=PerformanceMonitor.d.ts.map