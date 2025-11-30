"use client";
import {
  createMemoizedSelector,
  useRenderProfiler,
  useThrottledState
} from "./chunk-334N3Q4S.mjs";
import {
  ErrorBoundary
} from "./chunk-YJ2G6VSN.mjs";
import {
  revenueDataSchema,
  sanitizeText,
  validateArray,
  validateClassName
} from "./chunk-IGRGGY7G.mjs";
import {
  ARIA_ROLES,
  announceToScreenReader,
  generateChartDescription,
  generateDataTable,
  generateId,
  useReducedMotion,
  useScreenReader
} from "./chunk-QTMW4DX6.mjs";

// src/charts/OptimizedCharts.tsx
import { useCallback, useMemo, memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { jsx, jsxs } from "react/jsx-runtime";
var COLORS = {
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
var ChartGradients = memo(() => /* @__PURE__ */ jsxs("defs", { children: [
  /* @__PURE__ */ jsxs("linearGradient", { id: "primaryGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
    /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: COLORS.primary, stopOpacity: 0.8 }),
    /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: COLORS.primary, stopOpacity: 0.1 })
  ] }),
  /* @__PURE__ */ jsxs("linearGradient", { id: "secondaryGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
    /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: COLORS.secondary, stopOpacity: 0.8 }),
    /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: COLORS.secondary, stopOpacity: 0.1 })
  ] }),
  /* @__PURE__ */ jsxs("linearGradient", { id: "accentGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
    /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: COLORS.accent, stopOpacity: 0.8 }),
    /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: COLORS.accent, stopOpacity: 0.1 })
  ] })
] }));
var createDataSelector = (validator, fallback) => createMemoizedSelector(
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
var OptimizedTooltip = memo(
  ({ active, payload, label, formatter }) => {
    const tooltipId = useMemo(() => generateId("chart-tooltip"), []);
    if (!active || !payload || payload.length === 0) {
      return null;
    }
    const safeLabel = useMemo(() => label ? sanitizeText(String(label)) : "", [label]);
    const accessibleDescription = useMemo(() => {
      const items = payload.map((entry) => {
        const name = entry.name ? sanitizeText(String(entry.name)) : "Unknown";
        const value = typeof entry.value === "number" ? entry.value : 0;
        return `${name}: ${value}`;
      });
      return `Chart data point ${safeLabel ? "for " + safeLabel : ""}: ${items.join(", ")}`;
    }, [payload, safeLabel]);
    const formattedEntries = useMemo(() => {
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
    return /* @__PURE__ */ jsxs(
      "div",
      {
        id: tooltipId,
        className: "bg-white border border-gray-200 rounded-lg shadow-lg p-3 backdrop-blur-sm",
        role: "tooltip",
        "aria-label": accessibleDescription,
        "aria-live": "polite",
        tabIndex: -1,
        children: [
          /* @__PURE__ */ jsx("div", { className: "sr-only", children: accessibleDescription }),
          safeLabel && /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900 mb-2", children: safeLabel }),
          formattedEntries.map((entry) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-3 h-3 rounded-full",
                style: { backgroundColor: entry.color },
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600", children: [
              entry.displayName,
              ":"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-900", children: entry.displayValue })
          ] }, `tooltip-${entry.index}`))
        ]
      }
    );
  },
  (prevProps, nextProps) => {
    return prevProps.active === nextProps.active && prevProps.label === nextProps.label && prevProps.formatter === nextProps.formatter && JSON.stringify(prevProps.payload) === JSON.stringify(nextProps.payload);
  }
);
var OptimizedRevenueChart = memo(
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
    const ids = useMemo(
      () => ({
        chartId: generateId("revenue-chart"),
        descriptionId: generateId("revenue-description"),
        tableId: generateId("revenue-table")
      }),
      []
    );
    const dataSelector = useMemo(() => createDataSelector(revenueDataSchema, []), []);
    const validatedData = useMemo(() => dataSelector(data), [dataSelector, data]);
    const safeClassName = useMemo(() => validateClassName(className), [className]);
    const chartDescription = useMemo(
      () => generateChartDescription("area", validatedData, "Revenue Trends"),
      [validatedData]
    );
    const dataTableDescription = useMemo(
      () => generateDataTable(validatedData, ["month", "revenue", "target", "previousYear"]),
      [validatedData]
    );
    const handleMouseEnter = useCallback(
      (...args) => {
        const index = typeof args[1] === "number" ? args[1] : null;
        if (index !== null) {
          setActiveIndex(index);
        }
      },
      [setActiveIndex]
    );
    const handleMouseLeave = useCallback(() => {
      setActiveIndex(null);
    }, [setActiveIndex]);
    const handleDataPointClick = useCallback(
      (data2, index) => {
        if (onDataPointClick && validatedData[index]) {
          onDataPointClick(validatedData[index], index);
        }
      },
      [onDataPointClick, validatedData]
    );
    const tooltipFormatter = useCallback(
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
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: `w-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${safeClassName}`,
          style: { height },
          role: "img",
          "aria-label": "No revenue data available",
          tabIndex: 0,
          children: /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "No revenue data available" })
        }
      );
    }
    return /* @__PURE__ */ jsx(
      ErrorBoundary,
      {
        fallback: /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-full flex items-center justify-center bg-red-50 border border-red-200 rounded-lg",
            style: { height },
            children: /* @__PURE__ */ jsx("p", { className: "text-red-600 text-sm", children: "Revenue chart failed to load" })
          }
        ),
        children: /* @__PURE__ */ jsxs(
          "figure",
          {
            className: `w-full ${safeClassName}`,
            style: { height },
            role: ARIA_ROLES.CHART_CONTAINER,
            "data-render-count": renderCount,
            children: [
              /* @__PURE__ */ jsx("div", { id: ids.descriptionId, className: "sr-only", children: chartDescription }),
              /* @__PURE__ */ jsxs("div", { id: ids.tableId, className: "sr-only", children: [
                /* @__PURE__ */ jsx("p", { children: "Data table alternative for screen readers:" }),
                /* @__PURE__ */ jsx("p", { children: dataTableDescription })
              ] }),
              /* @__PURE__ */ jsx(
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
                  children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
                    AreaChart,
                    {
                      data: validatedData,
                      margin: { top: 10, right: 30, left: 0, bottom: 0 },
                      onClick: handleDataPointClick,
                      children: [
                        /* @__PURE__ */ jsx(ChartGradients, {}),
                        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E5E7EB" }),
                        /* @__PURE__ */ jsx(
                          XAxis,
                          {
                            dataKey: "month",
                            axisLine: false,
                            tickLine: false,
                            tick: { fontSize: 12, fill: "#6B7280" }
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          YAxis,
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
                        /* @__PURE__ */ jsx(
                          Tooltip,
                          {
                            content: /* @__PURE__ */ jsx(OptimizedTooltip, { formatter: tooltipFormatter }),
                            animationDuration: prefersReducedMotion ? 0 : 200
                          }
                        ),
                        /* @__PURE__ */ jsx(Legend, {}),
                        /* @__PURE__ */ jsx(
                          Area,
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
                        /* @__PURE__ */ jsx(
                          Area,
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

export {
  COLORS,
  ChartGradients,
  OptimizedTooltip,
  OptimizedRevenueChart
};
