/**
 * Performance Testing and Benchmarking Utilities
 * Comprehensive test suite for measuring and validating component performance
 */
export interface PerformanceMetrics {
    renderTime: number;
    memoryUsage: number;
    componentCount: number;
    reRenderCount: number;
    bundleSize?: number;
    interactionTime?: number;
}
export interface BenchmarkResult {
    testName: string;
    metrics: PerformanceMetrics;
    baseline?: PerformanceMetrics;
    improvement?: {
        renderTime: string;
        memoryUsage: string;
        reRenderCount: string;
    };
    passed: boolean;
    timestamp: string;
}
export interface PerformanceBudget {
    renderTime: number;
    memoryUsage: number;
    bundleSize: number;
    reRenderLimit: number;
    interactionTime: number;
}
export declare const PERFORMANCE_BUDGETS: Record<string, PerformanceBudget>;
export declare class PerformanceMeasurer {
    private metrics;
    private startTime;
    private renderCount;
    private initialMemory;
    startMeasurement(testName: string): void;
    recordRender(): void;
    recordInteraction(interactionTime: number): void;
    finishMeasurement(): PerformanceMetrics;
    reset(): void;
}
export declare const ComponentBenchmarks: {
    testChartPerformance(ChartComponent: React.ComponentType<any>, testData: any[], budget: PerformanceBudget): Promise<BenchmarkResult>;
    testStatusIndicatorPerformance(IndicatorComponent: React.ComponentType<any>, testCount: number, budget: PerformanceBudget): Promise<BenchmarkResult>;
    testVirtualizedListPerformance(ListComponent: React.ComponentType<any>, itemCount: number, budget: PerformanceBudget): Promise<BenchmarkResult>;
};
export declare const PerformanceComparison: {
    compare(current: PerformanceMetrics, baseline: PerformanceMetrics): BenchmarkResult["improvement"];
    generateReport(results: BenchmarkResult[]): string;
};
export declare const BundleSizeAnalyzer: {
    analyzeBundleSize(): Promise<{
        [key: string]: number;
    }>;
    checkBundleBudgets(sizes: {
        [key: string]: number;
    }): {
        passed: boolean;
        violations: string[];
    };
};
export declare const MemoryLeakDetector: {
    detectLeaks(testFunction: () => Promise<void>, iterations?: number): Promise<{
        hasLeaks: boolean;
        memoryGrowth: number;
        iterations: number;
    }>;
};
export declare const PerformanceTestSuite: {
    runFullSuite(): Promise<{
        benchmarks: BenchmarkResult[];
        bundleAnalysis: {
            [key: string]: number;
        };
        memoryLeaks: any[];
        overallPassed: boolean;
    }>;
};
//# sourceMappingURL=performance-tests.d.ts.map