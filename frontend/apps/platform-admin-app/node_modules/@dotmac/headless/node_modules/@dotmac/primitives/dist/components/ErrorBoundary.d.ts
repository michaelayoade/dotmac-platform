/**
 * Error Boundary for graceful component failure handling
 */
import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    errorId: string;
}
export interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
    isolate?: boolean;
}
export declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    private retryTimeoutId;
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState>;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    private reportError;
    private handleRetry;
    componentWillUnmount(): void;
    render(): string | number | boolean | Iterable<React.ReactNode> | import("react/jsx-runtime").JSX.Element | null | undefined;
    private getComponentName;
}
export declare function withErrorBoundary<P extends object>(Component: React.ComponentType<P>, errorBoundaryConfig?: Omit<ErrorBoundaryProps, "children">): {
    (props: P): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export declare function useErrorHandler(): (error: Error, context?: string) => void;
export {};
//# sourceMappingURL=ErrorBoundary.d.ts.map