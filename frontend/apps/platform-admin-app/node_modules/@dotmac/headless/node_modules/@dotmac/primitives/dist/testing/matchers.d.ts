export declare const detectSecurityViolations: (root: Element) => string[];
export declare const ensureTestingMatchers: () => void;
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeAccessible(): R;
            toHaveNoSecurityViolations(): R;
            toBePerformant(threshold?: number): R;
            toHaveValidMarkup(): R;
            toHaveNoViolations(): R;
        }
    }
}
//# sourceMappingURL=matchers.d.ts.map