/**
 * Optimized Image Component
 *
 * A composition-based approach to handle both Next.js Image optimization
 * and fallback for non-Next.js environments.
 */
import * as React from "react";
export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /**
     * Image source URL
     */
    src: string;
    /**
     * Alt text for accessibility
     */
    alt: string;
    /**
     * Width for optimization
     */
    width?: number;
    /**
     * Height for optimization
     */
    height?: number;
    /**
     * Priority loading for above-the-fold images
     */
    priority?: boolean;
    /**
     * Quality setting (1-100)
     */
    quality?: number;
    /**
     * Placeholder strategy
     */
    placeholder?: "blur" | "empty";
    /**
     * Blur data URL for placeholder
     */
    blurDataURL?: string;
}
/**
 * Smart image component that uses Next.js Image when available,
 * falls back to regular img tag with optimization hints
 */
export declare const OptimizedImage: React.ForwardRefExoticComponent<OptimizedImageProps & React.RefAttributes<HTMLImageElement>>;
//# sourceMappingURL=OptimizedImage.d.ts.map