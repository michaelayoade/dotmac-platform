"use client";

// src/utils/security.ts
import DOMPurify from "dompurify";
import { z } from "zod";
var sanitizeHtml = (content) => {
  if (typeof content !== "string") {
    throw new Error("Content must be a string");
  }
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "span"],
    ALLOWED_ATTR: ["class"],
    FORBID_TAGS: ["script", "object", "embed", "base", "link"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"]
  });
};
var sanitizeText = (text) => {
  if (typeof text !== "string") {
    throw new Error("Text must be a string");
  }
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};
var RICH_TEXT_ALLOWED_TAGS = [
  "a",
  "abbr",
  "b",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "figure",
  "figcaption",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "section",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul"
];
var RICH_TEXT_ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "title",
  "alt",
  "src",
  "width",
  "height",
  "class",
  "style",
  "colspan",
  "rowspan",
  "aria-label",
  "aria-hidden"
];
var SAFE_URI_PATTERN = /^(?:(?:https?|mailto|tel):|(?:data:image\/(?:png|gif|jpeg|webp);)|#)/i;
var sanitizeRichHtml = (content) => {
  if (typeof content !== "string" || content.length === 0) {
    return "";
  }
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: RICH_TEXT_ALLOWED_TAGS,
    ALLOWED_ATTR: RICH_TEXT_ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["script", "iframe", "object", "embed"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
    ALLOWED_URI_REGEXP: SAFE_URI_PATTERN,
    USE_PROFILES: { html: true }
  });
};
var ALLOWED_CLASS_PATTERNS = [
  /^[a-zA-Z0-9\-_\s]+$/,
  // Standard CSS class names
  /^bg-/,
  /^text-/,
  /^border-/,
  /^rounded-/,
  /^p-/,
  /^m-/,
  /^w-/,
  /^h-/,
  // Tailwind patterns
  /^flex/,
  /^grid/,
  /^space-/,
  /^gap-/,
  /^items-/,
  /^justify-/
  // Layout patterns
];
var validateClassName = (className) => {
  if (!className) return "";
  const sanitized = sanitizeText(className);
  const isValid = ALLOWED_CLASS_PATTERNS.some((pattern) => pattern.test(sanitized));
  if (!isValid) {
    console.warn(`Potentially unsafe className detected: ${className}`);
    return "";
  }
  return sanitized;
};
var chartDataSchema = z.object({
  label: z.string().optional(),
  value: z.number().finite(),
  name: z.string().optional(),
  color: z.string().optional()
});
var revenueDataSchema = z.object({
  month: z.string().min(1),
  revenue: z.number().min(0).finite(),
  target: z.number().min(0).finite(),
  previousYear: z.number().min(0).finite()
});
var networkUsageDataSchema = z.object({
  hour: z.string().min(1),
  download: z.number().min(0).finite(),
  upload: z.number().min(0).finite(),
  peak: z.number().min(0).finite()
});
var serviceStatusDataSchema = z.object({
  name: z.string().min(1),
  value: z.number().min(0).finite(),
  status: z.enum(["online", "maintenance", "offline"])
});
var bandwidthDataSchema = z.object({
  time: z.string().min(1),
  utilization: z.number().min(0).max(100),
  capacity: z.number().min(0).max(100)
});
var uptimeSchema = z.number().min(0).max(100);
var networkMetricsSchema = z.object({
  latency: z.number().min(0).finite(),
  packetLoss: z.number().min(0).max(100),
  bandwidth: z.number().min(0).max(100)
});
var serviceTierSchema = z.enum(["basic", "standard", "premium", "enterprise"]);
var alertSeveritySchema = z.enum(["info", "warning", "error", "critical"]);
var validateData = (schema, data) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Data validation failed:", error.issues);
      throw new Error(`Invalid data: ${error.issues.map((e) => e.message).join(", ")}`);
    }
    throw error;
  }
};
var validateArray = (schema, data) => {
  if (!Array.isArray(data)) {
    throw new Error("Expected array data");
  }
  if (data.length === 0) {
    throw new Error("Empty data array");
  }
  return data.map((item, index) => {
    try {
      return schema.parse(item);
    } catch (error) {
      console.error(`Validation failed at index ${index}:`, error);
      throw new Error(`Invalid data at index ${index}`);
    }
  });
};

export {
  sanitizeHtml,
  sanitizeText,
  sanitizeRichHtml,
  validateClassName,
  chartDataSchema,
  revenueDataSchema,
  networkUsageDataSchema,
  serviceStatusDataSchema,
  bandwidthDataSchema,
  uptimeSchema,
  networkMetricsSchema,
  serviceTierSchema,
  alertSeveritySchema,
  validateData,
  validateArray
};
