/**
 * SSR utilities for safe client-side operations
 */
/**
 * Safely checks if we're running in a browser environment
 * @returns true if window is available (client-side), false if server-side
 */
export declare const isBrowser: boolean;
/**
 * Safely checks if we're running on the server
 * @returns true if running server-side, false if client-side
 */
export declare const isServer: boolean;
/**
 * Safe window accessor that returns undefined on server
 * @returns window object if available, undefined on server
 */
export declare const safeWindow: (Window & typeof globalThis) | undefined;
/**
 * Safe document accessor that returns undefined on server
 * @returns document object if available, undefined on server
 */
export declare const safeDocument: Document | undefined;
/**
 * Hook for safe client-side effects that should not run on server
 * @param effect - Effect function to run only on client
 * @param deps - Dependencies array
 */
export declare function useClientEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
/**
 * Hook for layout effects that should only run on client
 * Uses useLayoutEffect for synchronous DOM mutations
 */
export declare function useBrowserLayoutEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
/**
 * Hook that returns a boolean indicating if we're hydrated
 * Useful for conditional rendering of client-only content
 * @returns true after hydration, false during SSR and before hydration
 */
export declare function useIsHydrated(): boolean;
/**
 * Hook for safely using localStorage with SSR
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist or SSR
 * @returns [value, setValue] tuple
 */
export declare function useLocalStorage<T>(key: string, defaultValue: T): readonly [T, (newValue: T | ((val: T) => T)) => void];
/**
 * Hook for safely using sessionStorage with SSR
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist or SSR
 * @returns [value, setValue] tuple
 */
export declare function useSessionStorage<T>(key: string, defaultValue: T): readonly [T, (newValue: T | ((val: T) => T)) => void];
/**
 * Hook for responsive breakpoints that works with SSR
 * @param breakpoint - CSS breakpoint (e.g., '768px', '1024px')
 * @returns boolean indicating if viewport matches breakpoint
 */
export declare function useMediaQuery(breakpoint: string): boolean;
/**
 * Hook for detecting user preferences with SSR safety
 * @returns object with user preference states
 */
export declare function useUserPreferences(): {
    prefersReducedMotion: boolean;
    prefersHighContrast: boolean;
    prefersDarkMode: boolean;
};
import React from "react";
//# sourceMappingURL=ssr.d.ts.map