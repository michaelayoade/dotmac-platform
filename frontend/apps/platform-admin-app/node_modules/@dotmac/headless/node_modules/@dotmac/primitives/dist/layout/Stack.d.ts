/**
 * Stack Layout Components
 */
import React from "react";
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: "horizontal" | "vertical";
    spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    wrap?: boolean;
}
export declare const Stack: React.ForwardRefExoticComponent<StackProps & React.RefAttributes<HTMLDivElement>>;
export declare const HStack: React.ForwardRefExoticComponent<Omit<StackProps, "direction"> & React.RefAttributes<HTMLDivElement>>;
export declare const VStack: React.ForwardRefExoticComponent<Omit<StackProps, "direction"> & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Stack.d.ts.map