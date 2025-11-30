"use client";

// src/components/ErrorBoundary.tsx
import React, { Component } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DefaultErrorFallback = ({
  error,
  errorId,
  onRetry,
  componentName = "Component"
}) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: "flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg",
    role: "alert",
    "aria-live": "polite",
    children: [
      /* @__PURE__ */ jsx("div", { className: "text-red-600 mb-2", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        }
      ) }) }),
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-red-900 mb-2", children: [
        componentName,
        " Error"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700 text-center mb-4", children: "Something went wrong while rendering this component." }),
      /* @__PURE__ */ jsxs("details", { className: "mb-4 text-xs text-red-600", children: [
        /* @__PURE__ */ jsxs("summary", { className: "cursor-pointer hover:text-red-800", children: [
          "Technical Details (ID: ",
          errorId,
          ")"
        ] }),
        /* @__PURE__ */ jsx("pre", { className: "mt-2 p-2 bg-red-100 rounded text-xs overflow-auto max-w-md", children: error.message })
      ] }),
      onRetry && /* @__PURE__ */ jsx(
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
var ErrorBoundary = class extends Component {
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
      return /* @__PURE__ */ jsx(
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

export {
  ErrorBoundary
};
