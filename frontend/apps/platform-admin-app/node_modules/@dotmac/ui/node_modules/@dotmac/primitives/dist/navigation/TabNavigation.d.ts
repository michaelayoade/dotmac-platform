/**
 * Tab Navigation Component
 */
import React from "react";
export interface TabNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "pills" | "bordered";
}
export declare const TabNavigation: React.ForwardRefExoticComponent<TabNavigationProps & React.RefAttributes<HTMLDivElement>>;
export interface TabItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    variant?: "default" | "pills" | "bordered";
}
export declare const TabItem: React.ForwardRefExoticComponent<TabItemProps & React.RefAttributes<HTMLButtonElement>>;
export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    active?: boolean;
}
export declare const TabPanel: React.ForwardRefExoticComponent<TabPanelProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=TabNavigation.d.ts.map