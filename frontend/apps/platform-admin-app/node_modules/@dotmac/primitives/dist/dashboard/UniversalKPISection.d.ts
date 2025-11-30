/**
 * Universal KPI Section Component
 * Displays key performance indicators in a grid layout with consistent styling
 */
import type { UniversalMetricCardProps } from "./UniversalMetricCard";
export interface KPIItem extends Omit<UniversalMetricCardProps, "size" | "variant"> {
    id: string;
}
export interface UniversalKPISectionProps {
    title?: string;
    subtitle?: string;
    kpis: KPIItem[];
    columns?: 1 | 2 | 3 | 4 | 5 | 6;
    responsiveColumns?: {
        sm?: 1 | 2;
        md?: 2 | 3 | 4;
        lg?: 3 | 4 | 5 | 6;
        xl?: 4 | 5 | 6;
    };
    gap?: "tight" | "normal" | "relaxed";
    cardSize?: "sm" | "md" | "lg";
    cardVariant?: "default" | "compact" | "featured";
    className?: string;
    contentClassName?: string;
    loading?: boolean;
    staggerChildren?: boolean;
    animationDelay?: number;
}
export declare function UniversalKPISection({ title, subtitle, kpis, columns, responsiveColumns, gap, cardSize, cardVariant, className, contentClassName, loading, staggerChildren, animationDelay, }: UniversalKPISectionProps): import("react/jsx-runtime").JSX.Element;
export default UniversalKPISection;
//# sourceMappingURL=UniversalKPISection.d.ts.map