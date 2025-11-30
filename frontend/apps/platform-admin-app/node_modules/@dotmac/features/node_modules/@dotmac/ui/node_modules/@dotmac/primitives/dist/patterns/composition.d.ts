/**
 * Composition Orchestration Patterns
 *
 * This module provides patterns for composing complex UI components
 * using small, focused, reusable functions and components.
 */
import type { ReactNode } from "react";
export type ComponentRenderer<T = unknown> = (props: T) => ReactNode;
export type ConditionalRenderer<T = unknown> = (props: T) => boolean;
export type ComposableProps<T = unknown> = T & {
    children?: ReactNode;
    className?: string;
};
/**
 * Conditional rendering composition
 */
export declare function when<T>(condition: ConditionalRenderer<T> | boolean, component: ComponentRenderer<T>): (props: T) => ReactNode;
/**
 * Component pipeline composition
 */
export declare function compose<T>(...renderers: ComponentRenderer<T>[]): (props: T) => import("react/jsx-runtime").JSX.Element;
/**
 * Slot-based composition
 */
export declare function createSlotRenderer<T extends Record<string, unknown>>(slots: Partial<Record<keyof T, ComponentRenderer<T[keyof T]>>>): (props: T) => import("react/jsx-runtime").JSX.Element;
/**
 * State-based composition orchestrator
 */
export interface StateCompositionConfig<T, S> {
    states: Record<keyof S, ConditionalRenderer<T>>;
    renderers: Record<keyof S, ComponentRenderer<T>>;
    fallback?: ComponentRenderer<T>;
}
export declare function createStateComposer<T, S>(config: StateCompositionConfig<T, S>): (props: T) => ReactNode;
/**
 * HOC composition helper
 */
export declare function withComposition<T>(BaseComponent: ComponentRenderer<T>, ...enhancers: ((component: ComponentRenderer<T>) => ComponentRenderer<T>)[]): ComponentRenderer<T>;
/**
 * Layout composition patterns
 */
export declare const LayoutComposers: {
    stack: (gap?: string) => (...renderers: ComponentRenderer<any>[]) => (props: unknown) => import("react/jsx-runtime").JSX.Element;
    inline: (gap?: string) => (...renderers: ComponentRenderer<any>[]) => (props: unknown) => import("react/jsx-runtime").JSX.Element;
    grid: (cols?: number) => (...renderers: ComponentRenderer<any>[]) => (props: unknown) => import("react/jsx-runtime").JSX.Element;
};
/**
 * Accessibility composition helpers
 */
export declare const A11yComposers: {
    withLabel: <T>(labelRenderer: ComponentRenderer<T>) => (component: ComponentRenderer<T>) => (props: T) => import("react/jsx-runtime").JSX.Element;
    withError: <T extends {
        error?: string;
    }>(errorRenderer: ComponentRenderer<Pick<T, "error">>) => (component: ComponentRenderer<T>) => (props: T) => import("react/jsx-runtime").JSX.Element;
    withHelp: <T extends {
        help?: string;
    }>(helpRenderer: ComponentRenderer<Pick<T, "help">>) => (component: ComponentRenderer<T>) => (props: T) => import("react/jsx-runtime").JSX.Element;
};
declare const _default: {
    when: typeof when;
    compose: typeof compose;
    createSlotRenderer: typeof createSlotRenderer;
    createStateComposer: typeof createStateComposer;
    withComposition: typeof withComposition;
    LayoutComposers: {
        stack: (gap?: string) => (...renderers: ComponentRenderer<any>[]) => (props: unknown) => import("react/jsx-runtime").JSX.Element;
        inline: (gap?: string) => (...renderers: ComponentRenderer<any>[]) => (props: unknown) => import("react/jsx-runtime").JSX.Element;
        grid: (cols?: number) => (...renderers: ComponentRenderer<any>[]) => (props: unknown) => import("react/jsx-runtime").JSX.Element;
    };
    A11yComposers: {
        withLabel: <T>(labelRenderer: ComponentRenderer<T>) => (component: ComponentRenderer<T>) => (props: T) => import("react/jsx-runtime").JSX.Element;
        withError: <T extends {
            error?: string;
        }>(errorRenderer: ComponentRenderer<Pick<T, "error">>) => (component: ComponentRenderer<T>) => (props: T) => import("react/jsx-runtime").JSX.Element;
        withHelp: <T extends {
            help?: string;
        }>(helpRenderer: ComponentRenderer<Pick<T, "help">>) => (component: ComponentRenderer<T>) => (props: T) => import("react/jsx-runtime").JSX.Element;
    };
};
export default _default;
//# sourceMappingURL=composition.d.ts.map