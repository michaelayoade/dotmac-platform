import React, { Component, type ErrorInfo, type ReactNode } from "react";
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    errorId: string | null;
}
export interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
    level?: "page" | "section" | "component";
    enableRetry?: boolean;
    showErrorDetails?: boolean;
}
export declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    private retryTimeoutId;
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    handleRetry: () => void;
    handleReload: () => void;
    render(): string | number | boolean | Iterable<React.ReactNode> | import("react/jsx-runtime").JSX.Element | null | undefined;
}
export declare function useErrorHandler(): (error: Error, context?: string) => string;
export declare function withErrorBoundary<P extends object>(WrappedComponent: React.ComponentType<P>, errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">): {
    (props: P): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export {};
//# sourceMappingURL=ErrorBoundary.d.ts.map