export interface PerformanceMeasurement {
    name: string;
    duration: number;
    startTime: number;
    endTime: number;
    metadata?: Record<string, any>;
}
/**
 * Measure the performance of a function execution
 */
export declare function measurePerformance<T>(name: string, fn: () => T, metadata?: Record<string, any>): {
    result: T;
    measurement: PerformanceMeasurement;
};
/**
 * Measure async function performance
 */
export declare function measureAsyncPerformance<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<{
    result: T;
    measurement: PerformanceMeasurement;
}>;
/**
 * Higher-order component for performance tracking
 */
export declare function withPerformanceTracking<P extends Record<string, any>>(WrappedComponent: React.ComponentType<P>, componentName?: string): React.FC<P>;
/**
 * Hook for collecting performance metrics
 */
export declare function usePerformanceMetrics(componentName: string): {
    renderCount: number;
    averageRenderTime: number;
    slowRenders: number;
    lastRenderTime: number;
};
/**
 * Bundle optimization utilities
 */
export declare const optimizeBundle: {
    /**
     * Lazy load a component with loading fallback
     */
    lazyLoad: <T extends React.ComponentType<any>>(importFn: () => Promise<{
        default: T;
    }>, fallback?: React.ComponentType) => (props: React.ComponentProps<T>) => React.FunctionComponentElement<React.SuspenseProps>;
    /**
     * Preload a module for faster lazy loading
     */
    preload: (importFn: () => Promise<any>) => Promise<void>;
    /**
     * Create a resource hint for prefetching
     */
    prefetch: (href: string, as?: "script" | "style" | "image") => void;
    /**
     * Create a resource hint for preloading
     */
    preloadResource: (href: string, as: "script" | "style" | "image" | "font", type?: string) => void;
};
/**
 * Memory usage utilities
 */
export declare const memoryUtils: {
    /**
     * Get current memory usage if supported
     */
    getMemoryUsage: () => {
        used: number;
        total: number;
    } | null;
    /**
     * Monitor memory leaks by tracking object references
     */
    trackMemoryLeaks: (objectName: string, obj: any) => {
        trackRef: (ref: any) => Set<unknown>;
        untrackRef: (ref: any) => boolean;
        getRefCount: () => number;
    } | undefined;
};
/**
 * Network performance utilities
 */
export declare const networkUtils: {
    /**
     * Get connection information
     */
    getConnectionInfo: () => {
        effectiveType: any;
        downlink: any;
        rtt: any;
        saveData: any;
    } | null;
    /**
     * Measure request performance
     */
    measureRequest: (url: string, options?: RequestInit) => Promise<{
        response: Response;
        timing: {
            dns: number;
            connect: number;
            request: number;
            response: number;
            total: number;
        };
    }>;
};
import React from "react";
//# sourceMappingURL=performance-utils.d.ts.map