/**
 * Unstyled, composable Layout primitives (Dashboard, Grid, Stack, Container)
 */
import { type VariantProps } from "class-variance-authority";
import type React from "react";
declare const containerVariants: (props?: ({
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "xs" | null | undefined;
    padding?: "none" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const gridVariants: (props?: ({
    cols?: 2 | 1 | 3 | 9 | 4 | 5 | 6 | 7 | 10 | 12 | 8 | 11 | null | undefined;
    gap?: "none" | "sm" | "md" | "lg" | "xl" | "xs" | null | undefined;
    responsive?: boolean | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const stackVariants: (props?: ({
    direction?: "row" | "column" | "column-reverse" | "row-reverse" | null | undefined;
    gap?: "none" | "sm" | "md" | "lg" | "xl" | "xs" | null | undefined;
    align?: "end" | "center" | "baseline" | "start" | "stretch" | null | undefined;
    justify?: "end" | "center" | "start" | "between" | "around" | "evenly" | null | undefined;
    wrap?: "nowrap" | "wrap" | "wrap-reverse" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const dashboardVariants: (props?: ({
    layout?: "sidebar" | "sidebar-right" | "topbar" | "sidebar-topbar" | "fullwidth" | null | undefined;
    sidebarWidth?: "sm" | "md" | "lg" | "xl" | null | undefined;
    responsive?: boolean | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {
    asChild?: boolean;
    fluid?: boolean;
    centerContent?: boolean;
}
export declare const Container: React.ForwardRefExoticComponent<ContainerProps & React.RefAttributes<HTMLDivElement>>;
export interface GridProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof gridVariants> {
    asChild?: boolean;
    autoRows?: string;
    autoCols?: string;
    templateRows?: string;
    templateCols?: string;
}
export declare const Grid: React.ForwardRefExoticComponent<GridProps & React.RefAttributes<HTMLDivElement>>;
export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
    colSpan?: number;
    rowSpan?: number;
    colStart?: number;
    colEnd?: number;
    rowStart?: number;
    rowEnd?: number;
}
export declare const GridItem: React.ForwardRefExoticComponent<GridItemProps & React.RefAttributes<HTMLDivElement>>;
export interface StackProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof stackVariants> {
    asChild?: boolean;
    grow?: boolean;
    shrink?: boolean;
}
export declare const Stack: React.ForwardRefExoticComponent<StackProps & React.RefAttributes<HTMLDivElement>>;
export interface HStackProps extends Omit<StackProps, "direction"> {
}
export declare const HStack: React.ForwardRefExoticComponent<HStackProps & React.RefAttributes<HTMLDivElement>>;
export interface VStackProps extends Omit<StackProps, "direction"> {
}
export declare const VStack: React.ForwardRefExoticComponent<VStackProps & React.RefAttributes<HTMLDivElement>>;
export interface DashboardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dashboardVariants> {
    asChild?: boolean;
    sidebar?: React.ReactNode;
    topbar?: React.ReactNode;
    footer?: React.ReactNode;
}
export declare const Dashboard: React.ForwardRefExoticComponent<DashboardProps & React.RefAttributes<HTMLDivElement>>;
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    asChild?: boolean;
    padding?: "none" | "sm" | "md" | "lg" | "xl";
    margin?: "none" | "sm" | "md" | "lg" | "xl";
}
export declare const Section: React.ForwardRefExoticComponent<SectionProps & React.RefAttributes<HTMLElement>>;
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
    variant?: "default" | "outlined" | "elevated" | "filled";
    padding?: "none" | "sm" | "md" | "lg" | "xl";
    interactive?: boolean;
}
export declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>;
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const CardHeader: React.ForwardRefExoticComponent<CardHeaderProps & React.RefAttributes<HTMLDivElement>>;
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const CardContent: React.ForwardRefExoticComponent<CardContentProps & React.RefAttributes<HTMLDivElement>>;
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const CardFooter: React.ForwardRefExoticComponent<CardFooterProps & React.RefAttributes<HTMLDivElement>>;
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
    orientation?: "horizontal" | "vertical";
    decorative?: boolean;
    label?: string;
}
export declare const Divider: React.ForwardRefExoticComponent<DividerProps & React.RefAttributes<HTMLDivElement>>;
export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    axis?: "horizontal" | "vertical" | "both";
}
export declare const Spacer: React.ForwardRefExoticComponent<SpacerProps & React.RefAttributes<HTMLDivElement>>;
export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
    axis?: "horizontal" | "vertical" | "both";
}
export declare const Center: React.ForwardRefExoticComponent<CenterProps & React.RefAttributes<HTMLDivElement>>;
declare const layoutVariants: (props?: ({
    variant?: "default" | "sidebar-right" | "sidebar-left" | "sidebar-both" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const layoutHeaderVariants: (props?: ({
    height?: "default" | "compact" | "tall" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const layoutContentVariants: (props?: ({
    padding?: "small" | "none" | "large" | "medium" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const layoutSidebarVariants: (props?: ({
    position?: "left" | "right" | null | undefined;
    width?: "default" | "narrow" | "wide" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof layoutVariants> {
    asChild?: boolean;
    responsive?: boolean;
}
export declare const Layout: React.ForwardRefExoticComponent<LayoutProps & React.RefAttributes<HTMLDivElement>>;
export interface LayoutHeaderProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof layoutHeaderVariants> {
    asChild?: boolean;
    sticky?: boolean;
}
export declare const LayoutHeader: React.ForwardRefExoticComponent<LayoutHeaderProps & React.RefAttributes<HTMLElement>>;
export interface LayoutContentProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof layoutContentVariants> {
    asChild?: boolean;
    scrollable?: boolean;
}
export declare const LayoutContent: React.ForwardRefExoticComponent<LayoutContentProps & React.RefAttributes<HTMLElement>>;
export interface LayoutSidebarProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof layoutSidebarVariants> {
    asChild?: boolean;
    collapsible?: boolean;
    collapsed?: boolean;
}
export declare const LayoutSidebar: React.ForwardRefExoticComponent<LayoutSidebarProps & React.RefAttributes<HTMLElement>>;
export interface LayoutFooterProps extends React.HTMLAttributes<HTMLElement> {
    asChild?: boolean;
    sticky?: boolean;
}
export declare const LayoutFooter: React.ForwardRefExoticComponent<LayoutFooterProps & React.RefAttributes<HTMLElement>>;
export {};
//# sourceMappingURL=Layout.d.ts.map