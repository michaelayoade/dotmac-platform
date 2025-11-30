import type { ComponentType } from "react";
interface NavItem {
    id: string;
    label: string;
    href: string;
    icon?: ComponentType<{
        className?: string;
    }>;
    badge?: string;
    children?: NavItem[];
}
interface MobileNavigationProps {
    items: NavItem[];
    currentPath: string;
    onNavigate?: (href: string) => void;
    className?: string;
    variant?: "drawer" | "tabs" | "accordion";
    showOverlay?: boolean;
}
export { TabsNavigation as EnhancedTabNavigation };
declare function TabsNavigation({ items, currentPath, onNavigate, className, }: Omit<MobileNavigationProps, "variant" | "showOverlay">): import("react/jsx-runtime").JSX.Element;
export declare function MobileNavigation({ items, currentPath, onNavigate, className, variant, showOverlay, }: MobileNavigationProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MobileNavigation.d.ts.map