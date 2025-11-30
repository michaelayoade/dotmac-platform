"use client";

// src/utils/performance.ts
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
var performanceProfiles = /* @__PURE__ */ new Map();
var renderMetrics = [];
var useRenderProfiler = (componentName, props) => {
  const renderCount = useRef(0);
  const lastProps = useRef(props);
  const renderStart = useRef(0);
  renderStart.current = performance.now();
  useEffect(() => {
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
var createMemoizedSelector = (selector, dependencies = () => []) => {
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
var useDeepMemo = (factory, deps) => {
  const ref = useRef();
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
var useThrottledState = (initialValue, delay = 100) => {
  const [state, setState] = useState(initialValue);
  const [throttledState, setThrottledState] = useState(initialValue);
  const timeoutRef = useRef();
  const setThrottledValue = useCallback(
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
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return [state, setThrottledValue, throttledState];
};
var useDebouncedState = (initialValue, delay = 300) => {
  const [state, setState] = useState(initialValue);
  const [debouncedState, setDebouncedState] = useState(initialValue);
  const timeoutRef = useRef();
  const setDebouncedValue = useCallback(
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
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return [state, setDebouncedValue, debouncedState];
};
var useLazyComponent = (importFunction, fallback) => {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadComponent = useCallback(async () => {
    if (Component || loading) return;
    setLoading(true);
    setError(null);
    try {
      const module = await importFunction();
      setComponent(() => module.default);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load component"));
    } finally {
      setLoading(false);
    }
  }, [Component, loading, importFunction]);
  return {
    Component: Component || fallback || null,
    loading,
    error,
    loadComponent
  };
};
var useVirtualizedList = ({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const visibleRange = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight);
    const start = Math.max(0, visibleStart - overscan);
    const end = Math.min(items.length, visibleEnd + overscan);
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);
  const visibleItems = useMemo(() => {
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
  const handleScroll = useCallback((event) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);
  return {
    visibleItems,
    totalHeight,
    handleScroll,
    scrollTop
  };
};
var analyzeBundleImpact = (componentName, size) => {
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
var useMemoryMonitor = (componentName) => {
  const [memoryUsage, setMemoryUsage] = useState(null);
  useEffect(() => {
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
var getPerformanceRecommendations = (profile) => {
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
var generatePerformanceReport = () => {
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
var exportPerformanceData = () => {
  const report = generatePerformanceReport();
  const data = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    report,
    metrics: renderMetrics.slice(-100)
    // Last 100 renders
  };
  return JSON.stringify(data, null, 2);
};

export {
  useRenderProfiler,
  createMemoizedSelector,
  useDeepMemo,
  useThrottledState,
  useDebouncedState,
  useLazyComponent,
  useVirtualizedList,
  analyzeBundleImpact,
  useMemoryMonitor,
  getPerformanceRecommendations,
  generatePerformanceReport,
  exportPerformanceData
};
