/**
 * Security utilities for input sanitization and validation
 */
import { z } from "zod";
export declare const sanitizeHtml: (content: string) => string;
export declare const sanitizeText: (text: string) => string;
/**
 * Sanitize rich HTML content (emails, receipts, etc.) while preserving
 * layout-friendly tags and attributes.
 */
export declare const sanitizeRichHtml: (content: string | null | undefined) => string;
export declare const validateClassName: (className?: string) => string;
export declare const chartDataSchema: z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    value: z.ZodNumber;
    name: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const revenueDataSchema: z.ZodObject<{
    month: z.ZodString;
    revenue: z.ZodNumber;
    target: z.ZodNumber;
    previousYear: z.ZodNumber;
}, z.core.$strip>;
export declare const networkUsageDataSchema: z.ZodObject<{
    hour: z.ZodString;
    download: z.ZodNumber;
    upload: z.ZodNumber;
    peak: z.ZodNumber;
}, z.core.$strip>;
export declare const serviceStatusDataSchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodNumber;
    status: z.ZodEnum<{
        offline: "offline";
        online: "online";
        maintenance: "maintenance";
    }>;
}, z.core.$strip>;
export declare const bandwidthDataSchema: z.ZodObject<{
    time: z.ZodString;
    utilization: z.ZodNumber;
    capacity: z.ZodNumber;
}, z.core.$strip>;
export declare const uptimeSchema: z.ZodNumber;
export declare const networkMetricsSchema: z.ZodObject<{
    latency: z.ZodNumber;
    packetLoss: z.ZodNumber;
    bandwidth: z.ZodNumber;
}, z.core.$strip>;
export declare const serviceTierSchema: z.ZodEnum<{
    standard: "standard";
    enterprise: "enterprise";
    basic: "basic";
    premium: "premium";
}>;
export declare const alertSeveritySchema: z.ZodEnum<{
    error: "error";
    warning: "warning";
    critical: "critical";
    info: "info";
}>;
export declare const validateData: <T>(schema: z.ZodSchema<T>, data: unknown) => T;
export declare const validateArray: <T>(schema: z.ZodSchema<T>, data: unknown[]) => T[];
//# sourceMappingURL=security.d.ts.map