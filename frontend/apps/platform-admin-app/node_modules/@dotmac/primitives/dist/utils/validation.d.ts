/**
 * Validation patterns and utilities
 */
export declare const validationPatterns: {
    readonly email: RegExp;
    readonly phone: RegExp;
    readonly url: RegExp;
    readonly ipv4: RegExp;
    readonly ipv6: RegExp;
    readonly mac: RegExp;
    readonly creditCard: RegExp;
    readonly ssn: RegExp;
    readonly zipCode: RegExp;
    readonly uuid: RegExp;
};
export declare const validate: {
    readonly required: (value: any) => boolean;
    readonly minLength: (value: string, length: number) => boolean;
    readonly maxLength: (value: string, length: number) => boolean;
    readonly min: (value: number, min: number) => boolean;
    readonly max: (value: number, max: number) => boolean;
    readonly pattern: (value: string, pattern: RegExp) => boolean;
    readonly email: (value: string) => boolean;
    readonly phone: (value: string) => boolean;
    readonly url: (value: string) => boolean;
    readonly oneOf: (value: any, options: any[]) => boolean;
    readonly custom: (value: any, validator: (value: any) => boolean) => boolean;
};
export declare function createValidationRules(): {
    required: (message?: string) => {
        validate: (value: any) => boolean;
        message: string;
    };
    minLength: (length: number, message?: string) => {
        validate: (value: string) => boolean;
        message: string;
    };
    maxLength: (length: number, message?: string) => {
        validate: (value: string) => boolean;
        message: string;
    };
    pattern: (pattern: RegExp, message?: string) => {
        validate: (value: string) => boolean;
        message: string;
    };
    email: (message?: string) => {
        validate: (value: string) => boolean;
        message: string;
    };
    phone: (message?: string) => {
        validate: (value: string) => boolean;
        message: string;
    };
    url: (message?: string) => {
        validate: (value: string) => boolean;
        message: string;
    };
};
export type ValidationRule = ReturnType<ReturnType<typeof createValidationRules>[keyof ReturnType<typeof createValidationRules>]>;
//# sourceMappingURL=validation.d.ts.map