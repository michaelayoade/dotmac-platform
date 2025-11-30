import type { ComponentType, ReactNode } from "react";
interface SidebarItem {
    id: string;
    label: string;
    href: string;
    icon: ComponentType<{
        className?: string;
    }>;
    badge?: string;
    children?: SidebarItem[];
}
interface ResponsiveSidebarProps {
    items: SidebarItem[];
    currentPath: string;
    onNavigate?: (href: string) => void;
    className?: string;
    title?: string;
    footer?: ReactNode;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
}
export declare function ResponsiveSidebar({ items, currentPath, onNavigate, className, title, footer, collapsible, defaultCollapsed, }: ResponsiveSidebarProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ResponsiveSidebar.d.ts.map