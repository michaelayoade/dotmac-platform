/**
 * Utility functions for primitives
 */
import * as React from "react";
export * from "./accessibility";
export * from "./ssr";
export * from "./validation";
export declare const isBrowser: boolean;
export declare const isServer: boolean;
export declare function useIsHydrated(): boolean;
export declare function useClientEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
export declare function useLocalStorage<T>(key: string, initialValue: T): readonly [T, (value: T | ((val: T) => T)) => void];
export declare function useSessionStorage<T>(key: string, initialValue: T): readonly [T, (value: T | ((val: T) => T)) => void];
export declare function useMediaQuery(query: string): boolean;
export declare function usePrefersReducedMotion(): boolean;
export declare function useUserPreferences(): {
    theme: string;
    setTheme: (value: string | ((val: string) => string)) => void;
    language: string;
    setLanguage: (value: string | ((val: string) => string)) => void;
    prefersReducedMotion: boolean;
};
export declare function useKeyboardNavigation(): {
    focusedIndex: number;
    handleKeyDown: (event: KeyboardEvent, items: HTMLElement[]) => void;
    setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
};
export declare function useFocusTrap(isActive?: boolean): React.RefObject<HTMLElement>;
export declare function useScreenReaderAnnouncement(): {
    announcement: string;
    announce: (message: string, _priority?: "polite" | "assertive") => void;
};
export declare function useAriaExpanded(): {
    isExpanded: boolean;
    "aria-expanded": boolean;
    toggle: () => void;
    collapse: () => void;
    expand: () => void;
};
export declare function useAriaSelection(): {
    selectedItems: Set<string>;
    select: (id: string) => void;
    deselect: (id: string) => void;
    toggle: (id: string) => void;
    clear: () => void;
    isSelected: (id: string) => boolean;
};
export declare const useId: typeof React.useId;
export declare const KEYS: {
    readonly ENTER: "Enter";
    readonly SPACE: " ";
    readonly TAB: "Tab";
    readonly ESCAPE: "Escape";
    readonly ARROW_UP: "ArrowUp";
    readonly ARROW_DOWN: "ArrowDown";
    readonly ARROW_LEFT: "ArrowLeft";
    readonly ARROW_RIGHT: "ArrowRight";
    readonly HOME: "Home";
    readonly END: "End";
    readonly PAGE_UP: "PageUp";
    readonly PAGE_DOWN: "PageDown";
};
export declare const ARIA_ROLES: {
    readonly BUTTON: "button";
    readonly LINK: "link";
    readonly MENUITEM: "menuitem";
    readonly OPTION: "option";
    readonly TAB: "tab";
    readonly TABPANEL: "tabpanel";
    readonly DIALOG: "dialog";
    readonly ALERTDIALOG: "alertdialog";
    readonly TOOLTIP: "tooltip";
    readonly COMBOBOX: "combobox";
    readonly LISTBOX: "listbox";
    readonly TREE: "tree";
    readonly TREEITEM: "treeitem";
    readonly GRID: "grid";
    readonly GRIDCELL: "gridcell";
    readonly TABLE: "table";
    readonly ROW: "row";
    readonly COLUMNHEADER: "columnheader";
    readonly ROWHEADER: "rowheader";
};
//# sourceMappingURL=index.d.ts.map