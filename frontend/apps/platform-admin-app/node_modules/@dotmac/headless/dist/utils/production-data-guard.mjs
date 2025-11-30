// src/utils/production-data-guard.ts
function createMockDataGuard(config) {
  const isDevelopment = process.env["NODE_ENV"] === "development";
  const isTest = process.env["NODE_ENV"] === "test";
  const isProduction = process.env["NODE_ENV"] === "production";
  const shouldUseMockData = isDevelopment && (config?.enableInDevelopment ?? true) || isTest && (config?.enableInTest ?? true);
  return {
    isDevelopment,
    isTest,
    isProduction,
    shouldUseMockData
  };
}
function mockData(mockValue, productionFallback, config) {
  const guard = createMockDataGuard(config);
  if (guard.shouldUseMockData) {
    if (guard.isDevelopment && config?.warningMessage) {
      console.warn(`\u{1F527} Mock Data Active: ${config.warningMessage}`);
    }
    return mockValue;
  }
  if (guard.isProduction) {
    if (productionFallback !== void 0) {
      return productionFallback;
    }
    if (config?.fallbackToEmpty) {
      return Array.isArray(mockValue) ? [] : {};
    }
    console.error("\u{1F6A8} Attempted to use mock data in production environment");
    return void 0;
  }
  return productionFallback;
}
function devOnly(fn) {
  if (process.env["NODE_ENV"] === "development") {
    return fn();
  }
  return void 0;
}
function testOnly(fn) {
  if (process.env["NODE_ENV"] === "test") {
    return fn();
  }
  return void 0;
}
function useMockData(mockValue, productionFallback, config) {
  if (process.env["NODE_ENV"] === "production") {
    return productionFallback;
  }
  return mockData(mockValue, productionFallback, config);
}
function mockApiWrapper(realApiCall, mockData2, config) {
  return async (...args) => {
    const guard = createMockDataGuard(config);
    if (guard.shouldUseMockData) {
      const delay = config?.delay ?? 500;
      await new Promise((resolve) => setTimeout(resolve, delay));
      const result = typeof mockData2 === "function" ? mockData2() : mockData2;
      if (guard.isDevelopment && config?.warningMessage) {
        console.warn(`\u{1F527} Mock API Active: ${config.warningMessage}`);
      }
      return result;
    }
    return realApiCall(...args);
  };
}
function createMockGenerator(factory, config) {
  return {
    generate() {
      const guard = createMockDataGuard(config);
      if (!guard.shouldUseMockData) {
        throw new Error("Mock data generation attempted in production environment");
      }
      return factory();
    },
    generateMany(count) {
      return Array.from({ length: count }, () => this.generate());
    },
    withOverrides(overrides) {
      return createMockGenerator(
        () => ({
          ...factory(),
          ...overrides
        }),
        config
      );
    }
  };
}
var safeConsole = {
  dev: (message, ...args) => {
    if (process.env["NODE_ENV"] === "development") {
      console.log(`\u{1F527} [DEV] ${message}`, ...args);
    }
  },
  test: (message, ...args) => {
    if (process.env["NODE_ENV"] === "test") {
      console.log(`\u{1F9EA} [TEST] ${message}`, ...args);
    }
  },
  warn: (message, ...args) => {
    if (process.env["NODE_ENV"] !== "production") {
      console.warn(`\u26A0\uFE0F ${message}`, ...args);
    }
  },
  error: (message, ...args) => {
    console.error(`\u{1F6A8} ${message}`, ...args);
  }
};
var defaultMockGuard = createMockDataGuard();

export { createMockDataGuard, createMockGenerator, defaultMockGuard, devOnly, mockApiWrapper, mockData, safeConsole, testOnly, useMockData };
//# sourceMappingURL=production-data-guard.mjs.map
//# sourceMappingURL=production-data-guard.mjs.map