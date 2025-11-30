/**
 * Core Web Vitals measurement utilities
 * Based on the web-vitals library patterns
 */
export interface Metric {
    name: string;
    value: number;
    delta: number;
    id: string;
    isFinal: boolean;
}
export type ReportCallback = (metric: Metric) => void;
/**
 * Cumulative Layout Shift (CLS)
 * Measures visual stability
 */
export declare function getCLS(onReport: ReportCallback, reportAllChanges?: boolean): void;
/**
 * First Contentful Paint (FCP)
 * Measures when the first text or image is painted
 */
export declare function getFCP(onReport: ReportCallback): void;
/**
 * First Input Delay (FID)
 * Measures interactivity
 */
export declare function getFID(onReport: ReportCallback): void;
/**
 * Largest Contentful Paint (LCP)
 * Measures loading performance
 */
export declare function getLCP(onReport: ReportCallback, reportAllChanges?: boolean): void;
/**
 * Time to First Byte (TTFB)
 * Measures server response time
 */
export declare function getTTFB(onReport: ReportCallback): void;
/**
 * Convenience functions for one-time measurement
 */
export declare function onCLS(callback: ReportCallback, reportAllChanges?: boolean): void;
export declare function onFCP(callback: ReportCallback): void;
export declare function onFID(callback: ReportCallback): void;
export declare function onLCP(callback: ReportCallback, reportAllChanges?: boolean): void;
export declare function onTTFB(callback: ReportCallback): void;
/**
 * Collect all Core Web Vitals
 */
export declare function collectAllVitals(callback: ReportCallback): void;
/**
 * Web Vitals scoring utility
 */
export declare function scoreMetric(name: string, value: number): "good" | "needs-improvement" | "poor";
/**
 * Create a performance observer that automatically handles cleanup
 */
export declare function createPerformanceObserver(callback: (entries: PerformanceEntry[]) => void, options: PerformanceObserverInit): PerformanceObserver | null;
//# sourceMappingURL=web-vitals.d.ts.map