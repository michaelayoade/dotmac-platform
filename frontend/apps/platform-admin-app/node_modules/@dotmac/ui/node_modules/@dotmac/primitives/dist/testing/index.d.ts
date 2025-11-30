import { render as rtlRender, type RenderOptions } from "@testing-library/react";
import { fireEvent, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
type RenderResult = ReturnType<typeof rtlRender> & {
    user: ReturnType<typeof userEvent.setup>;
};
type PerformanceMetrics = {
    duration: number;
    domNodes: number;
    threshold: number;
};
type PerformanceRenderResult = RenderResult & {
    measurePerformance: (threshold?: number) => PerformanceMetrics;
};
type RenderWithTimersResult = RenderResult & {
    advanceTimers: (ms: number) => void;
    runAllTimers: () => void;
    cleanup: () => void;
};
declare const render: (ui: React.ReactElement, options?: RenderOptions) => RenderResult;
declare const renderA11y: (ui: React.ReactElement, options?: RenderOptions) => Promise<RenderResult>;
declare const renderSecurity: (ui: React.ReactElement, options?: RenderOptions) => RenderResult;
declare const renderPerformance: (ui: React.ReactElement, options?: RenderOptions) => PerformanceRenderResult;
declare const renderComprehensive: (ui: React.ReactElement, options?: RenderOptions) => Promise<{
    result: PerformanceRenderResult;
    metrics: PerformanceMetrics;
}>;
declare const renderQuick: (ui: React.ReactElement, options?: RenderOptions) => RenderResult;
interface RenderWithTimersOptions extends RenderOptions {
    useRealTimers?: boolean;
}
declare const renderWithTimers: (ui: React.ReactElement, options?: RenderWithTimersOptions) => RenderWithTimersResult;
export { render, renderA11y, renderSecurity, renderPerformance, renderComprehensive, renderQuick, renderWithTimers, screen, fireEvent, waitFor, userEvent, act, };
//# sourceMappingURL=index.d.ts.map