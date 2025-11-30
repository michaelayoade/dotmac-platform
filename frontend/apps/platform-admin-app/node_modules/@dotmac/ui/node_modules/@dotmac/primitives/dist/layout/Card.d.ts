/**
 * Card Primitive Component
 *
 * Enhanced card component with comprehensive TypeScript support,
 * accessibility features, and flexible composition patterns
 */
import { type VariantProps } from "class-variance-authority";
declare const cardVariants: (props?: ({
    variant?: "default" | "filled" | "outline" | "ghost" | "elevated" | null | undefined;
    padding?: "none" | "default" | "sm" | "lg" | null | undefined;
    interactive?: boolean | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const cardHeaderVariants: (props?: ({
    padding?: "none" | "default" | "sm" | "lg" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const cardTitleVariants: (props?: import("class-variance-authority/dist/types").ClassProp | undefined) => string;
declare const cardDescriptionVariants: (props?: import("class-variance-authority/dist/types").ClassProp | undefined) => string;
declare const cardContentVariants: (props?: ({
    padding?: "none" | "default" | "sm" | "lg" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const cardFooterVariants: (props?: ({
    padding?: "none" | "default" | "sm" | "lg" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
    asChild?: boolean;
    /** Whether the card is in a loading state */
    isLoading?: boolean;
    /** Loading component to show */
    loadingComponent?: React.ReactNode;
    /** Whether to show loading overlay */
    showLoadingOverlay?: boolean;
}
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardHeaderVariants> {
    asChild?: boolean;
}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof cardTitleVariants> {
    /** Heading level for accessibility */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    asChild?: boolean;
}
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof cardDescriptionVariants> {
    asChild?: boolean;
}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardContentVariants> {
    asChild?: boolean;
}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardFooterVariants> {
    asChild?: boolean;
}
export declare const Card: import("react").ForwardRefExoticComponent<CardProps & import("react").RefAttributes<HTMLDivElement>>;
export declare const CardHeader: import("react").ForwardRefExoticComponent<CardHeaderProps & import("react").RefAttributes<HTMLDivElement>>;
export declare const CardTitle: import("react").ForwardRefExoticComponent<CardTitleProps & import("react").RefAttributes<HTMLHeadingElement>>;
export declare const CardDescription: import("react").ForwardRefExoticComponent<CardDescriptionProps & import("react").RefAttributes<HTMLParagraphElement>>;
export declare const CardContent: import("react").ForwardRefExoticComponent<CardContentProps & import("react").RefAttributes<HTMLDivElement>>;
export declare const CardFooter: import("react").ForwardRefExoticComponent<CardFooterProps & import("react").RefAttributes<HTMLDivElement>>;
export { cardVariants, cardHeaderVariants, cardTitleVariants, cardDescriptionVariants, cardContentVariants, cardFooterVariants, };
//# sourceMappingURL=Card.d.ts.map