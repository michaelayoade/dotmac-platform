"use client";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/cn.ts
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx4.clsx)(inputs));
}
var import_clsx4, import_tailwind_merge;
var init_cn = __esm({
  "src/utils/cn.ts"() {
    "use strict";
    import_clsx4 = require("clsx");
    import_tailwind_merge = require("tailwind-merge");
  }
});

// src/utils/security.ts
var security_exports = {};
__export(security_exports, {
  alertSeveritySchema: () => alertSeveritySchema,
  bandwidthDataSchema: () => bandwidthDataSchema,
  chartDataSchema: () => chartDataSchema,
  networkMetricsSchema: () => networkMetricsSchema,
  networkUsageDataSchema: () => networkUsageDataSchema,
  revenueDataSchema: () => revenueDataSchema,
  sanitizeHtml: () => sanitizeHtml,
  sanitizeRichHtml: () => sanitizeRichHtml,
  sanitizeText: () => sanitizeText,
  serviceStatusDataSchema: () => serviceStatusDataSchema,
  serviceTierSchema: () => serviceTierSchema,
  uptimeSchema: () => uptimeSchema,
  validateArray: () => validateArray,
  validateClassName: () => validateClassName,
  validateData: () => validateData
});
var import_dompurify, import_zod, sanitizeHtml, sanitizeText, RICH_TEXT_ALLOWED_TAGS, RICH_TEXT_ALLOWED_ATTR, SAFE_URI_PATTERN, sanitizeRichHtml, ALLOWED_CLASS_PATTERNS, validateClassName, chartDataSchema, revenueDataSchema, networkUsageDataSchema, serviceStatusDataSchema, bandwidthDataSchema, uptimeSchema, networkMetricsSchema, serviceTierSchema, alertSeveritySchema, validateData, validateArray;
var init_security = __esm({
  "src/utils/security.ts"() {
    "use strict";
    import_dompurify = __toESM(require("dompurify"));
    import_zod = require("zod");
    sanitizeHtml = (content) => {
      if (typeof content !== "string") {
        throw new Error("Content must be a string");
      }
      return import_dompurify.default.sanitize(content, {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "span"],
        ALLOWED_ATTR: ["class"],
        FORBID_TAGS: ["script", "object", "embed", "base", "link"],
        FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"]
      });
    };
    sanitizeText = (text) => {
      if (typeof text !== "string") {
        throw new Error("Text must be a string");
      }
      return import_dompurify.default.sanitize(text, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true
      });
    };
    RICH_TEXT_ALLOWED_TAGS = [
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
    RICH_TEXT_ALLOWED_ATTR = [
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
    SAFE_URI_PATTERN = /^(?:(?:https?|mailto|tel):|(?:data:image\/(?:png|gif|jpeg|webp);)|#)/i;
    sanitizeRichHtml = (content) => {
      if (typeof content !== "string" || content.length === 0) {
        return "";
      }
      return import_dompurify.default.sanitize(content, {
        ALLOWED_TAGS: RICH_TEXT_ALLOWED_TAGS,
        ALLOWED_ATTR: RICH_TEXT_ALLOWED_ATTR,
        ALLOW_DATA_ATTR: false,
        FORBID_TAGS: ["script", "iframe", "object", "embed"],
        FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
        ALLOWED_URI_REGEXP: SAFE_URI_PATTERN,
        USE_PROFILES: { html: true }
      });
    };
    ALLOWED_CLASS_PATTERNS = [
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
    validateClassName = (className) => {
      if (!className) return "";
      const sanitized = sanitizeText(className);
      const isValid = ALLOWED_CLASS_PATTERNS.some((pattern) => pattern.test(sanitized));
      if (!isValid) {
        console.warn(`Potentially unsafe className detected: ${className}`);
        return "";
      }
      return sanitized;
    };
    chartDataSchema = import_zod.z.object({
      label: import_zod.z.string().optional(),
      value: import_zod.z.number().finite(),
      name: import_zod.z.string().optional(),
      color: import_zod.z.string().optional()
    });
    revenueDataSchema = import_zod.z.object({
      month: import_zod.z.string().min(1),
      revenue: import_zod.z.number().min(0).finite(),
      target: import_zod.z.number().min(0).finite(),
      previousYear: import_zod.z.number().min(0).finite()
    });
    networkUsageDataSchema = import_zod.z.object({
      hour: import_zod.z.string().min(1),
      download: import_zod.z.number().min(0).finite(),
      upload: import_zod.z.number().min(0).finite(),
      peak: import_zod.z.number().min(0).finite()
    });
    serviceStatusDataSchema = import_zod.z.object({
      name: import_zod.z.string().min(1),
      value: import_zod.z.number().min(0).finite(),
      status: import_zod.z.enum(["online", "maintenance", "offline"])
    });
    bandwidthDataSchema = import_zod.z.object({
      time: import_zod.z.string().min(1),
      utilization: import_zod.z.number().min(0).max(100),
      capacity: import_zod.z.number().min(0).max(100)
    });
    uptimeSchema = import_zod.z.number().min(0).max(100);
    networkMetricsSchema = import_zod.z.object({
      latency: import_zod.z.number().min(0).finite(),
      packetLoss: import_zod.z.number().min(0).max(100),
      bandwidth: import_zod.z.number().min(0).max(100)
    });
    serviceTierSchema = import_zod.z.enum(["basic", "standard", "premium", "enterprise"]);
    alertSeveritySchema = import_zod.z.enum(["info", "warning", "error", "critical"]);
    validateData = (schema, data) => {
      try {
        return schema.parse(data);
      } catch (error) {
        if (error instanceof import_zod.z.ZodError) {
          console.error("Data validation failed:", error.issues);
          throw new Error(`Invalid data: ${error.issues.map((e) => e.message).join(", ")}`);
        }
        throw error;
      }
    };
    validateArray = (schema, data) => {
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
  }
});

// src/utils/a11y.ts
var a11y_exports = {};
__export(a11y_exports, {
  ARIA_LIVE_LEVELS: () => ARIA_LIVE_LEVELS,
  ARIA_PROPERTIES: () => ARIA_PROPERTIES,
  ARIA_ROLES: () => ARIA_ROLES,
  COLOR_CONTRAST: () => COLOR_CONTRAST,
  announceToScreenReader: () => announceToScreenReader,
  generateChartDescription: () => generateChartDescription,
  generateDataTable: () => generateDataTable,
  generateId: () => generateId,
  generateStatusText: () => generateStatusText,
  useFocusManagement: () => useFocusManagement,
  useKeyboardNavigation: () => useKeyboardNavigation,
  useReducedMotion: () => useReducedMotion,
  useScreenReader: () => useScreenReader
});
var import_react11, ARIA_ROLES, ARIA_PROPERTIES, ARIA_LIVE_LEVELS, announceToScreenReader, generateChartDescription, generateDataTable, useKeyboardNavigation, useFocusManagement, COLOR_CONTRAST, generateStatusText, useReducedMotion, useScreenReader, idCounter, generateId;
var init_a11y = __esm({
  "src/utils/a11y.ts"() {
    "use strict";
    import_react11 = require("react");
    ARIA_ROLES = {
      // Chart components
      CHART: "img",
      CHART_CONTAINER: "figure",
      CHART_TITLE: "heading",
      CHART_DESCRIPTION: "text",
      CHART_DATA_TABLE: "table",
      // Status components
      STATUS_INDICATOR: "status",
      ALERT: "alert",
      PROGRESS: "progressbar",
      METRIC: "meter",
      // Interactive elements
      BUTTON: "button",
      LINK: "link",
      TOOLTIP: "tooltip",
      DIALOG: "dialog",
      // Navigation
      NAV: "navigation",
      MENU: "menu",
      MENUITEM: "menuitem",
      TAB: "tab",
      TABPANEL: "tabpanel"
    };
    ARIA_PROPERTIES = {
      // Visibility states
      HIDDEN: "aria-hidden",
      EXPANDED: "aria-expanded",
      PRESSED: "aria-pressed",
      SELECTED: "aria-selected",
      // Labeling
      LABEL: "aria-label",
      LABELLEDBY: "aria-labelledby",
      DESCRIBEDBY: "aria-describedby",
      // Live regions
      LIVE: "aria-live",
      ATOMIC: "aria-atomic",
      BUSY: "aria-busy",
      // Values and ranges
      VALUENOW: "aria-valuenow",
      VALUEMIN: "aria-valuemin",
      VALUEMAX: "aria-valuemax",
      VALUETEXT: "aria-valuetext"
    };
    ARIA_LIVE_LEVELS = {
      OFF: "off",
      POLITE: "polite",
      ASSERTIVE: "assertive"
    };
    announceToScreenReader = (message, priority = "polite") => {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", priority);
      announcement.setAttribute("aria-atomic", "true");
      announcement.style.position = "absolute";
      announcement.style.left = "-10000px";
      announcement.style.width = "1px";
      announcement.style.height = "1px";
      announcement.style.overflow = "hidden";
      document.body.appendChild(announcement);
      announcement.textContent = message;
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1e3);
    };
    generateChartDescription = (chartType, data, title) => {
      if (!data || data.length === 0) {
        return `${title ? title + ": " : ""}Empty ${chartType} chart with no data available.`;
      }
      const dataCount = data.length;
      let description = `${title ? title + ": " : ""}${chartType} chart with ${dataCount} data point${dataCount === 1 ? "" : "s"}.`;
      if (chartType === "line" || chartType === "area") {
        const firstValue = data[0]?.value || 0;
        const lastValue = data[data.length - 1]?.value || 0;
        const trend = lastValue > firstValue ? "increasing" : lastValue < firstValue ? "decreasing" : "stable";
        description += ` Overall trend is ${trend}.`;
      }
      if (data.every((d) => typeof d.value === "number")) {
        const values = data.map((d) => d.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        description += ` Values range from ${min.toFixed(1)} to ${max.toFixed(1)}, with an average of ${avg.toFixed(1)}.`;
      }
      return description;
    };
    generateDataTable = (data, headers) => {
      if (!data || data.length === 0) {
        return "No data available";
      }
      let table = `Data table with ${headers.length} columns and ${data.length} rows. `;
      table += `Columns are: ${headers.join(", ")}. `;
      const maxRows = Math.min(3, data.length);
      for (let i = 0; i < maxRows; i++) {
        const row = data[i];
        const rowData = headers.map((header) => row[header] || "N/A").join(", ");
        table += `Row ${i + 1}: ${rowData}. `;
      }
      if (data.length > 3) {
        table += `And ${data.length - 3} more rows.`;
      }
      return table;
    };
    useKeyboardNavigation = (items, options = {}) => {
      const { loop = true, orientation = "both", onSelect, disabled = false } = options;
      const [currentIndex, setCurrentIndex] = (0, import_react11.useState)(0);
      const handleKeyDown = (0, import_react11.useCallback)(
        (event) => {
          if (disabled || items.length === 0) return;
          const { key } = event;
          let newIndex = currentIndex;
          let handled = false;
          switch (key) {
            case "ArrowLeft":
              if (orientation === "horizontal" || orientation === "both") {
                newIndex = loop ? (currentIndex - 1 + items.length) % items.length : Math.max(0, currentIndex - 1);
                handled = true;
              }
              break;
            case "ArrowRight":
              if (orientation === "horizontal" || orientation === "both") {
                newIndex = loop ? (currentIndex + 1) % items.length : Math.min(items.length - 1, currentIndex + 1);
                handled = true;
              }
              break;
            case "ArrowUp":
              if (orientation === "vertical" || orientation === "both") {
                newIndex = loop ? (currentIndex - 1 + items.length) % items.length : Math.max(0, currentIndex - 1);
                handled = true;
              }
              break;
            case "ArrowDown":
              if (orientation === "vertical" || orientation === "both") {
                newIndex = loop ? (currentIndex + 1) % items.length : Math.min(items.length - 1, currentIndex + 1);
                handled = true;
              }
              break;
            case "Home":
              newIndex = 0;
              handled = true;
              break;
            case "End":
              newIndex = items.length - 1;
              handled = true;
              break;
            case "Enter":
            case " ":
              if (onSelect) {
                onSelect(currentIndex);
                handled = true;
              }
              break;
          }
          if (handled) {
            event.preventDefault();
            if (newIndex !== currentIndex) {
              setCurrentIndex(newIndex);
              items[newIndex]?.focus();
            }
          }
        },
        [currentIndex, items, loop, orientation, onSelect, disabled]
      );
      return { currentIndex, setCurrentIndex, handleKeyDown };
    };
    useFocusManagement = () => {
      const previouslyFocusedElement = (0, import_react11.useRef)(null);
      const trapFocus = (0, import_react11.useCallback)((container) => {
        const focusableElements = container.querySelectorAll(
          'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const handleTabKey = (event) => {
          if (event.key === "Tab") {
            if (event.shiftKey) {
              if (document.activeElement === firstElement) {
                lastElement?.focus();
                event.preventDefault();
              }
            } else {
              if (document.activeElement === lastElement) {
                firstElement?.focus();
                event.preventDefault();
              }
            }
          }
        };
        container.addEventListener("keydown", handleTabKey);
        firstElement?.focus();
        return () => {
          container.removeEventListener("keydown", handleTabKey);
        };
      }, []);
      const saveFocus = (0, import_react11.useCallback)(() => {
        previouslyFocusedElement.current = document.activeElement;
      }, []);
      const restoreFocus = (0, import_react11.useCallback)(() => {
        previouslyFocusedElement.current?.focus();
        previouslyFocusedElement.current = null;
      }, []);
      return { trapFocus, saveFocus, restoreFocus };
    };
    COLOR_CONTRAST = {
      // WCAG AA compliant color pairs (4.5:1 ratio minimum)
      COMBINATIONS: {
        PRIMARY: {
          background: "#3B82F6",
          // Blue-500
          text: "#FFFFFF",
          contrast: 4.76
        },
        SUCCESS: {
          background: "#059669",
          // Green-600
          text: "#FFFFFF",
          contrast: 4.81
        },
        WARNING: {
          background: "#D97706",
          // Orange-600
          text: "#FFFFFF",
          contrast: 4.52
        },
        ERROR: {
          background: "#DC2626",
          // Red-600
          text: "#FFFFFF",
          contrast: 5.25
        },
        INFO: {
          background: "#0284C7",
          // Sky-600
          text: "#FFFFFF",
          contrast: 4.89
        },
        NEUTRAL: {
          background: "#4B5563",
          // Gray-600
          text: "#FFFFFF",
          contrast: 7.21
        }
      },
      // Text alternatives for color-coded information
      TEXT_INDICATORS: {
        online: "\u2713 Online",
        offline: "\u2717 Offline",
        maintenance: "\u26A0 Maintenance",
        degraded: "\u26A1 Degraded",
        active: "\u25CF Active",
        suspended: "\u23F8 Suspended",
        pending: "\u23F3 Pending",
        paid: "\u2713 Paid",
        overdue: "\u26A0 Overdue",
        processing: "\u23F3 Processing",
        critical: "\u{1F6A8} Critical",
        high: "\u2B06 High",
        medium: "\u27A1 Medium",
        low: "\u2B07 Low"
      }
    };
    generateStatusText = (variant, value, context) => {
      const indicator = COLOR_CONTRAST.TEXT_INDICATORS[variant];
      const baseText = indicator || variant;
      let statusText = baseText;
      if (value !== void 0) {
        statusText += ` ${value}`;
      }
      if (context) {
        statusText += ` ${context}`;
      }
      return statusText;
    };
    useReducedMotion = () => {
      const [prefersReducedMotion, setPrefersReducedMotion] = (0, import_react11.useState)(false);
      (0, import_react11.useEffect)(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);
        const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }, []);
      return prefersReducedMotion;
    };
    useScreenReader = () => {
      const [isScreenReader, setIsScreenReader] = (0, import_react11.useState)(false);
      (0, import_react11.useEffect)(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isScreenReaderUA = userAgent.includes("nvda") || userAgent.includes("jaws") || userAgent.includes("dragon") || userAgent.includes("voiceover");
        const isHighContrast = window.matchMedia("(prefers-contrast: high)").matches;
        const isForcedColors = window.matchMedia("(forced-colors: active)").matches;
        setIsScreenReader(isScreenReaderUA || isHighContrast || isForcedColors);
      }, []);
      return isScreenReader;
    };
    idCounter = 0;
    generateId = (prefix = "accessibility") => {
      return `${prefix}-${Date.now()}-${++idCounter}`;
    };
  }
});

// src/utils/performance.ts
var performance_exports = {};
__export(performance_exports, {
  analyzeBundleImpact: () => analyzeBundleImpact,
  createMemoizedSelector: () => createMemoizedSelector,
  exportPerformanceData: () => exportPerformanceData,
  generatePerformanceReport: () => generatePerformanceReport,
  getPerformanceRecommendations: () => getPerformanceRecommendations,
  useDebouncedState: () => useDebouncedState,
  useDeepMemo: () => useDeepMemo,
  useLazyComponent: () => useLazyComponent,
  useMemoryMonitor: () => useMemoryMonitor,
  useRenderProfiler: () => useRenderProfiler,
  useThrottledState: () => useThrottledState,
  useVirtualizedList: () => useVirtualizedList
});
var import_react12, performanceProfiles, renderMetrics, useRenderProfiler, createMemoizedSelector, useDeepMemo, useThrottledState, useDebouncedState, useLazyComponent, useVirtualizedList, analyzeBundleImpact, useMemoryMonitor, getPerformanceRecommendations, generatePerformanceReport, exportPerformanceData;
var init_performance = __esm({
  "src/utils/performance.ts"() {
    "use strict";
    import_react12 = require("react");
    performanceProfiles = /* @__PURE__ */ new Map();
    renderMetrics = [];
    useRenderProfiler = (componentName, props) => {
      const renderCount = (0, import_react12.useRef)(0);
      const lastProps = (0, import_react12.useRef)(props);
      const renderStart = (0, import_react12.useRef)(0);
      renderStart.current = performance.now();
      (0, import_react12.useEffect)(() => {
        const renderEnd = performance.now();
        const renderTime = renderEnd - renderStart.current;
        renderCount.current += 1;
        const propsChanges = props && lastProps.current ? Object.keys(props).reduce((changes, key) => {
          return props[key] !== lastProps.current[key] ? changes + 1 : changes;
        }, 0) : 0;
        const metric = {
          renderTime,
          componentName,
          timestamp: renderEnd,
          renderCount: renderCount.current,
          propsChanges
        };
        renderMetrics.push(metric);
        const existing = performanceProfiles.get(componentName);
        const profile = {
          component: componentName,
          totalRenders: renderCount.current,
          avgRenderTime: existing ? (existing.avgRenderTime * (existing.totalRenders - 1) + renderTime) / renderCount.current : renderTime,
          maxRenderTime: existing ? Math.max(existing.maxRenderTime, renderTime) : renderTime,
          minRenderTime: existing ? Math.min(existing.minRenderTime, renderTime) : renderTime,
          lastRender: renderEnd,
          propsHistory: existing ? [...existing.propsHistory.slice(-9), props] : [props]
        };
        performanceProfiles.set(componentName, profile);
        lastProps.current = props;
        if (renderMetrics.length > 1e3) {
          renderMetrics.splice(0, renderMetrics.length - 1e3);
        }
      });
      return {
        renderCount: renderCount.current,
        getProfile: () => performanceProfiles.get(componentName),
        getAllProfiles: () => Array.from(performanceProfiles.values()),
        getRecentMetrics: () => renderMetrics.slice(-10)
      };
    };
    createMemoizedSelector = (selector, dependencies = () => []) => {
      let lastDeps = [];
      let lastResult;
      let lastData;
      return (data) => {
        const currentDeps = dependencies(data);
        if (data !== lastData || currentDeps.length !== lastDeps.length || currentDeps.some((dep, index) => dep !== lastDeps[index])) {
          lastResult = selector(data);
          lastDeps = currentDeps;
          lastData = data;
        }
        return lastResult;
      };
    };
    useDeepMemo = (factory, deps) => {
      const ref = (0, import_react12.useRef)();
      const deepEqual = (a, b) => {
        if (a.length !== b.length) return false;
        return a.every((val, index) => {
          if (typeof val === "object" && val !== null) {
            return JSON.stringify(val) === JSON.stringify(b[index]);
          }
          return val === b[index];
        });
      };
      if (!ref.current || !deepEqual(deps, ref.current.deps)) {
        ref.current = {
          value: factory(),
          deps: [...deps]
        };
      }
      return ref.current.value;
    };
    useThrottledState = (initialValue, delay = 100) => {
      const [state, setState] = (0, import_react12.useState)(initialValue);
      const [throttledState, setThrottledState] = (0, import_react12.useState)(initialValue);
      const timeoutRef = (0, import_react12.useRef)();
      const setThrottledValue = (0, import_react12.useCallback)(
        (value) => {
          setState(value);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            setThrottledState(value);
          }, delay);
        },
        [delay]
      );
      (0, import_react12.useEffect)(() => {
        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }, []);
      return [state, setThrottledValue, throttledState];
    };
    useDebouncedState = (initialValue, delay = 300) => {
      const [state, setState] = (0, import_react12.useState)(initialValue);
      const [debouncedState, setDebouncedState] = (0, import_react12.useState)(initialValue);
      const timeoutRef = (0, import_react12.useRef)();
      const setDebouncedValue = (0, import_react12.useCallback)(
        (value) => {
          setState(value);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            setDebouncedState(value);
          }, delay);
        },
        [delay]
      );
      (0, import_react12.useEffect)(() => {
        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }, []);
      return [state, setDebouncedValue, debouncedState];
    };
    useLazyComponent = (importFunction, fallback) => {
      const [Component3, setComponent] = (0, import_react12.useState)(null);
      const [loading, setLoading] = (0, import_react12.useState)(false);
      const [error, setError] = (0, import_react12.useState)(null);
      const loadComponent = (0, import_react12.useCallback)(async () => {
        if (Component3 || loading) return;
        setLoading(true);
        setError(null);
        try {
          const module2 = await importFunction();
          setComponent(() => module2.default);
        } catch (err) {
          setError(err instanceof Error ? err : new Error("Failed to load component"));
        } finally {
          setLoading(false);
        }
      }, [Component3, loading, importFunction]);
      return {
        Component: Component3 || fallback || null,
        loading,
        error,
        loadComponent
      };
    };
    useVirtualizedList = ({
      items,
      itemHeight,
      containerHeight,
      overscan = 5
    }) => {
      const [scrollTop, setScrollTop] = (0, import_react12.useState)(0);
      const visibleRange = (0, import_react12.useMemo)(() => {
        const visibleStart = Math.floor(scrollTop / itemHeight);
        const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight);
        const start = Math.max(0, visibleStart - overscan);
        const end = Math.min(items.length, visibleEnd + overscan);
        return { start, end };
      }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);
      const visibleItems = (0, import_react12.useMemo)(() => {
        return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
          item,
          index: visibleRange.start + index,
          style: {
            position: "absolute",
            top: (visibleRange.start + index) * itemHeight,
            height: itemHeight
          }
        }));
      }, [items, visibleRange, itemHeight]);
      const totalHeight = items.length * itemHeight;
      const handleScroll = (0, import_react12.useCallback)((event) => {
        setScrollTop(event.currentTarget.scrollTop);
      }, []);
      return {
        visibleItems,
        totalHeight,
        handleScroll,
        scrollTop
      };
    };
    analyzeBundleImpact = (componentName, size) => {
      const impact = {
        component: componentName,
        size,
        percentage: 0,
        recommendation: ""
      };
      if (size > 1e5) {
        impact.recommendation = "Consider code splitting - component is large";
      } else if (size > 5e4) {
        impact.recommendation = "Monitor size - consider lazy loading";
      } else if (size > 25e3) {
        impact.recommendation = "Good size - check for unused dependencies";
      } else {
        impact.recommendation = "Optimal size for immediate loading";
      }
      return impact;
    };
    useMemoryMonitor = (componentName) => {
      const [memoryUsage, setMemoryUsage] = (0, import_react12.useState)(null);
      (0, import_react12.useEffect)(() => {
        const checkMemory = () => {
          if ("memory" in performance) {
            const memory = performance.memory;
            const used = memory.usedJSHeapSize;
            const total = memory.totalJSHeapSize;
            const percentage = used / total * 100;
            setMemoryUsage({ used, total, percentage });
            if (percentage > 80) {
              console.warn(`${componentName}: High memory usage (${percentage.toFixed(1)}%)`);
            }
          }
        };
        checkMemory();
        const interval = setInterval(checkMemory, 5e3);
        return () => clearInterval(interval);
      }, [componentName]);
      return memoryUsage;
    };
    getPerformanceRecommendations = (profile) => {
      const recommendations = [];
      if (profile.totalRenders > 100 && profile.avgRenderTime > 16) {
        recommendations.push("Consider using React.memo() to prevent unnecessary re-renders");
      }
      if (profile.avgRenderTime > 50) {
        recommendations.push("Optimize expensive calculations with useMemo()");
      }
      if (profile.propsHistory.length > 5) {
        const recentChanges = profile.propsHistory.slice(-5);
        const changeFrequency = recentChanges.length / 5;
        if (changeFrequency > 0.8) {
          recommendations.push("Stabilize props with useCallback() to reduce re-renders");
        }
      }
      const variance = profile.maxRenderTime - profile.minRenderTime;
      if (variance > 100) {
        recommendations.push("Inconsistent render times - check for conditional heavy operations");
      }
      return recommendations;
    };
    generatePerformanceReport = () => {
      const profiles = Array.from(performanceProfiles.values());
      if (profiles.length === 0) {
        return {
          summary: {
            totalComponents: 0,
            avgRenderTime: 0,
            slowestComponent: "",
            fastestComponent: "",
            totalRenders: 0
          },
          components: [],
          recommendations: []
        };
      }
      const avgRenderTime = profiles.reduce((sum, p) => sum + p.avgRenderTime, 0) / profiles.length;
      const slowest = profiles.reduce(
        (prev, curr) => curr.avgRenderTime > prev.avgRenderTime ? curr : prev
      );
      const fastest = profiles.reduce(
        (prev, curr) => curr.avgRenderTime < prev.avgRenderTime ? curr : prev
      );
      const totalRenders = profiles.reduce((sum, p) => sum + p.totalRenders, 0);
      const recommendations = profiles.map((profile) => ({
        component: profile.component,
        suggestions: getPerformanceRecommendations(profile)
      })).filter((r) => r.suggestions.length > 0);
      return {
        summary: {
          totalComponents: profiles.length,
          avgRenderTime,
          slowestComponent: slowest.component,
          fastestComponent: fastest.component,
          totalRenders
        },
        components: profiles,
        recommendations
      };
    };
    exportPerformanceData = () => {
      const report = generatePerformanceReport();
      const data = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        report,
        metrics: renderMetrics.slice(-100)
        // Last 100 renders
      };
      return JSON.stringify(data, null, 2);
    };
  }
});

// src/components/ErrorBoundary.tsx
var import_react13, import_jsx_runtime12, DefaultErrorFallback, ErrorBoundary;
var init_ErrorBoundary = __esm({
  "src/components/ErrorBoundary.tsx"() {
    "use strict";
    "use client";
    import_react13 = __toESM(require("react"));
    import_jsx_runtime12 = require("react/jsx-runtime");
    DefaultErrorFallback = ({
      error,
      errorId,
      onRetry,
      componentName = "Component"
    }) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
      "div",
      {
        className: "flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg",
        role: "alert",
        "aria-live": "polite",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "text-red-600 mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("svg", { className: "w-8 h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            }
          ) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("h3", { className: "text-lg font-semibold text-red-900 mb-2", children: [
            componentName,
            " Error"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "text-sm text-red-700 text-center mb-4", children: "Something went wrong while rendering this component." }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("details", { className: "mb-4 text-xs text-red-600", children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("summary", { className: "cursor-pointer hover:text-red-800", children: [
              "Technical Details (ID: ",
              errorId,
              ")"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("pre", { className: "mt-2 p-2 bg-red-100 rounded text-xs overflow-auto max-w-md", children: error.message })
          ] }),
          onRetry && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "button",
            {
              onClick: onRetry,
              className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors",
              "aria-label": "Retry loading component",
              children: "Try Again"
            }
          )
        ]
      }
    );
    ErrorBoundary = class extends import_react13.Component {
      retryTimeoutId = null;
      constructor(props) {
        super(props);
        this.state = {
          hasError: false,
          error: null,
          errorInfo: null,
          errorId: ""
        };
      }
      static getDerivedStateFromError(error) {
        const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
          hasError: true,
          error,
          errorId
        };
      }
      componentDidCatch(error, errorInfo) {
        const { onError } = this.props;
        const { errorId } = this.state;
        if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
          console.group(`\u{1F6A8} Component Error (${errorId})`);
          console.error("Error:", error);
          console.error("Error Info:", errorInfo);
          console.groupEnd();
        }
        this.setState({ errorInfo });
        if (onError && errorId) {
          try {
            onError(error, errorInfo, errorId);
          } catch (handlerError) {
            console.error("Error in error handler:", handlerError);
          }
        }
        if (typeof process !== "undefined" && process.env?.NODE_ENV === "production") {
          this.reportError(error, errorInfo, errorId);
        }
      }
      reportError = (error, errorInfo, errorId) => {
        try {
          fetch("/api/errors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              errorId,
              message: error.message,
              stack: error.stack,
              componentStack: errorInfo.componentStack,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              userAgent: navigator.userAgent,
              url: window.location.href
            })
          }).catch((reportingError) => {
            console.error("Failed to report error:", reportingError);
          });
        } catch (reportingError) {
          console.error("Error reporting failed:", reportingError);
        }
      };
      handleRetry = () => {
        if (this.retryTimeoutId) {
          clearTimeout(this.retryTimeoutId);
        }
        this.retryTimeoutId = setTimeout(() => {
          this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: ""
          });
        }, 100);
      };
      componentWillUnmount() {
        if (this.retryTimeoutId) {
          clearTimeout(this.retryTimeoutId);
        }
      }
      render() {
        const { children, fallback, isolate } = this.props;
        const { hasError, error, errorId } = this.state;
        if (hasError && error) {
          if (fallback) {
            return fallback;
          }
          return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            DefaultErrorFallback,
            {
              error,
              errorId,
              onRetry: this.handleRetry,
              componentName: this.getComponentName()
            }
          );
        }
        return children;
      }
      getComponentName() {
        const { error } = this.state;
        if (error?.stack) {
          const match = error.stack.match(/at\s+([A-Z][A-Za-z0-9]*)/);
          const matchedName = match?.[1];
          if (matchedName) {
            return matchedName;
          }
        }
        return "Component";
      }
    };
  }
});

// src/charts/OptimizedCharts.tsx
var OptimizedCharts_exports = {};
__export(OptimizedCharts_exports, {
  COLORS: () => COLORS,
  ChartGradients: () => ChartGradients,
  OptimizedRevenueChart: () => OptimizedRevenueChart,
  OptimizedTooltip: () => OptimizedTooltip
});
var import_react14, import_recharts2, import_jsx_runtime13, COLORS, ChartGradients, createDataSelector, OptimizedTooltip, OptimizedRevenueChart;
var init_OptimizedCharts = __esm({
  "src/charts/OptimizedCharts.tsx"() {
    "use strict";
    "use client";
    import_react14 = require("react");
    import_recharts2 = require("recharts");
    init_security();
    init_security();
    init_a11y();
    init_performance();
    init_ErrorBoundary();
    import_jsx_runtime13 = require("react/jsx-runtime");
    COLORS = {
      primary: "#3B82F6",
      secondary: "#10B981",
      accent: "#8B5CF6",
      warning: "#F59E0B",
      danger: "#EF4444",
      success: "#22C55E",
      gradient: {
        primary: "url(#primaryGradient)",
        secondary: "url(#secondaryGradient)",
        accent: "url(#accentGradient)"
      }
    };
    ChartGradients = (0, import_react14.memo)(() => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("defs", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("linearGradient", { id: "primaryGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("stop", { offset: "5%", stopColor: COLORS.primary, stopOpacity: 0.8 }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("stop", { offset: "95%", stopColor: COLORS.primary, stopOpacity: 0.1 })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("linearGradient", { id: "secondaryGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("stop", { offset: "5%", stopColor: COLORS.secondary, stopOpacity: 0.8 }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("stop", { offset: "95%", stopColor: COLORS.secondary, stopOpacity: 0.1 })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("linearGradient", { id: "accentGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("stop", { offset: "5%", stopColor: COLORS.accent, stopOpacity: 0.8 }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("stop", { offset: "95%", stopColor: COLORS.accent, stopOpacity: 0.1 })
      ] })
    ] }));
    createDataSelector = (validator, fallback) => createMemoizedSelector(
      (data) => {
        try {
          return validateArray(validator, data);
        } catch (error) {
          console.error("Chart data validation failed:", error);
          return fallback;
        }
      },
      (data) => [JSON.stringify(data)]
    );
    OptimizedTooltip = (0, import_react14.memo)(
      ({ active, payload, label, formatter }) => {
        const tooltipId = (0, import_react14.useMemo)(() => generateId("chart-tooltip"), []);
        if (!active || !payload || payload.length === 0) {
          return null;
        }
        const safeLabel = (0, import_react14.useMemo)(() => label ? sanitizeText(String(label)) : "", [label]);
        const accessibleDescription = (0, import_react14.useMemo)(() => {
          const items = payload.map((entry) => {
            const name = entry.name ? sanitizeText(String(entry.name)) : "Unknown";
            const value = typeof entry.value === "number" ? entry.value : 0;
            return `${name}: ${value}`;
          });
          return `Chart data point ${safeLabel ? "for " + safeLabel : ""}: ${items.join(", ")}`;
        }, [payload, safeLabel]);
        const formattedEntries = (0, import_react14.useMemo)(() => {
          if (!payload) {
            return [];
          }
          return payload.flatMap((entry, index) => {
            if (!entry || typeof entry.value === "undefined") {
              return [];
            }
            const safeName = entry.name ? sanitizeText(String(entry.name)) : "Unknown";
            const rawValue = typeof entry.value === "number" ? entry.value : Number(entry.value) || 0;
            let formattedValue;
            let formattedName;
            if (formatter) {
              try {
                const result = formatter(rawValue, safeName);
                if (Array.isArray(result) && result.length >= 2) {
                  formattedValue = sanitizeText(String(result[0]));
                  formattedName = sanitizeText(String(result[1]));
                }
              } catch (error) {
                console.error("Tooltip formatter error:", error);
              }
            }
            return [
              {
                displayValue: formattedValue ?? sanitizeText(String(rawValue)),
                displayName: formattedName ?? safeName,
                color: entry.color || "#666",
                index
              }
            ];
          });
        }, [payload, formatter]);
        return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
          "div",
          {
            id: tooltipId,
            className: "bg-white border border-gray-200 rounded-lg shadow-lg p-3 backdrop-blur-sm",
            role: "tooltip",
            "aria-label": accessibleDescription,
            "aria-live": "polite",
            tabIndex: -1,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "sr-only", children: accessibleDescription }),
              safeLabel && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { className: "text-sm font-semibold text-gray-900 mb-2", children: safeLabel }),
              formattedEntries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex items-center space-x-2 mb-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                  "div",
                  {
                    className: "w-3 h-3 rounded-full",
                    style: { backgroundColor: entry.color },
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: "text-sm text-gray-600", children: [
                  entry.displayName,
                  ":"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "text-sm font-semibold text-gray-900", children: entry.displayValue })
              ] }, `tooltip-${entry.index}`))
            ]
          }
        );
      },
      (prevProps, nextProps) => {
        return prevProps.active === nextProps.active && prevProps.label === nextProps.label && prevProps.formatter === nextProps.formatter && JSON.stringify(prevProps.payload) === JSON.stringify(nextProps.payload);
      }
    );
    OptimizedRevenueChart = (0, import_react14.memo)(
      ({ data, height = 300, className, onDataPointClick }) => {
        const { renderCount } = useRenderProfiler("OptimizedRevenueChart", {
          dataLength: data?.length,
          height
        });
        const [activeIndex, setActiveIndex, throttledActiveIndex] = useThrottledState(
          null,
          16
        );
        const prefersReducedMotion = useReducedMotion();
        const isScreenReader = useScreenReader();
        const ids = (0, import_react14.useMemo)(
          () => ({
            chartId: generateId("revenue-chart"),
            descriptionId: generateId("revenue-description"),
            tableId: generateId("revenue-table")
          }),
          []
        );
        const dataSelector = (0, import_react14.useMemo)(() => createDataSelector(revenueDataSchema, []), []);
        const validatedData = (0, import_react14.useMemo)(() => dataSelector(data), [dataSelector, data]);
        const safeClassName = (0, import_react14.useMemo)(() => validateClassName(className), [className]);
        const chartDescription = (0, import_react14.useMemo)(
          () => generateChartDescription("area", validatedData, "Revenue Trends"),
          [validatedData]
        );
        const dataTableDescription = (0, import_react14.useMemo)(
          () => generateDataTable(validatedData, ["month", "revenue", "target", "previousYear"]),
          [validatedData]
        );
        const handleMouseEnter = (0, import_react14.useCallback)(
          (...args) => {
            const index = typeof args[1] === "number" ? args[1] : null;
            if (index !== null) {
              setActiveIndex(index);
            }
          },
          [setActiveIndex]
        );
        const handleMouseLeave = (0, import_react14.useCallback)(() => {
          setActiveIndex(null);
        }, [setActiveIndex]);
        const handleDataPointClick = (0, import_react14.useCallback)(
          (data2, index) => {
            if (onDataPointClick && validatedData[index]) {
              onDataPointClick(validatedData[index], index);
            }
          },
          [onDataPointClick, validatedData]
        );
        const tooltipFormatter = (0, import_react14.useCallback)(
          (value, name) => {
            try {
              const numValue = typeof value === "number" ? value : parseFloat(String(value));
              if (isNaN(numValue)) return ["Invalid", name];
              return [`$${numValue.toLocaleString()}`, name];
            } catch {
              return ["Error", name];
            }
          },
          []
        );
        if (!validatedData || validatedData.length === 0) {
          return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            "div",
            {
              className: `w-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${safeClassName}`,
              style: { height },
              role: "img",
              "aria-label": "No revenue data available",
              tabIndex: 0,
              children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { className: "text-gray-500 text-sm", children: "No revenue data available" })
            }
          );
        }
        return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          ErrorBoundary,
          {
            fallback: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              "div",
              {
                className: "w-full flex items-center justify-center bg-red-50 border border-red-200 rounded-lg",
                style: { height },
                children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { className: "text-red-600 text-sm", children: "Revenue chart failed to load" })
              }
            ),
            children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
              "figure",
              {
                className: `w-full ${safeClassName}`,
                style: { height },
                role: ARIA_ROLES.CHART_CONTAINER,
                "data-render-count": renderCount,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { id: ids.descriptionId, className: "sr-only", children: chartDescription }),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { id: ids.tableId, className: "sr-only", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { children: "Data table alternative for screen readers:" }),
                    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { children: dataTableDescription })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                    "div",
                    {
                      id: ids.chartId,
                      role: ARIA_ROLES.CHART,
                      "aria-labelledby": ids.descriptionId,
                      "aria-describedby": ids.tableId,
                      tabIndex: 0,
                      className: "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded",
                      onFocus: () => {
                        if (isScreenReader) {
                          announceToScreenReader(chartDescription, "polite");
                        }
                      },
                      children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_recharts2.ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
                        import_recharts2.AreaChart,
                        {
                          data: validatedData,
                          margin: { top: 10, right: 30, left: 0, bottom: 0 },
                          onClick: handleDataPointClick,
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ChartGradients, {}),
                            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_recharts2.CartesianGrid, { strokeDasharray: "3 3", stroke: "#E5E7EB" }),
                            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                              import_recharts2.XAxis,
                              {
                                dataKey: "month",
                                axisLine: false,
                                tickLine: false,
                                tick: { fontSize: 12, fill: "#6B7280" }
                              }
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                              import_recharts2.YAxis,
                              {
                                axisLine: false,
                                tickLine: false,
                                tick: { fontSize: 12, fill: "#6B7280" },
                                tickFormatter: (value) => {
                                  try {
                                    const num = typeof value === "number" ? value : parseFloat(String(value));
                                    return isNaN(num) ? "0" : `$${(num / 1e3).toFixed(0)}K`;
                                  } catch {
                                    return "0";
                                  }
                                }
                              }
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                              import_recharts2.Tooltip,
                              {
                                content: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(OptimizedTooltip, { formatter: tooltipFormatter }),
                                animationDuration: prefersReducedMotion ? 0 : 200
                              }
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_recharts2.Legend, {}),
                            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                              import_recharts2.Area,
                              {
                                type: "monotone",
                                dataKey: "revenue",
                                stroke: COLORS.primary,
                                strokeWidth: 2,
                                fill: COLORS.gradient.primary,
                                name: "Current Revenue",
                                onMouseEnter: handleMouseEnter,
                                onMouseLeave: handleMouseLeave,
                                animationDuration: prefersReducedMotion ? 0 : 1500
                              }
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                              import_recharts2.Area,
                              {
                                type: "monotone",
                                dataKey: "previousYear",
                                stroke: COLORS.secondary,
                                strokeWidth: 2,
                                fill: COLORS.gradient.secondary,
                                name: "Previous Year",
                                animationDuration: prefersReducedMotion ? 0 : 1500
                              }
                            )
                          ]
                        }
                      ) })
                    }
                  )
                ]
              }
            )
          }
        );
      },
      (prevProps, nextProps) => {
        if (prevProps === nextProps) return true;
        return prevProps.height === nextProps.height && prevProps.className === nextProps.className && prevProps.onDataPointClick === nextProps.onDataPointClick && // Only do expensive JSON comparison if shallow checks fail
        (prevProps.data === nextProps.data || JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data));
      }
    );
  }
});

// src/charts/InteractiveChart.tsx
var InteractiveChart_exports = {};
__export(InteractiveChart_exports, {
  BandwidthChart: () => BandwidthChart2,
  COLORS: () => COLORS2,
  ChartGradients: () => ChartGradients2,
  NetworkUsageChart: () => NetworkUsageChart2,
  RevenueChart: () => RevenueChart2,
  ServiceStatusChart: () => ServiceStatusChart2
});
var import_react41, import_recharts3, import_jsx_runtime43, COLORS2, ChartGradients2, CustomTooltip2, RevenueChart2, NetworkUsageChart2, ServiceStatusChart2, BandwidthChart2;
var init_InteractiveChart = __esm({
  "src/charts/InteractiveChart.tsx"() {
    "use strict";
    "use client";
    import_react41 = require("react");
    init_performance();
    import_recharts3 = require("recharts");
    init_security();
    init_security();
    init_a11y();
    init_ErrorBoundary();
    import_jsx_runtime43 = require("react/jsx-runtime");
    COLORS2 = {
      primary: "#3B82F6",
      secondary: "#10B981",
      accent: "#8B5CF6",
      warning: "#F59E0B",
      danger: "#EF4444",
      success: "#22C55E",
      gradient: {
        primary: "url(#primaryGradient)",
        secondary: "url(#secondaryGradient)",
        accent: "url(#accentGradient)"
      }
    };
    ChartGradients2 = () => /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("defs", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("linearGradient", { id: "primaryGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("stop", { offset: "5%", stopColor: COLORS2.primary, stopOpacity: 0.8 }),
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("stop", { offset: "95%", stopColor: COLORS2.primary, stopOpacity: 0.1 })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("linearGradient", { id: "secondaryGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("stop", { offset: "5%", stopColor: COLORS2.secondary, stopOpacity: 0.8 }),
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("stop", { offset: "95%", stopColor: COLORS2.secondary, stopOpacity: 0.1 })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("linearGradient", { id: "accentGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("stop", { offset: "5%", stopColor: COLORS2.accent, stopOpacity: 0.8 }),
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("stop", { offset: "95%", stopColor: COLORS2.accent, stopOpacity: 0.1 })
      ] })
    ] });
    CustomTooltip2 = (0, import_react41.memo)(
      ({ active, payload, label, formatter }) => {
        const tooltipId = (0, import_react41.useMemo)(() => generateId("chart-tooltip"), []);
        if (!active || !payload || payload.length === 0) {
          return null;
        }
        const safeLabel = label ? sanitizeText(String(label)) : "";
        const accessibleDescription = (0, import_react41.useMemo)(() => {
          const items = payload.map((entry) => {
            const name = entry.name ? sanitizeText(String(entry.name)) : "Unknown";
            const value = typeof entry.value === "number" ? entry.value : 0;
            return `${name}: ${value}`;
          });
          return `Chart data point ${safeLabel ? "for " + safeLabel : ""}: ${items.join(", ")}`;
        }, [payload, safeLabel]);
        return /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)(
          "div",
          {
            id: tooltipId,
            className: "bg-white border border-gray-200 rounded-lg shadow-lg p-3 backdrop-blur-sm",
            role: "tooltip",
            "aria-label": accessibleDescription,
            "aria-live": "polite",
            tabIndex: -1,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "sr-only", children: accessibleDescription }),
              safeLabel && /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("p", { className: "text-sm font-semibold text-gray-900 mb-2", children: safeLabel }),
              payload.map((entry, index) => {
                if (!entry || typeof entry.value === "undefined") {
                  return null;
                }
                const safeName = entry.name ? sanitizeText(String(entry.name)) : "Unknown";
                const safeValue = typeof entry.value === "number" ? entry.value : 0;
                let displayValue;
                let displayName;
                if (formatter) {
                  try {
                    const [formattedValue, formattedName] = formatter(safeValue, safeName);
                    displayValue = sanitizeText(String(formattedValue));
                    displayName = sanitizeText(String(formattedName));
                  } catch (error) {
                    console.error("Tooltip formatter error:", error);
                    displayValue = String(safeValue);
                    displayName = safeName;
                  }
                } else {
                  displayValue = String(safeValue);
                  displayName = safeName;
                }
                return /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "flex items-center space-x-2 mb-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
                    "div",
                    {
                      className: "w-3 h-3 rounded-full",
                      style: { backgroundColor: entry.color || "#666" },
                      "aria-hidden": "true"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("span", { className: "text-sm text-gray-600", children: [
                    displayName,
                    ":"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("span", { className: "text-sm font-semibold text-gray-900", children: displayValue })
                ] }, `tooltip-${index}`);
              })
            ]
          }
        );
      },
      (prevProps, nextProps) => {
        return prevProps.active === nextProps.active && prevProps.label === nextProps.label && JSON.stringify(prevProps.payload) === JSON.stringify(nextProps.payload) && prevProps.formatter === nextProps.formatter;
      }
    );
    RevenueChart2 = (0, import_react41.memo)(
      ({ data, height = 300, className, onDataPointClick }) => {
        const { renderCount, getProfile } = useRenderProfiler("RevenueChart", {
          dataLength: data?.length,
          height,
          className
        });
        const prefersReducedMotion = useReducedMotion();
        const isScreenReader = useScreenReader();
        const chartId = (0, import_react41.useMemo)(() => generateId("revenue-chart"), []);
        const descriptionId = (0, import_react41.useMemo)(() => generateId("revenue-description"), []);
        const tableId = (0, import_react41.useMemo)(() => generateId("revenue-table"), []);
        const validatedData = (0, import_react41.useMemo)(() => {
          try {
            return validateArray(revenueDataSchema, data);
          } catch (error) {
            console.error("RevenueChart data validation failed:", error);
            return [];
          }
        }, [data]);
        const safeClassName = (0, import_react41.useMemo)(() => {
          return validateClassName(className);
        }, [className]);
        const chartDescription = (0, import_react41.useMemo)(() => {
          return generateChartDescription("area", validatedData, "Revenue Trends");
        }, [validatedData]);
        const dataTableDescription = (0, import_react41.useMemo)(() => {
          return generateDataTable(validatedData, ["month", "revenue", "target", "previousYear"]);
        }, [validatedData]);
        const [activeIndex, setActiveIndex] = (0, import_react41.useState)(null);
        const handleMouseEnter = (0, import_react41.useCallback)((...args) => {
          const index = typeof args[1] === "number" ? args[1] : null;
          if (index !== null) {
            setActiveIndex(index);
          }
        }, []);
        const handleMouseLeave = (0, import_react41.useCallback)(() => {
          setActiveIndex(null);
        }, []);
        const handleDataPointClick = (0, import_react41.useCallback)(
          (data2, index) => {
            if (onDataPointClick && validatedData[index]) {
              onDataPointClick(validatedData[index], index);
            }
          },
          [onDataPointClick, validatedData]
        );
        const tooltipFormatter = (0, import_react41.useCallback)(
          (value, name) => {
            try {
              const numValue = typeof value === "number" ? value : parseFloat(String(value));
              if (isNaN(numValue)) {
                return ["Invalid", name];
              }
              return [`$${numValue.toLocaleString()}`, name];
            } catch (error) {
              console.error("Revenue chart formatter error:", error);
              return ["Error", name];
            }
          },
          []
        );
        if (!validatedData || validatedData.length === 0) {
          return /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
            "div",
            {
              className: `w-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${safeClassName}`,
              style: { height },
              role: "img",
              "aria-label": "No revenue data available",
              tabIndex: 0,
              children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("p", { className: "text-gray-500 text-sm", children: "No revenue data available" })
            }
          );
        }
        return /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
          ErrorBoundary,
          {
            fallback: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
              "div",
              {
                className: "w-full flex items-center justify-center bg-red-50 border border-red-200 rounded-lg",
                style: { height },
                children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("p", { className: "text-red-600 text-sm", children: "Revenue chart failed to load" })
              }
            ),
            children: /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)(
              "figure",
              {
                className: `w-full ${safeClassName}`,
                style: { height },
                role: ARIA_ROLES.CHART_CONTAINER,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { id: descriptionId, className: "sr-only", children: chartDescription }),
                  /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { id: tableId, className: "sr-only", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("p", { children: "Data table alternative for screen readers:" }),
                    /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("p", { children: dataTableDescription })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
                    "div",
                    {
                      id: chartId,
                      role: ARIA_ROLES.CHART,
                      "aria-labelledby": descriptionId,
                      "aria-describedby": tableId,
                      tabIndex: 0,
                      className: "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded",
                      onFocus: () => {
                        if (isScreenReader) {
                          announceToScreenReader(chartDescription, "polite");
                        }
                      },
                      children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)(
                        import_recharts3.AreaChart,
                        {
                          data: validatedData,
                          margin: { top: 10, right: 30, left: 0, bottom: 0 },
                          onClick: handleDataPointClick,
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(ChartGradients2, {}),
                            /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.CartesianGrid, { strokeDasharray: "3 3", stroke: "#E5E7EB" }),
                            /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
                              import_recharts3.XAxis,
                              {
                                dataKey: "month",
                                axisLine: false,
                                tickLine: false,
                                tick: { fontSize: 12, fill: "#6B7280" }
                              }
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
                              import_recharts3.YAxis,
                              {
                                axisLine: false,
                                tickLine: false,
                                tick: { fontSize: 12, fill: "#6B7280" },
                                tickFormatter: (value) => {
                                  try {
                                    const num = typeof value === "number" ? value : parseFloat(String(value));
                                    return isNaN(num) ? "0" : `$${(num / 1e3).toFixed(0)}K`;
                                  } catch {
                                    return "0";
                                  }
                                }
                              }
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(CustomTooltip2, { formatter: tooltipFormatter }) }),
                            /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.Legend, {}),
                            /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
                              import_recharts3.Area,
                              {
                                type: "monotone",
                                dataKey: "revenue",
                                stroke: COLORS2.primary,
                                strokeWidth: 2,
                                fill: COLORS2.gradient.primary,
                                name: "Current Revenue",
                                onMouseEnter: handleMouseEnter,
                                onMouseLeave: handleMouseLeave
                              }
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
                              import_recharts3.Area,
                              {
                                type: "monotone",
                                dataKey: "previousYear",
                                stroke: COLORS2.secondary,
                                strokeWidth: 2,
                                fill: COLORS2.gradient.secondary,
                                name: "Previous Year"
                              }
                            )
                          ]
                        }
                      ) })
                    }
                  )
                ]
              }
            )
          }
        );
      },
      (prevProps, nextProps) => {
        return prevProps.height === nextProps.height && prevProps.className === nextProps.className && prevProps.onDataPointClick === nextProps.onDataPointClick && JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
      }
    );
    NetworkUsageChart2 = ({
      data,
      height = 250,
      className,
      onDataPointClick
    }) => {
      const validatedData = (0, import_react41.useMemo)(() => {
        try {
          return validateArray(networkUsageDataSchema, data);
        } catch (error) {
          console.error("NetworkUsageChart data validation failed:", error);
          return [];
        }
      }, [data]);
      const safeClassName = (0, import_react41.useMemo)(() => {
        return validateClassName(className);
      }, [className]);
      const handleDataPointClick = (0, import_react41.useCallback)(
        (data2, index) => {
          if (onDataPointClick && validatedData[index]) {
            onDataPointClick(validatedData[index], index);
          }
        },
        [onDataPointClick, validatedData]
      );
      const tooltipFormatter = (0, import_react41.useCallback)((value, name) => {
        try {
          const numValue = typeof value === "number" ? value : parseFloat(String(value));
          if (isNaN(numValue)) {
            return ["Invalid", name];
          }
          return [`${numValue}GB`, name];
        } catch (error) {
          console.error("Network usage chart formatter error:", error);
          return ["Error", name];
        }
      }, []);
      if (!validatedData || validatedData.length === 0) {
        return /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
          "div",
          {
            className: `w-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${safeClassName}`,
            style: { height },
            role: "img",
            "aria-label": "No network usage data available",
            children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("p", { className: "text-gray-500 text-sm", children: "No network usage data available" })
          }
        );
      }
      return /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
        ErrorBoundary,
        {
          fallback: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
            "div",
            {
              className: "w-full flex items-center justify-center bg-red-50 border border-red-200 rounded-lg",
              style: { height },
              children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("p", { className: "text-red-600 text-sm", children: "Network usage chart failed to load" })
            }
          ),
          children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: `w-full ${safeClassName}`, style: { height }, children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)(
            import_recharts3.BarChart,
            {
              data: validatedData,
              margin: { top: 20, right: 30, left: 20, bottom: 5 },
              onClick: handleDataPointClick,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.CartesianGrid, { strokeDasharray: "3 3", stroke: "#E5E7EB" }),
                /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
                  import_recharts3.XAxis,
                  {
                    dataKey: "hour",
                    axisLine: false,
                    tickLine: false,
                    tick: { fontSize: 12, fill: "#6B7280" }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
                  import_recharts3.YAxis,
                  {
                    axisLine: false,
                    tickLine: false,
                    tick: { fontSize: 12, fill: "#6B7280" },
                    tickFormatter: (value) => {
                      try {
                        const num = typeof value === "number" ? value : parseFloat(String(value));
                        return isNaN(num) ? "0GB" : `${num}GB`;
                      } catch {
                        return "0GB";
                      }
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(CustomTooltip2, { formatter: tooltipFormatter }) }),
                /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.Legend, {}),
                /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.Bar, { dataKey: "download", fill: COLORS2.primary, name: "Download", radius: [2, 2, 0, 0] }),
                /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.Bar, { dataKey: "upload", fill: COLORS2.secondary, name: "Upload", radius: [2, 2, 0, 0] })
              ]
            }
          ) }) })
        }
      );
    };
    ServiceStatusChart2 = ({
      data,
      height = 250,
      className,
      onDataPointClick
    }) => {
      const validatedData = (0, import_react41.useMemo)(() => {
        try {
          return validateArray(serviceStatusDataSchema, data);
        } catch (error) {
          console.error("ServiceStatusChart data validation failed:", error);
          return [];
        }
      }, [data]);
      const safeClassName = (0, import_react41.useMemo)(() => {
        return validateClassName(className);
      }, [className]);
      const getStatusColor2 = (0, import_react41.useCallback)((status) => {
        switch (status) {
          case "online":
            return COLORS2.success;
          case "maintenance":
            return COLORS2.warning;
          case "offline":
            return COLORS2.danger;
          default:
            return COLORS2.primary;
        }
      }, []);
      const [activeIndex, setActiveIndex] = (0, import_react41.useState)(null);
      const handleMouseEnter = (0, import_react41.useCallback)((...args) => {
        const index = typeof args[1] === "number" ? args[1] : null;
        if (index !== null) {
          setActiveIndex(index);
        }
      }, []);
      const handleMouseLeave = (0, import_react41.useCallback)(() => {
        setActiveIndex(null);
      }, []);
      const handleDataPointClick = (0, import_react41.useCallback)(
        (data2, index) => {
          if (onDataPointClick && validatedData[index]) {
            onDataPointClick(validatedData[index], index);
          }
        },
        [onDataPointClick, validatedData]
      );
      const tooltipFormatter = (0, import_react41.useCallback)((value, name) => {
        try {
          const numValue = typeof value === "number" ? value : parseFloat(String(value));
          if (isNaN(numValue)) {
            return ["Invalid", name];
          }
          return [`${numValue} services`, name];
        } catch (error) {
          console.error("Service status chart formatter error:", error);
          return ["Error", name];
        }
      }, []);
      if (!validatedData || validatedData.length === 0) {
        return /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
          "div",
          {
            className: `w-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${safeClassName}`,
            style: { height },
            role: "img",
            "aria-label": "No service status data available",
            children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("p", { className: "text-gray-500 text-sm", children: "No service status data available" })
          }
        );
      }
      return /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
        ErrorBoundary,
        {
          fallback: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
            "div",
            {
              className: "w-full flex items-center justify-center bg-red-50 border border-red-200 rounded-lg",
              style: { height },
              children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("p", { className: "text-red-600 text-sm", children: "Service status chart failed to load" })
            }
          ),
          children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: `w-full ${safeClassName}`, style: { height }, children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)(import_recharts3.PieChart, { onClick: handleDataPointClick, children: [
            /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
              import_recharts3.Pie,
              {
                data: validatedData,
                cx: "50%",
                cy: "50%",
                outerRadius: 80,
                innerRadius: 40,
                paddingAngle: 2,
                dataKey: "value",
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
                children: validatedData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
                  import_recharts3.Cell,
                  {
                    fill: getStatusColor2(entry.status),
                    stroke: index === activeIndex ? "#FFF" : "none",
                    strokeWidth: index === activeIndex ? 2 : 0
                  },
                  `cell-${index}`
                ))
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(CustomTooltip2, { formatter: tooltipFormatter }) }),
            /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.Legend, {})
          ] }) }) })
        }
      );
    };
    BandwidthChart2 = ({
      data,
      height = 200,
      className,
      onDataPointClick
    }) => {
      const validatedData = (0, import_react41.useMemo)(() => {
        try {
          return validateArray(bandwidthDataSchema, data);
        } catch (error) {
          console.error("BandwidthChart data validation failed:", error);
          return [];
        }
      }, [data]);
      const safeClassName = (0, import_react41.useMemo)(() => {
        return validateClassName(className);
      }, [className]);
      const handleDataPointClick = (0, import_react41.useCallback)(
        (data2, index) => {
          if (onDataPointClick && validatedData[index]) {
            onDataPointClick(validatedData[index], index);
          }
        },
        [onDataPointClick, validatedData]
      );
      const tooltipFormatter = (0, import_react41.useCallback)((value, name) => {
        try {
          const numValue = typeof value === "number" ? value : parseFloat(String(value));
          if (isNaN(numValue)) {
            return ["Invalid", name];
          }
          return [`${numValue}%`, name];
        } catch (error) {
          console.error("Bandwidth chart formatter error:", error);
          return ["Error", name];
        }
      }, []);
      if (!validatedData || validatedData.length === 0) {
        return /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
          "div",
          {
            className: `w-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${safeClassName}`,
            style: { height },
            role: "img",
            "aria-label": "No bandwidth data available",
            children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("p", { className: "text-gray-500 text-sm", children: "No bandwidth data available" })
          }
        );
      }
      return /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
        ErrorBoundary,
        {
          fallback: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
            "div",
            {
              className: "w-full flex items-center justify-center bg-red-50 border border-red-200 rounded-lg",
              style: { height },
              children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("p", { className: "text-red-600 text-sm", children: "Bandwidth chart failed to load" })
            }
          ),
          children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: `w-full ${safeClassName}`, style: { height }, children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)(
            import_recharts3.LineChart,
            {
              data: validatedData,
              margin: { top: 5, right: 30, left: 20, bottom: 5 },
              onClick: handleDataPointClick,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.CartesianGrid, { strokeDasharray: "3 3", stroke: "#E5E7EB" }),
                /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
                  import_recharts3.XAxis,
                  {
                    dataKey: "time",
                    axisLine: false,
                    tickLine: false,
                    tick: { fontSize: 12, fill: "#6B7280" }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
                  import_recharts3.YAxis,
                  {
                    axisLine: false,
                    tickLine: false,
                    tick: { fontSize: 12, fill: "#6B7280" },
                    tickFormatter: (value) => {
                      try {
                        const num = typeof value === "number" ? value : parseFloat(String(value));
                        return isNaN(num) ? "0%" : `${num}%`;
                      } catch {
                        return "0%";
                      }
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(CustomTooltip2, { formatter: tooltipFormatter }) }),
                /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_recharts3.Legend, {}),
                /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
                  import_recharts3.Line,
                  {
                    type: "monotone",
                    dataKey: "utilization",
                    stroke: COLORS2.primary,
                    strokeWidth: 3,
                    dot: { fill: COLORS2.primary, strokeWidth: 2, r: 4 },
                    activeDot: {
                      r: 6,
                      stroke: COLORS2.primary,
                      strokeWidth: 2,
                      fill: "#FFF"
                    },
                    name: "Bandwidth Utilization"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
                  import_recharts3.Line,
                  {
                    type: "monotone",
                    dataKey: "capacity",
                    stroke: COLORS2.danger,
                    strokeWidth: 2,
                    strokeDasharray: "5 5",
                    dot: false,
                    name: "Capacity Limit"
                  }
                )
              ]
            }
          ) }) })
        }
      );
    };
  }
});

// src/indicators/OptimizedStatusIndicators.tsx
var OptimizedStatusIndicators_exports = {};
__export(OptimizedStatusIndicators_exports, {
  OptimizedStatusBadge: () => OptimizedStatusBadge,
  OptimizedUptimeIndicator: () => OptimizedUptimeIndicator,
  statusBadgeVariants: () => statusBadgeVariants,
  statusDotVariants: () => statusDotVariants
});
var import_class_variance_authority13, import_react42, import_jsx_runtime44, statusBadgeVariants, statusDotVariants, OptimizedStatusBadge, OptimizedUptimeIndicator;
var init_OptimizedStatusIndicators = __esm({
  "src/indicators/OptimizedStatusIndicators.tsx"() {
    "use strict";
    "use client";
    import_class_variance_authority13 = require("class-variance-authority");
    import_react42 = require("react");
    init_cn();
    init_security();
    init_security();
    init_a11y();
    init_performance();
    init_ErrorBoundary();
    import_jsx_runtime44 = require("react/jsx-runtime");
    statusBadgeVariants = (0, import_class_variance_authority13.cva)(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
      {
        variants: {
          variant: {
            online: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 shadow-sm",
            offline: "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200 shadow-sm",
            maintenance: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border border-amber-200 shadow-sm",
            degraded: "bg-gradient-to-r from-orange-50 to-red-50 text-orange-800 border border-orange-200 shadow-sm",
            active: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200 shadow-sm",
            suspended: "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border border-gray-200 shadow-sm",
            pending: "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-800 border border-purple-200 shadow-sm",
            paid: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 shadow-sm",
            overdue: "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200 shadow-sm",
            processing: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200 shadow-sm",
            critical: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25",
            high: "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25",
            medium: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25",
            low: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25"
          },
          size: {
            sm: "px-2 py-1 text-xs",
            md: "px-3 py-1.5 text-sm",
            lg: "px-4 py-2 text-base"
          },
          animated: {
            true: "animate-pulse",
            false: ""
          }
        },
        defaultVariants: {
          variant: "active",
          size: "md",
          animated: false
        }
      }
    );
    statusDotVariants = (0, import_class_variance_authority13.cva)("rounded-full flex-shrink-0 transition-all duration-200", {
      variants: {
        status: {
          online: "bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-400/50",
          offline: "bg-gradient-to-r from-red-400 to-rose-500 shadow-lg shadow-red-400/50",
          maintenance: "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg shadow-amber-400/50",
          degraded: "bg-gradient-to-r from-orange-400 to-red-500 shadow-lg shadow-orange-400/50",
          active: "bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg shadow-blue-400/50",
          suspended: "bg-gradient-to-r from-gray-400 to-slate-500 shadow-lg shadow-gray-400/50",
          pending: "bg-gradient-to-r from-purple-400 to-indigo-500 shadow-lg shadow-purple-400/50",
          paid: "bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-400/50",
          overdue: "bg-gradient-to-r from-red-400 to-rose-500 shadow-lg shadow-red-400/50",
          processing: "bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg shadow-blue-400/50",
          critical: "bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-500/40",
          high: "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/40",
          medium: "bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/40",
          low: "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/40"
        },
        size: {
          sm: "w-2 h-2",
          md: "w-3 h-3",
          lg: "w-4 h-4"
        },
        pulse: {
          true: "animate-ping",
          false: ""
        }
      },
      defaultVariants: {
        status: "active",
        size: "md",
        pulse: false
      }
    });
    OptimizedStatusBadge = (0, import_react42.memo)(
      ({
        variant,
        size,
        animated,
        children,
        className,
        showDot = true,
        pulse = false,
        onClick,
        "aria-label": ariaLabel
      }) => {
        const { renderCount } = useRenderProfiler("OptimizedStatusBadge", {
          variant,
          size
        });
        const [isPressed, setIsPressed] = useThrottledState(false, 50);
        const [isFocused, setIsFocused, throttledIsFocused] = useThrottledState(false, 16);
        const prefersReducedMotion = useReducedMotion();
        const badgeId = (0, import_react42.useMemo)(() => generateId("status-badge"), []);
        const computedValues = (0, import_react42.useMemo)(() => {
          const safeClassName = validateClassName(className);
          const safeChildren = typeof children === "string" ? sanitizeText(children) : children;
          const validVariants = [
            "online",
            "offline",
            "maintenance",
            "degraded",
            "active",
            "suspended",
            "pending",
            "paid",
            "overdue",
            "processing",
            "critical",
            "high",
            "medium",
            "low"
          ];
          const isValidVariant = (value) => validVariants.includes(value);
          const safeVariant = variant && isValidVariant(variant) ? variant : "active";
          const textIndicator = COLOR_CONTRAST.TEXT_INDICATORS[safeVariant];
          const childText = typeof safeChildren === "string" ? safeChildren : "";
          const accessibleStatusText = generateStatusText(safeVariant, childText);
          return {
            safeClassName,
            safeChildren,
            safeVariant,
            accessibleStatusText,
            textIndicator
          };
        }, [className, children, variant]);
        const animationConfig = (0, import_react42.useMemo)(() => {
          const dotSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "md";
          return {
            shouldAnimate: animated && !prefersReducedMotion,
            shouldPulse: pulse && !prefersReducedMotion,
            dotSize
          };
        }, [animated, pulse, prefersReducedMotion, size]);
        const [, , debouncedClickHandler] = useDebouncedState(null, 150);
        const handleClick = (0, import_react42.useCallback)(() => {
          try {
            if (onClick) {
              setIsPressed(true);
              onClick();
              announceToScreenReader(
                `Status changed to ${computedValues.accessibleStatusText}`,
                "polite"
              );
              setTimeout(() => setIsPressed(false), 100);
            }
          } catch (error) {
            console.error("StatusBadge click handler error:", error);
          }
        }, [onClick, computedValues.accessibleStatusText, setIsPressed]);
        const handleKeyDown = (0, import_react42.useCallback)(
          (event) => {
            if (onClick && (event.key === "Enter" || event.key === " ")) {
              event.preventDefault();
              handleClick();
            }
          },
          [onClick, handleClick]
        );
        const handleFocus = (0, import_react42.useCallback)(() => setIsFocused(true), [setIsFocused]);
        const handleBlur = (0, import_react42.useCallback)(() => setIsFocused(false), [setIsFocused]);
        return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(
          ErrorBoundary,
          {
            fallback: /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(
              "span",
              {
                className: "inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs",
                role: "status",
                "aria-label": "Status indicator error",
                children: "Status Error"
              }
            ),
            children: /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)(
              "span",
              {
                id: badgeId,
                className: cn(
                  statusBadgeVariants({
                    variant: computedValues.safeVariant,
                    size,
                    animated: animationConfig.shouldAnimate
                  }),
                  computedValues.safeClassName,
                  // Focus styles with throttled state
                  onClick && throttledIsFocused && "ring-2 ring-offset-2 ring-blue-500",
                  onClick && isPressed && "scale-95 transform",
                  onClick && "cursor-pointer transition-transform duration-75",
                  "transition-all duration-200 ease-in-out"
                ),
                onClick: onClick ? handleClick : void 0,
                onKeyDown: onClick ? handleKeyDown : void 0,
                onFocus: onClick ? handleFocus : void 0,
                onBlur: onClick ? handleBlur : void 0,
                role: onClick ? "button" : ARIA_ROLES.STATUS_INDICATOR,
                "aria-label": ariaLabel || computedValues.accessibleStatusText,
                "aria-describedby": onClick ? `${badgeId}-description` : void 0,
                tabIndex: onClick ? 0 : -1,
                "data-status": computedValues.safeVariant,
                "data-render-count": renderCount,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("span", { className: "sr-only", children: computedValues.accessibleStatusText }),
                  showDot && /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(
                    "span",
                    {
                      className: cn(
                        statusDotVariants({
                          status: computedValues.safeVariant,
                          size: animationConfig.dotSize,
                          pulse: animationConfig.shouldPulse
                        })
                      ),
                      "aria-hidden": "true"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("span", { className: "font-medium", "aria-hidden": "true", children: computedValues.textIndicator?.split(" ")[0] || "\u25CF" }),
                    computedValues.safeChildren
                  ] }),
                  onClick && /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("span", { id: `${badgeId}-description`, className: "sr-only", children: "Press Enter or Space to interact with this status indicator" })
                ]
              }
            )
          }
        );
      },
      (prevProps, nextProps) => {
        return prevProps.variant === nextProps.variant && prevProps.size === nextProps.size && prevProps.animated === nextProps.animated && prevProps.showDot === nextProps.showDot && prevProps.pulse === nextProps.pulse && prevProps.className === nextProps.className && prevProps.onClick === nextProps.onClick && prevProps["aria-label"] === nextProps["aria-label"] && (typeof prevProps.children === "string" && typeof nextProps.children === "string" ? prevProps.children === nextProps.children : prevProps.children === nextProps.children);
      }
    );
    OptimizedUptimeIndicator = (0, import_react42.memo)(
      ({ uptime, className, showLabel = true, "aria-label": ariaLabel }) => {
        const { renderCount } = useRenderProfiler("OptimizedUptimeIndicator", {
          uptime
        });
        const [animatedUptime, setAnimatedUptime] = useThrottledState(uptime, 100);
        const animationRef = (0, import_react42.useRef)();
        (0, import_react42.useEffect)(() => {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
          const startTime = performance.now();
          const startValue = animatedUptime;
          const duration = 1e3;
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (uptime - startValue) * easeOutCubic;
            setAnimatedUptime(currentValue);
            if (progress < 1) {
              animationRef.current = requestAnimationFrame(animate);
            }
          };
          animationRef.current = requestAnimationFrame(animate);
          return () => {
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
            }
          };
        }, [uptime, animatedUptime, setAnimatedUptime]);
        const computedValues = (0, import_react42.useMemo)(() => {
          let validatedUptime;
          try {
            validatedUptime = validateData(uptimeSchema, uptime);
          } catch (error) {
            console.error("Invalid uptime value:", error);
            validatedUptime = 0;
          }
          const safeClassName = validateClassName(className);
          let uptimeStatus;
          if (validatedUptime >= 99.9) {
            uptimeStatus = {
              status: "excellent",
              color: "text-green-600",
              bg: "bg-green-500",
              label: "Excellent"
            };
          } else if (validatedUptime >= 99.5) {
            uptimeStatus = {
              status: "good",
              color: "text-blue-600",
              bg: "bg-blue-500",
              label: "Good"
            };
          } else if (validatedUptime >= 98) {
            uptimeStatus = {
              status: "fair",
              color: "text-yellow-600",
              bg: "bg-yellow-500",
              label: "Fair"
            };
          } else {
            uptimeStatus = {
              status: "poor",
              color: "text-red-600",
              bg: "bg-red-500",
              label: "Poor"
            };
          }
          const progressWidth = `${Math.min(Math.max(validatedUptime, 0), 100)}%`;
          return {
            validatedUptime,
            safeClassName,
            uptimeStatus,
            progressWidth
          };
        }, [uptime, className]);
        (0, import_react42.useEffect)(() => {
          return () => {
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
            }
          };
        }, []);
        return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(
          ErrorBoundary,
          {
            fallback: /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("div", { className: "flex items-center space-x-2 p-2 bg-gray-100 rounded text-sm text-gray-600", children: /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("span", { children: "Uptime data unavailable" }) }),
            children: /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(
              "div",
              {
                className: cn("flex items-center space-x-3", computedValues.safeClassName),
                role: "progressbar",
                "aria-valuenow": computedValues.validatedUptime,
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                "aria-label": ariaLabel || `Service uptime: ${computedValues.validatedUptime.toFixed(2)}% - ${computedValues.uptimeStatus.label}`,
                "data-render-count": renderCount,
                children: /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("div", { className: "flex-1", children: [
                  showLabel && /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Uptime" }),
                    /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("span", { className: cn("text-sm font-bold", computedValues.uptimeStatus.color), children: [
                      animatedUptime.toFixed(2),
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(
                    "div",
                    {
                      className: cn(
                        "h-2 rounded-full transition-all duration-300 ease-out",
                        computedValues.uptimeStatus.bg
                      ),
                      style: { width: computedValues.progressWidth },
                      "aria-hidden": "true"
                    }
                  ) })
                ] })
              }
            )
          }
        );
      },
      (prevProps, nextProps) => {
        return prevProps.uptime === nextProps.uptime && prevProps.className === nextProps.className && prevProps.showLabel === nextProps.showLabel && prevProps["aria-label"] === nextProps["aria-label"];
      }
    );
  }
});

// src/indicators/StatusIndicators.tsx
var StatusIndicators_exports = {};
__export(StatusIndicators_exports, {
  AlertSeverityIndicator: () => AlertSeverityIndicator,
  NetworkPerformanceIndicator: () => NetworkPerformanceIndicator,
  ServiceTierIndicator: () => ServiceTierIndicator,
  StatusBadge: () => StatusBadge,
  StatusIndicators: () => StatusIndicators,
  UptimeIndicator: () => UptimeIndicator,
  statusBadgeVariants: () => statusBadgeVariants2,
  statusDotVariants: () => statusDotVariants2
});
var import_class_variance_authority14, import_react43, import_jsx_runtime45, statusBadgeVariants2, statusDotVariants2, StatusBadge, UptimeIndicator, NetworkPerformanceIndicator, ServiceTierIndicator, AlertSeverityIndicator, StatusIndicators;
var init_StatusIndicators = __esm({
  "src/indicators/StatusIndicators.tsx"() {
    "use strict";
    "use client";
    import_class_variance_authority14 = require("class-variance-authority");
    import_react43 = require("react");
    init_security();
    init_security();
    init_a11y();
    init_ErrorBoundary();
    init_cn();
    import_jsx_runtime45 = require("react/jsx-runtime");
    statusBadgeVariants2 = (0, import_class_variance_authority14.cva)(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
      {
        variants: {
          variant: {
            // Network Status
            online: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 shadow-sm",
            offline: "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200 shadow-sm",
            maintenance: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border border-amber-200 shadow-sm",
            degraded: "bg-gradient-to-r from-orange-50 to-red-50 text-orange-800 border border-orange-200 shadow-sm",
            // Service Status
            active: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200 shadow-sm",
            suspended: "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border border-gray-200 shadow-sm",
            pending: "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-800 border border-purple-200 shadow-sm",
            // Payment Status
            paid: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 shadow-sm",
            overdue: "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200 shadow-sm",
            processing: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200 shadow-sm",
            // Priority Levels
            critical: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25",
            high: "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25",
            medium: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25",
            low: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25"
          },
          size: {
            sm: "px-2 py-1 text-xs",
            md: "px-3 py-1.5 text-sm",
            lg: "px-4 py-2 text-base"
          },
          animated: {
            true: "animate-pulse",
            false: ""
          }
        },
        defaultVariants: {
          variant: "active",
          size: "md",
          animated: false
        }
      }
    );
    statusDotVariants2 = (0, import_class_variance_authority14.cva)("rounded-full flex-shrink-0 transition-all duration-200", {
      variants: {
        status: {
          online: "bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-400/50",
          offline: "bg-gradient-to-r from-red-400 to-rose-500 shadow-lg shadow-red-400/50",
          maintenance: "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg shadow-amber-400/50",
          degraded: "bg-gradient-to-r from-orange-400 to-red-500 shadow-lg shadow-orange-400/50",
          active: "bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg shadow-blue-400/50",
          suspended: "bg-gradient-to-r from-gray-400 to-slate-500 shadow-lg shadow-gray-400/50",
          pending: "bg-gradient-to-r from-purple-400 to-indigo-500 shadow-lg shadow-purple-400/50",
          paid: "bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-400/40",
          overdue: "bg-gradient-to-r from-red-400 to-rose-500 shadow-lg shadow-red-400/40",
          processing: "bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg shadow-blue-400/40",
          critical: "bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-500/40",
          high: "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/40",
          medium: "bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/40",
          low: "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/40"
        },
        size: {
          sm: "w-2 h-2",
          md: "w-3 h-3",
          lg: "w-4 h-4"
        },
        pulse: {
          true: "animate-ping",
          false: ""
        }
      },
      defaultVariants: {
        status: "active",
        size: "md",
        pulse: false
      }
    });
    StatusBadge = ({
      variant,
      size,
      animated,
      children,
      className,
      showDot = true,
      pulse = false,
      onClick,
      "aria-label": ariaLabel
    }) => {
      const prefersReducedMotion = useReducedMotion();
      const badgeId = (0, import_react43.useMemo)(() => generateId("status-badge"), []);
      const safeClassName = (0, import_react43.useMemo)(() => {
        return validateClassName(className);
      }, [className]);
      const safeChildren = (0, import_react43.useMemo)(() => {
        if (typeof children === "string") {
          return sanitizeText(children);
        }
        return children;
      }, [children]);
      const safeVariant = (0, import_react43.useMemo)(() => {
        const validVariants = [
          "online",
          "offline",
          "maintenance",
          "degraded",
          "active",
          "suspended",
          "pending",
          "paid",
          "overdue",
          "processing",
          "critical",
          "high",
          "medium",
          "low"
        ];
        const isValidVariant = (value) => validVariants.includes(value);
        return variant && isValidVariant(variant) ? variant : "active";
      }, [variant]);
      const accessibleStatusText = (0, import_react43.useMemo)(() => {
        const textIndicator = COLOR_CONTRAST.TEXT_INDICATORS[safeVariant];
        const childText = typeof safeChildren === "string" ? safeChildren : "";
        return generateStatusText(safeVariant, childText);
      }, [safeVariant, safeChildren]);
      const handleClick = (0, import_react43.useCallback)(() => {
        try {
          if (onClick) {
            onClick();
            announceToScreenReader(`Status changed to ${accessibleStatusText}`, "polite");
          }
        } catch (error) {
          console.error("StatusBadge click handler error:", error);
        }
      }, [onClick, accessibleStatusText]);
      const handleKeyDown = (0, import_react43.useCallback)(
        (event) => {
          if (onClick && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            handleClick();
          }
        },
        [onClick, handleClick]
      );
      const dotSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "md";
      const shouldAnimate = animated && !prefersReducedMotion;
      const shouldPulse = pulse && !prefersReducedMotion;
      return /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
        ErrorBoundary,
        {
          fallback: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
            "span",
            {
              className: "inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs",
              role: "status",
              "aria-label": "Status indicator error",
              children: "Status Error"
            }
          ),
          children: /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(
            "span",
            {
              id: badgeId,
              className: cn(
                statusBadgeVariants2({
                  variant: safeVariant,
                  size,
                  animated: shouldAnimate
                }),
                safeClassName,
                // Focus styles for accessibility
                onClick && "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer",
                "transition-all duration-200 ease-in-out"
              ),
              onClick: onClick ? handleClick : void 0,
              onKeyDown: onClick ? handleKeyDown : void 0,
              role: onClick ? "button" : ARIA_ROLES.STATUS_INDICATOR,
              "aria-label": ariaLabel || accessibleStatusText,
              "aria-describedby": onClick ? `${badgeId}-description` : void 0,
              tabIndex: onClick ? 0 : -1,
              "data-status": safeVariant,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "sr-only", children: accessibleStatusText }),
                showDot && /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
                  "span",
                  {
                    className: cn(
                      statusDotVariants2({
                        status: safeVariant,
                        size: dotSize,
                        pulse: shouldPulse
                      })
                    ),
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "font-medium", "aria-hidden": "true", children: COLOR_CONTRAST.TEXT_INDICATORS[safeVariant]?.split(" ")[0] || "\u25CF" }),
                  safeChildren
                ] }),
                onClick && /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { id: `${badgeId}-description`, className: "sr-only", children: "Press Enter or Space to interact with this status indicator" })
              ]
            }
          )
        }
      );
    };
    UptimeIndicator = ({
      uptime,
      className,
      showLabel = true,
      "aria-label": ariaLabel
    }) => {
      const validatedUptime = (0, import_react43.useMemo)(() => {
        try {
          return validateData(uptimeSchema, uptime);
        } catch (error) {
          console.error("Invalid uptime value:", error);
          return 0;
        }
      }, [uptime]);
      const safeClassName = (0, import_react43.useMemo)(() => {
        return validateClassName(className);
      }, [className]);
      const uptimeStatus = (0, import_react43.useMemo)(() => {
        const percentage = validatedUptime;
        if (percentage >= 99.9) {
          return {
            status: "excellent",
            color: "text-green-600",
            bg: "bg-green-500",
            label: "Excellent"
          };
        }
        if (percentage >= 99.5) {
          return {
            status: "good",
            color: "text-blue-600",
            bg: "bg-blue-500",
            label: "Good"
          };
        }
        if (percentage >= 98) {
          return {
            status: "fair",
            color: "text-yellow-600",
            bg: "bg-yellow-500",
            label: "Fair"
          };
        }
        return {
          status: "poor",
          color: "text-red-600",
          bg: "bg-red-500",
          label: "Poor"
        };
      }, [validatedUptime]);
      const progressWidth = (0, import_react43.useMemo)(() => {
        const width = Math.min(Math.max(validatedUptime, 0), 100);
        return `${width}%`;
      }, [validatedUptime]);
      return /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
        ErrorBoundary,
        {
          fallback: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "flex items-center space-x-2 p-2 bg-gray-100 rounded text-sm text-gray-600", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { children: "Uptime data unavailable" }) }),
          children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
            "div",
            {
              className: cn("flex items-center space-x-3", safeClassName),
              role: "progressbar",
              "aria-valuenow": validatedUptime,
              "aria-valuemin": 0,
              "aria-valuemax": 100,
              "aria-label": ariaLabel || `Service uptime: ${validatedUptime.toFixed(2)}% - ${uptimeStatus.label}`,
              children: /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "flex-1", children: [
                showLabel && /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Uptime" }),
                  /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("span", { className: cn("text-sm font-bold", uptimeStatus.color), children: [
                    validatedUptime.toFixed(2),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
                  "div",
                  {
                    className: cn("h-2 rounded-full transition-all duration-300", uptimeStatus.bg),
                    style: { width: progressWidth },
                    "aria-hidden": "true"
                  }
                ) })
              ] })
            }
          )
        }
      );
    };
    NetworkPerformanceIndicator = ({
      latency,
      packetLoss,
      bandwidth,
      className,
      onMetricClick
    }) => {
      const validatedMetrics = (0, import_react43.useMemo)(() => {
        try {
          return validateData(networkMetricsSchema, {
            latency,
            packetLoss,
            bandwidth
          });
        } catch (error) {
          console.error("Invalid network metrics:", error);
          return { latency: 0, packetLoss: 0, bandwidth: 0 };
        }
      }, [latency, packetLoss, bandwidth]);
      const safeClassName = (0, import_react43.useMemo)(() => {
        return validateClassName(className);
      }, [className]);
      const networkStatus = (0, import_react43.useMemo)(() => {
        const { latency: lat, packetLoss: loss, bandwidth: bw } = validatedMetrics;
        let latencyStatus;
        let latencyVariant;
        if (lat < 20) {
          latencyStatus = "excellent";
          latencyVariant = "online";
        } else if (lat < 50) {
          latencyStatus = "good";
          latencyVariant = "active";
        } else if (lat < 100) {
          latencyStatus = "fair";
          latencyVariant = "maintenance";
        } else {
          latencyStatus = "poor";
          latencyVariant = "offline";
        }
        let packetLossStatus;
        let packetLossVariant;
        if (loss < 0.01) {
          packetLossStatus = "excellent";
          packetLossVariant = "online";
        } else if (loss < 0.1) {
          packetLossStatus = "good";
          packetLossVariant = "active";
        } else if (loss < 1) {
          packetLossStatus = "fair";
          packetLossVariant = "maintenance";
        } else {
          packetLossStatus = "poor";
          packetLossVariant = "offline";
        }
        let bandwidthStatus;
        let bandwidthVariant;
        if (bw > 80) {
          bandwidthStatus = "high";
          bandwidthVariant = "online";
        } else if (bw > 50) {
          bandwidthStatus = "medium";
          bandwidthVariant = "maintenance";
        } else {
          bandwidthStatus = "low";
          bandwidthVariant = "offline";
        }
        return {
          latency: {
            value: lat,
            status: latencyStatus,
            variant: latencyVariant
          },
          packetLoss: {
            value: loss,
            status: packetLossStatus,
            variant: packetLossVariant
          },
          bandwidth: {
            value: bw,
            status: bandwidthStatus,
            variant: bandwidthVariant
          }
        };
      }, [validatedMetrics]);
      const handleLatencyClick = (0, import_react43.useCallback)(() => {
        try {
          if (onMetricClick) {
            onMetricClick("latency");
          }
        } catch (error) {
          console.error("Latency click handler error:", error);
        }
      }, [onMetricClick]);
      const handlePacketLossClick = (0, import_react43.useCallback)(() => {
        try {
          if (onMetricClick) {
            onMetricClick("packetLoss");
          }
        } catch (error) {
          console.error("Packet loss click handler error:", error);
        }
      }, [onMetricClick]);
      const handleBandwidthClick = (0, import_react43.useCallback)(() => {
        try {
          if (onMetricClick) {
            onMetricClick("bandwidth");
          }
        } catch (error) {
          console.error("Bandwidth click handler error:", error);
        }
      }, [onMetricClick]);
      return /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
        ErrorBoundary,
        {
          fallback: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded text-sm text-gray-600", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { children: "Network metrics unavailable" }) }),
          children: /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(
            "div",
            {
              className: cn("grid grid-cols-3 gap-4", safeClassName),
              role: "group",
              "aria-label": "Network performance metrics",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "text-center", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "flex items-center justify-center mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(
                    StatusBadge,
                    {
                      variant: networkStatus.latency.variant,
                      size: "sm",
                      showDot: true,
                      pulse: networkStatus.latency.value > 100,
                      ...onMetricClick ? { onClick: handleLatencyClick } : {},
                      "aria-label": `Latency: ${networkStatus.latency.value}ms - ${networkStatus.latency.status}`,
                      children: [
                        networkStatus.latency.value,
                        "ms"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("p", { className: "text-xs text-gray-600", children: "Latency" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "text-center", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "flex items-center justify-center mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(
                    StatusBadge,
                    {
                      variant: networkStatus.packetLoss.variant,
                      size: "sm",
                      showDot: true,
                      pulse: networkStatus.packetLoss.value > 1,
                      ...onMetricClick ? { onClick: handlePacketLossClick } : {},
                      "aria-label": `Packet Loss: ${networkStatus.packetLoss.value}% - ${networkStatus.packetLoss.status}`,
                      children: [
                        networkStatus.packetLoss.value,
                        "%"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("p", { className: "text-xs text-gray-600", children: "Packet Loss" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "text-center", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "flex items-center justify-center mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(
                    StatusBadge,
                    {
                      variant: networkStatus.bandwidth.variant,
                      size: "sm",
                      showDot: true,
                      ...onMetricClick ? { onClick: handleBandwidthClick } : {},
                      "aria-label": `Bandwidth: ${networkStatus.bandwidth.value}% - ${networkStatus.bandwidth.status}`,
                      children: [
                        networkStatus.bandwidth.value,
                        "%"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("p", { className: "text-xs text-gray-600", children: "Bandwidth" })
                ] })
              ]
            }
          )
        }
      );
    };
    ServiceTierIndicator = ({
      tier,
      className,
      onClick,
      "aria-label": ariaLabel
    }) => {
      const validatedTier = (0, import_react43.useMemo)(() => {
        try {
          return validateData(serviceTierSchema, tier);
        } catch (error) {
          console.error("Invalid service tier:", error);
          return "basic";
        }
      }, [tier]);
      const safeClassName = (0, import_react43.useMemo)(() => {
        return validateClassName(className);
      }, [className]);
      const tierConfig = (0, import_react43.useMemo)(
        () => ({
          basic: {
            label: "Basic",
            variant: "low",
            icon: "\u{1F949}",
            description: "Basic service tier"
          },
          standard: {
            label: "Standard",
            variant: "medium",
            icon: "\u{1F948}",
            description: "Standard service tier"
          },
          premium: {
            label: "Premium",
            variant: "high",
            icon: "\u{1F947}",
            description: "Premium service tier"
          },
          enterprise: {
            label: "Enterprise",
            variant: "critical",
            icon: "\u{1F451}",
            description: "Enterprise service tier"
          }
        }),
        []
      );
      const config = tierConfig[validatedTier] ?? tierConfig.basic;
      const handleClick = (0, import_react43.useCallback)(() => {
        try {
          if (onClick) {
            onClick();
          }
        } catch (error) {
          console.error("Service tier click handler error:", error);
        }
      }, [onClick]);
      return /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
        ErrorBoundary,
        {
          fallback: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "flex items-center space-x-2 p-2 bg-gray-100 rounded text-sm text-gray-600", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { children: "Service tier unavailable" }) }),
          children: /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(
            "div",
            {
              className: cn("flex items-center space-x-2", safeClassName),
              onClick: onClick ? handleClick : void 0,
              role: onClick ? "button" : "status",
              "aria-label": ariaLabel || `Service tier: ${config.label} - ${config.description}`,
              tabIndex: onClick ? 0 : void 0,
              onKeyDown: onClick ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick();
                }
              } : void 0,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "text-lg", "aria-hidden": "true", children: config.icon }),
                /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(StatusBadge, { variant: config.variant, size: "md", children: config.label })
              ]
            }
          )
        }
      );
    };
    AlertSeverityIndicator = ({
      severity,
      message,
      timestamp,
      className,
      onDismiss,
      "aria-label": ariaLabel
    }) => {
      const validatedSeverity = (0, import_react43.useMemo)(() => {
        try {
          return validateData(alertSeveritySchema, severity);
        } catch (error) {
          console.error("Invalid alert severity:", error);
          return "info";
        }
      }, [severity]);
      const safeMessage = (0, import_react43.useMemo)(() => {
        return sanitizeText(message || "No message provided");
      }, [message]);
      const safeClassName = (0, import_react43.useMemo)(() => {
        return validateClassName(className);
      }, [className]);
      const severityConfig = (0, import_react43.useMemo)(
        () => ({
          info: {
            variant: "active",
            icon: "\u2139\uFE0F",
            bg: "bg-blue-50",
            border: "border-blue-200",
            textColor: "text-blue-900",
            description: "Information alert"
          },
          warning: {
            variant: "maintenance",
            icon: "\u26A0\uFE0F",
            bg: "bg-amber-50",
            border: "border-amber-200",
            textColor: "text-amber-900",
            description: "Warning alert"
          },
          error: {
            variant: "offline",
            icon: "\u274C",
            bg: "bg-red-50",
            border: "border-red-200",
            textColor: "text-red-900",
            description: "Error alert"
          },
          critical: {
            variant: "critical",
            icon: "\u{1F6A8}",
            bg: "bg-red-50",
            border: "border-red-200",
            textColor: "text-red-900",
            description: "Critical alert"
          }
        }),
        []
      );
      const config = severityConfig[validatedSeverity] ?? severityConfig.info;
      const handleDismiss = (0, import_react43.useCallback)(() => {
        try {
          if (onDismiss) {
            onDismiss();
          }
        } catch (error) {
          console.error("Alert dismiss handler error:", error);
        }
      }, [onDismiss]);
      const formattedTimestamp = (0, import_react43.useMemo)(() => {
        if (!timestamp) return null;
        try {
          return timestamp.toLocaleString();
        } catch (error) {
          console.error("Timestamp formatting error:", error);
          return "Invalid timestamp";
        }
      }, [timestamp]);
      return /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
        ErrorBoundary,
        {
          fallback: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { children: "Alert information unavailable" }) }),
          children: /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(
            "div",
            {
              className: cn(
                "flex items-start space-x-3 p-4 rounded-lg border",
                config.bg,
                config.border,
                safeClassName
              ),
              role: "alert",
              "aria-live": validatedSeverity === "critical" ? "assertive" : "polite",
              "aria-label": ariaLabel || `${config.description}: ${safeMessage}`,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(
                  StatusBadge,
                  {
                    variant: config.variant,
                    size: "sm",
                    pulse: validatedSeverity === "critical",
                    showDot: true,
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "mr-1", "aria-hidden": "true", children: config.icon }),
                      validatedSeverity.toUpperCase()
                    ]
                  }
                ) }),
                /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("p", { className: cn("text-sm font-medium", config.textColor), children: safeMessage }),
                  formattedTimestamp && /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
                    "p",
                    {
                      className: "text-xs text-gray-500 mt-1",
                      "aria-label": `Alert time: ${formattedTimestamp}`,
                      children: formattedTimestamp
                    }
                  )
                ] }),
                onDismiss && /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
                  "button",
                  {
                    onClick: handleDismiss,
                    className: "flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded",
                    "aria-label": "Dismiss alert",
                    type: "button",
                    children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "text-lg", "aria-hidden": "true", children: "\xD7" })
                  }
                )
              ]
            }
          )
        }
      );
    };
    StatusIndicators = ({
      showLabel = true,
      label,
      children,
      status,
      size,
      animated,
      className,
      showDot,
      pulse,
      onClick,
      "aria-label": ariaLabel
    }) => /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(
      StatusBadge,
      {
        variant: status,
        ...size ? { size } : {},
        ...animated !== void 0 ? { animated } : {},
        ...className ? { className } : {},
        ...showDot !== void 0 ? { showDot } : {},
        ...pulse !== void 0 ? { pulse } : {},
        ...onClick ? { onClick } : {},
        ...ariaLabel ? { "aria-label": ariaLabel } : {},
        children: [
          showLabel ? label ?? status.replace(/_/g, " ").toUpperCase() : null,
          children
        ]
      }
    );
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ARIA_ROLES: () => ARIA_ROLES2,
  Alert: () => Alert,
  AlertDescription: () => AlertDescription,
  AlertTitle: () => AlertTitle,
  AnimatedCard: () => AnimatedCard,
  AnimatedCounter: () => AnimatedCounter,
  AnimatedProgressBar: () => AnimatedProgressBar,
  AreaChart: () => AreaChart2,
  BandwidthChart: () => BandwidthChart,
  BarChart: () => BarChart2,
  BaseRealTimeWidget: () => BaseRealTimeWidget,
  BottomSheet: () => BottomSheet,
  BounceIn: () => BounceIn,
  Breadcrumb: () => Breadcrumb,
  BreadcrumbEllipsis: () => BreadcrumbEllipsis,
  BreadcrumbItem: () => BreadcrumbItem,
  BreadcrumbLink: () => BreadcrumbLink,
  BreadcrumbPage: () => BreadcrumbPage,
  Button: () => Button,
  COLORS: () => COLORS,
  CSRFProvider: () => CSRFProvider,
  CSRFToken: () => CSRFToken,
  Card: () => Card,
  CardContent: () => CardContent,
  CardDescription: () => CardDescription,
  CardFooter: () => CardFooter,
  CardGridSkeleton: () => CardGridSkeleton,
  CardHeader: () => CardHeader,
  CardSkeleton: () => CardSkeleton,
  CardSkeletons: () => CardSkeletons,
  CardTitle: () => CardTitle,
  Center: () => Center,
  ChartContainer: () => ChartContainer,
  ChartGradients: () => ChartGradients,
  Checkbox: () => Checkbox,
  ComponentErrorBoundary: () => ErrorBoundary,
  CompositionDataTable: () => DataTable,
  ConfirmationModal: () => Modal,
  Container: () => Container,
  CustomerGrowthChart: () => CustomerGrowthChart,
  CustomerLocationMap: () => CustomerLocationMap,
  Dashboard: () => Dashboard,
  DashboardSkeleton: () => DashboardSkeleton,
  DashboardSkeletons: () => DashboardSkeletons,
  DataTable: () => DataTable2,
  Divider: () => Divider,
  Drawer: () => Sidebar,
  EnhancedTabNavigation: () => TabsNavigation,
  ErrorBoundary: () => ErrorBoundary2,
  FadeInWhenVisible: () => FadeInWhenVisible,
  Feedback: () => Feedback,
  FeedbackActions: () => FeedbackActions,
  FeedbackDescription: () => FeedbackDescription,
  FeedbackTitle: () => FeedbackTitle,
  FilePreview: () => FilePreview,
  FileUpload: () => FileUpload,
  FileValidationUtils: () => FileValidationUtils,
  FinancialChart: () => FinancialChart,
  Form: () => Form,
  FormDescription: () => FormDescription,
  FormField: () => FormField,
  FormItem: () => FormItem,
  FormLabel: () => FormLabel,
  FormMessage: () => FormMessage,
  FormModal: () => Modal,
  Grid: () => Grid,
  GridItem: () => GridItem,
  HStack: () => HStack,
  ISPBrandHeader: () => ISPBrandHeader,
  ISPColors: () => ISPColors,
  ISPGradients: () => ISPGradients,
  ISPIcons: () => ISPIcons,
  ISPThemeProvider: () => ISPThemeProvider,
  ISPThemeUtils: () => ISPThemeUtils,
  Input: () => Input,
  KEYS: () => KEYS,
  Layout: () => Layout,
  LayoutContent: () => LayoutContent,
  LayoutFooter: () => LayoutFooter,
  LayoutHeader: () => LayoutHeader,
  LayoutSidebar: () => LayoutSidebar,
  LazyCharts: () => LazyCharts,
  LazyStatusIndicators: () => LazyStatusIndicators,
  LeafletMap: () => LeafletMap,
  LineChart: () => LineChart2,
  Loading: () => Loading,
  LoadingDots: () => LoadingDots,
  LoadingSkeleton: () => LoadingSkeleton,
  MetricCard: () => MetricCard,
  MobileNavigation: () => MobileNavigation,
  Modal: () => Modal,
  ModalBackdrop: () => ModalBackdrop,
  ModalBody: () => ModalBody,
  ModalClose: () => Modal,
  ModalContent: () => ModalContent,
  ModalDescription: () => ModalDescription,
  ModalFocusUtils: () => ModalFocusUtils,
  ModalFooter: () => ModalFooter,
  ModalHeader: () => ModalHeader,
  ModalOverlay: () => Modal,
  ModalPortal: () => Modal,
  ModalProvider: () => Modal,
  ModalTitle: () => ModalTitle,
  ModalTrigger: () => ModalTrigger,
  Navbar: () => Navbar,
  Navigation: () => Navigation,
  NavigationItem: () => NavigationItem,
  NavigationLink: () => NavigationLink,
  NavigationMenu: () => NavigationMenu,
  NavigationProvider: () => NavigationProvider,
  NavigationTabItem: () => TabItem2,
  NavigationTabNavigation: () => TabNavigation2,
  NetworkDeviceWidget: () => NetworkDeviceWidget,
  NetworkOutageMap: () => NetworkOutageMap,
  NetworkStatusIndicator: () => NetworkStatusIndicator,
  NetworkTopologyMap: () => NetworkTopologyMap,
  NetworkUsageChart: () => NetworkUsageChart,
  NotificationBadge: () => NotificationBadge,
  NotificationList: () => NotificationList,
  NotificationProvider: () => NotificationProvider,
  OptimizedImage: () => OptimizedImage,
  OptimizedRevenueChart: () => OptimizedRevenueChart,
  OptimizedTooltip: () => OptimizedTooltip,
  PageTransition: () => PageTransition,
  PerformanceBudgets: () => PerformanceBudgets,
  PerformanceChart: () => PerformanceChart,
  PieChart: () => PieChart2,
  PortalBrand: () => PortalBrand,
  PreloadingStrategies: () => PreloadingStrategies,
  Progress: () => Progress,
  PulseIndicator: () => PulseIndicator,
  Radio: () => Radio2,
  RadioGroup: () => RadioGroup,
  RealTimeMetricsWidget: () => RealTimeMetricsWidget,
  ResponsiveSidebar: () => ResponsiveSidebar,
  RevenueChart: () => RevenueChart,
  Section: () => Section,
  Select: () => Select,
  ServiceCoverageMap: () => ServiceCoverageMap,
  ServiceHealthWidget: () => ServiceHealthWidget,
  ServiceStatusChart: () => ServiceStatusChart,
  ServiceTierBadge: () => ServiceTierBadge,
  Sidebar: () => Sidebar,
  SignalStrengthMap: () => SignalStrengthMap,
  Skeleton: () => Skeleton2,
  SkeletonCard: () => SkeletonCard,
  SkeletonDashboard: () => SkeletonDashboard,
  SkeletonTable: () => SkeletonTable,
  SkeletonText: () => SkeletonText,
  SlideIn: () => SlideIn,
  Slot: () => import_react_slot8.Slot,
  Spacer: () => Spacer,
  SpeedGauge: () => SpeedGauge,
  SplitPoints: () => SplitPoints,
  Stack: () => Stack,
  StaggerChild: () => StaggerChild,
  StaggeredFadeIn: () => StaggeredFadeIn,
  StatusIndicator: () => StatusIndicator,
  TabItem: () => TabItem,
  TabNavigation: () => TabNavigation,
  Table: () => Table,
  TableBody: () => TableBody,
  TableCaption: () => TableCaption,
  TableCell: () => TableCell,
  TableFooter: () => TableFooter,
  TableHead: () => TableHead,
  TableHeader: () => TableHeader,
  TableRow: () => TableRow,
  TableSkeleton: () => TableSkeleton,
  TableSkeletons: () => TableSkeletons,
  TechnicianRouteMap: () => TechnicianRouteMap,
  Textarea: () => Textarea2,
  ThemeAware: () => ThemeAware,
  TicketVolumeChart: () => TicketVolumeChart,
  Toast: () => Toast,
  ToastAction: () => ToastAction,
  ToastClose: () => ToastClose,
  ToastContent: () => ToastContent,
  ToastDescription: () => ToastDescription,
  ToastProvider: () => ToastProvider,
  ToastTitle: () => ToastTitle,
  ToastViewport: () => ToastViewport,
  TreeShakableUtils: () => TreeShakableUtils,
  TypingAnimation: () => TypingAnimation,
  UniversalActivityFeed: () => UniversalActivityFeed_default,
  UniversalChart: () => UniversalChart_default,
  UniversalDashboard: () => UniversalDashboard_default,
  UniversalDataTable: () => UniversalDataTable_default,
  UniversalHeader: () => UniversalHeader,
  UniversalKPISection: () => UniversalKPISection_default,
  UniversalLayout: () => UniversalLayout_default,
  UniversalMap: () => UniversalMap_default,
  UniversalMetricCard: () => UniversalMetricCard_default,
  UniversalThemeProvider: () => UniversalThemeProvider,
  UploadArea: () => UploadArea,
  UploadContent: () => UploadContent,
  VStack: () => VStack,
  VirtualizedDataTable: () => VirtualizedDataTable,
  VirtualizedTable: () => VirtualizedTable,
  addResourceHints: () => addResourceHints,
  adminTheme: () => adminTheme,
  alertSeveritySchema: () => alertSeveritySchema,
  analyzeBundleImpact: () => analyzeBundleImpact,
  analyzeBundleSize: () => analyzeBundleSize,
  applyTheme: () => applyTheme,
  bandwidthDataSchema: () => bandwidthDataSchema,
  bundleSplitConfig: () => bundleSplitConfig,
  buttonVariants: () => buttonVariants,
  cardContentVariants: () => cardContentVariants,
  cardDescriptionVariants: () => cardDescriptionVariants,
  cardFooterVariants: () => cardFooterVariants,
  cardHeaderVariants: () => cardHeaderVariants,
  cardTitleVariants: () => cardTitleVariants,
  cardVariants: () => cardVariants,
  chartDataSchema: () => chartDataSchema,
  chartUtils: () => chartUtils,
  clsx: () => import_clsx21.clsx,
  createDynamicImport: () => createDynamicImport,
  createMemoizedSelector: () => createMemoizedSelector,
  createPortalTheme: () => createPortalTheme,
  createValidationRules: () => createValidationRules,
  customerTheme: () => customerTheme,
  cva: () => import_class_variance_authority15.cva,
  defaultConfig: () => defaultConfig,
  defaultTheme: () => defaultTheme,
  exportPerformanceData: () => exportPerformanceData,
  generateBundleReport: () => generateBundleReport,
  generatePerformanceReport: () => generatePerformanceReport,
  getPerformanceRecommendations: () => getPerformanceRecommendations,
  inputVariants: () => inputVariants,
  isBrowser: () => isBrowser,
  isServer: () => isServer,
  networkMetricsSchema: () => networkMetricsSchema,
  networkUsageDataSchema: () => networkUsageDataSchema,
  resellerTheme: () => resellerTheme,
  revenueDataSchema: () => revenueDataSchema,
  safeDocument: () => safeDocument,
  safeWindow: () => safeWindow,
  sanitizeHtml: () => sanitizeHtml,
  sanitizeRichHtml: () => sanitizeRichHtml,
  sanitizeText: () => sanitizeText,
  serviceStatusDataSchema: () => serviceStatusDataSchema,
  serviceTierSchema: () => serviceTierSchema,
  themes: () => themes,
  toSafeIcon: () => toSafeIcon,
  toSafeIcons: () => toSafeIcons,
  uptimeSchema: () => uptimeSchema,
  useAriaExpanded: () => useAriaExpanded,
  useAriaSelection: () => useAriaSelection,
  useBrowserLayoutEffect: () => useBrowserLayoutEffect,
  useCSRF: () => useCSRF,
  useClientEffect: () => useClientEffect,
  useDebouncedState: () => useDebouncedState,
  useDeepMemo: () => useDeepMemo,
  useDragAndDrop: () => useDragAndDrop,
  useErrorHandler: () => useErrorHandler,
  useFileInput: () => useFileInput,
  useFocusTrap: () => useFocusTrap,
  useFormContext: () => useFormContext,
  useISPTheme: () => useISPTheme,
  useId: () => useId,
  useIsHydrated: () => useIsHydrated,
  useKeyboardNavigation: () => useKeyboardNavigation2,
  useLazyComponent: () => useLazyComponent,
  useLocalStorage: () => useLocalStorage,
  useMediaQuery: () => useMediaQuery,
  useMemoryMonitor: () => useMemoryMonitor,
  useModal: () => useModal,
  useModalContext: () => useModalContext,
  useModalState: () => useModalState,
  useNavigation: () => useNavigation,
  useNotifications: () => useNotifications,
  usePrefersReducedMotion: () => usePrefersReducedMotion,
  useRenderProfiler: () => useRenderProfiler,
  useScreenReaderAnnouncement: () => useScreenReaderAnnouncement,
  useSecureFetch: () => useSecureFetch,
  useSessionStorage: () => useSessionStorage,
  useThrottledState: () => useThrottledState,
  useToast: () => useToast,
  useUniversalTheme: () => useUniversalTheme,
  useUserPreferences: () => useUserPreferences,
  useVirtualizedList: () => useVirtualizedList,
  validateArray: () => validateArray,
  validateClassName: () => validateClassName,
  validateData: () => validateData,
  validationPatterns: () => validationPatterns,
  version: () => version,
  withCSRFProtection: () => withCSRFProtection,
  withErrorBoundary: () => withErrorBoundary
});
module.exports = __toCommonJS(index_exports);
var import_react_slot8 = require("@radix-ui/react-slot");
var import_class_variance_authority15 = require("class-variance-authority");
var import_clsx21 = require("clsx");

// src/composition/DataTable.tsx
var import_react = require("react");
var import_clsx = require("clsx");
var import_jsx_runtime = require("react/jsx-runtime");
function DataTable({
  data,
  columns,
  className,
  onRowClick,
  loading = false,
  emptyMessage = "No data available"
}) {
  const [sortBy, setSortBy] = (0, import_react.useState)(null);
  const [sortDirection, setSortDirection] = (0, import_react.useState)("asc");
  const sortedData = (0, import_react.useMemo)(() => {
    if (!sortBy) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortBy, sortDirection]);
  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnKey);
      setSortDirection("asc");
    }
  };
  if (loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex justify-center p-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" }) });
  }
  if (data.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-center py-8 text-gray-500", children: emptyMessage });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: (0, import_clsx.clsx)("overflow-x-auto", className), children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { className: "bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "th",
      {
        className: (0, import_clsx.clsx)(
          "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
          column.sortable && "cursor-pointer hover:bg-gray-100"
        ),
        onClick: column.sortable ? () => handleSort(column.key) : void 0,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center space-x-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: column.label }),
          column.sortable && sortBy === column.key && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-1", children: sortDirection === "asc" ? "\u2191" : "\u2193" })
        ] })
      },
      String(column.key)
    )) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: sortedData.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "tr",
      {
        className: (0, import_clsx.clsx)("hover:bg-gray-50", onRowClick && "cursor-pointer"),
        onClick: onRowClick ? () => onRowClick(item) : void 0,
        children: columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "td",
          {
            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
            children: column.render ? column.render(item[column.key], item) : String(item[column.key] || "")
          },
          String(column.key)
        ))
      },
      index
    )) })
  ] }) });
}

// src/data-display/Chart.tsx
var import_class_variance_authority = require("class-variance-authority");
var import_clsx2 = require("clsx");
var import_react2 = require("react");
var Recharts = __toESM(require("recharts"));
var import_jsx_runtime2 = require("react/jsx-runtime");
var ResponsiveContainer2 = Recharts.ResponsiveContainer ?? (({ children }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children }));
var RechartsLineChart = Recharts.LineChart ?? (({ children }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children }));
var RechartsBarChart = Recharts.BarChart ?? (({ children }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children }));
var RechartsAreaChart = Recharts.AreaChart ?? (({ children }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children }));
var RechartsPieChart = Recharts.PieChart ?? (({ children }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children }));
var CartesianGrid2 = Recharts.CartesianGrid ?? (() => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-testid": "cartesian-grid-fallback" }));
var XAxis2 = Recharts.XAxis ?? (({ dataKey }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-testid": "x-axis-fallback", "data-key": dataKey }));
var YAxis2 = Recharts.YAxis ?? (({ domain }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-testid": "y-axis-fallback", "data-domain": domain }));
var Tooltip2 = Recharts.Tooltip ?? (() => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-testid": "tooltip-fallback" }));
var Legend2 = Recharts.Legend ?? (() => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-testid": "legend-fallback" }));
var Line2 = Recharts.Line ?? (({ dataKey }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-testid": `line-fallback-${dataKey}` }));
var Bar2 = Recharts.Bar ?? (({ dataKey }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-testid": `bar-fallback-${dataKey}` }));
var Area2 = Recharts.Area ?? (({ dataKey }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-testid": `area-fallback-${dataKey}` }));
var Pie2 = Recharts.Pie ?? (({ dataKey }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-testid": `pie-fallback-${dataKey}` }));
var Cell2 = Recharts.Cell ?? (() => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-testid": "cell-fallback" }));
var chartVariants = (0, import_class_variance_authority.cva)("", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
      xl: ""
    },
    variant: {
      default: "",
      minimal: "",
      detailed: ""
    }
  },
  defaultVariants: {
    size: "md",
    variant: "default"
  }
});
function ChartHeader({
  title,
  description,
  actions
}) {
  if (!title && !description && !actions) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "chart-header", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "chart-header-content", children: [
      title ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h3", { className: "chart-title", children: title }) : null,
      description ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "chart-description", children: description }) : null
    ] }),
    actions ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "chart-actions", children: actions }) : null
  ] });
}
function ChartContent({
  loading,
  error,
  emptyText,
  children
}) {
  if (loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "chart-loading", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "loading-spinner" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "Loading chart data..." })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "chart-error", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "error-icon", children: "\u26A0" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
        "Error loading chart: ",
        error
      ] })
    ] });
  }
  if (!children) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "chart-empty", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "empty-icon", children: "\u{1F4CA}" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: emptyText })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children });
}
var ChartContainer = (0, import_react2.forwardRef)(
  ({
    className,
    loading,
    error,
    emptyText = "No data available",
    title,
    description,
    actions,
    children,
    ...props
  }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { ref, className: (0, import_clsx2.clsx)("chart-container", className), ...props, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        ChartHeader,
        {
          ...title !== void 0 ? { title } : {},
          ...description !== void 0 ? { description } : {},
          ...actions !== void 0 ? { actions } : {}
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "chart-content", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        ChartContent,
        {
          ...loading !== void 0 ? { loading } : {},
          ...error !== void 0 ? { error } : {},
          emptyText,
          children
        }
      ) })
    ] });
  }
);
function LineChart2({
  data,
  lines = [],
  width = "100%",
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  xAxisKey = "name",
  yAxisDomain,
  size,
  variant,
  className,
  loading,
  error,
  emptyText,
  title,
  description
}) {
  const containerMetaProps = {
    ...loading !== void 0 ? { loading } : {},
    ...error !== void 0 ? { error } : {},
    ...emptyText !== void 0 ? { emptyText } : {},
    ...title !== void 0 ? { title } : {},
    ...description !== void 0 ? { description } : {}
  };
  if (loading || error || data.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      ChartContainer,
      {
        className: (0, import_clsx2.clsx)(chartVariants({ size, variant }), className),
        ...containerMetaProps
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    ChartContainer,
    {
      className: (0, import_clsx2.clsx)(chartVariants({ size, variant }), className),
      ...containerMetaProps,
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ResponsiveContainer2, { width, height, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(RechartsLineChart, { data, children: [
        showGrid ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CartesianGrid2, { strokeDasharray: "3 3" }) : null,
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(XAxis2, { dataKey: xAxisKey }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(YAxis2, { ...yAxisDomain ? { domain: yAxisDomain } : {} }),
        showTooltip ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Tooltip2, {}) : null,
        showLegend ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Legend2, {}) : null,
        lines.map(
          ({ key, stroke, strokeWidth = 2, strokeDasharray, dot = true, activeDot = true }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            Line2,
            {
              type: "monotone",
              dataKey: key,
              stroke,
              strokeWidth,
              strokeDasharray,
              dot,
              activeDot
            },
            key
          )
        )
      ] }) })
    }
  );
}
function BarChart2({
  data,
  bars = [],
  width = "100%",
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  xAxisKey = "name",
  yAxisDomain,
  layout = "vertical",
  size,
  variant,
  className,
  loading,
  error,
  emptyText,
  title,
  description
}) {
  const containerMetaProps = {
    ...loading !== void 0 ? { loading } : {},
    ...error !== void 0 ? { error } : {},
    ...emptyText !== void 0 ? { emptyText } : {},
    ...title !== void 0 ? { title } : {},
    ...description !== void 0 ? { description } : {}
  };
  if (loading || error || data.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      ChartContainer,
      {
        className: (0, import_clsx2.clsx)(chartVariants({ size, variant }), className),
        ...containerMetaProps
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    ChartContainer,
    {
      className: (0, import_clsx2.clsx)(chartVariants({ size, variant }), className),
      ...containerMetaProps,
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ResponsiveContainer2, { width, height, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(RechartsBarChart, { data, layout, children: [
        showGrid ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CartesianGrid2, { strokeDasharray: "3 3" }) : null,
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(XAxis2, { dataKey: xAxisKey }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(YAxis2, { ...yAxisDomain ? { domain: yAxisDomain } : {} }),
        showTooltip ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Tooltip2, {}) : null,
        showLegend ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Legend2, {}) : null,
        bars.map(({ key, fill, stackId }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Bar2, { dataKey: key, fill, ...stackId ? { stackId } : {} }, key))
      ] }) })
    }
  );
}
function AreaChart2({
  data,
  areas = [],
  width = "100%",
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  xAxisKey = "name",
  yAxisDomain,
  size,
  variant,
  className,
  loading,
  error,
  emptyText,
  title,
  description
}) {
  const containerMetaProps = {
    ...loading !== void 0 ? { loading } : {},
    ...error !== void 0 ? { error } : {},
    ...emptyText !== void 0 ? { emptyText } : {},
    ...title !== void 0 ? { title } : {},
    ...description !== void 0 ? { description } : {}
  };
  if (loading || error || data.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      ChartContainer,
      {
        className: (0, import_clsx2.clsx)(chartVariants({ size, variant }), className),
        ...containerMetaProps
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    ChartContainer,
    {
      className: (0, import_clsx2.clsx)(chartVariants({ size, variant }), className),
      ...containerMetaProps,
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ResponsiveContainer2, { width, height, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(RechartsAreaChart, { data, children: [
        showGrid ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CartesianGrid2, { strokeDasharray: "3 3" }) : null,
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(XAxis2, { dataKey: xAxisKey }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(YAxis2, { ...yAxisDomain ? { domain: yAxisDomain } : {} }),
        showTooltip ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Tooltip2, {}) : null,
        showLegend ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Legend2, {}) : null,
        areas.map(({ key, stroke, fill, stackId }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          Area2,
          {
            type: "monotone",
            dataKey: key,
            stroke,
            fill,
            ...stackId ? { stackId } : {}
          },
          key
        ))
      ] }) })
    }
  );
}
function PieChart2({
  data,
  dataKey,
  nameKey = "name",
  colors = [],
  innerRadius = 0,
  outerRadius = 80,
  width = "100%",
  height = 300,
  showTooltip = true,
  showLegend = true,
  showLabels = true,
  size,
  variant,
  className,
  loading,
  error,
  emptyText,
  title,
  description
}) {
  const containerMetaProps = {
    ...loading !== void 0 ? { loading } : {},
    ...error !== void 0 ? { error } : {},
    ...emptyText !== void 0 ? { emptyText } : {},
    ...title !== void 0 ? { title } : {},
    ...description !== void 0 ? { description } : {}
  };
  if (loading || error || data.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      ChartContainer,
      {
        className: (0, import_clsx2.clsx)(chartVariants({ size, variant }), className),
        ...containerMetaProps
      }
    );
  }
  const defaultColors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#00ff00",
    "#0088fe",
    "#8dd1e1",
    "#d084d0",
    "#ffb347",
    "#87ceeb"
  ];
  const pieColors = colors.length > 0 ? colors : defaultColors;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    ChartContainer,
    {
      className: (0, import_clsx2.clsx)(chartVariants({ size, variant }), className),
      ...containerMetaProps,
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ResponsiveContainer2, { width, height, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(RechartsPieChart, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          Pie2,
          {
            data,
            dataKey,
            nameKey,
            cx: "50%",
            cy: "50%",
            innerRadius,
            outerRadius,
            fill: "#8884d8",
            label: showLabels,
            children: data.map((_entry, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Cell2, { fill: pieColors[index % pieColors.length] }, `cell-${index}`))
          }
        ),
        showTooltip ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Tooltip2, {}) : null,
        showLegend ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Legend2, {}) : null
      ] }) })
    }
  );
}
var MetricCard = (0, import_react2.forwardRef)(
  ({ className, title, value, subtitle, trend, icon, loading, size = "md", ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { ref, className: (0, import_clsx2.clsx)("metric-card", `size-${size}`, className), ...props, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "metric-header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "metric-title", children: title }),
        icon ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "metric-icon", children: icon }) : null
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "metric-content", children: loading ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "metric-loading", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "loading-skeleton" }) }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "metric-value", children: value }),
        trend ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: (0, import_clsx2.clsx)("metric-trend", `trend-${trend.direction}`), children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "trend-indicator", children: [
            trend.direction === "up" && "\u2197",
            trend.direction === "down" && "\u2198",
            trend.direction === "neutral" && "\u2192"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "trend-value", children: [
            Math.abs(trend.value),
            "%"
          ] })
        ] }) : null
      ] }) }),
      subtitle ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "metric-footer", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "metric-subtitle", children: subtitle }) }) : null
    ] });
  }
);
var chartUtils = {
  formatNumber: (value, options) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
      ...options
    }).format(value);
  },
  formatCurrency: (value, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1
    }).format(value);
  },
  formatPercentage: (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  },
  generateColors: (count, hue = 220, saturation = 70) => {
    return Array.from({ length: count }, (_, index) => {
      const lightness = 40 + index * 20 % 40;
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });
  }
};
ChartContainer.displayName = "ChartContainer";
MetricCard.displayName = "MetricCard";

// src/data-display/RealTimeWidget.tsx
var import_class_variance_authority2 = require("class-variance-authority");
var import_clsx3 = require("clsx");
var import_react3 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var widgetVariants = (0, import_class_variance_authority2.cva)("real-time-widget", {
  variants: {
    size: {
      sm: "widget-sm",
      md: "widget-md",
      lg: "widget-lg",
      xl: "widget-xl"
    },
    variant: {
      default: "widget-default",
      outlined: "widget-outlined",
      filled: "widget-filled",
      minimal: "widget-minimal"
    },
    status: {
      normal: "status-normal",
      warning: "status-warning",
      critical: "status-critical",
      offline: "status-offline"
    }
  },
  defaultVariants: {
    size: "md",
    variant: "default",
    status: "normal"
  }
});
function StatusIndicator({ status, pulse = false, size = "md" }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "div",
    {
      className: (0, import_clsx3.clsx)("status-indicator", `status-${status}`, `size-${size}`, {
        pulse
      }),
      title: status.charAt(0).toUpperCase() + status.slice(1),
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "status-dot" })
    }
  );
}
var BaseRealTimeWidget = (0, import_react3.forwardRef)(
  ({
    className,
    title,
    subtitle,
    refreshInterval = 30,
    onRefresh,
    loading = false,
    error,
    lastUpdated,
    actions,
    size,
    variant,
    status,
    children,
    ...props
  }, ref) => {
    const [timeLeft, setTimeLeft] = (0, import_react3.useState)(refreshInterval);
    const intervalRef = (0, import_react3.useRef)();
    (0, import_react3.useEffect)(() => {
      if (!onRefresh) {
        return;
      }
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onRefresh();
            return refreshInterval;
          }
          return prev - 1;
        });
      }, 1e3);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [refreshInterval, onRefresh]);
    const handleManualRefresh = () => {
      if (onRefresh) {
        onRefresh();
        setTimeLeft(refreshInterval);
      }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "div",
      {
        ref,
        className: (0, import_clsx3.clsx)(widgetVariants({ size, variant, status }), className),
        ...props,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "widget-header", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "widget-title-section", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { className: "widget-title", children: title }),
              subtitle ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "widget-subtitle", children: subtitle }) : null
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "widget-controls", children: [
              onRefresh ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "refresh-controls", children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "button",
                  {
                    type: "button",
                    onClick: handleManualRefresh,
                    onKeyDown: (e) => e.key === "Enter" && handleManualRefresh,
                    className: "refresh-button",
                    disabled: loading,
                    title: "Refresh now",
                    children: "\u{1F504}"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "refresh-timer", title: `Auto-refresh in ${timeLeft}s`, children: [
                  timeLeft,
                  "s"
                ] })
              ] }) : null,
              actions ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "widget-actions", children: actions }) : null
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "widget-content", children: [
            loading ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "widget-loading", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "loading-spinner" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: "Updating..." })
            ] }) : null,
            error ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "widget-error", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "error-icon", children: "\u26A0\uFE0F" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "error-message", children: error }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "button",
                {
                  type: "button",
                  onClick: handleManualRefresh,
                  onKeyDown: (e) => e.key === "Enter" && handleManualRefresh,
                  className: "retry-button",
                  children: "Retry"
                }
              )
            ] }) : null,
            !loading && !error && children
          ] }),
          lastUpdated ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "widget-footer", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "last-updated", children: [
            "Last updated: ",
            lastUpdated.toLocaleTimeString()
          ] }) }) : null
        ]
      }
    );
  }
);
function NetworkDeviceWidget({ device, className, ...props }) {
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds % 86400 / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  const getMetricColor = (value, thresholds = { warning: 70, critical: 90 }) => {
    if (value >= thresholds.critical) {
      return "critical";
    }
    if (value >= thresholds.warning) {
      return "warning";
    }
    return "normal";
  };
  const widgetStatus = device.status === "online" ? "normal" : device.status;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    BaseRealTimeWidget,
    {
      title: device.name,
      subtitle: `${device.type} \u2022 ${device.ipAddress}`,
      status: widgetStatus,
      className: (0, import_clsx3.clsx)("network-device-widget", className),
      ...props,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "device-status-section", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "status-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(StatusIndicator, { status: device.status, pulse: device.status !== "offline" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "status-text", children: device.status.toUpperCase() }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "uptime", children: [
            "Uptime: ",
            formatUptime(device.uptime)
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "metrics-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "metric-item", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { htmlFor: `input-${Math.random().toString(36).substr(2, 9)}`, children: "CPU Usage" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "metric-bar-container", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "div",
                {
                  className: (0, import_clsx3.clsx)("metric-bar", `metric-${getMetricColor(device.metrics.cpuUsage)}`),
                  style: { width: `${device.metrics.cpuUsage}%` }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "metric-value", children: [
                device.metrics.cpuUsage,
                "%"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "metric-item", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { htmlFor: `input-${Math.random().toString(36).substr(2, 9)}`, children: "Memory Usage" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "metric-bar-container", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "div",
                {
                  className: (0, import_clsx3.clsx)("metric-bar", `metric-${getMetricColor(device.metrics.memoryUsage)}`),
                  style: { width: `${device.metrics.memoryUsage}%` }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "metric-value", children: [
                device.metrics.memoryUsage,
                "%"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "metric-item", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { htmlFor: `input-${Math.random().toString(36).substr(2, 9)}`, children: "Network Utilization" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "metric-bar-container", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "div",
                {
                  className: (0, import_clsx3.clsx)(
                    "metric-bar",
                    `metric-${getMetricColor(device.metrics.networkUtilization)}`
                  ),
                  style: { width: `${device.metrics.networkUtilization}%` }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "metric-value", children: [
                device.metrics.networkUtilization,
                "%"
              ] })
            ] })
          ] }),
          device.metrics.temperature ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "metric-item", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { htmlFor: `input-${Math.random().toString(36).substr(2, 9)}`, children: "Temperature" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "metric-bar-container", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "div",
                {
                  className: (0, import_clsx3.clsx)(
                    "metric-bar",
                    `metric-${getMetricColor(device.metrics.temperature, { warning: 60, critical: 80 })}`
                  ),
                  style: {
                    width: `${Math.min(device.metrics.temperature, 100)}%`
                  }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "metric-value", children: [
                device.metrics.temperature,
                "\xB0C"
              ] })
            ] })
          ] }) : null
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "device-footer", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("small", { children: [
          "Last seen: ",
          device.lastSeen.toLocaleString()
        ] }) })
      ]
    }
  );
}
function ServiceHealthWidget({ service, className, ...props }) {
  const getStatusColor2 = (status) => {
    switch (status) {
      case "healthy":
      case "up":
        return "online";
      case "degraded":
        return "warning";
      case "unhealthy":
      case "down":
        return "critical";
      default:
        return "offline";
    }
  };
  const serviceStatus = getStatusColor2(service.status);
  const widgetStatus = serviceStatus === "online" ? "normal" : serviceStatus;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    BaseRealTimeWidget,
    {
      title: service.name,
      subtitle: `v${service.version} \u2022 ${(service.uptime * 100).toFixed(2)}% uptime`,
      status: widgetStatus,
      className: (0, import_clsx3.clsx)("service-health-widget", className),
      ...props,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "service-overview", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "overview-item", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { htmlFor: `input-${Math.random().toString(36).substr(2, 9)}`, children: "Status" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "status-badge", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(StatusIndicator, { status: serviceStatus, size: "sm" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: service.status.toUpperCase() })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "overview-item", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { htmlFor: `input-${Math.random().toString(36).substr(2, 9)}`, children: "Response Time" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "response-time", children: [
              service.responseTime,
              "ms"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "endpoints-list", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h4", { children: "Endpoints" }),
          service.endpoints.map((endpoint, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "endpoint-item", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(StatusIndicator, { status: getStatusColor2(endpoint.status), size: "sm" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "endpoint-name", children: endpoint.name }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "endpoint-response-time", children: [
              endpoint.responseTime,
              "ms"
            ] })
          ] }, `item-${index}`))
        ] })
      ]
    }
  );
}
function RealTimeMetricsWidget({
  title,
  metrics,
  className,
  ...props
}) {
  const getTrendIcon = (direction) => {
    switch (direction) {
      case "up":
        return "\u2197\uFE0F";
      case "down":
        return "\u2198\uFE0F";
      default:
        return "\u2192";
    }
  };
  const getMetricStatus = (value, threshold) => {
    if (!threshold) {
      return "normal";
    }
    if (value >= threshold.critical) {
      return "critical";
    }
    if (value >= threshold.warning) {
      return "warning";
    }
    return "normal";
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    BaseRealTimeWidget,
    {
      title,
      className: (0, import_clsx3.clsx)("real-time-metrics-widget", className),
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "metrics-list", children: metrics.map((metric, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "metric-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "metric-info", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "label",
            {
              htmlFor: `input-${Math.random().toString(36).substr(2, 9)}`,
              className: "metric-label",
              children: metric.label
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "metric-value-container", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
              "span",
              {
                className: (0, import_clsx3.clsx)(
                  "metric-value",
                  `status-${getMetricStatus(metric.value, metric.threshold)}`
                ),
                children: [
                  metric.value.toLocaleString(),
                  metric.unit ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "metric-unit", children: metric.unit }) : null
                ]
              }
            ),
            metric.trend ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: (0, import_clsx3.clsx)("metric-trend", `trend-${metric.trend.direction}`), children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "trend-icon", children: getTrendIcon(metric.trend.direction) }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "trend-value", children: [
                metric.trend.percentage,
                "%"
              ] })
            ] }) : null
          ] })
        ] }),
        metric.threshold ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "metric-threshold-bar", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              className: "threshold-fill",
              style: {
                width: `${Math.min(metric.value / metric.threshold.critical * 100, 100)}%`
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              className: "warning-line",
              style: {
                left: `${metric.threshold.warning / metric.threshold.critical * 100}%`
              }
            }
          )
        ] }) : null
      ] }, `item-${index}`)) })
    }
  );
}
BaseRealTimeWidget.displayName = "BaseRealTimeWidget";
NetworkDeviceWidget.displayName = "NetworkDeviceWidget";
ServiceHealthWidget.displayName = "ServiceHealthWidget";
RealTimeMetricsWidget.displayName = "RealTimeMetricsWidget";

// src/data-display/TableComponents.tsx
var import_react4 = __toESM(require("react"));
init_cn();
var import_jsx_runtime4 = require("react/jsx-runtime");
var Table = import_react4.default.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("table", { ref, className: cn("w-full caption-bottom text-sm", className), ...props }) })
);
Table.displayName = "Table";
var TableHeader = import_react4.default.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
var TableHead = import_react4.default.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
  "th",
  {
    ref,
    className: cn(
      "h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
var TableBody = import_react4.default.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("tbody", { ref, className: cn("[&_tr:last-child]:border-0", className), ...props }));
TableBody.displayName = "TableBody";
var TableRow = import_react4.default.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
  "tr",
  {
    ref,
    className: cn(
      "border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
var TableCell = import_react4.default.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
  "td",
  {
    ref,
    className: cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className),
    ...props
  }
));
TableCell.displayName = "TableCell";
var TableFooter = import_react4.default.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
  "tfoot",
  {
    ref,
    className: cn("border-t bg-gray-50/50 font-medium [&>tr]:last:border-b-0", className),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
var TableCaption = import_react4.default.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("caption", { ref, className: cn("mt-4 text-sm text-gray-500", className), ...props }));
TableCaption.displayName = "TableCaption";

// src/data-display/Table.tsx
var import_react_slot = require("@radix-ui/react-slot");
var import_class_variance_authority3 = require("class-variance-authority");
var import_clsx5 = require("clsx");
var import_react5 = __toESM(require("react"));
var import_jsx_runtime5 = require("react/jsx-runtime");
var tableVariants = (0, import_class_variance_authority3.cva)("", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: ""
    },
    variant: {
      default: "",
      bordered: "",
      striped: "",
      hover: ""
    },
    density: {
      compact: "",
      comfortable: "",
      spacious: ""
    }
  },
  defaultVariants: {
    size: "md",
    variant: "default",
    density: "comfortable"
  }
});
var Table2 = (0, import_react5.forwardRef)(
  ({ className, size, variant, density, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot.Slot : "table";
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx5.clsx)(tableVariants({ size, variant, density }), className),
        ...props
      }
    );
  }
);
var TableHeader2 = (0, import_react5.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("thead", { ref, className: (0, import_clsx5.clsx)("", className), ...props }));
var TableBody2 = (0, import_react5.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("tbody", { ref, className: (0, import_clsx5.clsx)("", className), ...props }));
var TableFooter2 = (0, import_react5.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("tfoot", { ref, className: (0, import_clsx5.clsx)("", className), ...props }));
var TableRow2 = (0, import_react5.forwardRef)(({ className, selected, expandable, expanded, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
  "tr",
  {
    ref,
    className: (0, import_clsx5.clsx)(
      "",
      {
        selected,
        expandable,
        expanded
      },
      className
    ),
    ...props
  }
));
var TableHead2 = (0, import_react5.forwardRef)(({ className, sortable, sorted, onSort, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
  "th",
  {
    ref,
    className: (0, import_clsx5.clsx)(
      "",
      {
        sortable,
        "sorted-asc": sorted === "asc",
        "sorted-desc": sorted === "desc"
      },
      className
    ),
    onClick: sortable ? onSort : void 0,
    onKeyDown: (e) => e.key === "Enter" && sortable ? onSort : void 0,
    ...props,
    children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "table-head-content", children: [
      children,
      sortable ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "sort-indicator", children: [
        sorted === "asc" && "\u2191",
        sorted === "desc" && "\u2193",
        !sorted && "\u2195"
      ] }) : null
    ] })
  }
));
var TableCell2 = (0, import_react5.forwardRef)(({ className, align = "left", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
  "td",
  {
    ref,
    className: (0, import_clsx5.clsx)(
      "",
      {
        "text-left": align === "left",
        "text-center": align === "center",
        "text-right": align === "right"
      },
      className
    ),
    ...props
  }
));
var TableCaption2 = (0, import_react5.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("caption", { ref, className: (0, import_clsx5.clsx)("", className), ...props }));
function DataTable2({
  columns,
  data,
  loading,
  pagination,
  sorting,
  selection,
  expandable,
  emptyText = "No data",
  loadingText = "Loading...",
  className,
  ...tableProps
}) {
  const handleSort = (column) => {
    if (!column.sortable || !sorting?.onChange) {
      return;
    }
    const currentOrder = sorting.field === column.key ? sorting.order : void 0;
    const newOrder = currentOrder === "asc" ? "desc" : "asc";
    sorting.onChange(column.key, newOrder);
  };
  const handleSelectAll = (checked) => {
    if (!selection?.onChange || !selection.getRowKey) {
      return;
    }
    if (checked) {
      const allKeys = data.map((item) => selection.getRowKey?.(item)).filter((key) => key !== void 0);
      selection.onChange(allKeys);
    } else {
      selection.onChange([]);
    }
  };
  const handleSelectRow = (record, checked) => {
    if (!selection?.onChange || !selection.getRowKey) {
      return;
    }
    const key = selection.getRowKey(record);
    const newSelectedKeys = checked ? [...selection.selectedKeys, key] : selection.selectedKeys.filter((k) => k !== key);
    selection.onChange(newSelectedKeys);
  };
  const isSelected = (record) => {
    if (!selection?.getRowKey) {
      return false;
    }
    return selection.selectedKeys.includes(selection.getRowKey(record));
  };
  const renderCell = (column, record, index) => {
    const value = column.dataIndex ? record[column.dataIndex] : record;
    return column.render ? column.render(value, record, index) : String(value);
  };
  if (loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "table-loading", children: loadingText });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "table-container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(Table2, { className, ...tableProps, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TableHeader2, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(TableRow2, { children: [
        selection ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TableHead2, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "input",
          {
            type: "checkbox",
            checked: data.length > 0 && selection.selectedKeys.length === data.length,
            onChange: (e) => handleSelectAll(e.target.checked),
            "aria-label": "Select all rows"
          }
        ) }) : null,
        columns.filter((col) => !col.hidden).map((column) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          TableHead2,
          {
            ...column.sortable !== void 0 ? { sortable: column.sortable } : {},
            ...sorting?.field === column.key ? { sorted: sorting.order } : {},
            ...column.sortable ? { onSort: () => handleSort(column) } : {},
            style: { width: column.width },
            children: column.title
          },
          column.key
        )),
        expandable ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TableHead2, {}) : null
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TableBody2, { children: data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TableRow2, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        TableCell2,
        {
          colSpan: columns.length + (selection ? 1 : 0) + (expandable ? 1 : 0),
          className: "empty-cell",
          children: emptyText
        }
      ) }) : data.map((record, _index) => {
        const rowKey = selection?.getRowKey?.(record) || String(_index);
        const selected = isSelected(record);
        return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_react5.default.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(TableRow2, { selected, children: [
            selection ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TableCell2, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "input",
              {
                type: "checkbox",
                checked: selected,
                onChange: (e) => handleSelectRow(record, e.target.checked),
                "aria-label": `Select row ${rowKey}`
              }
            ) }) : null,
            columns.filter((col) => !col.hidden).map((column) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              TableCell2,
              {
                ...column.align ? { align: column.align } : {},
                children: renderCell(column, record, _index)
              },
              column.key
            )),
            expandable ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TableCell2, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "button",
              {
                type: "button",
                onClick: () => expandable.onExpand?.(!expandable.expandedKeys.includes(rowKey), record),
                children: expandable.expandedKeys.includes(rowKey) ? "\u2212" : "+"
              }
            ) }) : null
          ] }),
          expandable?.expandedKeys.includes(rowKey) ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TableRow2, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            TableCell2,
            {
              colSpan: columns.length + (selection ? 1 : 0) + 1,
              className: "expanded-content",
              children: expandable.expandedRowRender?.(record)
            }
          ) }) : null
        ] }, rowKey);
      }) })
    ] }),
    pagination ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "table-pagination", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
      "Page ",
      pagination.current,
      " of ",
      Math.ceil(pagination.total / pagination.pageSize)
    ] }) }) : null
  ] });
}
Table2.displayName = "Table";
TableHeader2.displayName = "TableHeader";
TableBody2.displayName = "TableBody";
TableFooter2.displayName = "TableFooter";
TableRow2.displayName = "TableRow";
TableHead2.displayName = "TableHead";
TableCell2.displayName = "TableCell";
TableCaption2.displayName = "TableCaption";

// src/dashboard/UniversalDashboard.tsx
var import_react6 = require("react");
var import_framer_motion = require("framer-motion");
var import_lucide_react = require("lucide-react");
init_cn();
var import_jsx_runtime6 = require("react/jsx-runtime");
var variantStyles = {
  admin: {
    primaryColor: "#0F172A",
    accentColor: "#3B82F6",
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-700"
  },
  customer: {
    primaryColor: "#059669",
    accentColor: "#10B981",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-700"
  },
  reseller: {
    primaryColor: "#7C3AED",
    accentColor: "#8B5CF6",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-700"
  },
  technician: {
    primaryColor: "#DC2626",
    accentColor: "#EF4444",
    gradientFrom: "from-red-600",
    gradientTo: "to-rose-700"
  },
  management: {
    primaryColor: "#EA580C",
    accentColor: "#F97316",
    gradientFrom: "from-orange-600",
    gradientTo: "to-amber-700"
  }
};
var maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full"
};
var paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-12"
};
var spacingClasses = {
  tight: "space-y-4",
  normal: "space-y-6",
  relaxed: "space-y-8"
};
function UniversalDashboard({
  variant,
  user,
  tenant,
  title,
  subtitle,
  actions = [],
  children,
  isLoading = false,
  error = null,
  onRefresh,
  loadingMessage = "Loading dashboard...",
  emptyStateMessage = "No data available",
  maxWidth = "7xl",
  padding = "md",
  spacing = "normal",
  showGradientHeader = true,
  showUserInfo = true,
  showTenantInfo = true,
  className = ""
}) {
  const styles = variantStyles[variant];
  const [isRefreshing, setIsRefreshing] = (0, import_react6.useState)(false);
  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: cn("min-h-screen bg-gray-50", className), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: cn("mx-auto", maxWidthClasses[maxWidth], paddingClasses[padding]), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        import_framer_motion.motion.div,
        {
          className: "inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full",
          animate: { rotate: 360 },
          transition: { duration: 1, repeat: Infinity, ease: "linear" }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "mt-4 text-gray-600", children: loadingMessage })
    ] }) }) }) });
  }
  if (error) {
    const errorMessage = typeof error === "string" ? error : error.message;
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: cn("min-h-screen bg-gray-50", className), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: cn("mx-auto", maxWidthClasses[maxWidth], paddingClasses[padding]), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react.AlertCircle, { className: "mx-auto h-12 w-12 text-red-500 mb-4" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Something went wrong" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "text-gray-600 mb-4", children: errorMessage }),
      onRefresh && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
        "button",
        {
          onClick: handleRefresh,
          disabled: isRefreshing,
          className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 inline-flex items-center space-x-2",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react.RefreshCw, { className: cn("w-4 h-4", isRefreshing && "animate-spin") }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "Try Again" })
          ]
        }
      )
    ] }) }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: cn("min-h-screen bg-gray-50", className), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: cn("mx-auto", maxWidthClasses[maxWidth]), children: [
    showGradientHeader && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      import_framer_motion.motion.div,
      {
        className: cn(
          "rounded-lg bg-gradient-to-r text-white mb-6",
          styles.gradientFrom,
          styles.gradientTo,
          paddingClasses[padding]
        ),
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h1", { className: "font-bold text-2xl", children: title }),
            subtitle && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "mt-1 opacity-90 text-sm", children: subtitle }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "mt-3 flex items-center space-x-6", children: [
              showUserInfo && user && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center space-x-2", children: [
                user.avatar && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("img", { src: user.avatar, alt: user.name, className: "w-6 h-6 rounded-full" }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "text-sm opacity-75", children: [
                  user.name,
                  " ",
                  user.role && `\u2022 ${user.role}`
                ] })
              ] }),
              showTenantInfo && tenant && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "text-sm opacity-75", children: [
                  tenant.companyName || tenant.name,
                  tenant.plan && ` \u2022 ${tenant.plan}`
                ] }),
                tenant.status && tenant.status !== "active" && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
                  "span",
                  {
                    className: cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      tenant.status === "trial" && "bg-yellow-500/20 text-yellow-100",
                      tenant.status === "suspended" && "bg-red-500/20 text-red-100",
                      tenant.status === "inactive" && "bg-gray-500/20 text-gray-100"
                    ),
                    children: [
                      tenant.status,
                      tenant.trialDaysLeft && tenant.status === "trial" && ` (${tenant.trialDaysLeft} days left)`
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "flex items-center space-x-3", children: actions.map((action) => {
            const Icon = action.icon;
            return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
              "button",
              {
                onClick: action.onClick,
                className: cn(
                  "inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  action.variant === "primary" && "bg-white/20 hover:bg-white/30 text-white",
                  action.variant === "secondary" && "bg-white/10 hover:bg-white/20 text-white",
                  (!action.variant || action.variant === "outline") && "border border-white/30 hover:bg-white/10 text-white",
                  action.variant === "ghost" && "hover:bg-white/10 text-white"
                ),
                children: [
                  Icon && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Icon, { className: "w-4 h-4 mr-2" }),
                  action.label
                ]
              },
              action.id
            );
          }) })
        ] })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: cn(paddingClasses[padding]), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      import_framer_motion.motion.div,
      {
        className: spacingClasses[spacing],
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4, delay: 0.1 },
        children
      }
    ) })
  ] }) });
}
var UniversalDashboard_default = UniversalDashboard;

// src/dashboard/UniversalMetricCard.tsx
var import_react7 = require("react");
var import_framer_motion2 = require("framer-motion");
var import_lucide_react2 = require("lucide-react");
init_cn();
var import_jsx_runtime7 = require("react/jsx-runtime");
var statusColors = {
  success: {
    icon: "text-green-600",
    bg: "bg-green-100",
    progress: "bg-green-500",
    border: "border-green-200"
  },
  warning: {
    icon: "text-yellow-600",
    bg: "bg-yellow-100",
    progress: "bg-yellow-500",
    border: "border-yellow-200"
  },
  error: {
    icon: "text-red-600",
    bg: "bg-red-100",
    progress: "bg-red-500",
    border: "border-red-200"
  },
  info: {
    icon: "text-blue-600",
    bg: "bg-blue-100",
    progress: "bg-blue-500",
    border: "border-blue-200"
  },
  neutral: {
    icon: "text-gray-600",
    bg: "bg-gray-100",
    progress: "bg-gray-500",
    border: "border-gray-200"
  }
};
var sizeClasses = {
  sm: {
    card: "p-4",
    title: "text-sm",
    value: "text-xl",
    icon: "w-5 h-5",
    iconContainer: "p-2"
  },
  md: {
    card: "p-5",
    title: "text-sm",
    value: "text-2xl",
    icon: "w-6 h-6",
    iconContainer: "p-3"
  },
  lg: {
    card: "p-6",
    title: "text-base",
    value: "text-3xl",
    icon: "w-7 h-7",
    iconContainer: "p-3"
  }
};
function UniversalMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  size = "md",
  trend,
  progress,
  status,
  prefix = "",
  suffix = "",
  currency = "USD",
  format = "number",
  precision = 0,
  onClick,
  href,
  loading = false,
  className = "",
  contentClassName = ""
}) {
  const sizes = sizeClasses[size];
  const colors = status ? statusColors[status.type] : statusColors.neutral;
  const formatValue2 = (rawValue) => {
    if (loading) return "...";
    const numValue = typeof rawValue === "string" ? parseFloat(rawValue) || 0 : rawValue;
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          minimumFractionDigits: precision,
          maximumFractionDigits: precision
        }).format(numValue);
      case "percentage":
        return `${numValue.toFixed(precision)}%`;
      case "duration":
        if (numValue < 60) return `${numValue.toFixed(precision)}s`;
        if (numValue < 3600) return `${(numValue / 60).toFixed(precision)}m`;
        return `${(numValue / 3600).toFixed(precision)}h`;
      case "bytes":
        const sizes2 = ["B", "KB", "MB", "GB", "TB"];
        if (numValue === 0) return "0 B";
        const i = Math.floor(Math.log(numValue) / Math.log(1024));
        return `${(numValue / Math.pow(1024, i)).toFixed(precision)} ${sizes2[i]}`;
      case "number":
      default:
        return `${prefix}${numValue.toLocaleString("en-US", {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision
        })}${suffix}`;
    }
  };
  const calculateProgress = () => {
    if (!progress) return 0;
    return Math.min(progress.current / progress.target * 100, 100);
  };
  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case "up":
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react2.TrendingUp, { className: "w-4 h-4 text-green-600" });
      case "down":
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react2.TrendingDown, { className: "w-4 h-4 text-red-600" });
      case "flat":
      default:
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react2.Minus, { className: "w-4 h-4 text-gray-400" });
    }
  };
  const getTrendColor = () => {
    if (!trend) return "text-gray-500";
    switch (trend.direction) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "flat":
      default:
        return "text-gray-500";
    }
  };
  const hoverMotionProps = onClick ? { whileHover: { y: -1 } } : {};
  const cardContent = /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    import_framer_motion2.motion.div,
    {
      className: cn(
        "bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:border-gray-300",
        variant === "featured" && "border-2",
        variant === "featured" && status && colors.border,
        sizes.card,
        className
      ),
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      ...hoverMotionProps,
      children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: cn("space-y-3", contentClassName), children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: cn("font-medium text-gray-600 truncate", sizes.title), children: title }),
            subtitle && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-xs text-gray-500 mt-1 truncate", children: subtitle })
          ] }),
          Icon && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: cn("rounded-full flex-shrink-0", colors.bg, sizes.iconContainer), children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Icon, { className: cn(colors.icon, sizes.icon) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: cn("font-bold text-gray-900 leading-none", sizes.value), children: formatValue2(value) }) }),
        progress && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "space-y-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-gray-500", children: progress.label || "Progress" }),
            progress.showPercentage !== false && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "text-gray-700 font-medium", children: [
              calculateProgress().toFixed(1),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            import_framer_motion2.motion.div,
            {
              className: cn("h-2 rounded-full", colors.progress),
              initial: { width: 0 },
              animate: { width: `${calculateProgress()}%` },
              transition: { duration: 0.8, ease: "easeOut" }
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: progress.current.toLocaleString() }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { children: [
              "of ",
              progress.target.toLocaleString()
            ] })
          ] })
        ] }),
        trend && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center space-x-2", children: [
          getTrendIcon(),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: cn("text-sm font-medium", getTrendColor()), children: [
            trend.percentage > 0 ? "+" : "",
            trend.percentage.toFixed(1),
            "%"
          ] }),
          trend.label && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-sm text-gray-500", children: trend.label })
        ] }),
        status && status.label && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center space-x-2", children: [
          status.type === "warning" || status.type === "error" ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react2.AlertTriangle, { className: cn("w-4 h-4", colors.icon) }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: cn("text-sm", colors.icon), children: status.label })
        ] })
      ] })
    }
  );
  if (href) {
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("a", { href, className: "block", children: cardContent });
  }
  if (onClick) {
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("button", { onClick, className: "block text-left w-full", children: cardContent });
  }
  return cardContent;
}
var UniversalMetricCard_default = UniversalMetricCard;

// src/dashboard/UniversalKPISection.tsx
var import_framer_motion3 = require("framer-motion");
init_cn();
var import_jsx_runtime8 = require("react/jsx-runtime");
var gapClasses = {
  tight: "gap-4",
  normal: "gap-6",
  relaxed: "gap-8"
};
var getGridColumns = (columns, responsive) => {
  const baseColumns = `grid-cols-${columns}`;
  if (!responsive) return baseColumns;
  const classes = [baseColumns];
  if (responsive.sm) classes.push(`sm:grid-cols-${responsive.sm}`);
  if (responsive.md) classes.push(`md:grid-cols-${responsive.md}`);
  if (responsive.lg) classes.push(`lg:grid-cols-${responsive.lg}`);
  if (responsive.xl) classes.push(`xl:grid-cols-${responsive.xl}`);
  return classes.join(" ");
};
function UniversalKPISection({
  title,
  subtitle,
  kpis,
  columns = 4,
  responsiveColumns = { sm: 1, md: 2, lg: 4 },
  gap = "normal",
  cardSize = "md",
  cardVariant = "default",
  className = "",
  contentClassName = "",
  loading = false,
  staggerChildren = true,
  animationDelay = 0
}) {
  const containerVariants2 = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: animationDelay,
        staggerChildren: staggerChildren ? 0.1 : 0
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
    import_framer_motion3.motion.section,
    {
      className: cn("space-y-4", className),
      variants: containerVariants2,
      initial: "hidden",
      animate: "visible",
      children: [
        (title || subtitle) && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "space-y-1", children: [
          title && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h2", { className: "text-lg font-semibold text-gray-900", children: title }),
          subtitle && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-sm text-gray-600", children: subtitle })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          import_framer_motion3.motion.div,
          {
            className: cn(
              "grid",
              getGridColumns(columns, responsiveColumns),
              gapClasses[gap],
              contentClassName
            ),
            variants: containerVariants2,
            children: kpis.map((kpi, index) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_framer_motion3.motion.div, { variants: itemVariants, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(UniversalMetricCard, { ...kpi, size: cardSize, variant: cardVariant, loading }) }, kpi.id))
          }
        ),
        kpis.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          import_framer_motion3.motion.div,
          {
            className: "text-center py-12",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.3 },
            children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-gray-500", children: "No metrics available" })
          }
        ),
        loading && kpis.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: cn("grid", getGridColumns(columns, responsiveColumns), gapClasses[gap]), children: Array.from({ length: 4 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "div",
          {
            className: "bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-pulse",
            children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "h-4 bg-gray-200 rounded w-24" }),
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "h-8 w-8 bg-gray-200 rounded-full" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "h-8 bg-gray-200 rounded w-16" }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "h-2 bg-gray-200 rounded" }),
                /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "h-3 bg-gray-200 rounded w-12" }),
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "h-3 bg-gray-200 rounded w-12" })
                ] })
              ] })
            ] })
          },
          index
        )) })
      ]
    }
  );
}
var UniversalKPISection_default = UniversalKPISection;

// src/dashboard/UniversalActivityFeed.tsx
var import_react8 = require("react");
var import_framer_motion4 = require("framer-motion");
var import_lucide_react3 = require("lucide-react");
init_cn();
var import_jsx_runtime9 = require("react/jsx-runtime");
var typeConfig = {
  user_action: {
    icon: import_lucide_react3.User,
    color: "text-blue-600",
    bg: "bg-blue-100",
    dot: "bg-blue-600"
  },
  system_event: {
    icon: import_lucide_react3.Info,
    color: "text-gray-600",
    bg: "bg-gray-100",
    dot: "bg-gray-600"
  },
  error: {
    icon: import_lucide_react3.AlertCircle,
    color: "text-red-600",
    bg: "bg-red-100",
    dot: "bg-red-600"
  },
  success: {
    icon: import_lucide_react3.CheckCircle,
    color: "text-green-600",
    bg: "bg-green-100",
    dot: "bg-green-600"
  },
  info: {
    icon: import_lucide_react3.Info,
    color: "text-blue-600",
    bg: "bg-blue-100",
    dot: "bg-blue-600"
  },
  warning: {
    icon: import_lucide_react3.AlertCircle,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    dot: "bg-yellow-600"
  }
};
var priorityConfig = {
  low: "border-l-gray-300",
  medium: "border-l-blue-500",
  high: "border-l-yellow-500",
  urgent: "border-l-red-500"
};
function UniversalActivityFeed({
  activities,
  title = "Recent Activity",
  maxItems,
  showTimestamps = true,
  showAvatars = true,
  showCategories = false,
  groupByDate = false,
  allowFiltering = false,
  categories = [],
  priorityFilter,
  typeFilter,
  isLive = false,
  onRefresh,
  refreshInterval = 30,
  variant = "default",
  className = "",
  itemClassName = "",
  loading = false,
  emptyMessage = "No recent activity",
  onItemClick
}) {
  const [filteredActivities, setFilteredActivities] = (0, import_react8.useState)(activities);
  const [selectedCategory, setSelectedCategory] = (0, import_react8.useState)("all");
  const [selectedPriority, setSelectedPriority] = (0, import_react8.useState)("all");
  const [isRefreshing, setIsRefreshing] = (0, import_react8.useState)(false);
  (0, import_react8.useEffect)(() => {
    if (!isLive || !onRefresh || refreshInterval <= 0) {
      return;
    }
    const interval = setInterval(() => {
      onRefresh();
    }, refreshInterval * 1e3);
    return () => clearInterval(interval);
  }, [isLive, onRefresh, refreshInterval]);
  (0, import_react8.useEffect)(() => {
    let filtered = activities;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    if (selectedPriority !== "all") {
      filtered = filtered.filter((item) => item.priority === selectedPriority);
    }
    if (typeFilter && typeFilter.length > 0) {
      filtered = filtered.filter((item) => typeFilter.includes(item.type));
    }
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }
    setFilteredActivities(filtered);
  }, [activities, selectedCategory, selectedPriority, typeFilter, maxItems]);
  const formatTimestamp = (timestamp) => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 6e4);
    const diffHours = Math.floor(diffMs / 36e5);
    const diffDays = Math.floor(diffMs / 864e5);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };
  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };
  const groupedActivities = groupByDate ? filteredActivities.reduce(
    (groups, activity) => {
      const date = typeof activity.timestamp === "string" ? new Date(activity.timestamp) : activity.timestamp;
      const dateKey = date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
      return groups;
    },
    {}
  ) : { all: filteredActivities };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: cn("bg-white rounded-xl shadow-sm border border-gray-200", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { className: "font-semibold text-gray-900", children: title }),
        isLive && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-xs text-green-600", children: "Live" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center space-x-2", children: [
        allowFiltering && (categories.length > 0 || priorityFilter) && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "flex items-center space-x-2", children: categories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
          "select",
          {
            value: selectedCategory,
            onChange: (e) => setSelectedCategory(e.target.value),
            className: "text-sm border border-gray-300 rounded px-2 py-1",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: "all", children: "All Categories" }),
              categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: cat, children: cat }, cat))
            ]
          }
        ) }),
        onRefresh && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "button",
          {
            onClick: handleRefresh,
            disabled: isRefreshing,
            className: "p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50",
            title: "Refresh",
            children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react3.RefreshCw, { className: cn("w-4 h-4", isRefreshing && "animate-spin") })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "max-h-96 overflow-y-auto", children: loading ? (
      // Loading State
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "p-4 space-y-4", children: Array.from({ length: 3 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-start space-x-3 animate-pulse", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "w-8 h-8 bg-gray-200 rounded-full" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "h-4 bg-gray-200 rounded w-3/4" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "h-3 bg-gray-200 rounded w-1/2" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "w-12 h-3 bg-gray-200 rounded" })
      ] }, index)) })
    ) : filteredActivities.length === 0 ? (
      // Empty State
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "p-8 text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react3.Clock, { className: "w-8 h-8 mx-auto mb-2 text-gray-400" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { children: emptyMessage })
      ] })
    ) : (
      // Activity List
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "divide-y divide-gray-100", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_framer_motion4.AnimatePresence, { children: Object.entries(groupedActivities).map(([dateGroup, items]) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        groupByDate && dateGroup !== "all" && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50", children: dateGroup }),
        items.map((activity, index) => {
          const config = typeConfig[activity.type];
          const Icon = activity.icon || config.icon;
          return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            import_framer_motion4.motion.div,
            {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: 20 },
              transition: { duration: 0.2, delay: index * 0.05 },
              className: cn(
                "p-4 hover:bg-gray-50 transition-colors",
                activity.priority && priorityConfig[activity.priority],
                (activity.onClick || onItemClick || activity.href) && "cursor-pointer",
                itemClassName
              ),
              onClick: () => {
                if (activity.onClick) activity.onClick();
                if (onItemClick) onItemClick(activity);
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-start space-x-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: cn("p-2 rounded-full flex-shrink-0", config.bg), children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Icon, { className: cn("w-4 h-4", config.color) }) }),
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-start justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "text-sm font-medium text-gray-900 truncate", children: activity.title }),
                    activity.description && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "text-sm text-gray-600 mt-1", children: activity.description }),
                    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center space-x-4 mt-2", children: [
                      showAvatars && activity.user && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center space-x-2", children: [
                        activity.user.avatar && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                          "img",
                          {
                            src: activity.user.avatar,
                            alt: activity.user.name,
                            className: "w-4 h-4 rounded-full"
                          }
                        ),
                        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-xs text-gray-500", children: activity.user.name })
                      ] }),
                      showCategories && activity.category && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-xs text-gray-500 capitalize", children: activity.category })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center space-x-2 flex-shrink-0", children: [
                    showTimestamps && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-xs text-gray-500", children: formatTimestamp(activity.timestamp) }),
                    activity.actions && activity.actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "flex items-center space-x-1", children: activity.actions.map((action) => {
                      const ActionIcon = action.icon;
                      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                        "button",
                        {
                          onClick: (e) => {
                            e.stopPropagation();
                            action.onClick();
                          },
                          className: cn(
                            "p-1 rounded text-xs hover:bg-gray-100",
                            action.variant === "danger" && "text-red-600 hover:bg-red-50"
                          ),
                          title: action.label,
                          children: ActionIcon && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ActionIcon, { className: "w-3 h-3" })
                        },
                        action.id
                      );
                    }) })
                  ] })
                ] }) })
              ] })
            },
            activity.id
          );
        })
      ] }, dateGroup)) }) })
    ) }),
    maxItems && activities.length > maxItems && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "p-3 border-t border-gray-200 text-center", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("button", { className: "text-sm text-blue-600 hover:text-blue-700", children: [
      "Show ",
      activities.length - maxItems,
      " more activities"
    ] }) })
  ] });
}
var UniversalActivityFeed_default = UniversalActivityFeed;

// src/charts/UniversalChart.tsx
var import_react9 = require("react");
var import_recharts = require("recharts");
var import_framer_motion5 = require("framer-motion");
var import_lucide_react4 = require("lucide-react");
init_cn();
var import_jsx_runtime10 = require("react/jsx-runtime");
var variantColors = {
  admin: {
    primary: "#3B82F6",
    secondary: "#1E40AF",
    accent: "#60A5FA",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    gradient: ["#3B82F6", "#1E40AF", "#60A5FA", "#93C5FD", "#DBEAFE"]
  },
  customer: {
    primary: "#10B981",
    secondary: "#047857",
    accent: "#34D399",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    gradient: ["#10B981", "#047857", "#34D399", "#6EE7B7", "#D1FAE5"]
  },
  reseller: {
    primary: "#8B5CF6",
    secondary: "#7C3AED",
    accent: "#A78BFA",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    gradient: ["#8B5CF6", "#7C3AED", "#A78BFA", "#C4B5FD", "#E9D5FF"]
  },
  technician: {
    primary: "#EF4444",
    secondary: "#DC2626",
    accent: "#F87171",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#B91C1C",
    gradient: ["#EF4444", "#DC2626", "#F87171", "#FCA5A5", "#FEE2E2"]
  },
  management: {
    primary: "#F97316",
    secondary: "#EA580C",
    accent: "#FB923C",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    gradient: ["#F97316", "#EA580C", "#FB923C", "#FDBA74", "#FED7AA"]
  }
};
var CustomTooltip = ({ active, payload, label, labelFormatter, valueFormatter }) => {
  if (!active || !payload || !payload.length) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "bg-white p-3 border border-gray-200 rounded-lg shadow-lg", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "font-medium text-gray-900 mb-2", children: labelFormatter ? labelFormatter(label) : label }),
    payload.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-center space-x-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: entry.color } }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { className: "text-sm text-gray-600", children: [
        entry.name,
        ":"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "text-sm font-medium text-gray-900", children: valueFormatter ? valueFormatter(entry.value) : entry.value })
    ] }, index))
  ] });
};
var CustomLegend = ({ payload, onLegendClick }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "flex flex-wrap justify-center gap-4 mt-4", children: payload.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
    "button",
    {
      className: "flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900",
      onClick: () => onLegendClick?.(entry.dataKey),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: entry.color } }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { children: entry.value })
      ]
    },
    index
  )) });
};
function UniversalChart({
  data,
  series,
  type,
  variant = "admin",
  width = "100%",
  height = 300,
  aspectRatio,
  xAxis,
  yAxis,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showBrush = false,
  smooth = false,
  stacked = false,
  onDataPointClick,
  onLegendClick,
  referenceLines = [],
  title,
  subtitle,
  loading = false,
  error = null,
  actions = [],
  className = "",
  cardWrapper = true,
  animationDuration = 1500,
  animationEasing = "ease-in-out"
}) {
  const colors = variantColors[variant];
  const seriesWithColors = (0, import_react9.useMemo)(() => {
    return series.map((s, index) => ({
      ...s,
      color: s.color || colors.gradient[index % colors.gradient.length]
    }));
  }, [series, colors]);
  const formatXAxis = (0, import_react9.useCallback)(
    (value) => {
      if (xAxis?.format) return xAxis.format(value);
      if (value instanceof Date) return value.toLocaleDateString();
      return value;
    },
    [xAxis]
  );
  const formatYAxis = (0, import_react9.useCallback)(
    (value, axis = "left") => {
      const axisConfig = yAxis?.[axis];
      if (axisConfig?.format) return axisConfig.format(value);
      if (typeof value === "number") {
        if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
        if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
      }
      return value;
    },
    [yAxis]
  );
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };
    switch (type) {
      case "line": {
        const hasXAxisAngle = typeof xAxis?.angle === "number";
        const leftDomain = yAxis?.left?.domain;
        const rightDomain = yAxis?.right?.domain;
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_recharts.LineChart, { ...commonProps, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("defs", { children: seriesWithColors.map((s, index) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("linearGradient", { id: `gradient-${s.key}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("stop", { offset: "5%", stopColor: s.color, stopOpacity: 0.3 }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("stop", { offset: "95%", stopColor: s.color, stopOpacity: 0.1 })
          ] }, s.key)) }),
          showGrid && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }),
          !xAxis?.hide && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            import_recharts.XAxis,
            {
              dataKey: xAxis?.dataKey || "x",
              tickFormatter: formatXAxis,
              textAnchor: hasXAxisAngle ? "end" : "middle",
              height: hasXAxisAngle ? 60 : 30,
              ...hasXAxisAngle ? { angle: xAxis?.angle } : {}
            }
          ),
          !yAxis?.left?.hide && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            import_recharts.YAxis,
            {
              yAxisId: "left",
              tickFormatter: (value) => formatYAxis(value, "left"),
              ...leftDomain ? { domain: leftDomain } : {}
            }
          ),
          yAxis?.right && !yAxis.right.hide && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            import_recharts.YAxis,
            {
              yAxisId: "right",
              orientation: "right",
              tickFormatter: (value) => formatYAxis(value, "right"),
              ...rightDomain ? { domain: rightDomain } : {}
            }
          ),
          showTooltip && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(CustomTooltip, {}) }),
          showLegend && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.Legend, { content: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(CustomLegend, { onLegendClick }) }),
          seriesWithColors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            import_recharts.Line,
            {
              type: smooth ? "monotone" : "linear",
              dataKey: s.key,
              stroke: s.color,
              strokeWidth: s.strokeWidth || 2,
              strokeDasharray: s.strokeDasharray,
              yAxisId: s.yAxisId || "left",
              dot: { fill: s.color, r: 4 },
              activeDot: {
                r: 6,
                stroke: s.color,
                strokeWidth: 2,
                fill: "#fff"
              },
              animationDuration,
              onClick: (data2) => onDataPointClick?.(data2, s.key)
            },
            s.key
          )),
          referenceLines.map((line, index) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            import_recharts.ReferenceLine,
            {
              ...line.y !== void 0 ? { y: line.y } : {},
              ...line.x !== void 0 ? { x: line.x } : {},
              stroke: line.color || colors.accent,
              strokeDasharray: line.strokeDasharray || "5 5",
              ...line.label ? { label: line.label } : {}
            },
            index
          )),
          showBrush && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.Brush, { dataKey: xAxis?.dataKey || "x", height: 30 })
        ] });
      }
      case "area":
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_recharts.AreaChart, { ...commonProps, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("defs", { children: seriesWithColors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("linearGradient", { id: `gradient-${s.key}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("stop", { offset: "5%", stopColor: s.color, stopOpacity: 0.8 }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("stop", { offset: "95%", stopColor: s.color, stopOpacity: 0.1 })
          ] }, s.key)) }),
          showGrid && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }),
          !xAxis?.hide && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.XAxis, { dataKey: xAxis?.dataKey || "x", tickFormatter: formatXAxis }),
          !yAxis?.left?.hide && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.YAxis, { tickFormatter: (value) => formatYAxis(value, "left") }),
          showTooltip && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(CustomTooltip, {}) }),
          showLegend && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.Legend, { content: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(CustomLegend, { onLegendClick }) }),
          seriesWithColors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            import_recharts.Area,
            {
              type: smooth ? "monotone" : "linear",
              dataKey: s.key,
              stroke: s.color,
              fill: s.fill || `url(#gradient-${s.key})`,
              strokeWidth: s.strokeWidth || 2,
              animationDuration,
              ...stacked ? { stackId: s.stackId ?? "default" } : {}
            },
            s.key
          ))
        ] });
      case "bar":
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_recharts.BarChart, { ...commonProps, children: [
          showGrid && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }),
          !xAxis?.hide && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.XAxis, { dataKey: xAxis?.dataKey || "x", tickFormatter: formatXAxis }),
          !yAxis?.left?.hide && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.YAxis, { tickFormatter: (value) => formatYAxis(value, "left") }),
          showTooltip && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(CustomTooltip, {}) }),
          showLegend && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.Legend, { content: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(CustomLegend, { onLegendClick }) }),
          seriesWithColors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            import_recharts.Bar,
            {
              dataKey: s.key,
              fill: s.color,
              animationDuration,
              onClick: (data2) => onDataPointClick?.(data2, s.key),
              ...stacked ? { stackId: s.stackId ?? "default" } : {}
            },
            s.key
          ))
        ] });
      case "pie":
      case "donut":
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_recharts.PieChart, { ...commonProps, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            import_recharts.Pie,
            {
              data,
              cx: "50%",
              cy: "50%",
              labelLine: false,
              outerRadius: type === "donut" ? 100 : 120,
              innerRadius: type === "donut" ? 60 : 0,
              fill: colors.primary,
              dataKey: series[0]?.key || "value",
              label: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
              animationDuration,
              children: data.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
                import_recharts.Cell,
                {
                  fill: colors.gradient[index % colors.gradient.length]
                },
                `cell-${index}`
              ))
            }
          ),
          showTooltip && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(CustomTooltip, {}) }),
          showLegend && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.Legend, {})
        ] });
      default:
        return null;
    }
  };
  if (loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
      "div",
      {
        className: cn(
          "bg-white rounded-lg border border-gray-200",
          cardWrapper && "p-6",
          className
        ),
        children: [
          title && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "w-full bg-gray-200 rounded animate-pulse", style: { height } })
        ]
      }
    );
  }
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: cn("bg-white rounded-lg border border-gray-200 p-6", className), children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "text-center text-gray-500", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-sm", children: "Failed to load chart" }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-xs text-gray-400 mt-1", children: error })
    ] }) });
  }
  const chartElement = renderChart();
  if (!chartElement) {
    return null;
  }
  const responsiveContainerProps = { width };
  if (aspectRatio !== void 0) {
    responsiveContainerProps.aspect = aspectRatio;
  } else {
    responsiveContainerProps.height = height;
  }
  const chartContent = /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_recharts.ResponsiveContainer, { ...responsiveContainerProps, children: chartElement });
  if (!cardWrapper) {
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className, children: chartContent });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
    import_framer_motion5.motion.div,
    {
      className: cn("bg-white rounded-lg border border-gray-200 p-6", className),
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      children: [
        (title || subtitle || actions.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-start justify-between mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { children: [
            title && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: title }),
            subtitle && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-sm text-gray-600 mt-1", children: subtitle })
          ] }),
          actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "flex items-center space-x-2", children: actions.map((action) => {
            const Icon = action.icon;
            return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
              "button",
              {
                onClick: action.onClick,
                className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100",
                title: action.label,
                children: Icon && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Icon, { className: "w-4 h-4" })
              },
              action.id
            );
          }) })
        ] }),
        chartContent
      ]
    }
  );
}
var UniversalChart_default = UniversalChart;

// src/charts/ChartLibrary.tsx
var import_react10 = require("react");
var import_jsx_runtime11 = require("react/jsx-runtime");
function RevenueChart({
  data,
  showTarget = false,
  showComparison = false,
  currency = "USD",
  ...props
}) {
  const series = [
    { key: "revenue", name: "Revenue", type: "area" },
    ...showTarget ? [
      {
        key: "target",
        name: "Target",
        type: "line",
        strokeDasharray: "5 5"
      }
    ] : [],
    ...showComparison ? [{ key: "previousYear", name: "Previous Year", type: "line" }] : []
  ];
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    UniversalChart,
    {
      ...props,
      type: "area",
      data,
      series,
      title: props.title || "Revenue Trends",
      xAxis: {
        dataKey: "date",
        format: (value) => new Date(value).toLocaleDateString()
      },
      yAxis: { left: { format: formatCurrency } },
      smooth: true
    }
  );
}
function NetworkUsageChart({
  data,
  showTotal = false,
  unit = "GB",
  ...props
}) {
  const series = [
    { key: "download", name: "Download", stackId: "usage" },
    { key: "upload", name: "Upload", stackId: "usage" },
    ...showTotal ? [
      {
        key: "total",
        name: "Total",
        type: "line",
        yAxisId: "right"
      }
    ] : []
  ];
  const formatBytes = (value) => `${value} ${unit}`;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    UniversalChart,
    {
      ...props,
      type: "area",
      data,
      series,
      title: props.title || "Network Usage",
      xAxis: { dataKey: "time" },
      yAxis: {
        left: { format: formatBytes },
        ...showTotal && { right: { format: formatBytes } }
      },
      stacked: true,
      smooth: true
    }
  );
}
function CustomerGrowthChart({ data, ...props }) {
  const series = [
    { key: "newCustomers", name: "New Customers", type: "bar" },
    {
      key: "churnedCustomers",
      name: "Churned Customers",
      type: "bar"
    },
    {
      key: "totalCustomers",
      name: "Total Customers",
      type: "line",
      yAxisId: "right"
    }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    UniversalChart,
    {
      ...props,
      type: "combo",
      data,
      series,
      title: props.title || "Customer Growth",
      xAxis: { dataKey: "period" },
      yAxis: {
        left: { label: "Monthly Change" },
        right: { label: "Total Customers" }
      }
    }
  );
}
function ServiceStatusChart({
  data,
  chartType = "donut",
  ...props
}) {
  const series = [{ key: "count", name: "Services" }];
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    UniversalChart,
    {
      ...props,
      type: chartType,
      data,
      series,
      title: props.title || "Service Status Distribution"
    }
  );
}
function PerformanceChart({
  data,
  metrics = ["latency", "throughput", "uptime"],
  ...props
}) {
  const series = metrics.map((metric) => ({
    key: metric,
    name: metric.charAt(0).toUpperCase() + metric.slice(1),
    yAxisId: metric === "uptime" ? "right" : "left"
  }));
  const formatLatency = (value) => `${value}ms`;
  const formatThroughput = (value) => `${value} Mbps`;
  const formatUptime = (value) => `${value}%`;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    UniversalChart,
    {
      ...props,
      type: "line",
      data,
      series,
      title: props.title || "Network Performance",
      xAxis: { dataKey: "timestamp" },
      yAxis: {
        left: { format: formatLatency },
        right: { format: formatUptime, domain: [0, 100] }
      },
      smooth: true
    }
  );
}
function BandwidthChart({ data, showStacked = true, ...props }) {
  const series = [
    {
      key: "residential",
      name: "Residential",
      ...showStacked ? { stackId: "bandwidth" } : {}
    },
    {
      key: "business",
      name: "Business",
      ...showStacked ? { stackId: "bandwidth" } : {}
    },
    {
      key: "enterprise",
      name: "Enterprise",
      ...showStacked ? { stackId: "bandwidth" } : {}
    }
  ];
  const formatBandwidth = (value) => `${value} Gbps`;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    UniversalChart,
    {
      ...props,
      type: "area",
      data,
      series,
      title: props.title || "Bandwidth Distribution",
      xAxis: { dataKey: "timeSlot" },
      yAxis: { left: { format: formatBandwidth } },
      stacked: showStacked,
      smooth: true
    }
  );
}
function TicketVolumeChart({ data, ...props }) {
  const series = [
    { key: "created", name: "Created", type: "bar" },
    { key: "resolved", name: "Resolved", type: "bar" },
    {
      key: "backlog",
      name: "Backlog",
      type: "line",
      yAxisId: "right"
    }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    UniversalChart,
    {
      ...props,
      type: "combo",
      data,
      series,
      title: props.title || "Support Ticket Volume",
      xAxis: {
        dataKey: "date",
        format: (value) => new Date(value).toLocaleDateString()
      },
      yAxis: {
        left: { label: "Daily Volume" },
        right: { label: "Total Backlog" }
      }
    }
  );
}
function FinancialChart({ data, currency = "USD", ...props }) {
  const series = [
    { key: "revenue", name: "Revenue", type: "bar" },
    { key: "expenses", name: "Expenses", type: "bar" },
    { key: "profit", name: "Profit", type: "line" },
    {
      key: "margin",
      name: "Margin %",
      type: "line",
      yAxisId: "right"
    }
  ];
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  const formatPercentage = (value) => `${value}%`;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    UniversalChart,
    {
      ...props,
      type: "combo",
      data,
      series,
      title: props.title || "Financial Overview",
      xAxis: { dataKey: "month" },
      yAxis: {
        left: { format: formatCurrency },
        right: { format: formatPercentage, domain: [0, 100] }
      }
    }
  );
}

// src/charts/index.ts
init_OptimizedCharts();

// src/maps/UniversalMap.tsx
var import_react15 = require("react");
var import_framer_motion6 = require("framer-motion");
var import_lucide_react5 = require("lucide-react");
init_cn();
var import_jsx_runtime14 = require("react/jsx-runtime");
var variantStyles2 = {
  admin: {
    primary: "#3B82F6",
    secondary: "#1E40AF",
    accent: "#60A5FA",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444"
  },
  customer: {
    primary: "#10B981",
    secondary: "#047857",
    accent: "#34D399",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444"
  },
  reseller: {
    primary: "#8B5CF6",
    secondary: "#7C3AED",
    accent: "#A78BFA",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444"
  },
  technician: {
    primary: "#EF4444",
    secondary: "#DC2626",
    accent: "#F87171",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#B91C1C"
  },
  management: {
    primary: "#F97316",
    secondary: "#EA580C",
    accent: "#FB923C",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444"
  }
};
var statusColors2 = {
  active: "#10B981",
  online: "#10B981",
  inactive: "#6B7280",
  offline: "#6B7280",
  maintenance: "#F59E0B",
  error: "#EF4444",
  planned: "#8B5CF6",
  in_progress: "#3B82F6",
  completed: "#10B981"
};
var getStatusColor = (status) => {
  if (!status) {
    return statusColors2.active;
  }
  return statusColors2[status] ?? statusColors2.active;
};
var markerIcons = {
  customer: import_lucide_react5.Users,
  tower: import_lucide_react5.Wifi,
  fiber: import_lucide_react5.MapPin,
  technician: import_lucide_react5.Users,
  issue: import_lucide_react5.AlertTriangle,
  poi: import_lucide_react5.MapPin
};
var MockMapCanvas = ({
  markers,
  serviceAreas,
  networkNodes,
  routes,
  onMarkerClick,
  onAreaClick,
  colors,
  showHeatmap,
  height
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "relative bg-gray-100 rounded-lg overflow-hidden", style: { height }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
      "div",
      {
        className: "absolute inset-0 opacity-20",
        style: {
          backgroundImage: "linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }
      }
    ) }),
    serviceAreas?.map((area, index) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
      "div",
      {
        className: "absolute opacity-30 hover:opacity-50 cursor-pointer transition-opacity",
        style: {
          left: `${10 + index * 20}%`,
          top: `${20 + index * 15}%`,
          width: "120px",
          height: "80px",
          backgroundColor: area.color || colors.primary,
          borderRadius: "40px"
        },
        onClick: () => onAreaClick?.(area),
        title: `${area.name} - ${area.serviceLevel} service`
      },
      area.id
    )),
    networkNodes?.map((node, index) => {
      const Icon = node.type === "tower" ? import_lucide_react5.Wifi : import_lucide_react5.MapPin;
      return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        "div",
        {
          className: "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer",
          style: {
            left: `${30 + index * 25}%`,
            top: `${30 + index * 20}%`
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            "div",
            {
              className: "p-2 rounded-full shadow-lg",
              style: { backgroundColor: getStatusColor(node.status) },
              children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Icon, { className: "w-4 h-4 text-white" })
            }
          )
        },
        node.id
      );
    }),
    markers?.map((marker, index) => {
      const Icon = markerIcons[marker.type] || import_lucide_react5.MapPin;
      return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        "div",
        {
          className: "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform",
          style: {
            left: `${15 + index * 12}%`,
            top: `${40 + index * 8}%`
          },
          onClick: () => onMarkerClick?.(marker),
          title: marker.title,
          children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            "div",
            {
              className: "p-1 rounded-full shadow-md border-2 border-white",
              style: {
                backgroundColor: getStatusColor(marker.status ?? "active")
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Icon, { className: "w-3 h-3 text-white" })
            }
          )
        },
        marker.id
      );
    }),
    routes?.map((route, index) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
      "svg",
      {
        className: "absolute inset-0 pointer-events-none",
        style: { width: "100%", height: "100%" },
        children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
          "path",
          {
            d: `M ${20 + index * 30} ${50} L ${80 - index * 20} ${70 + index * 10}`,
            stroke: getStatusColor(route.status),
            strokeWidth: "3",
            strokeDasharray: route.status === "planned" ? "5,5" : void 0,
            fill: "none"
          }
        )
      },
      route.id
    )),
    showHeatmap && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "absolute top-1/4 left-1/4 w-32 h-32 bg-red-500 opacity-20 rounded-full blur-xl" }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "absolute top-1/2 right-1/4 w-24 h-24 bg-yellow-500 opacity-30 rounded-full blur-xl" }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "absolute bottom-1/3 left-1/3 w-20 h-20 bg-green-500 opacity-25 rounded-full blur-xl" })
    ] })
  ] });
};
function UniversalMap({
  type,
  center = { lat: 37.7749, lng: -122.4194 },
  zoom = 10,
  bounds,
  markers = [],
  serviceAreas = [],
  networkNodes = [],
  routes = [],
  variant = "admin",
  showLegend = true,
  showControls = true,
  showHeatmap = false,
  showClusters = false,
  onMarkerClick,
  onAreaClick,
  onNodeClick,
  onMapClick,
  onBoundsChanged,
  filters,
  title,
  height = 400,
  width = "100%",
  loading = false,
  error = null,
  className = ""
}) {
  const [currentZoom, setCurrentZoom] = (0, import_react15.useState)(zoom);
  const [showFilters, setShowFilters] = (0, import_react15.useState)(false);
  const [activeFilters, setActiveFilters] = (0, import_react15.useState)(filters || {});
  const colors = variantStyles2[variant];
  const filteredMarkers = (0, import_react15.useMemo)(() => {
    if (!activeFilters.markerTypes?.length && !activeFilters.statusFilter?.length) {
      return markers;
    }
    return markers.filter((marker) => {
      const typeMatch = !activeFilters.markerTypes?.length || activeFilters.markerTypes.includes(marker.type);
      const statusMatch = !activeFilters.statusFilter?.length || activeFilters.statusFilter.includes(marker.status || "active");
      return typeMatch && statusMatch;
    });
  }, [markers, activeFilters]);
  const filteredAreas = (0, import_react15.useMemo)(() => {
    if (!activeFilters.serviceTypes?.length) return serviceAreas;
    return serviceAreas.filter((area) => activeFilters.serviceTypes.includes(area.type));
  }, [serviceAreas, activeFilters]);
  const filteredNodes = (0, import_react15.useMemo)(() => {
    if (!activeFilters.nodeTypes?.length && !activeFilters.statusFilter?.length) {
      return networkNodes;
    }
    return networkNodes.filter((node) => {
      const typeMatch = !activeFilters.nodeTypes?.length || activeFilters.nodeTypes.includes(node.type);
      const statusMatch = !activeFilters.statusFilter?.length || activeFilters.statusFilter.includes(node.status);
      return typeMatch && statusMatch;
    });
  }, [networkNodes, activeFilters]);
  const handleZoomIn = () => setCurrentZoom((prev) => Math.min(prev + 1, 20));
  const handleZoomOut = () => setCurrentZoom((prev) => Math.max(prev - 1, 1));
  if (loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: cn("bg-white rounded-lg border border-gray-200 p-6", className), children: [
      title && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "w-full bg-gray-200 rounded animate-pulse", style: { height } })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: cn("bg-white rounded-lg border border-gray-200 p-6", className), children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "text-center text-gray-500", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "text-sm", children: "Failed to load map" }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "text-xs text-gray-400 mt-1", children: error })
    ] }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
    import_framer_motion6.motion.div,
    {
      className: cn("bg-white rounded-lg border border-gray-200 overflow-hidden", className),
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      style: { width },
      children: [
        (title || showControls) && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { children: title && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: title }) }),
          showControls && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
              "button",
              {
                onClick: () => setShowFilters(!showFilters),
                className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100",
                title: "Filters",
                children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_lucide_react5.Filter, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("button", { className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_lucide_react5.Layers, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("button", { className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_lucide_react5.Maximize2, { className: "w-4 h-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "relative", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            MockMapCanvas,
            {
              markers: filteredMarkers,
              serviceAreas: filteredAreas,
              networkNodes: filteredNodes,
              routes,
              onMarkerClick,
              onAreaClick,
              colors,
              showHeatmap,
              height
            }
          ),
          showControls && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "absolute top-4 right-4 flex flex-col space-y-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
              "button",
              {
                onClick: handleZoomIn,
                className: "p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow",
                children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_lucide_react5.ZoomIn, { className: "w-4 h-4 text-gray-600" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
              "button",
              {
                onClick: handleZoomOut,
                className: "p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow",
                children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_lucide_react5.ZoomOut, { className: "w-4 h-4 text-gray-600" })
              }
            )
          ] }),
          showLegend && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("h4", { className: "font-medium text-gray-900 mb-2 text-sm", children: "Legend" }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "space-y-1", children: [
              Object.entries(markerIcons).map(([type2, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center space-x-2 text-xs", children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Icon, { className: "w-3 h-3 text-gray-600" }),
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "capitalize text-gray-700", children: type2.replace("_", " ") })
              ] }, type2)),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "mt-2 pt-2 border-t border-gray-200", children: Object.entries(statusColors2).map(([status, color]) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center space-x-2 text-xs", children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "w-2 h-2 rounded-full", style: { backgroundColor: color } }),
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "capitalize text-gray-700", children: status.replace("_", " ") })
              ] }, status)) })
            ] })
          ] }),
          showFilters && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 w-64", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("h4", { className: "font-medium text-gray-900 mb-3", children: "Filters" }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "mb-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Marker Types" }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "mt-1 space-y-1", children: Object.keys(markerIcons).map((type2) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("label", { className: "flex items-center text-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                  "input",
                  {
                    type: "checkbox",
                    className: "mr-2",
                    checked: activeFilters.markerTypes?.includes(type2),
                    onChange: (e) => {
                      const types = activeFilters.markerTypes || [];
                      if (e.target.checked) {
                        setActiveFilters({
                          ...activeFilters,
                          markerTypes: [...types, type2]
                        });
                      } else {
                        setActiveFilters({
                          ...activeFilters,
                          markerTypes: types.filter((t) => t !== type2)
                        });
                      }
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "capitalize", children: type2.replace("_", " ") })
              ] }, type2)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
              "button",
              {
                onClick: () => setShowFilters(false),
                className: "w-full mt-3 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg",
                children: "Close"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "bg-gray-50 px-4 py-3 border-t border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center justify-between text-sm text-gray-600", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center space-x-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { children: [
              "Markers: ",
              filteredMarkers.length
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { children: [
              "Areas: ",
              filteredAreas.length
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { children: [
              "Nodes: ",
              filteredNodes.length
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { children: [
            "Zoom: ",
            currentZoom,
            "x"
          ] })
        ] }) })
      ]
    }
  );
}
var UniversalMap_default = UniversalMap;

// src/maps/LeafletMap.tsx
var import_react16 = require("react");
var import_framer_motion7 = require("framer-motion");
var import_lucide_react6 = require("lucide-react");
init_cn();
var import_jsx_runtime15 = require("react/jsx-runtime");
var leafletModule = null;
var reactLeafletModule = null;
var leafletIconsInitialized = false;
var patchLeafletIcons = (leaflet) => {
  if (leafletIconsInitialized) {
    return;
  }
  delete leaflet.Icon.Default.prototype._getIconUrl;
  leaflet.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
  });
  leafletIconsInitialized = true;
};
var loadLeafletModules = async () => {
  if (typeof window === "undefined") {
    return null;
  }
  if (!leafletModule) {
    const leafletImport = await import("leaflet");
    const resolvedLeaflet = leafletImport.default ?? leafletImport;
    leafletModule = resolvedLeaflet;
    patchLeafletIcons(resolvedLeaflet);
  }
  if (!reactLeafletModule) {
    reactLeafletModule = await import("react-leaflet");
  }
  return {
    leaflet: leafletModule,
    reactLeaflet: reactLeafletModule
  };
};
var createCustomIcon = (leaflet, type, status) => {
  const statusColors3 = {
    active: "#10B981",
    online: "#10B981",
    inactive: "#6B7280",
    offline: "#6B7280",
    maintenance: "#F59E0B",
    error: "#EF4444"
  };
  const color = status ? statusColors3[status] || "#3B82F6" : "#3B82F6";
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        transform: rotate(45deg);
        color: white;
        font-size: 12px;
        font-weight: bold;
      ">
        ${type === "fiber" ? "F" : type === "tower" ? "T" : type === "customer" ? "C" : "\u2022"}
      </div>
    </div>
  `;
  return leaflet.divIcon({
    html: iconHtml,
    className: "custom-marker-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};
var MapControls = ({ onZoomIn, onZoomOut, onReset }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "absolute top-4 right-4 z-[1000] flex flex-col gap-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      import_framer_motion7.motion.button,
      {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        onClick: onZoomIn,
        className: "p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow",
        "aria-label": "Zoom in",
        children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react6.ZoomIn, { className: "h-5 w-5 text-gray-700 dark:text-gray-300" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      import_framer_motion7.motion.button,
      {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        onClick: onZoomOut,
        className: "p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow",
        "aria-label": "Zoom out",
        children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react6.ZoomOut, { className: "h-5 w-5 text-gray-700 dark:text-gray-300" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      import_framer_motion7.motion.button,
      {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        onClick: onReset,
        className: "p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow",
        "aria-label": "Reset view",
        children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react6.Maximize2, { className: "h-5 w-5 text-gray-700 dark:text-gray-300" })
      }
    )
  ] });
};
var LeafletMap = ({
  center = { lat: 0, lng: 0 },
  zoom = 13,
  bounds,
  markers = [],
  serviceAreas = [],
  networkNodes = [],
  routes = [],
  variant = "admin",
  showLegend = true,
  showControls = true,
  onMarkerClick,
  onAreaClick,
  onNodeClick,
  onMapClick,
  title,
  height = 600,
  className,
  loading = false,
  error = null
}) => {
  const [mapZoom, setMapZoom] = (0, import_react16.useState)(zoom);
  const [mapCenter, setMapCenter] = (0, import_react16.useState)(center);
  const [modules, setModules] = (0, import_react16.useState)(null);
  (0, import_react16.useEffect)(() => {
    let cancelled = false;
    if (modules || typeof window === "undefined") {
      return;
    }
    void loadLeafletModules().then((loaded) => {
      if (!cancelled && loaded) {
        setModules(loaded);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [modules]);
  if (!modules) {
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      "div",
      {
        className: cn(
          "flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg",
          className
        ),
        style: { height },
        children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Loading interactive map..." })
        ] })
      }
    );
  }
  const { leaflet: L, reactLeaflet } = modules;
  const { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap } = reactLeaflet;
  const MapControllerComponent = ({
    center: center2,
    zoom: zoom2
  }) => {
    const map = useMap();
    (0, import_react16.useEffect)(() => {
      map.setView([center2.lat, center2.lng], zoom2);
    }, [center2, zoom2, map]);
    return null;
  };
  const variantStyles5 = {
    admin: { primary: "#3B82F6", accent: "#60A5FA" },
    customer: { primary: "#10B981", accent: "#34D399" },
    reseller: { primary: "#8B5CF6", accent: "#A78BFA" },
    technician: { primary: "#EF4444", accent: "#F87171" },
    management: { primary: "#F97316", accent: "#FB923C" }
  };
  const colors = variantStyles5[variant];
  const handleZoomIn = (0, import_react16.useCallback)(() => {
    setMapZoom((prev) => Math.min(prev + 1, 18));
  }, []);
  const handleZoomOut = (0, import_react16.useCallback)(() => {
    setMapZoom((prev) => Math.max(prev - 1, 1));
  }, []);
  const handleReset = (0, import_react16.useCallback)(() => {
    setMapCenter(center);
    setMapZoom(zoom);
  }, [center, zoom]);
  const mapBounds = (0, import_react16.useMemo)(() => {
    if (bounds) {
      return L.latLngBounds([bounds.south, bounds.west], [bounds.north, bounds.east]);
    }
    return void 0;
  }, [bounds, L]);
  const getAreaColor = (area) => {
    const baseColors = {
      fiber: "#3B82F6",
      wireless: "#8B5CF6",
      hybrid: "#10B981"
    };
    return area.color || baseColors[area.type];
  };
  const getRouteColor = (route) => {
    const routeColors = {
      installation: "#10B981",
      maintenance: "#F59E0B",
      emergency: "#EF4444"
    };
    return routeColors[route.type];
  };
  if (loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      "div",
      {
        className: cn(
          "flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg",
          className
        ),
        style: { height },
        children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Loading map..." })
        ] })
      }
    );
  }
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      "div",
      {
        className: cn(
          "flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg",
          className
        ),
        style: { height },
        children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react6.AlertTriangle, { className: "h-12 w-12 text-red-500 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "text-sm text-red-600 dark:text-red-400", children: error })
        ] })
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: cn("relative", className), children: [
    title && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "mb-4", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: title }) }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "relative rounded-lg overflow-hidden shadow-lg", style: { height }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
        MapContainer,
        {
          center: [mapCenter.lat, mapCenter.lng],
          zoom: mapZoom,
          ...mapBounds ? { bounds: mapBounds } : {},
          style: { height: "100%", width: "100%" },
          className: "z-0",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
              TileLayer,
              {
                attribution: '\xA9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(MapControllerComponent, { center: mapCenter, zoom: mapZoom }),
            serviceAreas.map((area) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
              Polygon,
              {
                positions: area.polygon.map((coord) => [coord.lat, coord.lng]),
                pathOptions: {
                  color: getAreaColor(area),
                  fillColor: getAreaColor(area),
                  fillOpacity: 0.2,
                  weight: 2
                },
                eventHandlers: {
                  click: () => onAreaClick?.(area)
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Popup, { children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "p-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h4", { className: "font-semibold mb-1", children: area.name }),
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "text-sm text-gray-600", children: [
                    "Type: ",
                    area.type
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "text-sm text-gray-600", children: [
                    "Max Speed: ",
                    area.maxSpeed,
                    " Mbps"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "text-sm text-gray-600", children: [
                    "Coverage: ",
                    area.coverage,
                    "%"
                  ] }),
                  area.customers && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "text-sm text-gray-600", children: [
                    "Customers: ",
                    area.customers
                  ] })
                ] }) })
              },
              area.id
            )),
            routes.map((route) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
              Polyline,
              {
                positions: route.waypoints.map((coord) => [coord.lat, coord.lng]),
                pathOptions: {
                  color: getRouteColor(route),
                  weight: 4,
                  opacity: 0.7
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Popup, { children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "p-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h4", { className: "font-semibold mb-1", children: route.name }),
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "text-sm text-gray-600", children: [
                    "Type: ",
                    route.type
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "text-sm text-gray-600", children: [
                    "Status: ",
                    route.status
                  ] }),
                  route.technician && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "text-sm text-gray-600", children: [
                    "Technician: ",
                    route.technician
                  ] }),
                  route.estimatedTime && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "text-sm text-gray-600", children: [
                    "ETA: ",
                    route.estimatedTime,
                    " min"
                  ] })
                ] }) })
              },
              route.id
            )),
            networkNodes.map((node) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
              Marker,
              {
                position: [node.position.lat, node.position.lng],
                icon: createCustomIcon(L, "fiber", node.status),
                eventHandlers: {
                  click: () => onNodeClick?.(node)
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Popup, { children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "p-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h4", { className: "font-semibold mb-1", children: node.name }),
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "text-sm text-gray-600", children: [
                    "Type: ",
                    node.type
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "text-sm", children: [
                    "Status:",
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
                      "span",
                      {
                        className: cn(
                          "font-medium",
                          node.status === "online" && "text-green-600",
                          node.status === "offline" && "text-gray-600",
                          node.status === "maintenance" && "text-yellow-600",
                          node.status === "error" && "text-red-600"
                        ),
                        children: node.status
                      }
                    )
                  ] }),
                  node.metrics && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(import_jsx_runtime15.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "text-sm text-gray-600", children: [
                      "Uptime: ",
                      node.metrics.uptime,
                      "%"
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "text-sm text-gray-600", children: [
                      "Load: ",
                      node.metrics.load,
                      "%"
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "text-sm text-gray-600", children: [
                      "Latency: ",
                      node.metrics.latency,
                      "ms"
                    ] })
                  ] })
                ] }) })
              },
              node.id
            )),
            markers.map((marker) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
              Marker,
              {
                position: [marker.position.lat, marker.position.lng],
                icon: createCustomIcon(L, marker.type, marker.status),
                eventHandlers: {
                  click: () => {
                    onMarkerClick?.(marker);
                    marker.onClick?.();
                  }
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Popup, { children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "p-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h4", { className: "font-semibold mb-1", children: marker.title }),
                  marker.description && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "text-sm text-gray-600 mb-2", children: marker.description }),
                  marker.status && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "text-sm", children: [
                    "Status:",
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
                      "span",
                      {
                        className: cn(
                          "font-medium",
                          marker.status === "active" && "text-green-600",
                          marker.status === "inactive" && "text-gray-600",
                          marker.status === "maintenance" && "text-yellow-600",
                          marker.status === "error" && "text-red-600"
                        ),
                        children: marker.status
                      }
                    )
                  ] })
                ] }) })
              },
              marker.id
            ))
          ]
        }
      ),
      showControls && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(MapControls, { onZoomIn: handleZoomIn, onZoomOut: handleZoomOut, onReset: handleReset }),
      showLegend && (markers.length > 0 || networkNodes.length > 0 || serviceAreas.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "absolute bottom-4 left-4 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("h4", { className: "text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react6.Layers, { className: "h-4 w-4" }),
          "Legend"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "space-y-2 text-xs", children: [
          markers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Markers" }),
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "flex flex-wrap gap-2", children: Array.from(new Set(markers.map((m) => m.type))).map((type) => /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "w-3 h-3 rounded-full bg-blue-500" }),
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "text-gray-600 dark:text-gray-400 capitalize", children: type })
            ] }, type)) })
          ] }),
          networkNodes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Network Nodes" }),
            /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "w-3 h-3 rounded-full bg-green-500" }),
                /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "text-gray-600 dark:text-gray-400", children: "Online" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "w-3 h-3 rounded-full bg-red-500" }),
                /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "text-gray-600 dark:text-gray-400", children: "Error" })
              ] })
            ] })
          ] }),
          serviceAreas.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Service Areas" }),
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "flex flex-wrap gap-2", children: Array.from(new Set(serviceAreas.map((a) => a.type))).map((type) => /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
                "div",
                {
                  className: "w-3 h-3 rounded-full",
                  style: {
                    backgroundColor: type === "fiber" ? "#3B82F6" : type === "wireless" ? "#8B5CF6" : "#10B981"
                  }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "text-gray-600 dark:text-gray-400 capitalize", children: type })
            ] }, type)) })
          ] })
        ] })
      ] })
    ] })
  ] });
};

// src/maps/NetworkTopologyMap.tsx
var import_jsx_runtime16 = require("react/jsx-runtime");
var statusColor = {
  online: "#22c55e",
  offline: "#ef4444",
  degraded: "#f97316",
  maintenance: "#facc15"
};
function NetworkTopologyMap({
  nodes,
  networkNodes,
  height,
  onNodeClick,
  variant = "admin",
  onNodeSelect,
  showLegend
}) {
  const nodeList = networkNodes ?? nodes ?? [];
  const statusMap = {
    online: "active",
    offline: "inactive",
    maintenance: "maintenance",
    degraded: "error"
  };
  const markerTypeMap = {
    tower: "tower",
    fiber_node: "fiber",
    router: "fiber",
    switch: "fiber",
    server: "poi"
  };
  const nodeTypeMap = {
    tower: "tower",
    fiber_node: "fiber_node",
    router: "router",
    switch: "switch",
    server: "server"
  };
  const markers = nodeList.map((node) => ({
    id: node.id,
    position: node.coordinates,
    title: node.name,
    type: markerTypeMap[node.type] ?? "poi",
    status: statusMap[node.status] ?? "active",
    ...node.metadata ? { metadata: node.metadata } : {},
    color: statusColor[node.status] ?? "#3b82f6"
  }));
  const mapNodes = nodeList.map((node) => ({
    id: node.id,
    type: nodeTypeMap[node.type] ?? "router",
    position: node.coordinates,
    status: node.status === "online" ? "online" : node.status === "offline" ? "offline" : node.status === "maintenance" ? "maintenance" : "error",
    name: node.name
  }));
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
    UniversalMap,
    {
      type: "network_topology",
      markers,
      networkNodes: mapNodes,
      height: height ?? 360,
      variant,
      ...showLegend !== void 0 ? { showLegend } : {},
      onMarkerClick: (marker) => {
        const node = nodeList.find((n) => n.id === marker.id);
        if (node) {
          onNodeClick?.(node);
          onNodeSelect?.(node);
        }
      }
    }
  );
}

// src/maps/MapLibrary.tsx
var import_jsx_runtime17 = require("react/jsx-runtime");
function ServiceCoverageMap({
  serviceAreas,
  showCoverageHeatmap = false,
  showCustomerDensity = false,
  onServiceAreaSelect,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
    UniversalMap,
    {
      ...props,
      type: "service_coverage",
      serviceAreas,
      showHeatmap: showCoverageHeatmap,
      ...onServiceAreaSelect ? { onAreaClick: onServiceAreaSelect } : {},
      title: props.title || "Service Coverage Areas"
    }
  );
}
function CustomerLocationMap({
  customers,
  showClusters = true,
  filterByPlan,
  onCustomerSelect,
  ...props
}) {
  const markers = customers.filter((customer) => !filterByPlan || filterByPlan.includes(customer.plan)).map((customer) => ({
    id: customer.id,
    position: customer.location,
    type: "customer",
    status: customer.status === "active" ? "active" : "inactive",
    title: customer.name,
    description: `Plan: ${customer.plan} - Status: ${customer.status}`,
    metadata: { plan: customer.plan, revenue: customer.revenue },
    onClick: () => onCustomerSelect?.(customer)
  }));
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
    UniversalMap,
    {
      ...props,
      type: "customer_locations",
      markers,
      showClusters,
      onMarkerClick: (marker) => {
        const customer = customers.find((c) => c.id === marker.id);
        if (customer) onCustomerSelect?.(customer);
      },
      title: props.title || "Customer Locations"
    }
  );
}
function TechnicianRouteMap({
  routes,
  technicians,
  workOrders = [],
  onRouteSelect,
  onTechnicianSelect,
  ...props
}) {
  const technicianMarkers = technicians.map((tech) => ({
    id: tech.id,
    position: tech.location,
    type: "technician",
    status: tech.status === "available" ? "active" : tech.status === "busy" ? "maintenance" : "inactive",
    title: tech.name,
    description: `Status: ${tech.status}${tech.currentJob ? ` - Job: ${tech.currentJob}` : ""}`,
    metadata: { currentJob: tech.currentJob },
    onClick: () => onTechnicianSelect?.(tech)
  }));
  const workOrderMarkers = workOrders.map((order) => ({
    id: order.id,
    position: order.location,
    type: order.type === "repair" ? "issue" : "poi",
    status: order.priority === "urgent" ? "error" : order.priority === "high" ? "maintenance" : "active",
    title: `${order.type} - ${order.priority} priority`,
    description: order.assignedTechnician ? `Assigned to: ${order.assignedTechnician}` : "Unassigned",
    metadata: {
      priority: order.priority,
      assignedTechnician: order.assignedTechnician
    }
  }));
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
    UniversalMap,
    {
      ...props,
      type: "technician_routes",
      routes,
      markers: [...technicianMarkers, ...workOrderMarkers],
      onMarkerClick: (marker) => {
        if (marker.type === "technician") {
          const tech = technicians.find((t) => t.id === marker.id);
          if (tech) onTechnicianSelect?.(tech);
        }
      },
      title: props.title || "Technician Routes & Work Orders"
    }
  );
}
function NetworkOutageMap({ outages, onOutageSelect, ...props }) {
  const outageMarkers = outages.map((outage) => ({
    id: outage.id,
    position: outage.location,
    type: "issue",
    status: outage.severity === "critical" ? "error" : outage.severity === "major" ? "maintenance" : "inactive",
    title: `${outage.severity.toUpperCase()} Outage`,
    description: `${outage.affectedCustomers} customers affected - ${outage.description}`,
    metadata: {
      severity: outage.severity,
      affectedCustomers: outage.affectedCustomers,
      estimatedResolution: outage.estimatedResolution
    },
    onClick: () => onOutageSelect?.(outage)
  }));
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
    UniversalMap,
    {
      ...props,
      type: "service_coverage",
      markers: outageMarkers,
      showHeatmap: true,
      onMarkerClick: (marker) => {
        const outage = outages.find((o) => o.id === marker.id);
        if (outage) onOutageSelect?.(outage);
      },
      title: props.title || "Network Outages"
    }
  );
}
function SignalStrengthMap({
  signalData,
  technologyFilter,
  ...props
}) {
  const filteredData = technologyFilter ? signalData.filter((data) => technologyFilter.includes(data.technology)) : signalData;
  const markers = filteredData.map((data, index) => {
    const strengthLevel = data.strength > -70 ? "active" : data.strength > -85 ? "maintenance" : "error";
    return {
      id: `signal-${index}`,
      position: data.location,
      type: "tower",
      status: strengthLevel,
      title: `${data.technology} Signal`,
      description: `${data.strength} dBm @ ${data.frequency} MHz`,
      metadata: {
        strength: data.strength,
        frequency: data.frequency,
        technology: data.technology
      }
    };
  });
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
    UniversalMap,
    {
      ...props,
      type: "service_coverage",
      markers,
      showHeatmap: true,
      title: props.title || "Signal Strength Coverage"
    }
  );
}

// src/visualizations/UniversalDataTable.tsx
var import_react17 = require("react");
var import_framer_motion8 = require("framer-motion");
var import_lucide_react7 = require("lucide-react");
init_cn();
var import_jsx_runtime18 = require("react/jsx-runtime");
var formatValue = (value, column) => {
  if (value === null || value === void 0) return "-";
  switch (column.format) {
    case "currency":
      const currency = column.currency || "USD";
      const precision = column.precision || 2;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision
      }).format(Number(value));
    case "percentage":
      return `${Number(value).toFixed(column.precision || 1)}%`;
    case "number":
      return Number(value).toLocaleString("en-US", {
        minimumFractionDigits: column.precision || 0,
        maximumFractionDigits: column.precision || 2
      });
    case "date":
      const date = new Date(value);
      return date.toLocaleDateString();
    case "status":
      return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
        "span",
        {
          className: cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            value === "active" && "bg-green-100 text-green-800",
            value === "inactive" && "bg-gray-100 text-gray-800",
            value === "pending" && "bg-yellow-100 text-yellow-800",
            value === "error" && "bg-red-100 text-red-800"
          ),
          children: String(value).charAt(0).toUpperCase() + String(value).slice(1)
        }
      );
    case "badge":
      return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full", children: value });
    default:
      return String(value);
  }
};
var sizeClasses2 = {
  sm: {
    table: "text-sm",
    cell: "px-3 py-2",
    header: "px-3 py-3"
  },
  md: {
    table: "text-sm",
    cell: "px-4 py-3",
    header: "px-4 py-4"
  },
  lg: {
    table: "text-base",
    cell: "px-6 py-4",
    header: "px-6 py-5"
  }
};
function UniversalDataTable({
  data,
  columns,
  actions = [],
  rowActions = [],
  bulkActions = [],
  sortable = true,
  filterable = true,
  searchable = true,
  paginated = true,
  selectable = false,
  exportable = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onSelectionChange,
  rowSelection = "multiple",
  variant = "default",
  size = "md",
  stickyHeader = false,
  loading = false,
  error = null,
  emptyMessage = "No data available",
  onRowClick,
  onSort,
  onFilter,
  onSearch,
  title,
  subtitle,
  className = "",
  maxHeight
}) {
  const [currentPage, setCurrentPage] = (0, import_react17.useState)(1);
  const [currentPageSize, setCurrentPageSize] = (0, import_react17.useState)(pageSize);
  const [sortColumn, setSortColumn] = (0, import_react17.useState)("");
  const [sortDirection, setSortDirection] = (0, import_react17.useState)("asc");
  const [searchQuery, setSearchQuery] = (0, import_react17.useState)("");
  const [filters, setFilters] = (0, import_react17.useState)({});
  const [selectedRows, setSelectedRows] = (0, import_react17.useState)([]);
  const [showFilters, setShowFilters] = (0, import_react17.useState)(false);
  const sizes = sizeClasses2[size];
  const filteredData = (0, import_react17.useMemo)(() => {
    let filtered = data;
    if (searchQuery) {
      filtered = filtered.filter((row) => {
        return columns.some((column) => {
          if (!column.searchable) return false;
          const value = row[column.key];
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        });
      });
    }
    Object.entries(filters).forEach(([columnKey, filterValue]) => {
      if (filterValue !== "" && filterValue !== null && filterValue !== void 0) {
        filtered = filtered.filter((row) => {
          const value = row[columnKey];
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        });
      }
    });
    return filtered;
  }, [data, searchQuery, filters, columns]);
  const sortedData = (0, import_react17.useMemo)(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue === bValue) return 0;
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);
  const paginatedData = (0, import_react17.useMemo)(() => {
    if (!paginated) return sortedData;
    const startIndex = (currentPage - 1) * currentPageSize;
    return sortedData.slice(startIndex, startIndex + currentPageSize);
  }, [sortedData, currentPage, currentPageSize, paginated]);
  const totalPages = Math.ceil(filteredData.length / currentPageSize);
  const handleSort = (0, import_react17.useCallback)(
    (column) => {
      if (!column.sortable) return;
      const newDirection = sortColumn === column.key && sortDirection === "asc" ? "desc" : "asc";
      setSortColumn(column.key);
      setSortDirection(newDirection);
      onSort?.(column.key, newDirection);
    },
    [sortColumn, sortDirection, onSort]
  );
  const handleRowSelection = (0, import_react17.useCallback)(
    (row, checked) => {
      let newSelection;
      if (rowSelection === "single") {
        newSelection = checked ? [row] : [];
      } else {
        newSelection = checked ? [...selectedRows, row] : selectedRows.filter((r) => r !== row);
      }
      setSelectedRows(newSelection);
      onSelectionChange?.(newSelection);
    },
    [selectedRows, rowSelection, onSelectionChange]
  );
  const handleSelectAll = (0, import_react17.useCallback)(
    (checked) => {
      const newSelection = checked ? paginatedData : [];
      setSelectedRows(newSelection);
      onSelectionChange?.(newSelection);
    },
    [paginatedData, onSelectionChange]
  );
  const isRowSelected = (0, import_react17.useCallback)(
    (row) => {
      return selectedRows.includes(row);
    },
    [selectedRows]
  );
  const areAllRowsSelected = paginatedData.length > 0 && paginatedData.every((row) => isRowSelected(row));
  const areSomeRowsSelected = selectedRows.length > 0 && !areAllRowsSelected;
  const handleExport = (0, import_react17.useCallback)(() => {
    const csvContent = [
      columns.map((col) => col.label).join(","),
      ...filteredData.map(
        (row) => columns.map((col) => {
          const value = row[col.key];
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(",")
      )
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "data"}-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filteredData, columns, title]);
  if (loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: cn("bg-white rounded-lg border border-gray-200", className), children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "p-6", children: [
      title && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "space-y-3", children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex space-x-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "h-4 bg-gray-200 rounded flex-1 animate-pulse" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "h-4 bg-gray-200 rounded w-24 animate-pulse" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "h-4 bg-gray-200 rounded w-32 animate-pulse" })
      ] }, i)) })
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: cn("bg-white rounded-lg border border-gray-200 p-6", className), children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "text-center text-gray-500", children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-sm", children: "Failed to load table data" }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-xs text-gray-400 mt-1", children: error })
    ] }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
    import_framer_motion8.motion.div,
    {
      className: cn("bg-white rounded-lg border border-gray-200", className),
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      children: [
        (title || subtitle || actions.length > 0 || searchable || exportable) && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex items-start justify-between p-6 border-b border-gray-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { children: [
            title && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: title }),
            subtitle && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-sm text-gray-600 mt-1", children: subtitle })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex items-center space-x-2", children: [
            searchable && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react7.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                "input",
                {
                  type: "text",
                  placeholder: "Search...",
                  value: searchQuery,
                  onChange: (e) => {
                    setSearchQuery(e.target.value);
                    onSearch?.(e.target.value);
                  },
                  className: "pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }
              )
            ] }),
            filterable && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              "button",
              {
                onClick: () => setShowFilters(!showFilters),
                className: cn(
                  "p-2 rounded-lg border border-gray-300 hover:bg-gray-50",
                  showFilters && "bg-blue-50 border-blue-300"
                ),
                children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react7.Filter, { className: "w-4 h-4 text-gray-600" })
              }
            ),
            exportable && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              "button",
              {
                onClick: handleExport,
                className: "p-2 rounded-lg border border-gray-300 hover:bg-gray-50",
                title: "Export CSV",
                children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react7.Download, { className: "w-4 h-4 text-gray-600" })
              }
            ),
            bulkActions.length > 0 && selectedRows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("span", { className: "text-sm text-gray-600", children: [
                selectedRows.length,
                " selected"
              ] }),
              bulkActions.map((action) => {
                const Icon = action.icon;
                return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
                  "button",
                  {
                    onClick: () => action.onClick(selectedRows, selectedRows.length),
                    className: cn(
                      "px-3 py-2 rounded-lg text-sm font-medium",
                      action.variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
                      (!action.variant || action.variant === "secondary") && "bg-gray-600 text-white hover:bg-gray-700"
                    ),
                    children: [
                      Icon && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Icon, { className: "w-4 h-4 mr-1 inline" }),
                      action.label
                    ]
                  },
                  action.id
                );
              })
            ] }),
            actions.map((action) => {
              const Icon = action.icon;
              return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
                "button",
                {
                  onClick: () => action.onClick(filteredData, -1),
                  className: cn(
                    "px-3 py-2 rounded-lg text-sm font-medium",
                    action.variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
                    (!action.variant || action.variant === "secondary") && "bg-gray-600 text-white hover:bg-gray-700"
                  ),
                  children: [
                    Icon && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Icon, { className: "w-4 h-4 mr-1 inline" }),
                    action.label
                  ]
                },
                action.id
              );
            })
          ] })
        ] }),
        showFilters && filterable && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "p-4 border-b border-gray-200 bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: columns.filter((col) => col.filterable).map((column) => /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: column.label }),
          column.filterType === "select" && column.filterOptions ? /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
            "select",
            {
              value: filters[column.key] || "",
              onChange: (e) => {
                const newFilters = {
                  ...filters,
                  [column.key]: e.target.value
                };
                setFilters(newFilters);
                onFilter?.(newFilters);
              },
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("option", { value: "", children: "All" }),
                column.filterOptions.map((option) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("option", { value: option.value, children: option.label }, option.value))
              ]
            }
          ) : /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            "input",
            {
              type: column.filterType || "text",
              value: filters[column.key] || "",
              onChange: (e) => {
                const newFilters = {
                  ...filters,
                  [column.key]: e.target.value
                };
                setFilters(newFilters);
                onFilter?.(newFilters);
              },
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm",
              placeholder: `Filter by ${column.label.toLowerCase()}`
            }
          )
        ] }, column.key)) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "overflow-auto", style: { maxHeight }, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("table", { className: cn("min-w-full divide-y divide-gray-200", sizes.table), children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            "thead",
            {
              className: cn(
                "bg-gray-50",
                variant === "striped" && "bg-gray-100",
                stickyHeader && "sticky top-0 z-10"
              ),
              children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("tr", { children: [
                selectable && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("th", { className: cn("w-12", sizes.header), children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                  "input",
                  {
                    type: "checkbox",
                    checked: areAllRowsSelected,
                    ref: (el) => {
                      if (el) el.indeterminate = areSomeRowsSelected;
                    },
                    onChange: (e) => handleSelectAll(e.target.checked),
                    className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  }
                ) }),
                columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                  "th",
                  {
                    className: cn(
                      "text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                      sizes.header,
                      column.headerClassName,
                      column.sortable && "cursor-pointer hover:bg-gray-100",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right"
                    ),
                    style: { width: column.width },
                    onClick: () => handleSort(column),
                    children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex items-center space-x-1", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { children: column.label }),
                      column.sortable && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex flex-col", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                          import_lucide_react7.ChevronUp,
                          {
                            className: cn(
                              "w-3 h-3",
                              sortColumn === column.key && sortDirection === "asc" ? "text-blue-600" : "text-gray-400"
                            )
                          }
                        ),
                        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                          import_lucide_react7.ChevronDown,
                          {
                            className: cn(
                              "w-3 h-3 -mt-1",
                              sortColumn === column.key && sortDirection === "desc" ? "text-blue-600" : "text-gray-400"
                            )
                          }
                        )
                      ] })
                    ] })
                  },
                  column.key
                )),
                rowActions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("th", { className: cn("w-12", sizes.header), children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "sr-only", children: "Actions" }) })
              ] })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            "tbody",
            {
              className: cn(
                "bg-white divide-y divide-gray-200",
                variant === "striped" && "divide-gray-100"
              ),
              children: paginatedData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                "td",
                {
                  colSpan: columns.length + (selectable ? 1 : 0) + (rowActions.length > 0 ? 1 : 0),
                  className: cn("text-center text-gray-500 py-12", sizes.cell),
                  children: emptyMessage
                }
              ) }) : paginatedData.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
                "tr",
                {
                  className: cn(
                    variant === "striped" && index % 2 === 1 && "bg-gray-50",
                    variant === "bordered" && "border-b border-gray-200",
                    onRowClick && "cursor-pointer hover:bg-gray-50",
                    isRowSelected(row) && "bg-blue-50"
                  ),
                  onClick: () => onRowClick?.(row, index),
                  children: [
                    selectable && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("td", { className: sizes.cell, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                      "input",
                      {
                        type: "checkbox",
                        checked: isRowSelected(row),
                        onChange: (e) => {
                          e.stopPropagation();
                          handleRowSelection(row, e.target.checked);
                        },
                        className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      }
                    ) }),
                    columns.map((column) => {
                      const value = row[column.key];
                      const cellClassName = typeof column.cellClassName === "function" ? column.cellClassName(value, row) : column.cellClassName;
                      return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                        "td",
                        {
                          className: cn(
                            "text-gray-900",
                            sizes.cell,
                            cellClassName,
                            column.align === "center" && "text-center",
                            column.align === "right" && "text-right"
                          ),
                          children: column.render ? column.render(value, row, index) : formatValue(value, column)
                        },
                        column.key
                      );
                    }),
                    rowActions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("td", { className: sizes.cell, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "flex items-center space-x-1", children: rowActions.map((action) => {
                      if (action.condition && !action.condition(row)) return null;
                      const Icon = action.icon;
                      return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                        "button",
                        {
                          onClick: (e) => {
                            e.stopPropagation();
                            action.onClick(row, index);
                          },
                          className: cn(
                            "p-1 rounded hover:bg-gray-100",
                            action.variant === "danger" && "text-red-600 hover:bg-red-50"
                          ),
                          title: action.label,
                          children: Icon && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Icon, { className: "w-4 h-4" })
                        },
                        action.id
                      );
                    }) }) })
                  ]
                },
                index
              ))
            }
          )
        ] }) }),
        paginated && totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex items-center justify-between px-6 py-4 border-t border-gray-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("span", { className: "text-sm text-gray-700", children: [
              "Showing ",
              (currentPage - 1) * currentPageSize + 1,
              " to",
              " ",
              Math.min(currentPage * currentPageSize, filteredData.length),
              " of",
              " ",
              filteredData.length,
              " entries"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              "select",
              {
                value: currentPageSize,
                onChange: (e) => {
                  setCurrentPageSize(Number(e.target.value));
                  setCurrentPage(1);
                },
                className: "px-2 py-1 border border-gray-300 rounded text-sm",
                children: pageSizeOptions.map((size2) => /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("option", { value: size2, children: [
                  size2,
                  " per page"
                ] }, size2))
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex items-center space-x-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              "button",
              {
                onClick: () => setCurrentPage(1),
                disabled: currentPage === 1,
                className: "p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
                children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react7.ChevronsLeft, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              "button",
              {
                onClick: () => setCurrentPage(currentPage - 1),
                disabled: currentPage === 1,
                className: "p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
                children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react7.ChevronLeft, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("span", { className: "px-3 py-2 text-sm", children: [
              "Page ",
              currentPage,
              " of ",
              totalPages
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              "button",
              {
                onClick: () => setCurrentPage(currentPage + 1),
                disabled: currentPage === totalPages,
                className: "p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
                children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react7.ChevronRight, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              "button",
              {
                onClick: () => setCurrentPage(totalPages),
                disabled: currentPage === totalPages,
                className: "p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
                children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react7.ChevronsRight, { className: "w-4 h-4" })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
var UniversalDataTable_default = UniversalDataTable;

// src/error/ErrorBoundary.tsx
var import_lucide_react8 = require("lucide-react");
var import_react18 = __toESM(require("react"));
var import_jsx_runtime19 = require("react/jsx-runtime");
var ErrorBoundary2 = class extends import_react18.Component {
  retryTimeoutId = null;
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, errorId: null };
  }
  static getDerivedStateFromError(error) {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId
    };
  }
  componentDidCatch(error, errorInfo) {
    const { onError } = this.props;
    const { errorId } = this.state;
    this.setState({ errorInfo });
    if (onError && errorId) {
      onError(error, errorInfo, errorId);
    }
    if (typeof window !== "undefined" && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        },
        tags: {
          errorBoundary: this.props.level || "unknown",
          errorId
        }
      });
    }
  }
  handleRetry = () => {
    if (this.retryTimeoutId) {
      window.clearTimeout(this.retryTimeoutId);
    }
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
  };
  handleReload = () => {
    window.location.reload();
  };
  render() {
    const { hasError, error, errorInfo, errorId } = this.state;
    const {
      children,
      fallback,
      level = "component",
      enableRetry = true,
      showErrorDetails = typeof process !== "undefined" && process.env?.NODE_ENV === "development"
    } = this.props;
    if (hasError && error) {
      if (fallback && errorInfo) {
        return fallback(error, errorInfo, this.handleRetry);
      }
      return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
        ErrorFallback,
        {
          error,
          level,
          enableRetry,
          showErrorDetails,
          onRetry: this.handleRetry,
          onReload: this.handleReload,
          ...errorInfo ? { errorInfo } : {},
          ...errorId ? { errorId } : {}
        }
      );
    }
    return children;
  }
};
function ErrorFallback({
  error,
  errorInfo,
  errorId,
  level,
  enableRetry,
  showErrorDetails,
  onRetry,
  onReload
}) {
  const getErrorTitle = () => {
    switch (level) {
      case "page":
        return "Something went wrong with this page";
      case "section":
        return "This section encountered an error";
      case "component":
        return "Something went wrong";
      default:
        return "An unexpected error occurred";
    }
  };
  const getErrorDescription = () => {
    switch (level) {
      case "page":
        return "The page failed to load properly. You can try refreshing or go back to the dashboard.";
      case "section":
        return "This section of the page failed to load. Try refreshing to see if that resolves the issue.";
      case "component":
        return "A component failed to render. This might be temporary.";
      default:
        return "We encountered an unexpected error. Please try again.";
    }
  };
  const getLevelStyles = () => {
    switch (level) {
      case "page":
        return "min-h-screen flex items-center justify-center bg-gray-50";
      case "section":
        return "min-h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200";
      case "component":
        return "p-4 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg";
      default:
        return "p-4 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg";
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: getLevelStyles(), children: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "mx-auto max-w-md text-center", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "mb-4 flex justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react8.AlertTriangle, { className: "h-12 w-12 text-red-500" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("h3", { className: "mb-2 font-semibold text-gray-900 text-lg", children: getErrorTitle() }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("p", { className: "mb-6 text-gray-600", children: getErrorDescription() }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "flex flex-col justify-center gap-3 sm:flex-row", children: [
      enableRetry ? /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
        "button",
        {
          type: "button",
          onClick: onRetry,
          onKeyDown: (e) => e.key === "Enter" && onRetry,
          className: "inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react8.RefreshCw, { className: "mr-2 h-4 w-4" }),
            "Try Again"
          ]
        }
      ) : null,
      level === "page" && /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(import_jsx_runtime19.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
          "button",
          {
            type: "button",
            onClick: onReload,
            onKeyDown: (e) => e.key === "Enter" && onReload,
            className: "inline-flex items-center rounded-lg bg-gray-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react8.RefreshCw, { className: "mr-2 h-4 w-4" }),
              "Reload Page"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
          "button",
          {
            type: "button",
            onClick: () => window.location.href = "/",
            className: "inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react8.Home, { className: "mr-2 h-4 w-4" }),
              "Go to Dashboard"
            ]
          }
        )
      ] })
    ] }),
    showErrorDetails ? /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("details", { className: "mt-6 text-left", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("summary", { className: "cursor-pointer font-medium text-gray-700 text-sm hover:text-gray-900", children: "Technical Details" }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "mt-2 max-h-40 overflow-auto rounded-lg bg-gray-100 p-4 font-mono text-gray-800 text-xs", children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("strong", { children: "Error ID:" }),
          " ",
          errorId
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("strong", { children: "Error:" }),
          " ",
          error.message
        ] }),
        error.stack ? /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("strong", { children: "Stack:" }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("pre", { className: "mt-1 whitespace-pre-wrap", children: error.stack })
        ] }) : null,
        errorInfo?.componentStack ? /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("strong", { children: "Component Stack:" }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("pre", { className: "mt-1 whitespace-pre-wrap", children: errorInfo.componentStack })
        ] }) : null
      ] })
    ] }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "mt-6 rounded-lg bg-blue-50 p-4", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "flex items-center justify-center text-blue-800", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react8.MessageSquare, { className: "mr-2 h-4 w-4" }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("span", { className: "text-sm", children: [
        "Need help? Contact support with error ID:",
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("code", { className: "font-mono text-xs", children: errorId })
      ] })
    ] }) })
  ] }) });
}
function useErrorHandler() {
  return import_react18.default.useCallback((error, context) => {
    const errorId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    if (typeof window !== "undefined" && window.Sentry) {
      window.Sentry.captureException(error, {
        tags: {
          context: context || "manual",
          errorId
        }
      });
    }
    return errorId;
  }, []);
}
function withErrorBoundary(WrappedComponent, errorBoundaryProps) {
  const WithErrorBoundaryComponent = (props) => /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(ErrorBoundary2, { ...errorBoundaryProps, children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(WrappedComponent, { ...props }) });
  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;
  return WithErrorBoundaryComponent;
}

// src/feedback/Feedback.tsx
var import_react_slot2 = require("@radix-ui/react-slot");
var ToastPrimitive = __toESM(require("@radix-ui/react-toast"));
var import_class_variance_authority4 = require("class-variance-authority");
var import_clsx6 = require("clsx");
var import_lucide_react9 = require("lucide-react");
var import_react19 = __toESM(require("react"));
var import_jsx_runtime20 = require("react/jsx-runtime");
var toastVariants = (0, import_class_variance_authority4.cva)("", {
  variants: {
    variant: {
      default: "",
      success: "",
      error: "",
      warning: "",
      info: ""
    },
    position: {
      "top-left": "",
      "top-center": "",
      "top-right": "",
      "bottom-left": "",
      "bottom-center": "",
      "bottom-right": ""
    }
  },
  defaultVariants: {
    variant: "default",
    position: "top-right"
  }
});
var alertVariants = (0, import_class_variance_authority4.cva)("", {
  variants: {
    variant: {
      default: "",
      success: "",
      error: "",
      warning: "",
      info: ""
    },
    size: {
      sm: "",
      md: "",
      lg: ""
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md"
  }
});
var loadingVariants = (0, import_class_variance_authority4.cva)("", {
  variants: {
    variant: {
      spinner: "",
      dots: "",
      pulse: "",
      skeleton: ""
    },
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: ""
    }
  },
  defaultVariants: {
    variant: "spinner",
    size: "md"
  }
});
var feedbackVariants = (0, import_class_variance_authority4.cva)(
  "feedback relative flex flex-col gap-3 rounded-lg border bg-background p-4 text-sm shadow-sm",
  {
    variants: {
      variant: {
        default: "variant-default border-border text-foreground",
        success: "variant-success border-emerald-200 bg-emerald-50 text-emerald-900",
        error: "variant-error border-red-200 bg-red-50 text-red-900",
        warning: "variant-warning border-amber-200 bg-amber-50 text-amber-900",
        info: "variant-info border-blue-200 bg-blue-50 text-blue-900"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
var Feedback = (0, import_react19.forwardRef)(
  ({
    className,
    variant,
    dismissible = false,
    onDismiss,
    autoHide = false,
    autoHideDelay = 5e3,
    loading = false,
    children,
    ...props
  }, ref) => {
    const [visible, setVisible] = (0, import_react19.useState)(true);
    const handleDismiss = (0, import_react19.useCallback)(() => {
      if (!visible) {
        return;
      }
      onDismiss?.();
      setVisible(false);
    }, [onDismiss, visible]);
    (0, import_react19.useEffect)(() => {
      if (!autoHide || !visible) {
        return;
      }
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }, [autoHide, autoHideDelay, handleDismiss, visible]);
    if (!visible) {
      return null;
    }
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { ref, className: (0, import_clsx6.clsx)(feedbackVariants({ variant }), className), ...props, children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "flex flex-col gap-2", children }),
      loading ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "div",
        {
          role: "progressbar",
          "aria-hidden": "true",
          className: "feedback-loading h-1 w-full overflow-hidden rounded bg-muted",
          children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: "sr-only", children: "Loading" })
        }
      ) : null,
      dismissible ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "button",
        {
          type: "button",
          className: "feedback-dismiss absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          onClick: handleDismiss,
          "aria-label": "Dismiss feedback",
          children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react9.X, { className: "h-4 w-4", "aria-hidden": "true" })
        }
      ) : null
    ] });
  }
);
Feedback.displayName = "Feedback";
var FeedbackTitle = (0, import_react19.forwardRef)(
  ({ as: Tag = "h3", className, ...props }, ref) => {
    const Component3 = Tag;
    return import_react19.default.createElement(Component3, {
      ...props,
      ref,
      className: (0, import_clsx6.clsx)("feedback-title font-semibold leading-snug", className)
    });
  }
);
FeedbackTitle.displayName = "FeedbackTitle";
var FeedbackDescription = (0, import_react19.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
  "p",
  {
    ref,
    className: (0, import_clsx6.clsx)("feedback-description text-sm text-muted-foreground", className),
    ...props
  }
));
FeedbackDescription.displayName = "FeedbackDescription";
var FeedbackActions = (0, import_react19.forwardRef)(
  ({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    "div",
    {
      ref,
      className: (0, import_clsx6.clsx)("feedback-actions flex flex-wrap gap-2", className),
      ...props
    }
  )
);
FeedbackActions.displayName = "FeedbackActions";
var ToastContext = (0, import_react19.createContext)(null);
function ToastProvider({
  children,
  swipeDirection = "right",
  swipeThreshold = 50,
  duration = 5e3
}) {
  const [toasts, setToasts] = (0, import_react19.useState)([]);
  const addToast = (0, import_react19.useCallback)(
    (toast) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = {
        ...toast,
        id,
        duration: toast.duration ?? duration
      };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    [duration]
  );
  const removeToast = (0, import_react19.useCallback)((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  const removeAllToasts = (0, import_react19.useCallback)(() => {
    setToasts([]);
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ToastContext.Provider, { value: { toasts, addToast, removeToast, removeAllToasts }, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(ToastPrimitive.Provider, { swipeDirection, swipeThreshold, children: [
    children,
    toasts.map((toast) => {
      const action = toast.action;
      return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
        Toast,
        {
          open: true,
          onOpenChange: (open) => {
            if (!open) {
              removeToast(toast.id);
              toast.onClose?.();
            }
          },
          ...toast.duration !== void 0 ? { duration: toast.duration } : {},
          ...toast.variant ? { variant: toast.variant } : {},
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(ToastContent, { children: [
              toast.title ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ToastTitle, { children: toast.title }) : null,
              toast.description ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ToastDescription, { children: toast.description }) : null
            ] }),
            action ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
              ToastAction,
              {
                altText: action.altText ?? action.label,
                onClick: action.onClick,
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    action.onClick();
                  }
                },
                children: action.label
              }
            ) : null,
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ToastClose, {})
          ]
        },
        toast.id
      );
    }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ToastViewport, {})
  ] }) });
}
var ToastViewport = (0, import_react19.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ToastPrimitive.Viewport, { ref, className: (0, import_clsx6.clsx)("toast-viewport", className), ...props }));
var Toast = (0, import_react19.forwardRef)(
  ({ className, variant, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    ToastPrimitive.Root,
    {
      ref,
      className: (0, import_clsx6.clsx)(toastVariants({ variant }), "toast", className),
      ...props
    }
  )
);
var ToastContent = (0, import_react19.forwardRef)(
  ({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { ref, className: (0, import_clsx6.clsx)("toast-content", className), ...props })
);
var ToastTitle = (0, import_react19.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ToastPrimitive.Title, { ref, className: (0, import_clsx6.clsx)("toast-title", className), ...props }));
var ToastDescription = (0, import_react19.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
  ToastPrimitive.Description,
  {
    ref,
    className: (0, import_clsx6.clsx)("toast-description", className),
    ...props
  }
));
var ToastAction = (0, import_react19.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ToastPrimitive.Action, { ref, className: (0, import_clsx6.clsx)("toast-action", className), ...props }));
var ToastClose = (0, import_react19.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
  ToastPrimitive.Close,
  {
    ref,
    className: (0, import_clsx6.clsx)("toast-close", className),
    "toast-close": "",
    ...props,
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react9.X, { className: "toast-close-icon" }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: "sr-only", children: "Close" })
    ]
  }
));
var Alert = (0, import_react19.forwardRef)(
  ({
    className,
    variant,
    size,
    icon,
    closable = false,
    onClose,
    children,
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot2.Slot : "div";
    const defaultIcons = {
      default: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react9.Info, { className: "alert-icon" }),
      success: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react9.CheckCircle, { className: "alert-icon" }),
      error: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react9.AlertCircle, { className: "alert-icon" }),
      warning: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react9.AlertTriangle, { className: "alert-icon" }),
      info: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react9.Info, { className: "alert-icon" })
    };
    const displayIcon = icon ?? (variant ? defaultIcons[variant] : defaultIcons.default);
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
      Comp,
      {
        ref,
        className: (0, import_clsx6.clsx)(alertVariants({ variant, size }), "alert", className),
        role: "alert",
        ...props,
        children: [
          displayIcon ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "alert-icon-wrapper", children: displayIcon }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "alert-content", children }),
          closable ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
            "button",
            {
              type: "button",
              className: "alert-close",
              onClick: onClose,
              onKeyDown: (e) => e.key === "Enter" && onClose,
              "aria-label": "Close alert",
              children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react9.X, { className: "alert-close-icon" })
            }
          ) : null
        ]
      }
    );
  }
);
var AlertTitle = (0, import_react19.forwardRef)(
  ({ className, asChild = false, ...props }, _ref) => {
    const Comp = asChild ? import_react_slot2.Slot : "h5";
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Comp, { ref: _ref, className: (0, import_clsx6.clsx)("alert-title", className), ...props });
  }
);
var AlertDescription = (0, import_react19.forwardRef)(
  ({ className, asChild = false, ...props }, _ref) => {
    const Comp = asChild ? import_react_slot2.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Comp, { ref: _ref, className: (0, import_clsx6.clsx)("alert-description", className), ...props });
  }
);
var Loading = (0, import_react19.forwardRef)(
  ({ className, variant, size, text, overlay = false, asChild = false, ...props }, _ref) => {
    const Comp = asChild ? import_react_slot2.Slot : "div";
    const renderSpinner = () => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "loading-spinner", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "spinner" }) });
    const renderDots = () => /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "loading-dots", children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "dot" }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "dot" }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "dot" })
    ] });
    const renderPulse = () => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "loading-pulse", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "pulse" }) });
    const renderContent = () => {
      switch (variant) {
        case "spinner":
          return renderSpinner();
        case "dots":
          return renderDots();
        case "pulse":
          return renderPulse();
        case "skeleton":
          return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "loading-skeleton" });
        default:
          return renderSpinner();
      }
    };
    const content = /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
      Comp,
      {
        ref: _ref,
        className: (0, import_clsx6.clsx)(
          loadingVariants({ variant, size }),
          "loading",
          { "loading-overlay": overlay },
          className
        ),
        role: "alert",
        "aria-live": "polite",
        "aria-label": text || "Loading",
        ...props,
        children: [
          renderContent(),
          text ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: "loading-text", children: text }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: "sr-only", children: text || "Loading..." })
        ]
      }
    );
    if (overlay) {
      return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "loading-overlay-container", children: content });
    }
    return content;
  }
);
var LoadingSkeleton = (0, import_react19.forwardRef)(
  ({ className, lines = 3, avatar = false, width, height, asChild = false, ...props }, _ref) => {
    const Comp = asChild ? import_react_slot2.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(Comp, { ref: _ref, className: (0, import_clsx6.clsx)("loading-skeleton-container", className), ...props, children: [
      avatar ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "skeleton-avatar" }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "skeleton-content", children: Array.from({ length: lines }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "div",
        {
          className: "skeleton-line",
          style: {
            width: i === lines - 1 ? "60%" : width,
            height
          }
        },
        `item-${i}`
      )) })
    ] });
  }
);
var Progress = (0, import_react19.forwardRef)(
  ({
    className,
    value = 0,
    max = 100,
    indeterminate = false,
    size = "md",
    variant = "default",
    showValue = false,
    label,
    ...props
  }, ref) => {
    const percentage = indeterminate ? 0 : Math.min(Math.max(value / max * 100, 0), 100);
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
      "div",
      {
        ref,
        className: (0, import_clsx6.clsx)(
          "progress-container",
          `size-${size}`,
          `variant-${variant}`,
          { indeterminate },
          className
        ),
        ...props,
        children: [
          label || showValue ? /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "progress-header", children: [
            label ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: "progress-label", children: label }) : null,
            showValue && !indeterminate ? /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("span", { className: "progress-value", children: [
              Math.round(percentage),
              "%"
            ] }) : null
          ] }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
            "div",
            {
              className: "progress-track",
              role: "progressbar",
              "aria-valuenow": indeterminate ? void 0 : value,
              "aria-valuemin": 0,
              "aria-valuemax": max,
              "aria-label": label,
              children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
                "div",
                {
                  className: "progress-indicator",
                  style: {
                    transform: `translateX(-${100 - percentage}%)`
                  }
                }
              )
            }
          )
        ]
      }
    );
  }
);
var PresenceIndicator = (0, import_react19.forwardRef)(
  ({ className, status, size = "md", withPulse = false, label, ...props }, _ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
      "div",
      {
        ref: _ref,
        className: (0, import_clsx6.clsx)(
          "status-indicator",
          `status-${status}`,
          `size-${size}`,
          { "with-pulse": withPulse },
          className
        ),
        title: label || status,
        ...props,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "status-dot" }),
          withPulse ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "status-pulse" }) : null,
          label ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: "status-label", children: label }) : null
        ]
      }
    );
  }
);
ToastViewport.displayName = "ToastViewport";
Toast.displayName = "Toast";
ToastContent.displayName = "ToastContent";
ToastTitle.displayName = "ToastTitle";
ToastDescription.displayName = "ToastDescription";
ToastAction.displayName = "ToastAction";
ToastClose.displayName = "ToastClose";
Alert.displayName = "Alert";
AlertTitle.displayName = "AlertTitle";
AlertDescription.displayName = "AlertDescription";
Loading.displayName = "Loading";
LoadingSkeleton.displayName = "LoadingSkeleton";
Progress.displayName = "Progress";
PresenceIndicator.displayName = "PresenceIndicator";

// src/feedback/NotificationSystem.tsx
var import_react20 = require("react");
var import_jsx_runtime21 = require("react/jsx-runtime");
var defaultSettings = {
  enableBrowser: true,
  enableWebSocket: true,
  enableEmail: false,
  enableSMS: false,
  enablePush: false,
  soundEnabled: true,
  maxNotifications: 100,
  autoHideDelay: 5e3,
  priorities: {
    low: true,
    medium: true,
    high: true,
    critical: true
  },
  channels: {
    browser: true,
    websocket: true,
    email: false,
    sms: false,
    push: false
  }
};
var initialState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  settings: defaultSettings
};
function notificationReducer(state, action) {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      const notification = action.payload;
      const notifications = [notification, ...state.notifications].slice(
        0,
        state.settings.maxNotifications
      );
      return {
        ...state,
        notifications,
        unreadCount: state.unreadCount + (notification.read ? 0 : 1)
      };
    }
    case "REMOVE_NOTIFICATION": {
      const notifications = state.notifications.filter((n) => n.id !== action.payload);
      const removedNotification = state.notifications.find((n) => n.id === action.payload);
      const unreadCount = removedNotification && !removedNotification.read ? state.unreadCount - 1 : state.unreadCount;
      return {
        ...state,
        notifications,
        unreadCount: Math.max(0, unreadCount)
      };
    }
    case "MARK_READ": {
      const notifications = state.notifications.map(
        (n) => n.id === action.payload ? { ...n, read: true } : n
      );
      const notification = state.notifications.find((n) => n.id === action.payload);
      const unreadCount = notification && !notification.read ? state.unreadCount - 1 : state.unreadCount;
      return {
        ...state,
        notifications,
        unreadCount: Math.max(0, unreadCount)
      };
    }
    case "MARK_ALL_READ": {
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0
      };
    }
    case "CLEAR_ALL": {
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      };
    }
    case "UPDATE_SETTINGS": {
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    }
    case "SET_CONNECTION_STATUS": {
      return {
        ...state,
        isConnected: action.payload
      };
    }
    case "CLEANUP_EXPIRED": {
      const now = /* @__PURE__ */ new Date();
      const notifications = state.notifications.filter((n) => !n.expiresAt || n.expiresAt > now);
      const expiredCount = state.notifications.length - notifications.length;
      const expiredUnread = state.notifications.filter(
        (n) => n.expiresAt && n.expiresAt <= now && !n.read
      ).length;
      return {
        ...state,
        notifications,
        unreadCount: Math.max(0, state.unreadCount - expiredUnread)
      };
    }
    default:
      return state;
  }
}
var NotificationContext = (0, import_react20.createContext)(null);
function NotificationProvider({
  children,
  websocketUrl,
  apiKey,
  userId,
  tenantId,
  onError,
  maxNotifications,
  defaultDuration
}) {
  const [state, dispatch] = (0, import_react20.useReducer)(notificationReducer, initialState);
  const websocketRef = (0, import_react20.useRef)(null);
  const cleanupIntervalRef = (0, import_react20.useRef)(null);
  const soundRef = (0, import_react20.useRef)(null);
  const generateId2 = (0, import_react20.useCallback)(() => {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);
  const playNotificationSound = (0, import_react20.useCallback)(
    (type) => {
      if (!state.settings.soundEnabled) return;
      try {
        if (!soundRef.current) {
          soundRef.current = new Audio();
          soundRef.current.preload = "auto";
        }
        const soundMap = {
          success: "/sounds/notification-success.wav",
          error: "/sounds/notification-error.wav",
          warning: "/sounds/notification-warning.wav",
          info: "/sounds/notification-info.wav",
          system: "/sounds/notification-system.wav"
        };
        soundRef.current.src = soundMap[type] || soundMap.info;
        soundRef.current.volume = 0.6;
        soundRef.current.play().catch(() => {
        });
      } catch (error) {
        console.warn("Failed to play notification sound:", error);
      }
    },
    [state.settings.soundEnabled]
  );
  const showBrowserNotification = (0, import_react20.useCallback)(
    async (notification) => {
      if (!state.settings.enableBrowser || !("Notification" in window)) return;
      try {
        let permission = Notification.permission;
        if (permission === "default") {
          permission = await Notification.requestPermission();
        }
        if (permission === "granted") {
          const browserNotification = new Notification(notification.title, {
            body: notification.message,
            icon: `/icons/notification-${notification.type}.png`,
            badge: "/icons/badge.png",
            tag: notification.id,
            requireInteraction: notification.priority === "critical"
          });
          browserNotification.onclick = () => {
            window.focus();
            dispatch({ type: "MARK_READ", payload: notification.id });
            browserNotification.close();
          };
          if (notification.priority !== "critical" && state.settings.autoHideDelay > 0) {
            setTimeout(() => {
              browserNotification.close();
            }, state.settings.autoHideDelay);
          }
        }
      } catch (error) {
        console.warn("Failed to show browser notification:", error);
      }
    },
    [state.settings]
  );
  const connect = (0, import_react20.useCallback)(() => {
    if (!websocketUrl || !state.settings.enableWebSocket) return;
    try {
      if (websocketRef.current?.readyState === WebSocket.OPEN) return;
      const ws = new WebSocket(websocketUrl);
      websocketRef.current = ws;
      ws.onopen = () => {
        dispatch({ type: "SET_CONNECTION_STATUS", payload: true });
        if (apiKey || userId) {
          ws.send(
            JSON.stringify({
              type: "auth",
              apiKey,
              userId,
              tenantId
            })
          );
        }
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "notification") {
            const notification = {
              ...data.notification,
              id: generateId2(),
              timestamp: new Date(data.notification.timestamp || Date.now()),
              read: false
            };
            dispatch({ type: "ADD_NOTIFICATION", payload: notification });
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };
      ws.onclose = () => {
        dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
        setTimeout(() => {
          if (state.settings.enableWebSocket) {
            connect();
          }
        }, 5e3);
      };
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        onError?.(new Error("WebSocket connection failed"));
        dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
      };
    } catch (error) {
      console.error("Failed to establish WebSocket connection:", error);
      onError?.(error);
    }
  }, [websocketUrl, state.settings.enableWebSocket, apiKey, userId, tenantId, onError, generateId2]);
  const disconnect = (0, import_react20.useCallback)(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
  }, []);
  const addNotification = (0, import_react20.useCallback)(
    (notificationData) => {
      const notification = {
        ...notificationData,
        id: generateId2(),
        timestamp: /* @__PURE__ */ new Date(),
        read: false
      };
      const shouldShow = state.settings.priorities[notification.priority] && notification.channel.some((ch) => state.settings.channels[ch]);
      if (!shouldShow) return;
      dispatch({ type: "ADD_NOTIFICATION", payload: notification });
      if (notification.channel.includes("browser")) {
        showBrowserNotification(notification);
      }
      if (["high", "critical"].includes(notification.priority)) {
        playNotificationSound(notification.type);
      }
    },
    [generateId2, state.settings, showBrowserNotification, playNotificationSound]
  );
  const removeNotification = (0, import_react20.useCallback)((id) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  }, []);
  const markAsRead = (0, import_react20.useCallback)((id) => {
    dispatch({ type: "MARK_READ", payload: id });
  }, []);
  const markAllAsRead = (0, import_react20.useCallback)(() => {
    dispatch({ type: "MARK_ALL_READ" });
  }, []);
  const clearAll = (0, import_react20.useCallback)(() => {
    dispatch({ type: "CLEAR_ALL" });
  }, []);
  const updateSettings = (0, import_react20.useCallback)((settings) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: settings });
  }, []);
  (0, import_react20.useEffect)(() => {
    cleanupIntervalRef.current = setInterval(() => {
      dispatch({ type: "CLEANUP_EXPIRED" });
    }, 6e4);
    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
    };
  }, []);
  (0, import_react20.useEffect)(() => {
    if (websocketUrl && state.settings.enableWebSocket) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [websocketUrl, state.settings.enableWebSocket, connect, disconnect]);
  (0, import_react20.useEffect)(() => {
    if (typeof maxNotifications === "number" && maxNotifications > 0) {
      dispatch({ type: "UPDATE_SETTINGS", payload: { maxNotifications } });
    }
  }, [maxNotifications]);
  (0, import_react20.useEffect)(() => {
    if (typeof defaultDuration === "number" && defaultDuration > 0) {
      dispatch({ type: "UPDATE_SETTINGS", payload: { autoHideDelay: defaultDuration } });
    }
  }, [defaultDuration]);
  const contextValue = (0, import_react20.useMemo)(
    () => ({
      state,
      addNotification,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      clearNotifications: clearAll,
      updateSettings,
      connect,
      disconnect
    }),
    [
      state,
      addNotification,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      updateSettings,
      connect,
      disconnect
    ]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(NotificationContext.Provider, { value: contextValue, children });
}
function useNotifications() {
  const context = (0, import_react20.useContext)(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
function NotificationList({
  className = "",
  maxVisible = 5,
  position = "top-right",
  showActions = true,
  onNotificationClick
}) {
  const { state, removeNotification, markAsRead } = useNotifications();
  const visibleNotifications = (0, import_react20.useMemo)(() => {
    return state.notifications.filter((n) => !n.persistent || !n.read).slice(0, maxVisible);
  }, [state.notifications, maxVisible]);
  const positionClasses = {
    "top-right": "fixed top-4 right-4 z-50",
    "top-left": "fixed top-4 left-4 z-50",
    "bottom-right": "fixed bottom-4 right-4 z-50",
    "bottom-left": "fixed bottom-4 left-4 z-50"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: `${positionClasses[position]} space-y-2 ${className}`, children: visibleNotifications.map((notification) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    NotificationItem,
    {
      notification,
      showActions,
      onClose: () => removeNotification(notification.id),
      onRead: () => markAsRead(notification.id),
      onClick: () => onNotificationClick?.(notification)
    },
    notification.id
  )) });
}
function NotificationItem({
  notification,
  showActions,
  onClose,
  onRead,
  onClick
}) {
  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    system: "bg-gray-50 border-gray-200 text-gray-800"
  };
  const priorityIcons = {
    low: "\u{1F4E2}",
    medium: "\u26A0\uFE0F",
    high: "\u{1F514}",
    critical: "\u{1F6A8}"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(
    "div",
    {
      className: `
        max-w-sm p-4 border rounded-lg shadow-lg cursor-pointer transition-all duration-300
        ${typeStyles[notification.type]}
        ${!notification.read ? "ring-2 ring-blue-500 ring-opacity-30" : ""}
      `,
      onClick,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex items-start space-x-2 flex-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "text-lg", children: priorityIcons[notification.priority] }),
            /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("h4", { className: "font-semibold text-sm truncate", children: notification.title }),
              /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { className: "text-sm mt-1 break-words", children: notification.message }),
              /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { className: "text-xs mt-2 opacity-70", children: notification.timestamp.toLocaleTimeString() })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex items-center space-x-1 ml-2", children: [
            !notification.read && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onRead();
                },
                className: "text-xs bg-white bg-opacity-50 hover:bg-opacity-75 px-2 py-1 rounded",
                title: "Mark as read",
                children: "\u2713"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onClose();
                },
                className: "text-xs bg-white bg-opacity-50 hover:bg-opacity-75 px-2 py-1 rounded",
                title: "Close",
                children: "\u2715"
              }
            )
          ] })
        ] }),
        showActions && notification.actions && notification.actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "flex space-x-2 mt-3 pt-3 border-t border-current border-opacity-20", children: notification.actions.map((action) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              action.handler(notification);
            },
            className: `
                text-xs px-3 py-1 rounded transition-colors
                ${action.type === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                ${action.type === "secondary" ? "bg-gray-300 text-gray-700 hover:bg-gray-400" : ""}
                ${action.type === "danger" ? "bg-red-600 text-white hover:bg-red-700" : ""}
              `,
            children: action.label
          },
          action.id
        )) })
      ]
    }
  );
}
function NotificationBadge({
  className = "",
  showCount = true,
  maxCount = 99
}) {
  const { state } = useNotifications();
  if (state.unreadCount === 0) {
    return null;
  }
  const displayCount = state.unreadCount > maxCount ? `${maxCount}+` : state.unreadCount;
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    "span",
    {
      className: `
        inline-flex items-center justify-center px-2 py-1 text-xs font-bold 
        leading-none text-white bg-red-600 rounded-full ${className}
      `,
      children: showCount ? displayCount : ""
    }
  );
}
function useToast() {
  const { addNotification, removeNotification, clearNotifications } = useNotifications();
  const toast = (0, import_react20.useCallback)(
    (message, options) => {
      const notificationPayload = {
        title: options?.title || "Notification",
        message,
        type: options?.type || "info",
        priority: options?.priority || "medium",
        channel: options?.channel || ["browser"],
        persistent: options?.persistent || false,
        ...options?.actions ? { actions: options.actions } : {},
        ...options?.metadata ? { metadata: options.metadata } : {},
        ...options?.expiresAt ? { expiresAt: options.expiresAt } : {},
        ...options?.userId ? { userId: options.userId } : {},
        ...options?.tenantId ? { tenantId: options.tenantId } : {}
      };
      return addNotification(notificationPayload);
    },
    [addNotification]
  );
  const success = (0, import_react20.useCallback)(
    (message, title) => {
      return toast(message, { type: "success", title: title || "Success" });
    },
    [toast]
  );
  const error = (0, import_react20.useCallback)(
    (message, title) => {
      return toast(message, { type: "error", title: title || "Error" });
    },
    [toast]
  );
  const warning = (0, import_react20.useCallback)(
    (message, title) => {
      return toast(message, { type: "warning", title: title || "Warning" });
    },
    [toast]
  );
  const info = (0, import_react20.useCallback)(
    (message, title) => {
      return toast(message, { type: "info", title: title || "Info" });
    },
    [toast]
  );
  return {
    toast,
    success,
    error,
    warning,
    info,
    dismiss: removeNotification,
    clear: clearNotifications
  };
}

// src/layout/Card.tsx
var import_react_slot3 = require("@radix-ui/react-slot");
var import_class_variance_authority5 = require("class-variance-authority");
var import_clsx7 = require("clsx");
var import_react21 = require("react");
var import_jsx_runtime22 = require("react/jsx-runtime");
var cardVariants = (0, import_class_variance_authority5.cva)(
  "relative rounded-lg border bg-card text-card-foreground shadow-sm transition-colors",
  {
    variants: {
      variant: {
        default: "border-border",
        outline: "border-border bg-background",
        filled: "border-transparent bg-muted",
        elevated: "border-border shadow-lg",
        ghost: "border-transparent bg-transparent shadow-none"
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-6",
        lg: "p-8"
      },
      interactive: {
        true: "cursor-pointer hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      interactive: false
    }
  }
);
var cardHeaderVariants = (0, import_class_variance_authority5.cva)("flex flex-col space-y-1.5", {
  variants: {
    padding: {
      none: "p-0",
      sm: "p-3",
      default: "p-6",
      lg: "p-8"
    }
  },
  defaultVariants: {
    padding: "default"
  }
});
var cardTitleVariants = (0, import_class_variance_authority5.cva)("text-2xl font-semibold leading-none tracking-tight");
var cardDescriptionVariants = (0, import_class_variance_authority5.cva)("text-sm text-muted-foreground");
var cardContentVariants = (0, import_class_variance_authority5.cva)("", {
  variants: {
    padding: {
      none: "p-0",
      sm: "p-3 pt-0",
      default: "p-6 pt-0",
      lg: "p-8 pt-0"
    }
  },
  defaultVariants: {
    padding: "default"
  }
});
var cardFooterVariants = (0, import_class_variance_authority5.cva)("flex items-center", {
  variants: {
    padding: {
      none: "p-0",
      sm: "p-3 pt-0",
      default: "p-6 pt-0",
      lg: "p-8 pt-0"
    }
  },
  defaultVariants: {
    padding: "default"
  }
});
var Card = (0, import_react21.forwardRef)(
  ({
    className,
    variant,
    padding,
    interactive,
    asChild = false,
    isLoading = false,
    loadingComponent,
    showLoadingOverlay = false,
    children,
    onClick,
    onKeyDown,
    tabIndex,
    role,
    "aria-label": ariaLabel,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot3.Slot : "div";
    const handleKeyDown = (e) => {
      if (interactive && onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick(e);
      }
      onKeyDown?.(e);
    };
    const interactiveAttributes = interactive ? {
      tabIndex: tabIndex ?? 0,
      role: role ?? "button",
      "aria-label": ariaLabel,
      onKeyDown: handleKeyDown
    } : {
      tabIndex,
      role,
      "aria-label": ariaLabel,
      onKeyDown
    };
    const content = /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(import_jsx_runtime22.Fragment, { children: [
      isLoading && showLoadingOverlay && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-background/50", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "animate-spin h-6 w-6 rounded-full border-2 border-primary border-t-transparent" }) }),
      isLoading && loadingComponent ? loadingComponent : children
    ] });
    return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx7.clsx)(cardVariants({ variant, padding, interactive, className })),
        onClick,
        ...interactiveAttributes,
        ...props,
        children: content
      }
    );
  }
);
Card.displayName = "Card";
var CardHeader = (0, import_react21.forwardRef)(
  ({ className, padding, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot3.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Comp, { ref, className: (0, import_clsx7.clsx)(cardHeaderVariants({ padding, className })), ...props });
  }
);
CardHeader.displayName = "CardHeader";
var CardTitle = (0, import_react21.forwardRef)(
  ({ className, level = 3, children, asChild = false, ...props }, ref) => {
    const headingLevel = Math.min(Math.max(level, 1), 6);
    const Tag = `h${headingLevel}`;
    if (asChild) {
      return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_react_slot3.Slot, { className: (0, import_clsx7.clsx)(cardTitleVariants(), className), ...props, children });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Tag, { ref, className: (0, import_clsx7.clsx)(cardTitleVariants(), className), ...props, children });
  }
);
CardTitle.displayName = "CardTitle";
var CardDescription = (0, import_react21.forwardRef)(
  ({ className, asChild = false, children, ...props }, ref) => {
    if (asChild) {
      return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_react_slot3.Slot, { className: (0, import_clsx7.clsx)(cardDescriptionVariants(), className), ...props, children });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("p", { ref, className: (0, import_clsx7.clsx)(cardDescriptionVariants(), className), ...props, children });
  }
);
CardDescription.displayName = "CardDescription";
var CardContent = (0, import_react21.forwardRef)(
  ({ className, padding, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot3.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Comp, { ref, className: (0, import_clsx7.clsx)(cardContentVariants({ padding, className })), ...props });
  }
);
CardContent.displayName = "CardContent";
var CardFooter = (0, import_react21.forwardRef)(
  ({ className, padding, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot3.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Comp, { ref, className: (0, import_clsx7.clsx)(cardFooterVariants({ padding, className })), ...props });
  }
);
CardFooter.displayName = "CardFooter";

// src/layout/Modal.tsx
var import_class_variance_authority6 = require("class-variance-authority");
var import_clsx8 = require("clsx");
var import_react22 = __toESM(require("react"));
var import_jsx_runtime23 = require("react/jsx-runtime");
var modalVariants = (0, import_class_variance_authority6.cva)("modal-container", {
  variants: {
    size: {
      sm: "modal-sm",
      md: "modal-md",
      lg: "modal-lg",
      xl: "modal-xl",
      full: "modal-full"
    },
    variant: {
      default: "modal-default",
      centered: "modal-centered",
      drawer: "modal-drawer",
      sidebar: "modal-sidebar"
    },
    state: {
      closed: "modal-closed",
      opening: "modal-opening",
      open: "modal-open",
      closing: "modal-closing"
    }
  },
  defaultVariants: {
    size: "md",
    variant: "default",
    state: "closed"
  }
});
var ModalFocusUtils = {
  //  // Removed - can't use hooks in objects
  getFocusableElements: (container) => {
    const focusableSelectors = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])'
    ].join(",");
    return Array.from(container.querySelectorAll(focusableSelectors));
  },
  trapFocus: (container, event) => {
    if (event.key !== "Tab") {
      return;
    }
    const focusableElements = ModalFocusUtils.getFocusableElements(container);
    if (focusableElements.length === 0) {
      return;
    }
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  },
  setInitialFocus: (container) => {
    const focusableElements = ModalFocusUtils.getFocusableElements(container);
    const firstElement = focusableElements[0];
    if (firstElement) {
      firstElement.focus();
      return;
    }
    container.focus();
  }
};
var useModalState = (defaultOpen = false, onOpenChange) => {
  const [isOpen, setIsOpen] = (0, import_react22.useState)(defaultOpen);
  const [previousFocus, setPreviousFocus] = (0, import_react22.useState)(null);
  const open = (0, import_react22.useCallback)(() => {
    setPreviousFocus(document.activeElement);
    setIsOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);
  const close = (0, import_react22.useCallback)(() => {
    setIsOpen(false);
    onOpenChange?.(false);
    setTimeout(() => {
      previousFocus?.focus();
    }, 100);
  }, [onOpenChange, previousFocus]);
  const toggle = (0, import_react22.useCallback)(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);
  return {
    isOpen,
    open,
    close,
    toggle
  };
};
var ModalBackdrop = (0, import_react22.forwardRef)(
  ({ className, onClick, closeOnClick = true, "data-testid": dataTestId, ...props }, ref) => {
    const handleClick = (0, import_react22.useCallback)(
      (e) => {
        if (closeOnClick && e.target === e.currentTarget) {
          onClick?.();
        }
      },
      [closeOnClick, onClick]
    );
    return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
      "div",
      {
        ref,
        className: (0, import_clsx8.clsx)("modal-backdrop", className),
        onClick: handleClick,
        onKeyDown: (e) => e.key === "Enter" && handleClick,
        "data-testid": dataTestId ?? "modal-backdrop",
        ...props
      }
    );
  }
);
var ModalContent = (0, import_react22.forwardRef)(
  ({
    className,
    children,
    size,
    variant,
    showClose = true,
    closeOnEscape = true,
    trapFocus = true,
    onClose,
    "data-testid": dataTestId,
    ...props
  }, ref) => {
    const contentRef = import_react22.default.useRef(null);
    const combinedRef = ref || contentRef;
    (0, import_react22.useEffect)(() => {
      const container = combinedRef.current;
      if (!container) {
        return;
      }
      ModalFocusUtils.setInitialFocus(container);
      const handleKeyDown = (e) => {
        if (closeOnEscape && e.key === "Escape") {
          e.preventDefault();
          onClose?.();
          return;
        }
        if (trapFocus) {
          ModalFocusUtils.trapFocus(container, e);
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [closeOnEscape, trapFocus, onClose, combinedRef]);
    return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
      "div",
      {
        ref: combinedRef,
        className: (0, import_clsx8.clsx)(modalVariants({ size, variant }), "modal-content", className),
        role: "dialog",
        "aria-modal": "true",
        tabIndex: -1,
        "data-testid": dataTestId ?? "modal-content",
        ...props,
        children: [
          children,
          showClose && /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
            "button",
            {
              type: "button",
              className: "modal-close",
              onClick: onClose,
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClose?.();
                }
              },
              "aria-label": "Close modal",
              "data-testid": "modal-close",
              children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { "aria-hidden": "true", children: "\xD7" })
            }
          )
        ]
      }
    );
  }
);
var ModalHeader = (0, import_react22.forwardRef)(
  ({ className, children, as: Component3 = "div", ...props }, ref) => {
    const HeaderComponent = Component3;
    const componentProps = {
      ref,
      className: (0, import_clsx8.clsx)("modal-header", className),
      ...props,
      children
    };
    return import_react22.default.createElement(HeaderComponent, componentProps);
  }
);
var ModalTitle = (0, import_react22.forwardRef)(
  ({ className, level = 2, as, children, "data-testid": dataTestId, ...props }, ref) => {
    const clampedLevel = Math.min(Math.max(level, 1), 6);
    const HeadingTag = as ?? `h${clampedLevel}`;
    return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
      HeadingTag,
      {
        ref,
        className: (0, import_clsx8.clsx)("modal-title", className),
        "data-testid": dataTestId ?? "modal-title",
        ...props,
        children
      }
    );
  }
);
var ModalDescription = (0, import_react22.forwardRef)(({ className, children, "data-testid": dataTestId, ...props }, ref) => {
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
    "p",
    {
      ref,
      className: (0, import_clsx8.clsx)("modal-description", className),
      "data-testid": dataTestId ?? "modal-description",
      ...props,
      children
    }
  );
});
var ModalBody = (0, import_react22.forwardRef)(({ className, children, "data-testid": dataTestId, ...props }, ref) => {
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
    "div",
    {
      ref,
      className: (0, import_clsx8.clsx)("modal-body", className),
      "data-testid": dataTestId ?? "modal-body",
      ...props,
      children
    }
  );
});
var ModalFooter = (0, import_react22.forwardRef)(({ className, children, "data-testid": dataTestId, ...props }, ref) => {
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
    "div",
    {
      ref,
      className: (0, import_clsx8.clsx)("modal-footer", className),
      "data-testid": dataTestId ?? "modal-footer",
      ...props,
      children
    }
  );
});
var ModalTrigger = (0, import_react22.forwardRef)(
  ({ className, children, onClick, asChild = false, "data-testid": dataTestId, ...props }, ref) => {
    if (asChild && import_react22.default.isValidElement(children)) {
      return import_react22.default.cloneElement(children, {
        ...children.props,
        onClick: (e) => {
          children.props.onClick?.(e);
          onClick?.(e);
        }
      });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
      "button",
      {
        type: "button",
        ref,
        className: (0, import_clsx8.clsx)("modal-trigger", className),
        onClick,
        "data-testid": dataTestId ?? "modal-trigger",
        ...props,
        children
      }
    );
  }
);
var Modal = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children
}) => {
  const { isOpen: uncontrolledOpen, open, close } = useModalState(defaultOpen, onOpenChange);
  const isOpen = controlledOpen !== void 0 ? controlledOpen : uncontrolledOpen;
  const handleOpenChange = (0, import_react22.useCallback)(
    (newOpen) => {
      if (controlledOpen === void 0) {
        if (newOpen) {
          open();
        } else {
          close();
        }
      } else {
        onOpenChange?.(newOpen);
      }
    },
    [controlledOpen, onOpenChange, open]
  );
  (0, import_react22.useEffect)(() => {
    const handleBodyScroll = () => {
      document.body.style.overflow = isOpen ? "hidden" : "";
    };
    handleBodyScroll();
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  if (!isOpen) {
    return null;
  }
  const childrenWithProps = import_react22.default.Children.map(children, (child) => {
    if (import_react22.default.isValidElement(child)) {
      if (child.type === ModalTrigger) {
        return import_react22.default.cloneElement(child, {
          ...child.props,
          onClick: (e) => {
            child.props.onClick?.(e);
            handleOpenChange(!isOpen);
          }
        });
      }
      if (child.type === ModalContent || child.type === ModalBackdrop) {
        return import_react22.default.cloneElement(child, {
          ...child.props,
          onClose: () => handleOpenChange(false),
          onClick: child.type === ModalBackdrop ? () => handleOpenChange(false) : child.props.onClick
        });
      }
    }
    return child;
  });
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "modal-portal", "data-testid": "modal-portal", children: childrenWithProps });
};
ModalBackdrop.displayName = "ModalBackdrop";
ModalContent.displayName = "ModalContent";
ModalHeader.displayName = "ModalHeader";
ModalTitle.displayName = "ModalTitle";
ModalDescription.displayName = "ModalDescription";
ModalBody.displayName = "ModalBody";
ModalFooter.displayName = "ModalFooter";
ModalTrigger.displayName = "ModalTrigger";
Modal.displayName = "Modal";

// src/layout/Layout.tsx
var import_react_slot4 = require("@radix-ui/react-slot");
var import_class_variance_authority7 = require("class-variance-authority");
var import_clsx9 = require("clsx");
var import_react23 = require("react");
var import_jsx_runtime24 = require("react/jsx-runtime");
var containerVariants = (0, import_class_variance_authority7.cva)("", {
  variants: {
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: "",
      "2xl": "",
      full: ""
    },
    padding: {
      none: "",
      sm: "",
      md: "",
      lg: "",
      xl: ""
    }
  },
  defaultVariants: {
    size: "lg",
    padding: "md"
  }
});
var gridVariants = (0, import_class_variance_authority7.cva)("", {
  variants: {
    cols: {
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
      9: "",
      10: "",
      11: "",
      12: ""
    },
    gap: {
      none: "",
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: ""
    },
    responsive: {
      true: "",
      false: ""
    }
  },
  defaultVariants: {
    cols: 1,
    gap: "md",
    responsive: false
  }
});
var stackVariants = (0, import_class_variance_authority7.cva)("", {
  variants: {
    direction: {
      row: "",
      column: "",
      "row-reverse": "",
      "column-reverse": ""
    },
    gap: {
      none: "",
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: ""
    },
    align: {
      start: "",
      center: "",
      end: "",
      stretch: "",
      baseline: ""
    },
    justify: {
      start: "",
      center: "",
      end: "",
      between: "",
      around: "",
      evenly: ""
    },
    wrap: {
      nowrap: "",
      wrap: "",
      "wrap-reverse": ""
    }
  },
  defaultVariants: {
    direction: "column",
    gap: "md",
    align: "stretch",
    justify: "start",
    wrap: "nowrap"
  }
});
var dashboardVariants = (0, import_class_variance_authority7.cva)("", {
  variants: {
    layout: {
      sidebar: "",
      "sidebar-right": "",
      topbar: "",
      "sidebar-topbar": "",
      fullwidth: ""
    },
    sidebarWidth: {
      sm: "",
      md: "",
      lg: "",
      xl: ""
    },
    responsive: {
      true: "",
      false: ""
    }
  },
  defaultVariants: {
    layout: "sidebar",
    sidebarWidth: "md",
    responsive: true
  }
});
var Container = (0, import_react23.forwardRef)(
  ({ className, size, padding, fluid = false, centerContent = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx9.clsx)(
          containerVariants({ size: fluid ? "full" : size, padding }),
          "container",
          {
            "container-fluid": fluid,
            "container-center": centerContent
          },
          className
        ),
        ...props
      }
    );
  }
);
var Grid = (0, import_react23.forwardRef)(
  ({
    className,
    cols,
    gap,
    responsive,
    autoRows,
    autoCols,
    templateRows,
    templateCols,
    asChild = false,
    style,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "div";
    const gridStyle = {
      ...style,
      ...autoRows && { gridAutoRows: autoRows },
      ...autoCols && { gridAutoColumns: autoCols },
      ...templateRows && { gridTemplateRows: templateRows },
      ...templateCols && { gridTemplateColumns: templateCols }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx9.clsx)(gridVariants({ cols, gap, responsive }), "grid", className),
        style: gridStyle,
        ...props
      }
    );
  }
);
var GridItem = (0, import_react23.forwardRef)(
  ({
    className,
    colSpan,
    rowSpan,
    colStart,
    colEnd,
    rowStart,
    rowEnd,
    asChild = false,
    style,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "div";
    const gridItemStyle = {
      ...style,
      ...colSpan && { gridColumn: `span ${colSpan}` },
      ...rowSpan && { gridRow: `span ${rowSpan}` },
      ...colStart && { gridColumnStart: colStart },
      ...colEnd && { gridColumnEnd: colEnd },
      ...rowStart && { gridRowStart: rowStart },
      ...rowEnd && { gridRowEnd: rowEnd }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Comp, { ref, className: (0, import_clsx9.clsx)("grid-item", className), style: gridItemStyle, ...props });
  }
);
var Stack = (0, import_react23.forwardRef)(
  ({
    className,
    direction,
    gap,
    align,
    justify,
    wrap,
    grow = false,
    shrink = false,
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx9.clsx)(
          stackVariants({ direction, gap, align, justify, wrap }),
          "stack",
          {
            "stack-grow": grow,
            "stack-shrink": shrink
          },
          className
        ),
        ...props
      }
    );
  }
);
var HStack = (0, import_react23.forwardRef)((props, ref) => {
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Stack, { ref, direction: "row", ...props });
});
var VStack = (0, import_react23.forwardRef)((props, ref) => {
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Stack, { ref, direction: "column", ...props });
});
var Dashboard = (0, import_react23.forwardRef)(
  ({
    className,
    layout,
    sidebarWidth,
    responsive,
    sidebar,
    topbar,
    footer,
    children,
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
      Comp,
      {
        ref,
        className: (0, import_clsx9.clsx)(
          dashboardVariants({ layout, sidebarWidth, responsive }),
          "dashboard",
          className
        ),
        ...props,
        children: [
          (layout === "sidebar" || layout === "sidebar-right" || layout === "sidebar-topbar") && sidebar ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("aside", { className: "dashboard-sidebar", children: sidebar }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "dashboard-main", children: [
            (layout === "topbar" || layout === "sidebar-topbar") && topbar ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("header", { className: "dashboard-topbar", children: topbar }) : null,
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("main", { className: "dashboard-content", children }),
            footer ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("footer", { className: "dashboard-footer", children: footer }) : null
          ] })
        ]
      }
    );
  }
);
var Section = (0, import_react23.forwardRef)(
  ({ className, padding = "md", margin = "none", asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "section";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx9.clsx)("section", `padding-${padding}`, `margin-${margin}`, className),
        ...props
      }
    );
  }
);
var Card2 = (0, import_react23.forwardRef)(
  ({
    className,
    variant = "default",
    padding = "md",
    interactive = false,
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx9.clsx)(
          "card",
          `variant-${variant}`,
          `padding-${padding}`,
          {
            interactive
          },
          className
        ),
        ...props
      }
    );
  }
);
var CardHeader2 = (0, import_react23.forwardRef)(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Comp, { ref, className: (0, import_clsx9.clsx)("card-header", className), ...props });
  }
);
var CardContent2 = (0, import_react23.forwardRef)(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Comp, { ref, className: (0, import_clsx9.clsx)("card-content", className), ...props });
  }
);
var CardFooter2 = (0, import_react23.forwardRef)(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Comp, { ref, className: (0, import_clsx9.clsx)("card-footer", className), ...props });
  }
);
var Divider = (0, import_react23.forwardRef)(
  ({ className, orientation = "horizontal", decorative = false, label, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "div";
    if (label) {
      return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        Comp,
        {
          ref,
          className: (0, import_clsx9.clsx)("divider", "divider-with-label", `orientation-${orientation}`, className),
          role: decorative ? "presentation" : "separator",
          "aria-orientation": orientation,
          ...props,
          children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "divider-label", children: label })
        }
      );
    }
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx9.clsx)("divider", `orientation-${orientation}`, className),
        role: decorative ? "presentation" : "separator",
        "aria-orientation": orientation,
        ...props
      }
    );
  }
);
var Spacer = (0, import_react23.forwardRef)(
  ({ className, size = "md", axis = "vertical", asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx9.clsx)("spacer", `size-${size}`, `axis-${axis}`, className),
        "aria-hidden": "true",
        ...props
      }
    );
  }
);
var Center = (0, import_react23.forwardRef)(
  ({ className, axis = "both", asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Comp, { ref, className: (0, import_clsx9.clsx)("center", `axis-${axis}`, className), ...props });
  }
);
var layoutVariants = (0, import_class_variance_authority7.cva)("", {
  variants: {
    variant: {
      default: "",
      "sidebar-left": "variant-sidebar-left",
      "sidebar-right": "variant-sidebar-right",
      "sidebar-both": "variant-sidebar-both"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});
var layoutHeaderVariants = (0, import_class_variance_authority7.cva)("", {
  variants: {
    height: {
      default: "",
      tall: "",
      compact: ""
    }
  },
  defaultVariants: {
    height: "default"
  }
});
var layoutContentVariants = (0, import_class_variance_authority7.cva)("", {
  variants: {
    padding: {
      none: "",
      small: "",
      medium: "",
      large: ""
    }
  },
  defaultVariants: {
    padding: "medium"
  }
});
var layoutSidebarVariants = (0, import_class_variance_authority7.cva)("", {
  variants: {
    position: {
      left: "position-left",
      right: "position-right"
    },
    width: {
      narrow: "width-narrow",
      default: "",
      wide: "width-wide"
    }
  },
  defaultVariants: {
    position: "left",
    width: "default"
  }
});
var Layout = (0, import_react23.forwardRef)(
  ({ className, variant, responsive = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx9.clsx)(
          layoutVariants({ variant }),
          "layout",
          {
            responsive
          },
          className
        ),
        ...props
      }
    );
  }
);
var LayoutHeader = (0, import_react23.forwardRef)(
  ({ className, height, sticky = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "header";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx9.clsx)(
          layoutHeaderVariants({ height }),
          "layout-header",
          {
            sticky
          },
          className
        ),
        ...props
      }
    );
  }
);
var LayoutContent = (0, import_react23.forwardRef)(
  ({ className, padding, scrollable = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "main";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx9.clsx)(
          layoutContentVariants({ padding }),
          "layout-content",
          {
            scrollable
          },
          className
        ),
        ...props
      }
    );
  }
);
var LayoutSidebar = (0, import_react23.forwardRef)(
  ({
    className,
    position,
    width,
    collapsible = false,
    collapsed = false,
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "aside";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx9.clsx)(
          layoutSidebarVariants({ position, width }),
          "layout-sidebar",
          {
            collapsible,
            collapsed
          },
          className
        ),
        ...props
      }
    );
  }
);
var LayoutFooter = (0, import_react23.forwardRef)(
  ({ className, sticky = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot4.Slot : "footer";
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx9.clsx)(
          "layout-footer",
          {
            sticky
          },
          className
        ),
        ...props
      }
    );
  }
);
Container.displayName = "Container";
Grid.displayName = "Grid";
GridItem.displayName = "GridItem";
Stack.displayName = "Stack";
HStack.displayName = "HStack";
VStack.displayName = "VStack";
Dashboard.displayName = "Dashboard";
Section.displayName = "Section";
Card2.displayName = "Card";
CardHeader2.displayName = "CardHeader";
CardContent2.displayName = "CardContent";
CardFooter2.displayName = "CardFooter";
Divider.displayName = "Divider";
Spacer.displayName = "Spacer";
Center.displayName = "Center";
Layout.displayName = "Layout";
LayoutHeader.displayName = "LayoutHeader";
LayoutContent.displayName = "LayoutContent";
LayoutSidebar.displayName = "LayoutSidebar";
LayoutFooter.displayName = "LayoutFooter";

// src/layout/UniversalHeader.tsx
var import_react24 = require("react");
var import_framer_motion9 = require("framer-motion");
var import_lucide_react10 = require("lucide-react");

// src/ui/OptimizedImage.tsx
var React16 = __toESM(require("react"));
var import_jsx_runtime25 = (
  // eslint-disable-next-line @next/next/no-img-element
  require("react/jsx-runtime")
);
var OptimizedImage = React16.forwardRef(
  ({ src, alt, width, height, priority = false, className, onLoadStart, role, ...props }, ref) => {
    const internalRef = React16.useRef(null);
    const setRefs = React16.useCallback(
      (node) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );
    React16.useEffect(() => {
      const node = internalRef.current;
      if (!node || !onLoadStart) {
        return;
      }
      const handler = (event) => {
        onLoadStart(event);
      };
      node.addEventListener("loadstart", handler);
      return () => node.removeEventListener("loadstart", handler);
    }, [onLoadStart]);
    return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
      "img",
      {
        ref: setRefs,
        src,
        alt,
        width,
        height,
        className,
        loading: priority ? "eager" : "lazy",
        decoding: "async",
        role: role ?? "img",
        ...props
      }
    );
  }
);
OptimizedImage.displayName = "OptimizedImage";

// src/layout/UniversalHeader.tsx
var import_jsx_runtime26 = require("react/jsx-runtime");
var variantStyles3 = {
  admin: {
    container: "bg-slate-900 border-slate-700",
    text: "text-slate-100",
    accent: "text-blue-400",
    hover: "hover:bg-slate-800"
  },
  customer: {
    container: "bg-white border-gray-200 shadow-sm",
    text: "text-gray-900",
    accent: "text-blue-600",
    hover: "hover:bg-gray-50"
  },
  reseller: {
    container: "bg-gradient-to-r from-purple-600 to-blue-600 border-transparent",
    text: "text-white",
    accent: "text-purple-200",
    hover: "hover:bg-white/10"
  },
  technician: {
    container: "bg-green-700 border-green-600",
    text: "text-white",
    accent: "text-green-200",
    hover: "hover:bg-green-600"
  },
  management: {
    container: "bg-gray-900 border-gray-700",
    text: "text-white",
    accent: "text-orange-400",
    hover: "hover:bg-gray-800"
  }
};
var defaultActions = {
  admin: [
    {
      id: "notifications",
      label: "Notifications",
      icon: (props) => /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.Bell, { ...props }),
      onClick: () => {
      },
      badge: 3
    },
    {
      id: "settings",
      label: "Settings",
      icon: (props) => /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.Settings, { ...props }),
      onClick: () => {
      }
    }
  ],
  customer: [
    { id: "help", label: "Help", icon: (props) => /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.HelpCircle, { ...props }), onClick: () => {
    } },
    {
      id: "notifications",
      label: "Notifications",
      icon: (props) => /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.Bell, { ...props }),
      onClick: () => {
      },
      badge: 2
    }
  ],
  reseller: [
    {
      id: "notifications",
      label: "Notifications",
      icon: (props) => /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.Bell, { ...props }),
      onClick: () => {
      },
      badge: 5
    },
    {
      id: "settings",
      label: "Settings",
      icon: (props) => /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.Settings, { ...props }),
      onClick: () => {
      }
    }
  ],
  technician: [
    { id: "help", label: "Help", icon: (props) => /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.HelpCircle, { ...props }), onClick: () => {
    } },
    {
      id: "notifications",
      label: "Notifications",
      icon: (props) => /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.Bell, { ...props }),
      onClick: () => {
      },
      badge: 1
    }
  ],
  management: [
    {
      id: "notifications",
      label: "Notifications",
      icon: (props) => /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.Bell, { ...props }),
      onClick: () => {
      },
      badge: 7
    },
    {
      id: "settings",
      label: "Settings",
      icon: (props) => /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.Settings, { ...props }),
      onClick: () => {
      }
    }
  ]
};
var portalTitles = {
  admin: "Admin Portal",
  customer: "Customer Portal",
  reseller: "Reseller Portal",
  technician: "Technician App",
  management: "Management Console"
};
function UniversalHeader({
  variant,
  user,
  branding,
  tenant,
  actions,
  onLogout,
  onMenuToggle,
  showMobileMenu = false,
  className = ""
}) {
  const [showUserMenu, setShowUserMenu] = (0, import_react24.useState)(false);
  const styles = variantStyles3[variant];
  const headerActions = actions ?? defaultActions[variant] ?? [];
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  const renderLogo = () => {
    if (branding?.logo) {
      return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(OptimizedImage, { src: branding.logo, alt: branding.companyName, className: "h-8 w-auto" });
    }
    const initials = branding?.companyName?.split(" ").map((word) => word.charAt(0)).join("").substring(0, 2).toUpperCase() || "DM";
    return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
      "div",
      {
        className: "flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm text-white",
        style: { backgroundColor: branding?.primaryColor || "#3B82F6" },
        children: initials
      }
    );
  };
  const renderUserAvatar = () => {
    if (user?.avatar) {
      return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(OptimizedImage, { src: user.avatar, alt: user.name, className: "h-8 w-8 rounded-full" });
    }
    const initials = user?.name?.split(" ").map((word) => word.charAt(0)).join("").substring(0, 2).toUpperCase() || "U";
    return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 font-medium text-sm text-white", children: initials });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
    import_framer_motion9.motion.header,
    {
      className: `flex h-16 items-center justify-between border-b px-4 sm:px-6 ${styles.container} ${className}`,
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "flex items-center space-x-4", children: [
          onMenuToggle && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            "button",
            {
              onClick: onMenuToggle,
              className: `rounded-lg p-2 transition-colors md:hidden ${styles.hover}`,
              "aria-label": "Toggle menu",
              children: showMobileMenu ? /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.X, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.Menu, { className: "h-6 w-6" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "flex items-center space-x-3", children: [
            renderLogo(),
            /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("h1", { className: `font-semibold text-xl ${styles.text}`, children: branding?.companyName || portalTitles[variant] }),
              tenant && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: `text-xs ${styles.accent}`, children: tenant.name })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "flex items-center space-x-2", children: [
          headerActions.map((action) => {
            const IconComponent = action.icon;
            return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
              "button",
              {
                onClick: action.onClick,
                className: `relative rounded-lg p-2 transition-colors ${styles.hover}`,
                "aria-label": action.label,
                title: action.label,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(IconComponent, { className: "h-5 w-5" }),
                  action.badge && action.badge > 0 && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
                    import_framer_motion9.motion.span,
                    {
                      className: "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white",
                      initial: { scale: 0 },
                      animate: { scale: 1 },
                      transition: { type: "spring", stiffness: 500, damping: 30 },
                      children: action.badge > 99 ? "99+" : action.badge
                    }
                  )
                ]
              },
              action.id
            );
          }),
          user && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "relative", children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
              "button",
              {
                onClick: toggleUserMenu,
                className: `flex items-center space-x-2 rounded-lg p-2 transition-colors ${styles.hover}`,
                "aria-label": "User menu",
                children: [
                  renderUserAvatar(),
                  /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: `hidden text-left text-sm sm:block ${styles.text}`, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "font-medium", children: user.name }),
                    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: `text-xs ${styles.accent}`, children: user.role })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.ChevronDown, { className: "h-4 w-4" })
                ]
              }
            ),
            showUserMenu && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
              import_framer_motion9.motion.div,
              {
                className: "absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg",
                initial: { opacity: 0, scale: 0.95, y: -10 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.95, y: -10 },
                transition: { duration: 0.2 },
                onBlur: () => setShowUserMenu(false),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "border-b border-gray-100 px-4 py-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { className: "font-medium text-gray-900 text-sm", children: user.name }),
                    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { className: "text-gray-500 text-xs", children: user.email }),
                    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("span", { className: "mt-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800", children: user.role })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
                    "button",
                    {
                      className: "flex w-full items-center px-4 py-2 text-left text-gray-700 text-sm transition-colors hover:bg-gray-100",
                      onClick: () => setShowUserMenu(false),
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.User, { className: "mr-2 h-4 w-4" }),
                        "Profile"
                      ]
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
                    "button",
                    {
                      className: "flex w-full items-center px-4 py-2 text-left text-gray-700 text-sm transition-colors hover:bg-gray-100",
                      onClick: () => setShowUserMenu(false),
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.Settings, { className: "mr-2 h-4 w-4" }),
                        "Settings"
                      ]
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "border-t border-gray-100", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
                    "button",
                    {
                      onClick: () => {
                        setShowUserMenu(false);
                        onLogout();
                      },
                      className: "flex w-full items-center px-4 py-2 text-left text-red-600 text-sm transition-colors hover:bg-red-50",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react10.LogOut, { className: "mr-2 h-4 w-4" }),
                        "Sign Out"
                      ]
                    }
                  ) })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}

// src/layout/UniversalLayout.tsx
var import_react25 = require("react");
var import_framer_motion10 = require("framer-motion");
var import_jsx_runtime27 = require("react/jsx-runtime");
var variantStyles4 = {
  admin: {
    layout: "bg-slate-50",
    sidebar: "bg-slate-900 text-slate-100",
    content: "bg-white",
    border: "border-slate-200"
  },
  customer: {
    layout: "bg-gray-50",
    sidebar: "bg-white text-gray-900 border-r border-gray-200",
    content: "bg-white",
    border: "border-gray-200"
  },
  reseller: {
    layout: "bg-purple-50",
    sidebar: "bg-gradient-to-b from-purple-600 to-blue-600 text-white",
    content: "bg-white",
    border: "border-purple-200"
  },
  technician: {
    layout: "bg-green-50",
    sidebar: "bg-green-700 text-white",
    content: "bg-white",
    border: "border-green-200"
  },
  management: {
    layout: "bg-gray-50",
    sidebar: "bg-gray-900 text-white",
    content: "bg-white",
    border: "border-gray-200"
  }
};
var layoutTypes = {
  dashboard: {
    structure: "header-content",
    sidebar: false,
    responsive: true
  },
  sidebar: {
    structure: "header-sidebar-content",
    sidebar: true,
    responsive: true
  },
  mobile: {
    structure: "mobile-header-content",
    sidebar: false,
    responsive: false
  },
  simple: {
    structure: "content-only",
    sidebar: false,
    responsive: false
  }
};
var maxWidthClasses2 = {
  none: "",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "7xl": "max-w-7xl"
};
var paddingClasses2 = {
  none: "",
  sm: "p-2 sm:p-4",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8"
};
function UniversalLayout({
  variant,
  children,
  user,
  branding,
  tenant,
  navigation = [],
  onLogout,
  className = "",
  // Layout configuration
  layoutType = "sidebar",
  showSidebar = true,
  sidebarCollapsible = true,
  mobileBreakpoint = 768,
  // Header configuration
  showHeader = true,
  headerActions,
  // Content configuration
  maxWidth = "7xl",
  padding = "md",
  // Security (implementation would need auth context)
  requireAuth = true,
  requiredRoles = [],
  requiredPermissions = []
}) {
  const [sidebarOpen, setSidebarOpen] = (0, import_react25.useState)(false);
  const [isMobile, setIsMobile] = (0, import_react25.useState)(false);
  const [sidebarCollapsed, setSidebarCollapsed] = (0, import_react25.useState)(false);
  const styles = variantStyles4[variant];
  const layout = layoutTypes[layoutType];
  (0, import_react25.useEffect)(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < mobileBreakpoint;
      setIsMobile(mobile);
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen, mobileBreakpoint]);
  (0, import_react25.useEffect)(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.getElementById("universal-sidebar");
        const target = event.target;
        if (sidebar && !sidebar.contains(target)) {
          setSidebarOpen(false);
        }
      }
    };
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
    return void 0;
  }, [isMobile, sidebarOpen]);
  (0, import_react25.useEffect)(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, sidebarOpen]);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!sidebarCollapsed);
  const renderNavigation = () => {
    if (!navigation.length || !showSidebar) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("nav", { className: "flex-1 px-2 py-4 space-y-1", children: navigation.map((item) => {
      const IconComponent = item.icon;
      return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
        "a",
        {
          href: item.href,
          className: `
                group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                ${variant === "admin" || variant === "management" ? "text-slate-300 hover:bg-slate-700 hover:text-white" : variant === "reseller" || variant === "technician" ? "text-white/90 hover:bg-white/10 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                ${sidebarCollapsed && !isMobile ? "justify-center" : ""}
              `,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              IconComponent,
              {
                className: `
                  flex-shrink-0 h-6 w-6
                  ${sidebarCollapsed && !isMobile ? "" : "mr-3"}
                `
              }
            ),
            (!sidebarCollapsed || isMobile) && /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(import_jsx_runtime27.Fragment, { children: [
              item.label,
              item.badge && item.badge > 0 && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-red-100 text-red-600", children: item.badge > 99 ? "99+" : item.badge })
            ] })
          ]
        },
        item.id
      );
    }) });
  };
  const renderSidebar = () => {
    if (!showSidebar || layoutType === "mobile" || layoutType === "simple") {
      return null;
    }
    const sidebarWidth = sidebarCollapsed && !isMobile ? "w-16" : "w-64";
    return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(import_jsx_runtime27.Fragment, { children: [
      isMobile && sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
        import_framer_motion10.motion.div,
        {
          className: "fixed inset-0 z-40 bg-gray-600 bg-opacity-75",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setSidebarOpen(false),
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
        import_framer_motion10.motion.div,
        {
          id: "universal-sidebar",
          className: `
            ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"}
            ${sidebarWidth} ${styles.sidebar}
            ${isMobile && !sidebarOpen ? "translate-x-full" : "translate-x-0"}
            flex flex-col transition-all duration-300
          `,
          initial: isMobile ? { x: "-100%" } : false,
          animate: isMobile ? { x: sidebarOpen ? 0 : "-100%" } : false,
          transition: { duration: 0.3 },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center justify-between p-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center space-x-3", children: [
                branding?.logo ? /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("img", { src: branding.logo, alt: branding.companyName, className: "h-8 w-auto" }) : /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                  "div",
                  {
                    className: "flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm text-white",
                    style: {
                      backgroundColor: branding?.primaryColor || "#3B82F6"
                    },
                    children: branding?.companyName?.split(" ").map((word) => word.charAt(0)).join("").substring(0, 2).toUpperCase() || "DM"
                  }
                ),
                (!sidebarCollapsed || isMobile) && /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("h1", { className: "font-semibold text-lg", children: branding?.companyName || `${variant.charAt(0).toUpperCase() + variant.slice(1)} Portal` }),
                  tenant && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "text-xs opacity-75", children: tenant.name })
                ] })
              ] }),
              sidebarCollapsible && !isMobile && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                "button",
                {
                  onClick: toggleSidebarCollapse,
                  className: "rounded-lg p-1 hover:bg-white/10 transition-colors",
                  "aria-label": "Toggle sidebar",
                  children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                    import_framer_motion10.motion.div,
                    {
                      animate: { rotate: sidebarCollapsed ? 180 : 0 },
                      transition: { duration: 0.2 },
                      children: "\u2190"
                    }
                  )
                }
              )
            ] }),
            renderNavigation(),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "border-t border-current/10 p-4", children: (!sidebarCollapsed || isMobile) && /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "text-xs opacity-75", children: [
              /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("p", { children: [
                variant.charAt(0).toUpperCase() + variant.slice(1),
                " Portal"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { className: "mt-1", children: "v1.0.0" })
            ] }) })
          ]
        }
      )
    ] });
  };
  const renderContent = () => {
    const contentPadding = paddingClasses2[padding];
    const contentMaxWidth = maxWidthClasses2[maxWidth];
    return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
      "main",
      {
        className: `
        flex-1 overflow-y-auto focus:outline-none ${styles.content}
        ${layoutType === "simple" ? "" : "min-h-0"}
      `,
        children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: `${contentPadding} ${contentMaxWidth && `${contentMaxWidth} mx-auto`}`, children })
      }
    );
  };
  if (layoutType === "simple") {
    return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
      "div",
      {
        className: `universal-layout universal-layout--${variant} ${styles.layout} ${className}`,
        children: renderContent()
      }
    );
  }
  if (layoutType === "dashboard") {
    return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
      "div",
      {
        className: `universal-layout universal-layout--${variant} h-screen flex flex-col ${styles.layout} ${className}`,
        children: [
          showHeader && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
            UniversalHeader,
            {
              variant,
              ...user ? { user } : {},
              ...branding ? { branding } : {},
              ...tenant ? { tenant } : {},
              ...headerActions ? { actions: headerActions } : {},
              onLogout,
              ...showSidebar ? { onMenuToggle: toggleSidebar } : {},
              showMobileMenu: sidebarOpen
            }
          ),
          renderContent()
        ]
      }
    );
  }
  if (layoutType === "mobile") {
    return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
      "div",
      {
        className: `universal-layout universal-layout--${variant} h-screen flex flex-col ${styles.layout} ${className}`,
        children: [
          showHeader && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
            UniversalHeader,
            {
              variant,
              ...user ? { user } : {},
              ...branding ? { branding } : {},
              ...tenant ? { tenant } : {},
              ...headerActions ? { actions: headerActions } : {},
              onLogout,
              ...showSidebar ? { onMenuToggle: toggleSidebar } : {},
              showMobileMenu: sidebarOpen
            }
          ),
          renderContent(),
          renderSidebar()
        ]
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
    "div",
    {
      className: `universal-layout universal-layout--${variant} h-screen flex ${styles.layout} ${className}`,
      children: [
        renderSidebar(),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
          "div",
          {
            className: `
        flex flex-col flex-1 overflow-hidden transition-all duration-300
        ${isMobile ? "ml-0" : showSidebar ? sidebarCollapsed ? "ml-16" : "ml-64" : "ml-0"}
      `,
            children: [
              showHeader && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                UniversalHeader,
                {
                  variant,
                  ...user ? { user } : {},
                  ...branding ? { branding } : {},
                  ...tenant ? { tenant } : {},
                  ...headerActions ? { actions: headerActions } : {},
                  onLogout,
                  ...showSidebar ? { onMenuToggle: toggleSidebar } : {},
                  showMobileMenu: sidebarOpen
                }
              ),
              renderContent()
            ]
          }
        )
      ]
    }
  );
}
var UniversalLayout_default = UniversalLayout;

// src/navigation/MobileNavigation.tsx
var import_clsx10 = require("clsx");
var import_lucide_react11 = require("lucide-react");
var import_react28 = require("react");

// src/utils/accessibility.ts
var import_react27 = __toESM(require("react"));

// src/utils/ssr.ts
var import_react26 = __toESM(require("react"));
var isBrowser = typeof window !== "undefined";
var isServer = !isBrowser;
var safeWindow = isBrowser ? window : void 0;
var safeDocument = isBrowser ? document : void 0;
function useClientEffect(effect, deps) {
  import_react26.default.useEffect(() => {
    if (isBrowser) {
      return effect();
    }
  }, deps);
}
function useBrowserLayoutEffect(effect, deps) {
  import_react26.default.useLayoutEffect(() => {
    if (isBrowser) {
      return effect();
    }
  }, deps);
}
function useIsHydrated() {
  const [isHydrated, setIsHydrated] = import_react26.default.useState(false);
  import_react26.default.useEffect(() => {
    setIsHydrated(true);
  }, []);
  return isHydrated;
}
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = import_react26.default.useState(() => {
    if (!isBrowser) {
      return defaultValue;
    }
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  const setStoredValue = import_react26.default.useCallback(
    (newValue) => {
      try {
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        if (isBrowser) {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch {
      }
    },
    [key, value]
  );
  return [value, setStoredValue];
}
function useSessionStorage(key, defaultValue) {
  const [value, setValue] = import_react26.default.useState(() => {
    if (!isBrowser) {
      return defaultValue;
    }
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  const setStoredValue = import_react26.default.useCallback(
    (newValue) => {
      try {
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        if (isBrowser) {
          sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch {
      }
    },
    [key, value]
  );
  return [value, setStoredValue];
}
function useMediaQuery(breakpoint) {
  const [matches, setMatches] = import_react26.default.useState(false);
  import_react26.default.useEffect(() => {
    if (!isBrowser) {
      return;
    }
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint})`);
    setMatches(mediaQuery.matches);
    const listener = (e) => setMatches(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [breakpoint]);
  return matches;
}
function useUserPreferences() {
  const [preferences, setPreferences] = import_react26.default.useState({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersDarkMode: false
  });
  import_react26.default.useEffect(() => {
    if (!isBrowser) {
      return;
    }
    const updatePreferences = () => {
      setPreferences({
        prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        prefersHighContrast: window.matchMedia("(prefers-contrast: high)").matches,
        prefersDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches
      });
    };
    updatePreferences();
    const mediaQueries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(prefers-contrast: high)"),
      window.matchMedia("(prefers-color-scheme: dark)")
    ];
    mediaQueries.forEach((mq) => mq.addEventListener("change", updatePreferences));
    return () => {
      mediaQueries.forEach((mq) => mq.removeEventListener("change", updatePreferences));
    };
  }, []);
  return preferences;
}

// src/utils/accessibility.ts
var KEYS = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
  PAGE_UP: "PageUp",
  PAGE_DOWN: "PageDown",
  TAB: "Tab"
};
function useKeyboardNavigation2(items, options = {
  // Implementation pending
}) {
  const { loop = true, orientation = "vertical", onSelect, initialIndex = -1 } = options;
  const [focusedIndex, setFocusedIndex] = import_react27.default.useState(initialIndex);
  const navigate = import_react27.default.useCallback(
    (direction) => {
      setFocusedIndex((prevIndex) => {
        let newIndex = prevIndex;
        switch (direction) {
          case "next":
            newIndex = prevIndex + 1;
            if (newIndex >= items.length) {
              newIndex = loop ? 0 : items.length - 1;
            }
            break;
          case "previous":
            newIndex = prevIndex - 1;
            if (newIndex < 0) {
              newIndex = loop ? items.length - 1 : 0;
            }
            break;
          case "first":
            newIndex = 0;
            break;
          case "last":
            newIndex = items.length - 1;
            break;
        }
        return newIndex;
      });
    },
    [items.length, loop]
  );
  const NavigationHandlers = {
    getNavigationKeys: (orientation2) => ({
      next: orientation2 === "vertical" ? KEYS.ARROW_DOWN : KEYS.ARROW_RIGHT,
      prev: orientation2 === "vertical" ? KEYS.ARROW_UP : KEYS.ARROW_LEFT
    }),
    handleNavigationKey: (key, orientation2, navigate2, event) => {
      const keys = NavigationHandlers.getNavigationKeys(orientation2);
      const handlers = {
        [keys.next]: () => navigate2("next"),
        [keys.prev]: () => navigate2("previous"),
        [KEYS.HOME]: () => navigate2("first"),
        [KEYS.END]: () => navigate2("last")
      };
      if (handlers[key]) {
        event.preventDefault();
        handlers[key]();
        return true;
      }
      return false;
    },
    handleSelectionKey: (key, focusedIndex2, items2, onSelect2, event) => {
      if (key === KEYS.ENTER || key === KEYS.SPACE) {
        event?.preventDefault();
        if (focusedIndex2 >= 0 && focusedIndex2 < items2.length) {
          onSelect2?.(items2[focusedIndex2], focusedIndex2);
        }
        return true;
      }
      return false;
    }
  };
  const handleKeyDown = import_react27.default.useCallback(
    (event) => {
      const { key } = event;
      if (NavigationHandlers.handleNavigationKey(key, orientation, navigate, event)) {
        return;
      }
      NavigationHandlers.handleSelectionKey(
        key,
        focusedIndex,
        items,
        onSelect ? (item, index) => onSelect(item, index) : void 0,
        event
      );
    },
    [
      orientation,
      navigate,
      focusedIndex,
      items,
      onSelect,
      NavigationHandlers.handleNavigationKey,
      // Then try selection keys
      NavigationHandlers.handleSelectionKey
    ]
  );
  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    navigate
  };
}
var FocusTrapHelpers = {
  getFocusableElements: (container) => container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ),
  getFirstAndLastElements: (elements) => ({
    first: elements[0],
    last: elements[elements.length - 1]
  }),
  createTabHandler: (firstElement, lastElement) => (e) => {
    if (e.key !== KEYS.TAB) {
      return;
    }
    const isShiftTab = e.shiftKey;
    const isAtFirst = document.activeElement === firstElement;
    const isAtLast = document.activeElement === lastElement;
    if (isShiftTab && isAtFirst) {
      e.preventDefault();
      lastElement?.focus();
    } else if (!isShiftTab && isAtLast) {
      e.preventDefault();
      firstElement?.focus();
    }
  },
  setupFocusTrap: (container) => {
    const focusableElements = FocusTrapHelpers.getFocusableElements(container);
    const { first, last } = FocusTrapHelpers.getFirstAndLastElements(focusableElements);
    first?.focus();
    const handleTabKey = FocusTrapHelpers.createTabHandler(first, last);
    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }
};
function useFocusTrap(isActive) {
  const containerRef = import_react27.default.useRef(null);
  import_react27.default.useEffect(() => {
    if (!isActive || !isBrowser || !containerRef.current) {
      return;
    }
    return FocusTrapHelpers.setupFocusTrap(containerRef.current);
  }, [isActive]);
  return containerRef;
}
function useScreenReaderAnnouncement() {
  const [announcement, setAnnouncement] = import_react27.default.useState("");
  const [priority, setPriority] = import_react27.default.useState("polite");
  const announce = import_react27.default.useCallback((message, livePriority = "polite") => {
    setAnnouncement(message);
    setPriority(livePriority);
  }, []);
  const liveRegionProps = {
    "aria-live": priority,
    "aria-atomic": true,
    style: {
      position: "absolute",
      left: "-10000px",
      width: "1px",
      height: "1px",
      overflow: "hidden"
    }
  };
  return { announce, announcement, liveRegionProps };
}
function useAriaExpanded(initialExpanded = false) {
  const [expanded, setExpanded] = import_react27.default.useState(initialExpanded);
  const [triggerId] = import_react27.default.useState(() => `trigger-${Math.random().toString(36).substr(2, 9)}`);
  const [contentId] = import_react27.default.useState(() => `content-${Math.random().toString(36).substr(2, 9)}`);
  const toggle = import_react27.default.useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);
  const triggerProps = {
    "aria-expanded": expanded,
    "aria-controls": contentId,
    id: triggerId
  };
  const contentProps = {
    "aria-labelledby": triggerId,
    id: contentId,
    hidden: !expanded
  };
  return {
    expanded,
    setExpanded,
    toggle,
    triggerProps,
    contentProps
  };
}
function useAriaSelection(options = {
  items: []
}) {
  const { items, multiple = false, onSelectionChange } = options;
  const [selectedItems, setSelectedItems] = import_react27.default.useState([]);
  const toggleSelection = import_react27.default.useCallback(
    (item) => {
      setSelectedItems((prev) => {
        let newSelection;
        if (multiple) {
          const isSelected2 = prev.includes(item);
          newSelection = isSelected2 ? prev.filter((i) => i !== item) : [...prev, item];
        } else {
          newSelection = prev.includes(item) ? [] : [item];
        }
        onSelectionChange?.(newSelection);
        return newSelection;
      });
    },
    [multiple, onSelectionChange]
  );
  const isSelected = import_react27.default.useCallback(
    (item) => {
      return selectedItems.includes(item);
    },
    [selectedItems]
  );
  const clearSelection = import_react27.default.useCallback(() => {
    setSelectedItems([]);
    onSelectionChange?.([]);
  }, []);
  return {
    selectedItems,
    toggleSelection,
    isSelected,
    clearSelection
  };
}
function useId(prefix = "id") {
  const [id] = import_react27.default.useState(() => `${prefix}-${Math.random().toString(36).substr(2, 9)}`);
  return id;
}
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = import_react27.default.useState(false);
  import_react27.default.useEffect(() => {
    if (!isBrowser) {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);
  return prefersReducedMotion;
}
var ARIA_ROLES2 = {
  BUTTON: "button",
  MENU: "menu",
  MENUITEM: "menuitem",
  MENUBAR: "menubar",
  TAB: "tab",
  TABLIST: "tablist",
  TABPANEL: "tabpanel",
  DIALOG: "dialog",
  ALERTDIALOG: "alertdialog",
  TOOLTIP: "tooltip",
  COMBOBOX: "combobox",
  LISTBOX: "listbox",
  OPTION: "option",
  GRID: "grid",
  GRIDCELL: "gridcell",
  COLUMNHEADER: "columnheader",
  ROWHEADER: "rowheader",
  REGION: "region",
  BANNER: "banner",
  MAIN: "main",
  NAVIGATION: "navigation",
  COMPLEMENTARY: "complementary",
  CONTENTINFO: "contentinfo",
  SEARCH: "search",
  FORM: "form",
  ARTICLE: "article",
  SECTION: "section",
  LIST: "list",
  LISTITEM: "listitem",
  SEPARATOR: "separator",
  IMG: "img",
  PRESENTATION: "presentation",
  NONE: "none"
};

// src/navigation/MobileNavigation.tsx
var import_jsx_runtime28 = require("react/jsx-runtime");
function renderNavTree(items, options) {
  const { depth, currentPath, expandedItems, onToggle, onNavigate } = options;
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("ul", { className: (0, import_clsx10.clsx)(depth > 0 && "ml-4"), children: items.map((item) => {
    const isActive = currentPath === item.href;
    const hasChildren = (item.children?.length ?? 0) > 0;
    const isExpanded = hasChildren && expandedItems.has(item.id);
    const Icon = item.icon;
    return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("li", { className: (0, import_clsx10.clsx)("py-0.5", depth > 0 && "ml-2"), children: [
      /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(
        "button",
        {
          type: "button",
          onClick: () => {
            if (hasChildren) {
              onToggle(item);
            } else {
              onNavigate?.(item.href);
            }
          },
          className: (0, import_clsx10.clsx)(
            "flex w-full items-center gap-3 rounded-md px-4 py-2 text-left text-sm font-medium transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            depth > 0 && "pl-6"
          ),
          "aria-current": isActive ? "page" : void 0,
          "aria-expanded": hasChildren ? isExpanded : void 0,
          children: [
            Icon ? /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
              Icon,
              {
                className: (0, import_clsx10.clsx)(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-blue-600" : "text-gray-400"
                ),
                "aria-hidden": "true"
              }
            ) : null,
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { className: "flex-1", children: item.label }),
            item.badge ? /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
              "span",
              {
                className: (0, import_clsx10.clsx)(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  isActive ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-600"
                ),
                children: item.badge
              }
            ) : null,
            hasChildren ? /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
              import_lucide_react11.ChevronRight,
              {
                className: (0, import_clsx10.clsx)(
                  "h-4 w-4 text-gray-400 transition-transform",
                  isExpanded && "rotate-90"
                ),
                "aria-hidden": "true"
              }
            ) : null
          ]
        }
      ),
      hasChildren && isExpanded ? renderNavTree(item.children, {
        ...options,
        depth: depth + 1
      }) : null
    ] }, item.id);
  }) });
}
function TabsNavigation({
  items,
  currentPath,
  onNavigate,
  className
}) {
  const [showMore, setShowMore] = (0, import_react28.useState)(false);
  const primaryItems = items.slice(0, 4);
  const overflowItems = items.slice(4);
  const renderButton = (item) => {
    const isActive = currentPath === item.href;
    const Icon = item.icon;
    return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(
      "button",
      {
        type: "button",
        onClick: () => onNavigate?.(item.href),
        className: (0, import_clsx10.clsx)(
          "flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
          isActive ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900"
        ),
        "aria-current": isActive ? "page" : void 0,
        children: [
          Icon ? /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
            Icon,
            {
              className: (0, import_clsx10.clsx)("h-4 w-4 flex-shrink-0", isActive ? "text-blue-500" : "text-gray-400")
            }
          ) : null,
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { children: item.label }),
          item.badge ? /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
            "span",
            {
              className: (0, import_clsx10.clsx)(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                isActive ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-600"
              ),
              children: item.badge
            }
          ) : null
        ]
      },
      item.id
    );
  };
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("nav", { role: "navigation", className: (0, import_clsx10.clsx)("mobile-nav-tabs", className), "aria-label": "Navigation", children: /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "flex items-center", children: [
    /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("div", { className: "scrollbar-hide flex overflow-x-auto", children: primaryItems.map(renderButton) }),
    overflowItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "relative ml-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(
        "button",
        {
          type: "button",
          onClick: () => setShowMore((prev) => !prev),
          className: "flex items-center rounded-md px-2 py-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "aria-expanded": showMore,
          "aria-label": "More navigation",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
              import_lucide_react11.ChevronDown,
              {
                className: (0, import_clsx10.clsx)("h-4 w-4 transition-transform", showMore && "rotate-180")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { className: "sr-only", children: "More navigation" })
          ]
        }
      ),
      showMore && /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("div", { className: "absolute right-0 top-full z-20 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg", children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("div", { className: "py-2", children: overflowItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(
        "button",
        {
          type: "button",
          onClick: () => {
            onNavigate?.(item.href);
            setShowMore(false);
          },
          className: (0, import_clsx10.clsx)(
            "flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
            currentPath === item.href && "bg-blue-50 text-blue-700"
          ),
          children: [
            item.icon ? /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(item.icon, { className: "h-4 w-4 text-gray-400" }) : null,
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { children: item.label }),
            item.badge ? /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { className: "ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600", children: item.badge }) : null
          ]
        },
        item.id
      )) }) })
    ] })
  ] }) });
}
function MobileNavigation({
  items,
  currentPath,
  onNavigate,
  className = "",
  variant = "drawer",
  showOverlay = true
}) {
  const [isOpen, setIsOpen] = (0, import_react28.useState)(false);
  const [expandedItems, setExpandedItems] = (0, import_react28.useState)(/* @__PURE__ */ new Set());
  const focusTrapRef = useFocusTrap(isOpen && variant === "drawer");
  (0, import_react28.useEffect)(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);
  (0, import_react28.useEffect)(() => {
    if (isOpen && variant === "drawer") {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return void 0;
  }, [isOpen, variant]);
  const toggleItem = (0, import_react28.useCallback)((item) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });
  }, []);
  const closeDrawer = (0, import_react28.useCallback)(() => setIsOpen(false), []);
  const navigationContent = (0, import_react28.useMemo)(
    () => renderNavTree(items, {
      depth: 0,
      currentPath,
      expandedItems,
      onToggle: (item) => {
        toggleItem(item);
      },
      onNavigate: (href) => {
        onNavigate?.(href);
        if (variant === "drawer") {
          closeDrawer();
        }
      }
    }),
    [items, currentPath, expandedItems, toggleItem, onNavigate, variant, closeDrawer]
  );
  if (variant === "tabs") {
    return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
      TabsNavigation,
      {
        items,
        currentPath,
        ...onNavigate ? { onNavigate } : {},
        className
      }
    );
  }
  if (variant === "accordion") {
    return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
      "nav",
      {
        role: "navigation",
        className: (0, import_clsx10.clsx)("mobile-nav-accordion", className),
        "aria-label": "Navigation",
        children: navigationContent
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(import_jsx_runtime28.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(
      "button",
      {
        type: "button",
        onClick: () => setIsOpen(true),
        className: (0, import_clsx10.clsx)(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:hidden",
          className
        ),
        "aria-expanded": isOpen,
        "aria-label": "Open navigation",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(import_lucide_react11.Menu, { className: "h-5 w-5", "aria-hidden": "true" }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { children: "Menu" })
        ]
      }
    ),
    showOverlay && isOpen ? /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black/50 md:hidden",
        role: "presentation",
        onClick: closeDrawer
      }
    ) : null,
    /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(
      "div",
      {
        ref: focusTrapRef,
        className: (0, import_clsx10.clsx)(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-white shadow-lg transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        ),
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Navigation drawer",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "flex items-center justify-between border-b border-gray-200 px-4 py-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { className: "text-sm font-semibold text-gray-700", children: "Navigation" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(
              "button",
              {
                type: "button",
                onClick: closeDrawer,
                className: "rounded-md p-2 text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(import_lucide_react11.X, { className: "h-5 w-5", "aria-hidden": "true" }),
                  /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { className: "sr-only", children: "Close navigation" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("nav", { className: "h-full overflow-y-auto p-4", "aria-label": "Navigation", children: navigationContent })
        ]
      }
    )
  ] });
}

// src/navigation/Navigation.tsx
var import_react_slot5 = require("@radix-ui/react-slot");
var import_class_variance_authority8 = require("class-variance-authority");
var import_clsx11 = require("clsx");
var import_lucide_react12 = require("lucide-react");
var import_react29 = __toESM(require("react"));
var import_jsx_runtime29 = require("react/jsx-runtime");
var navigationVariants = (0, import_class_variance_authority8.cva)("", {
  variants: {
    variant: {
      default: "",
      bordered: "",
      filled: "",
      minimal: ""
    },
    orientation: {
      horizontal: "",
      vertical: ""
    },
    size: {
      sm: "",
      md: "",
      lg: ""
    }
  },
  defaultVariants: {
    variant: "default",
    orientation: "horizontal",
    size: "md"
  }
});
var sidebarVariants = (0, import_class_variance_authority8.cva)("", {
  variants: {
    variant: {
      default: "",
      floating: "",
      bordered: ""
    },
    size: {
      sm: "",
      md: "",
      lg: "",
      xl: ""
    },
    position: {
      left: "",
      right: ""
    },
    behavior: {
      push: "",
      overlay: "",
      squeeze: ""
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    position: "left",
    behavior: "push"
  }
});
var NavigationContext = (0, import_react29.createContext)({});
var useNavigation = () => (0, import_react29.useContext)(NavigationContext);
var Navigation = (0, import_react29.forwardRef)(
  ({
    className,
    variant = "default",
    orientation = "horizontal",
    size = "md",
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot5.Slot : "nav";
    return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx11.clsx)(
          navigationVariants({ variant, orientation, size }),
          "navigation",
          className
        ),
        ...props
      }
    );
  }
);
function NavigationProvider({
  children,
  activeItem,
  onNavigate,
  collapsed = false
}) {
  const contextValue = {
    ...activeItem !== void 0 ? { activeItem } : {},
    ...onNavigate ? { onNavigate } : {},
    collapsed
  };
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(NavigationContext.Provider, { value: contextValue, children });
}
var Navbar = (0, import_react29.forwardRef)(
  ({ className, variant, size, brand, actions, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot5.Slot : "nav";
    return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx11.clsx)(navigationVariants({ variant, size }), "navbar", className),
        ...props,
        children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "navbar-container", children: [
          brand ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "navbar-brand", children: brand }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "navbar-content", children }),
          actions ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "navbar-actions", children: actions }) : null
        ] })
      }
    );
  }
);
var NavigationMenu = (0, import_react29.forwardRef)(
  ({ className, orientation = "horizontal", asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot5.Slot : "ul";
    return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx11.clsx)("navigation-menu", `orientation-${orientation}`, className),
        ...props
      }
    );
  }
);
var NavigationItem = (0, import_react29.forwardRef)(
  ({
    className,
    active,
    disabled,
    href,
    icon,
    badge,
    itemKey,
    children,
    onClick,
    asChild = false,
    ...props
  }, ref) => {
    const { activeItem, onNavigate } = useNavigation();
    const isActive = active || itemKey && activeItem === itemKey;
    const Comp = asChild ? import_react_slot5.Slot : "li";
    const handleClick = (e) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      if (itemKey) {
        onNavigate?.(itemKey, href);
      }
      onClick?.(e);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx11.clsx)(
          "navigation-item",
          {
            active: isActive,
            disabled
          },
          className
        ),
        onClick: handleClick,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            handleClick(e);
          }
        },
        ...props,
        children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "navigation-item-content", children: [
          icon ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "navigation-item-icon", children: icon }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "navigation-item-text", children }),
          badge ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "navigation-item-badge", children: badge }) : null
        ] })
      }
    );
  }
);
var NavigationLink = (0, import_react29.forwardRef)(
  ({
    className,
    active,
    disabled,
    icon,
    badge,
    itemKey,
    children,
    onClick,
    asChild = false,
    ...props
  }, ref) => {
    const { activeItem, onNavigate } = useNavigation();
    const isActive = active || itemKey && activeItem === itemKey;
    const Comp = asChild ? import_react_slot5.Slot : "a";
    const handleClick = (e) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      if (itemKey) {
        onNavigate?.(itemKey, props.href);
      }
      onClick?.(e);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx11.clsx)(
          "navigation-link",
          {
            active: isActive,
            disabled
          },
          className
        ),
        onClick: handleClick,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            handleClick(e);
          }
        },
        "aria-current": isActive ? "page" : void 0,
        "aria-disabled": disabled ? "true" : void 0,
        ...props,
        children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "navigation-link-content", children: [
          icon ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "navigation-link-icon", children: icon }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "navigation-link-text", children }),
          badge ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "navigation-link-badge", children: badge }) : null
        ] })
      }
    );
  }
);
var Sidebar = (0, import_react29.forwardRef)(
  ({
    className,
    variant,
    size,
    position,
    behavior,
    collapsed = false,
    collapsible = false,
    onCollapsedChange,
    header,
    footer,
    children,
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot5.Slot : "aside";
    const handleToggle = () => {
      if (collapsible) {
        onCollapsedChange?.(!collapsed);
      }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(NavigationProvider, { collapsed, children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
      Comp,
      {
        ref,
        className: (0, import_clsx11.clsx)(
          sidebarVariants({ variant, size, position, behavior }),
          "sidebar",
          {
            collapsed,
            collapsible
          },
          className
        ),
        ...props,
        children: [
          header ? /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "sidebar-header", children: [
            header,
            collapsible ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
              "button",
              {
                type: "button",
                className: "sidebar-toggle",
                onClick: handleToggle,
                onKeyDown: (e) => e.key === "Enter" && handleToggle,
                "aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
                children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "toggle-icon", children: collapsed ? "\u2192" : "\u2190" })
              }
            ) : null
          ] }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "sidebar-content", children }),
          footer ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "sidebar-footer", children: footer }) : null
        ]
      }
    ) });
  }
);
var Breadcrumb = (0, import_react29.forwardRef)(
  ({
    className,
    separator = /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react12.ChevronRight, { className: "breadcrumb-separator" }),
    maxItems,
    itemsBeforeCollapse = 1,
    itemsAfterCollapse = 1,
    children,
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot5.Slot : "nav";
    const items = import_react29.default.Children.toArray(children);
    let displayItems = items;
    let _hasCollapsedItems = false;
    if (maxItems && items.length > maxItems) {
      _hasCollapsedItems = true;
      const beforeItems = items.slice(0, itemsBeforeCollapse);
      const afterItems = items.slice(-itemsAfterCollapse);
      displayItems = [...beforeItems, /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(BreadcrumbEllipsis, {}, "ellipsis"), ...afterItems];
    }
    return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Comp, { ref, className: (0, import_clsx11.clsx)("breadcrumb", className), "aria-label": "Breadcrumb", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("ol", { className: "breadcrumb-list", children: displayItems.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(import_react29.default.Fragment, { children: [
      item,
      index < displayItems.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { className: "breadcrumb-separator-item", "aria-hidden": "true", children: separator })
    ] }, `item-${index}`)) }) });
  }
);
var BreadcrumbItem = (0, import_react29.forwardRef)(
  ({ className, current = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot5.Slot : "li";
    return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx11.clsx)(
          "breadcrumb-item",
          {
            current
          },
          className
        ),
        "aria-current": current ? "page" : void 0,
        ...props
      }
    );
  }
);
var BreadcrumbLink = (0, import_react29.forwardRef)(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot5.Slot : "a";
    return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Comp, { ref, className: (0, import_clsx11.clsx)("breadcrumb-link", className), ...props });
  }
);
var BreadcrumbPage = (0, import_react29.forwardRef)(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot5.Slot : "span";
    return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx11.clsx)("breadcrumb-page", className),
        role: "link",
        "aria-disabled": "true",
        "aria-current": "page",
        ...props
      }
    );
  }
);
var BreadcrumbEllipsis = (0, import_react29.forwardRef)(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot5.Slot : "span";
    return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(BreadcrumbItem, { children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx11.clsx)("breadcrumb-ellipsis", className),
        role: "presentation",
        "aria-hidden": "true",
        ...props,
        children: "\u2026"
      }
    ) });
  }
);
var TabNavigation = (0, import_react29.forwardRef)(
  ({
    className,
    variant = "default",
    size = "md",
    value,
    onValueChange,
    children,
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot5.Slot : "div";
    return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
      NavigationProvider,
      {
        ...value !== void 0 ? { activeItem: value } : {},
        ...onValueChange ? { onNavigate: onValueChange } : {},
        children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
          Comp,
          {
            ref,
            className: (0, import_clsx11.clsx)("tab-navigation", `variant-${variant}`, `size-${size}`, className),
            role: "tablist",
            ...props,
            children
          }
        )
      }
    );
  }
);
var TabItem = (0, import_react29.forwardRef)(
  ({ className, value, disabled = false, onClick, asChild = false, ...props }, ref) => {
    const { activeItem, onNavigate } = useNavigation();
    const isActive = activeItem === value;
    const Comp = asChild ? import_react_slot5.Slot : "button";
    const handleClick = (e) => {
      if (!disabled) {
        onNavigate?.(value);
      }
      onClick?.(e);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
      Comp,
      {
        ref,
        className: (0, import_clsx11.clsx)(
          "tab-item",
          {
            active: isActive,
            disabled
          },
          className
        ),
        role: "tab",
        "aria-selected": isActive,
        "aria-disabled": disabled,
        tabIndex: isActive ? 0 : -1,
        onClick: handleClick,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            handleClick(e);
          }
        },
        ...props
      }
    );
  }
);
Navigation.displayName = "Navigation";
Navbar.displayName = "Navbar";
NavigationMenu.displayName = "NavigationMenu";
NavigationItem.displayName = "NavigationItem";
NavigationLink.displayName = "NavigationLink";
Sidebar.displayName = "Sidebar";
Breadcrumb.displayName = "Breadcrumb";
BreadcrumbItem.displayName = "BreadcrumbItem";
BreadcrumbLink.displayName = "BreadcrumbLink";
BreadcrumbPage.displayName = "BreadcrumbPage";
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";
TabNavigation.displayName = "TabNavigation";
TabItem.displayName = "TabItem";

// src/navigation/ResponsiveSidebar.tsx
var import_clsx12 = require("clsx");
var import_lucide_react13 = require("lucide-react");
var import_react30 = require("react");
var import_jsx_runtime30 = require("react/jsx-runtime");
function renderSidebarItems(options) {
  const { items, depth, currentPath, expandedItems, showContent, onToggle, onNavigate } = options;
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("ul", { className: (0, import_clsx12.clsx)("space-y-1", depth > 0 && "ml-2"), children: items.map((item) => {
    const isActive = currentPath === item.href;
    const hasChildren = (item.children?.length ?? 0) > 0;
    const isExpanded = hasChildren && expandedItems.has(item.id);
    const Icon = item.icon;
    return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("li", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
        "button",
        {
          type: "button",
          onClick: () => {
            if (hasChildren) {
              onToggle(item);
            } else {
              onNavigate?.(item.href);
            }
          },
          className: (0, import_clsx12.clsx)(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            depth > 0 && "pl-5",
            !showContent && "justify-center"
          ),
          "aria-current": isActive ? "page" : void 0,
          "aria-expanded": hasChildren ? isExpanded : void 0,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
              Icon,
              {
                className: (0, import_clsx12.clsx)(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-blue-600" : "text-gray-400"
                ),
                "aria-hidden": "true"
              }
            ),
            showContent ? /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(import_jsx_runtime30.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("span", { className: "flex-1", children: item.label }),
              item.badge ? /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
                "span",
                {
                  className: (0, import_clsx12.clsx)(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    isActive ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-600"
                  ),
                  children: item.badge
                }
              ) : null,
              hasChildren ? /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
                import_lucide_react13.ChevronRight,
                {
                  className: (0, import_clsx12.clsx)(
                    "h-4 w-4 text-gray-400 transition-transform",
                    isExpanded && "rotate-90"
                  ),
                  "aria-hidden": "true"
                }
              ) : null
            ] }) : null
          ]
        }
      ),
      hasChildren && isExpanded ? renderSidebarItems({
        items: item.children,
        depth: depth + 1,
        currentPath,
        expandedItems,
        showContent,
        onToggle,
        ...onNavigate ? { onNavigate } : {}
      }) : null
    ] }, item.id);
  }) });
}
function ResponsiveSidebar({
  items,
  currentPath,
  onNavigate,
  className = "",
  title = "Navigation",
  footer,
  collapsible = true,
  defaultCollapsed = false
}) {
  const [isMobileOpen, setIsMobileOpen] = (0, import_react30.useState)(false);
  const [isCollapsed, setIsCollapsed] = (0, import_react30.useState)(defaultCollapsed);
  const [isHovered, setIsHovered] = (0, import_react30.useState)(false);
  const [expandedItems, setExpandedItems] = (0, import_react30.useState)(/* @__PURE__ */ new Set());
  const focusTrapRef = useFocusTrap(isMobileOpen);
  const toggleItem = (0, import_react30.useCallback)((item) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });
  }, []);
  const handleNavigate = (0, import_react30.useCallback)(
    (href) => {
      onNavigate?.(href);
      setIsMobileOpen(false);
    },
    [onNavigate]
  );
  (0, import_react30.useEffect)(() => {
    if (!isMobileOpen) {
      return;
    }
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileOpen]);
  (0, import_react30.useEffect)(() => {
    if (!isMobileOpen) {
      return void 0;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileOpen]);
  const showContent = collapsible ? !isCollapsed || isHovered : true;
  const navigationTree = (0, import_react30.useMemo)(
    () => renderSidebarItems({
      items,
      depth: 0,
      currentPath,
      expandedItems,
      showContent,
      onToggle: toggleItem,
      onNavigate: handleNavigate
    }),
    [items, currentPath, expandedItems, showContent, toggleItem, handleNavigate]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(import_jsx_runtime30.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
      "button",
      {
        type: "button",
        onClick: () => setIsMobileOpen(true),
        className: "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:hidden",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(import_lucide_react13.Menu, { className: "h-5 w-5", "aria-hidden": "true" }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("span", { children: "Menu" })
        ]
      }
    ),
    isMobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black/50 md:hidden",
        role: "presentation",
        onClick: () => setIsMobileOpen(false)
      }
    ) : null,
    /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
      "div",
      {
        ref: focusTrapRef,
        className: (0, import_clsx12.clsx)(
          "fixed inset-y-0 left-0 z-50 w-80 max-w-full transform bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        ),
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Navigation sidebar",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "flex items-center justify-between border-b border-gray-200 px-4 py-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("h2", { className: "text-base font-semibold text-gray-900", children: title }),
            /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
              "button",
              {
                type: "button",
                onClick: () => setIsMobileOpen(false),
                className: "rounded-md p-2 text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(import_lucide_react13.X, { className: "h-5 w-5", "aria-hidden": "true" }),
                  /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("span", { className: "sr-only", children: "Close navigation" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("nav", { className: "flex h-full flex-col overflow-y-auto p-4", "aria-label": "Mobile navigation", children: [
            navigationTree,
            footer ? /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "border-t border-gray-200 pt-4", children: footer }) : null
          ] })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
      "aside",
      {
        className: (0, import_clsx12.clsx)(
          "hidden h-full flex-col border-r border-gray-200 bg-white transition-all duration-200 md:flex",
          showContent ? "w-64" : "w-16",
          className
        ),
        onMouseEnter: () => collapsible && setIsHovered(true),
        onMouseLeave: () => collapsible && setIsHovered(false),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
            "div",
            {
              className: (0, import_clsx12.clsx)(
                "flex items-center border-b border-gray-200 px-4 py-3",
                !showContent && "justify-center"
              ),
              children: [
                showContent ? /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("h2", { className: "text-sm font-semibold uppercase tracking-wide text-gray-500", children: title }) }) : null,
                collapsible && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
                  "button",
                  {
                    type: "button",
                    onClick: () => setIsCollapsed((prev) => !prev),
                    className: (0, import_clsx12.clsx)(
                      "ml-auto rounded-md p-1 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      !showContent && "mx-auto"
                    ),
                    "aria-label": isCollapsed ? "Expand sidebar" : "Collapse sidebar",
                    children: showContent ? /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(import_lucide_react13.ChevronLeft, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(import_lucide_react13.ChevronRight, { className: "h-4 w-4" })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
            "nav",
            {
              className: (0, import_clsx12.clsx)("flex-1 overflow-y-auto p-4", !showContent && "px-2"),
              "aria-label": "Desktop navigation",
              children: navigationTree
            }
          ),
          footer ? /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: (0, import_clsx12.clsx)("border-t border-gray-200 p-4", !showContent && "px-2"), children: footer }) : null
        ]
      }
    )
  ] });
}

// src/navigation/TabNavigation.tsx
var import_react31 = __toESM(require("react"));
init_cn();
var import_jsx_runtime31 = require("react/jsx-runtime");
var TabNavigation2 = import_react31.default.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles5 = {
      default: "border-b border-gray-200",
      pills: "bg-gray-100 p-1 rounded-lg",
      bordered: "border border-gray-200 rounded-lg p-1"
    };
    return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
      "div",
      {
        ref,
        className: cn("flex space-x-1", variantStyles5[variant], className),
        role: "tablist",
        ...props
      }
    );
  }
);
TabNavigation2.displayName = "TabNavigation";
var TabItem2 = import_react31.default.forwardRef(
  ({ className, active = false, variant = "default", children, ...props }, ref) => {
    const baseStyles = "px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
    const variantStyles5 = {
      default: active ? "border-b-2 border-blue-500 text-blue-600" : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
      pills: active ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-md",
      bordered: active ? "bg-white border border-gray-300 shadow-sm text-gray-900 rounded-md" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
    };
    return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
      "button",
      {
        ref,
        className: cn(baseStyles, variantStyles5[variant], className),
        role: "tab",
        "aria-selected": active,
        ...props,
        children
      }
    );
  }
);
TabItem2.displayName = "TabItem";
var TabPanel = import_react31.default.forwardRef(
  ({ className, active = false, ...props }, ref) => {
    if (!active) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { ref, className: cn("mt-4", className), role: "tabpanel", ...props });
  }
);
TabPanel.displayName = "TabPanel";

// src/feedback/hooks.ts
var import_react32 = require("react");
var useModal = () => {
  const [isOpen, setIsOpen] = (0, import_react32.useState)(false);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(!isOpen)
  };
};
var useModalContext = useModal;

// src/forms/Button.tsx
var import_react_slot6 = require("@radix-ui/react-slot");
var import_class_variance_authority9 = require("class-variance-authority");
var import_clsx13 = require("clsx");
var React23 = __toESM(require("react"));
var import_lucide_react14 = require("lucide-react");
var import_jsx_runtime32 = require("react/jsx-runtime");
var isPromise = (value) => typeof value === "object" && value !== null && "then" in value && typeof value.then === "function";
var buttonVariants = (0, import_class_variance_authority9.cva)(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Base variants
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Portal-specific variants
        admin: "bg-blue-600 text-white shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        customer: "bg-green-600 text-white shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
        reseller: "bg-purple-600 text-white shadow hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
        technician: "bg-orange-600 text-white shadow hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
        management: "bg-slate-800 text-white shadow hover:bg-slate-900 focus:ring-2 focus:ring-slate-600 focus:ring-offset-2"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-9 w-9"
      },
      loading: {
        true: "cursor-not-allowed opacity-70"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React23.forwardRef(
  ({
    className,
    variant,
    size,
    asChild = false,
    isLoading = false,
    loading = false,
    loadingText,
    loadingComponent,
    leftIcon,
    rightIcon,
    icon,
    iconPosition = "left",
    preventFormSubmission = false,
    onSecureClick,
    showAsyncLoading = true,
    disabled,
    onClick,
    onKeyDown,
    type = "button",
    children,
    ...props
  }, ref) => {
    const [isAsyncLoading, setIsAsyncLoading] = React23.useState(false);
    const Comp = asChild ? import_react_slot6.Slot : "button";
    const actuallyLoading = isLoading;
    const resolvedLeftIcon = icon && iconPosition === "left" ? icon : leftIcon;
    const resolvedRightIcon = icon && iconPosition === "right" ? icon : rightIcon;
    const isButtonDisabled = disabled || actuallyLoading || isAsyncLoading;
    const handleClick = React23.useCallback(
      async (event) => {
        if (preventFormSubmission) {
          event.preventDefault();
        }
        if (showAsyncLoading && isAsyncLoading) {
          return;
        }
        if (onSecureClick) {
          if (showAsyncLoading) {
            setIsAsyncLoading(true);
          }
          try {
            await onSecureClick(event);
          } catch (error) {
            console.error("Secure click handler error:", error);
          } finally {
            if (showAsyncLoading) {
              setIsAsyncLoading(false);
            }
          }
          return;
        }
        if (onClick) {
          if (showAsyncLoading) {
            setIsAsyncLoading(true);
            try {
              const result = onClick(event);
              if (isPromise(result)) {
                await result;
              }
            } catch (error) {
              console.error("Click handler error:", error);
            } finally {
              setIsAsyncLoading(false);
            }
          } else {
            onClick(event);
          }
        }
      },
      [isAsyncLoading, onClick, onSecureClick, preventFormSubmission, showAsyncLoading]
    );
    const showLoading = actuallyLoading || isAsyncLoading;
    const LoadingIcon = loadingComponent || /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(
      "svg",
      {
        "data-testid": "loader",
        className: "animate-spin h-4 w-4",
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
            "circle",
            {
              className: "opacity-25",
              cx: "12",
              cy: "12",
              r: "10",
              stroke: "currentColor",
              strokeWidth: "4"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
            "path",
            {
              className: "opacity-75",
              fill: "currentColor",
              d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            }
          )
        ]
      }
    );
    const handleKeyDownEvent = (event) => {
      if ([" ", "Spacebar", "Space"].includes(event.key)) {
        event.preventDefault();
        event.currentTarget.click();
      }
    };
    if (asChild) {
      return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
        Comp,
        {
          className: (0, import_clsx13.clsx)(buttonVariants({ variant, size, className })),
          ref,
          disabled,
          type,
          onClick,
          onKeyDown,
          "aria-disabled": disabled ? "true" : void 0,
          ...props,
          children
        }
      );
    }
    const renderContent = () => {
      if (showLoading) {
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(import_jsx_runtime32.Fragment, { children: [
          LoadingIcon,
          loadingText && /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { children: loadingText })
        ] });
      }
      if (resolvedLeftIcon) {
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(import_jsx_runtime32.Fragment, { children: [
          resolvedLeftIcon,
          children
        ] });
      }
      if (resolvedRightIcon) {
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(import_jsx_runtime32.Fragment, { children: [
          children,
          resolvedRightIcon
        ] });
      }
      return children;
    };
    return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
      Comp,
      {
        className: (0, import_clsx13.clsx)(buttonVariants({ variant, size, loading: showLoading, className })),
        ref,
        disabled: isButtonDisabled,
        type,
        onClick: handleClick,
        onKeyDown: (event) => {
          onKeyDown?.(event);
          handleKeyDownEvent(event);
        },
        "aria-disabled": isButtonDisabled ? "true" : void 0,
        ...props,
        children: renderContent()
      }
    );
  }
);
Button.displayName = "Button";

// src/forms/BottomSheet.tsx
var React24 = __toESM(require("react"));
var import_clsx14 = require("clsx");
var import_jsx_runtime33 = require("react/jsx-runtime");
var BottomSheet = React24.forwardRef(
  ({ children, isOpen, onClose, className }, ref) => {
    const overlayRef = React24.useRef(null);
    React24.useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }, [isOpen, onClose]);
    const handleBackdropClick = (e) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
      "div",
      {
        ref: overlayRef,
        className: (0, import_clsx14.clsx)("fixed inset-0 z-50 bg-black/50 flex items-end", !isOpen && "hidden"),
        onClick: handleBackdropClick,
        "aria-modal": "true",
        role: "dialog",
        "aria-label": "Bottom sheet",
        "aria-hidden": !isOpen,
        children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
          "div",
          {
            ref,
            className: (0, import_clsx14.clsx)(
              "w-full max-h-[90vh] bg-white rounded-t-lg shadow-lg overflow-auto",
              isOpen && "animate-in slide-in-from-bottom duration-200",
              className
            ),
            onClick: (e) => e.stopPropagation(),
            children
          }
        )
      }
    );
  }
);
BottomSheet.displayName = "BottomSheet";

// src/forms/FileUpload.tsx
var import_class_variance_authority10 = require("class-variance-authority");
var import_clsx15 = require("clsx");
var import_react33 = require("react");
var import_jsx_runtime34 = require("react/jsx-runtime");
var uploadVariants = (0, import_class_variance_authority10.cva)("file-upload", {
  variants: {
    variant: {
      default: "upload-default",
      outlined: "upload-outlined",
      filled: "upload-filled",
      minimal: "upload-minimal"
    },
    size: {
      sm: "upload-sm",
      md: "upload-md",
      lg: "upload-lg"
    },
    state: {
      idle: "state-idle",
      dragover: "state-dragover",
      uploading: "state-uploading",
      success: "state-success",
      error: "state-error",
      disabled: "state-disabled"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    state: "idle"
  }
});
var FileValidationUtils = {
  validateFile: (file, validation) => {
    if (!validation) {
      return null;
    }
    if (validation.maxSize && file.size > validation.maxSize) {
      return `File size ${FileValidationUtils.formatSize(file.size)} exceeds maximum ${FileValidationUtils.formatSize(validation.maxSize)}`;
    }
    if (validation.minSize && file.size < validation.minSize) {
      return `File size ${FileValidationUtils.formatSize(file.size)} is below minimum ${FileValidationUtils.formatSize(validation.minSize)}`;
    }
    if (validation.acceptedTypes && validation.acceptedTypes.length > 0) {
      const isAccepted = validation.acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.includes(type) || file.type === type;
      });
      if (!isAccepted) {
        return `File type ${file.type} is not allowed. Accepted types: ${validation.acceptedTypes.join(", ")}`;
      }
    }
    return null;
  },
  validateFileList: (files, validation) => {
    if (!validation) {
      return null;
    }
    if (validation.maxFiles && files.length > validation.maxFiles) {
      return `Too many files selected. Maximum allowed: ${validation.maxFiles}`;
    }
    if (validation.required && files.length === 0) {
      return "At least one file is required";
    }
    return null;
  },
  formatSize: (bytes) => {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  },
  isImageFile: (file) => {
    if (file.type && file.type.startsWith("image/")) {
      return true;
    }
    return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file.name);
  },
  getFileIcon: (file) => {
    if (file.type.startsWith("image/")) {
      return "\u{1F5BC}\uFE0F";
    }
    if (file.type.startsWith("video/")) {
      return "\u{1F3A5}";
    }
    if (file.type.startsWith("audio/")) {
      return "\u{1F3B5}";
    }
    if (file.type.includes("pdf")) {
      return "\u{1F4C4}";
    }
    if (file.type.includes("document") || file.type.includes("word")) {
      return "\u{1F4DD}";
    }
    if (file.type.includes("spreadsheet") || file.type.includes("excel")) {
      return "\u{1F4CA}";
    }
    if (file.type.includes("presentation") || file.type.includes("powerpoint")) {
      return "\u{1F4CB}";
    }
    if (file.type.includes("zip") || file.type.includes("rar")) {
      return "\u{1F5DC}\uFE0F";
    }
    return "\u{1F4C1}";
  }
};
var useDragAndDrop = (onFileDrop, disabled) => {
  const [isDragOver, setIsDragOver] = (0, import_react33.useState)(false);
  const handleDragEnter = (0, import_react33.useCallback)(
    (e) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );
  const handleDragOver = (0, import_react33.useCallback)((e) => {
    e.preventDefault();
  }, []);
  const handleDragLeave = (0, import_react33.useCallback)(
    (e) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(false);
      }
    },
    [disabled]
  );
  const handleDrop = (0, import_react33.useCallback)(
    (e) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer?.files || []);
        onFileDrop(files);
      }
    },
    [disabled, onFileDrop]
  );
  return {
    isDragOver,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop
    }
  };
};
var useFileInput = (onFileSelect, multiple, accept) => {
  const inputRef = (0, import_react33.useRef)(null);
  const handleFileChange = (0, import_react33.useCallback)(
    (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFileSelect(files);
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [onFileSelect]
  );
  const openFileDialog = (0, import_react33.useCallback)(() => {
    inputRef.current?.click();
  }, []);
  return {
    inputRef,
    inputProps: {
      ref: inputRef,
      type: "file",
      multiple,
      accept,
      onChange: handleFileChange,
      style: { display: "none" },
      "aria-hidden": true
    },
    openFileDialog
  };
};
var UploadArea = (0, import_react33.forwardRef)(
  ({ isDragOver, disabled, children, onClick, onKeyDown, className, ...props }, ref) => {
    const handleKeyDown = (event) => {
      if (disabled) {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick?.();
      }
      onKeyDown?.(event);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
      "div",
      {
        ref,
        className: (0, import_clsx15.clsx)(
          "upload-area",
          {
            "upload-area--dragover": isDragOver,
            "upload-area--disabled": disabled
          },
          className
        ),
        onClick: disabled ? void 0 : onClick,
        onKeyDown: handleKeyDown,
        role: "button",
        tabIndex: disabled ? -1 : 0,
        "aria-label": "File upload area",
        ...props,
        children
      }
    );
  }
);
var UploadContent = ({
  icon = /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { className: "upload-icon", children: "\u{1F4C1}" }),
  primaryText = "Drop files here or click to upload",
  secondaryText,
  className
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: (0, import_clsx15.clsx)("upload-content", className), children: [
    icon,
    /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "upload-text", children: [
      /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "upload-primary", children: primaryText }),
      secondaryText && /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "upload-secondary", children: secondaryText })
    ] })
  ] });
};
var FilePreview = ({ file, onRemove, className }) => {
  const [previewUrl, setPreviewUrl] = (0, import_react33.useState)(null);
  (0, import_react33.useEffect)(() => {
    if (!FileValidationUtils.isImageFile(file)) {
      setPreviewUrl(null);
      return;
    }
    let isActive = true;
    if (typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onload = () => {
        if (isActive) {
          setPreviewUrl(typeof reader.result === "string" ? reader.result : null);
        }
      };
      reader.readAsDataURL(file);
      return () => {
        isActive = false;
        reader.abort();
      };
    }
    if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL?.(url);
    }
    return;
  }, [file]);
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: (0, import_clsx15.clsx)("file-preview", className), children: [
    previewUrl ? /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("img", { src: previewUrl, alt: "Preview", className: "preview-image" }) : /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "file-icon", children: FileValidationUtils.getFileIcon(file) }),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "file-info", children: [
      /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "file-name", children: file.name }),
      /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "file-size", children: FileValidationUtils.formatSize(file.size) }),
      /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "file-type", children: file.type })
    ] }),
    onRemove && /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
      "button",
      {
        type: "button",
        className: "remove-file",
        onClick: onRemove,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onRemove();
          }
        },
        "aria-label": `Remove ${file.name}`,
        children: "\xD7"
      }
    )
  ] });
};
var FileUpload = (0, import_react33.forwardRef)(
  ({
    className,
    variant,
    size,
    multiple = false,
    disabled = false,
    accept,
    validation,
    onFileSelect,
    onError,
    children,
    ...props
  }, ref) => {
    const [selectedFiles, setSelectedFiles] = (0, import_react33.useState)([]);
    const [error, setError] = (0, import_react33.useState)(null);
    const handleFileSelection = (0, import_react33.useCallback)(
      (files) => {
        const listError = FileValidationUtils.validateFileList(files, validation);
        if (listError) {
          setError(listError);
          onError?.(listError);
          return;
        }
        const validFiles = [];
        for (const file of files) {
          const fileError = FileValidationUtils.validateFile(file, validation);
          if (fileError) {
            setError(fileError);
            onError?.(fileError);
            return;
          }
          validFiles.push(file);
        }
        setError(null);
        setSelectedFiles(multiple ? [...selectedFiles, ...validFiles] : validFiles);
        onFileSelect?.(validFiles);
      },
      [validation, multiple, selectedFiles, onFileSelect, onError]
    );
    const { isDragOver, dragHandlers } = useDragAndDrop(handleFileSelection, disabled);
    const { inputProps, openFileDialog } = useFileInput(handleFileSelection, multiple, accept);
    const state = disabled ? "disabled" : isDragOver ? "dragover" : error ? "error" : "idle";
    return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(
      "div",
      {
        ref,
        className: (0, import_clsx15.clsx)(uploadVariants({ variant, size, state }), className),
        ...dragHandlers,
        ...props,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("input", { ...inputProps }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
            UploadArea,
            {
              isDragOver,
              disabled,
              onClick: openFileDialog,
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openFileDialog();
                }
              },
              children: children || /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
                UploadContent,
                {
                  primaryText: "Drop files here or click to upload",
                  ...validation?.acceptedTypes ? { secondaryText: `Accepted types: ${validation.acceptedTypes.join(", ")}` } : {}
                }
              )
            }
          ),
          error && /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "upload-error", role: "alert", children: error }),
          selectedFiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "file-list", children: selectedFiles.map((file, index) => /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
            FilePreview,
            {
              file,
              onRemove: () => {
                const newFiles = selectedFiles.filter((_, i) => i !== index);
                setSelectedFiles(newFiles);
              }
            },
            `${file.name}-${index}`
          )) })
        ]
      }
    );
  }
);
FileUpload.displayName = "FileUpload";
UploadArea.displayName = "UploadArea";
UploadContent.displayName = "UploadContent";
FilePreview.displayName = "FilePreview";

// src/forms/Input.tsx
var import_class_variance_authority11 = require("class-variance-authority");
var import_clsx16 = require("clsx");
var import_react34 = require("react");
var import_lucide_react15 = require("lucide-react");
var import_jsx_runtime35 = require("react/jsx-runtime");
var inputVariants = (0, import_class_variance_authority11.cva)(
  "flex w-full rounded-md border bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:ring-ring",
        error: "border-destructive text-destructive focus-visible:ring-destructive",
        success: "border-success text-success focus-visible:ring-success",
        warning: "border-warning text-warning focus-visible:ring-warning"
      },
      size: {
        sm: "h-8 px-2 text-xs",
        default: "h-9 px-3",
        lg: "h-10 px-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Input = (0, import_react34.forwardRef)(
  ({
    className,
    variant,
    size,
    type = "text",
    label,
    helperText,
    error,
    success,
    warning,
    isLoading,
    leftIcon,
    rightIcon,
    showPasswordToggle = false,
    validate,
    validateOnBlur = false,
    validateOnChange = false,
    sanitize = true,
    maxLength,
    showCharCount = false,
    disabled,
    value,
    onChange,
    onBlur,
    id,
    "aria-describedby": ariaDescribedBy,
    "aria-label": ariaLabel,
    role: roleAttr,
    tabIndex,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = (0, import_react34.useState)(false);
    const [validationError, setValidationError] = (0, import_react34.useState)(null);
    const [charCount, setCharCount] = (0, import_react34.useState)(0);
    const inputId = (0, import_react34.useId)();
    const actualId = id || inputId;
    const helperTextId = `${actualId}-helper`;
    const errorId = `${actualId}-error`;
    const currentError = error || validationError;
    const currentVariant = currentError ? "error" : success ? "success" : warning ? "warning" : variant;
    const inputType = type === "password" && showPassword ? "text" : type;
    const shouldShowPasswordToggle = type === "password" && showPasswordToggle;
    const sanitizeValue = (0, import_react34.useCallback)(
      (val) => {
        if (!sanitize) return val;
        return val.replace(/[<>]/g, "").replace(/javascript:/gi, "").replace(/on\w+=/gi, "");
      },
      [sanitize]
    );
    const performValidation = (0, import_react34.useCallback)(
      (val) => {
        if (!validate) return null;
        try {
          return validate(val);
        } catch (err) {
          return "Validation error occurred";
        }
      },
      [validate]
    );
    const handleChange = (0, import_react34.useCallback)(
      (e) => {
        let newValue = e.target.value;
        newValue = sanitizeValue(newValue);
        setCharCount(newValue.length);
        if (validateOnChange) {
          const validationResult = performValidation(newValue);
          setValidationError(validationResult);
        } else if (validationError) {
          setValidationError(null);
        }
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: newValue
          }
        };
        onChange?.(syntheticEvent);
      },
      [sanitizeValue, validateOnChange, performValidation, validationError, onChange]
    );
    const handleBlur = (0, import_react34.useCallback)(
      (e) => {
        if (validateOnBlur) {
          const validationResult = performValidation(e.target.value);
          setValidationError(validationResult);
        }
        onBlur?.(e);
      },
      [validateOnBlur, performValidation, onBlur]
    );
    const togglePasswordVisibility = (0, import_react34.useCallback)(() => {
      setShowPassword((prev) => !prev);
    }, []);
    const describedBy = [ariaDescribedBy, helperText ? helperTextId : null, currentError ? errorId : null].filter(Boolean).join(" ") || void 0;
    const showCharCountDisplay = showCharCount && maxLength;
    const isCharLimitExceeded = maxLength && charCount > maxLength;
    (0, import_react34.useEffect)(() => {
      if (typeof value === "string") {
        setCharCount(value.length);
      } else if (typeof value === "number") {
        setCharCount(value.toString().length);
      } else if (value == null) {
        setCharCount(0);
      }
    }, [value]);
    return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "space-y-1", children: [
      label && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
        "label",
        {
          htmlFor: actualId,
          className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          children: [
            label,
            props.required && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "ml-1 text-destructive", "aria-label": "required", children: "*" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "relative", children: [
        leftIcon && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none", children: leftIcon }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          "input",
          {
            ref,
            id: actualId,
            type: inputType,
            className: (0, import_clsx16.clsx)(inputVariants({ variant: currentVariant, size, className }), {
              "pl-10": leftIcon,
              "pr-10": rightIcon || shouldShowPasswordToggle,
              "pr-20": rightIcon && shouldShowPasswordToggle
            }),
            disabled: disabled || isLoading,
            value,
            onChange: handleChange,
            onBlur: handleBlur,
            maxLength,
            "aria-invalid": currentError ? "true" : "false",
            "aria-describedby": describedBy,
            "aria-label": ariaLabel ?? (label ? void 0 : "Input field"),
            role: roleAttr ?? (type === "password" ? "textbox" : void 0),
            tabIndex: tabIndex ?? 0,
            ...props
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2", children: [
          currentError && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_lucide_react15.AlertCircle, { className: "h-4 w-4 text-destructive", "aria-hidden": "true" }),
          success && !currentError && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_lucide_react15.Check, { className: "h-4 w-4 text-success", "aria-hidden": "true" }),
          rightIcon && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "text-muted-foreground", children: rightIcon }),
          shouldShowPasswordToggle && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
            "button",
            {
              type: "button",
              onClick: togglePasswordVisibility,
              className: "text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "aria-label": showPassword ? "Hide password" : "Show password",
              tabIndex: disabled ? -1 : 0,
              children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_lucide_react15.EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_lucide_react15.Eye, { className: "h-4 w-4" })
            }
          )
        ] }),
        isLoading && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "absolute inset-0 bg-background/50 flex items-center justify-center rounded-md", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" }) })
      ] }),
      showCharCountDisplay && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
        "div",
        {
          className: (0, import_clsx16.clsx)(
            "text-xs text-right",
            isCharLimitExceeded ? "text-destructive" : "text-muted-foreground"
          ),
          children: [
            charCount,
            "/",
            maxLength
          ]
        }
      ),
      helperText && !currentError && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { id: helperTextId, className: "text-xs text-muted-foreground", children: helperText }),
      currentError && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { id: errorId, className: "text-xs text-destructive", role: "alert", children: currentError }),
      success && !currentError && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "text-xs text-success", children: success }),
      warning && !currentError && !success && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "text-xs text-warning", children: warning })
    ] });
  }
);
Input.displayName = "Input";

// src/forms/Textarea.tsx
var import_react35 = __toESM(require("react"));
init_cn();
var import_jsx_runtime36 = require("react/jsx-runtime");
var Textarea = import_react35.default.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      "textarea",
      {
        className: cn(
          "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";

// src/forms/Form.tsx
var React26 = __toESM(require("react"));
var LabelPrimitive = __toESM(require("@radix-ui/react-label"));
var import_react_slot7 = require("@radix-ui/react-slot");
var import_class_variance_authority12 = require("class-variance-authority");
var import_clsx17 = require("clsx");
var import_react_hook_form = require("react-hook-form");
var import_jsx_runtime37 = require("react/jsx-runtime");
var { createContext: createContext4, useContext: useContext4, forwardRef: forwardRef14 } = React26;
var formVariants = (0, import_class_variance_authority12.cva)("", {
  variants: {
    layout: {
      vertical: "",
      horizontal: "",
      inline: ""
    },
    size: {
      sm: "",
      md: "",
      lg: ""
    }
  },
  defaultVariants: {
    layout: "vertical",
    size: "md"
  }
});
var inputBaseClass = "form-input flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
var inputVariants2 = (0, import_class_variance_authority12.cva)(inputBaseClass, {
  variants: {
    variant: {
      default: "variant-default",
      outlined: "variant-outlined outlined border-2 border-primary/60",
      filled: "variant-filled filled bg-muted",
      underlined: "variant-underlined underlined border-0 border-b border-input focus-visible:ring-0"
    },
    size: {
      sm: "size-sm sm h-8 text-xs",
      md: "size-md md h-10 text-sm",
      lg: "size-lg lg h-12 text-base"
    },
    state: {
      default: "state-default",
      error: "state-error error border-destructive text-destructive",
      success: "state-success success border-success text-success",
      warning: "state-warning warning border-warning text-warning"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    state: "default"
  }
});
var FormContext = createContext4(null);
var FormFieldContext = createContext4(null);
var FormItemContext = createContext4(null);
var useFormContext = () => {
  const context = useContext4(FormContext);
  if (!context) {
    throw new Error("Form components must be used within a Form");
  }
  return context;
};
var useFormFieldState = () => {
  const fieldContext = useContext4(FormFieldContext);
  const itemContext = useContext4(FormItemContext);
  if (!fieldContext || !itemContext) {
    return null;
  }
  return {
    ...fieldContext,
    formItemId: itemContext.id,
    formDescriptionId: `${itemContext.id}-description`,
    formMessageId: `${itemContext.id}-message`,
    inputId: `${itemContext.id}-control`
  };
};
function Form({
  form,
  onSubmit,
  children,
  layout,
  size,
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? import_react_slot7.Slot : "form";
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(FormContext.Provider, { value: { form }, children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
    Comp,
    {
      className: (0, import_clsx17.clsx)(formVariants({ layout, size }), className),
      onSubmit: form.handleSubmit(onSubmit),
      noValidate: true,
      ...props,
      children
    }
  ) });
}
function FormField({ name, rules, defaultValue, children }) {
  const { form } = useFormContext();
  const validationRules = rules ? createValidationRules(rules) : void 0;
  const controllerProps = {
    name,
    control: form.control,
    defaultValue,
    ...validationRules && { rules: validationRules }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
    import_react_hook_form.Controller,
    {
      ...controllerProps,
      render: ({ field, fieldState }) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
        FormFieldContext.Provider,
        {
          value: {
            name,
            error: fieldState.error?.message ?? "",
            invalid: fieldState.invalid
          },
          children: children({
            value: field.value,
            onChange: (value) => field.onChange(value),
            onBlur: field.onBlur,
            error: fieldState.error?.message ?? "",
            invalid: fieldState.invalid
          })
        }
      )
    }
  );
}
var FormItem = forwardRef14(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? import_react_slot7.Slot : "div";
    const id = useUniqueId("form-item");
    return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Comp, { ref, className: (0, import_clsx17.clsx)("form-item space-y-2", className), ...props }) });
  }
);
var FormLabel = forwardRef14(
  ({ className, required, children, htmlFor, ...props }, ref) => {
    const field = useFormFieldState();
    return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
      LabelPrimitive.Root,
      {
        ref,
        htmlFor: htmlFor ?? field?.inputId,
        className: (0, import_clsx17.clsx)(
          "form-label",
          { required },
          field?.invalid && "text-destructive",
          className
        ),
        ...props,
        children: [
          children,
          required ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "required-indicator", children: "*" }) : null
        ]
      }
    );
  }
);
var FormDescription = forwardRef14(({ className, ...props }, ref) => {
  const field = useFormFieldState();
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
    "p",
    {
      ref,
      id: field?.formDescriptionId,
      className: (0, import_clsx17.clsx)("form-description text-sm text-muted-foreground", className),
      ...props
    }
  );
});
var messageVariantClasses = {
  error: "text-destructive",
  success: "text-success",
  warning: "text-warning",
  info: "text-info"
};
var FormMessage = forwardRef14(
  ({ className, variant = "error", children, ...props }, ref) => {
    const field = useFormFieldState();
    const body = children ?? field?.error;
    if (!body) {
      return null;
    }
    const shouldAnnounce = variant === "error" || field?.invalid;
    return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
      "p",
      {
        ref,
        id: field?.formMessageId,
        role: shouldAnnounce ? "alert" : void 0,
        "aria-live": shouldAnnounce ? "assertive" : void 0,
        className: (0, import_clsx17.clsx)(
          "form-message text-sm",
          `variant-${variant}`,
          messageVariantClasses[variant],
          className
        ),
        ...props,
        children: body
      }
    );
  }
);
var Input2 = forwardRef14(
  ({
    className,
    variant,
    size,
    state,
    type = "text",
    startIcon,
    endIcon,
    asChild = false,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
    name,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot7.Slot : "input";
    const generatedId = useUniqueId("input");
    const field = useFormFieldState();
    const controlId = field?.inputId ?? generatedId;
    const isInvalid = field ? field.invalid : ariaInvalid ?? state === "error";
    const describedBy = [ariaDescribedBy, field?.formDescriptionId, field?.error ? field?.formMessageId : null].filter(Boolean).join(" ") || void 0;
    const resolvedName = name ?? field?.name;
    const sharedProps = {
      id: controlId,
      name: resolvedName,
      "aria-invalid": isInvalid ? "true" : "false",
      "aria-describedby": describedBy
    };
    if (startIcon || endIcon) {
      return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: (0, import_clsx17.clsx)("input-wrapper", inputVariants2({ variant, size, state }), className), children: [
        startIcon ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "input-start-icon", "aria-hidden": "true", role: "presentation", children: startIcon }) : null,
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Comp, { type, ref, ...sharedProps, ...props, className: "input-element" }),
        endIcon ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "input-end-icon", "aria-hidden": "true", role: "presentation", children: endIcon }) : null
      ] });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
      Comp,
      {
        type,
        ref,
        ...sharedProps,
        ...props,
        className: (0, import_clsx17.clsx)(inputVariants2({ variant, size, state }), className)
      }
    );
  }
);
var Textarea2 = forwardRef14(
  ({
    className,
    variant,
    size,
    state,
    resize = "vertical",
    asChild = false,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
    name,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot7.Slot : "textarea";
    const generatedId = useUniqueId("textarea");
    const field = useFormFieldState();
    const controlId = field?.inputId ?? generatedId;
    const isInvalid = field ? field.invalid : ariaInvalid ?? state === "error";
    const describedBy = [ariaDescribedBy, field?.formDescriptionId, field?.error ? field?.formMessageId : null].filter(Boolean).join(" ") || void 0;
    const resolvedName = name ?? field?.name;
    return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
      Comp,
      {
        id: controlId,
        name: resolvedName,
        "aria-invalid": isInvalid ? "true" : "false",
        "aria-describedby": describedBy,
        className: (0, import_clsx17.clsx)(inputVariants2({ variant, size, state }), `resize-${resize}`, className),
        ref,
        ...props
      }
    );
  }
);
var Select = forwardRef14(
  ({
    className,
    variant,
    size,
    state,
    placeholder,
    options = [],
    children,
    asChild = false,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
    name,
    ...props
  }, ref) => {
    const Comp = asChild ? import_react_slot7.Slot : "select";
    const generatedId = useUniqueId("select");
    const field = useFormFieldState();
    const controlId = field?.inputId ?? generatedId;
    const isInvalid = field ? field.invalid : ariaInvalid ?? state === "error";
    const describedBy = [ariaDescribedBy, field?.formDescriptionId, field?.error ? field?.formMessageId : null].filter(Boolean).join(" ") || void 0;
    const resolvedName = name ?? field?.name;
    return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
      Comp,
      {
        id: controlId,
        name: resolvedName,
        "aria-invalid": isInvalid ? "true" : "false",
        "aria-describedby": describedBy,
        className: (0, import_clsx17.clsx)(inputVariants2({ variant, size, state }), className),
        ref,
        ...props,
        children: [
          placeholder ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("option", { value: "", disabled: true, children: placeholder }) : null,
          options.map(({ value, label, disabled }) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("option", { value, disabled, children: label }, value)),
          children
        ]
      }
    );
  }
);
var Checkbox = forwardRef14(
  ({
    className,
    label,
    description,
    indeterminate,
    id,
    "data-testid": dataTestId,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
    name,
    ...props
  }, ref) => {
    const generatedId = useUniqueId();
    const checkboxId = id || `checkbox-${generatedId}`;
    const field = useFormFieldState();
    const inputRef = React26.useRef(null);
    const controlId = field?.inputId ?? checkboxId;
    const isInvalid = field ? field.invalid : ariaInvalid ?? false;
    const describedBy = [ariaDescribedBy, field?.formDescriptionId, field?.error ? field?.formMessageId : null].filter(Boolean).join(" ") || void 0;
    const resolvedName = name ?? field?.name;
    React26.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);
    const assignRef = (node) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: (0, import_clsx17.clsx)("checkbox-wrapper space-y-1.5", className), "data-testid": dataTestId, children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
        "input",
        {
          type: "checkbox",
          ref: assignRef,
          id: controlId,
          name: resolvedName,
          "aria-invalid": isInvalid ? "true" : "false",
          "aria-describedby": describedBy,
          className: "checkbox-input",
          ...props
        }
      ),
      label || description ? /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "checkbox-content", children: [
        label ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("label", { htmlFor: controlId, className: "checkbox-label", children: label }) : null,
        description ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("p", { className: "checkbox-description", children: description }) : null
      ] }) : null
    ] });
  }
);
var Radio2 = forwardRef14(
  ({
    className,
    label,
    description,
    id,
    "data-testid": dataTestId,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
    name,
    ...props
  }, ref) => {
    const generatedId = useUniqueId();
    const radioId = id || `radio-${generatedId}`;
    const field = useFormFieldState();
    const controlId = field?.inputId ?? radioId;
    const isInvalid = field ? field.invalid : ariaInvalid ?? false;
    const describedBy = [ariaDescribedBy, field?.formDescriptionId, field?.error ? field?.formMessageId : null].filter(Boolean).join(" ") || void 0;
    const resolvedName = name ?? field?.name;
    return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: (0, import_clsx17.clsx)("radio-wrapper space-y-1.5", className), "data-testid": dataTestId, children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
        "input",
        {
          type: "radio",
          ref,
          id: controlId,
          name: resolvedName,
          "aria-invalid": isInvalid ? "true" : "false",
          "aria-describedby": describedBy,
          className: "radio-input",
          ...props
        }
      ),
      label || description ? /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "radio-content", children: [
        label ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("label", { htmlFor: controlId, className: "radio-label", children: label }) : null,
        description ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("p", { className: "radio-description", children: description }) : null
      ] }) : null
    ] });
  }
);
var RadioGroup = forwardRef14(
  ({ className, name, value, onValueChange, options, orientation = "vertical", ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
      "div",
      {
        ref,
        className: (0, import_clsx17.clsx)("radio-group", `orientation-${orientation}`, className),
        ...props,
        children: options.map(({ value: optionValue, label, description, disabled }) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          Radio2,
          {
            name,
            value: optionValue,
            checked: value === optionValue,
            onChange: () => onValueChange?.(optionValue),
            disabled,
            label,
            ...description && { description }
          },
          optionValue
        ))
      }
    );
  }
);
function createValidationRules(rules) {
  const validation = {
    // Implementation pending
  };
  if (rules.required) {
    validation.required = typeof rules.required === "string" ? rules.required : "This field is required";
  }
  if (rules.pattern) {
    validation.pattern = rules.pattern;
  }
  if (rules.min) {
    validation.min = rules.min;
  }
  if (rules.max) {
    validation.max = rules.max;
  }
  if (rules.minLength) {
    validation.minLength = rules.minLength;
  }
  if (rules.maxLength) {
    validation.maxLength = rules.maxLength;
  }
  if (rules.validate) {
    validation.validate = rules.validate;
  }
  return validation;
}
var validationPatterns = {
  email: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i,
    message: "Please enter a valid email address"
  },
  phone: {
    value: /^[+]?[1-9][\d]{0,15}$/,
    message: "Please enter a valid phone number"
  },
  url: {
    value: /^https?:\/\/(?:[-\w.])+(?::[0-9]+)?(?:\/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:[\w.])*)?)?$/,
    message: "Please enter a valid URL"
  },
  ipAddress: {
    value: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    message: "Please enter a valid IP address"
  }
};
function useUniqueId(prefix = "id") {
  const [generatedId] = React26.useState(
    () => `${prefix}-${Math.random().toString(36).slice(2, 11)}`
  );
  return generatedId;
}
FormItem.displayName = "FormItem";
FormLabel.displayName = "FormLabel";
FormDescription.displayName = "FormDescription";
FormMessage.displayName = "FormMessage";
Input2.displayName = "Input";
Textarea2.displayName = "Textarea";

// src/performance/VirtualizedTable.tsx
var import_react37 = require("react");

// src/performance/VirtualizedDataTable.tsx
var import_react36 = require("react");
var import_lucide_react16 = require("lucide-react");
var import_jsx_runtime38 = require("react/jsx-runtime");
var Card3 = ({
  children,
  className = ""
}) => /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: `border rounded-lg p-4 ${className}`, children });
var Skeleton = ({ className = "" }) => /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: `animate-pulse bg-gray-200 rounded ${className}` });
function VirtualizedDataTable({
  data,
  columns,
  height = 480,
  rowHeight = 48,
  onSort,
  onRowClick,
  onSelectionChange,
  loading = false,
  loadMore,
  hasNextPage = false,
  searchValue = "",
  onSearchChange,
  selectable = false,
  className = "",
  forwardedScrollRef
}) {
  const [sortConfig, setSortConfig] = (0, import_react36.useState)();
  const [selectedKeys, setSelectedKeys] = (0, import_react36.useState)(/* @__PURE__ */ new Set());
  const internalScrollRef = (0, import_react36.useRef)(null);
  const scrollContainerRef = forwardedScrollRef ?? internalScrollRef;
  const totalWidth = (0, import_react36.useMemo)(
    () => columns.reduce((sum, col) => sum + col.width, selectable ? 48 : 0),
    [columns, selectable]
  );
  const resolveRowKey = (0, import_react36.useCallback)((row, index) => {
    if (row && typeof row === "object" && "id" in row) {
      const maybeId = row.id;
      if (typeof maybeId === "string" || typeof maybeId === "number") {
        return String(maybeId);
      }
    }
    return String(index);
  }, []);
  const handleSort = (0, import_react36.useCallback)(
    (columnKey) => {
      const nextDirection = sortConfig?.key === columnKey && sortConfig.direction === "asc" ? "desc" : "asc";
      setSortConfig({ key: columnKey, direction: nextDirection });
      onSort?.(columnKey, nextDirection);
    },
    [sortConfig, onSort]
  );
  const handleRowSelection = (0, import_react36.useCallback)(
    (row, index, selected) => {
      if (!onSelectionChange) return;
      const rowKey = resolveRowKey(row, index);
      const next = new Set(selectedKeys);
      if (selected) {
        next.add(rowKey);
      } else {
        next.delete(rowKey);
      }
      setSelectedKeys(next);
      const selectedData = data.filter((item, idx) => next.has(resolveRowKey(item, idx)));
      onSelectionChange(selectedData);
    },
    [data, onSelectionChange, resolveRowKey, selectedKeys]
  );
  const handleSelectAll = (0, import_react36.useCallback)(
    (checked) => {
      if (!onSelectionChange) return;
      if (checked) {
        const allKeys = new Set(data.map(resolveRowKey));
        setSelectedKeys(allKeys);
        onSelectionChange(data);
      } else {
        setSelectedKeys(/* @__PURE__ */ new Set());
        onSelectionChange([]);
      }
    },
    [data, onSelectionChange, resolveRowKey]
  );
  (0, import_react36.useEffect)(() => {
    if (!loadMore || !hasNextPage) {
      return;
    }
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }
    const handleScroll = () => {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - rowHeight) {
        loadMore();
      }
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, loadMore, rowHeight, scrollContainerRef]);
  if (loading && data.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Card3, { className: `p-6 ${className}`, children: /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "space-y-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Skeleton, { className: "h-12 w-full" }),
      /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Skeleton, { className: "h-8 w-full" }),
      /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Skeleton, { className: "h-8 w-full" }),
      /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Skeleton, { className: "h-8 w-full" })
    ] }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)(Card3, { className: clsx18("overflow-hidden", className), children: [
    onSearchChange && /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "border-b p-4", children: /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "relative max-w-md", children: [
      /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(import_lucide_react16.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }),
      /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
        "input",
        {
          placeholder: "Search...",
          value: searchValue,
          onChange: (event) => onSearchChange(event.target.value),
          className: "pl-10"
        }
      )
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
      "div",
      {
        ref: scrollContainerRef,
        className: "overflow-auto",
        style: { maxHeight: height },
        role: "grid",
        "aria-rowcount": data.length,
        children: /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { style: { minWidth: totalWidth }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "flex items-center border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700", children: [
            selectable ? /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "flex w-12 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
              "input",
              {
                type: "checkbox",
                checked: selectedKeys.size > 0 && selectedKeys.size === data.length,
                onChange: (event) => handleSelectAll(event.target.checked),
                "aria-label": "Select all rows"
              }
            ) }) : null,
            columns.map((column) => {
              const isSorted = sortConfig?.key === column.key;
              return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)(
                "button",
                {
                  type: "button",
                  className: "flex items-center gap-2 px-3 py-2",
                  style: { width: column.width },
                  onClick: () => column.sortable && handleSort(String(column.key)),
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { children: column.label }),
                    column.sortable && /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "text-xs text-gray-500", children: isSorted ? sortConfig?.direction === "asc" ? "\u2191" : "\u2193" : /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(import_lucide_react16.ChevronUp, { className: "h-3 w-3 opacity-40" }) })
                  ]
                },
                String(column.key)
              );
            })
          ] }),
          data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "px-4 py-6 text-center text-sm text-gray-500", children: "No data available" }) : data.map((row, index) => {
            const rowKey = resolveRowKey(row, index);
            const isSelected = selectedKeys.has(rowKey);
            return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)(
              "div",
              {
                className: clsx18(
                  "flex items-center border-b border-gray-100 px-4 py-2 text-sm transition-colors",
                  isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                ),
                role: "row",
                onClick: () => onRowClick?.(row, index),
                children: [
                  selectable ? /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "flex w-12 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
                    "input",
                    {
                      type: "checkbox",
                      checked: isSelected,
                      onChange: (event) => handleRowSelection(row, index, event.target.checked),
                      "aria-label": "Select row"
                    }
                  ) }) : null,
                  columns.map((column) => {
                    const rawValue = typeof column.key === "string" ? row[column.key] : row[String(column.key)];
                    const content = column.render ? column.render(rawValue, row, index) : column.formatter ? column.formatter(rawValue) : rawValue;
                    return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
                      "div",
                      {
                        className: "px-3 py-2",
                        style: { width: column.width, textAlign: column.align ?? "left" },
                        children: content
                      },
                      `${rowKey}-${String(column.key)}`
                    );
                  })
                ]
              },
              rowKey
            );
          }),
          hasNextPage ? /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "flex justify-center border-t border-gray-100 px-4 py-3", children: loading ? /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "text-sm text-gray-500", children: "Loading more..." }) : loadMore ? /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
            "button",
            {
              type: "button",
              onClick: loadMore,
              className: "rounded border px-3 py-1 text-sm text-gray-700 hover:bg-gray-100",
              children: "Load more"
            }
          ) : null }) : null
        ] })
      }
    )
  ] });
}
function clsx18(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/performance/VirtualizedTable.tsx
var import_jsx_runtime39 = require("react/jsx-runtime");
var VirtualizedTable = (0, import_react37.forwardRef)(
  ({ rowHeight = 48, ...props }, ref) => {
    const scrollRef = (0, import_react37.useRef)(null);
    (0, import_react37.useImperativeHandle)(
      ref,
      () => ({
        scrollTo: (index) => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = index * rowHeight;
          }
        },
        scrollToTop: () => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
          }
        },
        scrollToBottom: () => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }
      }),
      [rowHeight]
    );
    return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(VirtualizedDataTable, { ...props, rowHeight, forwardedScrollRef: scrollRef });
  }
);
VirtualizedTable.displayName = "VirtualizedTable";

// src/theming/index.ts
var defaultTheme = {
  name: "default",
  colors: {
    primary: "#3b82f6",
    secondary: "#64748b",
    background: "#ffffff",
    foreground: "#0f172a",
    muted: "#f1f5f9",
    accent: "#f59e0b",
    destructive: "#dc2626"
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem"
  },
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem"
    }
  }
};
var adminTheme = {
  ...defaultTheme,
  name: "admin",
  colors: {
    ...defaultTheme.colors,
    primary: "#1e40af",
    accent: "#059669"
  }
};
var customerTheme = {
  ...defaultTheme,
  name: "customer",
  colors: {
    ...defaultTheme.colors,
    primary: "#7c3aed",
    accent: "#db2777"
  }
};
var resellerTheme = {
  ...defaultTheme,
  name: "reseller",
  colors: {
    ...defaultTheme.colors,
    primary: "#dc2626",
    accent: "#ea580c"
  }
};
function createPortalTheme(portal) {
  switch (portal) {
    case "admin":
      return adminTheme;
    case "customer":
      return customerTheme;
    case "reseller":
      return resellerTheme;
    default:
      return defaultTheme;
  }
}
function applyTheme(theme) {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value);
  });
  root.style.setProperty("--font-family", theme.typography.fontFamily);
}
var themes = {
  default: defaultTheme,
  admin: adminTheme,
  customer: customerTheme,
  reseller: resellerTheme
};

// src/themes/UniversalTheme.tsx
var import_react39 = __toESM(require("react"));

// src/themes/ISPBrandTheme.tsx
var import_react38 = require("react");
init_cn();
var import_jsx_runtime40 = require("react/jsx-runtime");
var ISPColors = {
  // Primary Brand Colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    // Main brand blue
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a"
  },
  // Network/Connection Green
  network: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    // Signal strength green
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d"
  },
  // Warning/Alert Orange
  alert: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    // Warning orange
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12"
  },
  // Critical/Error Red
  critical: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    // Error red
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d"
  }
};
var ISPGradients = {
  primary: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600",
  network: "bg-gradient-to-r from-green-500 to-emerald-500",
  signal: "bg-gradient-to-r from-green-400 via-blue-500 to-purple-600",
  speed: "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600",
  data: "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
  billing: "bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500",
  premium: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600",
  enterprise: "bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900"
};
var ISPIcons = {
  // Network symbols
  signal: "\u{1F4F6}",
  wifi: "\u{1F4E1}",
  network: "\u{1F310}",
  connection: "\u{1F517}",
  speed: "\u26A1",
  // Service symbols
  fiber: "\u{1F525}",
  broadband: "\u{1F4A8}",
  phone: "\u{1F4DE}",
  tv: "\u{1F4FA}",
  // Status symbols
  online: "\u{1F7E2}",
  offline: "\u{1F534}",
  warning: "\u26A0\uFE0F",
  excellent: "\u2B50",
  maintenance: "\u{1F527}",
  // Business symbols
  billing: "\u{1F4B3}",
  payment: "\u{1F4B0}",
  report: "\u{1F4CA}",
  analytics: "\u{1F4C8}",
  // Support symbols
  support: "\u{1F3A7}",
  ticket: "\u{1F3AB}",
  help: "\u2753",
  chat: "\u{1F4AC}"
};
var defaultThemeConfig = {
  portal: "admin",
  density: "comfortable",
  accentColor: "primary",
  showBrandElements: true,
  animationsEnabled: true
};
var ISPThemeContext = (0, import_react38.createContext)(defaultThemeConfig);
function ISPThemeProvider({ children, config = {} }) {
  const themeConfig = { ...defaultThemeConfig, ...config };
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(ISPThemeContext.Provider, { value: themeConfig, children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
    "div",
    {
      className: cn(
        "min-h-screen transition-all duration-300",
        themeConfig.portal === "admin" && "bg-gray-50",
        themeConfig.portal === "customer" && "bg-gradient-to-br from-blue-50 to-indigo-50",
        themeConfig.portal === "reseller" && "bg-gradient-to-br from-purple-50 to-pink-50"
      ),
      "data-portal": themeConfig.portal,
      "data-density": themeConfig.density,
      "data-animations": themeConfig.animationsEnabled,
      children
    }
  ) });
}
function useISPTheme() {
  return (0, import_react38.useContext)(ISPThemeContext);
}
function ISPBrandHeader({
  title,
  subtitle,
  icon,
  gradient = "primary",
  className
}) {
  const theme = useISPTheme();
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(
    "div",
    {
      className: cn(
        "relative overflow-hidden rounded-lg p-8 text-white shadow-lg",
        ISPGradients[gradient],
        className
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: "relative z-10 flex items-center justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: "flex items-center space-x-3", children: [
              icon && /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { className: "text-3xl", children: icon }),
              /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("h1", { className: "text-3xl font-bold tracking-tight", children: title })
            ] }),
            subtitle && /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("p", { className: "text-lg opacity-90", children: subtitle })
          ] }),
          theme.showBrandElements && /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: "hidden md:flex space-x-2 opacity-20", children: [
            /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { className: "text-6xl", children: ISPIcons.network }),
            /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { className: "text-6xl", children: ISPIcons.signal }),
            /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { className: "text-6xl", children: ISPIcons.speed })
          ] })
        ] }),
        theme.showBrandElements && /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(import_jsx_runtime40.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("div", { className: "absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10" }),
          /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("div", { className: "absolute bottom-0 left-0 -mb-6 -ml-6 h-32 w-32 rounded-full bg-white/5" })
        ] })
      ]
    }
  );
}
function ServiceTierBadge({ tier, size = "md", className }) {
  const tierConfig = {
    basic: {
      label: "Basic",
      icon: ISPIcons.broadband,
      gradient: "bg-gradient-to-r from-gray-500 to-gray-600",
      glow: "shadow-gray-500/25"
    },
    standard: {
      label: "Standard",
      icon: ISPIcons.wifi,
      gradient: "bg-gradient-to-r from-blue-500 to-indigo-600",
      glow: "shadow-blue-500/25"
    },
    premium: {
      label: "Premium",
      icon: ISPIcons.fiber,
      gradient: ISPGradients.premium,
      glow: "shadow-purple-500/25"
    },
    enterprise: {
      label: "Enterprise",
      icon: ISPIcons.network,
      gradient: ISPGradients.enterprise,
      glow: "shadow-purple-500/50"
    }
  };
  const config = tierConfig[tier];
  const sizeClasses3 = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(
    "span",
    {
      className: cn(
        "inline-flex items-center space-x-1 rounded-full font-semibold text-white shadow-lg",
        config.gradient,
        config.glow,
        sizeClasses3[size],
        className
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { children: config.icon }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { children: config.label })
      ]
    }
  );
}
function NetworkStatusIndicator({
  status,
  showLabel = true,
  animated = true,
  className
}) {
  const statusConfig = {
    excellent: {
      icon: ISPIcons.excellent,
      color: "text-green-500",
      label: "Excellent Signal",
      bars: 4
    },
    good: {
      icon: ISPIcons.online,
      color: "text-blue-500",
      label: "Good Signal",
      bars: 3
    },
    fair: {
      icon: ISPIcons.warning,
      color: "text-yellow-500",
      label: "Fair Signal",
      bars: 2
    },
    poor: {
      icon: ISPIcons.warning,
      color: "text-orange-500",
      label: "Poor Signal",
      bars: 1
    },
    offline: {
      icon: ISPIcons.offline,
      color: "text-red-500",
      label: "Offline",
      bars: 0
    }
  };
  const config = statusConfig[status];
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: cn("flex items-center space-x-2", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("div", { className: "flex items-end space-x-1", children: [1, 2, 3, 4].map((bar) => /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
      "div",
      {
        className: cn(
          "w-1 rounded-full transition-all duration-300",
          bar <= config.bars ? cn(config.color.replace("text-", "bg-"), animated && "animate-pulse") : "bg-gray-300",
          bar === 1 && "h-2",
          bar === 2 && "h-3",
          bar === 3 && "h-4",
          bar === 4 && "h-5"
        )
      },
      bar
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: "flex items-center space-x-1", children: [
      /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { className: cn("text-lg", animated && status !== "offline" && "animate-pulse"), children: config.icon }),
      showLabel && /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { className: cn("text-sm font-medium", config.color), children: config.label })
    ] })
  ] });
}
function SpeedGauge({
  speed,
  maxSpeed,
  unit = "Mbps",
  label = "Speed",
  className
}) {
  const percentage = Math.min(speed / maxSpeed * 100, 100);
  const speedRating = percentage > 80 ? "excellent" : percentage > 60 ? "good" : percentage > 40 ? "fair" : "poor";
  const ratingConfig = {
    excellent: {
      color: "text-green-500",
      bgColor: "bg-green-500",
      icon: ISPIcons.speed
    },
    good: {
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      icon: ISPIcons.wifi
    },
    fair: {
      color: "text-yellow-500",
      bgColor: "bg-yellow-500",
      icon: ISPIcons.warning
    },
    poor: {
      color: "text-red-500",
      bgColor: "bg-red-500",
      icon: ISPIcons.offline
    }
  };
  const config = ratingConfig[speedRating];
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: cn("text-center space-y-3", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: "relative w-24 h-24 mx-auto", children: [
      /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("svg", { className: "w-24 h-24 -rotate-90", viewBox: "0 0 32 32", children: [
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
          "circle",
          {
            cx: "16",
            cy: "16",
            r: "14",
            stroke: "currentColor",
            strokeWidth: "2",
            fill: "none",
            className: "text-gray-200"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
          "circle",
          {
            cx: "16",
            cy: "16",
            r: "14",
            stroke: "currentColor",
            strokeWidth: "2",
            fill: "none",
            strokeDasharray: `${percentage} ${100 - percentage}`,
            strokeDashoffset: "25",
            className: config.color,
            style: { transition: "stroke-dasharray 1s ease-in-out" }
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: "text-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("div", { className: cn("text-lg font-bold", config.color), children: speed }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("div", { className: "text-xs text-gray-500", children: unit })
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: "space-y-1", children: [
      /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: "flex items-center justify-center space-x-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { className: "text-sm font-medium", children: label }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { className: "text-lg", children: config.icon })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("div", { className: cn("text-xs font-medium capitalize", config.color), children: speedRating })
    ] })
  ] });
}
var ISPThemeUtils = {
  getPortalGradient: (portal) => {
    switch (portal) {
      case "admin":
        return ISPGradients.primary;
      case "customer":
        return ISPGradients.network;
      case "reseller":
        return ISPGradients.premium;
      default:
        return ISPGradients.primary;
    }
  },
  getServiceIcon: (serviceType) => {
    switch (serviceType.toLowerCase()) {
      case "fiber":
        return ISPIcons.fiber;
      case "broadband":
        return ISPIcons.broadband;
      case "phone":
        return ISPIcons.phone;
      case "tv":
        return ISPIcons.tv;
      case "internet":
        return ISPIcons.wifi;
      default:
        return ISPIcons.network;
    }
  },
  getStatusIcon: (status) => {
    switch (status.toLowerCase()) {
      case "online":
      case "active":
      case "connected":
        return ISPIcons.online;
      case "offline":
      case "inactive":
      case "disconnected":
        return ISPIcons.offline;
      case "warning":
      case "degraded":
        return ISPIcons.warning;
      case "maintenance":
        return ISPIcons.maintenance;
      case "excellent":
        return ISPIcons.excellent;
      default:
        return ISPIcons.network;
    }
  }
};

// src/themes/UniversalTheme.tsx
init_cn();
var import_jsx_runtime41 = require("react/jsx-runtime");
var portalThemes = {
  admin: {
    name: "Admin Portal",
    primaryColor: ISPColors.primary[600],
    secondaryColor: ISPColors.primary[100],
    backgroundColor: "#f8fafc",
    // slate-50
    surfaceColor: "#ffffff",
    textColor: "#1e293b",
    // slate-800
    gradient: ISPGradients.primary,
    accent: "primary"
  },
  customer: {
    name: "Customer Portal",
    primaryColor: ISPColors.network[500],
    secondaryColor: ISPColors.network[100],
    backgroundColor: "#f0f9ff",
    // blue-50
    surfaceColor: "#ffffff",
    textColor: "#1e40af",
    // blue-800
    gradient: ISPGradients.network,
    accent: "network"
  },
  reseller: {
    name: "Reseller Portal",
    primaryColor: "#9333ea",
    // purple-600
    secondaryColor: "#f3e8ff",
    // purple-100
    backgroundColor: "#fdf4ff",
    // purple-50
    surfaceColor: "#ffffff",
    textColor: "#7c2d12",
    // amber-900
    gradient: ISPGradients.premium,
    accent: "primary"
  },
  technician: {
    name: "Technician Portal",
    primaryColor: ISPColors.network[600],
    secondaryColor: ISPColors.network[100],
    backgroundColor: "#f0fdf4",
    // green-50
    surfaceColor: "#ffffff",
    textColor: "#14532d",
    // green-900
    gradient: ISPGradients.network,
    accent: "network"
  },
  management: {
    name: "Management Console",
    primaryColor: ISPColors.alert[600],
    secondaryColor: ISPColors.alert[100],
    backgroundColor: "#f9fafb",
    // gray-50
    surfaceColor: "#ffffff",
    textColor: "#111827",
    // gray-900
    gradient: ISPGradients.enterprise,
    accent: "alert"
  }
};
var defaultThemeConfig2 = {
  variant: "admin",
  density: "comfortable",
  colorScheme: "light",
  accentColor: "primary",
  showBrandElements: true,
  animationsEnabled: true,
  highContrast: false,
  reducedMotion: false
};
var UniversalThemeContext = (0, import_react39.createContext)({
  config: defaultThemeConfig2,
  portalTheme: portalThemes.admin,
  updateConfig: () => {
  },
  getThemeClasses: () => "",
  getCSSVariables: () => ({})
});
function UniversalThemeProvider({ children, config = {} }) {
  const [themeConfig, setThemeConfig] = import_react39.default.useState({
    ...defaultThemeConfig2,
    ...config
  });
  const portalTheme = portalThemes[themeConfig.variant];
  (0, import_react39.useEffect)(() => {
    if (themeConfig.colorScheme !== "system") {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeConfig.colorScheme]);
  (0, import_react39.useEffect)(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      setThemeConfig((prev) => ({
        ...prev,
        reducedMotion: mediaQuery.matches
      }));
    };
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  const updateConfig = (updates) => {
    setThemeConfig((prev) => ({ ...prev, ...updates }));
  };
  const getThemeClasses = () => {
    return cn(
      "universal-theme",
      `theme-${themeConfig.variant}`,
      `density-${themeConfig.density}`,
      `color-${themeConfig.colorScheme}`,
      themeConfig.highContrast && "high-contrast",
      themeConfig.reducedMotion && "reduced-motion",
      !themeConfig.animationsEnabled && "no-animations"
    );
  };
  const getCSSVariables = () => {
    const variables = {
      // Portal-specific colors
      "--theme-primary": portalTheme.primaryColor,
      "--theme-secondary": portalTheme.secondaryColor,
      "--theme-background": portalTheme.backgroundColor,
      "--theme-surface": portalTheme.surfaceColor,
      "--theme-text": portalTheme.textColor,
      // Spacing based on density
      "--theme-spacing-xs": themeConfig.density === "compact" ? "0.25rem" : themeConfig.density === "comfortable" ? "0.5rem" : "0.75rem",
      "--theme-spacing-sm": themeConfig.density === "compact" ? "0.5rem" : themeConfig.density === "comfortable" ? "0.75rem" : "1rem",
      "--theme-spacing-md": themeConfig.density === "compact" ? "0.75rem" : themeConfig.density === "comfortable" ? "1rem" : "1.5rem",
      "--theme-spacing-lg": themeConfig.density === "compact" ? "1rem" : themeConfig.density === "comfortable" ? "1.5rem" : "2rem",
      // Border radius
      "--theme-radius-sm": "0.25rem",
      "--theme-radius-md": "0.375rem",
      "--theme-radius-lg": "0.5rem",
      "--theme-radius-xl": "0.75rem",
      // Shadows
      "--theme-shadow-sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "--theme-shadow-md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      "--theme-shadow-lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      // Transitions
      "--theme-transition-fast": themeConfig.reducedMotion ? "none" : "150ms ease",
      "--theme-transition-normal": themeConfig.reducedMotion ? "none" : "300ms ease",
      "--theme-transition-slow": themeConfig.reducedMotion ? "none" : "500ms ease"
    };
    return variables;
  };
  (0, import_react39.useEffect)(() => {
    const root = document.documentElement;
    const variables = getCSSVariables();
    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    document.body.className = cn(
      document.body.className.replace(/theme-\w+/g, ""),
      // Remove existing theme classes
      getThemeClasses()
    );
    document.title = portalTheme.name;
    return () => {
      Object.keys(variables).forEach((property) => {
        root.style.removeProperty(property);
      });
    };
  }, [themeConfig, portalTheme]);
  const contextValue = {
    config: themeConfig,
    portalTheme,
    updateConfig,
    getThemeClasses,
    getCSSVariables
  };
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(UniversalThemeContext.Provider, { value: contextValue, children: /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
    "div",
    {
      className: cn(getThemeClasses(), "min-h-screen transition-all duration-300"),
      "data-portal": themeConfig.variant,
      "data-density": themeConfig.density,
      "data-color-scheme": themeConfig.colorScheme,
      "data-animations": themeConfig.animationsEnabled,
      "data-high-contrast": themeConfig.highContrast,
      style: getCSSVariables(),
      children
    }
  ) });
}
function useUniversalTheme() {
  const context = (0, import_react39.useContext)(UniversalThemeContext);
  if (!context) {
    throw new Error("useUniversalTheme must be used within a UniversalThemeProvider");
  }
  return context;
}
function ThemeAware({ children, variant = "surface", className }) {
  const { config, portalTheme } = useUniversalTheme();
  const variantClasses = {
    surface: "bg-white shadow-sm border border-gray-200",
    elevated: "bg-white shadow-md border border-gray-200",
    outlined: "bg-transparent border-2 border-gray-300"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
    "div",
    {
      className: cn(
        "rounded-lg transition-all duration-200",
        variantClasses[variant],
        config.highContrast && "border-gray-900",
        className
      ),
      style: {
        borderColor: config.highContrast ? portalTheme.textColor : void 0,
        backgroundColor: variant !== "outlined" ? portalTheme.surfaceColor : void 0
      },
      children
    }
  );
}
function PortalBrand({
  showLogo = true,
  showIcon = true,
  size = "md",
  className
}) {
  const { config, portalTheme } = useUniversalTheme();
  const sizeClasses3 = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl"
  };
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: cn("flex items-center space-x-3", className), children: [
    showLogo && /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
      "div",
      {
        className: cn(
          "flex items-center justify-center rounded-lg font-bold text-white",
          iconSizes[size]
        ),
        style: { backgroundColor: portalTheme.primaryColor },
        children: portalTheme.name.split(" ").map((word) => word.charAt(0)).join("").substring(0, 2)
      }
    ),
    showIcon && /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
      "div",
      {
        className: cn("font-semibold", sizeClasses3[size]),
        style: { color: portalTheme.textColor },
        children: portalTheme.name
      }
    )
  ] });
}
var UniversalThemeUtils = {
  ...ISPThemeUtils,
  getVariantTheme: (variant) => {
    return portalThemes[variant];
  },
  applyPortalStyles: (variant, element) => {
    const theme = portalThemes[variant];
    element.style.setProperty("--theme-primary", theme.primaryColor);
    element.style.setProperty("--theme-background", theme.backgroundColor);
    element.style.setProperty("--theme-text", theme.textColor);
  },
  generateThemeCSS: (config) => {
    const theme = portalThemes[config.variant];
    return `
      .theme-${config.variant} {
        --theme-primary: ${theme.primaryColor};
        --theme-secondary: ${theme.secondaryColor};
        --theme-background: ${theme.backgroundColor};
        --theme-surface: ${theme.surfaceColor};
        --theme-text: ${theme.textColor};
      }
    `;
  }
};

// src/ui/Skeleton.tsx
var import_react40 = require("react");
var import_jsx_runtime42 = require("react/jsx-runtime");
function Skeleton2({
  className = "",
  width,
  height,
  variant = "rectangular",
  animation = "pulse"
}) {
  const baseClasses = "bg-gray-200";
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: ""
  };
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-md"
  };
  const style = {
    width: width || "100%",
    height: height || "1rem"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
    "div",
    {
      className: `${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`,
      style,
      "aria-hidden": "true"
    }
  );
}
function SkeletonText({ lines = 3 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "space-y-2", children: Array.from({ length: lines }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton2, { variant: "text", width: i === lines - 1 ? "60%" : "100%" }, i)) });
}
function SkeletonCard() {
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "border border-gray-200 rounded-lg p-4 space-y-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton2, { height: 12 }),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(SkeletonText, { lines: 2 }),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton2, { width: 80, height: 32 }),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton2, { width: 80, height: 32 })
    ] })
  ] });
}
function SkeletonTable({ rows = 5, columns = 4 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "border border-gray-200 rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "bg-gray-50 p-4 border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "grid gap-4", style: { gridTemplateColumns: `repeat(${columns}, 1fr)` }, children: Array.from({ length: columns }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton2, { height: 20 }, i)) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "divide-y divide-gray-200", children: Array.from({ length: rows }).map((_, rowIndex) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "p-4", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "grid gap-4", style: { gridTemplateColumns: `repeat(${columns}, 1fr)` }, children: Array.from({ length: columns }).map((_2, colIndex) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton2, { height: 16, width: colIndex === 0 ? "80%" : "60%" }, colIndex)) }) }, rowIndex)) })
  ] });
}
function SkeletonDashboard() {
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "space-y-6", children: [
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton2, { height: 16, width: "60%", className: "mb-2" }),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton2, { height: 32, width: "80%" })
    ] }, i)) }),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton2, { height: 24, width: "200px", className: "mb-4" }),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton2, { height: 300 })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "bg-white rounded-lg shadow", children: [
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "p-6 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(Skeleton2, { height: 24, width: "150px" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(SkeletonTable, { rows: 5, columns: 5 })
    ] })
  ] });
}

// src/utils/bundle-optimization.ts
var import_react44 = __toESM(require("react"));
var createDynamicImport = (importFunc, componentName, preloadCondition) => {
  if (preloadCondition?.()) {
    importFunc().catch((error) => {
      console.warn(`Failed to preload component ${componentName}:`, error);
    });
  }
  return (0, import_react44.lazy)(async () => {
    try {
      const startTime = performance.now();
      const module2 = await importFunc();
      const loadTime = performance.now() - startTime;
      if (loadTime > 100) {
        console.warn(`Slow component load: ${componentName} took ${loadTime.toFixed(2)}ms`);
      }
      return module2;
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
      const Fallback = import_react44.default.forwardRef(
        (props, ref) => import_react44.default.createElement(
          "div",
          {
            className: "p-4 bg-red-50 border border-red-200 rounded",
            ref,
            ...props
          },
          import_react44.default.createElement(
            "p",
            { className: "text-red-800" },
            `Failed to load ${componentName}`
          )
        )
      );
      return {
        default: Fallback
      };
    }
  });
};
var SplitPoints = {
  // Charts - Heavy recharts dependency
  CHARTS: {
    threshold: 5e4,
    // 50KB
    priority: "high",
    preloadCondition: () => {
      if (typeof window === "undefined") return false;
      return window.innerWidth > 768 && "IntersectionObserver" in window;
    }
  },
  // Complex forms - Heavy validation libraries
  FORMS: {
    threshold: 3e4,
    // 30KB
    priority: "medium",
    preloadCondition: () => {
      if (typeof document === "undefined") return false;
      return document.querySelector("form") !== null;
    }
  },
  // Admin features - Only for admin users
  ADMIN: {
    threshold: 25e3,
    // 25KB
    priority: "low",
    preloadCondition: () => {
      if (typeof localStorage === "undefined") return false;
      return localStorage.getItem("userRole") === "admin";
    }
  },
  // Animations - Optional enhancements
  ANIMATIONS: {
    threshold: 2e4,
    // 20KB
    priority: "low",
    preloadCondition: () => {
      if (typeof window === "undefined") return false;
      return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  }
};
var LazyCharts = {
  RevenueChart: createDynamicImport(
    () => Promise.resolve().then(() => (init_OptimizedCharts(), OptimizedCharts_exports)).then((m) => ({
      default: m.OptimizedRevenueChart
    })),
    "RevenueChart",
    SplitPoints.CHARTS.preloadCondition
  ),
  NetworkUsageChart: createDynamicImport(
    () => Promise.resolve().then(() => (init_InteractiveChart(), InteractiveChart_exports)).then((m) => ({
      default: m.NetworkUsageChart
    })),
    "NetworkUsageChart",
    SplitPoints.CHARTS.preloadCondition
  ),
  ServiceStatusChart: createDynamicImport(
    () => Promise.resolve().then(() => (init_InteractiveChart(), InteractiveChart_exports)).then((m) => ({
      default: m.ServiceStatusChart
    })),
    "ServiceStatusChart",
    SplitPoints.CHARTS.preloadCondition
  ),
  BandwidthChart: createDynamicImport(
    () => Promise.resolve().then(() => (init_InteractiveChart(), InteractiveChart_exports)).then((m) => ({
      default: m.BandwidthChart
    })),
    "BandwidthChart",
    SplitPoints.CHARTS.preloadCondition
  )
};
var LazyStatusIndicators = {
  StatusBadge: createDynamicImport(
    () => Promise.resolve().then(() => (init_OptimizedStatusIndicators(), OptimizedStatusIndicators_exports)).then((m) => ({
      default: m.OptimizedStatusBadge
    })),
    "StatusBadge"
  ),
  UptimeIndicator: createDynamicImport(
    () => Promise.resolve().then(() => (init_OptimizedStatusIndicators(), OptimizedStatusIndicators_exports)).then((m) => ({
      default: m.OptimizedUptimeIndicator
    })),
    "UptimeIndicator"
  ),
  NetworkPerformanceIndicator: createDynamicImport(
    () => Promise.resolve().then(() => (init_StatusIndicators(), StatusIndicators_exports)).then((m) => ({
      default: m.NetworkPerformanceIndicator
    })),
    "NetworkPerformanceIndicator"
  )
};
var TreeShakableUtils = {
  // Only import specific accessibility functions when needed
  a11y: {
    announceToScreenReader: () => Promise.resolve().then(() => (init_a11y(), a11y_exports)).then((m) => m.announceToScreenReader),
    generateChartDescription: () => Promise.resolve().then(() => (init_a11y(), a11y_exports)).then((m) => m.generateChartDescription),
    useKeyboardNavigation: () => Promise.resolve().then(() => (init_a11y(), a11y_exports)).then((m) => m.useKeyboardNavigation)
  },
  // Only import specific security functions when needed
  security: {
    sanitizeText: () => Promise.resolve().then(() => (init_security(), security_exports)).then((m) => m.sanitizeText),
    validateData: () => Promise.resolve().then(() => (init_security(), security_exports)).then((m) => m.validateData),
    validateArray: () => Promise.resolve().then(() => (init_security(), security_exports)).then((m) => m.validateArray)
  },
  // Only import specific performance functions when needed
  performance: {
    useRenderProfiler: () => Promise.resolve().then(() => (init_performance(), performance_exports)).then((m) => m.useRenderProfiler),
    useThrottledState: () => Promise.resolve().then(() => (init_performance(), performance_exports)).then((m) => m.useThrottledState),
    useDebouncedState: () => Promise.resolve().then(() => (init_performance(), performance_exports)).then((m) => m.useDebouncedState)
  }
};
var analyzeBundleSize = async () => {
  const analysis = {
    totalSize: 0,
    componentSizes: /* @__PURE__ */ new Map(),
    recommendations: [],
    splitPoints: []
  };
  try {
    const components = [
      { name: "Charts", size: 85e3, category: "heavy" },
      { name: "StatusIndicators", size: 25e3, category: "medium" },
      { name: "ErrorBoundary", size: 8e3, category: "light" },
      { name: "Accessibility", size: 15e3, category: "medium" },
      { name: "Security", size: 12e3, category: "medium" },
      { name: "Performance", size: 18e3, category: "medium" }
    ];
    components.forEach((component) => {
      analysis.totalSize += component.size;
      analysis.componentSizes.set(component.name, component.size);
      if (component.size > SplitPoints.CHARTS.threshold) {
        analysis.recommendations.push(
          `Consider code splitting for ${component.name} (${(component.size / 1e3).toFixed(1)}KB)`
        );
        analysis.splitPoints.push(component.name);
      } else if (component.size > 2e4) {
        analysis.recommendations.push(
          `Monitor bundle size for ${component.name} (${(component.size / 1e3).toFixed(1)}KB)`
        );
      }
    });
    if (analysis.totalSize > 2e5) {
      analysis.recommendations.push(
        "Bundle size exceeds 200KB - implement aggressive code splitting"
      );
    } else if (analysis.totalSize > 1e5) {
      analysis.recommendations.push(
        "Bundle size is large - consider lazy loading non-critical components"
      );
    }
  } catch (error) {
    console.error("Bundle analysis failed:", error);
    analysis.recommendations.push("Bundle analysis failed - manual inspection recommended");
  }
  return analysis;
};
var PreloadingStrategies = {
  // Preload on hover with delay
  onHover: (importFunc, delay = 200) => {
    let timeoutId;
    return {
      onMouseEnter: () => {
        timeoutId = setTimeout(() => {
          importFunc().catch(console.error);
        }, delay);
      },
      onMouseLeave: () => {
        if (timeoutId) clearTimeout(timeoutId);
      }
    };
  },
  // Preload when component enters viewport
  onVisible: (importFunc, rootMargin = "100px") => {
    return {
      ref: (element) => {
        if (!element || typeof window === "undefined" || !("IntersectionObserver" in window))
          return;
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                importFunc().catch(console.error);
                observer.unobserve(entry.target);
              }
            });
          },
          { rootMargin }
        );
        observer.observe(element);
      }
    };
  },
  // Preload during idle time
  onIdle: (importFunc) => {
    if (typeof window === "undefined") return;
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        importFunc().catch(console.error);
      });
    } else {
      setTimeout(() => {
        importFunc().catch(console.error);
      }, 1);
    }
  },
  // Preload based on user intent (mouse movement towards element)
  onIntent: (importFunc) => {
    let isMovingTowards = false;
    return {
      onMouseMove: (event, targetElement) => {
        const rect = targetElement.getBoundingClientRect();
        const isInDirection = event.clientX >= rect.left - 50 && event.clientX <= rect.right + 50 && event.clientY >= rect.top - 50 && event.clientY <= rect.bottom + 50;
        if (isInDirection && !isMovingTowards) {
          isMovingTowards = true;
          importFunc().catch(console.error);
        }
      }
    };
  }
};
var addResourceHints = () => {
  if (typeof document === "undefined") return;
  const head = document.head;
  const preloadCSS = document.createElement("link");
  preloadCSS.rel = "preload";
  preloadCSS.href = "/styles/accessibility.css";
  preloadCSS.as = "style";
  head.appendChild(preloadCSS);
  const dnsPrefetch = document.createElement("link");
  dnsPrefetch.rel = "dns-prefetch";
  dnsPrefetch.href = "//fonts.googleapis.com";
  head.appendChild(dnsPrefetch);
  const preconnect = document.createElement("link");
  preconnect.rel = "preconnect";
  preconnect.href = "https://api.example.com";
  head.appendChild(preconnect);
};
var bundleSplitConfig = {
  // Vendor chunk for third-party libraries
  vendor: {
    name: "vendor",
    test: /[\\/]node_modules[\\/]/,
    priority: 10,
    chunks: "all"
  },
  // Common chunk for shared utilities
  common: {
    name: "common",
    minChunks: 2,
    priority: 5,
    chunks: "all",
    reuseExistingChunk: true
  },
  // Chart components chunk
  charts: {
    name: "charts",
    test: /[\\/]src[\\/]charts[\\/]/,
    priority: 8,
    chunks: "all"
  },
  // Status indicators chunk
  indicators: {
    name: "indicators",
    test: /[\\/]src[\\/]indicators[\\/]/,
    priority: 7,
    chunks: "all"
  }
};
var PerformanceBudgets = {
  // Size budgets in bytes
  sizes: {
    initial: 1e5,
    // 100KB initial bundle
    asyncChunks: 5e4,
    // 50KB per async chunk
    assets: 5e5
    // 500KB total assets
  },
  // Performance metrics budgets
  metrics: {
    firstContentfulPaint: 1500,
    // 1.5s
    largestContentfulPaint: 2500,
    // 2.5s
    firstInputDelay: 100,
    // 100ms
    cumulativeLayoutShift: 0.1
    // 0.1 CLS score
  },
  // Check if budgets are exceeded
  checkBudgets: (actualSizes, actualMetrics) => {
    const violations = [];
    Object.entries(PerformanceBudgets.sizes).forEach(([key, budget]) => {
      if (actualSizes[key] > budget) {
        violations.push(`${key} size budget exceeded: ${actualSizes[key]} > ${budget}`);
      }
    });
    Object.entries(PerformanceBudgets.metrics).forEach(([key, budget]) => {
      if (actualMetrics[key] > budget) {
        violations.push(`${key} performance budget exceeded: ${actualMetrics[key]} > ${budget}`);
      }
    });
    return violations;
  }
};
var generateBundleReport = async () => {
  const analysis = await analyzeBundleSize();
  const report = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    analysis,
    recommendations: analysis.recommendations,
    splitPoints: analysis.splitPoints,
    optimizations: {
      lazyComponents: Object.keys(LazyCharts).concat(Object.keys(LazyStatusIndicators)),
      treeShakableUtilities: Object.keys(TreeShakableUtils),
      preloadingStrategies: Object.keys(PreloadingStrategies)
    },
    performanceBudgets: PerformanceBudgets.sizes
  };
  return report;
};

// src/index.ts
init_performance();

// src/utils/icon-helpers.ts
var toSafeIcon = (icon) => icon;
var toSafeIcons = (icons) => icons.map((icon) => icon);

// src/skeletons/DashboardSkeleton.tsx
var import_react45 = require("react");
var import_clsx18 = require("clsx");
var import_jsx_runtime46 = require("react/jsx-runtime");
function SkeletonBox({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(
    "div",
    {
      className: (0, import_clsx18.clsx)("bg-gray-200 dark:bg-gray-700 rounded animate-pulse", className),
      ...props
    }
  );
}
function MetricCardSkeleton() {
  return /* @__PURE__ */ (0, import_jsx_runtime46.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(SkeletonBox, { className: "h-4 w-20" }),
    /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(SkeletonBox, { className: "h-8 w-16" }),
    /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(SkeletonBox, { className: "h-3 w-24" })
  ] });
}
function DashboardHeaderSkeleton() {
  return /* @__PURE__ */ (0, import_jsx_runtime46.jsxs)("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ (0, import_jsx_runtime46.jsxs)("div", { className: "space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(SkeletonBox, { className: "h-8 w-48" }),
      /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(SkeletonBox, { className: "h-4 w-64" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime46.jsxs)("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(SkeletonBox, { className: "h-10 w-24" }),
      /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(SkeletonBox, { className: "h-10 w-24" })
    ] })
  ] });
}
function ContentSectionSkeleton({ variant = "default" }) {
  if (variant === "network") {
    return /* @__PURE__ */ (0, import_jsx_runtime46.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(SkeletonBox, { className: "h-6 w-32" }),
      /* @__PURE__ */ (0, import_jsx_runtime46.jsxs)("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(SkeletonBox, { className: "h-32" }),
        /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(SkeletonBox, { className: "h-32" }),
        /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(SkeletonBox, { className: "h-32" })
      ] })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime46.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(SkeletonBox, { className: "h-6 w-40" }),
    /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(SkeletonBox, { className: "h-64" })
  ] });
}
function DashboardSkeleton({
  variant = "default",
  metricCards = 4,
  showHeader = true,
  contentSections = 2,
  className
}) {
  const cardCount = variant === "network" ? Math.max(metricCards, 4) : variant === "compact" ? Math.min(metricCards, 3) : metricCards;
  const gridCols = cardCount === 2 ? "grid-cols-2" : cardCount === 3 ? "grid-cols-3" : cardCount >= 4 ? "grid-cols-4" : "grid-cols-1";
  return /* @__PURE__ */ (0, import_jsx_runtime46.jsxs)("div", { className: (0, import_clsx18.clsx)("space-y-6", className), children: [
    showHeader && /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(DashboardHeaderSkeleton, {}),
    variant !== "compact" && /* @__PURE__ */ (0, import_jsx_runtime46.jsx)("div", { className: (0, import_clsx18.clsx)("grid gap-4", gridCols), children: Array.from({ length: cardCount }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(MetricCardSkeleton, {}, i)) }),
    Array.from({ length: contentSections }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(ContentSectionSkeleton, { variant }, i))
  ] });
}
var DashboardSkeletons = {
  /**
   * Network monitoring dashboard
   */
  Network: () => /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(DashboardSkeleton, { variant: "network", metricCards: 6, contentSections: 2 }),
  /**
   * Metrics dashboard with cards
   */
  Metrics: () => /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(DashboardSkeleton, { variant: "metrics", metricCards: 4, contentSections: 3 }),
  /**
   * Compact dashboard
   */
  Compact: () => /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(DashboardSkeleton, { variant: "compact", metricCards: 3, contentSections: 1 }),
  /**
   * Default dashboard
   */
  Default: () => /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(DashboardSkeleton, {})
};

// src/skeletons/TableSkeleton.tsx
var import_react46 = require("react");
var import_clsx19 = require("clsx");
var import_jsx_runtime47 = require("react/jsx-runtime");
function SkeletonBox2({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
    "div",
    {
      className: (0, import_clsx19.clsx)("bg-gray-200 dark:bg-gray-700 rounded animate-pulse", className),
      ...props
    }
  );
}
function TableCellSkeleton({
  width = "w-full",
  height = "h-4"
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: (0, import_clsx19.clsx)(height, width) });
}
function TableRowSkeleton({
  columns,
  showActions,
  showCheckbox,
  variant
}) {
  const cellHeight = variant === "compact" ? "h-3" : "h-4";
  const padding = variant === "compact" ? "p-2" : "p-4";
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("tr", { className: "border-b border-gray-200 dark:border-gray-700", children: [
    showCheckbox && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("td", { className: (0, import_clsx19.clsx)(padding, "w-12"), children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-4 w-4 rounded" }) }),
    Array.from({ length: columns }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("td", { className: padding, children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(TableCellSkeleton, { height: cellHeight, width: i === 0 ? "w-3/4" : "w-full" }) }, i)),
    showActions && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("td", { className: (0, import_clsx19.clsx)(padding, "w-24"), children: /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-8 w-8 rounded" }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-8 w-8 rounded" })
    ] }) })
  ] });
}
function TableHeaderSkeleton({
  columns,
  showActions,
  showCheckbox
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("thead", { className: "bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("tr", { children: [
    showCheckbox && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("th", { className: "p-4 w-12", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-4 w-4 rounded" }) }),
    Array.from({ length: columns }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("th", { className: "p-4 text-left", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-4 w-20" }) }, i)),
    showActions && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("th", { className: "p-4 w-24", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-4 w-16" }) })
  ] }) });
}
function TableControlsSkeleton({
  showSearch,
  showFilters
}) {
  if (!showSearch && !showFilters) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "flex items-center justify-between mb-4 gap-4", children: [
    showSearch && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "flex-1 max-w-md", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-10 w-full" }) }),
    showFilters && /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-10 w-24" }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-10 w-24" }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-10 w-24" })
    ] })
  ] });
}
function TablePaginationSkeleton() {
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "flex items-center justify-between mt-4 px-4 py-3 border-t border-gray-200 dark:border-gray-700", children: [
    /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-4 w-32" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-10 w-20" }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-10 w-10" }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-10 w-10" }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-10 w-10" }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(SkeletonBox2, { className: "h-10 w-20" })
    ] })
  ] });
}
function TableSkeleton({
  columns = 5,
  rows = 5,
  showHeader = true,
  showActions = true,
  showCheckbox = false,
  showPagination = true,
  showSearch = true,
  showFilters = false,
  variant = "default",
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: (0, import_clsx19.clsx)("bg-white dark:bg-gray-800 rounded-lg shadow", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "p-4", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(TableControlsSkeleton, { showSearch, showFilters }) }),
    /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
      showHeader && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
        TableHeaderSkeleton,
        {
          columns,
          showActions,
          showCheckbox
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
        TableRowSkeleton,
        {
          columns,
          showActions,
          showCheckbox,
          variant
        },
        i
      )) })
    ] }) }),
    showPagination && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(TablePaginationSkeleton, {})
  ] });
}
var TableSkeletons = {
  /**
   * Customer/Subscriber list table
   */
  CustomerList: () => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(TableSkeleton, { columns: 6, rows: 10, showCheckbox: true, showActions: true, showSearch: true, showFilters: true }),
  /**
   * Device list table
   */
  DeviceList: () => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(TableSkeleton, { columns: 5, rows: 15, showActions: true, showSearch: true }),
  /**
   * Compact list
   */
  Compact: () => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
    TableSkeleton,
    {
      variant: "compact",
      columns: 4,
      rows: 8,
      showActions: false,
      showPagination: false
    }
  ),
  /**
   * Detailed table with all features
   */
  Detailed: () => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
    TableSkeleton,
    {
      variant: "detailed",
      columns: 8,
      rows: 20,
      showCheckbox: true,
      showActions: true,
      showSearch: true,
      showFilters: true
    }
  ),
  /**
   * Simple table without controls
   */
  Simple: () => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
    TableSkeleton,
    {
      columns: 4,
      rows: 5,
      showActions: false,
      showSearch: false,
      showPagination: false
    }
  )
};

// src/skeletons/CardSkeleton.tsx
var import_react47 = require("react");
var import_clsx20 = require("clsx");
var import_jsx_runtime48 = require("react/jsx-runtime");
function SkeletonBox3({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(
    "div",
    {
      className: (0, import_clsx20.clsx)("bg-gray-200 dark:bg-gray-700 rounded animate-pulse", className),
      ...props
    }
  );
}
function MetricCardSkeleton2({ showIcon }) {
  return /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-4 w-24" }),
        /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-8 w-20" })
      ] }),
      showIcon && /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-10 w-10 rounded-lg" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-3 w-32" })
  ] });
}
function InfoCardSkeleton({
  showHeader,
  showIcon,
  contentLines
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4", children: [
    showHeader && /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "flex items-center gap-3", children: [
      showIcon && /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-12 w-12 rounded-full" }),
      /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-5 w-32" }),
        /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-3 w-48" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("div", { className: "space-y-2", children: Array.from({ length: contentLines }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(
      SkeletonBox3,
      {
        className: (0, import_clsx20.clsx)("h-4", i === contentLines - 1 ? "w-3/4" : "w-full")
      },
      i
    )) })
  ] });
}
function DetailedCardSkeleton({
  showHeader,
  showFooter,
  showIcon,
  contentLines
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-48 w-full rounded-none" }),
    /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "p-6 space-y-4", children: [
      showHeader && /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-6 w-48" }),
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-4 w-32" })
        ] }),
        showIcon && /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-8 w-8 rounded" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("div", { className: "space-y-2", children: Array.from({ length: contentLines }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(
        SkeletonBox3,
        {
          className: (0, import_clsx20.clsx)("h-4", i === contentLines - 1 ? "w-2/3" : "w-full")
        },
        i
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-6 w-16 rounded-full" }),
        /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-6 w-20 rounded-full" }),
        /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-6 w-14 rounded-full" })
      ] }),
      showFooter && /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-4 w-24" }),
        /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-8 w-20" }),
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-8 w-20" })
        ] })
      ] })
    ] })
  ] });
}
function CompactCardSkeleton({ showIcon }) {
  return /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-4", children: /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "flex items-center gap-3", children: [
    showIcon && /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-10 w-10 rounded" }),
    /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "flex-1 space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-4 w-32" }),
      /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-3 w-48" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-8 w-8 rounded" })
  ] }) });
}
function DefaultCardSkeleton({
  showHeader,
  showFooter,
  contentLines,
  height
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: (0, import_clsx20.clsx)("bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4", height), children: [
    showHeader && /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-6 w-40" }),
      /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-4 w-56" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("div", { className: "space-y-2", children: Array.from({ length: contentLines }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(
      SkeletonBox3,
      {
        className: (0, import_clsx20.clsx)("h-4", i === contentLines - 1 ? "w-3/4" : "w-full")
      },
      i
    )) }),
    showFooter && /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("div", { className: "pt-4 border-t border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-4 w-28" }),
      /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(SkeletonBox3, { className: "h-9 w-24" })
    ] }) })
  ] });
}
function CardSkeleton({
  variant = "default",
  showHeader = true,
  showFooter = false,
  showIcon = false,
  contentLines = 3,
  height,
  className
}) {
  const commonProps = {
    showHeader,
    showFooter,
    showIcon,
    contentLines
  };
  return /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className, children: [
    variant === "metric" && /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(MetricCardSkeleton2, { showIcon }),
    variant === "info" && /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(InfoCardSkeleton, { ...commonProps }),
    variant === "detailed" && /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(DetailedCardSkeleton, { ...commonProps }),
    variant === "compact" && /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(CompactCardSkeleton, { showIcon }),
    variant === "default" && /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(DefaultCardSkeleton, { ...commonProps, ...height !== void 0 ? { height } : {} })
  ] });
}
function CardGridSkeleton({
  count = 6,
  columns = 3,
  variant = "default",
  cardProps,
  className
}) {
  const gridCols = columns === 2 ? "grid-cols-2" : columns === 3 ? "grid-cols-3" : "grid-cols-4";
  return /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("div", { className: (0, import_clsx20.clsx)("grid gap-4", gridCols, className), children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(CardSkeleton, { variant, ...cardProps }, i)) });
}
var CardSkeletons = {
  /**
   * Metric card for KPIs
   */
  Metric: () => /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(CardSkeleton, { variant: "metric", showIcon: true }),
  /**
   * Info card with header
   */
  Info: () => /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(CardSkeleton, { variant: "info", showHeader: true, showIcon: true, contentLines: 4 }),
  /**
   * Detailed content card
   */
  Detailed: () => /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(CardSkeleton, { variant: "detailed", showHeader: true, showFooter: true }),
  /**
   * Compact list item
   */
  Compact: () => /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(CardSkeleton, { variant: "compact", showIcon: true }),
  /**
   * Grid of metric cards
   */
  MetricGrid: () => /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(CardGridSkeleton, { count: 4, columns: 4, variant: "metric", cardProps: { showIcon: true } }),
  /**
   * Grid of info cards
   */
  InfoGrid: () => /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(
    CardGridSkeleton,
    {
      count: 6,
      columns: 3,
      variant: "info",
      cardProps: { showHeader: true, showIcon: true }
    }
  )
};

// src/index.ts
init_ErrorBoundary();
init_security();

// src/animations/Animations.tsx
var import_framer_motion11 = require("framer-motion");
var import_react48 = require("react");
init_cn();
var import_jsx_runtime49 = require("react/jsx-runtime");
var fadeInVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
var staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};
var staggerChild = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
var scaleOnHover = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeIn"
    }
  }
};
var slideInLeft = {
  hidden: {
    opacity: 0,
    x: -30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
var slideInRight = {
  hidden: {
    opacity: 0,
    x: 30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
var AnimatedCounter = ({
  value,
  duration = 2,
  prefix = "",
  suffix = "",
  className
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
    import_framer_motion11.motion.span,
    {
      className,
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
      children: /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)(
        import_framer_motion11.motion.span,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration,
            ease: "easeOut"
          },
          children: [
            prefix,
            /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
              import_framer_motion11.motion.span,
              {
                initial: { scale: 1.2 },
                animate: { scale: 1 },
                transition: { duration: 0.3, delay: duration - 0.3 },
                children: value.toLocaleString()
              }
            ),
            suffix
          ]
        }
      )
    }
  );
};
var FadeInWhenVisible = ({
  children,
  delay = 0,
  className
}) => {
  const ref = (0, import_react48.useRef)(null);
  const isInView = (0, import_framer_motion11.useInView)(ref, { once: true, margin: "-100px" });
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
    import_framer_motion11.motion.div,
    {
      ref,
      initial: "hidden",
      animate: isInView ? "visible" : "hidden",
      variants: fadeInVariants,
      transition: { delay },
      className,
      children
    }
  );
};
var StaggeredFadeIn = ({ children, className }) => {
  const ref = (0, import_react48.useRef)(null);
  const isInView = (0, import_framer_motion11.useInView)(ref, { once: true, margin: "-50px" });
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
    import_framer_motion11.motion.div,
    {
      ref,
      initial: "hidden",
      animate: isInView ? "visible" : "hidden",
      variants: staggerContainer,
      className,
      children
    }
  );
};
var StaggerChild = ({ children, className }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(import_framer_motion11.motion.div, { variants: staggerChild, className, children });
};
var AnimatedCard = ({
  children,
  className,
  onClick,
  disabled = false
}) => {
  const interactiveMotionProps = !disabled ? {
    whileHover: "hover",
    whileTap: "tap",
    ...onClick ? { onClick } : {}
  } : {};
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
    import_framer_motion11.motion.div,
    {
      className: cn(
        "cursor-pointer transition-shadow duration-200",
        disabled && "cursor-not-allowed opacity-50",
        className
      ),
      variants: scaleOnHover,
      layout: true,
      ...interactiveMotionProps,
      children
    }
  );
};
var SlideIn = ({ children, direction, delay = 0, className }) => {
  const ref = (0, import_react48.useRef)(null);
  const isInView = (0, import_framer_motion11.useInView)(ref, { once: true, margin: "-100px" });
  const variants = {
    left: slideInLeft,
    right: slideInRight,
    up: {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
      }
    },
    down: {
      hidden: { opacity: 0, y: -30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
      }
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
    import_framer_motion11.motion.div,
    {
      ref,
      initial: "hidden",
      animate: isInView ? "visible" : "hidden",
      variants: variants[direction],
      transition: { delay },
      className,
      children
    }
  );
};
var AnimatedProgressBar = ({
  progress,
  height = "h-2",
  color = "bg-blue-500",
  backgroundColor = "bg-gray-200",
  className,
  showLabel = false,
  label
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)("div", { className: cn("w-full", className), children: [
    showLabel && /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime49.jsx)("span", { children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)("span", { children: [
        Math.round(progress),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime49.jsx)("div", { className: cn("w-full rounded-full overflow-hidden", height, backgroundColor), children: /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
      import_framer_motion11.motion.div,
      {
        className: cn("h-full rounded-full", color),
        initial: { width: 0 },
        animate: { width: `${progress}%` },
        transition: {
          duration: 1.5,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.2
        }
      }
    ) })
  ] });
};
var LoadingDots = ({ className, color = "bg-blue-500" }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsx)("div", { className: cn("flex space-x-1", className), children: [0, 1, 2].map((index) => /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
    import_framer_motion11.motion.div,
    {
      className: cn("w-2 h-2 rounded-full", color),
      initial: { opacity: 0.3 },
      animate: { opacity: 1 },
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse",
        delay: index * 0.2
      }
    },
    index
  )) });
};
var PulseIndicator = ({
  children,
  active = true,
  className
}) => {
  const animationProps = active ? { animate: { scale: [1, 1.05, 1] } } : {};
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
    import_framer_motion11.motion.div,
    {
      className,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      },
      ...animationProps,
      children
    }
  );
};
var BounceIn = ({ children, className }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
    import_framer_motion11.motion.div,
    {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.6
      },
      className,
      children
    }
  );
};
var PageTransition = ({ children, className }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
    import_framer_motion11.motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      },
      className,
      children
    }
  );
};
var TypingAnimation = ({ text, delay = 0, className }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
    import_framer_motion11.motion.span,
    {
      className,
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay },
      children: text.split("").map((char, index) => /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
        import_framer_motion11.motion.span,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: {
            delay: delay + index * 0.05,
            duration: 0.1
          },
          children: char
        },
        index
      ))
    }
  );
};

// src/security/CSRFProtection.tsx
var import_react49 = require("react");
var import_jsx_runtime50 = require("react/jsx-runtime");
var CSRFContext = (0, import_react49.createContext)(null);
var generateSecureToken = () => {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
};
function CSRFProvider({ children, endpoint }) {
  const [token, setToken] = (0, import_react49.useState)(null);
  const [serverToken, setServerToken] = (0, import_react49.useState)(null);
  (0, import_react49.useEffect)(() => {
    const fetchServerToken = async () => {
      if (!endpoint) return;
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          credentials: "include"
        });
        if (response.ok) {
          const data = await response.json();
          setServerToken(data.token);
        }
      } catch (error) {
        console.warn("Failed to fetch server CSRF token:", error);
      }
    };
    fetchServerToken();
  }, [endpoint]);
  (0, import_react49.useEffect)(() => {
    const initialToken = generateSecureToken();
    setToken(initialToken);
    sessionStorage.setItem("csrf-token", initialToken);
    return () => {
      sessionStorage.removeItem("csrf-token");
    };
  }, []);
  const generateToken = () => {
    const newToken = generateSecureToken();
    setToken(newToken);
    sessionStorage.setItem("csrf-token", newToken);
    return newToken;
  };
  const validateToken = (tokenToValidate) => {
    const storedToken = sessionStorage.getItem("csrf-token");
    return tokenToValidate === storedToken || serverToken !== null && tokenToValidate === serverToken;
  };
  const refreshToken = () => {
    generateToken();
  };
  const contextValue = {
    token: serverToken ?? token,
    generateToken,
    validateToken,
    refreshToken
  };
  return /* @__PURE__ */ (0, import_jsx_runtime50.jsx)(CSRFContext.Provider, { value: contextValue, children });
}
function useCSRF() {
  const context = (0, import_react49.useContext)(CSRFContext);
  if (!context) {
    throw new Error("useCSRF must be used within a CSRFProvider");
  }
  return context;
}
function CSRFToken({ name = "csrf_token", hidden = true }) {
  const { token } = useCSRF();
  if (!token) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("input", { type: hidden ? "hidden" : "text", name, value: token, readOnly: true });
}
function withCSRFProtection(Component3) {
  return function CSRFProtectedComponent(props) {
    return /* @__PURE__ */ (0, import_jsx_runtime50.jsx)(CSRFProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime50.jsx)(Component3, { ...props }) });
  };
}
function useSecureFetch() {
  const { token, validateToken } = useCSRF();
  const secureFetch = async (url, options = {}) => {
    if (!token) {
      throw new Error("CSRF token not available");
    }
    const headers = new Headers(options.headers);
    headers.set("X-CSRF-Token", token);
    headers.set("Content-Type", "application/json");
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include"
      // Include cookies for session-based CSRF
    });
    const responseToken = response.headers.get("X-CSRF-Token");
    if (responseToken && !validateToken(responseToken)) {
      throw new Error("CSRF token validation failed");
    }
    return response;
  };
  return { secureFetch, token };
}

// src/index.ts
var version = "1.0.0";
var defaultConfig = {
  toast: {
    duration: 5e3,
    position: "top-right"
  },
  table: {
    pageSize: 10,
    showPagination: true
  },
  chart: {
    responsive: true,
    height: 300
  },
  form: {
    layout: "vertical",
    size: "md"
  },
  modal: {
    closeOnOverlayClick: true,
    closeOnEscape: true
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ARIA_ROLES,
  Alert,
  AlertDescription,
  AlertTitle,
  AnimatedCard,
  AnimatedCounter,
  AnimatedProgressBar,
  AreaChart,
  BandwidthChart,
  BarChart,
  BaseRealTimeWidget,
  BottomSheet,
  BounceIn,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  Button,
  COLORS,
  CSRFProvider,
  CSRFToken,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardGridSkeleton,
  CardHeader,
  CardSkeleton,
  CardSkeletons,
  CardTitle,
  Center,
  ChartContainer,
  ChartGradients,
  Checkbox,
  ComponentErrorBoundary,
  CompositionDataTable,
  ConfirmationModal,
  Container,
  CustomerGrowthChart,
  CustomerLocationMap,
  Dashboard,
  DashboardSkeleton,
  DashboardSkeletons,
  DataTable,
  Divider,
  Drawer,
  EnhancedTabNavigation,
  ErrorBoundary,
  FadeInWhenVisible,
  Feedback,
  FeedbackActions,
  FeedbackDescription,
  FeedbackTitle,
  FilePreview,
  FileUpload,
  FileValidationUtils,
  FinancialChart,
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormModal,
  Grid,
  GridItem,
  HStack,
  ISPBrandHeader,
  ISPColors,
  ISPGradients,
  ISPIcons,
  ISPThemeProvider,
  ISPThemeUtils,
  Input,
  KEYS,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSidebar,
  LazyCharts,
  LazyStatusIndicators,
  LeafletMap,
  LineChart,
  Loading,
  LoadingDots,
  LoadingSkeleton,
  MetricCard,
  MobileNavigation,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFocusUtils,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalPortal,
  ModalProvider,
  ModalTitle,
  ModalTrigger,
  Navbar,
  Navigation,
  NavigationItem,
  NavigationLink,
  NavigationMenu,
  NavigationProvider,
  NavigationTabItem,
  NavigationTabNavigation,
  NetworkDeviceWidget,
  NetworkOutageMap,
  NetworkStatusIndicator,
  NetworkTopologyMap,
  NetworkUsageChart,
  NotificationBadge,
  NotificationList,
  NotificationProvider,
  OptimizedImage,
  OptimizedRevenueChart,
  OptimizedTooltip,
  PageTransition,
  PerformanceBudgets,
  PerformanceChart,
  PieChart,
  PortalBrand,
  PreloadingStrategies,
  Progress,
  PulseIndicator,
  Radio,
  RadioGroup,
  RealTimeMetricsWidget,
  ResponsiveSidebar,
  RevenueChart,
  Section,
  Select,
  ServiceCoverageMap,
  ServiceHealthWidget,
  ServiceStatusChart,
  ServiceTierBadge,
  Sidebar,
  SignalStrengthMap,
  Skeleton,
  SkeletonCard,
  SkeletonDashboard,
  SkeletonTable,
  SkeletonText,
  SlideIn,
  Slot,
  Spacer,
  SpeedGauge,
  SplitPoints,
  Stack,
  StaggerChild,
  StaggeredFadeIn,
  StatusIndicator,
  TabItem,
  TabNavigation,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
  TableSkeletons,
  TechnicianRouteMap,
  Textarea,
  ThemeAware,
  TicketVolumeChart,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  TreeShakableUtils,
  TypingAnimation,
  UniversalActivityFeed,
  UniversalChart,
  UniversalDashboard,
  UniversalDataTable,
  UniversalHeader,
  UniversalKPISection,
  UniversalLayout,
  UniversalMap,
  UniversalMetricCard,
  UniversalThemeProvider,
  UploadArea,
  UploadContent,
  VStack,
  VirtualizedDataTable,
  VirtualizedTable,
  addResourceHints,
  adminTheme,
  alertSeveritySchema,
  analyzeBundleImpact,
  analyzeBundleSize,
  applyTheme,
  bandwidthDataSchema,
  bundleSplitConfig,
  buttonVariants,
  cardContentVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardVariants,
  chartDataSchema,
  chartUtils,
  clsx,
  createDynamicImport,
  createMemoizedSelector,
  createPortalTheme,
  createValidationRules,
  customerTheme,
  cva,
  defaultConfig,
  defaultTheme,
  exportPerformanceData,
  generateBundleReport,
  generatePerformanceReport,
  getPerformanceRecommendations,
  inputVariants,
  isBrowser,
  isServer,
  networkMetricsSchema,
  networkUsageDataSchema,
  resellerTheme,
  revenueDataSchema,
  safeDocument,
  safeWindow,
  sanitizeHtml,
  sanitizeRichHtml,
  sanitizeText,
  serviceStatusDataSchema,
  serviceTierSchema,
  themes,
  toSafeIcon,
  toSafeIcons,
  uptimeSchema,
  useAriaExpanded,
  useAriaSelection,
  useBrowserLayoutEffect,
  useCSRF,
  useClientEffect,
  useDebouncedState,
  useDeepMemo,
  useDragAndDrop,
  useErrorHandler,
  useFileInput,
  useFocusTrap,
  useFormContext,
  useISPTheme,
  useId,
  useIsHydrated,
  useKeyboardNavigation,
  useLazyComponent,
  useLocalStorage,
  useMediaQuery,
  useMemoryMonitor,
  useModal,
  useModalContext,
  useModalState,
  useNavigation,
  useNotifications,
  usePrefersReducedMotion,
  useRenderProfiler,
  useScreenReaderAnnouncement,
  useSecureFetch,
  useSessionStorage,
  useThrottledState,
  useToast,
  useUniversalTheme,
  useUserPreferences,
  useVirtualizedList,
  validateArray,
  validateClassName,
  validateData,
  validationPatterns,
  version,
  withCSRFProtection,
  withErrorBoundary
});
