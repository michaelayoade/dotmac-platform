/**
 * Accessibility utilities for keyboard navigation and ARIA support
 */
import React from "react";
/**
 * ARIA live region priorities
 */
export type AriaLive = "off" | "polite" | "assertive";
/**
 * Common keyboard key codes
 */
export declare const KEYS: {
    readonly ENTER: "Enter";
    readonly SPACE: " ";
    readonly ESCAPE: "Escape";
    readonly ARROW_UP: "ArrowUp";
    readonly ARROW_DOWN: "ArrowDown";
    readonly ARROW_LEFT: "ArrowLeft";
    readonly ARROW_RIGHT: "ArrowRight";
    readonly HOME: "Home";
    readonly END: "End";
    readonly PAGE_UP: "PageUp";
    readonly PAGE_DOWN: "PageDown";
    readonly TAB: "Tab";
};
/**
 * Hook for managing keyboard navigation in lists/menus
 * @param items - Array of items to navigate through
 * @param options - Configuration options
 * @returns Navigation state and handlers
 */
export declare function useKeyboardNavigation<T>(items: T[], options?: {
    loop?: boolean;
    orientation?: "horizontal" | "vertical";
    onSelect?: (item: T, index: number) => void;
    initialIndex?: number;
}): {
    focusedIndex: number;
    setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
    handleKeyDown: (event: React.KeyboardEvent) => void;
    navigate: (direction: "next" | "previous" | "first" | "last") => void;
};
export declare function useFocusTrap<TElement extends HTMLElement = HTMLElement>(isActive: boolean): React.RefObject<TElement>;
/**
 * Hook for announcing content to screen readers
 * @param message - Message to announce
 * @param priority - ARIA live priority
 */
export declare function useScreenReaderAnnouncement(): {
    announce: (message: string, livePriority?: AriaLive) => void;
    announcement: string;
    liveRegionProps: {
        "aria-live": AriaLive;
        "aria-atomic": boolean;
        style: {
            position: "absolute";
            left: string;
            width: string;
            height: string;
            overflow: string;
        };
    };
};
/**
 * Hook for managing ARIA expanded state (for collapsible content)
 * @param initialExpanded - Initial expanded state
 * @returns [expanded, toggle, setExpanded] tuple and ARIA props
 */
export declare function useAriaExpanded(initialExpanded?: boolean): {
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    toggle: () => void;
    triggerProps: {
        "aria-expanded": boolean;
        "aria-controls": string;
        id: string;
    };
    contentProps: {
        "aria-labelledby": string;
        id: string;
        hidden: boolean;
    };
};
/**
 * Hook for managing ARIA selected state (for selectable items)
 * @param options - Configuration options
 * @returns Selection state and handlers
 */
export declare function useAriaSelection<T>(options?: {
    items: T[];
    multiple?: boolean;
    onSelectionChange?: (selected: T[]) => void;
}): {
    selectedItems: T[];
    toggleSelection: (item: T) => void;
    isSelected: (item: T) => boolean;
    clearSelection: () => void;
};
/**
 * Generate unique IDs for accessibility relationships
 * @param prefix - Optional prefix for the ID
 * @returns Unique ID string
 */
export declare function useId(prefix?: string): string;
/**
 * Hook for detecting if user prefers reduced motion
 * @returns boolean indicating reduced motion preference
 */
export declare function usePrefersReducedMotion(): boolean;
/**
 * Common ARIA role types
 */
export declare const ARIA_ROLES: {
    readonly BUTTON: "button";
    readonly MENU: "menu";
    readonly MENUITEM: "menuitem";
    readonly MENUBAR: "menubar";
    readonly TAB: "tab";
    readonly TABLIST: "tablist";
    readonly TABPANEL: "tabpanel";
    readonly DIALOG: "dialog";
    readonly ALERTDIALOG: "alertdialog";
    readonly TOOLTIP: "tooltip";
    readonly COMBOBOX: "combobox";
    readonly LISTBOX: "listbox";
    readonly OPTION: "option";
    readonly GRID: "grid";
    readonly GRIDCELL: "gridcell";
    readonly COLUMNHEADER: "columnheader";
    readonly ROWHEADER: "rowheader";
    readonly REGION: "region";
    readonly BANNER: "banner";
    readonly MAIN: "main";
    readonly NAVIGATION: "navigation";
    readonly COMPLEMENTARY: "complementary";
    readonly CONTENTINFO: "contentinfo";
    readonly SEARCH: "search";
    readonly FORM: "form";
    readonly ARTICLE: "article";
    readonly SECTION: "section";
    readonly LIST: "list";
    readonly LISTITEM: "listitem";
    readonly SEPARATOR: "separator";
    readonly IMG: "img";
    readonly PRESENTATION: "presentation";
    readonly NONE: "none";
};
//# sourceMappingURL=accessibility.d.ts.map