import { type VariantProps } from "class-variance-authority";
import React from "react";
declare const navigationVariants: (props?: ({
    variant?: "default" | "minimal" | "filled" | "bordered" | null | undefined;
    orientation?: "horizontal" | "vertical" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const sidebarVariants: (props?: ({
    variant?: "default" | "bordered" | "floating" | null | undefined;
    size?: "sm" | "md" | "lg" | "xl" | null | undefined;
    position?: "left" | "right" | null | undefined;
    behavior?: "push" | "overlay" | "squeeze" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
interface NavigationContextValue {
    activeItem?: string;
    onNavigate?: (key: string, href?: string) => void;
    collapsed?: boolean;
}
declare const useNavigation: () => NavigationContextValue;
export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
    asChild?: boolean;
    variant?: "default" | "bordered" | "filled" | "minimal";
    orientation?: "horizontal" | "vertical";
    size?: "sm" | "md" | "lg";
}
export declare const Navigation: React.ForwardRefExoticComponent<NavigationProps & React.RefAttributes<HTMLElement>>;
export interface NavigationProviderProps {
    children: React.ReactNode;
    activeItem?: string;
    onNavigate?: (key: string, href?: string) => void;
    collapsed?: boolean;
}
export declare function NavigationProvider({ children, activeItem, onNavigate, collapsed, }: NavigationProviderProps): import("react/jsx-runtime").JSX.Element;
export interface NavbarProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof navigationVariants> {
    asChild?: boolean;
    brand?: React.ReactNode;
    actions?: React.ReactNode;
}
export declare const Navbar: React.ForwardRefExoticComponent<NavbarProps & React.RefAttributes<HTMLElement>>;
export interface NavigationMenuProps extends React.HTMLAttributes<HTMLUListElement> {
    asChild?: boolean;
    orientation?: "horizontal" | "vertical";
}
export declare const NavigationMenu: React.ForwardRefExoticComponent<NavigationMenuProps & React.RefAttributes<HTMLUListElement>>;
export interface NavigationItemProps extends React.HTMLAttributes<HTMLLIElement> {
    asChild?: boolean;
    active?: boolean;
    disabled?: boolean;
    href?: string;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    itemKey?: string;
}
export declare const NavigationItem: React.ForwardRefExoticComponent<NavigationItemProps & React.RefAttributes<HTMLLIElement>>;
export interface NavigationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    asChild?: boolean;
    active?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    itemKey?: string;
}
export declare const NavigationLink: React.ForwardRefExoticComponent<NavigationLinkProps & React.RefAttributes<HTMLAnchorElement>>;
export interface SidebarProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof sidebarVariants> {
    asChild?: boolean;
    collapsed?: boolean;
    collapsible?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}
export declare const Sidebar: React.ForwardRefExoticComponent<SidebarProps & React.RefAttributes<HTMLElement>>;
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
    asChild?: boolean;
    separator?: React.ReactNode;
    maxItems?: number;
    itemsBeforeCollapse?: number;
    itemsAfterCollapse?: number;
}
export declare const Breadcrumb: React.ForwardRefExoticComponent<BreadcrumbProps & React.RefAttributes<HTMLElement>>;
export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
    asChild?: boolean;
    current?: boolean;
}
export declare const BreadcrumbItem: React.ForwardRefExoticComponent<BreadcrumbItemProps & React.RefAttributes<HTMLLIElement>>;
export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    asChild?: boolean;
}
export declare const BreadcrumbLink: React.ForwardRefExoticComponent<BreadcrumbLinkProps & React.RefAttributes<HTMLAnchorElement>>;
export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {
    asChild?: boolean;
}
export declare const BreadcrumbPage: React.ForwardRefExoticComponent<BreadcrumbPageProps & React.RefAttributes<HTMLSpanElement>>;
export interface BreadcrumbEllipsisProps extends React.HTMLAttributes<HTMLSpanElement> {
    asChild?: boolean;
}
export declare const BreadcrumbEllipsis: React.ForwardRefExoticComponent<BreadcrumbEllipsisProps & React.RefAttributes<HTMLSpanElement>>;
export interface TabNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
    variant?: "default" | "pills" | "underline" | "cards";
    size?: "sm" | "md" | "lg";
    value?: string;
    onValueChange?: (value: string) => void;
}
export declare const TabNavigation: React.ForwardRefExoticComponent<TabNavigationProps & React.RefAttributes<HTMLDivElement>>;
export interface TabItemProps extends React.HTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    value: string;
    disabled?: boolean;
}
export declare const TabItem: React.ForwardRefExoticComponent<TabItemProps & React.RefAttributes<HTMLButtonElement>>;
export { useNavigation };
//# sourceMappingURL=Navigation.d.ts.map