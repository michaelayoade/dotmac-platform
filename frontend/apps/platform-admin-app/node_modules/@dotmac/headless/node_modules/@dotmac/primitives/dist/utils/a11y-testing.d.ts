/**
 * Accessibility Testing Utilities for WCAG 2.1 AA Compliance
 * Provides automated testing and validation tools
 */
export interface AccessibilityViolation {
    type: "error" | "warning";
    rule: string;
    description: string;
    element?: HTMLElement;
    severity: "critical" | "serious" | "moderate" | "minor";
}
export interface AccessibilityTestResult {
    passed: boolean;
    violations: AccessibilityViolation[];
    score: number;
    summary: {
        total: number;
        critical: number;
        serious: number;
        moderate: number;
        minor: number;
    };
}
export declare const calculateContrastRatio: (foreground: string, background: string) => number;
export declare const CONTRAST_REQUIREMENTS: {
    AA_NORMAL: number;
    AA_LARGE: number;
    AAA_NORMAL: number;
    AAA_LARGE: number;
};
export declare const meetsContrastRequirement: (ratio: number, level?: "AA" | "AAA", textSize?: "normal" | "large") => boolean;
export declare const testKeyboardNavigation: (container: HTMLElement) => AccessibilityViolation[];
export declare const testARIAAttributes: (container: HTMLElement) => AccessibilityViolation[];
export declare const testColorContrast: (container: HTMLElement) => AccessibilityViolation[];
export declare const testSemanticStructure: (container: HTMLElement) => AccessibilityViolation[];
export declare const runAccessibilityTest: (container: HTMLElement) => AccessibilityTestResult;
export declare const generateAccessibilityReport: (result: AccessibilityTestResult) => string;
export declare const runDevelopmentA11yTest: (element?: HTMLElement) => void;
//# sourceMappingURL=a11y-testing.d.ts.map