import type React from "react";
/**
 * Design Patterns for Component Composition
 *
 * This module exports all composition patterns and orchestration utilities
 * for building complex UI components from simple, focused functions.
 */
export * from "./composition";
export declare const CompositionPatterns: {
    createLoadingState: () => {
        loading: () => import("react/jsx-runtime").JSX.Element;
        error: (error: string) => import("react/jsx-runtime").JSX.Element;
        success: (data: unknown) => import("react/jsx-runtime").JSX.Element;
    };
    createFieldComposition: () => {
        label: (text: string) => import("react/jsx-runtime").JSX.Element;
        input: (props: React.InputHTMLAttributes<HTMLInputElement>) => import("react/jsx-runtime").JSX.Element;
        error: (message: string) => import("react/jsx-runtime").JSX.Element;
        help: (text: string) => import("react/jsx-runtime").JSX.Element;
    };
    createLayoutComposition: () => {
        header: (content: React.ReactNode) => import("react/jsx-runtime").JSX.Element;
        main: (content: React.ReactNode) => import("react/jsx-runtime").JSX.Element;
        sidebar: (content: React.ReactNode) => import("react/jsx-runtime").JSX.Element;
        footer: (content: React.ReactNode) => import("react/jsx-runtime").JSX.Element;
    };
};
export declare const CompositionBestPractices: {
    principles: string[];
    patterns: {
        "State-based": string;
        "Layout-based": string;
        "Slot-based": string;
        "Function-based": string;
    };
    antipatterns: string[];
};
//# sourceMappingURL=index.d.ts.map