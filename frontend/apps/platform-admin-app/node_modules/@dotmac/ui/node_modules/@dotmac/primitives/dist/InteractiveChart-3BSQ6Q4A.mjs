"use client";
"use client";
import {
  useRenderProfiler
} from "./chunk-334N3Q4S.mjs";
import {
  ErrorBoundary
} from "./chunk-YJ2G6VSN.mjs";
import {
  bandwidthDataSchema,
  networkUsageDataSchema,
  revenueDataSchema,
  sanitizeText,
  serviceStatusDataSchema,
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

// src/charts/InteractiveChart.tsx
import { useState, useCallback, useMemo, memo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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
var ChartGradients = () => /* @__PURE__ */ jsxs("defs", { children: [
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
] });
var CustomTooltip = memo(
  ({ active, payload, label, formatter }) => {
    const tooltipId = useMemo(() => generateId("chart-tooltip"), []);
    if (!active || !payload || payload.length === 0) {
      return null;
    }
    const safeLabel = label ? sanitizeText(String(label)) : "";
    const accessibleDescription = useMemo(() => {
      const items = payload.map((entry) => {
        const name = entry.name ? sanitizeText(String(entry.name)) : "Unknown";
        const value = typeof entry.value === "number" ? entry.value : 0;
        return `${name}: ${value}`;
      });
      return `Chart data point ${safeLabel ? "for " + safeLabel : ""}: ${items.join(", ")}`;
    }, [payload, safeLabel]);
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
            return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-3 h-3 rounded-full",
                  style: { backgroundColor: entry.color || "#666" },
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600", children: [
                displayName,
                ":"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-900", children: displayValue })
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
var RevenueChart = memo(
  ({ data, height = 300, className, onDataPointClick }) => {
    const { renderCount, getProfile } = useRenderProfiler("RevenueChart", {
      dataLength: data?.length,
      height,
      className
    });
    const prefersReducedMotion = useReducedMotion();
    const isScreenReader = useScreenReader();
    const chartId = useMemo(() => generateId("revenue-chart"), []);
    const descriptionId = useMemo(() => generateId("revenue-description"), []);
    const tableId = useMemo(() => generateId("revenue-table"), []);
    const validatedData = useMemo(() => {
      try {
        return validateArray(revenueDataSchema, data);
      } catch (error) {
        console.error("RevenueChart data validation failed:", error);
        return [];
      }
    }, [data]);
    const safeClassName = useMemo(() => {
      return validateClassName(className);
    }, [className]);
    const chartDescription = useMemo(() => {
      return generateChartDescription("area", validatedData, "Revenue Trends");
    }, [validatedData]);
    const dataTableDescription = useMemo(() => {
      return generateDataTable(validatedData, ["month", "revenue", "target", "previousYear"]);
    }, [validatedData]);
    const [activeIndex, setActiveIndex] = useState(null);
    const handleMouseEnter = useCallback((...args) => {
      const index = typeof args[1] === "number" ? args[1] : null;
      if (index !== null) {
        setActiveIndex(index);
      }
    }, []);
    const handleMouseLeave = useCallback(() => {
      setActiveIndex(null);
    }, []);
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
            children: [
              /* @__PURE__ */ jsx("div", { id: descriptionId, className: "sr-only", children: chartDescription }),
              /* @__PURE__ */ jsxs("div", { id: tableId, className: "sr-only", children: [
                /* @__PURE__ */ jsx("p", { children: "Data table alternative for screen readers:" }),
                /* @__PURE__ */ jsx("p", { children: dataTableDescription })
              ] }),
              /* @__PURE__ */ jsx(
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
                        /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, { formatter: tooltipFormatter }) }),
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
                            onMouseLeave: handleMouseLeave
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
var NetworkUsageChart = ({
  data,
  height = 250,
  className,
  onDataPointClick
}) => {
  const validatedData = useMemo(() => {
    try {
      return validateArray(networkUsageDataSchema, data);
    } catch (error) {
      console.error("NetworkUsageChart data validation failed:", error);
      return [];
    }
  }, [data]);
  const safeClassName = useMemo(() => {
    return validateClassName(className);
  }, [className]);
  const handleDataPointClick = useCallback(
    (data2, index) => {
      if (onDataPointClick && validatedData[index]) {
        onDataPointClick(validatedData[index], index);
      }
    },
    [onDataPointClick, validatedData]
  );
  const tooltipFormatter = useCallback((value, name) => {
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
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `w-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${safeClassName}`,
        style: { height },
        role: "img",
        "aria-label": "No network usage data available",
        children: /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "No network usage data available" })
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
          children: /* @__PURE__ */ jsx("p", { className: "text-red-600 text-sm", children: "Network usage chart failed to load" })
        }
      ),
      children: /* @__PURE__ */ jsx("div", { className: `w-full ${safeClassName}`, style: { height }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
        BarChart,
        {
          data: validatedData,
          margin: { top: 20, right: 30, left: 20, bottom: 5 },
          onClick: handleDataPointClick,
          children: [
            /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E5E7EB" }),
            /* @__PURE__ */ jsx(
              XAxis,
              {
                dataKey: "hour",
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
                    return isNaN(num) ? "0GB" : `${num}GB`;
                  } catch {
                    return "0GB";
                  }
                }
              }
            ),
            /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, { formatter: tooltipFormatter }) }),
            /* @__PURE__ */ jsx(Legend, {}),
            /* @__PURE__ */ jsx(Bar, { dataKey: "download", fill: COLORS.primary, name: "Download", radius: [2, 2, 0, 0] }),
            /* @__PURE__ */ jsx(Bar, { dataKey: "upload", fill: COLORS.secondary, name: "Upload", radius: [2, 2, 0, 0] })
          ]
        }
      ) }) })
    }
  );
};
var ServiceStatusChart = ({
  data,
  height = 250,
  className,
  onDataPointClick
}) => {
  const validatedData = useMemo(() => {
    try {
      return validateArray(serviceStatusDataSchema, data);
    } catch (error) {
      console.error("ServiceStatusChart data validation failed:", error);
      return [];
    }
  }, [data]);
  const safeClassName = useMemo(() => {
    return validateClassName(className);
  }, [className]);
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "online":
        return COLORS.success;
      case "maintenance":
        return COLORS.warning;
      case "offline":
        return COLORS.danger;
      default:
        return COLORS.primary;
    }
  }, []);
  const [activeIndex, setActiveIndex] = useState(null);
  const handleMouseEnter = useCallback((...args) => {
    const index = typeof args[1] === "number" ? args[1] : null;
    if (index !== null) {
      setActiveIndex(index);
    }
  }, []);
  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);
  const handleDataPointClick = useCallback(
    (data2, index) => {
      if (onDataPointClick && validatedData[index]) {
        onDataPointClick(validatedData[index], index);
      }
    },
    [onDataPointClick, validatedData]
  );
  const tooltipFormatter = useCallback((value, name) => {
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
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `w-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${safeClassName}`,
        style: { height },
        role: "img",
        "aria-label": "No service status data available",
        children: /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "No service status data available" })
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
          children: /* @__PURE__ */ jsx("p", { className: "text-red-600 text-sm", children: "Service status chart failed to load" })
        }
      ),
      children: /* @__PURE__ */ jsx("div", { className: `w-full ${safeClassName}`, style: { height }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { onClick: handleDataPointClick, children: [
        /* @__PURE__ */ jsx(
          Pie,
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
            children: validatedData.map((entry, index) => /* @__PURE__ */ jsx(
              Cell,
              {
                fill: getStatusColor(entry.status),
                stroke: index === activeIndex ? "#FFF" : "none",
                strokeWidth: index === activeIndex ? 2 : 0
              },
              `cell-${index}`
            ))
          }
        ),
        /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, { formatter: tooltipFormatter }) }),
        /* @__PURE__ */ jsx(Legend, {})
      ] }) }) })
    }
  );
};
var BandwidthChart = ({
  data,
  height = 200,
  className,
  onDataPointClick
}) => {
  const validatedData = useMemo(() => {
    try {
      return validateArray(bandwidthDataSchema, data);
    } catch (error) {
      console.error("BandwidthChart data validation failed:", error);
      return [];
    }
  }, [data]);
  const safeClassName = useMemo(() => {
    return validateClassName(className);
  }, [className]);
  const handleDataPointClick = useCallback(
    (data2, index) => {
      if (onDataPointClick && validatedData[index]) {
        onDataPointClick(validatedData[index], index);
      }
    },
    [onDataPointClick, validatedData]
  );
  const tooltipFormatter = useCallback((value, name) => {
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
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `w-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${safeClassName}`,
        style: { height },
        role: "img",
        "aria-label": "No bandwidth data available",
        children: /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "No bandwidth data available" })
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
          children: /* @__PURE__ */ jsx("p", { className: "text-red-600 text-sm", children: "Bandwidth chart failed to load" })
        }
      ),
      children: /* @__PURE__ */ jsx("div", { className: `w-full ${safeClassName}`, style: { height }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
        LineChart,
        {
          data: validatedData,
          margin: { top: 5, right: 30, left: 20, bottom: 5 },
          onClick: handleDataPointClick,
          children: [
            /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E5E7EB" }),
            /* @__PURE__ */ jsx(
              XAxis,
              {
                dataKey: "time",
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
                    return isNaN(num) ? "0%" : `${num}%`;
                  } catch {
                    return "0%";
                  }
                }
              }
            ),
            /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, { formatter: tooltipFormatter }) }),
            /* @__PURE__ */ jsx(Legend, {}),
            /* @__PURE__ */ jsx(
              Line,
              {
                type: "monotone",
                dataKey: "utilization",
                stroke: COLORS.primary,
                strokeWidth: 3,
                dot: { fill: COLORS.primary, strokeWidth: 2, r: 4 },
                activeDot: {
                  r: 6,
                  stroke: COLORS.primary,
                  strokeWidth: 2,
                  fill: "#FFF"
                },
                name: "Bandwidth Utilization"
              }
            ),
            /* @__PURE__ */ jsx(
              Line,
              {
                type: "monotone",
                dataKey: "capacity",
                stroke: COLORS.danger,
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
export {
  BandwidthChart,
  COLORS,
  ChartGradients,
  NetworkUsageChart,
  RevenueChart,
  ServiceStatusChart
};
