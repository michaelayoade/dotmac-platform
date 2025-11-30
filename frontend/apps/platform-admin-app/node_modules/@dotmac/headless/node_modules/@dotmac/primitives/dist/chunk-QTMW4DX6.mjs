"use client";

// src/utils/a11y.ts
import { useCallback, useEffect, useRef, useState } from "react";
var ARIA_ROLES = {
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
var ARIA_PROPERTIES = {
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
var ARIA_LIVE_LEVELS = {
  OFF: "off",
  POLITE: "polite",
  ASSERTIVE: "assertive"
};
var announceToScreenReader = (message, priority = "polite") => {
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
var generateChartDescription = (chartType, data, title) => {
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
var generateDataTable = (data, headers) => {
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
var useKeyboardNavigation = (items, options = {}) => {
  const { loop = true, orientation = "both", onSelect, disabled = false } = options;
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleKeyDown = useCallback(
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
var useFocusManagement = () => {
  const previouslyFocusedElement = useRef(null);
  const trapFocus = useCallback((container) => {
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
  const saveFocus = useCallback(() => {
    previouslyFocusedElement.current = document.activeElement;
  }, []);
  const restoreFocus = useCallback(() => {
    previouslyFocusedElement.current?.focus();
    previouslyFocusedElement.current = null;
  }, []);
  return { trapFocus, saveFocus, restoreFocus };
};
var COLOR_CONTRAST = {
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
var generateStatusText = (variant, value, context) => {
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
var useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return prefersReducedMotion;
};
var useScreenReader = () => {
  const [isScreenReader, setIsScreenReader] = useState(false);
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isScreenReaderUA = userAgent.includes("nvda") || userAgent.includes("jaws") || userAgent.includes("dragon") || userAgent.includes("voiceover");
    const isHighContrast = window.matchMedia("(prefers-contrast: high)").matches;
    const isForcedColors = window.matchMedia("(forced-colors: active)").matches;
    setIsScreenReader(isScreenReaderUA || isHighContrast || isForcedColors);
  }, []);
  return isScreenReader;
};
var idCounter = 0;
var generateId = (prefix = "accessibility") => {
  return `${prefix}-${Date.now()}-${++idCounter}`;
};

export {
  ARIA_ROLES,
  ARIA_PROPERTIES,
  ARIA_LIVE_LEVELS,
  announceToScreenReader,
  generateChartDescription,
  generateDataTable,
  useKeyboardNavigation,
  useFocusManagement,
  COLOR_CONTRAST,
  generateStatusText,
  useReducedMotion,
  useScreenReader,
  generateId
};
