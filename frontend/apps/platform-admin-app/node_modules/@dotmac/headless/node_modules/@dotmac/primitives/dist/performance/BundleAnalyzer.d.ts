interface BundleMetric {
    name: string;
    size: number;
    gzipSize: number;
    loadTime: number;
    isAsync: boolean;
    dependencies: string[];
}
interface BundleAnalysisProps {
    /**
     * Performance budget thresholds in KB
     */
    budgets?: {
        main: number;
        vendor: number;
        async: number;
        total: number;
    };
    /**
     * Enable real-time monitoring
     */
    realTimeMonitoring?: boolean;
    /**
     * Show detailed breakdown
     */
    showDetails?: boolean;
    /**
     * Callback when budget is exceeded
     */
    onBudgetExceeded?: (metric: string, actual: number, budget: number) => void;
}
export declare function BundleAnalyzer({ budgets, realTimeMonitoring, showDetails, onBudgetExceeded, }: BundleAnalysisProps): import("react/jsx-runtime").JSX.Element;
export type { BundleMetric, BundleAnalysisProps };
//# sourceMappingURL=BundleAnalyzer.d.ts.map