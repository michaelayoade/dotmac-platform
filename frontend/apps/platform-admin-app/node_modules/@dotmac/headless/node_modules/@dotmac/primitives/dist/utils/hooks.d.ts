/**
 * Utility Hooks for DotMac Components
 */
export declare function useId(prefix?: string): string;
export declare function useIsHydrated(): boolean;
export declare function useClientEffect(effect: () => void | (() => void), deps?: React.DependencyList): void;
export declare function useMediaQuery(query: string): boolean;
export declare function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void];
export declare function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T) => void];
export declare function usePrefersReducedMotion(): boolean;
export declare function useUserPreferences(): {
    theme: string;
    setTheme: (value: string) => void;
    fontSize: string;
    setFontSize: (value: string) => void;
    language: string;
    setLanguage: (value: string) => void;
    prefersReducedMotion: boolean;
};
export declare function useFocusTrap(enabled?: boolean): import("react").RefObject<HTMLElement>;
export declare function useKeyboardNavigation(items: string[], onSelect: (item: string) => void): {
    activeIndex: number;
    setActiveIndex: import("react").Dispatch<import("react").SetStateAction<number>>;
};
export declare function useScreenReaderAnnouncement(): (message: string, priority?: "polite" | "assertive") => void;
export declare function useAriaExpanded(initialExpanded?: boolean): {
    expanded: boolean;
    setExpanded: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    toggle: () => void;
    expand: () => void;
    collapse: () => void;
    "aria-expanded": boolean;
};
export declare function useAriaSelection<T>(items: T[], multiSelect?: boolean): {
    selectedItems: T[];
    select: (item: T) => void;
    deselect: (item: T) => void;
    clear: () => void;
    isSelected: (item: T) => boolean;
};
//# sourceMappingURL=hooks.d.ts.map