/**
 * CSRF Protection Component
 * Provides CSRF token management and validation
 */
import type { ReactNode } from "react";
interface CSRFContextValue {
    token: string | null;
    generateToken: () => string;
    validateToken: (token: string) => boolean;
    refreshToken: () => void;
}
interface CSRFProviderProps {
    children: ReactNode;
    endpoint?: string;
}
export declare function CSRFProvider({ children, endpoint }: CSRFProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useCSRF(): CSRFContextValue;
interface CSRFTokenProps {
    name?: string;
    hidden?: boolean;
}
export declare function CSRFToken({ name, hidden }: CSRFTokenProps): import("react/jsx-runtime").JSX.Element | null;
export declare function withCSRFProtection<P extends object>(Component: React.ComponentType<P>): (props: P) => import("react/jsx-runtime").JSX.Element;
export declare function useSecureFetch(): {
    secureFetch: (url: string, options?: RequestInit) => Promise<Response>;
    token: string | null;
};
export {};
//# sourceMappingURL=CSRFProtection.d.ts.map