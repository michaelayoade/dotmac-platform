/**
 * Comprehensive Accessibility Utilities for WCAG 2.1 AA Compliance
 * Provides tools for screen readers, keyboard navigation, and inclusive design
 */
export declare const ARIA_ROLES: {
    readonly CHART: "img";
    readonly CHART_CONTAINER: "figure";
    readonly CHART_TITLE: "heading";
    readonly CHART_DESCRIPTION: "text";
    readonly CHART_DATA_TABLE: "table";
    readonly STATUS_INDICATOR: "status";
    readonly ALERT: "alert";
    readonly PROGRESS: "progressbar";
    readonly METRIC: "meter";
    readonly BUTTON: "button";
    readonly LINK: "link";
    readonly TOOLTIP: "tooltip";
    readonly DIALOG: "dialog";
    readonly NAV: "navigation";
    readonly MENU: "menu";
    readonly MENUITEM: "menuitem";
    readonly TAB: "tab";
    readonly TABPANEL: "tabpanel";
};
export declare const ARIA_PROPERTIES: {
    readonly HIDDEN: "aria-hidden";
    readonly EXPANDED: "aria-expanded";
    readonly PRESSED: "aria-pressed";
    readonly SELECTED: "aria-selected";
    readonly LABEL: "aria-label";
    readonly LABELLEDBY: "aria-labelledby";
    readonly DESCRIBEDBY: "aria-describedby";
    readonly LIVE: "aria-live";
    readonly ATOMIC: "aria-atomic";
    readonly BUSY: "aria-busy";
    readonly VALUENOW: "aria-valuenow";
    readonly VALUEMIN: "aria-valuemin";
    readonly VALUEMAX: "aria-valuemax";
    readonly VALUETEXT: "aria-valuetext";
};
export declare const ARIA_LIVE_LEVELS: {
    readonly OFF: "off";
    readonly POLITE: "polite";
    readonly ASSERTIVE: "assertive";
};
export declare const announceToScreenReader: (message: string, priority?: "polite" | "assertive") => void;
export declare const generateChartDescription: (chartType: "line" | "bar" | "area" | "pie", data: any[], title?: string) => string;
export declare const generateDataTable: (data: any[], headers: string[]) => string;
export declare const useKeyboardNavigation: (items: HTMLElement[], options?: {
    loop?: boolean;
    orientation?: "horizontal" | "vertical" | "both";
    onSelect?: (index: number) => void;
    disabled?: boolean;
}) => {
    currentIndex: number;
    setCurrentIndex: import("react").Dispatch<import("react").SetStateAction<number>>;
    handleKeyDown: (event: KeyboardEvent) => void;
};
export declare const useFocusManagement: () => {
    trapFocus: (container: HTMLElement) => () => void;
    saveFocus: () => void;
    restoreFocus: () => void;
};
export declare const COLOR_CONTRAST: {
    readonly COMBINATIONS: {
        readonly PRIMARY: {
            readonly background: "#3B82F6";
            readonly text: "#FFFFFF";
            readonly contrast: 4.76;
        };
        readonly SUCCESS: {
            readonly background: "#059669";
            readonly text: "#FFFFFF";
            readonly contrast: 4.81;
        };
        readonly WARNING: {
            readonly background: "#D97706";
            readonly text: "#FFFFFF";
            readonly contrast: 4.52;
        };
        readonly ERROR: {
            readonly background: "#DC2626";
            readonly text: "#FFFFFF";
            readonly contrast: 5.25;
        };
        readonly INFO: {
            readonly background: "#0284C7";
            readonly text: "#FFFFFF";
            readonly contrast: 4.89;
        };
        readonly NEUTRAL: {
            readonly background: "#4B5563";
            readonly text: "#FFFFFF";
            readonly contrast: 7.21;
        };
    };
    readonly TEXT_INDICATORS: {
        readonly online: "✓ Online";
        readonly offline: "✗ Offline";
        readonly maintenance: "⚠ Maintenance";
        readonly degraded: "⚡ Degraded";
        readonly active: "● Active";
        readonly suspended: "⏸ Suspended";
        readonly pending: "⏳ Pending";
        readonly paid: "✓ Paid";
        readonly overdue: "⚠ Overdue";
        readonly processing: "⏳ Processing";
        readonly critical: "🚨 Critical";
        readonly high: "⬆ High";
        readonly medium: "➡ Medium";
        readonly low: "⬇ Low";
    };
};
export declare const generateStatusText: (variant: string, value?: string | number, context?: string) => string;
export declare const useReducedMotion: () => boolean;
export declare const useScreenReader: () => boolean;
export declare const generateId: (prefix?: string) => string;
//# sourceMappingURL=a11y.d.ts.map