"use client";
"use client";
import {
  cn
} from "./chunk-RBS3KYSI.mjs";
import {
  ErrorBoundary
} from "./chunk-YJ2G6VSN.mjs";
import {
  alertSeveritySchema,
  networkMetricsSchema,
  sanitizeText,
  serviceTierSchema,
  uptimeSchema,
  validateClassName,
  validateData
} from "./chunk-IGRGGY7G.mjs";
import {
  ARIA_ROLES,
  COLOR_CONTRAST,
  announceToScreenReader,
  generateId,
  generateStatusText,
  useReducedMotion
} from "./chunk-QTMW4DX6.mjs";

// src/indicators/StatusIndicators.tsx
import { cva } from "class-variance-authority";
import { useMemo, useCallback } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var statusBadgeVariants = cva(
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
var statusDotVariants = cva("rounded-full flex-shrink-0 transition-all duration-200", {
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
var StatusBadge = ({
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
  const badgeId = useMemo(() => generateId("status-badge"), []);
  const safeClassName = useMemo(() => {
    return validateClassName(className);
  }, [className]);
  const safeChildren = useMemo(() => {
    if (typeof children === "string") {
      return sanitizeText(children);
    }
    return children;
  }, [children]);
  const safeVariant = useMemo(() => {
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
  const accessibleStatusText = useMemo(() => {
    const textIndicator = COLOR_CONTRAST.TEXT_INDICATORS[safeVariant];
    const childText = typeof safeChildren === "string" ? safeChildren : "";
    return generateStatusText(safeVariant, childText);
  }, [safeVariant, safeChildren]);
  const handleClick = useCallback(() => {
    try {
      if (onClick) {
        onClick();
        announceToScreenReader(`Status changed to ${accessibleStatusText}`, "polite");
      }
    } catch (error) {
      console.error("StatusBadge click handler error:", error);
    }
  }, [onClick, accessibleStatusText]);
  const handleKeyDown = useCallback(
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
  return /* @__PURE__ */ jsx(
    ErrorBoundary,
    {
      fallback: /* @__PURE__ */ jsx(
        "span",
        {
          className: "inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs",
          role: "status",
          "aria-label": "Status indicator error",
          children: "Status Error"
        }
      ),
      children: /* @__PURE__ */ jsxs(
        "span",
        {
          id: badgeId,
          className: cn(
            statusBadgeVariants({
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
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: accessibleStatusText }),
            showDot && /* @__PURE__ */ jsx(
              "span",
              {
                className: cn(
                  statusDotVariants({
                    status: safeVariant,
                    size: dotSize,
                    pulse: shouldPulse
                  })
                ),
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", "aria-hidden": "true", children: COLOR_CONTRAST.TEXT_INDICATORS[safeVariant]?.split(" ")[0] || "\u25CF" }),
              safeChildren
            ] }),
            onClick && /* @__PURE__ */ jsx("span", { id: `${badgeId}-description`, className: "sr-only", children: "Press Enter or Space to interact with this status indicator" })
          ]
        }
      )
    }
  );
};
var UptimeIndicator = ({
  uptime,
  className,
  showLabel = true,
  "aria-label": ariaLabel
}) => {
  const validatedUptime = useMemo(() => {
    try {
      return validateData(uptimeSchema, uptime);
    } catch (error) {
      console.error("Invalid uptime value:", error);
      return 0;
    }
  }, [uptime]);
  const safeClassName = useMemo(() => {
    return validateClassName(className);
  }, [className]);
  const uptimeStatus = useMemo(() => {
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
  const progressWidth = useMemo(() => {
    const width = Math.min(Math.max(validatedUptime, 0), 100);
    return `${width}%`;
  }, [validatedUptime]);
  return /* @__PURE__ */ jsx(
    ErrorBoundary,
    {
      fallback: /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2 p-2 bg-gray-100 rounded text-sm text-gray-600", children: /* @__PURE__ */ jsx("span", { children: "Uptime data unavailable" }) }),
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: cn("flex items-center space-x-3", safeClassName),
          role: "progressbar",
          "aria-valuenow": validatedUptime,
          "aria-valuemin": 0,
          "aria-valuemax": 100,
          "aria-label": ariaLabel || `Service uptime: ${validatedUptime.toFixed(2)}% - ${uptimeStatus.label}`,
          children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            showLabel && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Uptime" }),
              /* @__PURE__ */ jsxs("span", { className: cn("text-sm font-bold", uptimeStatus.color), children: [
                validatedUptime.toFixed(2),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsx(
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
var NetworkPerformanceIndicator = ({
  latency,
  packetLoss,
  bandwidth,
  className,
  onMetricClick
}) => {
  const validatedMetrics = useMemo(() => {
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
  const safeClassName = useMemo(() => {
    return validateClassName(className);
  }, [className]);
  const networkStatus = useMemo(() => {
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
  const handleLatencyClick = useCallback(() => {
    try {
      if (onMetricClick) {
        onMetricClick("latency");
      }
    } catch (error) {
      console.error("Latency click handler error:", error);
    }
  }, [onMetricClick]);
  const handlePacketLossClick = useCallback(() => {
    try {
      if (onMetricClick) {
        onMetricClick("packetLoss");
      }
    } catch (error) {
      console.error("Packet loss click handler error:", error);
    }
  }, [onMetricClick]);
  const handleBandwidthClick = useCallback(() => {
    try {
      if (onMetricClick) {
        onMetricClick("bandwidth");
      }
    } catch (error) {
      console.error("Bandwidth click handler error:", error);
    }
  }, [onMetricClick]);
  return /* @__PURE__ */ jsx(
    ErrorBoundary,
    {
      fallback: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded text-sm text-gray-600", children: /* @__PURE__ */ jsx("div", { children: "Network metrics unavailable" }) }),
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn("grid grid-cols-3 gap-4", safeClassName),
          role: "group",
          "aria-label": "Network performance metrics",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxs(
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
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: "Latency" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxs(
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
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: "Packet Loss" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxs(
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
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: "Bandwidth" })
            ] })
          ]
        }
      )
    }
  );
};
var ServiceTierIndicator = ({
  tier,
  className,
  onClick,
  "aria-label": ariaLabel
}) => {
  const validatedTier = useMemo(() => {
    try {
      return validateData(serviceTierSchema, tier);
    } catch (error) {
      console.error("Invalid service tier:", error);
      return "basic";
    }
  }, [tier]);
  const safeClassName = useMemo(() => {
    return validateClassName(className);
  }, [className]);
  const tierConfig = useMemo(
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
  const handleClick = useCallback(() => {
    try {
      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.error("Service tier click handler error:", error);
    }
  }, [onClick]);
  return /* @__PURE__ */ jsx(
    ErrorBoundary,
    {
      fallback: /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2 p-2 bg-gray-100 rounded text-sm text-gray-600", children: /* @__PURE__ */ jsx("span", { children: "Service tier unavailable" }) }),
      children: /* @__PURE__ */ jsxs(
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
            /* @__PURE__ */ jsx("span", { className: "text-lg", "aria-hidden": "true", children: config.icon }),
            /* @__PURE__ */ jsx(StatusBadge, { variant: config.variant, size: "md", children: config.label })
          ]
        }
      )
    }
  );
};
var AlertSeverityIndicator = ({
  severity,
  message,
  timestamp,
  className,
  onDismiss,
  "aria-label": ariaLabel
}) => {
  const validatedSeverity = useMemo(() => {
    try {
      return validateData(alertSeveritySchema, severity);
    } catch (error) {
      console.error("Invalid alert severity:", error);
      return "info";
    }
  }, [severity]);
  const safeMessage = useMemo(() => {
    return sanitizeText(message || "No message provided");
  }, [message]);
  const safeClassName = useMemo(() => {
    return validateClassName(className);
  }, [className]);
  const severityConfig = useMemo(
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
  const handleDismiss = useCallback(() => {
    try {
      if (onDismiss) {
        onDismiss();
      }
    } catch (error) {
      console.error("Alert dismiss handler error:", error);
    }
  }, [onDismiss]);
  const formattedTimestamp = useMemo(() => {
    if (!timestamp) return null;
    try {
      return timestamp.toLocaleString();
    } catch (error) {
      console.error("Timestamp formatting error:", error);
      return "Invalid timestamp";
    }
  }, [timestamp]);
  return /* @__PURE__ */ jsx(
    ErrorBoundary,
    {
      fallback: /* @__PURE__ */ jsx("div", { className: "flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600", children: /* @__PURE__ */ jsx("span", { children: "Alert information unavailable" }) }),
      children: /* @__PURE__ */ jsxs(
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
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxs(
              StatusBadge,
              {
                variant: config.variant,
                size: "sm",
                pulse: validatedSeverity === "critical",
                showDot: true,
                children: [
                  /* @__PURE__ */ jsx("span", { className: "mr-1", "aria-hidden": "true", children: config.icon }),
                  validatedSeverity.toUpperCase()
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: cn("text-sm font-medium", config.textColor), children: safeMessage }),
              formattedTimestamp && /* @__PURE__ */ jsx(
                "p",
                {
                  className: "text-xs text-gray-500 mt-1",
                  "aria-label": `Alert time: ${formattedTimestamp}`,
                  children: formattedTimestamp
                }
              )
            ] }),
            onDismiss && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleDismiss,
                className: "flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded",
                "aria-label": "Dismiss alert",
                type: "button",
                children: /* @__PURE__ */ jsx("span", { className: "text-lg", "aria-hidden": "true", children: "\xD7" })
              }
            )
          ]
        }
      )
    }
  );
};
var StatusIndicators = ({
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
}) => /* @__PURE__ */ jsxs(
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
export {
  AlertSeverityIndicator,
  NetworkPerformanceIndicator,
  ServiceTierIndicator,
  StatusBadge,
  StatusIndicators,
  UptimeIndicator,
  statusBadgeVariants,
  statusDotVariants
};
