interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    variant?: "text" | "circular" | "rectangular";
    animation?: "pulse" | "wave" | "none";
}
export declare function Skeleton({ className, width, height, variant, animation, }: SkeletonProps): import("react/jsx-runtime").JSX.Element;
export declare function SkeletonText({ lines }: {
    lines?: number;
}): import("react/jsx-runtime").JSX.Element;
export declare function SkeletonCard(): import("react/jsx-runtime").JSX.Element;
export declare function SkeletonTable({ rows, columns }: {
    rows?: number;
    columns?: number;
}): import("react/jsx-runtime").JSX.Element;
export declare function SkeletonDashboard(): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Skeleton.d.ts.map