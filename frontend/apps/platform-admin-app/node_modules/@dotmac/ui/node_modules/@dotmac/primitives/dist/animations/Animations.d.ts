/**
 * Micro-interactions and Animations for ISP Management Platform
 * Subtle animations that enhance user experience
 */
interface AnimatedCounterProps {
    value: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}
export declare const AnimatedCounter: React.FC<AnimatedCounterProps>;
interface FadeInWhenVisibleProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}
export declare const FadeInWhenVisible: React.FC<FadeInWhenVisibleProps>;
interface StaggeredFadeInProps {
    children: React.ReactNode;
    className?: string;
}
export declare const StaggeredFadeIn: React.FC<StaggeredFadeInProps>;
interface StaggerChildProps {
    children: React.ReactNode;
    className?: string;
}
export declare const StaggerChild: React.FC<StaggerChildProps>;
interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}
export declare const AnimatedCard: React.FC<AnimatedCardProps>;
interface SlideInProps {
    children: React.ReactNode;
    direction: "left" | "right" | "up" | "down";
    delay?: number;
    className?: string;
}
export declare const SlideIn: React.FC<SlideInProps>;
interface AnimatedProgressBarProps {
    progress: number;
    height?: string;
    color?: string;
    backgroundColor?: string;
    className?: string;
    showLabel?: boolean;
    label?: string;
}
export declare const AnimatedProgressBar: React.FC<AnimatedProgressBarProps>;
interface LoadingDotsProps {
    className?: string;
    color?: string;
}
export declare const LoadingDots: React.FC<LoadingDotsProps>;
interface PulseIndicatorProps {
    children: React.ReactNode;
    active?: boolean;
    className?: string;
}
export declare const PulseIndicator: React.FC<PulseIndicatorProps>;
interface BounceInProps {
    children: React.ReactNode;
    className?: string;
}
export declare const BounceIn: React.FC<BounceInProps>;
interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}
export declare const PageTransition: React.FC<PageTransitionProps>;
interface TypingAnimationProps {
    text: string;
    delay?: number;
    className?: string;
}
export declare const TypingAnimation: React.FC<TypingAnimationProps>;
export {};
//# sourceMappingURL=Animations.d.ts.map