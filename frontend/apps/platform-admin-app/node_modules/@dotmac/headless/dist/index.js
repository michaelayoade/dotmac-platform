"use client";
'use strict';

var reactQuery = require('@tanstack/react-query');
require('crypto');
var primitives = require('@dotmac/primitives');
var React6 = require('react');
var zustand = require('zustand');
var middleware = require('zustand/middleware');
var zod = require('zod');
var jsxRuntime = require('react/jsx-runtime');
var lucideReact = require('lucide-react');
var navigation = require('next/navigation');
var immer = require('zustand/middleware/immer');
var sdkNode = require('@opentelemetry/sdk-node');
var autoInstrumentationsNode = require('@opentelemetry/auto-instrumentations-node');
var resources = require('@opentelemetry/resources');
var semanticConventions = require('@opentelemetry/semantic-conventions');
var exporterTraceOtlpHttp = require('@opentelemetry/exporter-trace-otlp-http');
var exporterMetricsOtlpHttp = require('@opentelemetry/exporter-metrics-otlp-http');
var sdkMetrics = require('@opentelemetry/sdk-metrics');
var Script = require('next/script');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React6__namespace = /*#__PURE__*/_interopNamespace(React6);
var Script__default = /*#__PURE__*/_interopDefault(Script);

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/types/error-contract.ts
var error_contract_exports = {};
__export(error_contract_exports, {
  ErrorCategory: () => ErrorCategory,
  ErrorSeverity: () => ErrorSeverity,
  STATUS_TO_CATEGORY: () => STATUS_TO_CATEGORY,
  STATUS_TO_RETRYABLE: () => STATUS_TO_RETRYABLE,
  STATUS_TO_SEVERITY: () => STATUS_TO_SEVERITY,
  createStandardError: () => createStandardError,
  generateCorrelationId: () => generateCorrelationId2,
  generateUserMessage: () => generateUserMessage,
  isRetryableStatus: () => isRetryableStatus,
  isStandardError: () => isStandardError,
  parseBackendError: () => parseBackendError,
  statusToCategory: () => statusToCategory,
  statusToSeverity: () => statusToSeverity
});
function statusToCategory(status) {
  return STATUS_TO_CATEGORY[status] || "system" /* SYSTEM */;
}
function statusToSeverity(status) {
  return STATUS_TO_SEVERITY[status] || "medium" /* MEDIUM */;
}
function isRetryableStatus(status) {
  return STATUS_TO_RETRYABLE[status] || false;
}
function generateUserMessage(category, technicalMessage) {
  const messages = {
    ["network" /* NETWORK */]: "Connection problem. Please check your internet and try again.",
    ["authentication" /* AUTHENTICATION */]: "Please log in again to continue.",
    ["authorization" /* AUTHORIZATION */]: "You don't have permission to perform this action.",
    ["validation" /* VALIDATION */]: "Please check your input and try again.",
    ["business" /* BUSINESS */]: "Unable to complete this action. Please try again later.",
    ["system" /* SYSTEM */]: "System temporarily unavailable. Please try again in a few minutes.",
    ["database" /* DATABASE */]: "Database operation failed. Please try again.",
    ["external_service" /* EXTERNAL_SERVICE */]: "External service unavailable. Please try again later.",
    ["unknown" /* UNKNOWN */]: "Something went wrong. Please try again."
  };
  return messages[category] || technicalMessage || "An error occurred.";
}
function generateCorrelationId2() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 11);
  return `err_${timestamp}_${random}`;
}
function createStandardError(options) {
  const status = options.status || 500;
  const category = options.category || statusToCategory(status);
  const severity = options.severity || statusToSeverity(status);
  const retryable = options.retryable !== void 0 ? options.retryable : isRetryableStatus(status);
  return {
    error_code: options.error_code,
    message: options.message,
    user_message: options.user_message || generateUserMessage(category, options.message),
    correlation_id: generateCorrelationId2(),
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    status,
    severity,
    category,
    retryable,
    details: options.details,
    recovery_hint: options.recovery_hint,
    trace_id: options.trace_id,
    request_id: options.request_id
  };
}
function parseBackendError(error2) {
  if (error2.error_code && error2.correlation_id) {
    return error2;
  }
  const status = error2.status || error2.status_code || 500;
  const errorCode = error2.error || error2.error_code || error2.code || "UNKNOWN_ERROR";
  const message = error2.message || "An error occurred";
  const details = error2.details || {};
  return createStandardError({
    error_code: errorCode,
    message,
    status,
    user_message: error2.user_message,
    details,
    recovery_hint: error2.recovery_hint,
    trace_id: error2.trace_id,
    request_id: error2.request_id || error2.correlation_id
  });
}
function isStandardError(obj) {
  return typeof obj === "object" && obj !== null && typeof obj.error_code === "string" && typeof obj.message === "string" && typeof obj.user_message === "string" && typeof obj.correlation_id === "string";
}
var ErrorSeverity, ErrorCategory, STATUS_TO_CATEGORY, STATUS_TO_SEVERITY, STATUS_TO_RETRYABLE;
var init_error_contract = __esm({
  "src/types/error-contract.ts"() {
    ErrorSeverity = /* @__PURE__ */ ((ErrorSeverity2) => {
      ErrorSeverity2["LOW"] = "low";
      ErrorSeverity2["MEDIUM"] = "medium";
      ErrorSeverity2["HIGH"] = "high";
      ErrorSeverity2["CRITICAL"] = "critical";
      return ErrorSeverity2;
    })(ErrorSeverity || {});
    ErrorCategory = /* @__PURE__ */ ((ErrorCategory2) => {
      ErrorCategory2["NETWORK"] = "network";
      ErrorCategory2["VALIDATION"] = "validation";
      ErrorCategory2["AUTHENTICATION"] = "authentication";
      ErrorCategory2["AUTHORIZATION"] = "authorization";
      ErrorCategory2["BUSINESS"] = "business";
      ErrorCategory2["SYSTEM"] = "system";
      ErrorCategory2["DATABASE"] = "database";
      ErrorCategory2["EXTERNAL_SERVICE"] = "external_service";
      ErrorCategory2["UNKNOWN"] = "unknown";
      return ErrorCategory2;
    })(ErrorCategory || {});
    STATUS_TO_CATEGORY = {
      400: "validation" /* VALIDATION */,
      401: "authentication" /* AUTHENTICATION */,
      403: "authorization" /* AUTHORIZATION */,
      404: "business" /* BUSINESS */,
      409: "business" /* BUSINESS */,
      422: "validation" /* VALIDATION */,
      429: "system" /* SYSTEM */,
      500: "system" /* SYSTEM */,
      502: "external_service" /* EXTERNAL_SERVICE */,
      503: "system" /* SYSTEM */,
      504: "network" /* NETWORK */
    };
    STATUS_TO_SEVERITY = {
      400: "low" /* LOW */,
      401: "high" /* HIGH */,
      403: "high" /* HIGH */,
      404: "low" /* LOW */,
      409: "medium" /* MEDIUM */,
      422: "low" /* LOW */,
      429: "medium" /* MEDIUM */,
      500: "critical" /* CRITICAL */,
      502: "high" /* HIGH */,
      503: "critical" /* CRITICAL */,
      504: "high" /* HIGH */
    };
    STATUS_TO_RETRYABLE = {
      400: false,
      401: false,
      403: false,
      404: false,
      409: false,
      422: false,
      429: true,
      // Rate limit - retry with backoff
      500: true,
      // Server error - may be transient
      502: true,
      // Bad gateway - retry
      503: true,
      // Service unavailable - retry
      504: true
      // Gateway timeout - retry
    };
  }
});

// src/api/types.ts
var PORTAL_ENDPOINTS = {
  admin: {
    login: "/api/admin/auth/login",
    logout: "/api/admin/auth/logout",
    refresh: "/api/admin/auth/refresh",
    validate: "/api/admin/auth/validate",
    csrf: "/api/admin/auth/csrf",
    users: "/api/admin/users",
    profile: "/api/admin/profile",
    settings: "/api/admin/settings",
    billing: {
      invoices: "/api/admin/billing/invoices",
      payments: "/api/admin/billing/payments",
      reports: "/api/admin/billing/reports",
      metrics: "/api/admin/billing/metrics"
    },
    analytics: {
      dashboard: "/api/admin/analytics/dashboard",
      reports: "/api/admin/analytics/reports",
      metrics: "/api/admin/analytics/metrics"
    },
    monitoring: {
      status: "/api/admin/monitoring/status",
      metrics: "/api/admin/monitoring/metrics",
      logs: "/api/admin/monitoring/logs"
    }
  },
  customer: {
    login: "/api/customer/auth/login",
    logout: "/api/customer/auth/logout",
    refresh: "/api/customer/auth/refresh",
    validate: "/api/customer/auth/validate",
    csrf: "/api/customer/auth/csrf",
    users: "/api/customer/users",
    profile: "/api/customer/profile",
    settings: "/api/customer/settings",
    billing: {
      invoices: "/api/customer/billing/invoices",
      payments: "/api/customer/billing/payments",
      reports: "/api/customer/billing/reports",
      metrics: "/api/customer/billing/metrics"
    }
  },
  reseller: {
    login: "/api/reseller/auth/login",
    logout: "/api/reseller/auth/logout",
    refresh: "/api/reseller/auth/refresh",
    validate: "/api/reseller/auth/validate",
    csrf: "/api/reseller/auth/csrf",
    users: "/api/reseller/users",
    profile: "/api/reseller/profile",
    settings: "/api/reseller/settings",
    billing: {
      invoices: "/api/reseller/billing/invoices",
      payments: "/api/reseller/billing/payments",
      reports: "/api/reseller/billing/reports",
      metrics: "/api/reseller/billing/metrics"
    },
    analytics: {
      dashboard: "/api/reseller/analytics/dashboard",
      reports: "/api/reseller/analytics/reports",
      metrics: "/api/reseller/analytics/metrics"
    }
  },
  technician: {
    login: "/api/technician/auth/login",
    logout: "/api/technician/auth/logout",
    refresh: "/api/technician/auth/refresh",
    validate: "/api/technician/auth/validate",
    csrf: "/api/technician/auth/csrf",
    users: "/api/technician/users",
    profile: "/api/technician/profile",
    settings: "/api/technician/settings"
  },
  management: {
    login: "/api/management/auth/login",
    logout: "/api/management/auth/logout",
    refresh: "/api/management/auth/refresh",
    validate: "/api/management/auth/validate",
    csrf: "/api/management/auth/csrf",
    users: "/api/management/users",
    profile: "/api/management/profile",
    settings: "/api/management/settings",
    billing: {
      invoices: "/api/management/billing/invoices",
      payments: "/api/management/billing/payments",
      reports: "/api/management/billing/reports",
      metrics: "/api/management/billing/metrics"
    },
    analytics: {
      dashboard: "/api/management/analytics/dashboard",
      reports: "/api/management/analytics/reports",
      metrics: "/api/management/analytics/metrics"
    },
    monitoring: {
      status: "/api/management/monitoring/status",
      metrics: "/api/management/monitoring/metrics",
      logs: "/api/management/monitoring/logs"
    }
  }
};

// src/api/cache.ts
var ApiCache = class {
  constructor(defaultTTL = 5 * 60 * 1e3, maxSize = 1e3) {
    this.cache = /* @__PURE__ */ new Map();
    this.cleanupInterval = null;
    this.defaultTTL = defaultTTL;
    this.maxSize = maxSize;
    this.startCleanup();
  }
  // Generate cache key
  generateKey(url, method = "GET", params) {
    const paramsStr = params ? JSON.stringify(params) : "";
    return `${method}:${url}:${btoa(paramsStr).slice(0, 16)}`;
  }
  // Check if entry is expired
  isExpired(entry) {
    return Date.now() > entry.timestamp + entry.ttl;
  }
  // Get cached response
  get(url, method, params) {
    const key = this.generateKey(url, method, params);
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }
  // Set cached response
  set(url, data, method, params, ttl) {
    if (data == null) return;
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    const key = this.generateKey(url, method, params);
    const entry = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      key
    };
    this.cache.set(key, entry);
  }
  // Check if response is cached and valid
  has(url, method, params) {
    const key = this.generateKey(url, method, params);
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
  // Invalidate specific cache entry
  invalidate(url, method, params) {
    const key = this.generateKey(url, method, params);
    this.cache.delete(key);
  }
  // Invalidate all entries matching pattern
  invalidatePattern(pattern) {
    let deleted = 0;
    const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
    for (const [key, entry] of this.cache.entries()) {
      if (regex.test(entry.key)) {
        this.cache.delete(key);
        deleted++;
      }
    }
    return deleted;
  }
  // Invalidate all entries for a specific endpoint
  invalidateEndpoint(endpoint) {
    return this.invalidatePattern(
      new RegExp(`GET:${endpoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`)
    );
  }
  // Clear all cache
  clear() {
    this.cache.clear();
  }
  // Get cache statistics
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.values()).map((entry) => ({
      key: entry.key,
      age: now - entry.timestamp,
      ttl: entry.ttl
    }));
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0,
      // Would need hit/miss tracking
      entries
    };
  }
  // Cleanup expired entries
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      console.debug(`API Cache: Cleaned ${cleaned} expired entries`);
    }
  }
  // Start automatic cleanup
  startCleanup() {
    if (this.cleanupInterval) return;
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1e3);
  }
  // Stop automatic cleanup
  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
  // Destroy cache
  destroy() {
    this.stopCleanup();
    this.clear();
  }
  // Get cache keys matching pattern
  getKeys(pattern) {
    if (!pattern) {
      return Array.from(this.cache.keys());
    }
    const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
    return Array.from(this.cache.entries()).filter(([, entry]) => regex.test(entry.key)).map(([key]) => key);
  }
  // Preload cache with data
  preload(entries) {
    entries.forEach(({ url, method, params, data, ttl }) => {
      this.set(url, data, method, params, ttl);
    });
  }
  // Export cache data for persistence
  export() {
    return Object.fromEntries(this.cache);
  }
  // Import cache data from persistence
  import(data) {
    const now = Date.now();
    Object.entries(data).forEach(([key, entry]) => {
      if (now <= entry.timestamp + entry.ttl) {
        this.cache.set(key, entry);
      }
    });
  }
};

// src/utils/rate-limiter.ts
var RedisRateLimitStorage = class {
  constructor(redisUrl = "redis://localhost:6379") {
    this.redis = null;
    this.redisUrl = redisUrl;
    this.initializeRedis();
  }
  async initializeRedis() {
    try {
      if (typeof window === "undefined") {
        console.log(`Redis rate limiter initialized: ${this.redisUrl}`);
      }
    } catch (error2) {
      console.error("Redis connection failed, falling back to memory storage:", error2);
    }
  }
  async get(key) {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(`rate_limit_${key}`);
        if (stored) {
          const data = JSON.parse(stored);
          if (data.resetTime > Date.now()) {
            return data;
          } else {
            localStorage.removeItem(`rate_limit_${key}`);
          }
        }
      }
      return null;
    } catch (error2) {
      console.error("Redis get error:", error2);
      return null;
    }
  }
  async set(key, value, ttl) {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(`rate_limit_${key}`, JSON.stringify(value));
      }
    } catch (error2) {
      console.error("Redis set error:", error2);
    }
  }
  async increment(key, ttl) {
    try {
      const now = Date.now();
      const resetTime = now + ttl;
      const existing = await this.get(key);
      if (existing && existing.resetTime > now) {
        const newValue = {
          count: existing.count + 1,
          resetTime: existing.resetTime
        };
        await this.set(key, newValue, existing.resetTime - now);
        return newValue;
      } else {
        const newValue = {
          count: 1,
          resetTime
        };
        await this.set(key, newValue, ttl);
        return newValue;
      }
    } catch (error2) {
      console.error("Redis increment error:", error2);
      return { count: 1, resetTime: Date.now() + ttl };
    }
  }
  async delete(key) {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(`rate_limit_${key}`);
      }
    } catch (error2) {
      console.error("Redis delete error:", error2);
    }
  }
};
var MemoryRateLimitStorage = class {
  constructor() {
    this.store = /* @__PURE__ */ new Map();
  }
  async get(key) {
    const value = this.store.get(key);
    if (value && value.resetTime > Date.now()) {
      return value;
    } else if (value) {
      this.store.delete(key);
    }
    return null;
  }
  async set(key, value) {
    this.store.set(key, value);
  }
  async increment(key, ttl) {
    const now = Date.now();
    const existing = await this.get(key);
    if (existing && existing.resetTime > now) {
      const newValue = {
        count: existing.count + 1,
        resetTime: existing.resetTime
      };
      this.store.set(key, newValue);
      return newValue;
    } else {
      const newValue = {
        count: 1,
        resetTime: now + ttl
      };
      this.store.set(key, newValue);
      return newValue;
    }
  }
  async delete(key) {
    this.store.delete(key);
  }
};
var RateLimiter = class {
  constructor(options, storage) {
    this.options = {
      keyPrefix: "rl",
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...options
    };
    this.storage = storage || (process.env["NODE_ENV"] === "production" && process.env["REDIS_URL"] ? new RedisRateLimitStorage(process.env["REDIS_URL"]) : new MemoryRateLimitStorage());
  }
  /**
   * Check if request is allowed under rate limit
   */
  async checkLimit(identifier) {
    const key = `${this.options.keyPrefix}:${identifier}`;
    try {
      const result = await this.storage.increment(key, this.options.windowMs);
      const allowed = result.count <= this.options.maxRequests;
      const remainingRequests = Math.max(0, this.options.maxRequests - result.count);
      return {
        allowed,
        remainingRequests,
        resetTime: result.resetTime,
        totalHits: result.count
      };
    } catch (error2) {
      console.error("Rate limit check error:", error2);
      return {
        allowed: true,
        remainingRequests: this.options.maxRequests - 1,
        resetTime: Date.now() + this.options.windowMs,
        totalHits: 1
      };
    }
  }
  /**
   * Reset rate limit for identifier
   */
  async resetLimit(identifier) {
    const key = `${this.options.keyPrefix}:${identifier}`;
    await this.storage.delete(key);
  }
  /**
   * Get current rate limit status without incrementing
   */
  async getLimitStatus(identifier) {
    const key = `${this.options.keyPrefix}:${identifier}`;
    try {
      const result = await this.storage.get(key);
      if (!result) {
        return {
          allowed: true,
          remainingRequests: this.options.maxRequests,
          resetTime: Date.now() + this.options.windowMs,
          totalHits: 0
        };
      }
      const allowed = result.count <= this.options.maxRequests;
      const remainingRequests = Math.max(0, this.options.maxRequests - result.count);
      return {
        allowed,
        remainingRequests,
        resetTime: result.resetTime,
        totalHits: result.count
      };
    } catch (error2) {
      console.error("Rate limit status error:", error2);
      return null;
    }
  }
};
var rateLimiters = {
  // Authentication attempts: 5 per 15 minutes
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1e3,
    maxRequests: 5,
    keyPrefix: "auth"
  }),
  // API requests: 100 per minute
  api: new RateLimiter({
    windowMs: 60 * 1e3,
    maxRequests: 100,
    keyPrefix: "api"
  }),
  // General requests: 1000 per hour
  general: new RateLimiter({
    windowMs: 60 * 60 * 1e3,
    maxRequests: 1e3,
    keyPrefix: "general"
  }),
  // Password reset: 3 per hour
  passwordReset: new RateLimiter({
    windowMs: 60 * 60 * 1e3,
    maxRequests: 3,
    keyPrefix: "pwd_reset"
  }),
  // Account registration: 5 per hour
  registration: new RateLimiter({
    windowMs: 60 * 60 * 1e3,
    maxRequests: 5,
    keyPrefix: "register"
  })
};
function createRateLimitMiddleware(limiter, options = {}) {
  const { keyGenerator = (req) => req.ip || "unknown", onLimitReached } = options;
  return async function rateLimitMiddleware(req, res, next) {
    try {
      const key = keyGenerator(req);
      const result = await limiter.checkLimit(key);
      if (res.setHeader) {
        res.setHeader("X-RateLimit-Limit", limiter.options.maxRequests);
        res.setHeader("X-RateLimit-Remaining", result.remainingRequests);
        res.setHeader("X-RateLimit-Reset", new Date(result.resetTime).toISOString());
      }
      if (!result.allowed) {
        if (onLimitReached) {
          onLimitReached(req, res);
        } else if (res.status && res.json) {
          res.status(429).json({
            error: "Too many requests",
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1e3)
          });
        }
        return;
      }
      if (next) next();
    } catch (error2) {
      console.error("Rate limit middleware error:", error2);
      if (next) next();
    }
  };
}
function getClientIdentifier(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const realIp = req.headers["x-real-ip"];
  const remoteAddr = req.connection?.remoteAddress || req.socket?.remoteAddress;
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  return remoteAddr || "unknown";
}
function calculateRetryAfter(resetTime) {
  return Math.ceil((resetTime - Date.now()) / 1e3);
}
var rateLimiter = rateLimiters.general;
var SecureStorage = class {
  constructor() {
    this.prefix = "__dotmac_";
    this.ENCRYPTION_KEY = "__dotmac_encryption_key__";
    this.encryptionKey = null;
    if (typeof window !== "undefined" && this.isCryptoSupported()) {
      this.initializeEncryption();
    }
  }
  /**
   * Check if browser supports SubtleCrypto for AES-GCM
   * Safari < 13 and some older browsers lack support
   */
  isCryptoSupported() {
    try {
      return !!(window.crypto && window.crypto.subtle && typeof window.crypto.subtle.generateKey === "function" && typeof window.crypto.subtle.encrypt === "function" && typeof window.crypto.subtle.decrypt === "function");
    } catch {
      return false;
    }
  }
  /**
   * Initialize encryption key for the session
   */
  async initializeEncryption() {
    if (typeof window === "undefined" || !window.crypto?.subtle) {
      return;
    }
    try {
      const existingKey = sessionStorage.getItem(this.ENCRYPTION_KEY);
      if (existingKey) {
        const keyData = JSON.parse(existingKey);
        this.encryptionKey = await window.crypto.subtle.importKey(
          "jwk",
          keyData,
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt", "decrypt"]
        );
      } else {
        this.encryptionKey = await window.crypto.subtle.generateKey(
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt", "decrypt"]
        );
        const exportedKey = await window.crypto.subtle.exportKey("jwk", this.encryptionKey);
        sessionStorage.setItem(this.ENCRYPTION_KEY, JSON.stringify(exportedKey));
      }
    } catch (error2) {
      console.warn("Encryption initialization failed:", error2);
      this.encryptionKey = null;
    }
  }
  /**
   * Encrypt a value using AES-GCM
   * Falls back to base64 encoding if crypto not supported
   */
  async encrypt(value) {
    if (!this.encryptionKey || typeof window === "undefined" || !this.isCryptoSupported()) {
      if (typeof window !== "undefined") {
        console.warn("Crypto API not supported, falling back to base64 encoding");
        return btoa(value);
      }
      return value;
    }
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(value);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        this.encryptionKey,
        data
      );
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encrypted), iv.length);
      return btoa(String.fromCharCode(...combined));
    } catch (error2) {
      console.warn("Encryption failed:", error2);
      return value;
    }
  }
  /**
   * Decrypt a value using AES-GCM
   * Handles base64 fallback for older browsers
   */
  async decrypt(encryptedValue) {
    if (!this.encryptionKey || typeof window === "undefined" || !this.isCryptoSupported()) {
      if (typeof window !== "undefined") {
        try {
          return atob(encryptedValue);
        } catch {
          return encryptedValue;
        }
      }
      return encryptedValue;
    }
    try {
      const combined = Uint8Array.from(atob(encryptedValue), (c) => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        this.encryptionKey,
        encrypted
      );
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error2) {
      console.warn("Decryption failed:", error2);
      return encryptedValue;
    }
  }
  /**
   * Set data in storage (NEVER use for auth tokens!)
   */
  async setItem(key, value, options = {}) {
    if (key.toLowerCase().includes("token") || key.toLowerCase().includes("password") || key.toLowerCase().includes("secret") || key.toLowerCase().includes("auth")) {
      console.error(
        "Security Error: Sensitive data should not be stored in client storage. Use server-side httpOnly cookies."
      );
      throw new Error("Attempted to store sensitive data in insecure storage");
    }
    if (typeof window === "undefined") {
      return;
    }
    const { encrypt = false, ttl } = options;
    const fullKey = this.prefix + key;
    const serialized = JSON.stringify(value);
    const finalValue = encrypt ? await this.encrypt(serialized) : serialized;
    const item = {
      value: finalValue,
      timestamp: Date.now(),
      encrypted: encrypt
    };
    if (ttl) {
      item.expires = Date.now() + ttl;
    }
    try {
      sessionStorage.setItem(fullKey, JSON.stringify(item));
    } catch (error2) {
      console.error("Storage error:", error2);
    }
  }
  /**
   * Get data from storage
   */
  async getItem(key) {
    if (typeof window === "undefined") {
      return null;
    }
    const fullKey = this.prefix + key;
    try {
      const stored = sessionStorage.getItem(fullKey);
      if (!stored) return null;
      const item = JSON.parse(stored);
      if (item.expires && Date.now() > item.expires) {
        this.removeItem(key);
        return null;
      }
      const value = item.encrypted ? await this.decrypt(item.value) : item.value;
      return JSON.parse(value);
    } catch (error2) {
      console.error("Storage retrieval error:", error2);
      return null;
    }
  }
  /**
   * Remove data from storage
   */
  removeItem(key) {
    if (typeof window === "undefined") {
      return;
    }
    const fullKey = this.prefix + key;
    try {
      sessionStorage.removeItem(fullKey);
    } catch (error2) {
      console.error("Storage removal error:", error2);
    }
  }
  /**
   * Clear all storage data with our prefix
   */
  clear() {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const keys = Object.keys(sessionStorage).filter((k) => k.startsWith(this.prefix));
      keys.forEach((key) => sessionStorage.removeItem(key));
    } catch (error2) {
      console.error("Storage clear error:", error2);
    }
  }
  /**
   * Check if storage is available
   */
  isStorageAvailable() {
    if (typeof window === "undefined") {
      return false;
    }
    try {
      const test = "__storage_test__";
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Get storage usage info
   */
  getStorageInfo() {
    if (typeof window === "undefined") {
      return { used: 0, keys: [] };
    }
    try {
      const keys = Object.keys(sessionStorage).filter((k) => k.startsWith(this.prefix));
      const used = keys.reduce((total, key) => {
        const value = sessionStorage.getItem(key) || "";
        return total + value.length + key.length;
      }, 0);
      return { used, keys: keys.map((k) => k.replace(this.prefix, "")) };
    } catch {
      return { used: 0, keys: [] };
    }
  }
};
var secureStorage = new SecureStorage();

// src/utils/tokenManager.ts
var SecureTokenManager = class {
  constructor() {
    // Valid token signing algorithms (whitelist)
    this.VALID_ALGORITHMS = ["RS256", "ES256", "HS256"];
  }
  /**
   * SECURITY ERROR: Client-side token storage is forbidden
   * Tokens must be stored in httpOnly cookies by server actions only
   */
  setTokens(_tokenPair, _csrfToken) {
    throw new Error(
      "SECURITY VIOLATION: Client-side token storage is forbidden. Tokens must be set via server actions using httpOnly cookies."
    );
  }
  /**
   * SECURITY: Client cannot access tokens directly
   * Use server actions for token operations
   */
  getAccessToken() {
    throw new Error(
      "SECURITY: Tokens are in httpOnly cookies and not accessible to client-side JavaScript. Use server actions to perform authenticated requests."
    );
  }
  /**
   * SECURITY: Client cannot access tokens directly
   * Use server actions for token operations
   */
  getRefreshToken() {
    throw new Error(
      "SECURITY: Refresh tokens are in httpOnly cookies and not accessible to client-side JavaScript. Use server actions to refresh tokens."
    );
  }
  /**
   * SECURITY: Client cannot access tokens directly
   * Use server actions for token operations
   */
  getCSRFToken() {
    throw new Error(
      "SECURITY: CSRF tokens are in httpOnly cookies and not accessible to client-side JavaScript. Use server actions to get CSRF tokens."
    );
  }
  /**
   * SECURITY: Client cannot clear tokens directly
   * Use server actions for logout
   */
  clearTokens() {
    throw new Error(
      "SECURITY: Use server actions to clear tokens (logout). Client-side JavaScript cannot access httpOnly cookies."
    );
  }
  /**
   * Decode JWT payload (without verification - for client-side use only)
   */
  decodeTokenPayload(token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return null;
      }
      const payload = parts[1];
      if (!payload) {
        return null;
      }
      const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(decoded);
    } catch (_error) {
      return null;
    }
  }
  /**
   * Validate token format and basic security checks
   */
  validateTokenFormat(token) {
    try {
      if (!TokenManager.TokenValidationHelpers.validateTokenParts(token)) {
        return false;
      }
      const header = TokenManager.TokenValidationHelpers.decodeTokenHeader(token);
      if (!header || !TokenManager.TokenValidationHelpers.validateAlgorithm(header.alg, this.VALID_ALGORITHMS)) {
        return false;
      }
      const payload = this.decodeTokenPayload(token);
      if (!payload) {
        return false;
      }
      return TokenManager.TokenValidationHelpers.validateRequiredFields(payload) && TokenManager.TokenValidationHelpers.validateIssuer(payload.iss) && TokenManager.TokenValidationHelpers.validateAudience(payload.aud);
    } catch (_error) {
      return false;
    }
  }
  /**
   * Check if provided token is expired
   * @param token - JWT token to check
   */
  isTokenExpired(token) {
    try {
      if (!token) {
        return true;
      }
      const payload = this.decodeTokenPayload(token);
      if (!payload) {
        return true;
      }
      const now = Math.floor(Date.now() / 1e3);
      return payload.exp <= now;
    } catch (_error) {
      return true;
    }
  }
  /**
   * SECURITY: Token refresh must be handled by server actions
   */
  async refreshTokens(_apiRefreshFunction) {
    throw new Error(
      "SECURITY: Token refresh must be handled by server actions. Use refreshTokenAction() from server actions instead."
    );
  }
  /**
   * Get safe token info for provided token (debugging/display only)
   * @param token - JWT token to analyze
   */
  getTokenInfo(token) {
    if (!token) {
      return {
        isValid: false,
        isExpired: true,
        payload: null
      };
    }
    const isValid = this.validateTokenFormat(token);
    const isExpired = this.isTokenExpired(token);
    let payload = null;
    if (isValid) {
      const fullPayload = this.decodeTokenPayload(token);
      if (fullPayload) {
        payload = {
          portal: fullPayload.portal,
          tenant: fullPayload.tenant,
          roles: fullPayload.roles,
          exp: fullPayload.exp,
          iat: fullPayload.iat
        };
      }
    }
    return {
      isValid,
      isExpired,
      payload
    };
  }
  /**
   * Stub for auto-refresh setup - in production, this would be handled by server actions
   */
  setupAutoRefresh(_refreshFn, _onAuthFailure) {
    return () => {
    };
  }
};
// Token validation composition helpers
SecureTokenManager.TokenValidationHelpers = {
  validateTokenParts: (token) => {
    const parts = token.split(".");
    return parts.length === 3;
  },
  decodeTokenHeader: (token) => {
    try {
      const parts = token.split(".");
      const header = parts[0];
      if (!header) {
        return null;
      }
      const headerB64 = header.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(headerB64));
    } catch {
      return null;
    }
  },
  validateAlgorithm: (algorithm, validAlgorithms) => {
    if (!validAlgorithms.includes(algorithm)) {
      return false;
    }
    return true;
  },
  validateRequiredFields: (payload) => {
    const requiredFields = ["sub", "iat", "exp", "aud", "iss"];
    const hasAllFields = requiredFields.every((field) => payload[field]);
    if (!hasAllFields) {
      return false;
    }
    return true;
  },
  validateIssuer: (issuer) => {
    const expectedIssuer = process.env["NEXT_PUBLIC_JWT_ISSUER"] || "dotmac-platform";
    if (issuer !== expectedIssuer) {
      return false;
    }
    return true;
  },
  validateAudience: (audience) => {
    const expectedAudience = process.env["NEXT_PUBLIC_JWT_AUDIENCE"] || "dotmac-frontend";
    if (audience !== expectedAudience) {
      return false;
    }
    return true;
  }
};
var tokenManager = new SecureTokenManager();

// src/utils/csrfProtection.ts
var CSRFProtection = class {
  constructor() {
    this.config = {
      headerName: "X-CSRF-Token",
      tokenName: "csrf_token",
      cookieName: "__dotmac_csrf",
      enabledMethods: ["POST", "PUT", "PATCH", "DELETE"]
    };
  }
  /**
   * Generate a cryptographically secure CSRF token
   */
  generateToken() {
    try {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return btoa(String.fromCharCode(...array)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    } catch (_error) {
      return this.generateFallbackToken();
    }
  }
  /**
   * Fallback token generation for older browsers
   */
  generateFallbackToken() {
    let token = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    for (let i = 0; i < 43; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
  /**
   * Store CSRF token securely
   */
  storeToken(token) {
    try {
      secureStorage.setItem(this.config.tokenName, token, {
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60
        // 1 hour
      });
    } catch (_error) {
    }
  }
  /**
   * Get current CSRF token
   */
  getToken() {
    try {
      let token = tokenManager.getCSRFToken();
      if (!token) {
        token = secureStorage.getItem(this.config.tokenName);
      }
      return token;
    } catch (_error) {
      return null;
    }
  }
  /**
   * Initialize CSRF protection for the session
   */
  async initialize() {
    try {
      let token = this.getToken();
      if (!token || !this.validateTokenFormat(token)) {
        token = this.generateToken();
        this.storeToken(token);
      }
      return token;
    } catch (_error) {
      throw new Error("CSRF initialization failed");
    }
  }
  /**
   * Validate CSRF token format
   */
  validateTokenFormat(token) {
    const base64urlRegex = /^[A-Za-z0-9\-_]+$/;
    return base64urlRegex.test(token) && token.length >= 32;
  }
  /**
   * Clear CSRF token
   */
  clearToken() {
    try {
      secureStorage.removeItem(this.config.tokenName);
    } catch (_error) {
    }
  }
  /**
   * Check if method requires CSRF protection
   */
  requiresProtection(method) {
    return this.config.enabledMethods.includes(method.toUpperCase());
  }
  /**
   * Get CSRF headers for API requests
   */
  getHeaders() {
    const token = this.getToken();
    if (!token) {
      return {
        // Implementation pending
      };
    }
    return {
      [this.config.headerName]: token
    };
  }
  /**
   * Validate CSRF token against expected value
   * Note: This is primarily for client-side validation.
   * Server-side validation is still required for security.
   */
  validateToken(providedToken) {
    try {
      const storedToken = this.getToken();
      if (!storedToken || !providedToken) {
        return false;
      }
      return this.constantTimeEqual(storedToken, providedToken);
    } catch (_error) {
      return false;
    }
  }
  /**
   * Constant-time string comparison to prevent timing attacks
   */
  constantTimeEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
  /**
   * Rotate CSRF token (generate new one)
   */
  rotateToken() {
    try {
      this.clearToken();
      const newToken = this.generateToken();
      this.storeToken(newToken);
      return newToken;
    } catch (_error) {
      throw new Error("CSRF token rotation failed");
    }
  }
  /**
   * Get CSRF configuration
   */
  getConfig() {
    return { ...this.config };
  }
  /**
   * Update CSRF configuration
   */
  updateConfig(updates) {
    Object.assign(this.config, updates);
  }
  /**
   * Check if CSRF protection is properly configured
   */
  isConfigured() {
    return !!(this.config.headerName && this.config.tokenName && this.config.enabledMethods.length > 0);
  }
  /**
   * Get debug information about CSRF protection
   */
  getDebugInfo() {
    const token = this.getToken();
    return {
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      isConfigured: this.isConfigured(),
      protectedMethods: this.config.enabledMethods
    };
  }
};
var csrfProtection = new CSRFProtection();
function useCSRFProtection() {
  return {
    getToken: () => csrfProtection.getToken(),
    getHeaders: () => csrfProtection.getHeaders(),
    initialize: () => csrfProtection.initialize(),
    rotateToken: () => csrfProtection.rotateToken(),
    requiresProtection: (method) => csrfProtection.requiresProtection(method)
  };
}

// src/utils/sanitization.ts
var InputSanitizer = class {
  constructor() {
    // Default allowed HTML tags for rich text content
    this.DEFAULT_ALLOWED_TAGS = [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "pre",
      "code"
    ];
    // Default allowed attributes
    this.DEFAULT_ALLOWED_ATTRIBUTES = {
      a: ["href", "title"],
      img: ["src", "alt", "title", "width", "height"],
      "*": ["class"]
      // Allow class on all elements
    };
    // Dangerous patterns that should always be removed
    this.DANGEROUS_PATTERNS = [
      /<script\b[^<]*(?:(?!<\/script>)[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)[^<]*)*<\/embed>/gi,
      /<form\b[^<]*(?:(?!<\/form>)[^<]*)*<\/form>/gi,
      /javascript:/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi
      // Event handlers like onclick, onload, etc.
    ];
    // URL validation regex
    this.URL_REGEX = /^https?:\/\/(?:[-\w.])+(?::[0-9]+)?(?:\/(?:[\w/_.])*(?:\?(?:[\w&%=.]*))?(?:#(?:\w*))?)?$/;
  }
  /**
   * Sanitize HTML content to prevent XSS
   */
  sanitizeHTML(input, options = {
    // Implementation pending
  }) {
    if (!input || typeof input !== "string") {
      return "";
    }
    const {
      allowedTags = this.DEFAULT_ALLOWED_TAGS,
      allowedAttributes = this.DEFAULT_ALLOWED_ATTRIBUTES,
      stripAll = false,
      maxLength
    } = options;
    let sanitized = input;
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }
    for (const pattern of this.DANGEROUS_PATTERNS) {
      sanitized = sanitized.replace(pattern, "");
    }
    if (stripAll) {
      return this.stripAllTags(sanitized);
    }
    sanitized = this.cleanAllowedTags(sanitized, allowedTags, allowedAttributes);
    return sanitized.trim();
  }
  /**
   * Sanitize plain text input
   */
  sanitizeText(input, maxLength) {
    if (!input || typeof input !== "string") {
      return "";
    }
    let sanitized = input;
    sanitized = this.stripAllTags(sanitized);
    sanitized = this.decodeHTMLEntities(sanitized);
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }
    return sanitized.trim();
  }
  /**
   * Sanitize URL to prevent XSS and ensure it's safe
   */
  sanitizeURL(url) {
    if (!url || typeof url !== "string") {
      return null;
    }
    const cleaned = url.trim().replace(/[\x00-\x1F\x7F]/g, "");
    if (cleaned.match(/^(javascript|data|vbscript):/i)) {
      return null;
    }
    if (!this.URL_REGEX.test(cleaned)) {
      if (cleaned.startsWith("/") && !cleaned.includes("..")) {
        return cleaned;
      }
      return null;
    }
    return cleaned;
  }
  /**
   * Sanitize email address
   */
  sanitizeEmail(email) {
    if (!email || typeof email !== "string") {
      return null;
    }
    const cleaned = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleaned)) {
      return null;
    }
    return cleaned;
  }
  /**
   * Sanitize phone number
   */
  sanitizePhone(phone) {
    if (!phone || typeof phone !== "string") {
      return null;
    }
    const cleaned = phone.replace(/[^\d+]/g, "");
    if (cleaned.length < 10 || cleaned.length > 15) {
      return null;
    }
    return cleaned;
  }
  /**
   * Sanitize SQL input to prevent injection (basic protection)
   */
  sanitizeSQLInput(input) {
    if (!input || typeof input !== "string") {
      return "";
    }
    const sqlPatterns = [
      /('|('')|;|--|\||\*|%|<|>|=|\\)/gi,
      /(union|select|insert|update|delete|drop|create|alter|exec|execute)/gi
    ];
    let sanitized = input;
    for (const pattern of sqlPatterns) {
      sanitized = sanitized.replace(pattern, "");
    }
    return sanitized.trim();
  }
  /**
   * Strip all HTML tags
   */
  stripAllTags(html) {
    return html.replace(/<[^>]*>/g, "");
  }
  /**
   * Clean and validate allowed HTML tags
   */
  cleanAllowedTags(html, allowedTags, allowedAttributes) {
    const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
    return html.replace(tagPattern, (match, tagName) => {
      const tag = tagName.toLowerCase();
      if (!allowedTags.includes(tag)) {
        return "";
      }
      return this.cleanAttributes(match, tag, allowedAttributes);
    });
  }
  /**
   * Clean HTML attributes
   */
  cleanAttributes(tagHTML, tagName, allowedAttributes) {
    const allowedForTag = allowedAttributes[tagName] || [];
    const allowedForAll = allowedAttributes["*"] || [];
    const allAllowed = [...allowedForTag, ...allowedForAll];
    if (allAllowed.length === 0) {
      return tagHTML.replace(/\s+[^>]*/, "");
    }
    return tagHTML.replace(/\s+(\w+)=["'][^"']*["']/g, (match, attrName) => {
      if (allAllowed.includes(attrName.toLowerCase())) {
        return match;
      }
      return "";
    });
  }
  /**
   * Decode HTML entities
   */
  decodeHTMLEntities(text) {
    const entityMap = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#x27;": "'",
      "&#x2F;": "/",
      "&#x60;": "`",
      "&#x3D;": "="
    };
    return text.replace(/&[#\w]+;/g, (entity) => {
      return entityMap[entity] || entity;
    });
  }
  /**
   * Escape HTML to prevent XSS
   */
  escapeHTML(text) {
    if (!text || typeof text !== "string") {
      return "";
    }
    const entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;"
    };
    return text.replace(/[&<>"'`=/]/g, (char) => {
      return entityMap[char] || char;
    });
  }
  /**
   * Validate and sanitize JSON input
   */
  sanitizeJSON(input) {
    try {
      if (!input || typeof input !== "string") {
        return null;
      }
      let cleaned = input;
      for (const pattern of this.DANGEROUS_PATTERNS) {
        cleaned = cleaned.replace(pattern, "");
      }
      return JSON.parse(cleaned);
    } catch (_error) {
      return null;
    }
  }
  /**
   * Comprehensive input sanitization for form data
   */
  sanitizeFormData(data) {
    const sanitized = {
      // Implementation pending
    };
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        if (key.toLowerCase().includes("email")) {
          sanitized[key] = this.sanitizeEmail(value);
        } else if (key.toLowerCase().includes("phone")) {
          sanitized[key] = this.sanitizePhone(value);
        } else if (key.toLowerCase().includes("url") || key.toLowerCase().includes("link")) {
          sanitized[key] = this.sanitizeURL(value);
        } else if (key.toLowerCase().includes("html") || key.toLowerCase().includes("content")) {
          sanitized[key] = this.sanitizeHTML(value);
        } else {
          sanitized[key] = this.sanitizeText(value, 1e3);
        }
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(
          (item) => typeof item === "string" ? this.sanitizeText(item, 1e3) : item
        );
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
};
var inputSanitizer = new InputSanitizer();
var sanitizeHTML = (input, options) => inputSanitizer.sanitizeHTML(input, options);
var sanitizeText = (input, maxLength) => inputSanitizer.sanitizeText(input, maxLength);
var sanitizeURL = (url) => inputSanitizer.sanitizeURL(url);
var sanitizeEmail = (email) => inputSanitizer.sanitizeEmail(email);
var escapeHTML = (text) => inputSanitizer.escapeHTML(text);

// src/utils/errorUtils.ts
var ISPError = class extends Error {
  constructor(params) {
    super(params.message);
    this.name = "ISPError";
    this.id = params.id || generateErrorId();
    this.category = params.category || "unknown";
    this.severity = params.severity || "medium";
    this.context = params.context;
    this.timestamp = params.timestamp || /* @__PURE__ */ new Date();
    this.retryable = params.retryable ?? false;
    this.userMessage = params.userMessage || this.generateUserMessage();
    this.status = params.status;
    this.code = params.code;
    this.technicalDetails = params.technicalDetails;
    this.correlationId = params.correlationId || generateCorrelationId();
  }
  generateUserMessage() {
    switch (this.category) {
      case "network":
        return "Connection problem. Please check your internet and try again.";
      case "authentication":
        return "Please log in again to continue.";
      case "authorization":
        return "You don't have permission to perform this action.";
      case "validation":
        return "Please check your input and try again.";
      case "business":
        return "Unable to complete this action. Please try again later.";
      case "system":
        return "System temporarily unavailable. Please try again in a few minutes.";
      default:
        return "Something went wrong. Please try again.";
    }
  }
  toJSON() {
    return {
      id: this.id,
      message: this.message,
      code: this.code,
      status: this.status,
      category: this.category,
      severity: this.severity,
      context: this.context,
      timestamp: this.timestamp,
      retryable: this.retryable,
      userMessage: this.userMessage,
      technicalDetails: this.technicalDetails,
      correlationId: this.correlationId
    };
  }
};
function classifyError(error2, context) {
  if (error2 instanceof ISPError) {
    return error2;
  }
  if (error2 instanceof TypeError && error2.message.includes("fetch")) {
    return new ISPError({
      message: error2.message,
      category: "network",
      severity: "medium",
      context,
      retryable: true,
      userMessage: "Network connection failed. Please check your internet connection."
    });
  }
  if (error2 && typeof error2 === "object" && "status" in error2) {
    const status = error2.status;
    if (status === 401) {
      return new ISPError({
        message: "Authentication failed",
        status,
        category: "authentication",
        severity: "high",
        context,
        retryable: false,
        userMessage: "Please log in again to continue."
      });
    }
    if (status === 403) {
      return new ISPError({
        message: "Access denied",
        status,
        category: "authorization",
        severity: "high",
        context,
        retryable: false,
        userMessage: "You don't have permission to perform this action."
      });
    }
    if (status === 422) {
      return new ISPError({
        message: "Validation failed",
        status,
        category: "validation",
        severity: "low",
        context,
        retryable: false,
        userMessage: "Please check your input and try again."
      });
    }
    if (status >= 500) {
      return new ISPError({
        message: "Server error",
        status,
        category: "system",
        severity: "critical",
        context,
        retryable: true,
        userMessage: "System temporarily unavailable. Please try again in a few minutes."
      });
    }
    if (status === 429) {
      return new ISPError({
        message: "Rate limit exceeded",
        status,
        category: "system",
        severity: "medium",
        context,
        retryable: true,
        userMessage: "Too many requests. Please wait a moment before trying again."
      });
    }
  }
  if (error2 && typeof error2 === "object" && "name" in error2 && error2.name === "AbortError") {
    return new ISPError({
      message: "Request timeout",
      category: "network",
      severity: "medium",
      context,
      retryable: true,
      userMessage: "Request timed out. Please try again."
    });
  }
  if (error2 instanceof Error) {
    return new ISPError({
      message: error2.message,
      category: "unknown",
      severity: "medium",
      context,
      retryable: false,
      technicalDetails: { originalError: error2.name, stack: error2.stack }
    });
  }
  return new ISPError({
    message: "An unknown error occurred",
    category: "unknown",
    severity: "medium",
    context,
    retryable: false,
    technicalDetails: { originalError: String(error2) }
  });
}
function isRetryableError(error2) {
  return error2.retryable;
}
function calculateRetryDelay(attempt, baseDelay = 1e3, maxDelay = 3e4) {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  const jitter = delay * 0.1 * Math.random();
  return Math.floor(delay + jitter);
}
function shouldRetry(error2, attempt, maxRetries) {
  return attempt < maxRetries && isRetryableError(error2);
}
var errorLogger = null;
function setErrorLogger(logger) {
  errorLogger = logger;
}
function logError(error2, additionalContext) {
  if (!errorLogger) return;
  const logEntry = {
    error: error2.toJSON(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
    url: typeof window !== "undefined" ? window.location.href : "Unknown",
    ...additionalContext
  };
  errorLogger(logEntry);
}
var errorCache = /* @__PURE__ */ new Map();
function deduplicateError(error2, timeWindow = 6e4) {
  const key = `${error2.message}-${error2.context}-${error2.status}`;
  const now = /* @__PURE__ */ new Date();
  const cached = errorCache.get(key);
  if (cached && now.getTime() - cached.lastSeen.getTime() < timeWindow) {
    cached.count += 1;
    cached.lastSeen = now;
    return false;
  }
  errorCache.set(key, { count: 1, lastSeen: now });
  return true;
}
function generateErrorId() {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function generateCorrelationId() {
  return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
var ErrorFactory = {
  network: (message, context) => new ISPError({
    message,
    category: "network",
    severity: "medium",
    context,
    retryable: true
  }),
  validation: (message, context, details) => new ISPError({
    message,
    category: "validation",
    severity: "low",
    context,
    retryable: false,
    technicalDetails: details
  }),
  authentication: (context) => new ISPError({
    message: "Authentication required",
    category: "authentication",
    severity: "high",
    context,
    retryable: false
  }),
  authorization: (resource, context) => new ISPError({
    message: `Access denied to ${resource}`,
    category: "authorization",
    severity: "high",
    context,
    retryable: false,
    userMessage: `You don't have permission to access ${resource}.`
  }),
  business: (message, context, severity = "medium") => new ISPError({
    message,
    category: "business",
    severity,
    context,
    retryable: false
  }),
  system: (message, context, severity = "critical") => new ISPError({
    message,
    category: "system",
    severity,
    context,
    retryable: true
  })
};
var DEFAULT_ERROR_CONFIG = {
  enableLogging: true,
  enableTelemetry: true,
  enableUserNotifications: true,
  maxRetries: 3,
  retryDelayMs: 1e3,
  fallbackEnabled: true
};
var configureGlobalErrorHandling = (config = {}) => {
  if (config.logger) {
    setErrorLogger(config.logger);
  }
  if (config.enableConsoleLogging) {
    if (process.env["NODE_ENV"] === "development") {
      console.warn("Global error handling configured for development");
    }
  }
};

// src/api/client.ts
var DEFAULT_CONFIG = {
  baseUrl: "/api",
  apiKey: "",
  defaultHeaders: {
    "Content-Type": "application/json"
  },
  timeout: 3e4,
  retries: 3,
  rateLimiting: true,
  caching: true,
  defaultCacheTTL: 5 * 60 * 1e3,
  // 5 minutes
  csrf: true,
  auth: {
    tokenHeader: "Authorization",
    refreshEndpoint: "/auth/refresh",
    autoRefresh: true
  },
  metadata: {},
  onUnauthorized: () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
  onError: (error2) => {
    new ISPError({
      code: "API_CLIENT_ERROR",
      message: error2.message || "Unknown API client error",
      category: "system",
      severity: "medium",
      technicalDetails: { originalError: error2 }
    });
  }
};
var AUTH_REQUIRED_ERROR = "Unauthorized - authentication required";
var ApiClient = class {
  constructor(config = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    };
    if (this.config.caching) {
      this.cache = new ApiCache(this.config.defaultCacheTTL);
    }
    if (this.config.rateLimiting) {
      this.rateLimiter = new RateLimiter({
        windowMs: 6e4,
        maxRequests: 60,
        keyPrefix: "api-client"
      });
    }
    this.endpoints = this.getPortalEndpoints();
  }
  // Get endpoints for current portal
  getPortalEndpoints() {
    if (this.config.portal && this.config.portal in PORTAL_ENDPOINTS) {
      return PORTAL_ENDPOINTS[this.config.portal];
    }
    return {
      login: "/api/auth/login",
      logout: "/api/auth/logout",
      refresh: "/api/auth/refresh",
      validate: "/api/auth/validate",
      csrf: "/api/auth/csrf",
      users: "/api/users",
      profile: "/api/profile",
      settings: "/api/settings"
    };
  }
  setAuthToken() {
  }
  clearAuthToken() {
    tokenManager.clearTokens();
  }
  sanitizeBody(body) {
    if (!body) {
      return null;
    }
    if (typeof body === "string") {
      try {
        const parsed = JSON.parse(body);
        const sanitized = inputSanitizer.sanitizeFormData(parsed);
        return JSON.stringify(sanitized);
      } catch {
        return inputSanitizer.sanitizeText(body);
      }
    }
    if (body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer) {
      return body;
    }
    return JSON.stringify(body);
  }
  buildHeaders(method, options = {
    // Implementation pending
  }) {
    const headers = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      ...options.headers || {}
    };
    const authToken = tokenManager.getAccessToken();
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    if (this.config.apiKey) {
      headers["X-API-Key"] = this.config.apiKey;
    }
    if (this.config.tenantId) {
      headers["X-Tenant-ID"] = this.config.tenantId;
    }
    if (csrfProtection.requiresProtection(method)) {
      Object.assign(headers, csrfProtection.getHeaders());
    }
    return headers;
  }
  async handleUnauthorized(attempt, url, requestOptions) {
    if (attempt !== 0) {
      throw new Error(AUTH_REQUIRED_ERROR);
    }
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error(AUTH_REQUIRED_ERROR);
    }
    try {
      const newTokens = await this.refreshToken(refreshToken);
      if (!newTokens) {
        throw new Error("Token refresh failed");
      }
      const newAuthToken = tokenManager.getAccessToken();
      if (!newAuthToken) {
        throw new Error("No access token after refresh");
      }
      const headers = { ...requestOptions.headers };
      headers["Authorization"] = `Bearer ${newAuthToken}`;
      const retryResponse = await fetch(url, { ...requestOptions, headers });
      if (retryResponse.ok) {
        return await retryResponse.json();
      }
      throw new Error("Retry after refresh failed");
    } catch (_error) {
      tokenManager.clearTokens();
      this.config.onUnauthorized();
      throw new Error(AUTH_REQUIRED_ERROR);
    }
  }
  async handleErrorResponse(response) {
    const errorData = await response.json().catch(() => ({}));
    const apiError = {
      code: errorData.code || `HTTP_${response.status}`,
      message: errorData.message || response.statusText,
      details: errorData.details,
      statusCode: response.status,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      path: response.url
    };
    const ispError = classifyError(apiError);
    const callbackStatus = ispError.status ?? response.status ?? 500;
    const apiErrorForCallback = {
      code: ispError.code || "UNKNOWN_ERROR",
      message: ispError.message,
      details: ispError.technicalDetails,
      statusCode: callbackStatus
    };
    this.config.onError?.(apiErrorForCallback);
    throw apiError;
  }
  shouldRetry(error2) {
    return !(error2.message === "Unauthorized" || error2.name === "AbortError");
  }
  async wait(attempt) {
    await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1e3));
  }
  async request(endpoint, options = {}) {
    const { params, cache: useCache, cacheTTL, ...rest } = options;
    let url = `${this.config.baseUrl}${endpoint}`;
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0 && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const query = searchParams.toString();
      if (query) {
        url += url.includes("?") ? `&${query}` : `?${query}`;
      }
    }
    const method = options.method || "GET";
    const sanitizedBody = this.sanitizeBody(options.body);
    const headers = this.buildHeaders(method, options);
    const requestOptions = {
      ...rest,
      method,
      headers,
      body: sanitizedBody,
      signal: AbortSignal.timeout(this.config.timeout),
      credentials: "same-origin"
    };
    let lastError = new Error("Request failed");
    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
          if (response.status === 401) {
            return await this.handleUnauthorized(attempt, url, requestOptions);
          }
          await this.handleErrorResponse(response);
        }
        return await response.json();
      } catch (error2) {
        lastError = error2;
        if (!this.shouldRetry(lastError)) {
          throw lastError;
        }
        if (attempt < this.config.retries) {
          await this.wait(attempt);
        }
      }
    }
    throw lastError;
  }
  async get(endpoint, config = {}) {
    return this.request(endpoint, { ...config, method: "GET" });
  }
  async post(endpoint, data, config = {}) {
    return this.request(endpoint, {
      ...config,
      method: "POST",
      body: data ?? config.body ?? null
    });
  }
  async put(endpoint, data, config = {}) {
    return this.request(endpoint, {
      ...config,
      method: "PUT",
      body: data ?? config.body ?? null
    });
  }
  async delete(endpoint, data, config = {}) {
    return this.request(endpoint, {
      ...config,
      method: "DELETE",
      body: data ?? config.body ?? null
    });
  }
  invalidateEndpointCache(endpoint) {
    this.cache?.invalidateEndpoint(endpoint);
  }
  invalidateCacheByPattern(pattern) {
    this.cache?.invalidatePattern(pattern);
  }
  // Authentication
  async login(credentials) {
    return this.request("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
  }
  async refreshToken(refreshToken) {
    const response = await this.request("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken })
    });
    if (!response.data) {
      throw new ISPError({
        message: "Invalid refresh token response",
        category: "authentication",
        severity: "high"
      });
    }
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresAt: response.data.expiresAt
    };
  }
  async logout() {
    return this.request("/api/v1/auth/logout", {
      method: "POST"
    });
  }
  async getCurrentUser() {
    return this.request("/api/v1/auth/me");
  }
  // Customers
  async getCustomers(params) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/api/v1/customers${query ? `?${query}` : ""}`);
  }
  async getCustomer(id) {
    return this.request(`/api/v1/customers/${id}`);
  }
  async createCustomer(customer) {
    return this.request("/api/v1/customers", {
      method: "POST",
      body: JSON.stringify(customer)
    });
  }
  async updateCustomer(id, updates) {
    return this.request(`/api/v1/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates)
    });
  }
  async deleteCustomer(id) {
    return this.request(`/api/v1/customers/${id}`, {
      method: "DELETE"
    });
  }
  // Billing
  async getInvoices(customerId, params) {
    const searchParams = new URLSearchParams();
    if (customerId) {
      searchParams.append("customerId", customerId);
    }
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/api/v1/billing/invoices${query ? `?${query}` : ""}`);
  }
  async getInvoice(id) {
    return this.request(`/api/v1/billing/invoices/${id}`);
  }
  async createInvoice(invoice) {
    return this.request("/api/v1/billing/invoices", {
      method: "POST",
      body: JSON.stringify(invoice)
    });
  }
  async payInvoice(id, paymentData) {
    return this.request(`/api/v1/billing/invoices/${id}/pay`, {
      method: "POST",
      body: JSON.stringify(paymentData)
    });
  }
  // Network Management
  async getNetworkDevices(params) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/api/v1/network/devices${query ? `?${query}` : ""}`);
  }
  async getNetworkDevice(id) {
    return this.request(`/api/v1/network/devices/${id}`);
  }
  async updateNetworkDevice(id, updates) {
    return this.request(`/api/v1/network/devices/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates)
    });
  }
  async getNetworkAlerts(params) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/api/v1/network/alerts${query ? `?${query}` : ""}`);
  }
  async acknowledgeAlert(id) {
    return this.request(`/api/v1/network/alerts/${id}/acknowledge`, {
      method: "POST"
    });
  }
  async resolveAlert(id, resolution) {
    return this.request(`/api/v1/network/alerts/${id}/resolve`, {
      method: "POST",
      body: JSON.stringify({ resolution })
    });
  }
  // Live Chat
  async getChatSessions(params) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/api/v1/chat/sessions${query ? `?${query}` : ""}`);
  }
  async getChatSession(id) {
    return this.request(`/api/v1/chat/sessions/${id}`);
  }
  async createChatSession(customerId, subject) {
    return this.request("/api/v1/chat/sessions", {
      method: "POST",
      body: JSON.stringify({ customerId, subject })
    });
  }
  async closeChatSession(id, rating, feedback) {
    return this.request(`/api/v1/chat/sessions/${id}/close`, {
      method: "POST",
      body: JSON.stringify({ rating, feedback })
    });
  }
  // Service Plans
  async getServicePlans(params) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/api/v1/services/plans${query ? `?${query}` : ""}`);
  }
  async getServicePlan(id) {
    return this.request(`/api/v1/services/plans/${id}`);
  }
  // Dashboard
  async getDashboardMetrics() {
    return this.request("/api/v1/dashboard/metrics");
  }
  // File uploads
  async uploadFile(file, purpose) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("purpose", purpose);
    return this.request("/api/v1/files/upload", {
      method: "POST",
      body: formData,
      headers: {
        // Implementation pending
      }
      // Let browser set Content-Type for FormData
    });
  }
  // Customer Portal APIs
  async getCustomerDashboard() {
    return this.request("/api/v1/customer/dashboard");
  }
  async getCustomerServices() {
    return this.request("/api/v1/customer/services");
  }
  async getCustomerBilling() {
    return this.request("/api/v1/customer/billing");
  }
  async getCustomerUsage(period) {
    const query = period ? `?period=${period}` : "";
    return this.request(`/api/v1/customer/usage${query}`);
  }
  async getCustomerDocuments() {
    return this.request("/api/v1/customer/documents");
  }
  async getCustomerSupportTickets() {
    return this.request("/api/v1/customer/support/tickets");
  }
  async createSupportTicket(data) {
    return this.request("/api/v1/customer/support/tickets", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
  async replySupportTicket(ticketId, message) {
    return this.request(`/api/v1/customer/support/tickets/${ticketId}/reply`, {
      method: "POST",
      body: JSON.stringify({ message })
    });
  }
  async runSpeedTest() {
    return this.request("/api/v1/customer/services/speed-test", {
      method: "POST"
    });
  }
  async requestServiceUpgrade(upgradeId) {
    return this.request("/api/v1/customer/services/upgrade", {
      method: "POST",
      body: JSON.stringify({ upgradeId })
    });
  }
  // Admin Portal APIs
  async getAdminDashboard() {
    return this.request("/api/v1/admin/dashboard");
  }
  async getSystemAlerts() {
    return this.request("/api/v1/admin/system/alerts");
  }
  async getNetworkStatus() {
    return this.request("/api/v1/admin/network/status");
  }
  // Reseller Portal APIs
  async getResellerDashboard() {
    return this.request("/api/v1/reseller/dashboard");
  }
  async getResellerCommissions() {
    return this.request("/api/v1/reseller/commissions");
  }
  async getResellerCustomers() {
    return this.request("/api/v1/reseller/customers");
  }
  // Plugin Management APIs
  async getPluginCatalog(filters, params) {
    const searchParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== void 0) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, String(v)));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
    }
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/api/v1/plugins/catalog${query ? `?${query}` : ""}`);
  }
  async getPluginDetails(pluginId) {
    return this.request(`/api/v1/plugins/catalog/${pluginId}`);
  }
  async installPlugin(request) {
    if (!primitives.validate.required(request.plugin_id)) {
      throw new ISPError({
        code: "VALIDATION_ERROR",
        message: "Plugin ID is required",
        category: "validation",
        severity: "medium",
        technicalDetails: { pluginId: request.plugin_id }
      });
    }
    const validTiers = ["trial", "basic", "professional", "enterprise"];
    if (!primitives.validate.oneOf(request.license_tier, validTiers)) {
      throw new ISPError({
        code: "VALIDATION_ERROR",
        message: "Invalid license tier",
        category: "validation",
        severity: "medium",
        technicalDetails: { licenseTier: request.license_tier, validTiers }
      });
    }
    if (request.configuration && typeof request.configuration === "object") {
      const configKeys = Object.keys(request.configuration);
      if (configKeys.length > 50) {
        throw new ISPError({
          code: "VALIDATION_ERROR",
          message: "Too many configuration parameters",
          category: "validation",
          severity: "medium",
          technicalDetails: { configCount: configKeys.length, maxAllowed: 50 }
        });
      }
    }
    return this.request("/api/v1/plugins/install", {
      method: "POST",
      body: JSON.stringify(request)
    });
  }
  async getPluginInstallationStatus(installationId) {
    return this.request(`/api/v1/plugins/installations/${installationId}/status`);
  }
  async getInstalledPlugins(params) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/api/v1/plugins/installed${query ? `?${query}` : ""}`);
  }
  async getInstalledPlugin(installationId) {
    return this.request(`/api/v1/plugins/installed/${installationId}`);
  }
  async enablePlugin(installationId) {
    return this.request(`/api/v1/plugins/installed/${installationId}/enable`, {
      method: "POST"
    });
  }
  async disablePlugin(installationId) {
    return this.request(`/api/v1/plugins/installed/${installationId}/disable`, {
      method: "POST"
    });
  }
  async configurePlugin(installationId, configuration) {
    return this.request(`/api/v1/plugins/installed/${installationId}/configure`, {
      method: "PUT",
      body: JSON.stringify({ configuration })
    });
  }
  async uninstallPlugin(installationId, options) {
    return this.request(`/api/v1/plugins/installed/${installationId}/uninstall`, {
      method: "DELETE",
      body: JSON.stringify(options || {})
    });
  }
  async getPluginUpdates(installationId) {
    const endpoint = installationId ? `/api/v1/plugins/installed/${installationId}/updates` : "/api/v1/plugins/updates";
    return this.request(endpoint);
  }
  async updatePlugin(installationId, options) {
    if (this.rateLimiter) {
      const limitResult = await this.rateLimiter.checkLimit(`plugin-update:${installationId}`);
      if (!limitResult.allowed) {
        throw new ISPError({
          message: "Rate limit exceeded. Please wait before making another plugin update request.",
          category: "system",
          severity: "medium",
          retryable: true
        });
      }
    }
    const sanitizedId = inputSanitizer.sanitizeText(installationId);
    if (!sanitizedId || sanitizedId.length > 50) {
      throw new Error("Invalid installation ID");
    }
    const sanitizedOptions = options || {};
    if (sanitizedOptions.configuration) {
      let parsedConfig;
      try {
        parsedConfig = typeof sanitizedOptions.configuration === "string" ? JSON.parse(sanitizedOptions.configuration) : sanitizedOptions.configuration;
      } catch (error2) {
        throw new Error(
          `Invalid plugin configuration: ${error2 instanceof Error ? error2.message : "Unknown error"}`
        );
      }
      if (!parsedConfig || typeof parsedConfig !== "object") {
        throw new ISPError({
          message: "Plugin configuration must be a valid object",
          category: "validation",
          severity: "low"
        });
      }
      sanitizedOptions.configuration = parsedConfig;
    }
    return this.request(`/api/v1/plugins/installed/${sanitizedId}/update`, {
      method: "POST",
      body: JSON.stringify(sanitizedOptions)
    });
  }
  async getPluginUsage(installationId, period) {
    const query = period ? `?period=${period}` : "";
    return this.request(`/api/v1/plugins/installed/${installationId}/usage${query}`);
  }
  async getPluginHealth(installationId) {
    const endpoint = installationId ? `/api/v1/plugins/installed/${installationId}/health` : "/api/v1/plugins/health";
    return this.request(endpoint);
  }
  async requestPluginPermissions(request) {
    return this.request("/api/v1/plugins/permissions/request", {
      method: "POST",
      body: JSON.stringify(request)
    });
  }
  async getPluginBackups(installationId, params) {
    const searchParams = new URLSearchParams();
    if (installationId) {
      searchParams.append("installation_id", installationId);
    }
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/api/v1/plugins/backups${query ? `?${query}` : ""}`);
  }
  async createPluginBackup(installationId, type = "manual") {
    return this.request("/api/v1/plugins/backups", {
      method: "POST",
      body: JSON.stringify({ installation_id: installationId, type })
    });
  }
  async restorePluginBackup(backupId) {
    return this.request(`/api/v1/plugins/backups/${backupId}/restore`, {
      method: "POST"
    });
  }
};
var defaultClient = null;
function createApiClient(config) {
  const client = new ApiClient(config);
  if (!defaultClient) {
    defaultClient = client;
  }
  return client;
}
function getApiClient() {
  if (!defaultClient) {
    throw new Error("API client not initialized. Call createApiClient() first.");
  }
  return defaultClient;
}
var applyNotificationOptions = (base, options) => {
  if (!options) {
    return base;
  }
  for (const [key, value] of Object.entries(options)) {
    if (value !== void 0) {
      base[key] = value;
    }
  }
  return base;
};
var useNotificationStore = zustand.create()(
  middleware.subscribeWithSelector((set, get) => ({
    notifications: [],
    addNotification: (notificationData) => {
      const id = Math.random().toString(36).substring(7);
      const notification = {
        ...notificationData,
        id,
        timestamp: /* @__PURE__ */ new Date(),
        duration: notificationData.duration ?? (notificationData.type === "error" ? 0 : 5e3)
      };
      set((state) => ({
        notifications: [notification, ...state.notifications]
      }));
      if (notification.duration && notification.duration > 0) {
        setTimeout(() => {
          get().removeNotification(id);
        }, notification.duration);
      }
      return id;
    },
    removeNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }));
    },
    clearNotifications: () => {
      set({ notifications: [] });
    },
    markAsRead: (id) => {
      set((state) => ({
        notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
      }));
    },
    updateNotification: (id, updates) => {
      set((state) => ({
        notifications: state.notifications.map((n) => n.id === id ? { ...n, ...updates } : n)
      }));
    }
  }))
);
function useNotifications() {
  const store = useNotificationStore();
  const notify = React6.useMemo(
    () => ({
      success: (title, message, options) => {
        const payload = {
          type: "success",
          title
        };
        applyNotificationOptions(payload, options);
        if (message !== void 0) {
          payload.message = message;
        }
        return store.addNotification(payload);
      },
      error: (title, message, options) => {
        const payload = {
          type: "error",
          title
        };
        applyNotificationOptions(payload, options);
        if (payload.persistent === void 0) {
          payload.persistent = true;
        }
        if (message !== void 0) {
          payload.message = message;
        }
        return store.addNotification(payload);
      },
      warning: (title, message, options) => {
        const payload = {
          type: "warning",
          title
        };
        applyNotificationOptions(payload, options);
        if (message !== void 0) {
          payload.message = message;
        }
        return store.addNotification(payload);
      },
      info: (title, message, options) => {
        const payload = {
          type: "info",
          title
        };
        applyNotificationOptions(payload, options);
        if (message !== void 0) {
          payload.message = message;
        }
        return store.addNotification(payload);
      }
    }),
    [store]
  );
  return {
    notifications: store.notifications,
    notify,
    addNotification: store.addNotification,
    remove: store.removeNotification,
    clear: store.clearNotifications,
    markAsRead: store.markAsRead,
    update: store.updateNotification
  };
}
function useApiErrorNotifications() {
  const { notify } = useNotifications();
  const parseApiError = (error2) => {
    if (typeof error2 === "object" && error2 !== null) {
      const candidate = error2;
      return {
        status: typeof candidate.status === "number" ? candidate.status : void 0,
        message: typeof candidate.message === "string" ? candidate.message : void 0
      };
    }
    return {};
  };
  const notifyApiError = React6.useCallback(
    (error2, context) => {
      const parsed = parseApiError(error2);
      const status = parsed.status;
      const isNetworkError = status === 0 || !navigator.onLine;
      const isServerError = typeof status === "number" && status >= 500;
      const isAuthError = status === 401 || status === 403;
      let title = "Something went wrong";
      let message = parsed.message || "An unexpected error occurred";
      if (isNetworkError) {
        title = "Connection Problem";
        message = "Unable to connect to our servers. Please check your internet connection.";
      } else if (isServerError) {
        title = "Server Error";
        message = "Our servers are experiencing issues. Please try again later.";
      } else if (isAuthError) {
        title = "Authentication Required";
        message = "Please log in to continue.";
      }
      const contextMessage = context ? ` while ${context.toLowerCase()}` : "";
      return notify.error(title, message + contextMessage, {
        actions: [
          {
            label: "Retry",
            action: () => window.location.reload()
          },
          ...isAuthError ? [
            {
              label: "Log In",
              action: () => {
                window.location.href = "/auth/login";
              },
              primary: true
            }
          ] : []
        ],
        metadata: {
          error: error2,
          context,
          status,
          isNetworkError,
          isServerError,
          isAuthError
        }
      });
    },
    [notify]
  );
  const notifyApiSuccess = React6.useCallback(
    (message, context) => {
      const contextMessage = context ? ` ${context}` : "";
      return notify.success("Success", message + contextMessage);
    },
    [notify]
  );
  return {
    notifyApiError,
    notifyApiSuccess
  };
}
function useErrorNotifications() {
  const { notify } = useNotifications();
  const notifyNetworkError = React6.useCallback(() => {
    return notify.error("Network Error", "Please check your internet connection and try again.", {
      actions: [
        {
          label: "Retry",
          action: () => window.location.reload(),
          primary: true
        }
      ]
    });
  }, [notify]);
  const notifyValidationError = React6.useCallback(
    (errors) => {
      const errorMessages = Object.values(errors).flat();
      return notify.warning(
        "Validation Error",
        errorMessages.length === 1 ? errorMessages[0] : `${errorMessages.length} validation errors occurred`,
        {
          metadata: { errors }
        }
      );
    },
    [notify]
  );
  const notifyPermissionError = React6.useCallback(() => {
    return notify.error("Permission Denied", "You do not have permission to perform this action.", {
      actions: [
        {
          label: "Contact Support",
          action: () => {
            window.location.href = "/support";
          }
        }
      ]
    });
  }, [notify]);
  const notifyMaintenanceMode = React6.useCallback(
    (estimatedTime) => {
      return notify.warning(
        "Maintenance Mode",
        estimatedTime ? `Service will resume at ${estimatedTime}` : "The service is temporarily unavailable for maintenance.",
        {
          persistent: true,
          actions: [
            {
              label: "Check Status",
              action: () => {
                window.open("https://status.dotmac.com", "_blank");
              }
            }
          ]
        }
      );
    },
    [notify]
  );
  return {
    notifyNetworkError,
    notifyValidationError,
    notifyPermissionError,
    notifyMaintenanceMode
  };
}
function useGlobalErrorListener() {
  const { notifyApiError } = useApiErrorNotifications();
  React6.useEffect(() => {
    const handleUnhandledRejection = (event) => {
      if (event.reason?.status || event.reason?.message) {
        notifyApiError(event.reason, "processing request");
      }
    };
    const handleError = (event) => {
      if (event.error && !event.error.message?.includes("ResizeObserver")) {
        notifyApiError(
          {
            message: event.error.message || "An unexpected error occurred"
          },
          "loading page"
        );
      }
    };
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, [notifyApiError]);
}

// src/api/clients/BaseApiClient.ts
var BaseApiClient = class {
  constructor(baseURL, defaultHeaders = {}, context = "API") {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
    this.context = context;
  }
  async request(method, endpoint, data, config = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const { params, headers = {}, timeout = 3e4, retryable = true } = config;
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0 && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const finalUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;
    const requestOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
        ...headers
      },
      signal: AbortSignal.timeout(timeout)
    };
    if (data && method !== "GET" && method !== "HEAD") {
      requestOptions.body = JSON.stringify(data);
    }
    try {
      const response = await fetch(finalUrl, requestOptions);
      if (!response.ok) {
        throw this.createHttpError(response, endpoint, method);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return response;
    } catch (error2) {
      if (error2 instanceof ISPError) {
        throw error2;
      }
      if (error2 instanceof TypeError && error2.message.includes("fetch")) {
        throw ErrorFactory.network(
          `Network error for ${method} ${endpoint}: ${error2.message}`,
          `${this.context} - ${endpoint}`
        );
      }
      if (error2?.name === "AbortError") {
        throw new ISPError({
          message: `Request timeout for ${method} ${endpoint}`,
          category: "network",
          severity: "medium",
          context: `${this.context} - ${endpoint}`,
          retryable,
          userMessage: "Request timed out. Please try again.",
          technicalDetails: { method, endpoint, timeout }
        });
      }
      throw ErrorFactory.system(
        `Request failed for ${method} ${endpoint}: ${error2?.message || "Unknown error"}`,
        `${this.context} - ${endpoint}`
      );
    }
  }
  async createHttpError(response, endpoint, method) {
    let errorDetails = {};
    try {
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        errorDetails = await response.json();
      } else {
        errorDetails.message = await response.text();
      }
    } catch {
    }
    const baseMessage = `${method} ${endpoint} failed with status ${response.status}`;
    const userMessage = errorDetails.message || response.statusText || "Request failed";
    return new ISPError({
      message: `${baseMessage}: ${userMessage}`,
      status: response.status,
      code: errorDetails.code || `HTTP_${response.status}`,
      category: this.categorizeHttpError(response.status),
      severity: this.getSeverityForStatus(response.status),
      context: `${this.context} - ${endpoint}`,
      retryable: this.isRetryableStatus(response.status),
      userMessage: this.getUserMessageForStatus(response.status, userMessage),
      technicalDetails: {
        method,
        endpoint,
        status: response.status,
        statusText: response.statusText,
        responseBody: errorDetails
      }
    });
  }
  categorizeHttpError(status) {
    if (status === 401) return "authentication";
    if (status === 403) return "authorization";
    if (status === 422 || status >= 400 && status < 500) return "validation";
    if (status >= 500) return "system";
    return "network";
  }
  getSeverityForStatus(status) {
    if (status === 401 || status === 403) return "high";
    if (status >= 500) return "critical";
    if (status === 429) return "medium";
    if (status >= 400 && status < 500) return "low";
    return "medium";
  }
  isRetryableStatus(status) {
    return status >= 500 || status === 429 || status === 408 || status === 0;
  }
  getUserMessageForStatus(status, serverMessage) {
    switch (status) {
      case 401:
        return "Please log in again to continue.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return "This action conflicts with the current state. Please refresh and try again.";
      case 422:
        return "Please check your input and try again.";
      case 429:
        return "Too many requests. Please wait a moment before trying again.";
      case 500:
        return "Server error. Please try again in a few minutes.";
      case 502:
      case 503:
      case 504:
        return "Service temporarily unavailable. Please try again later.";
      default:
        return serverMessage || "Something went wrong. Please try again.";
    }
  }
  async get(endpoint, config) {
    return this.request("GET", endpoint, void 0, config);
  }
  async post(endpoint, data, config) {
    return this.request("POST", endpoint, data, config);
  }
  async put(endpoint, data, config) {
    return this.request("PUT", endpoint, data, config);
  }
  async patch(endpoint, data, config) {
    return this.request("PATCH", endpoint, data, config);
  }
  async delete(endpoint, config) {
    return this.request("DELETE", endpoint, void 0, config);
  }
};

// src/api/clients/IdentityApiClient.ts
var IdentityApiClient = class extends BaseApiClient {
  constructor(baseURL, defaultHeaders = {}) {
    super(baseURL, defaultHeaders);
  }
  // Customer operations
  async getCustomers(params) {
    return this.get("/api/identity/customers", { params });
  }
  async getCustomer(customerId, params) {
    return this.get(`/api/identity/customers/${customerId}`, { params });
  }
  async createCustomer(data) {
    return this.post("/api/identity/customers", data);
  }
  async updateCustomer(customerId, data) {
    return this.put(`/api/identity/customers/${customerId}`, data);
  }
  async deleteCustomer(customerId) {
    return this.delete(`/api/identity/customers/${customerId}`);
  }
  // User operations
  async getUsers(params) {
    return this.get("/api/identity/users", { params });
  }
  async getUser(userId) {
    return this.get(`/api/identity/users/${userId}`);
  }
  async createUser(data) {
    return this.post("/api/identity/users", data);
  }
  async updateUser(userId, data) {
    return this.put(`/api/identity/users/${userId}`, data);
  }
  async deleteUser(userId) {
    return this.delete(`/api/identity/users/${userId}`);
  }
  // Authentication operations
  async authenticate(credentials) {
    return this.post("/api/identity/auth/login", credentials);
  }
  async logout() {
    return this.post("/api/identity/auth/logout", {});
  }
  async refreshToken(refreshToken) {
    return this.post("/api/identity/auth/refresh", {
      refresh_token: refreshToken
    });
  }
};

// src/api/clients/NetworkingApiClient.ts
var NetworkingApiClient = class extends BaseApiClient {
  constructor(baseURL, defaultHeaders = {}) {
    super(baseURL, defaultHeaders);
  }
  // Network device operations
  async getNetworkDevices(params) {
    return this.get("/api/networking/devices", { params });
  }
  async getNetworkDevice(deviceId) {
    return this.get(`/api/networking/devices/${deviceId}`);
  }
  async updateNetworkDevice(deviceId, data) {
    return this.put(`/api/networking/devices/${deviceId}`, data);
  }
  async rebootDevice(deviceId) {
    return this.post(`/api/networking/devices/${deviceId}/reboot`, {});
  }
  // Network topology operations
  async getNetworkTopology(params) {
    return this.get("/api/networking/topology", { params });
  }
  async discoverDevices(params) {
    return this.post("/api/networking/discover", params);
  }
  // Monitoring operations
  async getDeviceMetrics(deviceId, params) {
    return this.get(`/api/networking/devices/${deviceId}/metrics`, { params });
  }
  async getNetworkHealth() {
    return this.get("/api/networking/health");
  }
  async getDeviceAlerts(params) {
    return this.get("/api/networking/alerts", { params });
  }
};

// src/api/clients/BillingApiClient.ts
var BillingApiClient = class extends BaseApiClient {
  constructor(baseURL, defaultHeaders = {}) {
    super(baseURL, defaultHeaders);
  }
  // Payment processor operations
  async getBillingProcessors(params) {
    return this.get("/api/billing/processors", { params });
  }
  async updateBillingProcessor(processorId, data) {
    return this.put(`/api/billing/processors/${processorId}`, data);
  }
  async testBillingProcessor(processorId, params) {
    return this.post(`/api/billing/processors/${processorId}/test`, params);
  }
  // Payment operations
  async createPaymentIntent(data) {
    return this.post("/api/billing/payment-intents", data);
  }
  async confirmPaymentIntent(data) {
    return this.post("/api/billing/payment-intents/confirm", data);
  }
  async capturePaymentIntent(paymentIntentId, data) {
    return this.post(`/api/billing/payment-intents/${paymentIntentId}/capture`, data);
  }
  async cancelPaymentIntent(paymentIntentId, data) {
    return this.post(`/api/billing/payment-intents/${paymentIntentId}/cancel`, data);
  }
  // Transaction operations
  async getTransactions(params) {
    return this.get("/api/billing/transactions", { params });
  }
  async getTransaction(transactionId, params) {
    return this.get(`/api/billing/transactions/${transactionId}`, { params });
  }
  async processRefund(data) {
    return this.post("/api/billing/refunds", data);
  }
  // Invoice operations
  async getInvoices(params) {
    return this.get("/api/billing/invoices", { params });
  }
  async getInvoice(invoiceId) {
    return this.get(`/api/billing/invoices/${invoiceId}`);
  }
  async createInvoice(data) {
    return this.post("/api/billing/invoices", data);
  }
  // Analytics operations
  async getBillingAnalytics(params) {
    return this.get("/api/billing/analytics", { params });
  }
  async generateBillingReport(params) {
    return this.post("/api/billing/reports", params);
  }
  // Utility operations
  async calculateProcessorFees(processorId, params) {
    return this.post(`/api/billing/processors/${processorId}/calculate-fees`, params);
  }
  async tokenizePaymentMethod(data) {
    return this.post("/api/billing/tokenize", data);
  }
  async encryptBillingData(data) {
    return this.post("/api/billing/encrypt", data);
  }
};

// src/api/clients/ServicesApiClient.ts
var ServicesApiClient = class extends BaseApiClient {
  constructor(baseURL, defaultHeaders = {}) {
    super(baseURL, defaultHeaders);
  }
  // Service Plans
  async getServicePlans(params) {
    return this.get("/api/services/plans", { params });
  }
  async getServicePlan(planId) {
    return this.get(`/api/services/plans/${planId}`);
  }
  async createServicePlan(data) {
    return this.post("/api/services/plans", data);
  }
  async updateServicePlan(planId, data) {
    return this.put(`/api/services/plans/${planId}`, data);
  }
  // Customer Services
  async getCustomerServices(customerId, params) {
    return this.get(`/api/services/customers/${customerId}/services`, {
      params
    });
  }
  async activateService(customerId, serviceId) {
    return this.post(`/api/services/customers/${customerId}/services/${serviceId}/activate`, {});
  }
  async suspendService(customerId, serviceId, reason) {
    return this.post(`/api/services/customers/${customerId}/services/${serviceId}/suspend`, {
      reason
    });
  }
  async terminateService(customerId, serviceId, termination_date) {
    return this.post(`/api/services/customers/${customerId}/services/${serviceId}/terminate`, {
      termination_date
    });
  }
  // Service Orders
  async createServiceOrder(data) {
    return this.post("/api/services/orders", data);
  }
  async getServiceOrders(params) {
    return this.get("/api/services/orders", { params });
  }
  async getServiceOrder(orderId) {
    return this.get(`/api/services/orders/${orderId}`);
  }
  async updateServiceOrder(orderId, data) {
    return this.put(`/api/services/orders/${orderId}`, data);
  }
  async approveServiceOrder(orderId, notes) {
    return this.post(`/api/services/orders/${orderId}/approve`, { notes });
  }
  async cancelServiceOrder(orderId, reason) {
    return this.post(`/api/services/orders/${orderId}/cancel`, { reason });
  }
  // Service Provisioning
  async getProvisioningStatus(orderIds) {
    return this.post("/api/services/provisioning/status", {
      order_ids: orderIds
    });
  }
  async updateProvisioningStep(provisioningId, stepId, data) {
    return this.put(`/api/services/provisioning/${provisioningId}/steps/${stepId}`, data);
  }
  // Service Configuration
  async getServiceConfiguration(serviceId) {
    return this.get(`/api/services/${serviceId}/configuration`);
  }
  async updateServiceConfiguration(serviceId, config) {
    return this.put(`/api/services/${serviceId}/configuration`, config);
  }
  // Usage and Metrics
  async getServiceUsage(serviceId, params) {
    return this.get(`/api/services/${serviceId}/usage`, { params });
  }
  async getServiceMetrics(serviceId, params) {
    return this.get(`/api/services/${serviceId}/metrics`, { params });
  }
};

// src/api/clients/SupportApiClient.ts
var SupportApiClient = class extends BaseApiClient {
  constructor(baseURL, defaultHeaders = {}) {
    super(baseURL, defaultHeaders);
  }
  // Support Tickets
  async getTickets(params) {
    return this.get("/api/support/tickets", { params });
  }
  async getTicket(ticketId) {
    return this.get(`/api/support/tickets/${ticketId}`);
  }
  async createTicket(data) {
    return this.post("/api/support/tickets", data);
  }
  async updateTicket(ticketId, data) {
    return this.put(`/api/support/tickets/${ticketId}`, data);
  }
  async assignTicket(ticketId, agentId) {
    return this.post(`/api/support/tickets/${ticketId}/assign`, {
      agent_id: agentId
    });
  }
  async closeTicket(ticketId, resolution_notes) {
    return this.post(`/api/support/tickets/${ticketId}/close`, {
      resolution_notes
    });
  }
  async reopenTicket(ticketId, reason) {
    return this.post(`/api/support/tickets/${ticketId}/reopen`, { reason });
  }
  // Ticket Comments
  async getTicketComments(ticketId, params) {
    return this.get(`/api/support/tickets/${ticketId}/comments`, { params });
  }
  async addTicketComment(ticketId, data) {
    return this.post(`/api/support/tickets/${ticketId}/comments`, data);
  }
  async updateTicketComment(ticketId, commentId, data) {
    return this.put(`/api/support/tickets/${ticketId}/comments/${commentId}`, data);
  }
  async deleteTicketComment(ticketId, commentId) {
    return this.delete(`/api/support/tickets/${ticketId}/comments/${commentId}`);
  }
  // File Attachments
  async uploadAttachment(ticketId, file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${this.baseURL}/api/support/tickets/${ticketId}/attachments`, {
      method: "POST",
      headers: {
        ...this.defaultHeaders
        // Don't set Content-Type, let browser set it for FormData
      },
      body: formData
    });
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    return response.json();
  }
  async deleteAttachment(ticketId, attachmentId) {
    return this.delete(`/api/support/tickets/${ticketId}/attachments/${attachmentId}`);
  }
  // Knowledge Base
  async getKnowledgeArticles(params) {
    return this.get("/api/support/knowledge", { params });
  }
  async getKnowledgeArticle(articleId) {
    return this.get(`/api/support/knowledge/${articleId}`);
  }
  async searchKnowledge(query, params) {
    return this.get("/api/support/knowledge/search", {
      params: { q: query, ...params }
    });
  }
  async createKnowledgeArticle(data) {
    return this.post("/api/support/knowledge", data);
  }
  async updateKnowledgeArticle(articleId, data) {
    return this.put(`/api/support/knowledge/${articleId}`, data);
  }
  async publishKnowledgeArticle(articleId) {
    return this.post(`/api/support/knowledge/${articleId}/publish`, {});
  }
  async voteKnowledgeArticle(articleId, helpful) {
    return this.post(`/api/support/knowledge/${articleId}/vote`, { helpful });
  }
  // Support Agents
  async getSupportAgents(params) {
    return this.get("/api/support/agents", { params });
  }
  async getSupportAgent(agentId) {
    return this.get(`/api/support/agents/${agentId}`);
  }
  async updateAgentStatus(agentId, status) {
    return this.put(`/api/support/agents/${agentId}/status`, { status });
  }
  // Support Analytics
  async getSupportMetrics(params) {
    return this.get("/api/support/metrics", { params });
  }
  async getTicketStats() {
    return this.get("/api/support/tickets/stats");
  }
  async getResponseTimeStats(params) {
    return this.get("/api/support/response-times", { params });
  }
};

// src/api/clients/ResellersApiClient.ts
var ResellersApiClient = class extends BaseApiClient {
  constructor(baseURL, defaultHeaders = {}) {
    super(baseURL, defaultHeaders);
  }
  // Partner Management
  async getPartners(params) {
    return this.get("/api/resellers/partners", { params });
  }
  async getPartner(partnerId) {
    return this.get(`/api/resellers/partners/${partnerId}`);
  }
  async createPartner(data) {
    return this.post("/api/resellers/partners", data);
  }
  async updatePartner(partnerId, data) {
    return this.put(`/api/resellers/partners/${partnerId}`, data);
  }
  async activatePartner(partnerId) {
    return this.post(`/api/resellers/partners/${partnerId}/activate`, {});
  }
  async suspendPartner(partnerId, reason) {
    return this.post(`/api/resellers/partners/${partnerId}/suspend`, {
      reason
    });
  }
  async terminatePartner(partnerId, data) {
    return this.post(`/api/resellers/partners/${partnerId}/terminate`, data);
  }
  // Territory Management
  async getPartnerTerritories(partnerId) {
    return this.get(`/api/resellers/partners/${partnerId}/territories`);
  }
  async assignTerritory(partnerId, territoryData) {
    return this.post(`/api/resellers/partners/${partnerId}/territories`, territoryData);
  }
  async updateTerritory(partnerId, territoryId, data) {
    return this.put(`/api/resellers/partners/${partnerId}/territories/${territoryId}`, data);
  }
  async removeTerritory(partnerId, territoryId) {
    return this.delete(`/api/resellers/partners/${partnerId}/territories/${territoryId}`);
  }
  async checkTerritoryConflicts(territoryData) {
    return this.post("/api/resellers/territories/check-conflicts", territoryData);
  }
  // Sales Management
  async getSales(params) {
    return this.get("/api/resellers/sales", { params });
  }
  async getSale(saleId) {
    return this.get(`/api/resellers/sales/${saleId}`);
  }
  async createSale(data) {
    return this.post("/api/resellers/sales", data);
  }
  async updateSale(saleId, data) {
    return this.put(`/api/resellers/sales/${saleId}`, data);
  }
  async approveSale(saleId, approvalNotes) {
    return this.post(`/api/resellers/sales/${saleId}/approve`, {
      approval_notes: approvalNotes
    });
  }
  async cancelSale(saleId, cancellationReason) {
    return this.post(`/api/resellers/sales/${saleId}/cancel`, {
      cancellation_reason: cancellationReason
    });
  }
  async getPartnerSales(partnerId, params) {
    return this.get(`/api/resellers/partners/${partnerId}/sales`, { params });
  }
  // Commission Management
  async calculateCommissions(partnerId, period) {
    return this.post(`/api/resellers/partners/${partnerId}/calculate-commissions`, period);
  }
  async getCommissionPayments(params) {
    return this.get("/api/resellers/commissions", { params });
  }
  async getCommissionPayment(paymentId) {
    return this.get(`/api/resellers/commissions/${paymentId}`);
  }
  async approveCommissionPayment(paymentId, approvalNotes) {
    return this.post(`/api/resellers/commissions/${paymentId}/approve`, {
      approval_notes: approvalNotes
    });
  }
  async processCommissionPayment(paymentId, paymentDetails) {
    return this.post(`/api/resellers/commissions/${paymentId}/process`, paymentDetails);
  }
  async disputeCommissionPayment(paymentId, disputeReason) {
    return this.post(`/api/resellers/commissions/${paymentId}/dispute`, {
      dispute_reason: disputeReason
    });
  }
  async getPartnerCommissionStatement(partnerId, params) {
    return this.get(`/api/resellers/partners/${partnerId}/commission-statement`, { params });
  }
  // Training & Certification
  async getTrainingPrograms(params) {
    return this.get("/api/resellers/training/programs", { params });
  }
  async getTrainingProgram(trainingId) {
    return this.get(`/api/resellers/training/programs/${trainingId}`);
  }
  async getPartnerTrainingRecords(partnerId, params) {
    return this.get(`/api/resellers/partners/${partnerId}/training`, {
      params
    });
  }
  async enrollPartnerInTraining(partnerId, trainingId) {
    return this.post(`/api/resellers/partners/${partnerId}/training/${trainingId}/enroll`, {});
  }
  async updateTrainingProgress(partnerId, trainingRecordId, data) {
    return this.put(`/api/resellers/training-records/${trainingRecordId}/progress`, data);
  }
  async completeTraining(partnerId, trainingRecordId, finalScore) {
    return this.post(`/api/resellers/training-records/${trainingRecordId}/complete`, {
      final_score: finalScore
    });
  }
  // Performance Analytics
  async getPartnerPerformance(partnerId, params) {
    return this.get(`/api/resellers/partners/${partnerId}/performance`, {
      params
    });
  }
  async getChannelPerformance(params) {
    return this.get("/api/resellers/analytics/channel-performance", { params });
  }
  async getPartnerLeaderboard(params) {
    return this.get("/api/resellers/analytics/leaderboard", { params });
  }
  // Onboarding Management
  async updateOnboardingStatus(partnerId, data) {
    return this.put(`/api/resellers/partners/${partnerId}/onboarding`, data);
  }
  async assignOnboardingManager(partnerId, managerId) {
    return this.post(`/api/resellers/partners/${partnerId}/assign-onboarding-manager`, {
      manager_id: managerId
    });
  }
  async getOnboardingChecklist(partnerId) {
    return this.get(`/api/resellers/partners/${partnerId}/onboarding-checklist`);
  }
  // Document Management
  async uploadPartnerDocument(partnerId, file, documentType) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", documentType);
    const response = await fetch(`${this.baseURL}/api/resellers/partners/${partnerId}/documents`, {
      method: "POST",
      headers: this.defaultHeaders,
      body: formData
    });
    if (!response.ok) {
      throw new Error(`Document upload failed: ${response.statusText}`);
    }
    return response.json();
  }
  async getPartnerDocuments(partnerId) {
    return this.get(`/api/resellers/partners/${partnerId}/documents`);
  }
  async signDocument(partnerId, documentId, signatureData) {
    return this.post(
      `/api/resellers/partners/${partnerId}/documents/${documentId}/sign`,
      signatureData
    );
  }
};

// src/api/clients/FieldOpsApiClient.ts
var FieldOpsApiClient = class extends BaseApiClient {
  constructor(baseURL, defaultHeaders = {}) {
    super(baseURL, defaultHeaders);
  }
  // Technicians
  async getTechnicians(params) {
    return this.get("/api/field-ops/technicians", { params });
  }
  async getTechnician(technicianId) {
    return this.get(`/api/field-ops/technicians/${technicianId}`);
  }
  async createTechnician(data) {
    return this.post("/api/field-ops/technicians", data);
  }
  async updateTechnician(technicianId, data) {
    return this.put(`/api/field-ops/technicians/${technicianId}`, data);
  }
  async updateTechnicianStatus(technicianId, status) {
    return this.put(`/api/field-ops/technicians/${technicianId}/status`, {
      status
    });
  }
  async updateTechnicianLocation(technicianId, location) {
    return this.put(`/api/field-ops/technicians/${technicianId}/location`, location);
  }
  async getAvailableTechnicians(params) {
    return this.get("/api/field-ops/technicians/available", { params });
  }
  // Work Orders
  async getWorkOrders(params) {
    return this.get("/api/field-ops/work-orders", { params });
  }
  async getWorkOrder(workOrderId) {
    return this.get(`/api/field-ops/work-orders/${workOrderId}`);
  }
  async createWorkOrder(data) {
    return this.post("/api/field-ops/work-orders", data);
  }
  async updateWorkOrder(workOrderId, data) {
    return this.put(`/api/field-ops/work-orders/${workOrderId}`, data);
  }
  async assignWorkOrder(workOrderId, technicianId, notes) {
    return this.post(`/api/field-ops/work-orders/${workOrderId}/assign`, {
      technician_id: technicianId,
      notes
    });
  }
  async acceptWorkOrder(workOrderId, technicianId) {
    return this.post(`/api/field-ops/work-orders/${workOrderId}/accept`, {
      technician_id: technicianId
    });
  }
  async startWorkOrder(workOrderId, location) {
    return this.post(`/api/field-ops/work-orders/${workOrderId}/start`, {
      location
    });
  }
  async completeWorkOrder(workOrderId, data) {
    return this.post(`/api/field-ops/work-orders/${workOrderId}/complete`, data);
  }
  async cancelWorkOrder(workOrderId, reason) {
    return this.post(`/api/field-ops/work-orders/${workOrderId}/cancel`, {
      reason
    });
  }
  // Work Order Photos
  async uploadWorkOrderPhoto(workOrderId, file, photoType, caption) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("photo_type", photoType);
    if (caption) formData.append("caption", caption);
    const response = await fetch(
      `${this.baseURL}/api/field-ops/work-orders/${workOrderId}/photos`,
      {
        method: "POST",
        headers: this.defaultHeaders,
        body: formData
      }
    );
    if (!response.ok) {
      throw new Error(`Photo upload failed: ${response.statusText}`);
    }
    return response.json();
  }
  async deleteWorkOrderPhoto(workOrderId, photoId) {
    return this.delete(`/api/field-ops/work-orders/${workOrderId}/photos/${photoId}`);
  }
  // Routing & Scheduling
  async createRoute(technicianId, date, workOrderIds) {
    return this.post("/api/field-ops/routes", {
      technician_id: technicianId,
      date,
      work_order_ids: workOrderIds
    });
  }
  async optimizeRoute(routeId) {
    return this.post(`/api/field-ops/routes/${routeId}/optimize`, {});
  }
  async getTechnicianRoute(technicianId, date) {
    return this.get(`/api/field-ops/technicians/${technicianId}/route`, {
      params: { date }
    });
  }
  async updateRouteStop(routeId, stopId, data) {
    return this.put(`/api/field-ops/routes/${routeId}/stops/${stopId}`, data);
  }
  // Time Tracking
  async startTimeEntry(data) {
    return this.post("/api/field-ops/time-entries", data);
  }
  async endTimeEntry(timeEntryId, endTime, location) {
    return this.put(`/api/field-ops/time-entries/${timeEntryId}/end`, {
      end_time: endTime,
      location
    });
  }
  async getTechnicianTimeEntries(technicianId, params) {
    return this.get(`/api/field-ops/technicians/${technicianId}/time-entries`, {
      params
    });
  }
  async approveTimeEntries(timeEntryIds) {
    return this.post("/api/field-ops/time-entries/approve", {
      time_entry_ids: timeEntryIds
    });
  }
  // Service Calls
  async getServiceCalls(params) {
    return this.get("/api/field-ops/service-calls", { params });
  }
  async createServiceCall(data) {
    return this.post("/api/field-ops/service-calls", data);
  }
  async assignServiceCall(callId, technicianId) {
    return this.post(`/api/field-ops/service-calls/${callId}/assign`, {
      technician_id: technicianId
    });
  }
  async escalateServiceCall(callId, reason, escalateTo) {
    return this.post(`/api/field-ops/service-calls/${callId}/escalate`, {
      reason,
      escalate_to: escalateTo
    });
  }
  async resolveServiceCall(callId, resolution) {
    return this.post(`/api/field-ops/service-calls/${callId}/resolve`, {
      resolution
    });
  }
  // Analytics & Reporting
  async getTechnicianPerformance(technicianId, params) {
    return this.get(`/api/field-ops/technicians/${technicianId}/performance`, {
      params
    });
  }
  async getFieldOpsMetrics(params) {
    return this.get("/api/field-ops/metrics", { params });
  }
  async getDispatchMetrics(date) {
    return this.get("/api/field-ops/dispatch/metrics", { params: { date } });
  }
  // Emergency & Priority Services
  async createEmergencyWorkOrder(data) {
    return this.post("/api/field-ops/emergency/work-order", data);
  }
  async dispatchNearestTechnician(location, skills) {
    return this.post("/api/field-ops/dispatch/nearest", { location, skills });
  }
  async broadcastUrgentCall(data) {
    return this.post("/api/field-ops/broadcast/urgent", data);
  }
};

// src/api/clients/NotificationsApiClient.ts
var NotificationsApiClient = class extends BaseApiClient {
  constructor(baseURL, defaultHeaders = {}) {
    super(baseURL, defaultHeaders);
  }
  // Templates
  async getTemplates(params) {
    return this.get("/api/notifications/templates", { params });
  }
  async getTemplate(templateId) {
    return this.get(`/api/notifications/templates/${templateId}`);
  }
  async createTemplate(data) {
    return this.post("/api/notifications/templates", data);
  }
  async updateTemplate(templateId, data) {
    return this.put(`/api/notifications/templates/${templateId}`, data);
  }
  async deleteTemplate(templateId) {
    return this.delete(`/api/notifications/templates/${templateId}`);
  }
  async testTemplate(templateId, testData) {
    return this.post(`/api/notifications/templates/${templateId}/test`, testData);
  }
  async previewTemplate(templateId, variables) {
    return this.post(`/api/notifications/templates/${templateId}/preview`, {
      variables
    });
  }
  // Notifications
  async getNotifications(params) {
    return this.get("/api/notifications", { params });
  }
  async getNotification(notificationId) {
    return this.get(`/api/notifications/${notificationId}`);
  }
  async sendNotification(data) {
    return this.post("/api/notifications/send", data);
  }
  async sendBulkNotifications(data) {
    return this.post("/api/notifications/send-bulk", data);
  }
  async cancelNotification(notificationId) {
    return this.post(`/api/notifications/${notificationId}/cancel`, {});
  }
  async retryNotification(notificationId) {
    return this.post(`/api/notifications/${notificationId}/retry`, {});
  }
  async markAsRead(notificationId) {
    return this.post(`/api/notifications/${notificationId}/read`, {});
  }
  async trackClick(notificationId, linkUrl) {
    return this.post(`/api/notifications/${notificationId}/click`, {
      link_url: linkUrl
    });
  }
  // Campaigns
  async getCampaigns(params) {
    return this.get("/api/notifications/campaigns", { params });
  }
  async getCampaign(campaignId) {
    return this.get(`/api/notifications/campaigns/${campaignId}`);
  }
  async createCampaign(data) {
    return this.post("/api/notifications/campaigns", data);
  }
  async updateCampaign(campaignId, data) {
    return this.put(`/api/notifications/campaigns/${campaignId}`, data);
  }
  async startCampaign(campaignId) {
    return this.post(`/api/notifications/campaigns/${campaignId}/start`, {});
  }
  async pauseCampaign(campaignId) {
    return this.post(`/api/notifications/campaigns/${campaignId}/pause`, {});
  }
  async resumeCampaign(campaignId) {
    return this.post(`/api/notifications/campaigns/${campaignId}/resume`, {});
  }
  async cancelCampaign(campaignId, reason) {
    return this.post(`/api/notifications/campaigns/${campaignId}/cancel`, {
      reason
    });
  }
  async getCampaignMetrics(campaignId) {
    return this.get(`/api/notifications/campaigns/${campaignId}/metrics`);
  }
  async getCampaignRecipients(campaignId, params) {
    return this.get(`/api/notifications/campaigns/${campaignId}/recipients`, {
      params
    });
  }
  // Alerts
  async getAlerts(params) {
    return this.get("/api/notifications/alerts", { params });
  }
  async getAlert(alertId) {
    return this.get(`/api/notifications/alerts/${alertId}`);
  }
  async createAlert(data) {
    return this.post("/api/notifications/alerts", data);
  }
  async acknowledgeAlert(alertId, acknowledgementNote) {
    return this.post(`/api/notifications/alerts/${alertId}/acknowledge`, {
      note: acknowledgementNote
    });
  }
  async resolveAlert(alertId, resolutionNote) {
    return this.post(`/api/notifications/alerts/${alertId}/resolve`, {
      note: resolutionNote
    });
  }
  async escalateAlert(alertId, escalationLevel) {
    return this.post(`/api/notifications/alerts/${alertId}/escalate`, {
      level: escalationLevel
    });
  }
  async snoozeAlert(alertId, snoozeUntil) {
    return this.post(`/api/notifications/alerts/${alertId}/snooze`, {
      snooze_until: snoozeUntil
    });
  }
  // User Preferences
  async getUserPreferences(userId) {
    return this.get(`/api/notifications/users/${userId}/preferences`);
  }
  async updateUserPreferences(userId, preferences) {
    return this.put(`/api/notifications/users/${userId}/preferences`, {
      preferences
    });
  }
  async optOut(userId, categories) {
    return this.post(`/api/notifications/users/${userId}/opt-out`, {
      categories
    });
  }
  async optIn(userId, categories) {
    return this.post(`/api/notifications/users/${userId}/opt-in`, {
      categories
    });
  }
  // Channel Management
  async getChannelStatus() {
    return this.get("/api/notifications/channels/status");
  }
  async testChannelConfiguration(channel, config) {
    return this.post("/api/notifications/channels/test", {
      channel,
      configuration: config
    });
  }
  // Analytics & Reporting
  async getNotificationMetrics(params) {
    return this.get("/api/notifications/metrics", { params });
  }
  async getChannelPerformance(params) {
    return this.get("/api/notifications/analytics/channel-performance", {
      params
    });
  }
  async getEngagementAnalytics(params) {
    return this.get("/api/notifications/analytics/engagement", { params });
  }
  // Webhooks & Real-time
  async subscribeToNotificationEvents(webhookUrl, events) {
    return this.post("/api/notifications/webhooks/subscribe", {
      webhook_url: webhookUrl,
      events
    });
  }
  async unsubscribeFromNotificationEvents(subscriptionId) {
    return this.delete(`/api/notifications/webhooks/subscriptions/${subscriptionId}`);
  }
};

// src/api/clients/ComplianceApiClient.ts
var ComplianceApiClient = class extends BaseApiClient {
  constructor(baseURL, defaultHeaders = {}) {
    super(baseURL, defaultHeaders);
  }
  // Compliance Policies
  async getPolicies(params) {
    return this.get("/api/compliance/policies", { params });
  }
  async getPolicy(policyId) {
    return this.get(`/api/compliance/policies/${policyId}`);
  }
  async createPolicy(data) {
    return this.post("/api/compliance/policies", data);
  }
  async updatePolicy(policyId, data) {
    return this.put(`/api/compliance/policies/${policyId}`, data);
  }
  async approvePolicy(policyId, approvalNotes) {
    return this.post(`/api/compliance/policies/${policyId}/approve`, {
      approval_notes: approvalNotes
    });
  }
  async suspendPolicy(policyId, reason) {
    return this.post(`/api/compliance/policies/${policyId}/suspend`, {
      reason
    });
  }
  // Compliance Controls
  async testControl(controlId, testResults) {
    return this.post(`/api/compliance/controls/${controlId}/test`, testResults);
  }
  async getControlStatus(params) {
    return this.get("/api/compliance/controls/status", { params });
  }
  async scheduleControlTest(controlId, scheduledDate) {
    return this.post(`/api/compliance/controls/${controlId}/schedule-test`, {
      scheduled_date: scheduledDate
    });
  }
  // Audit Logs
  async getAuditLogs(params) {
    return this.get("/api/compliance/audit-logs", { params });
  }
  async getAuditLog(logId) {
    return this.get(`/api/compliance/audit-logs/${logId}`);
  }
  async exportAuditLogs(params) {
    return this.post("/api/compliance/audit-logs/export", params);
  }
  async searchAuditLogs(query, params) {
    return this.post("/api/compliance/audit-logs/search", { query, ...params });
  }
  // Data Privacy Requests
  async getPrivacyRequests(params) {
    return this.get("/api/compliance/privacy-requests", { params });
  }
  async getPrivacyRequest(requestId) {
    return this.get(`/api/compliance/privacy-requests/${requestId}`);
  }
  async createPrivacyRequest(data) {
    return this.post("/api/compliance/privacy-requests", data);
  }
  async verifyPrivacyRequest(requestId, verificationMethod) {
    return this.post(`/api/compliance/privacy-requests/${requestId}/verify`, {
      verification_method: verificationMethod
    });
  }
  async processPrivacyRequest(requestId, data) {
    return this.post(`/api/compliance/privacy-requests/${requestId}/process`, data);
  }
  async completePrivacyRequest(requestId, completionNotes) {
    return this.post(`/api/compliance/privacy-requests/${requestId}/complete`, {
      completion_notes: completionNotes
    });
  }
  // Incident Management
  async getIncidents(params) {
    return this.get("/api/compliance/incidents", { params });
  }
  async getIncident(incidentId) {
    return this.get(`/api/compliance/incidents/${incidentId}`);
  }
  async createIncident(data) {
    return this.post("/api/compliance/incidents", data);
  }
  async updateIncident(incidentId, data) {
    return this.put(`/api/compliance/incidents/${incidentId}`, data);
  }
  async escalateIncident(incidentId, escalationReason, escalateTo) {
    return this.post(`/api/compliance/incidents/${incidentId}/escalate`, {
      escalation_reason: escalationReason,
      escalate_to: escalateTo
    });
  }
  async resolveIncident(incidentId, resolution) {
    return this.post(`/api/compliance/incidents/${incidentId}/resolve`, resolution);
  }
  // Regulatory Notifications
  async submitRegulatoryNotification(incidentId, notification) {
    return this.post(`/api/compliance/incidents/${incidentId}/notify`, notification);
  }
  async trackNotificationStatus(notificationId) {
    return this.get(`/api/compliance/notifications/${notificationId}`);
  }
  // Compliance Assessments
  async getAssessments(params) {
    return this.get("/api/compliance/assessments", { params });
  }
  async getAssessment(assessmentId) {
    return this.get(`/api/compliance/assessments/${assessmentId}`);
  }
  async createAssessment(data) {
    return this.post("/api/compliance/assessments", data);
  }
  async addAssessmentFinding(assessmentId, finding) {
    return this.post(`/api/compliance/assessments/${assessmentId}/findings`, finding);
  }
  async updateAssessmentFinding(assessmentId, findingId, data) {
    return this.put(`/api/compliance/assessments/${assessmentId}/findings/${findingId}`, data);
  }
  async completeAssessment(assessmentId, data) {
    return this.post(`/api/compliance/assessments/${assessmentId}/complete`, data);
  }
  // Action Items
  async createActionItem(assessmentId, actionItem) {
    return this.post(`/api/compliance/assessments/${assessmentId}/action-items`, actionItem);
  }
  async updateActionItem(actionItemId, data) {
    return this.put(`/api/compliance/action-items/${actionItemId}`, data);
  }
  async completeActionItem(actionItemId, completionEvidence) {
    return this.post(`/api/compliance/action-items/${actionItemId}/complete`, {
      completion_evidence: completionEvidence
    });
  }
  // Compliance Dashboard & Reporting
  async getComplianceDashboard(framework) {
    return this.get("/api/compliance/dashboard", { params: { framework } });
  }
  async generateComplianceReport(params) {
    return this.post("/api/compliance/reports/generate", params);
  }
  async getComplianceMetrics(params) {
    return this.get("/api/compliance/metrics", { params });
  }
};

// src/api/clients/LicensingApiClient.ts
var LicensingApiClient = class extends BaseApiClient {
  constructor(baseURL, defaultHeaders = {}) {
    super(baseURL, defaultHeaders);
  }
  // License Management
  async getLicenses(params) {
    return this.get("/api/licensing/licenses", { params });
  }
  async getLicense(licenseId) {
    return this.get(`/api/licensing/licenses/${licenseId}`);
  }
  async getLicenseByKey(licenseKey) {
    return this.get(`/api/licensing/licenses/by-key/${licenseKey}`);
  }
  async createLicense(data) {
    return this.post("/api/licensing/licenses", data);
  }
  async updateLicense(licenseId, data) {
    return this.put(`/api/licensing/licenses/${licenseId}`, data);
  }
  async renewLicense(licenseId, data) {
    return this.post(`/api/licensing/licenses/${licenseId}/renew`, data);
  }
  async suspendLicense(licenseId, reason) {
    return this.post(`/api/licensing/licenses/${licenseId}/suspend`, {
      reason
    });
  }
  async revokeLicense(licenseId, reason) {
    return this.post(`/api/licensing/licenses/${licenseId}/revoke`, { reason });
  }
  async transferLicense(licenseId, data) {
    return this.post(`/api/licensing/licenses/${licenseId}/transfer`, data);
  }
  // Activation Management
  async activateLicense(data) {
    return this.post("/api/licensing/activations", data);
  }
  async getActivations(params) {
    return this.get("/api/licensing/activations", { params });
  }
  async getActivation(activationId) {
    return this.get(`/api/licensing/activations/${activationId}`);
  }
  async validateActivation(activationToken) {
    return this.post("/api/licensing/activations/validate", {
      activation_token: activationToken
    });
  }
  async deactivateLicense(activationId, reason) {
    return this.post(`/api/licensing/activations/${activationId}/deactivate`, {
      reason
    });
  }
  async sendHeartbeat(activationToken, metrics) {
    return this.post("/api/licensing/activations/heartbeat", {
      activation_token: activationToken,
      metrics
    });
  }
  async getOfflineActivationRequest(licenseKey, deviceFingerprint) {
    return this.post("/api/licensing/activations/offline-request", {
      license_key: licenseKey,
      device_fingerprint: deviceFingerprint
    });
  }
  async processOfflineActivation(requestCode, responseCode) {
    return this.post("/api/licensing/activations/offline-activate", {
      request_code: requestCode,
      response_code: responseCode
    });
  }
  // License Templates
  async getTemplates(params) {
    return this.get("/api/licensing/templates", { params });
  }
  async getTemplate(templateId) {
    return this.get(`/api/licensing/templates/${templateId}`);
  }
  async createTemplate(data) {
    return this.post("/api/licensing/templates", data);
  }
  async updateTemplate(templateId, data) {
    return this.put(`/api/licensing/templates/${templateId}`, data);
  }
  async duplicateTemplate(templateId, newName) {
    return this.post(`/api/licensing/templates/${templateId}/duplicate`, {
      new_name: newName
    });
  }
  // License Orders
  async getOrders(params) {
    return this.get("/api/licensing/orders", { params });
  }
  async getOrder(orderId) {
    return this.get(`/api/licensing/orders/${orderId}`);
  }
  async createOrder(data) {
    return this.post("/api/licensing/orders", data);
  }
  async approveOrder(orderId, approvalNotes) {
    return this.post(`/api/licensing/orders/${orderId}/approve`, {
      approval_notes: approvalNotes
    });
  }
  async fulfillOrder(orderId) {
    return this.post(`/api/licensing/orders/${orderId}/fulfill`, {});
  }
  async cancelOrder(orderId, reason) {
    return this.post(`/api/licensing/orders/${orderId}/cancel`, { reason });
  }
  // Compliance & Auditing
  async getComplianceAudits(params) {
    return this.get("/api/licensing/compliance/audits", { params });
  }
  async getComplianceAudit(auditId) {
    return this.get(`/api/licensing/compliance/audits/${auditId}`);
  }
  async scheduleComplianceAudit(data) {
    return this.post("/api/licensing/compliance/audits", data);
  }
  async submitAuditFindings(auditId, findings) {
    return this.post(`/api/licensing/compliance/audits/${auditId}/findings`, {
      findings
    });
  }
  async resolveComplianceViolation(violationId, data) {
    return this.post(`/api/licensing/compliance/violations/${violationId}/resolve`, data);
  }
  async getComplianceStatus(customerId) {
    return this.get(`/api/licensing/compliance/status/${customerId}`);
  }
  // Usage Analytics & Reporting
  async generateUsageReport(params) {
    return this.post("/api/licensing/reports/usage", params);
  }
  async getLicenseUtilization(params) {
    return this.get("/api/licensing/analytics/utilization", { params });
  }
  async getFeatureUsageAnalytics(params) {
    return this.get("/api/licensing/analytics/feature-usage", { params });
  }
  async getExpiryAlerts(daysAhead = 30) {
    return this.get("/api/licensing/alerts/expiring", {
      params: { days_ahead: daysAhead }
    });
  }
  // License Validation & Security
  async validateLicenseKey(licenseKey) {
    return this.post("/api/licensing/validate", { license_key: licenseKey });
  }
  async checkLicenseIntegrity(licenseKey, signature) {
    return this.post("/api/licensing/integrity-check", {
      license_key: licenseKey,
      signature
    });
  }
  async generateEmergencyCode(licenseKey, reason) {
    return this.post("/api/licensing/emergency-code", {
      license_key: licenseKey,
      reason
    });
  }
  async blacklistDevice(deviceFingerprint, reason) {
    return this.post("/api/licensing/security/blacklist-device", {
      device_fingerprint: deviceFingerprint,
      reason
    });
  }
  async reportSuspiciousActivity(data) {
    return this.post("/api/licensing/security/report-activity", data);
  }
};

// src/api/clients/InventoryApiClient.ts
var InventoryApiClient = class extends BaseApiClient {
  constructor(baseURL, defaultHeaders = {}) {
    super(baseURL, defaultHeaders);
  }
  // Inventory Items
  async getInventoryItems(params) {
    return this.get("/api/inventory/items", { params });
  }
  async getInventoryItem(itemId) {
    return this.get(`/api/inventory/items/${itemId}`);
  }
  async createInventoryItem(data) {
    return this.post("/api/inventory/items", data);
  }
  async updateInventoryItem(itemId, data) {
    return this.put(`/api/inventory/items/${itemId}`, data);
  }
  async deleteInventoryItem(itemId) {
    return this.delete(`/api/inventory/items/${itemId}`);
  }
  async searchInventoryBySku(sku) {
    return this.get(`/api/inventory/items/search`, { params: { sku } });
  }
  async searchInventoryBySerial(serialNumber) {
    return this.get(`/api/inventory/items/search`, {
      params: { serial_number: serialNumber }
    });
  }
  // Stock Management
  async getStockLevels(params) {
    return this.get("/api/inventory/stock-levels", { params });
  }
  async getStockMovements(itemId, params) {
    const endpoint = itemId ? `/api/inventory/items/${itemId}/movements` : "/api/inventory/movements";
    return this.get(endpoint, { params });
  }
  async recordStockMovement(data) {
    return this.post("/api/inventory/movements", data);
  }
  async receiveStock(data) {
    return this.post("/api/inventory/receive", data);
  }
  async issueStock(data) {
    return this.post("/api/inventory/issue", data);
  }
  async transferStock(data) {
    return this.post("/api/inventory/transfer", data);
  }
  // Work Orders
  async getWorkOrders(params) {
    return this.get("/api/inventory/work-orders", { params });
  }
  async getWorkOrder(workOrderId) {
    return this.get(`/api/inventory/work-orders/${workOrderId}`);
  }
  async createWorkOrder(data) {
    return this.post("/api/inventory/work-orders", data);
  }
  async updateWorkOrder(workOrderId, data) {
    return this.put(`/api/inventory/work-orders/${workOrderId}`, data);
  }
  async assignEquipmentToWorkOrder(workOrderId, equipment) {
    return this.post(`/api/inventory/work-orders/${workOrderId}/assign-equipment`, { equipment });
  }
  async completeWorkOrder(workOrderId, data) {
    return this.post(`/api/inventory/work-orders/${workOrderId}/complete`, data);
  }
  // Asset Lifecycle
  async deployAsset(itemId, data) {
    return this.post(`/api/inventory/items/${itemId}/deploy`, data);
  }
  async returnAsset(itemId, data) {
    return this.post(`/api/inventory/items/${itemId}/return`, data);
  }
  async markAssetForMaintenance(itemId, data) {
    return this.post(`/api/inventory/items/${itemId}/maintenance`, data);
  }
  async retireAsset(itemId, reason) {
    return this.post(`/api/inventory/items/${itemId}/retire`, { reason });
  }
  // Vendors & Procurement
  async getVendors(params) {
    return this.get("/api/inventory/vendors", { params });
  }
  async createPurchaseOrder(data) {
    return this.post("/api/inventory/purchase-orders", data);
  }
  // Reports & Analytics
  async getInventoryReport(reportType, params) {
    return this.get(`/api/inventory/reports/${reportType.toLowerCase()}`, {
      params
    });
  }
  async getAssetUtilization(params) {
    return this.get("/api/inventory/analytics/utilization", { params });
  }
  async getLowStockAlerts() {
    return this.get("/api/inventory/alerts/low-stock");
  }
  async getWarrantyExpirations(params) {
    return this.get("/api/inventory/alerts/warranty-expiring", { params });
  }
  // Barcode & RFID
  async generateBarcode(itemId) {
    return this.post(`/api/inventory/items/${itemId}/barcode`, {});
  }
  async scanBarcode(barcode) {
    return this.get(`/api/inventory/scan/${barcode}`);
  }
  async bulkUpdateByBarcode(updates) {
    return this.post("/api/inventory/bulk-update", { updates });
  }
};

// src/api/clients/AnalyticsApiClient.ts
var AnalyticsApiClient = class extends BaseApiClient {
  constructor(baseURL, defaultHeaders = {}) {
    super(baseURL, defaultHeaders);
  }
  // Reports
  async getReports(params) {
    return this.get("/api/analytics/reports", { params });
  }
  async getReport(reportId) {
    return this.get(`/api/analytics/reports/${reportId}`);
  }
  async createReport(data) {
    return this.post("/api/analytics/reports", data);
  }
  async updateReport(reportId, data) {
    return this.put(`/api/analytics/reports/${reportId}`, data);
  }
  async deleteReport(reportId) {
    return this.delete(`/api/analytics/reports/${reportId}`);
  }
  async executeReport(reportId, parameters, format = "JSON") {
    return this.post(`/api/analytics/reports/${reportId}/execute`, {
      parameters,
      format
    });
  }
  async getReportExecution(executionId) {
    return this.get(`/api/analytics/executions/${executionId}`);
  }
  async getReportExecutions(reportId, params) {
    return this.get(`/api/analytics/reports/${reportId}/executions`, {
      params
    });
  }
  // Dashboards
  async getDashboards(params) {
    return this.get("/api/analytics/dashboards", { params });
  }
  async getDashboard(dashboardId) {
    return this.get(`/api/analytics/dashboards/${dashboardId}`);
  }
  async createDashboard(data) {
    return this.post("/api/analytics/dashboards", data);
  }
  async updateDashboard(dashboardId, data) {
    return this.put(`/api/analytics/dashboards/${dashboardId}`, data);
  }
  async deleteDashboard(dashboardId) {
    return this.delete(`/api/analytics/dashboards/${dashboardId}`);
  }
  // Dashboard Widgets
  async addWidget(dashboardId, widget) {
    return this.post(`/api/analytics/dashboards/${dashboardId}/widgets`, widget);
  }
  async updateWidget(dashboardId, widgetId, data) {
    return this.put(`/api/analytics/dashboards/${dashboardId}/widgets/${widgetId}`, data);
  }
  async deleteWidget(dashboardId, widgetId) {
    return this.delete(`/api/analytics/dashboards/${dashboardId}/widgets/${widgetId}`);
  }
  async getWidgetData(dashboardId, widgetId, params) {
    return this.get(`/api/analytics/dashboards/${dashboardId}/widgets/${widgetId}/data`, {
      params
    });
  }
  // Metrics
  async getMetrics(params) {
    return this.get("/api/analytics/metrics", { params });
  }
  async getMetricData(metricName, params) {
    return this.get(`/api/analytics/metrics/${metricName}/data`, { params });
  }
  async getMultiMetricData(metrics, params) {
    return this.post("/api/analytics/metrics/bulk", { metrics, ...params });
  }
  // Business Intelligence
  async getRevenueTrends(params) {
    return this.get("/api/analytics/bi/revenue-trends", { params });
  }
  async getCustomerAnalytics(params) {
    return this.get("/api/analytics/bi/customer-analytics", { params });
  }
  async getChurnAnalysis(params) {
    return this.get("/api/analytics/bi/churn-analysis", { params });
  }
  async getServicePerformance(params) {
    return this.get("/api/analytics/bi/service-performance", { params });
  }
  async getOperationalMetrics(params) {
    return this.get("/api/analytics/bi/operational-metrics", { params });
  }
  // Data Export
  async exportData(params) {
    return this.post("/api/analytics/export", params);
  }
  async getExportStatus(exportId) {
    return this.get(`/api/analytics/export/${exportId}/status`);
  }
  // Real-time Analytics
  async getRealTimeMetrics(metrics) {
    return this.post("/api/analytics/realtime", { metrics });
  }
  async subscribeToMetrics(metrics, callback) {
    const response = await this.post("/api/analytics/realtime/subscribe", {
      metrics
    });
    return response;
  }
};

// src/api/isp-client.ts
var ISPApiClient = class {
  constructor(config) {
    this.config = config;
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      "X-API-Version": "1.0",
      ...config.defaultHeaders
    };
    if (config.apiKey) {
      this.defaultHeaders["Authorization"] = `Bearer ${config.apiKey}`;
    }
    if (config.tenantId) {
      this.defaultHeaders["X-Tenant-ID"] = config.tenantId;
    }
    this.identity = new IdentityApiClient(config.baseURL, this.defaultHeaders);
    this.networking = new NetworkingApiClient(config.baseURL, this.defaultHeaders);
    this.billing = new BillingApiClient(config.baseURL, this.defaultHeaders);
    this.services = new ServicesApiClient(config.baseURL, this.defaultHeaders);
    this.support = new SupportApiClient(config.baseURL, this.defaultHeaders);
    this.resellers = new ResellersApiClient(config.baseURL, this.defaultHeaders);
    this.fieldOps = new FieldOpsApiClient(config.baseURL, this.defaultHeaders);
    this.notifications = new NotificationsApiClient(config.baseURL, this.defaultHeaders);
    this.compliance = new ComplianceApiClient(config.baseURL, this.defaultHeaders);
    this.licensing = new LicensingApiClient(config.baseURL, this.defaultHeaders);
    this.inventory = new InventoryApiClient(config.baseURL, this.defaultHeaders);
    this.analytics = new AnalyticsApiClient(config.baseURL, this.defaultHeaders);
  }
  buildQuery(params) {
    if (!params) return "";
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== void 0 && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }
  normalizeBody(body) {
    if (body === null || body === void 0) {
      return body ?? void 0;
    }
    if (typeof body === "string" || body instanceof URLSearchParams || body instanceof FormData) {
      return body;
    }
    if (body instanceof Blob || body instanceof ArrayBuffer) {
      return body;
    }
    if (ArrayBuffer.isView(body)) {
      return body;
    }
    return JSON.stringify(body);
  }
  async http(path, options = {}) {
    const url = `${this.baseURL}${path}`;
    const headers = {
      "Content-Type": "application/json",
      ...this.defaultHeaders,
      ...options.headers || {}
    };
    const normalizedBody = this.normalizeBody(options.body);
    const response = await fetch(url, {
      ...options,
      headers,
      body: normalizedBody ?? null
    });
    if (!response.ok) {
      const message = await response.text().catch(() => response.statusText);
      throw new Error(message || `Request failed with status ${response.status}`);
    }
    if (response.status === 204) {
      return {};
    }
    return await response.json();
  }
  // Convenience methods for common operations
  async getCustomers(params) {
    return this.identity.getCustomers(params);
  }
  async getCustomer(customerId, params) {
    return this.identity.getCustomer(customerId, params);
  }
  async getNetworkDevices(params) {
    return this.networking.getNetworkDevices(params);
  }
  async getBillingProcessors(params) {
    return this.billing.getBillingProcessors(params);
  }
  async getTransactions(params) {
    return this.billing.getTransactions(params);
  }
  async getTenant(tenantId) {
    return this.http(`/api/tenants/${tenantId}`);
  }
  async getTenantNotifications(tenantId, params) {
    return this.http(
      `/api/tenants/${tenantId}/notifications${this.buildQuery(params)}`
    );
  }
  async markNotificationRead(notificationId) {
    await this.http(`/api/tenants/notifications/${notificationId}/read`, { method: "POST" });
  }
  async markAllNotificationsRead(tenantId) {
    await this.http(`/api/tenants/${tenantId}/notifications/read-all`, { method: "POST" });
  }
  async dismissNotification(notificationId) {
    await this.http(`/api/tenants/notifications/${notificationId}/dismiss`, { method: "POST" });
  }
  // Legacy methods for backward compatibility
  async portalLogin(credentials) {
    return this.identity.authenticate(credentials);
  }
  async createPaymentIntent(data) {
    return this.billing.createPaymentIntent(data);
  }
  async getNetworkTopology(params) {
    return this.networking.getNetworkTopology(params);
  }
  // Identity module
  async getUsers(params) {
    return this.identity.getUsers(params);
  }
  async getUser(userId) {
    return this.identity.getUser(userId);
  }
  async createCustomer(customerData) {
    return this.identity.createCustomer(customerData);
  }
  // Billing module
  async getInvoices(params) {
    return this.billing.getInvoices(params);
  }
  async getInvoice(invoiceId) {
    return this.billing.getInvoice(invoiceId);
  }
  async getPayments(params) {
    return this.billing.getTransactions(params);
  }
  async processPayment(paymentData) {
    return this.billing.createPaymentIntent(paymentData);
  }
  async getSubscriptions(customerId) {
    const query = this.buildQuery(customerId ? { customerId } : void 0);
    return this.http(`/api/billing/subscriptions${query}`);
  }
  // Services module
  async getServiceCatalog(params) {
    return this.services.getServicePlans(params);
  }
  async getServiceInstances(customerId, params) {
    if (customerId) {
      return this.services.getCustomerServices(customerId, params);
    }
    return this.services.getServiceOrders(params);
  }
  async provisionService(order) {
    return this.services.createServiceOrder(order);
  }
  async getUsageTracking(serviceId, period) {
    const params = period ? { start_date: period } : {};
    return this.services.getServiceUsage(serviceId, params);
  }
  // Networking module
  async getNetworkDevice(deviceId) {
    return this.networking.getNetworkDevice(deviceId);
  }
  async getIPAMData(params) {
    return this.http(`/api/networking/ipam${this.buildQuery(params)}`);
  }
  async allocateIP(request) {
    return this.http("/api/networking/ipam/allocate", { method: "POST", body: request });
  }
  async getNetworkMonitoring() {
    return this.networking.getNetworkHealth();
  }
  // Sales module
  async getLeads(params) {
    return this.http(`/api/sales/leads${this.buildQuery(params)}`);
  }
  async createLead(lead) {
    return this.http("/api/sales/leads", { method: "POST", body: lead });
  }
  async getCRMData(customerId) {
    return this.http(`/api/sales/crm/${customerId}`);
  }
  async getCampaigns(params) {
    return this.http(`/api/sales/campaigns${this.buildQuery(params)}`);
  }
  async getSalesAnalytics(params) {
    return this.http(`/api/sales/analytics${this.buildQuery(params)}`);
  }
  // Support module
  async getSupportTickets(params) {
    return this.support.getTickets(params);
  }
  async getSupportTicket(ticketId) {
    return this.support.getTicket(ticketId);
  }
  async createSupportTicket(ticket) {
    return this.support.createTicket(ticket);
  }
  async updateSupportTicket(ticketId, updates) {
    return this.support.updateTicket(ticketId, updates);
  }
  async getKnowledgeBase(params) {
    return this.support.getKnowledgeArticles(params);
  }
  async getSLAMetrics(params) {
    return this.http(`/api/support/sla-metrics${this.buildQuery(params)}`);
  }
  // Resellers module
  async getResellers(params) {
    return this.resellers.getPartners(params);
  }
  async getReseller(partnerId) {
    return this.resellers.getPartner(partnerId);
  }
  async getResellerCommissions(params) {
    return this.resellers.getCommissionPayments(params);
  }
  async getResellerPerformance(params) {
    return this.resellers.getChannelPerformance(params);
  }
  // Analytics module
  async getBusinessIntelligence(params) {
    return this.analytics.getDashboards(params);
  }
  async getDataVisualization(dashboardId, params) {
    const widgetId = params?.widgetId;
    if (!widgetId) {
      throw new Error("widgetId is required to load visualization data");
    }
    const { widgetId: _, ...rest } = params ?? {};
    return this.analytics.getWidgetData(dashboardId, widgetId, rest);
  }
  async getCustomReports(params) {
    return this.analytics.getReports(params);
  }
  async generateReport(config) {
    return this.analytics.executeReport(config.reportId, config.parameters ?? {}, config.format);
  }
  // Inventory module
  async getInventoryItems(params) {
    return this.inventory.getInventoryItems(params);
  }
  async getWarehouseManagement(params) {
    return this.http(`/api/inventory/warehouses${this.buildQuery(params)}`);
  }
  async getProcurementOrders(params) {
    return this.http(`/api/inventory/procurement${this.buildQuery(params)}`);
  }
  // Field operations module
  async getWorkOrders(params) {
    return this.fieldOps.getWorkOrders(params);
  }
  async getWorkOrder(workOrderId) {
    return this.fieldOps.getWorkOrder(workOrderId);
  }
  async createWorkOrder(data) {
    return this.fieldOps.createWorkOrder(data);
  }
  async getTechnicians(params) {
    return this.fieldOps.getTechnicians(params);
  }
  async getTechnicianLocation(technicianId) {
    const technician = await this.fieldOps.getTechnician(technicianId);
    return {
      data: technician.data.current_location
    };
  }
  async updateTechnicianLocation(technicianId, location) {
    return this.fieldOps.updateTechnicianLocation(technicianId, location);
  }
  // Compliance module
  async getComplianceReports(params) {
    return this.http(`/api/compliance/reports${this.buildQuery(params)}`);
  }
  async getAuditTrail(params) {
    return this.http(`/api/compliance/audit-trail${this.buildQuery(params)}`);
  }
  async getDataProtectionStatus(params) {
    return this.http(`/api/compliance/data-protection${this.buildQuery(params)}`);
  }
  // Notifications module
  async getNotificationTemplates(params) {
    return this.notifications.getTemplates(params);
  }
  async sendEmail(payload) {
    return this.notifications.sendNotification({
      ...payload,
      channel: "EMAIL"
    });
  }
  async sendSMS(payload) {
    return this.notifications.sendNotification({
      ...payload,
      channel: "SMS"
    });
  }
  async getAutomationRules(params) {
    return this.http(`/api/automation/rules${this.buildQuery(params)}`);
  }
  // Licensing module
  async getLicenseInfo(params) {
    return this.http(`/api/licensing/licenses${this.buildQuery(params)}`);
  }
  async getFeatureEntitlements(params) {
    return this.http(`/api/licensing/entitlements${this.buildQuery(params)}`);
  }
  async validateLicense(payload) {
    return this.http("/api/licensing/validate", { method: "POST", body: payload });
  }
  // Dashboards
  async getAdminDashboard(params) {
    return this.http(`/api/dashboards/admin${this.buildQuery(params)}`);
  }
  async getCustomerDashboard(params) {
    return this.http(`/api/dashboards/customer${this.buildQuery(params)}`);
  }
  async getResellerDashboard(params) {
    return this.http(`/api/dashboards/reseller${this.buildQuery(params)}`);
  }
  async getTechnicianDashboard(params) {
    return this.http(`/api/dashboards/technician${this.buildQuery(params)}`);
  }
  // Configuration methods
  updateConfig(updates) {
    this.config = { ...this.config, ...updates };
    if (updates.apiKey) {
      this.defaultHeaders["Authorization"] = `Bearer ${updates.apiKey}`;
    }
    if (updates.tenantId) {
      this.defaultHeaders["X-Tenant-ID"] = updates.tenantId;
    }
  }
  getConfig() {
    return Object.freeze({ ...this.config });
  }
};
var globalClient = null;
function createISPApiClient(config) {
  return new ISPApiClient(config);
}
function setGlobalISPApiClient(client) {
  globalClient = client;
}
function getISPApiClient() {
  if (!globalClient) {
    throw new Error("ISP API client not initialized. Call setGlobalISPApiClient first.");
  }
  return globalClient;
}
var ispApiClient = {
  get: () => getISPApiClient(),
  create: createISPApiClient,
  setGlobal: setGlobalISPApiClient
};

// src/hooks/useISPTenant.ts
var ISPTenantContext = React6.createContext(null);
function useISPTenant() {
  const context = React6.useContext(ISPTenantContext);
  if (!context) {
    throw new Error("useISPTenant must be used within an ISPTenantProvider");
  }
  return context;
}
var useISPTenantProvider = useISPTenant;

// src/hooks/useStandardErrorHandler.ts
function useStandardErrorHandler(options) {
  const {
    context,
    enableRetry = DEFAULT_ERROR_CONFIG.maxRetries > 0,
    enableNotifications = DEFAULT_ERROR_CONFIG.enableUserNotifications,
    enableLogging = DEFAULT_ERROR_CONFIG.enableLogging,
    maxRetries = DEFAULT_ERROR_CONFIG.maxRetries,
    retryDelay = DEFAULT_ERROR_CONFIG.retryDelayMs,
    fallbackData,
    onError,
    onRetry,
    onMaxRetriesReached,
    onFallback
  } = options;
  const { showError, showWarning } = useNotifications();
  const { currentTenant } = useISPTenant();
  const [error2, setError] = React6.useState(null);
  const [isRetrying, setIsRetrying] = React6.useState(false);
  const [retryCount, setRetryCount] = React6.useState(0);
  const [hasReachedMaxRetries, setHasReachedMaxRetries] = React6.useState(false);
  const retryTimeoutRef = React6.useRef();
  const lastOperationRef = React6.useRef(null);
  React6.useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);
  const clearError = React6.useCallback(() => {
    setError(null);
    setRetryCount(0);
    setIsRetrying(false);
    setHasReachedMaxRetries(false);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = void 0;
    }
  }, []);
  const handleError = React6.useCallback(
    (rawError) => {
      const ispError = classifyError(rawError, context);
      if (enableLogging && deduplicateError(ispError)) {
        logError(ispError, {
          tenantId: currentTenant?.id,
          sessionId: typeof window !== "undefined" ? window.sessionStorage.getItem("sessionId") || void 0 : void 0
        });
      }
      if (enableNotifications) {
        if (ispError.severity === "critical" || ispError.severity === "high") {
          showError(ispError.userMessage, {
            persistent: true,
            actions: ispError.retryable ? [{ label: "Retry", action: () => retry() }] : void 0
          });
        } else if (ispError.severity === "medium") {
          showWarning(ispError.userMessage);
        }
      }
      setError(ispError);
      onError?.(ispError);
      return ispError;
    },
    [context, enableLogging, enableNotifications, currentTenant, showError, showWarning, onError]
  );
  const retry = React6.useCallback(async () => {
    if (!error2 || !lastOperationRef.current || !shouldRetry(error2, retryCount, maxRetries)) {
      return;
    }
    setIsRetrying(true);
    const currentRetryCount = retryCount + 1;
    setRetryCount(currentRetryCount);
    onRetry?.(currentRetryCount, error2);
    try {
      const delay = calculateRetryDelay(currentRetryCount - 1, retryDelay);
      await new Promise((resolve) => {
        retryTimeoutRef.current = setTimeout(resolve, delay);
      });
      if (lastOperationRef.current) {
        const result = await lastOperationRef.current();
        clearError();
        return result;
      }
    } catch (retryError) {
      const newError = handleError(retryError);
      if (currentRetryCount >= maxRetries) {
        setHasReachedMaxRetries(true);
        onMaxRetriesReached?.(newError);
        if (fallbackData !== void 0) {
          onFallback?.(fallbackData);
        }
      }
    } finally {
      setIsRetrying(false);
    }
  }, [
    error2,
    retryCount,
    maxRetries,
    retryDelay,
    onRetry,
    onMaxRetriesReached,
    fallbackData,
    onFallback,
    handleError,
    clearError
  ]);
  const withErrorHandling = React6.useCallback(
    async (operation) => {
      lastOperationRef.current = operation;
      try {
        clearError();
        const result = await operation();
        return result;
      } catch (operationError) {
        const ispError = handleError(operationError);
        if (enableRetry && shouldRetry(ispError, 0, maxRetries)) {
          try {
            return await retry();
          } catch (retryError) {
            handleError(retryError);
          }
        }
        if (fallbackData !== void 0 && (hasReachedMaxRetries || !ispError.retryable)) {
          onFallback?.(fallbackData);
          return fallbackData;
        }
        return null;
      }
    },
    [
      enableRetry,
      maxRetries,
      handleError,
      retry,
      fallbackData,
      onFallback,
      hasReachedMaxRetries,
      clearError
    ]
  );
  return {
    error: error2,
    isRetrying,
    retryCount,
    hasReachedMaxRetries,
    clearError,
    handleError,
    retry,
    withErrorHandling
  };
}
function useApiErrorHandler(context, options = {}) {
  return useStandardErrorHandler({
    ...options,
    context: `API: ${context}`,
    enableRetry: options.enableRetry ?? true,
    maxRetries: options.maxRetries ?? 3
  });
}
function useFormErrorHandler(formName, options = {}) {
  return useStandardErrorHandler({
    ...options,
    context: `Form: ${formName}`,
    enableRetry: options.enableRetry ?? false,
    enableNotifications: options.enableNotifications ?? true
  });
}
function useDataLoadingErrorHandler(dataType, options = {}) {
  return useStandardErrorHandler({
    ...options,
    context: `Data Loading: ${dataType}`,
    enableRetry: options.enableRetry ?? true,
    maxRetries: options.maxRetries ?? 2
  });
}
function useRealtimeErrorHandler(connectionType, options = {}) {
  return useStandardErrorHandler({
    ...options,
    context: `Realtime: ${connectionType}`,
    enableRetry: options.enableRetry ?? true,
    maxRetries: options.maxRetries ?? 5,
    retryDelay: options.retryDelay ?? 2e3
  });
}
function useUploadErrorHandler(uploadType, options = {}) {
  return useStandardErrorHandler({
    ...options,
    context: `Upload: ${uploadType}`,
    enableRetry: options.enableRetry ?? true,
    maxRetries: options.maxRetries ?? 2,
    retryDelay: options.retryDelay ?? 3e3
  });
}
var globalErrorConfig = {};
function configureGlobalErrorHandling2(config) {
  globalErrorConfig = { ...DEFAULT_ERROR_CONFIG, ...config };
}
function getGlobalErrorConfig() {
  return { ...DEFAULT_ERROR_CONFIG, ...globalErrorConfig };
}

// src/hooks/useErrorHandler.ts
var globalErrorHandler = null;
function setGlobalErrorHandler(handler) {
  globalErrorHandler = handler;
}
function useErrorBoundary() {
  const [error2, setError] = React6.useState(null);
  const resetError = React6.useCallback(() => {
    setError(null);
  }, []);
  const showError = React6.useCallback((err) => {
    setError(err);
    if (globalErrorHandler) {
      globalErrorHandler({ message: err.message, error: err });
    }
  }, []);
  return {
    error: error2,
    resetError,
    showError
  };
}

// src/api/config.ts
var defaultConfigs = {
  development: {
    baseUrl: "http://localhost:8000",
    timeout: 1e4,
    retryAttempts: 2,
    enableErrorLogging: true
  },
  staging: {
    baseUrl: "https://api-staging.dotmac.com",
    timeout: 15e3,
    retryAttempts: 3,
    enableErrorLogging: true
  },
  production: {
    baseUrl: "https://api.dotmac.com",
    timeout: 1e4,
    retryAttempts: 3,
    enableErrorLogging: false
  }
};
var currentClient = null;
var currentConfig = null;
function initializeApi(config) {
  const environment = process.env["NODE_ENV"] || "development";
  const baseConfig = defaultConfigs[environment];
  const envConfig = {};
  if (process.env["NEXT_PUBLIC_API_BASE_URL"]) {
    envConfig.baseUrl = process.env["NEXT_PUBLIC_API_BASE_URL"];
  }
  if (process.env["NEXT_PUBLIC_API_KEY"]) {
    envConfig.apiKey = process.env["NEXT_PUBLIC_API_KEY"];
  }
  if (process.env["NEXT_PUBLIC_TENANT_ID"]) {
    envConfig.tenantId = process.env["NEXT_PUBLIC_TENANT_ID"];
  }
  const finalConfig = {
    ...baseConfig,
    ...envConfig,
    ...config
  };
  Object.keys(finalConfig).forEach((key) => {
    const typedKey = key;
    if (finalConfig[typedKey] === void 0) {
      delete finalConfig[typedKey];
    }
  });
  currentClient = createApiClient({
    ...finalConfig,
    onUnauthorized: () => {
      if (currentClient) {
        currentClient.clearAuthToken();
      }
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (!currentPath.includes("/auth/login")) {
          window.location.href = "/auth/login";
        }
      }
    },
    onError: (_error) => {
      if (finalConfig.enableErrorLogging) ;
    }
  });
  currentConfig = finalConfig;
  if (finalConfig.enableErrorLogging) {
    setGlobalErrorHandler((_errorInfo) => {
    });
  }
  return currentClient;
}
function getApiConfig() {
  return currentConfig;
}
function isApiInitialized() {
  return currentClient !== null;
}
function requireApiClient() {
  if (!currentClient) {
    throw new Error("API client not initialized. Call initializeApi() first.");
  }
  return currentClient;
}
async function checkApiHealth() {
  if (!currentClient || !currentConfig) {
    return { available: false, error: "API client not initialized" };
  }
  const startTime = Date.now();
  try {
    await fetch(`${currentConfig.baseUrl}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5e3)
    });
    const latency = Date.now() - startTime;
    return { available: true, latency };
  } catch (error2) {
    return {
      available: false,
      latency: Date.now() - startTime,
      error: error2 instanceof Error ? error2.message : "Unknown error"
    };
  }
}
if (typeof window !== "undefined" && process.env["NEXT_PUBLIC_API_BASE_URL"]) {
  try {
    initializeApi();
  } catch (_error) {
  }
}
var globalClient2 = null;
function useApiClient(config) {
  return React6.useMemo(() => {
    try {
      return getApiClient();
    } catch {
      if (!globalClient2) {
        globalClient2 = createApiClient({
          baseUrl: "/api",
          defaultHeaders: {
            "Content-Type": "application/json"
          },
          timeout: 3e4,
          retries: 3,
          rateLimiting: true,
          caching: true,
          csrf: true,
          auth: {
            tokenHeader: "Authorization",
            refreshEndpoint: "/auth/refresh",
            autoRefresh: true
          },
          onError: (error2) => {
            console.error("API Error:", error2);
          },
          onUnauthorized: () => {
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          },
          ...config
        });
      }
      return globalClient2;
    }
  }, [config]);
}
var PartnerSchema = zod.z.object({
  id: zod.z.string().min(1),
  name: zod.z.string().min(2).max(100),
  partnerCode: zod.z.string().min(3).max(10).regex(/^[A-Z0-9]+$/),
  territory: zod.z.string().min(2).max(50),
  joinDate: zod.z.string().datetime(),
  status: zod.z.enum(["active", "inactive", "suspended", "pending"]),
  tier: zod.z.enum(["Bronze", "Silver", "Gold", "Platinum"]),
  contact: zod.z.object({
    name: zod.z.string().min(2).max(50),
    email: zod.z.string().email(),
    phone: zod.z.string().regex(/^\+?[1-9]\d{1,14}$/)
    // E.164 format
  })
});
var CustomerSchema = zod.z.object({
  id: zod.z.string().optional(),
  name: zod.z.string().min(2).max(100),
  email: zod.z.string().email(),
  phone: zod.z.string().regex(/^\+?[1-9]\d{1,14}$/),
  address: zod.z.string().min(10).max(200),
  plan: zod.z.enum(["residential_basic", "residential_premium", "business_pro", "enterprise"]),
  mrr: zod.z.number().min(0).max(1e4),
  status: zod.z.enum(["active", "pending", "suspended", "cancelled"]),
  joinDate: zod.z.string().datetime(),
  lastPayment: zod.z.string().datetime().nullable(),
  connectionStatus: zod.z.enum(["online", "offline"]),
  usage: zod.z.number().min(0).max(100)
});
zod.z.object({
  email: zod.z.string().email(),
  password: zod.z.string().min(8).max(128),
  partnerCode: zod.z.string().min(3).max(10).optional(),
  territory: zod.z.string().max(50).optional(),
  rememberMe: zod.z.boolean().optional(),
  mfaCode: zod.z.string().regex(/^\d{6}$/).optional()
  // 6-digit MFA code
});
var TerritoryValidationSchema = zod.z.object({
  address: zod.z.string().min(10).max(200),
  partnerId: zod.z.string().min(1)
});
var CreateCustomerSchema = CustomerSchema.omit({
  id: true,
  joinDate: true,
  lastPayment: true,
  connectionStatus: true,
  usage: true
}).extend({
  initialPlan: zod.z.string().optional(),
  promotionalCode: zod.z.string().max(20).optional()
});
var UpdateCustomerSchema = CustomerSchema.partial().omit({
  id: true,
  joinDate: true
});
zod.z.object({
  id: zod.z.string().min(1),
  customerId: zod.z.string().min(1),
  customerName: zod.z.string().min(2).max(100),
  period: zod.z.string().regex(/^\d{4}-\d{2}$/),
  // YYYY-MM format
  revenue: zod.z.number().min(0),
  commissionRate: zod.z.number().min(0).max(1),
  // 0-100% as decimal
  commissionAmount: zod.z.number().min(0),
  status: zod.z.enum(["pending", "paid", "disputed"]),
  payoutDate: zod.z.string().datetime().optional()
});
var CustomerQueryParamsSchema = zod.z.object({
  page: zod.z.number().min(1).default(1),
  limit: zod.z.number().min(1).max(100).default(10),
  search: zod.z.string().max(100).optional(),
  status: zod.z.enum(["active", "pending", "suspended", "cancelled"]).optional()
});
zod.z.object({
  page: zod.z.number().min(1).default(1),
  limit: zod.z.number().min(1).max(100).default(10),
  period: zod.z.string().regex(/^\d{4}(-\d{2})?$/).optional(),
  // YYYY or YYYY-MM
  status: zod.z.enum(["pending", "paid", "disputed"]).optional()
});
var DashboardDataSchema = zod.z.object({
  partner: PartnerSchema,
  performance: zod.z.object({
    customersTotal: zod.z.number().min(0),
    customersActive: zod.z.number().min(0),
    customersThisMonth: zod.z.number().min(0),
    revenue: zod.z.object({
      total: zod.z.number().min(0),
      thisMonth: zod.z.number().min(0),
      lastMonth: zod.z.number().min(0),
      growth: zod.z.number()
    }),
    commissions: zod.z.object({
      earned: zod.z.number().min(0),
      pending: zod.z.number().min(0),
      thisMonth: zod.z.number().min(0),
      lastPayout: zod.z.number().min(0),
      nextPayoutDate: zod.z.string().datetime()
    }),
    targets: zod.z.object({
      monthlyCustomers: zod.z.object({
        current: zod.z.number().min(0),
        target: zod.z.number().min(0),
        unit: zod.z.literal("customers")
      }),
      monthlyRevenue: zod.z.object({
        current: zod.z.number().min(0),
        target: zod.z.number().min(0),
        unit: zod.z.literal("revenue")
      }),
      quarterlyGrowth: zod.z.object({
        current: zod.z.number(),
        target: zod.z.number(),
        unit: zod.z.literal("percentage")
      })
    })
  }),
  recentCustomers: zod.z.array(
    CustomerSchema.extend({
      service: zod.z.string().min(1).max(50),
      commission: zod.z.number().min(0)
    })
  ).max(10),
  salesGoals: zod.z.array(
    zod.z.object({
      id: zod.z.string().min(1),
      title: zod.z.string().min(2).max(100),
      target: zod.z.number().min(0),
      current: zod.z.number().min(0),
      progress: zod.z.number().min(0).max(100),
      deadline: zod.z.string().datetime(),
      status: zod.z.enum(["active", "completed", "overdue"])
    })
  ).max(20)
});
zod.z.object({
  error: zod.z.string(),
  message: zod.z.string(),
  details: zod.z.any().optional(),
  timestamp: zod.z.string().datetime(),
  requestId: zod.z.string().optional()
});
var sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, "").slice(0, 1e3);
};
var sanitizeSearchTerm = (term) => {
  return term.trim().replace(/[^\w\s@.-]/g, "").slice(0, 100);
};

// src/api/partner-client.ts
var PartnerApiClient = class {
  constructor() {
    this._client = null;
  }
  get client() {
    if (!this._client) {
      this._client = getApiClient();
    }
    return this._client;
  }
  async getDashboard(partnerId) {
    const sanitizedPartnerId = sanitizeInput(partnerId);
    const response = await this.client.request(
      `/api/v1/partners/${sanitizedPartnerId}/dashboard`,
      {
        method: "GET"
      }
    );
    try {
      const validatedData = DashboardDataSchema.parse(response.data);
      return { ...response, data: validatedData };
    } catch (error2) {
      throw new Error(`Invalid dashboard data received: ${error2}`);
    }
  }
  async getCustomers(partnerId, params) {
    const sanitizedPartnerId = sanitizeInput(partnerId);
    const validatedParams = CustomerQueryParamsSchema.parse({
      page: params?.page,
      limit: params?.limit,
      search: params?.search ? sanitizeSearchTerm(params.search) : void 0,
      status: params?.status
    });
    const searchParams = new URLSearchParams();
    if (validatedParams.page) searchParams.append("page", validatedParams.page.toString());
    if (validatedParams.limit) searchParams.append("limit", validatedParams.limit.toString());
    if (validatedParams.search) searchParams.append("search", validatedParams.search);
    if (validatedParams.status) searchParams.append("status", validatedParams.status);
    const response = await this.client.request(`/api/v1/partners/${sanitizedPartnerId}/customers?${searchParams.toString()}`, {
      method: "GET"
    });
    if (response.data?.customers) {
      response.data.customers = response.data.customers.map(
        (customer) => CustomerSchema.parse(customer)
      );
    }
    return response;
  }
  async getCustomer(partnerId, customerId) {
    const sanitizedPartnerId = sanitizeInput(partnerId);
    const sanitizedCustomerId = sanitizeInput(customerId);
    const response = await this.client.request(
      `/api/v1/partners/${sanitizedPartnerId}/customers/${sanitizedCustomerId}`,
      {
        method: "GET"
      }
    );
    const validatedCustomer = CustomerSchema.parse(response.data);
    return { ...response, data: validatedCustomer };
  }
  async createCustomer(partnerId, customerData) {
    const sanitizedPartnerId = sanitizeInput(partnerId);
    const validatedData = CreateCustomerSchema.parse(customerData);
    const response = await this.client.request(
      `/api/v1/partners/${sanitizedPartnerId}/customers`,
      {
        method: "POST",
        body: JSON.stringify(validatedData)
      }
    );
    const validatedCustomer = CustomerSchema.parse(response.data);
    return { ...response, data: validatedCustomer };
  }
  async updateCustomer(partnerId, customerId, customerData) {
    const sanitizedPartnerId = sanitizeInput(partnerId);
    const sanitizedCustomerId = sanitizeInput(customerId);
    const validatedData = UpdateCustomerSchema.parse(customerData);
    const response = await this.client.request(
      `/api/v1/partners/${sanitizedPartnerId}/customers/${sanitizedCustomerId}`,
      {
        method: "PUT",
        body: JSON.stringify(validatedData)
      }
    );
    const validatedCustomer = CustomerSchema.parse(response.data);
    return { ...response, data: validatedCustomer };
  }
  async getCommissions(partnerId, params) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.period) searchParams.append("period", params.period);
    if (params?.status) searchParams.append("status", params.status);
    return this.client.request(`/api/v1/partners/${partnerId}/commissions?${searchParams.toString()}`, {
      method: "GET"
    });
  }
  async getAnalytics(partnerId, params) {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append("period", params.period);
    if (params?.metrics) {
      params.metrics.forEach((metric) => searchParams.append("metrics", metric));
    }
    return this.client.request(
      `/api/v1/partners/${partnerId}/analytics?${searchParams.toString()}`,
      {
        method: "GET"
      }
    );
  }
  async validateTerritory(partnerId, address) {
    const validatedData = TerritoryValidationSchema.parse({
      partnerId,
      address
    });
    return this.client.request(
      `/api/v1/partners/${validatedData.partnerId}/validate-territory`,
      {
        method: "POST",
        body: JSON.stringify({ address: validatedData.address })
      }
    );
  }
};
var _partnerApiClient = null;
function getPartnerApiClient() {
  if (!_partnerApiClient) {
    _partnerApiClient = new PartnerApiClient();
  }
  return _partnerApiClient;
}
var ErrorBoundary = class extends React6__namespace.default.Component {
  constructor(props) {
    super(props);
    this.resetErrorBoundary = () => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
    };
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  static getDerivedStateFromError(error2) {
    return {
      hasError: true,
      error: error2
    };
  }
  componentDidCatch(error2, errorInfo) {
    this.setState({
      errorInfo
    });
    this.props.onError?.(error2, errorInfo);
  }
  componentDidUpdate(prevProps) {
    const { resetOnPropsChange, resetKeys, children } = this.props;
    const { hasError } = this.state;
    if (hasError && resetOnPropsChange && prevProps.children !== children) {
      this.resetErrorBoundary();
      return;
    }
    if (hasError && resetKeys && prevProps.resetKeys && resetKeys.length === prevProps.resetKeys.length && resetKeys.some((key, index) => key !== prevProps.resetKeys?.[index])) {
      this.resetErrorBoundary();
    }
  }
  render() {
    const { hasError, error: error2, errorInfo } = this.state;
    const { children, fallback } = this.props;
    if (hasError && error2) {
      if (fallback) {
        return fallback(error2, errorInfo || void 0);
      }
      return /* @__PURE__ */ jsxRuntime.jsx(
        DefaultErrorFallback,
        {
          error: error2,
          errorInfo,
          resetError: this.resetErrorBoundary
        }
      );
    }
    return children;
  }
};
function DefaultErrorFallback({ error: error2, errorInfo, resetError }) {
  const isDevelopment = process.env["NODE_ENV"] === "development";
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-center", role: "alert", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100", children: /* @__PURE__ */ jsxRuntime.jsxs(
      "svg",
      {
        "aria-label": "icon",
        className: "h-6 w-6 text-red-600",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: "1.5",
        stroke: "currentColor",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("title", { children: "Icon" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "mt-4 font-medium text-gray-900 text-lg", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "mt-2 text-gray-600 text-sm", children: "We encountered an error while loading this page. Please try again or contact support if the problem persists." }),
    isDevelopment ? /* @__PURE__ */ jsxRuntime.jsxs("details", { className: "mt-4 text-left", children: [
      /* @__PURE__ */ jsxRuntime.jsx("summary", { className: "cursor-pointer font-medium text-gray-700 text-sm hover:text-gray-900", children: "Error Details (Development)" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-2 whitespace-pre-wrap rounded bg-gray-100 p-3 font-mono text-gray-800 text-xs", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "Error:" }),
          " ",
          error2.message
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "Stack:" }),
          " ",
          error2.stack
        ] }),
        errorInfo ? /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "Component Stack:" }),
          " ",
          errorInfo.componentStack
        ] }) : null
      ] })
    ] }) : null,
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-6 flex flex-col space-y-3", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          onClick: resetError,
          onKeyDown: (e) => e.key === "Enter" && resetError,
          className: "flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          children: "Try Again"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          onClick: () => window.location.reload(),
          className: "flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          children: "Reload Page"
        }
      )
    ] })
  ] }) }) }) });
}
function useErrorBoundaryHook() {
  return useErrorBoundary();
}
function withErrorBoundary(Component2, errorBoundaryProps) {
  const WrappedComponent = (props) => {
    return /* @__PURE__ */ jsxRuntime.jsx(ErrorBoundary, { ...errorBoundaryProps, children: /* @__PURE__ */ jsxRuntime.jsx(Component2, { ...props }) });
  };
  WrappedComponent.displayName = `withErrorBoundary(${Component2.displayName || Component2.name})`;
  return WrappedComponent;
}
function GenericErrorFallback({ error: error2, resetError, retry, isRetrying }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col items-center justify-center p-8 text-center", children: [
    /* @__PURE__ */ jsxRuntime.jsx(lucideReact.AlertCircle, { className: "mb-4 h-12 w-12 text-red-500" }),
    /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "mb-2 font-semibold text-gray-900 text-lg", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "mb-4 text-gray-600", children: error2?.message || "An unexpected error occurred" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex space-x-3", children: [
      retry ? /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          type: "button",
          onClick: retry,
          onKeyDown: (e) => e.key === "Enter" && retry,
          disabled: isRetrying,
          className: "flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(lucideReact.RefreshCw, { className: `mr-2 h-4 w-4 ${isRetrying ? "animate-spin" : ""}` }),
            isRetrying ? "Retrying..." : "Retry"
          ]
        }
      ) : null,
      resetError ? /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          onClick: resetError,
          onKeyDown: (e) => e.key === "Enter" && resetError,
          className: "rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700",
          children: "Reset"
        }
      ) : null
    ] })
  ] });
}
function NetworkErrorFallback({ resetError, retry, isRetrying }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col items-center justify-center p-8 text-center", children: [
    /* @__PURE__ */ jsxRuntime.jsx(lucideReact.WifiOff, { className: "mb-4 h-12 w-12 text-red-500" }),
    /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "mb-2 font-semibold text-gray-900 text-lg", children: "Connection Problem" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "mb-4 text-gray-600", children: "Unable to connect to our servers. Please check your internet connection and try again." }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex space-x-3", children: [
      retry ? /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          type: "button",
          onClick: retry,
          onKeyDown: (e) => e.key === "Enter" && retry,
          disabled: isRetrying,
          className: "flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(lucideReact.RefreshCw, { className: `mr-2 h-4 w-4 ${isRetrying ? "animate-spin" : ""}` }),
            isRetrying ? "Reconnecting..." : "Retry Connection"
          ]
        }
      ) : null,
      resetError ? /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          onClick: resetError,
          onKeyDown: (e) => e.key === "Enter" && resetError,
          className: "rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700",
          children: "Reset"
        }
      ) : null
    ] })
  ] });
}
function LoadingErrorFallback({ error: error2, resetError, retry, isRetrying }) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "rounded-lg border border-yellow-200 bg-yellow-50 p-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start", children: [
    /* @__PURE__ */ jsxRuntime.jsx(lucideReact.AlertCircle, { className: "mt-0.5 mr-3 h-5 w-5 text-yellow-600" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntime.jsx("h4", { className: "font-medium text-sm text-yellow-800", children: "Failed to load data" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "mt-1 text-sm text-yellow-700", children: error2?.message || "Unable to load the requested information" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-3 flex space-x-2", children: [
        retry ? /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: retry,
            onKeyDown: (e) => e.key === "Enter" && retry,
            disabled: isRetrying,
            className: "flex items-center rounded bg-yellow-600 px-3 py-1 text-white text-xs hover:bg-yellow-700 disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.RefreshCw, { className: `mr-1 h-3 w-3 ${isRetrying ? "animate-spin" : ""}` }),
              isRetrying ? "Retrying..." : "Retry"
            ]
          }
        ) : null,
        resetError ? /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            onClick: resetError,
            onKeyDown: (e) => e.key === "Enter" && resetError,
            className: "rounded bg-gray-600 px-3 py-1 text-white text-xs hover:bg-gray-700",
            children: "Reset"
          }
        ) : null
      ] })
    ] })
  ] }) });
}
function InlineErrorFallback({ error: error2, retry, isRetrying }) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-4 text-center", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntime.jsx(lucideReact.AlertCircle, { className: "mr-2 inline h-4 w-4 text-red-500" }),
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-red-700 text-sm", children: error2?.message || "Error loading content" }),
    retry ? /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        type: "button",
        onClick: retry,
        onKeyDown: (e) => e.key === "Enter" && retry,
        disabled: isRetrying,
        className: "ml-3 text-red-700 text-xs underline hover:text-red-900 disabled:opacity-50",
        children: isRetrying ? "Retrying..." : "Retry"
      }
    ) : null
  ] }) });
}
function EmptyStateFallback({
  title = "No data available",
  description = "There&apos;s nothing to show here yet.",
  action,
  actionLabel = "Try again"
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "py-12 text-center", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mx-auto mb-4 h-24 w-24 text-gray-400", children: /* @__PURE__ */ jsxRuntime.jsxs(
      "svg",
      {
        "aria-label": "icon",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: "1.5",
        stroke: "currentColor",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("title", { children: "Icon" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              d: "M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 4.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "mb-2 font-semibold text-gray-900 text-lg", children: title }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "mb-4 text-gray-600", children: description }),
    action ? /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        type: "button",
        onClick: action,
        onKeyDown: (e) => e.key === "Enter" && action,
        className: "rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700",
        children: actionLabel
      }
    ) : null
  ] });
}
function UnauthorizedFallback({
  onLogin,
  message = "You need to be logged in to access this content."
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "py-12 text-center", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mx-auto mb-4 h-12 w-12 text-yellow-500", children: /* @__PURE__ */ jsxRuntime.jsxs(
      "svg",
      {
        "aria-label": "icon",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: "1.5",
        stroke: "currentColor",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("title", { children: "Icon" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              d: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "mb-2 font-semibold text-gray-900 text-lg", children: "Access Required" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "mb-4 text-gray-600", children: message }),
    onLogin ? /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        type: "button",
        onClick: onLogin,
        onKeyDown: (e) => e.key === "Enter" && onLogin,
        className: "rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700",
        children: "Log In"
      }
    ) : null
  ] });
}
function MaintenanceFallback({
  estimatedTime,
  contactSupport
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "py-12 text-center", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mx-auto mb-4 h-12 w-12 text-orange-500", children: /* @__PURE__ */ jsxRuntime.jsxs(
      "svg",
      {
        "aria-label": "icon",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: "1.5",
        stroke: "currentColor",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("title", { children: "Icon" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              d: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "mb-2 font-semibold text-gray-900 text-lg", children: "Under Maintenance" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "mb-4 text-gray-600", children: "We're performing some maintenance to improve your experience. Please check back soon." }),
    estimatedTime ? /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "mb-4 text-gray-500 text-sm", children: [
      "Estimated completion: ",
      estimatedTime
    ] }) : null,
    contactSupport ? /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        type: "button",
        onClick: contactSupport,
        onKeyDown: (e) => e.key === "Enter" && contactSupport,
        className: "text-blue-600 text-sm underline hover:text-blue-800",
        children: "Contact Support"
      }
    ) : null
  ] });
}
function withErrorFallback(Component2, _fallbackComponent = GenericErrorFallback) {
  return function WrappedComponent(props) {
    return /* @__PURE__ */ jsxRuntime.jsx(Component2, { ...props });
  };
}
var AVAILABLE_METHODS = ["totp", "sms", "email", "backup_code"];
function MFASetup({ onComplete, onCancel }) {
  const [selectedMethod, setSelectedMethod] = React6.useState("totp");
  const [acknowledged, setAcknowledged] = React6.useState(false);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Shield, { className: "mx-auto mb-4 h-12 w-12 text-blue-600" }),
      /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "mb-2 font-semibold text-gray-900 text-lg", children: "Multi-Factor Authentication" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-gray-600", children: "Select the MFA method you want to use and complete the enrollment flow." })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "space-y-3", children: AVAILABLE_METHODS.map((method) => /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setSelectedMethod(method),
        className: `flex w-full items-center justify-between rounded-lg border px-4 py-2 text-left transition-colors ${selectedMethod === method ? "border-blue-500 bg-blue-50 text-blue-900" : "border-gray-200 bg-white text-gray-800"}`,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "capitalize", children: method.replace("_", " ") }),
          selectedMethod === method && /* @__PURE__ */ jsxRuntime.jsx(CheckIcon, {})
        ]
      },
      method
    )) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600", children: "Complete the enrollment process with your selected method. When the enrollment succeeds, confirm below." }),
    /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "flex items-center space-x-2 text-sm text-gray-700", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          type: "checkbox",
          className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500",
          checked: acknowledged,
          onChange: (event) => setAcknowledged(event.target.checked)
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: "I have finished configuring MFA for this user." })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          disabled: !acknowledged,
          onClick: onComplete,
          className: `flex-1 rounded-lg px-4 py-2 text-white transition-colors ${acknowledged ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`,
          children: "Continue"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          className: "flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50",
          children: "Cancel"
        }
      )
    ] })
  ] });
}
function MFAVerification({ method = "totp", onSuccess, onCancel }) {
  const [code, setCode] = React6.useState("");
  const [error2, setError] = React6.useState(null);
  const validateCode = () => {
    if (code.trim().length < 4) {
      setError("Enter the code provided by your authentication method.");
      return;
    }
    setError(null);
    onSuccess();
  };
  const label = (() => {
    switch (method) {
      case "sms":
        return "Enter the code we texted you";
      case "email":
        return "Enter the code we emailed you";
      case "backup_code":
        return "Enter one of your backup codes";
      default:
        return "Enter the code from your authenticator app";
    }
  })();
  const Icon = method === "sms" ? lucideReact.Smartphone : method === "email" ? lucideReact.Mail : lucideReact.Key;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: "mx-auto mb-4 h-12 w-12 text-blue-600" }),
      /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "mb-2 font-semibold text-gray-900 text-lg", children: "Verify your identity" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-gray-600", children: label })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          type: "text",
          value: code,
          onChange: (event) => setCode(event.target.value.trim()),
          className: "w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-center text-lg tracking-widest focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200",
          placeholder: method === "backup_code" ? "XXXX-XXXX" : "000000"
        }
      ),
      error2 && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-red-600", children: error2 })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          onClick: validateCode,
          className: "flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700",
          children: "Verify"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          className: "flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50",
          children: "Cancel"
        }
      )
    ] })
  ] });
}
function CheckIcon() {
  return /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs", children: "\u2713" });
}
var notificationIcons = {
  success: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.CheckCircle, { className: "h-5 w-5 text-green-600" }),
  error: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.AlertCircle, { className: "h-5 w-5 text-red-600" }),
  warning: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.AlertTriangle, { className: "h-5 w-5 text-yellow-600" }),
  info: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Info, { className: "h-5 w-5 text-blue-600" }),
  system: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Info, { className: "h-5 w-5 text-slate-600" })
};
var notificationColors = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  system: "bg-slate-50 border-slate-200 text-slate-800"
};
var NotificationRenderers = {
  icon: ({ type }) => notificationIcons[type],
  title: ({ title }) => /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-medium text-sm", children: title }),
  message: ({ message }) => message ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: "mt-1 text-sm opacity-90", children: message }) : null,
  closeButton: ({
    onDismiss,
    id,
    persistent
  }) => persistent ? null : /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      type: "button",
      onClick: () => onDismiss(id),
      className: "ml-4 inline-flex flex-shrink-0 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "h-4 w-4" })
    }
  ),
  actions: ({
    actions,
    onDismiss
  }) => actions && actions.length > 0 ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-3 flex space-x-2", children: actions.map((action, index) => {
    const handleActionClick = () => {
      action.action();
      if (!action.primary) {
        onDismiss();
      }
    };
    return /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        type: "button",
        onClick: handleActionClick,
        onKeyDown: (event) => event.key === "Enter" && handleActionClick(),
        className: `rounded-md px-3 py-1 font-medium text-xs transition-colors ${action.primary ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`,
        children: action.label
      },
      `action-${index}-${action.label}`
    );
  }) }) : null,
  persistentDismiss: ({
    onDismiss,
    persistent
  }) => persistent ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-3 flex justify-end", children: /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      type: "button",
      onClick: onDismiss,
      onKeyDown: (e) => e.key === "Enter" && onDismiss,
      className: "text-gray-500 text-xs hover:text-gray-700",
      children: "Dismiss"
    }
  ) }) : null,
  progressBar: ({ duration, persistent }) => duration && duration > 0 && !persistent ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-1 bg-gray-200", children: /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: "h-full bg-current opacity-30 transition-all ease-linear",
      style: {
        animationDuration: `${duration}ms`,
        animationName: "shrinkWidth",
        animationTimingFunction: "linear",
        animationFillMode: "forwards"
      }
    }
  ) }) : null
};
function NotificationComponent({ notification, onDismiss }) {
  const [isVisible, setIsVisible] = React6.useState(false);
  const [isExiting, setIsExiting] = React6.useState(false);
  React6.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300);
  };
  const renderHeader = () => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-shrink-0", children: NotificationRenderers.icon({ type: notification.type }) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ml-3 w-0 flex-1", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-between", children: [
      NotificationRenderers.title({ title: notification.title }),
      NotificationRenderers.closeButton({
        onDismiss,
        id: notification.id,
        persistent: notification.persistent ?? false
      })
    ] }) })
  ] });
  const renderBody = () => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    notification.message && NotificationRenderers.message({ message: notification.message }),
    notification.actions && NotificationRenderers.actions({ actions: notification.actions, onDismiss: handleDismiss })
  ] });
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: `transform transition-all duration-300 ease-in-out ${isVisible && !isExiting ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        ${isExiting ? "scale-95" : "scale-100"}max-w-sm pointer-events-auto w-full rounded-lg border bg-white shadow-lg ${notificationColors[notification.type]}
      `,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-start", children: renderHeader() }),
          renderBody(),
          NotificationRenderers.persistentDismiss({
            onDismiss: handleDismiss,
            persistent: notification.persistent ?? false
          })
        ] }),
        NotificationRenderers.progressBar({
          duration: notification.duration ?? 5e3,
          persistent: notification.persistent ?? false
        })
      ]
    }
  );
}
function NotificationContainer() {
  const { notifications, remove } = useNotifications();
  if (notifications.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("style", { children: `
        @keyframes shrinkWidth {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      ` }),
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        "aria-live": "assertive",
        className: "pointer-events-none fixed inset-0 z-50 flex items-end justify-end px-4 py-6 sm:p-6",
        children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex w-full flex-col items-center space-y-4 sm:items-end", children: [
          notifications.slice(0, 5).map((notification) => /* @__PURE__ */ jsxRuntime.jsx(
            NotificationComponent,
            {
              notification,
              onDismiss: remove
            },
            notification.id
          )),
          notifications.length > 5 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-full max-w-sm rounded-lg bg-gray-800 px-4 py-2 text-center text-white shadow-lg", children: /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "text-xs", children: [
            "+",
            notifications.length - 5,
            " more notifications"
          ] }) })
        ] })
      }
    )
  ] });
}
function NotificationProvider({ children }) {
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    children,
    /* @__PURE__ */ jsxRuntime.jsx(NotificationContainer, {})
  ] });
}
function useToast() {
  const { notify } = useNotifications();
  return {
    success: (message) => notify.success("Success", message),
    error: (message) => notify.error("Error", message),
    warning: (message) => notify.warning("Warning", message),
    info: (message) => notify.info("Info", message)
  };
}
var defaultAuthState = {
  user: null,
  portal: null,
  tenant: null,
  permissions: [],
  roles: [],
  isAuthenticated: false,
  isLoading: false,
  error: null,
  setAuthState: () => {
  }
};
var AuthContext = React6__namespace.createContext(defaultAuthState);
function useAuth() {
  return React6__namespace.useContext(AuthContext);
}

// src/hooks/usePermissions.ts
var COMMON_PERMISSIONS = {
  // User management
  USERS_VIEW: { resource: "users", action: "read" },
  USERS_CREATE: { resource: "users", action: "create" },
  USERS_UPDATE: { resource: "users", action: "update" },
  USERS_DELETE: { resource: "users", action: "delete" },
  // Billing operations
  BILLING_VIEW: { resource: "billing", action: "read" },
  BILLING_MANAGE: { resource: "billing", action: "write" },
  BILLING_REPORTS: { resource: "billing", action: "report" },
  PAYMENTS_PROCESS: { resource: "payments", action: "process" },
  INVOICES_CREATE: { resource: "invoices", action: "create" },
  INVOICES_SEND: { resource: "invoices", action: "send" },
  // Customer management
  CUSTOMERS_VIEW: { resource: "customers", action: "read" },
  CUSTOMERS_CREATE: { resource: "customers", action: "create" },
  CUSTOMERS_UPDATE: { resource: "customers", action: "update" },
  CUSTOMERS_DELETE: { resource: "customers", action: "delete" },
  // Network operations
  NETWORK_VIEW: { resource: "network", action: "read" },
  NETWORK_CONFIGURE: { resource: "network", action: "configure" },
  NETWORK_MONITOR: { resource: "network", action: "monitor" },
  DEVICES_MANAGE: { resource: "devices", action: "manage" },
  // Analytics and reporting
  ANALYTICS_VIEW: { resource: "analytics", action: "read" },
  REPORTS_VIEW: { resource: "reports", action: "read" },
  REPORTS_EXPORT: { resource: "reports", action: "export" },
  // System administration
  SYSTEM_CONFIG: { resource: "system", action: "configure" },
  SYSTEM_LOGS: { resource: "logs", action: "read" },
  SYSTEM_BACKUP: { resource: "system", action: "backup" },
  // Reseller operations
  TERRITORIES_MANAGE: { resource: "territories", action: "manage" },
  COMMISSIONS_VIEW: { resource: "commissions", action: "read" },
  PARTNERS_MANAGE: { resource: "partners", action: "manage" },
  // Support operations
  TICKETS_VIEW: { resource: "tickets", action: "read" },
  TICKETS_CREATE: { resource: "tickets", action: "create" },
  TICKETS_ASSIGN: { resource: "tickets", action: "assign" },
  TICKETS_RESOLVE: { resource: "tickets", action: "resolve" }
};
var PORTAL_CONTEXTS = {
  admin: {
    scope: "global",
    defaultPermissions: [
      COMMON_PERMISSIONS.SYSTEM_CONFIG,
      COMMON_PERMISSIONS.USERS_VIEW,
      COMMON_PERMISSIONS.BILLING_REPORTS,
      COMMON_PERMISSIONS.ANALYTICS_VIEW,
      COMMON_PERMISSIONS.SYSTEM_LOGS
    ]
  },
  customer: {
    scope: "customer",
    defaultPermissions: [
      COMMON_PERMISSIONS.BILLING_VIEW,
      { resource: "profile", action: "update" },
      { resource: "services", action: "read" },
      COMMON_PERMISSIONS.TICKETS_CREATE
    ]
  },
  reseller: {
    scope: "reseller",
    defaultPermissions: [
      COMMON_PERMISSIONS.CUSTOMERS_VIEW,
      COMMON_PERMISSIONS.CUSTOMERS_CREATE,
      COMMON_PERMISSIONS.TERRITORIES_MANAGE,
      COMMON_PERMISSIONS.COMMISSIONS_VIEW,
      COMMON_PERMISSIONS.BILLING_VIEW
    ]
  },
  technician: {
    scope: "tenant",
    defaultPermissions: [
      COMMON_PERMISSIONS.TICKETS_VIEW,
      COMMON_PERMISSIONS.TICKETS_ASSIGN,
      COMMON_PERMISSIONS.TICKETS_RESOLVE,
      COMMON_PERMISSIONS.NETWORK_VIEW,
      COMMON_PERMISSIONS.DEVICES_MANAGE
    ]
  },
  management: {
    scope: "global",
    defaultPermissions: [
      COMMON_PERMISSIONS.USERS_VIEW,
      COMMON_PERMISSIONS.BILLING_REPORTS,
      COMMON_PERMISSIONS.ANALYTICS_VIEW,
      COMMON_PERMISSIONS.REPORTS_VIEW,
      COMMON_PERMISSIONS.PARTNERS_MANAGE
    ]
  }
};
function usePermissions() {
  const { user, portal, tenantId } = useAuth();
  const portalKey = typeof portal === "string" ? portal : portal?.type;
  const apiClient = useApiClient();
  const userPermissions = React6.useMemo(() => {
    if (!user) return [];
    const directPermissions = (user.permissions || []).filter(Boolean);
    const rolePermissions = user.roles?.flatMap((role) => role.permissions || []) ?? [];
    const allPermissions = [...directPermissions, ...rolePermissions];
    const uniquePermissions = allPermissions.reduce((acc, permission) => {
      const key = `${permission.resource}:${permission.action}`;
      if (!acc.some((p) => `${p.resource}:${p.action}` === key)) {
        acc.push(permission);
      }
      return acc;
    }, []);
    return uniquePermissions;
  }, [user]);
  const hasPermission = React6.useCallback(
    (check, context) => {
      if (!user || !userPermissions.length) {
        return false;
      }
      if (user.isSuperAdmin || user.roles?.some((role) => role.name === "super_admin")) {
        return true;
      }
      const matchingPermission = userPermissions.find((permission) => {
        if (permission.resource !== check.resource || permission.action !== check.action) {
          return false;
        }
        if (permission.scope) {
          switch (permission.scope) {
            case "tenant":
              if (!tenantId || context?.tenantId && context.tenantId !== tenantId) {
                return false;
              }
              break;
            case "customer":
              if (!context?.customerId || context.customerId !== user.customerId) {
                return false;
              }
              break;
            case "reseller":
              if (!context?.resellerId || context.resellerId !== user.resellerId) {
                return false;
              }
              break;
          }
        }
        if (permission.conditions && context) {
          return Object.entries(permission.conditions).every(([key, value]) => {
            const contextValue = context[key];
            if (Array.isArray(value)) {
              return value.includes(contextValue);
            }
            return contextValue === value;
          });
        }
        return true;
      });
      return !!matchingPermission;
    },
    [user, userPermissions, tenantId]
  );
  const hasAllPermissions = React6.useCallback(
    (checks, context) => {
      return checks.every((check) => hasPermission(check, context));
    },
    [hasPermission]
  );
  const hasAnyPermission = React6.useCallback(
    (checks, context) => {
      return checks.some((check) => hasPermission(check, context));
    },
    [hasPermission]
  );
  const getResourcePermissions = React6.useCallback(
    (resource) => {
      return userPermissions.filter((permission) => permission.resource === resource);
    },
    [userPermissions]
  );
  const canAccessResource = React6.useCallback(
    (resource, context) => {
      return userPermissions.some((permission) => {
        if (permission.resource !== resource) return false;
        return hasPermission(
          {
            resource: permission.resource,
            action: permission.action
          },
          context
        );
      });
    },
    [userPermissions, hasPermission]
  );
  const portalPermissions = React6.useMemo(() => {
    if (!portalKey || !PORTAL_CONTEXTS[portalKey]) {
      return {
        canViewBilling: false,
        canManageUsers: false,
        canAccessReports: false,
        canManageCustomers: false,
        canConfigureSystem: false
      };
    }
    return {
      // Billing permissions
      canViewBilling: hasPermission(COMMON_PERMISSIONS.BILLING_VIEW),
      canManageBilling: hasPermission(COMMON_PERMISSIONS.BILLING_MANAGE),
      canProcessPayments: hasPermission(COMMON_PERMISSIONS.PAYMENTS_PROCESS),
      canCreateInvoices: hasPermission(COMMON_PERMISSIONS.INVOICES_CREATE),
      canSendInvoices: hasPermission(COMMON_PERMISSIONS.INVOICES_SEND),
      // User management permissions
      canViewUsers: hasPermission(COMMON_PERMISSIONS.USERS_VIEW),
      canManageUsers: hasPermission(COMMON_PERMISSIONS.USERS_CREATE) && hasPermission(COMMON_PERMISSIONS.USERS_UPDATE),
      canDeleteUsers: hasPermission(COMMON_PERMISSIONS.USERS_DELETE),
      // Customer management permissions
      canViewCustomers: hasPermission(COMMON_PERMISSIONS.CUSTOMERS_VIEW),
      canManageCustomers: hasPermission(COMMON_PERMISSIONS.CUSTOMERS_CREATE) && hasPermission(COMMON_PERMISSIONS.CUSTOMERS_UPDATE),
      canDeleteCustomers: hasPermission(COMMON_PERMISSIONS.CUSTOMERS_DELETE),
      // Analytics and reporting permissions
      canViewAnalytics: hasPermission(COMMON_PERMISSIONS.ANALYTICS_VIEW),
      canAccessReports: hasPermission(COMMON_PERMISSIONS.REPORTS_VIEW),
      canExportReports: hasPermission(COMMON_PERMISSIONS.REPORTS_EXPORT),
      canViewBillingReports: hasPermission(COMMON_PERMISSIONS.BILLING_REPORTS),
      // System administration permissions
      canConfigureSystem: hasPermission(COMMON_PERMISSIONS.SYSTEM_CONFIG),
      canViewLogs: hasPermission(COMMON_PERMISSIONS.SYSTEM_LOGS),
      canManageBackups: hasPermission(COMMON_PERMISSIONS.SYSTEM_BACKUP),
      // Network operations permissions
      canViewNetwork: hasPermission(COMMON_PERMISSIONS.NETWORK_VIEW),
      canConfigureNetwork: hasPermission(COMMON_PERMISSIONS.NETWORK_CONFIGURE),
      canMonitorNetwork: hasPermission(COMMON_PERMISSIONS.NETWORK_MONITOR),
      canManageDevices: hasPermission(COMMON_PERMISSIONS.DEVICES_MANAGE),
      // Reseller permissions
      canManageTerritories: hasPermission(COMMON_PERMISSIONS.TERRITORIES_MANAGE),
      canViewCommissions: hasPermission(COMMON_PERMISSIONS.COMMISSIONS_VIEW),
      canManagePartners: hasPermission(COMMON_PERMISSIONS.PARTNERS_MANAGE),
      // Support permissions
      canViewTickets: hasPermission(COMMON_PERMISSIONS.TICKETS_VIEW),
      canCreateTickets: hasPermission(COMMON_PERMISSIONS.TICKETS_CREATE),
      canAssignTickets: hasPermission(COMMON_PERMISSIONS.TICKETS_ASSIGN),
      canResolveTickets: hasPermission(COMMON_PERMISSIONS.TICKETS_RESOLVE)
    };
  }, [portalKey, hasPermission]);
  const refreshPermissions = React6.useCallback(async () => {
    try {
      const response = await apiClient.get(
        "/auth/permissions",
        { cache: true, cacheTTL: 5 * 60 * 1e3 }
        // Cache for 5 minutes
      );
      return response?.permissions ?? [];
    } catch (error2) {
      console.error("Failed to refresh permissions:", error2);
      return [];
    }
  }, [apiClient]);
  const checkPermissionWithAPI = React6.useCallback(
    async (check, context) => {
      const localResult = hasPermission(check, context);
      if (localResult) return true;
      try {
        const response = await apiClient.post("/auth/check-permission", {
          resource: check.resource,
          action: check.action,
          context: context || {}
        });
        return response?.allowed === true;
      } catch (error2) {
        console.error("Permission check API call failed:", error2);
        return false;
      }
    },
    [hasPermission, apiClient]
  );
  const getPermissionAwareMenuItems = React6.useCallback(
    (menuItems) => {
      return menuItems.filter((item) => {
        if (!item.permission && !item.permissions) return true;
        if (item.permission) {
          return hasPermission(item.permission);
        }
        if (item.permissions) {
          return item.requireAll ? hasAllPermissions(item.permissions) : hasAnyPermission(item.permissions);
        }
        return true;
      });
    },
    [hasPermission, hasAllPermissions, hasAnyPermission]
  );
  return {
    // Core data
    permissions: userPermissions,
    roles: user?.roles || [],
    // Permission checking functions
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    canAccessResource,
    getResourcePermissions,
    // Portal-specific permissions
    ...portalPermissions,
    // Async operations
    refreshPermissions,
    checkPermissionWithAPI,
    // Utility functions
    getPermissionAwareMenuItems,
    // Constants for easy access
    PERMISSIONS: COMMON_PERMISSIONS,
    // User context
    isAuthenticated: !!user,
    isSuperAdmin: user?.isSuperAdmin || false,
    currentPortal: portalKey,
    currentTenant: tenantId,
    userId: user?.id,
    userRoles: user?.roles?.map((role) => role.name) || []
  };
}

// src/utils/portalAuth.ts
var DEFAULT_PORTAL_TOKEN_KEY = "access_token";
var CUSTOMER_PORTAL_TOKEN_KEY = "customer_access_token";
var PortalAuthError = class extends Error {
  constructor(message, code = "PORTAL_AUTH_ERROR") {
    super(message);
    this.code = code;
    this.name = "PortalAuthError";
  }
};
var readTokenFromStorage = (tokenKey) => {
  if (typeof window === "undefined") {
    return null;
  }
  const storageReaders = [
    () => {
      try {
        return window.localStorage.getItem(tokenKey);
      } catch {
        return null;
      }
    },
    () => {
      try {
        return window.sessionStorage.getItem(tokenKey);
      } catch {
        return null;
      }
    }
  ];
  for (const reader of storageReaders) {
    const token = reader();
    if (token) {
      return token;
    }
  }
  return null;
};
var getPortalAuthToken = ({
  tokenKey = DEFAULT_PORTAL_TOKEN_KEY,
  required = true,
  missingTokenMessage
} = {}) => {
  const token = readTokenFromStorage(tokenKey);
  if (!token) {
    if (!required) {
      return null;
    }
    throw new PortalAuthError(
      missingTokenMessage ?? `Missing portal auth token for key "${tokenKey}".`
    );
  }
  return token;
};
var buildPortalAuthHeaders = ({
  headers,
  includeJsonContentType = true,
  ...tokenOptions
} = {}) => {
  const resolvedHeaders = new Headers(headers ?? void 0);
  const token = getPortalAuthToken(tokenOptions);
  if (token) {
    resolvedHeaders.set("Authorization", `Bearer ${token}`);
  }
  if (includeJsonContentType && !resolvedHeaders.has("Content-Type")) {
    resolvedHeaders.set("Content-Type", "application/json");
  }
  return resolvedHeaders;
};
var portalAuthFetch = (input, init = {}, options = {}) => {
  const headers = buildPortalAuthHeaders({
    headers: init.headers,
    includeJsonContentType: options.includeJsonContentType,
    tokenKey: options.tokenKey,
    required: options.required,
    missingTokenMessage: options.missingTokenMessage
  });
  const finalInit = {
    ...init,
    headers,
    credentials: options.credentials ?? init.credentials ?? "include"
  };
  return fetch(input, finalInit);
};
var createPortalAuthFetch = (tokenKey, defaults = {}) => {
  return (input, init = {}, options = {}) => {
    return portalAuthFetch(input, init, {
      tokenKey,
      ...defaults,
      ...options
    });
  };
};

// src/types/portal-auth.ts
var PORTAL_ID_CONFIG = {
  LENGTH: 8,
  VALIDATION_REGEX: /^[A-Z2-9]{8}$/
};
var RISK_THRESHOLDS = {
  LOW: 0,
  MEDIUM: 30,
  HIGH: 70,
  CRITICAL: 90
};

// src/hooks/usePortalIdAuth.ts
function usePortalIdAuth() {
  const portalAuthFetch2 = React6.useMemo(() => createPortalAuthFetch(DEFAULT_PORTAL_TOKEN_KEY), []);
  const [state, setState] = React6.useState({
    isAuthenticated: false,
    isLoading: false,
    error: null,
    portalAccount: null,
    session: null,
    customerData: null,
    technicianData: null,
    resellerData: null,
    permissions: [],
    requiresMfa: false,
    requiresPasswordChange: false
  });
  const validatePortalId = React6.useCallback((portalId) => {
    const errors = [];
    let formatted = portalId.toUpperCase().trim();
    formatted = formatted.replace(/[^A-Z2-9]/g, "");
    if (formatted.length !== PORTAL_ID_CONFIG.LENGTH) {
      errors.push(`Portal ID must be exactly ${PORTAL_ID_CONFIG.LENGTH} characters`);
    }
    if (!PORTAL_ID_CONFIG.VALIDATION_REGEX.test(formatted)) {
      errors.push("Portal ID contains invalid characters (use A-Z and 2-9 only)");
    }
    if (formatted.includes("0") || formatted.includes("O")) {
      errors.push("Portal ID cannot contain 0 or O (zero/oh confusion)");
    }
    if (formatted.includes("1") || formatted.includes("I")) {
      errors.push("Portal ID cannot contain 1 or I (one/eye confusion)");
    }
    return {
      is_valid: errors.length === 0,
      formatted,
      errors
    };
  }, []);
  const generateDeviceFingerprint = React6.useCallback(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillText("Portal ID fingerprint", 2, 2);
    }
    return {
      screen_resolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      user_agent_hash: btoa(navigator.userAgent).slice(0, 20),
      canvas_fingerprint: canvas.toDataURL().slice(-20)
    };
  }, []);
  const calculateRiskScore = React6.useCallback(
    (credentials, deviceFingerprint) => {
      let risk = 0;
      const storedFingerprint = localStorage.getItem(`device_fp_${credentials.portal_id}`);
      if (!storedFingerprint || storedFingerprint !== JSON.stringify(deviceFingerprint)) {
        risk += 20;
      }
      const storedTimezone = localStorage.getItem(`timezone_${credentials.portal_id}`);
      if (storedTimezone && storedTimezone !== deviceFingerprint.timezone) {
        risk += 30;
      }
      const failedAttempts = localStorage.getItem(`failed_attempts_${credentials.portal_id}`);
      if (failedAttempts && parseInt(failedAttempts) > 2) {
        risk += 25;
      }
      return Math.min(risk, 100);
    },
    []
  );
  const login = React6.useCallback(
    async (credentials) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const validation = validatePortalId(credentials.portal_id);
        if (!validation.is_valid) {
          throw {
            code: "INVALID_PORTAL_ID_FORMAT",
            message: validation.errors[0],
            details: { errors: validation.errors }
          };
        }
        const deviceFingerprint = generateDeviceFingerprint();
        const riskScore = calculateRiskScore(credentials, deviceFingerprint);
        const response = await fetch("/api/portal/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            portal_id: validation.formatted,
            password: credentials.password,
            mfa_code: credentials.mfa_code,
            device_fingerprint: deviceFingerprint,
            risk_score: riskScore,
            remember_device: credentials.remember_device || false
          })
        });
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.requires_2fa) {
            setState((prev) => ({ ...prev, requiresMfa: true }));
            throw {
              code: "MFA_REQUIRED",
              message: "Two-factor authentication required",
              requires_2fa: true
            };
          }
          if (errorData.account_locked) {
            throw {
              code: "ACCOUNT_LOCKED",
              message: `Account locked until ${errorData.locked_until}`,
              locked_until: errorData.locked_until
            };
          }
          if (errorData.password_expired) {
            setState((prev) => ({ ...prev, requiresPasswordChange: true }));
            throw {
              code: "PASSWORD_EXPIRED",
              message: "Password has expired and must be changed",
              password_expired: true
            };
          }
          const currentAttempts = parseInt(
            localStorage.getItem(`failed_attempts_${credentials.portal_id}`) || "0"
          );
          localStorage.setItem(
            `failed_attempts_${credentials.portal_id}`,
            (currentAttempts + 1).toString()
          );
          throw {
            code: errorData.code || "LOGIN_FAILED",
            message: errorData.message || "Invalid Portal ID or password",
            details: errorData
          };
        }
        const authData = await response.json();
        localStorage.setItem("portal_session", JSON.stringify(authData.session));
        localStorage.setItem("portal_account", JSON.stringify(authData.portal_account));
        localStorage.setItem("access_token", authData.access_token);
        localStorage.setItem("refresh_token", authData.refresh_token);
        localStorage.setItem(
          `device_fp_${credentials.portal_id}`,
          JSON.stringify(deviceFingerprint)
        );
        localStorage.setItem(`timezone_${credentials.portal_id}`, deviceFingerprint.timezone);
        localStorage.removeItem(`failed_attempts_${credentials.portal_id}`);
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          portalAccount: authData.portal_account,
          session: authData.session,
          customerData: authData.customer || null,
          technicianData: authData.technician || null,
          resellerData: authData.reseller || null,
          permissions: authData.permissions,
          requiresPasswordChange: authData.requires_password_change || false,
          requiresMfa: false,
          error: null
        }));
        return true;
      } catch (error2) {
        setState((prev) => ({
          ...prev,
          error: error2,
          isAuthenticated: false
        }));
        return false;
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [validatePortalId, generateDeviceFingerprint, calculateRiskScore]
  );
  const logout = React6.useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const session = localStorage.getItem("portal_session");
      if (session) {
        await portalAuthFetch2("/api/portal/v1/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ session_id: JSON.parse(session).session_id })
        });
      }
    } catch (error2) {
      console.warn("Logout request failed:", error2);
    } finally {
      localStorage.removeItem("portal_session");
      localStorage.removeItem("portal_account");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: null,
        portalAccount: null,
        session: null,
        customerData: null,
        technicianData: null,
        resellerData: null,
        permissions: [],
        requiresMfa: false,
        requiresPasswordChange: false
      });
    }
  }, []);
  const refreshSession = React6.useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return false;
    try {
      const response = await fetch("/api/portal/v1/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        return true;
      }
    } catch (error2) {
      console.error("Session refresh failed:", error2);
    }
    await logout();
    return false;
  }, [logout]);
  const checkSessionHealth = React6.useCallback(async () => {
    const session = localStorage.getItem("portal_session");
    const accessToken = localStorage.getItem("access_token");
    if (!session || !accessToken) return false;
    try {
      const response = await fetch("/api/portal/v1/auth/session/health", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.ok) {
        const healthData = await response.json();
        if (healthData.risk_score > RISK_THRESHOLDS.CRITICAL) {
          await logout();
          return false;
        }
        return healthData.is_healthy;
      }
    } catch (error2) {
      console.error("Session health check failed:", error2);
    }
    return false;
  }, [logout]);
  const updatePassword = React6.useCallback(
    async (currentPassword, newPassword) => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) return false;
      try {
        const response = await fetch("/api/portal/v1/auth/password/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword
          })
        });
        if (response.ok) {
          setState((prev) => ({ ...prev, requiresPasswordChange: false }));
          return true;
        }
      } catch (error2) {
        console.error("Password update failed:", error2);
      }
      return false;
    },
    []
  );
  const setupMfa = React6.useCallback(async (secret, code) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return false;
    try {
      const response = await fetch("/api/portal/v1/auth/mfa/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          secret,
          verification_code: code
        })
      });
      return response.ok;
    } catch (error2) {
      console.error("MFA setup failed:", error2);
    }
    return false;
  }, []);
  React6.useEffect(() => {
    const initAuth = async () => {
      const portalAccount = localStorage.getItem("portal_account");
      const session = localStorage.getItem("portal_session");
      const accessToken = localStorage.getItem("access_token");
      if (portalAccount && session && accessToken) {
        const isHealthy = await checkSessionHealth();
        if (isHealthy) {
          setState((prev) => ({
            ...prev,
            isAuthenticated: true,
            portalAccount: JSON.parse(portalAccount),
            session: JSON.parse(session)
            // Load other data from storage if needed
          }));
        }
      }
    };
    initAuth();
  }, [checkSessionHealth]);
  React6.useEffect(() => {
    if (state.isAuthenticated) {
      const interval = setInterval(checkSessionHealth, 5 * 60 * 1e3);
      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated, checkSessionHealth]);
  return {
    ...state,
    login,
    logout,
    refreshSession,
    validatePortalId,
    checkSessionHealth,
    updatePassword,
    setupMfa,
    generateDeviceFingerprint
  };
}
var ROUTE_CONFIGS = [
  // Admin Portal Routes
  {
    path: "/admin",
    allowedPortals: ["admin"],
    requiredRoles: [
      "super-admin",
      "tenant-admin",
      "network-engineer",
      "billing-manager",
      "support-manager"
    ],
    redirectTo: "/unauthorized"
  },
  {
    path: "/admin/customers",
    allowedPortals: ["admin"],
    requiredPermissions: ["customers:read"],
    requiredRoles: ["tenant-admin", "billing-manager", "support-agent", "customer-service"]
  },
  {
    path: "/admin/customers/create",
    allowedPortals: ["admin"],
    requiredPermissions: ["customers:create"],
    requiredRoles: ["tenant-admin", "billing-manager"]
  },
  {
    path: "/admin/network",
    allowedPortals: ["admin"],
    requiredPermissions: ["network:read"],
    requiredRoles: ["tenant-admin", "network-engineer"]
  },
  {
    path: "/admin/network/devices",
    allowedPortals: ["admin"],
    requiredPermissions: ["network:write", "devices:write"],
    requiredRoles: ["tenant-admin", "network-engineer"]
  },
  {
    path: "/admin/billing",
    allowedPortals: ["admin"],
    requiredPermissions: ["billing:read"],
    requiredRoles: ["tenant-admin", "billing-manager"]
  },
  {
    path: "/admin/billing/invoices",
    allowedPortals: ["admin"],
    requiredPermissions: ["billing:write", "invoices:write"],
    requiredRoles: ["tenant-admin", "billing-manager"]
  },
  {
    path: "/admin/support",
    allowedPortals: ["admin"],
    requiredPermissions: ["support:read"],
    requiredRoles: ["tenant-admin", "support-manager", "support-agent"]
  },
  {
    path: "/admin/analytics",
    allowedPortals: ["admin"],
    requiredPermissions: ["analytics:read"],
    requiredRoles: ["tenant-admin", "network-engineer", "billing-manager", "support-manager"]
  },
  {
    path: "/admin/workflows",
    allowedPortals: ["admin"],
    requiredPermissions: ["workflows:read"],
    requiredRoles: ["tenant-admin"]
  },
  {
    path: "/admin/audit",
    allowedPortals: ["admin"],
    requiredPermissions: ["audit:read"],
    requiredRoles: ["tenant-admin", "super-admin"]
  },
  {
    path: "/admin/security",
    allowedPortals: ["admin"],
    requiredPermissions: ["security:read"],
    requiredRoles: ["tenant-admin", "super-admin"]
  },
  {
    path: "/admin/settings",
    allowedPortals: ["admin"],
    requiredPermissions: ["settings:read"],
    requiredRoles: ["tenant-admin", "super-admin"]
  },
  // Customer Portal Routes
  {
    path: "/services",
    allowedPortals: ["customer"],
    requiredRoles: ["customer"],
    requiredPermissions: ["services:read"]
  },
  {
    path: "/usage",
    allowedPortals: ["customer"],
    requiredRoles: ["customer"],
    requiredPermissions: ["usage:read"]
  },
  {
    path: "/billing",
    allowedPortals: ["customer"],
    requiredRoles: ["customer"],
    requiredPermissions: ["billing:read"]
  },
  {
    path: "/support",
    allowedPortals: ["customer"],
    requiredRoles: ["customer"],
    requiredPermissions: ["support:create", "support:read"]
  },
  {
    path: "/documents",
    allowedPortals: ["customer"],
    requiredRoles: ["customer"],
    requiredPermissions: ["documents:read"]
  },
  // Reseller Portal Routes
  {
    path: "/customers",
    allowedPortals: ["reseller"],
    requiredRoles: ["reseller-admin", "reseller-agent"],
    requiredPermissions: ["customers:read"]
  },
  {
    path: "/onboarding",
    allowedPortals: ["reseller"],
    requiredRoles: ["reseller-admin", "reseller-agent"],
    requiredPermissions: ["customers:create"]
  },
  {
    path: "/commissions",
    allowedPortals: ["reseller"],
    requiredRoles: ["reseller-admin", "reseller-agent"],
    requiredPermissions: ["commissions:read"]
  },
  {
    path: "/analytics",
    allowedPortals: ["reseller"],
    requiredRoles: ["reseller-admin"],
    requiredPermissions: ["analytics:read"]
  },
  {
    path: "/goals",
    allowedPortals: ["reseller"],
    requiredRoles: ["reseller-admin", "reseller-agent"],
    requiredPermissions: ["goals:read"]
  },
  {
    path: "/territory",
    allowedPortals: ["reseller"],
    requiredRoles: ["reseller-admin"],
    requiredPermissions: ["territory:read"]
  },
  {
    path: "/resources",
    allowedPortals: ["reseller"],
    requiredRoles: ["reseller-admin", "reseller-agent"],
    requiredPermissions: ["resources:read"]
  },
  {
    path: "/partner",
    allowedPortals: ["reseller"],
    requiredRoles: ["reseller-admin", "reseller-agent"],
    requiredPermissions: ["partner:read"]
  }
];
var RouteMatchers = {
  findExactMatch: (path, configs) => configs.find((config) => config.exact !== false && config.path === path),
  findPrefixMatch: (path, configs) => configs.filter((config) => config.exact !== true).find((config) => path.startsWith(config.path)),
  findRouteConfig: (path) => {
    const exactMatch = RouteMatchers.findExactMatch(path, ROUTE_CONFIGS);
    if (exactMatch) {
      return exactMatch;
    }
    return RouteMatchers.findPrefixMatch(path, ROUTE_CONFIGS) || null;
  }
};
var AccessValidators = {
  checkAuthentication: (user) => {
    if (!user) {
      return {
        isAllowed: false,
        isLoading: false,
        redirectPath: "/",
        reason: "unauthenticated"
      };
    }
    return null;
  },
  checkPortalAccess: (config, currentPortal) => {
    if (config.allowedPortals && currentPortal) {
      if (!config.allowedPortals.includes(currentPortal.type)) {
        return {
          isAllowed: false,
          isLoading: false,
          redirectPath: RouteHelpers.getPortalDefaultRoute(currentPortal.type),
          reason: "portal_mismatch"
        };
      }
    }
    return null;
  },
  checkRoleAccess: (config, checkAnyRole, currentPortal) => {
    if (config.requiredRoles && config.requiredRoles.length > 0) {
      if (!checkAnyRole(config.requiredRoles)) {
        return {
          isAllowed: false,
          isLoading: false,
          redirectPath: config.redirectTo || RouteHelpers.getPortalDefaultRoute(currentPortal?.type),
          reason: "insufficient_role"
        };
      }
    }
    return null;
  },
  checkPermissionAccess: (config, hasAnyPermission, currentPortal) => {
    if (config.requiredPermissions && config.requiredPermissions.length > 0) {
      if (!hasAnyPermission(config.requiredPermissions)) {
        return {
          isAllowed: false,
          isLoading: false,
          redirectPath: config.redirectTo || RouteHelpers.getPortalDefaultRoute(currentPortal?.type),
          reason: "insufficient_permissions"
        };
      }
    }
    return null;
  },
  checkFeatureAccess: (config, hasFeature, currentPortal) => {
    if (config.requiredFeatures && config.requiredFeatures.length > 0) {
      const hasRequiredFeatures = config.requiredFeatures.every((feature) => hasFeature(feature));
      if (!hasRequiredFeatures) {
        return {
          isAllowed: false,
          isLoading: false,
          redirectPath: config.redirectTo || RouteHelpers.getPortalDefaultRoute(currentPortal?.type),
          reason: "missing_features"
        };
      }
    }
    return null;
  }
};
var RouteHelpers = {
  getPortalDefaultRoute: (portalType) => {
    switch (portalType) {
      case "admin":
      case "customer":
      case "reseller":
        return "/";
      default:
        return "/unauthorized";
    }
  }
};
function useRouteProtection() {
  const router = navigation.useRouter();
  const pathname = navigation.usePathname();
  const { user, currentPortal, isLoading: authLoading } = usePortalIdAuth();
  const { checkAnyRole, hasAnyPermission, _hasFeature } = usePermissions();
  const [protectionResult, setProtectionResult] = React6.useState({
    isAllowed: false,
    isLoading: true
  });
  const findRouteConfig = RouteMatchers.findRouteConfig;
  const checkAuthentication = React6.useCallback(
    () => AccessValidators.checkAuthentication(user),
    [user]
  );
  const checkPortalAccess = React6.useCallback(
    (config) => AccessValidators.checkPortalAccess(config, currentPortal),
    [currentPortal]
  );
  const checkRoleAccess = React6.useCallback(
    (config) => AccessValidators.checkRoleAccess(config, checkAnyRole, currentPortal),
    [checkAnyRole, currentPortal]
  );
  const checkPermissionAccess = React6.useCallback(
    (config) => AccessValidators.checkPermissionAccess(config, hasAnyPermission, currentPortal),
    [hasAnyPermission, currentPortal]
  );
  const checkFeatureAccess = React6.useCallback(
    (config) => AccessValidators.checkFeatureAccess(config, _hasFeature, currentPortal),
    [_hasFeature, currentPortal]
  );
  const checkRouteAccess = React6.useCallback(
    (config) => {
      const authResult = checkAuthentication();
      if (authResult) {
        return authResult;
      }
      const portalResult = checkPortalAccess(config);
      if (portalResult) {
        return portalResult;
      }
      const roleResult = checkRoleAccess(config);
      if (roleResult) {
        return roleResult;
      }
      const permissionResult = checkPermissionAccess(config);
      if (permissionResult) {
        return permissionResult;
      }
      const featureResult = checkFeatureAccess(config);
      if (featureResult) {
        return featureResult;
      }
      return {
        isAllowed: true,
        isLoading: false
      };
    },
    [
      checkAuthentication,
      checkPortalAccess,
      checkRoleAccess,
      checkPermissionAccess,
      checkFeatureAccess
    ]
  );
  React6.useEffect(() => {
    if (authLoading) {
      setProtectionResult({ isAllowed: false, isLoading: true });
      return;
    }
    const routeConfig = findRouteConfig(pathname);
    if (!routeConfig) {
      setProtectionResult({ isAllowed: true, isLoading: false });
      return;
    }
    const result = checkRouteAccess(routeConfig);
    setProtectionResult(result);
    if (!result.isAllowed && result.redirectPath && !result.isLoading) {
      router.push(result.redirectPath);
    }
  }, [pathname, authLoading, router, checkRouteAccess, findRouteConfig]);
  return protectionResult;
}
function useCustomRouteProtection(config) {
  const pathname = navigation.usePathname();
  const { user, currentPortal, isLoading: authLoading } = usePortalIdAuth();
  const { checkAnyRole, hasAnyPermission, _hasFeature } = usePermissions();
  const [protectionResult, setProtectionResult] = React6.useState({
    isAllowed: false,
    isLoading: true
  });
  const validateCustomRoute = React6.useCallback(() => {
    const routeConfig = { ...config, path: pathname };
    const authResult = AccessValidators.checkAuthentication(user);
    if (authResult) {
      return authResult;
    }
    const portalResult = AccessValidators.checkPortalAccess(routeConfig, currentPortal);
    if (portalResult) {
      return portalResult;
    }
    const roleResult = AccessValidators.checkRoleAccess(routeConfig, checkAnyRole, currentPortal);
    if (roleResult) {
      return roleResult;
    }
    const permissionResult = AccessValidators.checkPermissionAccess(
      routeConfig,
      hasAnyPermission,
      currentPortal
    );
    if (permissionResult) {
      return permissionResult;
    }
    const featureResult = AccessValidators.checkFeatureAccess(
      routeConfig,
      _hasFeature,
      currentPortal
    );
    if (featureResult) {
      return featureResult;
    }
    return { isAllowed: true, isLoading: false };
  }, [pathname, config, user, currentPortal, checkAnyRole, hasAnyPermission, _hasFeature]);
  React6.useEffect(() => {
    if (authLoading) {
      setProtectionResult({ isAllowed: false, isLoading: true });
      return;
    }
    const result = validateCustomRoute();
    setProtectionResult(result);
  }, [authLoading, validateCustomRoute]);
  return protectionResult;
}
function RouteGuard({
  children,
  requiredRoles,
  requiredPermissions,
  requiredFeatures,
  allowedPortals,
  fallback,
  loadingComponent,
  unauthorizedComponent
}) {
  const protection = useCustomRouteProtection({
    requiredRoles: requiredRoles ?? [],
    requiredPermissions: requiredPermissions ?? [],
    requiredFeatures: requiredFeatures ?? [],
    allowedPortals: allowedPortals ?? []
  });
  if (protection.isLoading) {
    return loadingComponent || /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-center p-8", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-6 w-6 animate-spin rounded-full border-blue-600 border-b-2" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ml-2 text-gray-600 text-sm", children: "Checking permissions..." })
    ] });
  }
  if (!protection.isAllowed) {
    if (unauthorizedComponent) {
      return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: unauthorizedComponent });
    }
    if (fallback) {
      return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: fallback });
    }
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100", children: /* @__PURE__ */ jsxRuntime.jsxs(
        "svg",
        {
          "aria-label": "icon",
          className: "h-6 w-6 text-red-600",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("title", { children: "Icon" }),
            /* @__PURE__ */ jsxRuntime.jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "mb-2 font-medium text-gray-900 text-lg", children: "Access Restricted" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-gray-600 text-sm", children: getAccessDeniedMessage(protection.reason) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children });
}
function AdminOnlyGuard({
  children,
  fallback
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    RouteGuard,
    {
      allowedPortals: ["admin"],
      requiredRoles: ["super-admin", "tenant-admin"],
      fallback,
      children
    }
  );
}
function CustomerOnlyGuard({
  children,
  fallback
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(RouteGuard, { allowedPortals: ["customer"], requiredRoles: ["customer"], fallback, children });
}
function ResellerOnlyGuard({
  children,
  fallback
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    RouteGuard,
    {
      allowedPortals: ["reseller"],
      requiredRoles: ["reseller-admin", "reseller-agent"],
      fallback,
      children
    }
  );
}
function NetworkEngineerGuard({
  children,
  fallback
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    RouteGuard,
    {
      allowedPortals: ["admin"],
      requiredRoles: ["tenant-admin", "network-engineer"],
      requiredPermissions: ["network:read"],
      fallback,
      children
    }
  );
}
function BillingManagerGuard({
  children,
  fallback
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    RouteGuard,
    {
      allowedPortals: ["admin"],
      requiredRoles: ["tenant-admin", "billing-manager"],
      requiredPermissions: ["billing:read"],
      fallback,
      children
    }
  );
}
function SupportAgentGuard({
  children,
  fallback
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    RouteGuard,
    {
      allowedPortals: ["admin"],
      requiredRoles: ["tenant-admin", "support-manager", "support-agent"],
      requiredPermissions: ["support:read"],
      fallback,
      children
    }
  );
}
function PermissionGuard({
  children,
  permissions,
  requireAll = false,
  fallback
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(RouteGuard, { requiredPermissions: permissions, fallback, children });
}
function FeatureGuard({
  children,
  features: features2,
  fallback
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(RouteGuard, { requiredFeatures: features2, fallback, children });
}
function getAccessDeniedMessage(reason) {
  switch (reason) {
    case "unauthenticated":
      return "Please sign in to view this content.";
    case "portal_mismatch":
      return "This content is not available in your current portal.";
    case "insufficient_role":
      return "Your role does not have access to this content.";
    case "insufficient_permissions":
      return "You do not have the required permissions to view this content.";
    case "missing_features":
      return "This feature is not available in your current plan.";
    default:
      return "You do not have permission to view this content.";
  }
}
function ISPTenantProvider({
  children,
  tenantId,
  autoLoadOnAuth = true
}) {
  const tenantHook = useISPTenantProvider();
  const { isAuthenticated, portalAccount, customerData, technicianData, resellerData } = usePortalIdAuth();
  const extractTenantId = (record) => record?.tenant_id ?? record?.tenantId;
  React6.useEffect(() => {
    if (!autoLoadOnAuth || !isAuthenticated || tenantHook.session) return;
    let targetTenantId = tenantId;
    if (!targetTenantId) {
      targetTenantId = extractTenantId(customerData) ?? extractTenantId(technicianData) ?? extractTenantId(resellerData) ?? extractTenantId(portalAccount);
    }
    if (targetTenantId) {
      tenantHook.loadTenant(targetTenantId).catch((err) => {
        console.error("Failed to auto-load tenant:", err);
      });
    }
  }, [
    isAuthenticated,
    tenantId,
    autoLoadOnAuth,
    tenantHook,
    tenantHook.session,
    customerData,
    technicianData,
    resellerData,
    portalAccount
  ]);
  React6.useEffect(() => {
    if (!isAuthenticated && tenantHook.session) {
      tenantHook.clearTenant();
    }
  }, [isAuthenticated, tenantHook]);
  React6.useEffect(() => {
    if (tenantHook.session) {
      tenantHook.applyBranding();
    }
  }, [tenantHook.session, tenantHook.applyBranding]);
  return /* @__PURE__ */ jsxRuntime.jsx(ISPTenantContext.Provider, { value: tenantHook, children });
}

// src/utils/operatorAuth.ts
var ACCESS_TOKEN_KEY = "access_token";
var REFRESH_TOKEN_KEY = "refresh_token";
var inMemoryAccessToken = null;
var safeSessionStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};
var safeLocalStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};
var readFromStorage = (storage, key) => {
  if (!storage) {
    return null;
  }
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};
var removeFromStorage = (storage, key) => {
  if (!storage) {
    return;
  }
  try {
    storage.removeItem(key);
  } catch {
  }
};
var setOperatorAccessToken = (token) => {
  const session = safeSessionStorage();
  const local = safeLocalStorage();
  if (token) {
    if (session) {
      try {
        session.setItem(ACCESS_TOKEN_KEY, token);
      } catch {
      }
    }
    inMemoryAccessToken = token;
  } else {
    removeFromStorage(session, ACCESS_TOKEN_KEY);
    inMemoryAccessToken = null;
  }
  removeFromStorage(local, ACCESS_TOKEN_KEY);
};
var getOperatorAccessToken = () => {
  const session = safeSessionStorage();
  const local = safeLocalStorage();
  const sessionToken = readFromStorage(session, ACCESS_TOKEN_KEY);
  if (sessionToken) {
    inMemoryAccessToken = sessionToken;
    return sessionToken;
  }
  const localToken = readFromStorage(local, ACCESS_TOKEN_KEY);
  if (localToken) {
    setOperatorAccessToken(localToken);
    return localToken;
  }
  return inMemoryAccessToken;
};
var clearOperatorAuthTokens = () => {
  const session = safeSessionStorage();
  const local = safeLocalStorage();
  removeFromStorage(session, ACCESS_TOKEN_KEY);
  removeFromStorage(local, ACCESS_TOKEN_KEY);
  removeFromStorage(session, REFRESH_TOKEN_KEY);
  removeFromStorage(local, REFRESH_TOKEN_KEY);
  inMemoryAccessToken = null;
};

// src/hooks/useWebSocket.ts
function useWebSocket(config = {}) {
  const { session } = useISPTenant();
  const { isAuthenticated } = usePortalIdAuth();
  const {
    url = process.env["NEXT_PUBLIC_WS_URL"] || "ws://localhost:8000/ws",
    reconnectInterval = 3e3,
    maxReconnectAttempts = 10,
    heartbeatInterval = 3e4,
    protocols = ["isp-protocol-v1"]
  } = config;
  const [isConnected, setIsConnected] = React6.useState(false);
  const [isConnecting, setIsConnecting] = React6.useState(false);
  const [error2, setError] = React6.useState(null);
  const [lastMessage, setLastMessage] = React6.useState(null);
  const [connectionQuality, setConnectionQuality] = React6.useState("offline");
  const wsRef = React6.useRef(null);
  const reconnectAttemptsRef = React6.useRef(0);
  const reconnectTimeoutRef = React6.useRef();
  const heartbeatTimeoutRef = React6.useRef();
  const subscribersRef = React6.useRef(/* @__PURE__ */ new Map());
  const pingStartTimeRef = React6.useRef(0);
  const buildWebSocketUrl = React6.useCallback(() => {
    const accessToken = getOperatorAccessToken();
    const tenantId = session?.tenant.id;
    const wsUrl = new URL(url);
    if (accessToken) {
      wsUrl.searchParams.set("token", accessToken);
    }
    if (tenantId) {
      wsUrl.searchParams.set("tenant_id", tenantId);
    }
    return wsUrl.toString();
  }, [url, session?.tenant.id]);
  const sendHeartbeat = React6.useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      pingStartTimeRef.current = Date.now();
      wsRef.current.send(
        JSON.stringify({
          type: "heartbeat",
          event: "ping",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          tenant_id: session?.tenant.id
        })
      );
    }
  }, [session?.tenant.id]);
  const startHeartbeat = React6.useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
    }
    heartbeatTimeoutRef.current = setInterval(sendHeartbeat, heartbeatInterval);
    sendHeartbeat();
  }, [sendHeartbeat, heartbeatInterval]);
  const stopHeartbeat = React6.useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = void 0;
    }
  }, []);
  const handleMessage = React6.useCallback((event) => {
    try {
      const message = JSON.parse(event.data);
      setLastMessage(message);
      setError(null);
      if (message.type === "heartbeat" && message.event === "pong") {
        const latency = Date.now() - pingStartTimeRef.current;
        if (latency < 100) {
          setConnectionQuality("excellent");
        } else if (latency < 300) {
          setConnectionQuality("good");
        } else {
          setConnectionQuality("poor");
        }
        return;
      }
      const eventSubscribers = subscribersRef.current.get(message.event);
      if (eventSubscribers) {
        eventSubscribers.forEach((callback) => callback(message.data));
      }
      const wildcardSubscribers = subscribersRef.current.get("*");
      if (wildcardSubscribers) {
        wildcardSubscribers.forEach((callback) => callback(message));
      }
    } catch (err) {
      console.error("Failed to parse WebSocket message:", err);
      setError("Invalid message format received");
    }
  }, []);
  const connect = React6.useCallback(() => {
    if (!isAuthenticated || !session) {
      return;
    }
    if (wsRef.current?.readyState === WebSocket.CONNECTING || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      const wsUrl = buildWebSocketUrl();
      wsRef.current = new WebSocket(wsUrl, protocols);
      wsRef.current.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionQuality("good");
        reconnectAttemptsRef.current = 0;
        setError(null);
        wsRef.current?.send(
          JSON.stringify({
            type: "auth",
            event: "authenticate",
            data: {
              tenant_id: session.tenant.id,
              user_id: session.user.id,
              portal_type: session.portal_type,
              permissions: session.permissions
            },
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          })
        );
        startHeartbeat();
      };
      wsRef.current.onmessage = handleMessage;
      wsRef.current.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionQuality("offline");
        stopHeartbeat();
        if (event.code !== 1e3 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(
            reconnectInterval * Math.pow(2, reconnectAttemptsRef.current),
            3e4
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        }
      };
      wsRef.current.onerror = (error3) => {
        console.error("WebSocket error:", error3);
        setError("Connection error occurred");
        setIsConnecting(false);
        setConnectionQuality("offline");
      };
    } catch (err) {
      setIsConnecting(false);
      setError(`Connection failed: ${err}`);
    }
  }, [
    isAuthenticated,
    session,
    buildWebSocketUrl,
    protocols,
    handleMessage,
    startHeartbeat,
    stopHeartbeat,
    reconnectInterval,
    maxReconnectAttempts
  ]);
  const disconnect = React6.useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    stopHeartbeat();
    if (wsRef.current) {
      wsRef.current.close(1e3, "Client disconnect");
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionQuality("offline");
    setError(null);
  }, [stopHeartbeat]);
  const reconnect = React6.useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    setTimeout(connect, 100);
  }, [disconnect, connect]);
  const sendMessage = React6.useCallback(
    (message) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const fullMessage = {
          type: message.type || "message",
          event: message.event || "generic",
          data: message.data || {},
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          tenant_id: session?.tenant.id,
          user_id: session?.user.id,
          ...message
        };
        wsRef.current.send(JSON.stringify(fullMessage));
      } else {
        setError("WebSocket is not connected");
      }
    },
    [session?.tenant.id, session?.user.id]
  );
  const subscribe = React6.useCallback((eventType, callback) => {
    if (!subscribersRef.current.has(eventType)) {
      subscribersRef.current.set(eventType, /* @__PURE__ */ new Set());
    }
    subscribersRef.current.get(eventType).add(callback);
    return () => {
      const subscribers = subscribersRef.current.get(eventType);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          subscribersRef.current.delete(eventType);
        }
      }
    };
  }, []);
  const unsubscribe = React6.useCallback((eventType) => {
    subscribersRef.current.delete(eventType);
  }, []);
  React6.useEffect(() => {
    if (isAuthenticated && session) {
      connect();
    } else {
      disconnect();
    }
    return () => {
      disconnect();
    };
  }, [isAuthenticated, session, connect, disconnect]);
  React6.useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);
  return {
    isConnected,
    isConnecting,
    error: error2,
    lastMessage,
    connectionQuality,
    sendMessage,
    subscribe,
    unsubscribe,
    reconnect,
    disconnect
  };
}
function useNetworkMonitoring() {
  const webSocket = useWebSocket();
  const [deviceUpdates, setDeviceUpdates] = React6.useState([]);
  const [networkAlerts, setNetworkAlerts] = React6.useState([]);
  React6.useEffect(() => {
    const unsubscribeDevices = webSocket.subscribe("device_status_update", (data) => {
      setDeviceUpdates((prev) => [data, ...prev.slice(0, 49)]);
    });
    const unsubscribeAlerts = webSocket.subscribe("network_alert", (data) => {
      setNetworkAlerts((prev) => [data, ...prev.slice(0, 19)]);
    });
    return () => {
      unsubscribeDevices();
      unsubscribeAlerts();
    };
  }, [webSocket]);
  return {
    ...webSocket,
    deviceUpdates,
    networkAlerts,
    clearDeviceUpdates: () => setDeviceUpdates([]),
    clearNetworkAlerts: () => setNetworkAlerts([])
  };
}
function useCustomerActivity() {
  const webSocket = useWebSocket();
  const [customerEvents, setCustomerEvents] = React6.useState([]);
  React6.useEffect(() => {
    const unsubscribeCustomers = webSocket.subscribe("customer_update", (data) => {
      setCustomerEvents((prev) => [data, ...prev.slice(0, 29)]);
    });
    const unsubscribeServices = webSocket.subscribe("service_update", (data) => {
      setCustomerEvents((prev) => [data, ...prev.slice(0, 29)]);
    });
    return () => {
      unsubscribeCustomers();
      unsubscribeServices();
    };
  }, [webSocket]);
  return {
    ...webSocket,
    customerEvents,
    clearCustomerEvents: () => setCustomerEvents([])
  };
}
function useFieldOperations() {
  const webSocket = useWebSocket();
  const [workOrderUpdates, setWorkOrderUpdates] = React6.useState([]);
  const [technicianLocations, setTechnicianLocations] = React6.useState(/* @__PURE__ */ new Map());
  React6.useEffect(() => {
    const unsubscribeWorkOrders = webSocket.subscribe("work_order_update", (data) => {
      setWorkOrderUpdates((prev) => [data, ...prev.slice(0, 19)]);
    });
    const unsubscribeTechLocations = webSocket.subscribe("technician_location_update", (data) => {
      setTechnicianLocations((prev) => new Map(prev.set(data.technician_id, data)));
    });
    return () => {
      unsubscribeWorkOrders();
      unsubscribeTechLocations();
    };
  }, [webSocket]);
  return {
    ...webSocket,
    workOrderUpdates,
    technicianLocations: Array.from(technicianLocations.values()),
    clearWorkOrderUpdates: () => setWorkOrderUpdates([]),
    clearTechnicianLocations: () => setTechnicianLocations(/* @__PURE__ */ new Map())
  };
}
var RealTimeContext = React6.createContext(null);
function useRealTime() {
  const context = React6.useContext(RealTimeContext);
  if (!context) {
    throw new Error("useRealTime must be used within a RealTimeProvider");
  }
  return context;
}
function RealTimeProvider({ children, enabled = true }) {
  const webSocket = useWebSocket();
  const networkMonitoring = useNetworkMonitoring();
  const customerActivity = useCustomerActivity();
  const fieldOperations = useFieldOperations();
  if (!enabled) {
    const mockContext = {
      isConnected: false,
      isConnecting: false,
      connectionQuality: "offline",
      error: null,
      deviceUpdates: [],
      networkAlerts: [],
      customerEvents: [],
      workOrderUpdates: [],
      technicianLocations: [],
      reconnect: () => {
      },
      sendMessage: () => {
      },
      subscribe: () => () => {
      }
    };
    return /* @__PURE__ */ jsxRuntime.jsx(RealTimeContext.Provider, { value: mockContext, children });
  }
  const contextValue = {
    isConnected: webSocket.isConnected,
    isConnecting: webSocket.isConnecting,
    connectionQuality: webSocket.connectionQuality,
    error: webSocket.error,
    deviceUpdates: networkMonitoring.deviceUpdates,
    networkAlerts: networkMonitoring.networkAlerts,
    customerEvents: customerActivity.customerEvents,
    workOrderUpdates: fieldOperations.workOrderUpdates,
    technicianLocations: fieldOperations.technicianLocations,
    reconnect: webSocket.reconnect,
    sendMessage: webSocket.sendMessage,
    subscribe: webSocket.subscribe
  };
  return /* @__PURE__ */ jsxRuntime.jsx(RealTimeContext.Provider, { value: contextValue, children });
}
function RealTimeStatus({ showDetails = false, className = "" }) {
  const { isConnected, isConnecting, connectionQuality, error: error2, reconnect } = useRealTime();
  const getStatusInfo = () => {
    if (error2) {
      return {
        icon: lucideReact.AlertTriangle,
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-200",
        status: "Error",
        description: error2
      };
    }
    if (isConnecting) {
      return {
        icon: lucideReact.Clock,
        color: "text-yellow-500",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        status: "Connecting",
        description: "Establishing real-time connection..."
      };
    }
    if (!isConnected) {
      return {
        icon: lucideReact.WifiOff,
        color: "text-gray-500",
        bg: "bg-gray-50",
        border: "border-gray-200",
        status: "Offline",
        description: "Real-time updates unavailable"
      };
    }
    switch (connectionQuality) {
      case "excellent":
        return {
          icon: lucideReact.CheckCircle,
          color: "text-green-500",
          bg: "bg-green-50",
          border: "border-green-200",
          status: "Excellent",
          description: "Real-time updates active (< 100ms)"
        };
      case "good":
        return {
          icon: lucideReact.Wifi,
          color: "text-blue-500",
          bg: "bg-blue-50",
          border: "border-blue-200",
          status: "Good",
          description: "Real-time updates active (< 300ms)"
        };
      case "poor":
        return {
          icon: lucideReact.AlertTriangle,
          color: "text-orange-500",
          bg: "bg-orange-50",
          border: "border-orange-200",
          status: "Poor",
          description: "Slow connection (> 300ms)"
        };
      default:
        return {
          icon: lucideReact.WifiOff,
          color: "text-gray-500",
          bg: "bg-gray-50",
          border: "border-gray-200",
          status: "Unknown",
          description: "Connection status unknown"
        };
    }
  };
  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;
  if (!showDetails) {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `flex items-center space-x-2 ${className}`, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: `w-4 h-4 ${statusInfo.color}` }),
        isConnected && /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            className: `absolute -top-1 -right-1 w-2 h-2 rounded-full ${connectionQuality === "excellent" ? "bg-green-400" : connectionQuality === "good" ? "bg-blue-400" : "bg-orange-400"} animate-pulse`
          }
        )
      ] }),
      showDetails && /* @__PURE__ */ jsxRuntime.jsx("span", { className: `text-sm font-medium ${statusInfo.color}`, children: statusInfo.status })
    ] });
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `${statusInfo.bg} ${statusInfo.border} border rounded-lg p-3 ${className}`, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
      /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: `w-5 h-5 ${statusInfo.color}` }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsxs("p", { className: `text-sm font-medium ${statusInfo.color}`, children: [
          "Real-Time: ",
          statusInfo.status
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs text-gray-600", children: statusInfo.description })
      ] })
    ] }),
    error2 && /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        onClick: reconnect,
        className: "px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors",
        children: "Retry"
      }
    )
  ] }) });
}

// src/api/clients/AuditApiClient.ts
var AuditApiClient = class extends BaseApiClient {
  constructor(baseURL, headers = {}) {
    super(baseURL, headers, "AuditAPI");
  }
  /**
   * Log an audit event to the backend
   */
  async logEvent(event) {
    return this.post("/audit/events", event);
  }
  /**
   * Log multiple audit events in a batch
   */
  async logEventsBatch(events) {
    return this.post("/audit/events/batch", {
      events
    });
  }
  /**
   * Query audit events with filtering
   */
  async queryEvents(query = {}) {
    const config = { params: query };
    return this.get("/audit/events", config);
  }
  /**
   * Stream audit events (Server-Sent Events)
   */
  async streamEvents(query = {}) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== void 0) {
        params.append(key, String(value));
      }
    });
    const url = `${this.baseURL}/audit/events/stream?${params.toString()}`;
    return new EventSource(url);
  }
  /**
   * Export audit events
   */
  async exportEvents(format, query = {}) {
    const config = {
      params: { ...query, format },
      headers: { Accept: format === "csv" ? "text/csv" : "application/json" }
    };
    return this.get("/audit/events/export", config);
  }
  /**
   * Get audit system health
   */
  async getHealth() {
    return this.get("/audit/health");
  }
  /**
   * Get audit metrics
   */
  async getMetrics() {
    return this.get("/audit/metrics");
  }
  /**
   * Get compliance report
   */
  async getComplianceReport(framework) {
    const config = framework ? { params: { framework } } : {};
    return this.get("/audit/compliance/report", config);
  }
};

// src/hooks/useAuditLogger.ts
function useAuditLogger(config) {
  const {
    serviceName,
    batchSize = 10,
    batchTimeout = 5e3,
    enableLocalStorage = true,
    enableConsoleLogging = false
  } = config;
  const { tenant } = useISPTenant();
  const tenantId = tenant?.id;
  const { user, sessionId } = useAuth();
  const auditClientRef = React6.useRef(null);
  const batchQueueRef = React6.useRef([]);
  const batchTimeoutRef = React6.useRef(null);
  const isHealthyRef = React6.useRef(true);
  React6.useEffect(() => {
    const baseURL = process.env["NEXT_PUBLIC_API_BASE_URL"] || "/api";
    const headers = {};
    if (user?.token) {
      headers["Authorization"] = `Bearer ${user.token}`;
    }
    auditClientRef.current = new AuditApiClient(baseURL, headers);
  }, [user?.token]);
  React6.useEffect(() => {
    const flushOnTimeout = () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      batchTimeoutRef.current = setTimeout(() => {
        if (batchQueueRef.current.length > 0) {
          flushBatch();
        }
      }, batchTimeout);
    };
    flushOnTimeout();
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, [batchTimeout]);
  const createActor = React6.useCallback(() => {
    const actor = {
      id: user?.id || "anonymous",
      type: user?.id ? "user" : "anonymous"
    };
    if (user?.name) {
      actor.name = user.name;
    }
    if (user?.email) {
      actor.email = user.email;
    }
    if (sessionId) {
      actor.session_id = sessionId;
    }
    if (typeof navigator !== "undefined") {
      actor.user_agent = navigator.userAgent;
    }
    return actor;
  }, [user, sessionId]);
  const createContext9 = React6.useCallback(
    (additionalContext) => {
      return {
        source: serviceName,
        environment: process.env["NODE_ENV"] || "development",
        correlation_id: sessionId ?? `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        request_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        additional: {
          url: typeof window !== "undefined" ? window.location.href : void 0,
          ...additionalContext
        }
      };
    },
    [serviceName, sessionId]
  );
  const storeLocally = React6.useCallback(
    (event) => {
      if (!enableLocalStorage || typeof window === "undefined") return;
      try {
        const stored = localStorage.getItem("audit_events") || "[]";
        const events = JSON.parse(stored);
        events.push({
          ...event,
          timestamp: Date.now(),
          stored_offline: true
        });
        const recentEvents = events.slice(-100);
        localStorage.setItem("audit_events", JSON.stringify(recentEvents));
      } catch (error2) {
        console.warn("Failed to store audit event locally:", error2);
      }
    },
    [enableLocalStorage]
  );
  const consoleLog = React6.useCallback(
    (event) => {
      if (!enableConsoleLogging) return;
      const logLevel = event.severity === "critical" /* CRITICAL */ || event.severity === "high" /* HIGH */ ? "error" : event.severity === "medium" /* MEDIUM */ ? "warn" : "info";
      console[logLevel](`[AUDIT] ${event.event_type}: ${event.message}`, {
        actor: event.actor?.id,
        resource: event.resource?.type,
        metadata: event.metadata
      });
    },
    [enableConsoleLogging]
  );
  const logEvent = React6.useCallback(
    async (event) => {
      try {
        const incomingContext = event.context;
        const resolvedContext = incomingContext ?? createContext9();
        const fullEvent = {
          ...event,
          actor: event.actor || createActor(),
          context: resolvedContext,
          tenant_id: event.tenant_id ?? tenantId ?? "unknown",
          severity: event.severity || "low" /* LOW */,
          outcome: event.outcome || "success" /* SUCCESS */,
          service_name: event.service_name || serviceName
        };
        storeLocally(fullEvent);
        consoleLog(fullEvent);
        batchQueueRef.current.push(fullEvent);
        if (batchQueueRef.current.length >= batchSize) {
          await flushBatch();
        }
      } catch (error2) {
        console.error("Failed to log audit event:", error2);
        isHealthyRef.current = false;
      }
    },
    [createActor, createContext9, tenantId, storeLocally, consoleLog, batchSize]
  );
  const flushBatch = React6.useCallback(async () => {
    if (!auditClientRef.current || batchQueueRef.current.length === 0) return;
    const eventsToSend = [...batchQueueRef.current];
    batchQueueRef.current = [];
    try {
      const payload = eventsToSend;
      await auditClientRef.current.logEventsBatch(payload);
      isHealthyRef.current = true;
    } catch (error2) {
      console.error("Failed to send audit batch:", error2);
      isHealthyRef.current = false;
      batchQueueRef.current = [...eventsToSend, ...batchQueueRef.current];
    }
  }, []);
  const logBatch = React6.useCallback(
    async (events) => {
      for (const event of events) {
        await logEvent(event);
      }
    },
    [logEvent]
  );
  const logAuthEvent = React6.useCallback(
    async (type, outcome, message, metadata) => {
      const eventPayload = {
        event_type: type,
        message,
        outcome,
        severity: outcome === "failure" /* FAILURE */ ? "high" /* HIGH */ : "low" /* LOW */,
        actor: createActor(),
        context: createContext9()
      };
      if (metadata) {
        eventPayload.metadata = metadata;
      }
      await logEvent(eventPayload);
    },
    [logEvent, createActor, createContext9]
  );
  const logDataAccess = React6.useCallback(
    async (operation, resourceType, resourceId, outcome, metadata) => {
      const eventType = operation === "create" ? "data.create" /* DATA_CREATE */ : operation === "read" ? "data.read" /* DATA_READ */ : operation === "update" ? "data.update" /* DATA_UPDATE */ : operation === "delete" ? "data.delete" /* DATA_DELETE */ : "data.read" /* DATA_READ */;
      const eventPayload = {
        event_type: eventType,
        message: `${operation} operation on ${resourceType} ${resourceId}`,
        outcome,
        severity: operation === "delete" && outcome === "success" /* SUCCESS */ ? "medium" /* MEDIUM */ : "low" /* LOW */,
        actor: createActor(),
        resource: {
          id: resourceId,
          type: resourceType
        },
        context: createContext9()
      };
      if (metadata) {
        eventPayload.metadata = metadata;
      }
      await logEvent(eventPayload);
    },
    [logEvent, createActor, createContext9]
  );
  const logUIEvent = React6.useCallback(
    async (type, element, metadata) => {
      const eventPayload = {
        event_type: type,
        message: `UI interaction: ${element}`,
        outcome: "success" /* SUCCESS */,
        severity: "low" /* LOW */,
        actor: createActor(),
        context: createContext9({ ui_element: element })
      };
      if (metadata) {
        eventPayload.metadata = metadata;
      }
      await logEvent(eventPayload);
    },
    [logEvent, createActor, createContext9]
  );
  const logError2 = React6.useCallback(
    async (error2, context, metadata) => {
      await logEvent({
        event_type: "system.error" /* SYSTEM_ERROR */,
        message: `Error in ${context}: ${error2.message}`,
        outcome: "failure" /* FAILURE */,
        severity: "high" /* HIGH */,
        actor: createActor(),
        context: createContext9({ error_context: context }),
        metadata: {
          ...metadata,
          error_name: error2.name,
          error_message: error2.message,
          error_stack: error2.stack
        }
      });
    },
    [logEvent, createActor, createContext9]
  );
  const logBusinessEvent = React6.useCallback(
    async (type, workflow, outcome, metadata) => {
      const eventPayload = {
        event_type: type,
        message: `Business workflow: ${workflow}`,
        outcome,
        severity: outcome === "failure" /* FAILURE */ ? "medium" /* MEDIUM */ : "low" /* LOW */,
        actor: createActor(),
        context: createContext9({ workflow })
      };
      if (metadata) {
        eventPayload.metadata = metadata;
      }
      await logEvent(eventPayload);
    },
    [logEvent, createActor, createContext9]
  );
  return {
    logEvent,
    logBatch,
    logAuthEvent,
    logDataAccess,
    logUIEvent,
    logError: logError2,
    logBusinessEvent,
    flushBatch,
    isHealthy: isHealthyRef.current,
    getQueueSize: () => batchQueueRef.current.length
  };
}
var AuditContext = React6.createContext(null);
function AuditProvider({
  children,
  serviceName,
  enabled = true,
  batchSize = 10,
  batchTimeout = 5e3,
  enableLocalStorage = true,
  enableConsoleLogging = process.env["NODE_ENV"] === "development"
}) {
  const auditLogger = useAuditLogger({
    serviceName,
    batchSize,
    batchTimeout,
    enableLocalStorage,
    enableConsoleLogging
  });
  React6.useEffect(() => {
    if (enabled) {
      auditLogger.logEvent({
        event_type: "system.startup" /* SYSTEM_STARTUP */,
        message: `Application ${serviceName} started`,
        outcome: "success" /* SUCCESS */,
        severity: "low" /* LOW */,
        actor: { id: "system", type: "system" },
        context: {
          source: serviceName,
          environment: process.env["NODE_ENV"] || "development"
        }
      });
    }
  }, [enabled, serviceName, auditLogger]);
  React6.useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      auditLogger.logUIEvent(
        isVisible ? "ui.session_start" /* UI_SESSION_START */ : "ui.session_end" /* UI_SESSION_END */,
        "page_visibility",
        { visible: isVisible }
      );
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [enabled, auditLogger]);
  React6.useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const handleError = (event) => {
      auditLogger.logError(new Error(event.message), "unhandled_error", {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };
    const handleUnhandledRejection = (event) => {
      auditLogger.logError(
        new Error(event.reason?.message || "Unhandled promise rejection"),
        "unhandled_promise_rejection",
        { reason: event.reason }
      );
    };
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [enabled, auditLogger]);
  React6.useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const handleBeforeUnload = () => {
      auditLogger.flushBatch();
      auditLogger.logUIEvent("ui.session_end" /* UI_SESSION_END */, "page_unload");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled, auditLogger]);
  const contextValue = {
    ...auditLogger,
    serviceName,
    isEnabled: enabled
  };
  return /* @__PURE__ */ jsxRuntime.jsx(AuditContext.Provider, { value: contextValue, children });
}
function useAudit() {
  const context = React6.useContext(AuditContext);
  if (!context) {
    throw new Error("useAudit must be used within an AuditProvider");
  }
  return context;
}
function withAudit(Component2, serviceName, auditConfig) {
  return function AuditWrappedComponent(props) {
    return /* @__PURE__ */ jsxRuntime.jsx(AuditProvider, { serviceName, ...auditConfig, children: /* @__PURE__ */ jsxRuntime.jsx(Component2, { ...props }) });
  };
}
function useAuditInterceptor(config = {}) {
  const {
    interceptFetch = true,
    interceptClicks = true,
    interceptForms = true,
    interceptNavigation = true,
    interceptErrors = true,
    excludeUrls = [],
    excludeElements = [".audit-ignore"]
  } = config;
  const { logEvent, logDataAccess, logUIEvent, logError: logError2, isEnabled } = useAudit();
  const originalFetchRef = React6.useRef();
  const interceptorsSetupRef = React6.useRef(false);
  const shouldExcludeUrl = React6.useCallback(
    (url) => {
      return excludeUrls.some((pattern) => pattern.test(url));
    },
    [excludeUrls]
  );
  const shouldExcludeElement = React6.useCallback(
    (element) => {
      return excludeElements.some((selector) => element.matches(selector));
    },
    [excludeElements]
  );
  React6.useEffect(() => {
    if (!interceptFetch || !isEnabled || typeof window === "undefined") return;
    if (!originalFetchRef.current) {
      originalFetchRef.current = window.fetch;
    }
    window.fetch = async (input, init) => {
      const url = typeof input === "string" ? input : input.toString();
      const method = init?.method || "GET";
      const startTime = performance.now();
      if (url.includes("/audit/") || shouldExcludeUrl(url)) {
        return originalFetchRef.current(input, init);
      }
      try {
        const response = await originalFetchRef.current(input, init);
        const duration = performance.now() - startTime;
        await logDataAccess(
          method.toLowerCase(),
          "api_endpoint",
          url,
          response.ok ? "success" /* SUCCESS */ : "failure" /* FAILURE */,
          {
            method,
            status_code: response.status,
            duration_ms: Math.round(duration),
            response_size: response.headers.get("content-length")
          }
        );
        return response;
      } catch (error2) {
        const duration = performance.now() - startTime;
        await logDataAccess(method.toLowerCase(), "api_endpoint", url, "failure" /* FAILURE */, {
          method,
          duration_ms: Math.round(duration),
          error_message: error2.message
        });
        throw error2;
      }
    };
    return () => {
      if (originalFetchRef.current) {
        window.fetch = originalFetchRef.current;
      }
    };
  }, [interceptFetch, isEnabled, logDataAccess, shouldExcludeUrl]);
  React6.useEffect(() => {
    if (!interceptClicks || !isEnabled || typeof document === "undefined") return;
    const handleClick = async (event) => {
      const target = event.target;
      if (!target || shouldExcludeElement(target)) return;
      const elementInfo = {
        tag: target.tagName.toLowerCase(),
        id: target.id,
        className: target.className,
        text: target.textContent?.slice(0, 100),
        href: target.getAttribute("href"),
        type: target.getAttribute("type")
      };
      await logUIEvent("ui.button_click" /* UI_BUTTON_CLICK */, elementInfo.tag, {
        element: elementInfo,
        coordinates: { x: event.clientX, y: event.clientY }
      });
    };
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [interceptClicks, isEnabled, logUIEvent, shouldExcludeElement]);
  React6.useEffect(() => {
    if (!interceptForms || !isEnabled || typeof document === "undefined") return;
    const handleSubmit = async (event) => {
      const form = event.target;
      if (!form || shouldExcludeElement(form)) return;
      const formData = new FormData(form);
      const fields = Array.from(formData.keys());
      const sensitiveFields = fields.filter(
        (field) => /password|secret|token|key|ssn|credit/i.test(field)
      );
      await logUIEvent(
        "ui.form_submit" /* UI_FORM_SUBMIT */,
        form.id || form.className || "unnamed_form",
        {
          form_id: form.id,
          form_action: form.action,
          form_method: form.method,
          field_count: fields.length,
          sensitive_fields: sensitiveFields.length > 0 ? ["[REDACTED]"] : [],
          fields: fields.filter((field) => !sensitiveFields.includes(field))
        }
      );
    };
    document.addEventListener("submit", handleSubmit, { capture: true });
    return () => document.removeEventListener("submit", handleSubmit, { capture: true });
  }, [interceptForms, isEnabled, logUIEvent, shouldExcludeElement]);
  React6.useEffect(() => {
    if (!interceptNavigation || !isEnabled || typeof window === "undefined") return;
    const handlePopState = async () => {
      await logUIEvent("ui.page_view" /* UI_PAGE_VIEW */, "navigation", {
        url: window.location.href,
        referrer: document.referrer,
        navigation_type: "popstate"
      });
    };
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function(state, title, url) {
      originalPushState.apply(history, arguments);
      logUIEvent("ui.page_view" /* UI_PAGE_VIEW */, "navigation", {
        url: url?.toString() || window.location.href,
        navigation_type: "pushstate",
        state
      });
    };
    history.replaceState = function(state, title, url) {
      originalReplaceState.apply(history, arguments);
      logUIEvent("ui.page_view" /* UI_PAGE_VIEW */, "navigation", {
        url: url?.toString() || window.location.href,
        navigation_type: "replacestate",
        state
      });
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", handlePopState);
    };
  }, [interceptNavigation, isEnabled, logUIEvent]);
  React6.useEffect(() => {
    if (!interceptErrors || !isEnabled || typeof console === "undefined") return;
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.map((arg) => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" ");
      logError2(new Error(message), "console_error", { console_args: args });
      originalConsoleError.apply(console, args);
    };
    return () => {
      console.error = originalConsoleError;
    };
  }, [interceptErrors, isEnabled, logError2]);
  React6.useEffect(() => {
    interceptorsSetupRef.current = true;
  }, []);
  return {
    isSetup: interceptorsSetupRef.current,
    manualLog: {
      logAPICall: React6.useCallback(
        async (method, url, outcome, metadata) => {
          await logDataAccess(method.toLowerCase(), "api_endpoint", url, outcome, metadata);
        },
        [logDataAccess]
      ),
      logUserAction: React6.useCallback(
        async (action, element, metadata) => {
          await logUIEvent("ui.feature_used" /* UI_FEATURE_USED */, element, {
            action,
            ...metadata
          });
        },
        [logUIEvent]
      ),
      logBusinessProcess: React6.useCallback(
        async (workflow, outcome, metadata) => {
          await logEvent({
            event_type: "business.workflow_start" /* BUSINESS_WORKFLOW_START */,
            message: `Business process: ${workflow}`,
            outcome,
            severity: "low" /* LOW */,
            actor: { id: "system", type: "system" },
            context: {
              source: "business_process",
              environment: process.env["NODE_ENV"] || "development"
            },
            metadata
          });
        },
        [logEvent]
      )
    }
  };
}
function AuditWrapperContent({ children, interceptorConfig }) {
  useAuditInterceptor(interceptorConfig);
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children });
}
function AuditIntegrationWrapper({
  children,
  serviceName,
  enabled = true,
  batchSize = 10,
  batchTimeout = 5e3,
  enableLocalStorage = true,
  enableConsoleLogging = process.env["NODE_ENV"] === "development",
  interceptFetch = true,
  interceptClicks = true,
  interceptForms = true,
  interceptNavigation = true,
  excludeUrls = [/\/audit\//, /\/health/, /\/metrics/, /\/_next\//, /\/api\/auth\//],
  excludeElements = [".no-audit", "[data-no-audit]", ".audit-ignore"]
}) {
  if (!enabled) {
    return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children });
  }
  const interceptorConfig = {
    interceptFetch,
    interceptClicks,
    interceptForms,
    interceptNavigation,
    excludeUrls,
    excludeElements
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    AuditProvider,
    {
      serviceName,
      enabled,
      batchSize,
      batchTimeout,
      enableLocalStorage,
      enableConsoleLogging,
      children: /* @__PURE__ */ jsxRuntime.jsx(AuditWrapperContent, { interceptorConfig, children })
    }
  );
}
var AuditPresets = {
  customerPortal: {
    serviceName: "customer-portal",
    batchSize: 15,
    batchTimeout: 3e3,
    excludeElements: [".no-audit", "[data-no-audit]", ".customer-pii"]
  },
  adminPortal: {
    serviceName: "admin-portal",
    batchSize: 5,
    batchTimeout: 2e3,
    interceptClicks: true,
    interceptForms: true
  },
  technicianApp: {
    serviceName: "technician-mobile",
    batchSize: 20,
    batchTimeout: 1e4,
    // Longer timeout for mobile/offline scenarios
    enableLocalStorage: true
  },
  resellerPortal: {
    serviceName: "reseller-portal",
    batchSize: 8,
    batchTimeout: 4e3,
    excludeUrls: [/\/audit\//, /\/partner\//, /\/commission\//]
  },
  managementPortal: {
    serviceName: "management-portal",
    batchSize: 5,
    batchTimeout: 1e3,
    // Fastest for management actions
    interceptNavigation: true,
    interceptForms: true
  }
};
var CustomerPortalAudit = ({ children }) => /* @__PURE__ */ jsxRuntime.jsx(AuditIntegrationWrapper, { ...AuditPresets.customerPortal, children });
var AdminPortalAudit = ({ children }) => /* @__PURE__ */ jsxRuntime.jsx(AuditIntegrationWrapper, { ...AuditPresets.adminPortal, children });
var TechnicianAppAudit = ({ children }) => /* @__PURE__ */ jsxRuntime.jsx(AuditIntegrationWrapper, { ...AuditPresets.technicianApp, children });
var ResellerPortalAudit = ({ children }) => /* @__PURE__ */ jsxRuntime.jsx(AuditIntegrationWrapper, { ...AuditPresets.resellerPortal, children });
var ManagementPortalAudit = ({ children }) => /* @__PURE__ */ jsxRuntime.jsx(AuditIntegrationWrapper, { ...AuditPresets.managementPortal, children });

// src/config/framework.config.ts
var defaultFrameworkConfig = {
  locale: {
    primary: "en-US",
    supported: ["en-US", "es-ES", "fr-FR", "de-DE"],
    fallback: "en-US",
    dateFormat: {
      short: { year: "numeric", month: "short", day: "numeric" },
      medium: { year: "numeric", month: "long", day: "numeric" },
      long: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
      time: { hour: "2-digit", minute: "2-digit" }
    }
  },
  currency: {
    primary: "USD",
    symbol: "$",
    position: "before",
    precision: 2,
    thousandsSeparator: ",",
    decimalSeparator: "."
  },
  business: {
    planTypes: {
      residential_basic: {
        label: "Residential Basic",
        category: "residential",
        features: ["Basic Internet", "24/7 Support", "WiFi Included"]
      },
      residential_premium: {
        label: "Residential Premium",
        category: "residential",
        features: ["High-Speed Internet", "Priority Support", "Advanced WiFi", "Security Suite"]
      },
      business_starter: {
        label: "Business Starter",
        category: "business",
        features: ["Business Internet", "Static IP", "Business Support", "SLA"]
      },
      business_pro: {
        label: "Business Pro",
        category: "business",
        features: ["High-Speed Business", "Multiple IPs", "Priority Support", "99.9% SLA"]
      },
      enterprise: {
        label: "Enterprise",
        category: "enterprise",
        features: [
          "Dedicated Connection",
          "Custom Configuration",
          "Dedicated Support",
          "99.99% SLA"
        ]
      }
    },
    statusTypes: {
      active: {
        label: "Active",
        color: "success",
        description: "Service is active and running"
      },
      pending: {
        label: "Pending",
        color: "warning",
        description: "Service activation in progress"
      },
      suspended: {
        label: "Suspended",
        color: "danger",
        description: "Service temporarily suspended"
      },
      cancelled: {
        label: "Cancelled",
        color: "default",
        description: "Service has been cancelled"
      },
      maintenance: {
        label: "Maintenance",
        color: "info",
        description: "Service under maintenance"
      }
    },
    partnerTiers: {
      bronze: {
        label: "Bronze Partner",
        color: "secondary",
        benefits: ["5% Commission", "Basic Support", "Marketing Materials"],
        requirements: { customers: 10, revenue: 5e3 }
      },
      silver: {
        label: "Silver Partner",
        color: "primary",
        benefits: ["10% Commission", "Priority Support", "Co-marketing"],
        requirements: { customers: 25, revenue: 15e3 }
      },
      gold: {
        label: "Gold Partner",
        color: "warning",
        benefits: ["15% Commission", "Dedicated Support", "Custom Materials"],
        requirements: { customers: 50, revenue: 35e3 }
      },
      platinum: {
        label: "Platinum Partner",
        color: "success",
        benefits: ["20% Commission", "Account Manager", "API Access"],
        requirements: { customers: 100, revenue: 75e3 }
      }
    },
    units: {
      bandwidth: "mbps",
      data: "gb",
      currency: "USD"
    }
  },
  branding: {
    company: {
      name: "DotMac ISP",
      logo: "/assets/logo.svg",
      favicon: "/assets/favicon.ico",
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        accent: "#10b981"
      }
    },
    portal: {
      admin: {
        name: "Admin Portal",
        theme: "professional"
      },
      customer: {
        name: "Customer Portal",
        theme: "friendly"
      },
      reseller: {
        name: "Partner Portal",
        theme: "business"
      }
    }
  },
  features: {
    multiTenancy: true,
    advancedAnalytics: true,
    automatedBilling: true,
    apiAccess: true,
    whiteLabel: false,
    customDomains: false,
    ssoIntegration: false,
    mobileApp: false
  },
  api: {
    baseUrl: "/api",
    version: "v1",
    timeout: 3e4,
    retries: 3
  },
  monitoring: {
    analytics: true,
    errorReporting: true,
    performanceMonitoring: true
  }
};
var ConfigContext = React6.createContext(void 0);
function ConfigProvider({
  children,
  initialConfig = {
    // Implementation pending
  },
  configEndpoint
}) {
  const [config, setConfig] = React6.useState(() => ({
    ...defaultFrameworkConfig,
    ...initialConfig
  }));
  React6.useEffect(() => {
    if (configEndpoint) {
      fetch(configEndpoint).then((res) => res.json()).then((remoteConfig) => {
        setConfig((prev) => ({
          ...prev,
          ...remoteConfig
        }));
      }).catch((_error) => {
      });
    }
  }, [configEndpoint]);
  React6.useEffect(() => {
    const savedConfig = localStorage.getItem("dotmac-framework-config");
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig((prev) => ({
          ...prev,
          ...parsedConfig
        }));
      } catch (_error) {
      }
    }
  }, []);
  const updateConfig = (updates) => {
    setConfig((prev) => {
      const newConfig = {
        ...prev,
        ...updates
      };
      try {
        localStorage.setItem("dotmac-framework-config", JSON.stringify(newConfig));
      } catch (_error) {
      }
      return newConfig;
    });
  };
  const resetConfig = () => {
    setConfig(defaultFrameworkConfig);
    localStorage.removeItem("dotmac-framework-config");
  };
  const value = {
    config,
    updateConfig,
    resetConfig
  };
  return /* @__PURE__ */ jsxRuntime.jsx(ConfigContext.Provider, { value, children });
}
function useConfig() {
  const context = React6.useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
function useLocaleConfig() {
  const { config } = useConfig();
  return config.locale;
}
function useCurrencyConfig() {
  const { config } = useConfig();
  return config.currency;
}
function useBusinessConfig() {
  const { config } = useConfig();
  return config.business;
}
function useBrandingConfig() {
  const { config } = useConfig();
  return config.branding;
}
function useFeatureFlags() {
  const { config } = useConfig();
  return config.features;
}

// src/config/theme.config.ts
var defaultBlue = {
  50: "#eff6ff",
  100: "#dbeafe",
  200: "#bfdbfe",
  300: "#93c5fd",
  400: "#60a5fa",
  500: "#3b82f6",
  600: "#2563eb",
  700: "#1d4ed8",
  800: "#1e40af",
  900: "#1e3a8a",
  950: "#172554"
};
var defaultGray = {
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  900: "#0f172a",
  950: "#020617"
};
var defaultGreen = {
  50: "#f0fdf4",
  100: "#dcfce7",
  200: "#bbf7d0",
  300: "#86efac",
  400: "#4ade80",
  500: "#22c55e",
  600: "#16a34a",
  700: "#15803d",
  800: "#166534",
  900: "#14532d",
  950: "#052e16"
};
var defaultRed = {
  50: "#fef2f2",
  100: "#fee2e2",
  200: "#fecaca",
  300: "#fca5a5",
  400: "#f87171",
  500: "#ef4444",
  600: "#dc2626",
  700: "#b91c1c",
  800: "#991b1b",
  900: "#7f1d1d",
  950: "#450a0a"
};
var defaultYellow = {
  50: "#fefce8",
  100: "#fef9c3",
  200: "#fef08a",
  300: "#fde047",
  400: "#facc15",
  500: "#eab308",
  600: "#ca8a04",
  700: "#a16207",
  800: "#854d0e",
  900: "#713f12",
  950: "#422006"
};
var defaultCyan = {
  50: "#ecfeff",
  100: "#cffafe",
  200: "#a5f3fc",
  300: "#67e8f9",
  400: "#22d3ee",
  500: "#06b6d4",
  600: "#0891b2",
  700: "#0e7490",
  800: "#155e75",
  900: "#164e63",
  950: "#083344"
};
var defaultTheme = {
  colors: {
    primary: defaultBlue,
    secondary: defaultGray,
    accent: defaultCyan,
    success: defaultGreen,
    warning: defaultYellow,
    danger: defaultRed,
    info: defaultCyan,
    neutral: defaultGray
  },
  typography: {
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      serif: ["ui-serif", "Georgia", "Cambria", "serif"],
      mono: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"]
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
      "6xl": ["3.75rem", { lineHeight: "1" }]
    },
    fontWeight: {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900"
    }
  },
  spacing: {
    0: "0px",
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem"
  },
  borderRadius: {
    none: "0px",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px"
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    none: "none"
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
  },
  zIndex: {
    auto: "auto",
    0: "0",
    10: "10",
    20: "20",
    30: "30",
    40: "40",
    50: "50"
  }
};
var adminTheme = {
  ...defaultTheme,
  name: "Admin Portal",
  variant: "professional",
  colors: {
    ...defaultTheme.colors,
    primary: {
      ...defaultGray,
      500: "#374151",
      600: "#1f2937"
    }
  }
};
var customerTheme = {
  ...defaultTheme,
  name: "Customer Portal",
  variant: "friendly",
  colors: {
    ...defaultTheme.colors,
    primary: defaultBlue,
    accent: defaultGreen
  }
};
var resellerTheme = {
  ...defaultTheme,
  name: "Reseller Portal",
  variant: "business",
  colors: {
    ...defaultTheme.colors,
    primary: {
      ...defaultBlue,
      500: "#1e40af",
      600: "#1d4ed8"
    },
    accent: {
      ...defaultYellow,
      500: "#f59e0b",
      600: "#d97706"
    }
  }
};
var themes = {
  default: defaultTheme,
  admin: adminTheme,
  customer: customerTheme,
  reseller: resellerTheme
};
var ThemeContext = React6.createContext(void 0);
function ThemeProvider({
  children,
  defaultThemeName = "default",
  portalType,
  allowCustomization = true
}) {
  const [currentTheme, setCurrentTheme] = React6.useState(() => {
    if (portalType && themes[portalType]) {
      return portalType;
    }
    return defaultThemeName;
  });
  const [customizations, setCustomizations] = React6.useState({});
  React6.useEffect(() => {
    if (allowCustomization && typeof window !== "undefined") {
      const savedCustomizations = window.localStorage.getItem(`dotmac-theme-${currentTheme}`);
      if (savedCustomizations) {
        try {
          const parsed = JSON.parse(savedCustomizations);
          setCustomizations(parsed);
        } catch (_error) {
        }
      } else {
        setCustomizations({});
      }
    }
  }, [currentTheme, allowCustomization]);
  React6.useEffect(() => {
    const baseTheme = themes[currentTheme] || defaultTheme;
    const finalTheme = {
      ...baseTheme,
      ...customizations,
      colors: {
        ...baseTheme.colors,
        ...customizations.colors || {
          // Implementation pending
        }
      }
    };
    const root = document.documentElement;
    Object.entries(finalTheme.colors).forEach(([colorName, palette]) => {
      Object.entries(palette).forEach(([shade, value2]) => {
        root.style.setProperty(`--color-${colorName}-${shade}`, value2);
      });
    });
    if (finalTheme.typography?.fontFamily) {
      root.style.setProperty("--font-sans", finalTheme.typography.fontFamily.sans.join(", "));
      root.style.setProperty("--font-serif", finalTheme.typography.fontFamily.serif.join(", "));
      root.style.setProperty("--font-mono", finalTheme.typography.fontFamily.mono.join(", "));
    }
    Object.entries(finalTheme.spacing).forEach(([key, value2]) => {
      root.style.setProperty(`--spacing-${key}`, value2);
    });
    Object.entries(finalTheme.borderRadius).forEach(([key, value2]) => {
      root.style.setProperty(`--radius-${key}`, value2);
    });
    Object.entries(finalTheme.shadows).forEach(([key, value2]) => {
      root.style.setProperty(`--shadow-${key}`, value2);
    });
    Object.entries(finalTheme.breakpoints).forEach(([key, value2]) => {
      root.style.setProperty(`--breakpoint-${key}`, value2);
    });
    Object.entries(finalTheme.zIndex).forEach(([key, value2]) => {
      root.style.setProperty(`--z-${key}`, value2);
    });
  }, [currentTheme, customizations]);
  const setTheme = (themeName) => {
    setCurrentTheme(themeName);
    setCustomizations({});
  };
  const customizeTheme = (newCustomizations) => {
    if (!allowCustomization) {
      return;
    }
    const updatedCustomizations = {
      ...customizations,
      ...newCustomizations
    };
    setCustomizations(updatedCustomizations);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          `dotmac-theme-${currentTheme}`,
          JSON.stringify(updatedCustomizations)
        );
      }
    } catch (_error) {
    }
  };
  const resetTheme = () => {
    setCustomizations({});
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(`dotmac-theme-${currentTheme}`);
    }
  };
  const theme = {
    ...themes[currentTheme] || defaultTheme,
    ...customizations,
    colors: {
      ...(themes[currentTheme] || defaultTheme).colors,
      ...customizations.colors || {
        // Implementation pending
      }
    }
  };
  const value = {
    theme,
    currentTheme,
    setTheme,
    customizeTheme,
    resetTheme
  };
  return /* @__PURE__ */ jsxRuntime.jsx(ThemeContext.Provider, { value, children });
}
function useTheme() {
  const context = React6.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
function useColors() {
  const { theme } = useTheme();
  return theme.colors;
}
function useTypography() {
  const { theme } = useTheme();
  return theme.typography;
}
function useSpacing() {
  const { theme } = useTheme();
  return theme.spacing;
}
function useBorderRadius() {
  const { theme } = useTheme();
  return theme.borderRadius;
}
function useShadows() {
  const { theme } = useTheme();
  return theme.shadows;
}
function useBreakpoints() {
  const { theme } = useTheme();
  return theme.breakpoints;
}
var useTenantStore = zustand.create()(
  middleware.persist(
    (set, get) => ({
      currentTenant: null,
      availableTenants: [],
      isLoading: false,
      switchingTenant: false,
      setCurrentTenant: (tenant, user) => {
        set({
          currentTenant: {
            tenant,
            user,
            permissions: {
              // Implementation pending
            },
            features: [],
            settings: tenant.settings || {
              // Implementation pending
            }
          }
        });
      },
      switchTenant: async (tenantId) => {
        const { availableTenants, loadTenantPermissions } = get();
        set({ switchingTenant: true });
        try {
          const targetTenant = availableTenants.find((t) => t.id === tenantId);
          if (!targetTenant) {
            throw new Error("Tenant not found");
          }
          await loadTenantPermissions(tenantId);
          set((state) => ({
            currentTenant: state.currentTenant ? {
              ...state.currentTenant,
              tenant: targetTenant,
              settings: targetTenant.settings || {
                // Implementation pending
              }
            } : null,
            switchingTenant: false
          }));
          window.dispatchEvent(
            new CustomEvent("tenantChanged", {
              detail: { tenantId, tenant: targetTenant }
            })
          );
        } catch (_error) {
          set({ switchingTenant: false });
          throw error;
        }
      },
      loadTenantPermissions: async (tenantId) => {
        set({ isLoading: true });
        try {
          const apiClient = getApiClient();
          const response = await apiClient.request(`/api/v1/tenants/${tenantId}/permissions`, {
            method: "GET"
          });
          const { permissions, _features } = response.data;
          set((state) => ({
            currentTenant: state.currentTenant ? {
              ...state.currentTenant,
              permissions: permissions || {
                // Implementation pending
              },
              features: features || []
            } : null,
            isLoading: false
          }));
        } catch (_error) {
          set({ isLoading: false });
          throw error;
        }
      },
      updateTenantSettings: (settings) => {
        set((state) => ({
          currentTenant: state.currentTenant ? {
            ...state.currentTenant,
            settings: { ...state.currentTenant.settings, ...settings }
          } : null
        }));
      },
      clearTenant: () => {
        set({
          currentTenant: null,
          availableTenants: [],
          isLoading: false,
          switchingTenant: false
        });
      },
      // Permission helpers
      hasPermission: (permission) => {
        const { currentTenant } = get();
        return currentTenant?.permissions[permission] || false;
      },
      hasAnyPermission: (permissions) => {
        const { hasPermission } = get();
        return permissions.some((permission) => hasPermission(permission));
      },
      hasAllPermissions: (permissions) => {
        const { hasPermission } = get();
        return permissions.every((permission) => hasPermission(permission));
      },
      hasFeature: (feature) => {
        const { currentTenant } = get();
        return currentTenant?.features.includes(feature) || false;
      },
      // Multi-tenant utilities
      getTenantSetting: (key, defaultValue) => {
        const { currentTenant } = get();
        return currentTenant?.settings[key] ?? defaultValue;
      },
      isTenantActive: () => {
        const { currentTenant } = get();
        return currentTenant?.tenant?.status === "active";
      },
      getTenantBranding: () => {
        const { currentTenant } = get();
        const settings = currentTenant?.settings || {
          // Implementation pending
        };
        return {
          logo: settings.branding?.logo,
          primaryColor: settings.branding?.primaryColor || "#2563eb",
          secondaryColor: settings.branding?.secondaryColor || "#64748b",
          companyName: currentTenant?.tenant?.name || "DotMac Platform"
        };
      }
    }),
    {
      name: "tenant-store",
      storage: middleware.createJSONStorage(() => localStorage),
      // Only persist essential data
      partialize: (state) => ({
        currentTenant: state.currentTenant,
        availableTenants: state.availableTenants
      })
    }
  )
);

// src/auth/storage.ts
var SecureStorage2 = class {
  constructor(options = {}) {
    this.memoryStore = /* @__PURE__ */ new Map();
    this.backend = options.backend ?? "localStorage";
    this.prefix = options.prefix ?? "dotmac:";
  }
  get storage() {
    if (typeof window === "undefined") {
      return null;
    }
    if (this.backend === "sessionStorage") {
      return window.sessionStorage;
    }
    return window.localStorage;
  }
  withPrefix(key) {
    return `${this.prefix}${key}`;
  }
  getItem(key) {
    const storage = this.storage;
    const namespacedKey = this.withPrefix(key);
    if (!storage) {
      return this.memoryStore.get(namespacedKey) ?? null;
    }
    return storage.getItem(namespacedKey);
  }
  setItem(key, value) {
    const storage = this.storage;
    const namespacedKey = this.withPrefix(key);
    if (!storage) {
      this.memoryStore.set(namespacedKey, value);
      return;
    }
    storage.setItem(namespacedKey, value);
  }
  removeItem(key) {
    const storage = this.storage;
    const namespacedKey = this.withPrefix(key);
    if (!storage) {
      this.memoryStore.delete(namespacedKey);
      return;
    }
    storage.removeItem(namespacedKey);
  }
};

// src/stores/createAppStore.ts
var defaultFilterState = {
  searchTerm: "",
  statusFilter: "all",
  sortBy: "name",
  sortOrder: "asc",
  dateRange: { start: null, end: null },
  customFilters: {},
  showAdvanced: false
};
var defaultPaginationState = {
  currentPage: 1,
  itemsPerPage: 25,
  totalItems: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false
};
var defaultSelectionState = {
  selectedItems: [],
  lastSelected: null,
  selectAll: false,
  isMultiSelect: true
};
var defaultLoadingState = {
  isLoading: false,
  error: null,
  lastUpdated: null,
  operationId: null
};
var defaultUIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  activeTab: "",
  activeView: "list",
  showFilters: false,
  showBulkActions: false,
  theme: "light",
  density: "comfortable",
  language: "en",
  notifications: [],
  modals: {
    confirmDialog: {
      open: false
    }
  },
  globalLoading: {
    visible: false
  }
};
var defaultPreferencesState = {
  dataRefreshInterval: 3e4,
  // 30 seconds
  autoSave: true,
  compactMode: false,
  showAdvancedFeatures: false,
  tablePageSize: 25,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: "MM/dd/yyyy",
  numberFormat: "en-US",
  emailNotifications: true,
  pushNotifications: false,
  soundEnabled: true,
  keyboardShortcuts: true
};
function createAppStore(config) {
  const {
    portalType,
    persistenceKey = `dotmac-app-${portalType}`,
    secureStorage: secureStorage2 = false,
    includePersistence = true,
    initialState: initialState4 = {},
    storagePrefix = "app_"
  } = config;
  const storage = secureStorage2 ? new SecureStorage2({ backend: "localStorage", prefix: storagePrefix }) : void 0;
  const store = zustand.create()(
    includePersistence && storage ? middleware.persist(
      immer.immer((set, get) => ({
        // Initial state
        ui: { ...defaultUIState, ...initialState4.ui },
        preferences: {
          ...defaultPreferencesState,
          ...initialState4.preferences
        },
        contexts: initialState4.contexts || {},
        portalData: initialState4.portalData || {},
        // Filter Actions
        updateFilters: (context, updates) => {
          set((state) => {
            if (!state.contexts[context]) {
              state.contexts[context] = createDefaultContext();
            }
            Object.assign(state.contexts[context].filters, updates);
          });
        },
        resetFilters: (context) => {
          set((state) => {
            if (state.contexts[context]) {
              state.contexts[context].filters = { ...defaultFilterState };
            }
          });
        },
        setSearchTerm: (context, term) => {
          get().updateFilters(context, { searchTerm: term });
        },
        setStatusFilter: (context, status) => {
          get().updateFilters(context, { statusFilter: status });
        },
        setSorting: (context, sortBy, sortOrder = "asc") => {
          get().updateFilters(context, { sortBy, sortOrder });
        },
        setDateRange: (context, start, end) => {
          get().updateFilters(context, { dateRange: { start, end } });
        },
        setCustomFilter: (context, key, value) => {
          set((state) => {
            if (!state.contexts[context]) {
              state.contexts[context] = createDefaultContext();
            }
            state.contexts[context].filters.customFilters[key] = value;
          });
        },
        toggleAdvancedFilters: (context) => {
          set((state) => {
            if (state.contexts[context]) {
              state.contexts[context].filters.showAdvanced = !state.contexts[context].filters.showAdvanced;
            }
          });
        },
        // Pagination Actions
        updatePagination: (context, updates) => {
          set((state) => {
            if (!state.contexts[context]) {
              state.contexts[context] = createDefaultContext();
            }
            const pagination = state.contexts[context].pagination;
            Object.assign(pagination, updates);
            if ("totalItems" in updates || "itemsPerPage" in updates) {
              pagination.totalPages = Math.ceil(
                pagination.totalItems / pagination.itemsPerPage
              );
              pagination.hasNext = pagination.currentPage < pagination.totalPages;
              pagination.hasPrev = pagination.currentPage > 1;
            }
          });
        },
        setCurrentPage: (context, page) => {
          get().updatePagination(context, { currentPage: page });
        },
        setItemsPerPage: (context, itemsPerPage) => {
          get().updatePagination(context, { itemsPerPage, currentPage: 1 });
        },
        setTotalItems: (context, totalItems) => {
          get().updatePagination(context, { totalItems });
        },
        goToFirstPage: (context) => {
          get().setCurrentPage(context, 1);
        },
        goToLastPage: (context) => {
          const pagination = get().contexts[context]?.pagination;
          if (pagination) {
            get().setCurrentPage(context, pagination.totalPages);
          }
        },
        goToNextPage: (context) => {
          const pagination = get().contexts[context]?.pagination;
          if (pagination?.hasNext) {
            get().setCurrentPage(context, pagination.currentPage + 1);
          }
        },
        goToPrevPage: (context) => {
          const pagination = get().contexts[context]?.pagination;
          if (pagination?.hasPrev) {
            get().setCurrentPage(context, pagination.currentPage - 1);
          }
        },
        // Selection Actions
        updateSelection: (context, updates) => {
          set((state) => {
            if (!state.contexts[context]) {
              state.contexts[context] = createDefaultContext();
            }
            Object.assign(state.contexts[context].selection, updates);
          });
        },
        selectItem: (context, item, multiple = true) => {
          set((state) => {
            if (!state.contexts[context]) {
              state.contexts[context] = createDefaultContext();
            }
            const selection = state.contexts[context].selection;
            const isSelected = selection.selectedItems.includes(item);
            if (isSelected) {
              selection.selectedItems = selection.selectedItems.filter((i) => i !== item);
            } else {
              if (multiple && selection.isMultiSelect) {
                selection.selectedItems.push(item);
              } else {
                selection.selectedItems = [item];
              }
            }
            selection.lastSelected = item;
            selection.selectAll = false;
          });
        },
        deselectItem: (context, item) => {
          set((state) => {
            if (state.contexts[context]) {
              const selection = state.contexts[context].selection;
              selection.selectedItems = selection.selectedItems.filter((i) => i !== item);
              selection.selectAll = false;
            }
          });
        },
        toggleSelectAll: (context, allItems) => {
          set((state) => {
            if (!state.contexts[context]) {
              state.contexts[context] = createDefaultContext();
            }
            const selection = state.contexts[context].selection;
            const allSelected = selection.selectAll || selection.selectedItems.length === allItems.length;
            selection.selectedItems = allSelected ? [] : [...allItems];
            selection.selectAll = !allSelected;
            selection.lastSelected = null;
          });
        },
        clearSelection: (context) => {
          set((state) => {
            if (state.contexts[context]) {
              state.contexts[context].selection = {
                ...defaultSelectionState
              };
            }
          });
        },
        selectRange: (context, startItem, endItem, allItems) => {
          const startIndex = allItems.indexOf(startItem);
          const endIndex = allItems.indexOf(endItem);
          if (startIndex === -1 || endIndex === -1) return;
          const start = Math.min(startIndex, endIndex);
          const end = Math.max(startIndex, endIndex);
          const rangeItems = allItems.slice(start, end + 1);
          set((state) => {
            if (!state.contexts[context]) {
              state.contexts[context] = createDefaultContext();
            }
            const selection = state.contexts[context].selection;
            rangeItems.forEach((item) => {
              if (!selection.selectedItems.includes(item)) {
                selection.selectedItems.push(item);
              }
            });
          });
        },
        // Loading Actions
        updateLoading: (context, updates) => {
          set((state) => {
            if (!state.contexts[context]) {
              state.contexts[context] = createDefaultContext();
            }
            Object.assign(state.contexts[context].loading, updates);
          });
        },
        setLoading: (context, isLoading, operationId) => {
          get().updateLoading(context, {
            isLoading,
            operationId,
            error: isLoading ? null : get().contexts[context]?.loading.error
          });
        },
        setError: (context, error2) => {
          get().updateLoading(context, { error: error2, isLoading: false });
        },
        setLastUpdated: (context, timestamp = /* @__PURE__ */ new Date()) => {
          get().updateLoading(context, { lastUpdated: timestamp });
        },
        setProgress: (context, current, total, message) => {
          get().updateLoading(context, {
            progress: { current, total, message }
          });
        },
        clearProgress: (context) => {
          get().updateLoading(context, { progress: void 0 });
        },
        // UI Actions
        updateUI: (updates) => {
          set((state) => {
            Object.assign(state.ui, updates);
          });
        },
        toggleSidebar: () => {
          set((state) => {
            state.ui.sidebarOpen = !state.ui.sidebarOpen;
          });
        },
        setSidebarCollapsed: (collapsed) => {
          set((state) => {
            state.ui.sidebarCollapsed = collapsed;
          });
        },
        setActiveTab: (tab) => {
          set((state) => {
            state.ui.activeTab = tab;
          });
        },
        setActiveView: (view) => {
          set((state) => {
            state.ui.activeView = view;
          });
        },
        toggleFilters: (context) => {
          if (context) {
            get().toggleAdvancedFilters(context);
          } else {
            set((state) => {
              state.ui.showFilters = !state.ui.showFilters;
            });
          }
        },
        toggleBulkActions: () => {
          set((state) => {
            state.ui.showBulkActions = !state.ui.showBulkActions;
          });
        },
        setTheme: (theme) => {
          set((state) => {
            state.ui.theme = theme;
          });
        },
        setDensity: (density) => {
          set((state) => {
            state.ui.density = density;
          });
        },
        setLanguage: (language) => {
          set((state) => {
            state.ui.language = language;
          });
        },
        // Notification actions
        addNotification: (notification) => {
          const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          set((state) => {
            state.ui.notifications.push({
              ...notification,
              id,
              timestamp: /* @__PURE__ */ new Date(),
              dismissed: false
            });
          });
        },
        dismissNotification: (id) => {
          set((state) => {
            const notification = state.ui.notifications.find((n) => n.id === id);
            if (notification) {
              notification.dismissed = true;
            }
          });
        },
        clearNotifications: () => {
          set((state) => {
            state.ui.notifications = [];
          });
        },
        clearNotificationsByType: (type) => {
          set((state) => {
            state.ui.notifications = state.ui.notifications.filter((n) => n.type !== type);
          });
        },
        // Modal actions
        openConfirmDialog: (config2) => {
          set((state) => {
            state.ui.modals.confirmDialog = { ...config2, open: true };
          });
        },
        closeConfirmDialog: () => {
          set((state) => {
            state.ui.modals.confirmDialog = { open: false };
          });
        },
        openModal: (modalId, props = {}) => {
          set((state) => {
            state.ui.modals[modalId] = { open: true, ...props };
          });
        },
        closeModal: (modalId) => {
          set((state) => {
            if (state.ui.modals[modalId]) {
              state.ui.modals[modalId].open = false;
            }
          });
        },
        setGlobalLoading: (visible, message, progress) => {
          set((state) => {
            state.ui.globalLoading = { visible, message, progress };
          });
        },
        // Preferences actions
        updatePreferences: (updates) => {
          set((state) => {
            Object.assign(state.preferences, updates);
          });
        },
        resetPreferences: () => {
          set((state) => {
            state.preferences = { ...defaultPreferencesState };
          });
        },
        exportPreferences: () => {
          return get().preferences;
        },
        importPreferences: (preferences) => {
          set((state) => {
            Object.assign(state.preferences, preferences);
          });
        },
        setTimezone: (timezone) => {
          set((state) => {
            state.preferences.timezone = timezone;
          });
        },
        toggleCompactMode: () => {
          set((state) => {
            state.preferences.compactMode = !state.preferences.compactMode;
          });
        },
        toggleAdvancedFeatures: () => {
          set((state) => {
            state.preferences.showAdvancedFeatures = !state.preferences.showAdvancedFeatures;
          });
        },
        // Context actions
        createContext: (contextId, initialData = []) => {
          set((state) => {
            if (!state.contexts[contextId]) {
              state.contexts[contextId] = createDefaultContext(initialData);
            }
          });
        },
        updateContext: (contextId, updates) => {
          set((state) => {
            if (!state.contexts[contextId]) {
              state.contexts[contextId] = createDefaultContext();
            }
            Object.assign(state.contexts[contextId], updates);
          });
        },
        setContextData: (contextId, data) => {
          get().updateContext(contextId, { data });
        },
        clearContext: (contextId) => {
          set((state) => {
            if (state.contexts[contextId]) {
              state.contexts[contextId] = createDefaultContext();
            }
          });
        },
        removeContext: (contextId) => {
          set((state) => {
            delete state.contexts[contextId];
          });
        },
        resetContext: (contextId) => {
          set((state) => {
            state.contexts[contextId] = createDefaultContext();
          });
        },
        refreshContext: async (contextId) => {
          console.warn(`refreshContext not implemented for ${contextId}`);
        },
        exportContext: (contextId) => {
          return get().contexts[contextId] || null;
        },
        importContext: (contextId, state) => {
          set((draft) => {
            draft.contexts[contextId] = state;
          });
        },
        // Utility methods
        getContext: (contextId) => {
          return get().contexts[contextId] || null;
        },
        getFilterState: (contextId) => {
          if (!get().contexts[contextId]) {
            set((state) => {
              state.contexts[contextId] = createDefaultContext();
            });
          }
          return get().contexts[contextId].filters;
        },
        getPaginationState: (contextId) => {
          if (!get().contexts[contextId]) {
            set((state) => {
              state.contexts[contextId] = createDefaultContext();
            });
          }
          return get().contexts[contextId].pagination;
        },
        getSelectionState: (contextId) => {
          if (!get().contexts[contextId]) {
            set((state) => {
              state.contexts[contextId] = createDefaultContext();
            });
          }
          return get().contexts[contextId].selection;
        },
        getLoadingState: (contextId) => {
          if (!get().contexts[contextId]) {
            set((state) => {
              state.contexts[contextId] = createDefaultContext();
            });
          }
          return get().contexts[contextId].loading;
        },
        getFilteredData: (contextId, customFilter) => {
          const context = get().contexts[contextId];
          if (!context) return [];
          let filtered = [...context.data];
          const { searchTerm, statusFilter, customFilters } = context.filters;
          if (searchTerm) {
            filtered = filtered.filter(
              (item) => JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          if (statusFilter && statusFilter !== "all") {
            filtered = filtered.filter((item) => item.status === statusFilter);
          }
          Object.entries(customFilters).forEach(([key, value]) => {
            if (value !== void 0 && value !== null && value !== "") {
              filtered = filtered.filter((item) => item[key] === value);
            }
          });
          if (customFilter) {
            filtered = filtered.filter(customFilter);
          }
          const { sortBy, sortOrder } = context.filters;
          if (sortBy) {
            filtered.sort((a, b) => {
              const aVal = a[sortBy];
              const bVal = b[sortBy];
              if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
              if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
              return 0;
            });
          }
          return filtered;
        },
        getSelectedItems: (contextId) => {
          return get().contexts[contextId]?.selection.selectedItems || [];
        },
        isContextLoading: (contextId) => {
          return get().contexts[contextId]?.loading.isLoading || false;
        },
        getContextError: (contextId) => {
          return get().contexts[contextId]?.loading.error || null;
        },
        // Bulk operations
        resetAllContexts: () => {
          set((state) => {
            Object.keys(state.contexts).forEach((contextId) => {
              state.contexts[contextId] = createDefaultContext();
            });
          });
        },
        clearAllSelections: () => {
          set((state) => {
            Object.values(state.contexts).forEach((context) => {
              context.selection = { ...defaultSelectionState };
            });
          });
        },
        resetAllFilters: () => {
          set((state) => {
            Object.values(state.contexts).forEach((context) => {
              context.filters = { ...defaultFilterState };
            });
          });
        },
        // State persistence
        exportState: () => {
          const { contexts, preferences, ui } = get();
          return { contexts, preferences, ui };
        },
        importState: (state) => {
          set((draft) => {
            Object.assign(draft, state);
          });
        },
        resetToDefaults: () => {
          set({
            ui: { ...defaultUIState },
            preferences: { ...defaultPreferencesState },
            contexts: {},
            portalData: {}
          });
        }
      })),
      {
        name: persistenceKey,
        storage: storage ? middleware.createJSONStorage(() => storage) : void 0,
        partialize: (state) => ({
          preferences: state.preferences,
          ui: {
            // Only persist certain UI state
            theme: state.ui.theme,
            density: state.ui.density,
            language: state.ui.language,
            sidebarCollapsed: state.ui.sidebarCollapsed
          }
          // Don't persist contexts or notifications - they should reload fresh
        })
      }
    ) : immer.immer((set, get) => ({
      // Same implementation but without persistence
      // ... (implementation would be identical)
    }))
  );
  return store;
}
function createDefaultContext(initialData = []) {
  return {
    data: initialData,
    filters: { ...defaultFilterState },
    pagination: { ...defaultPaginationState },
    selection: { ...defaultSelectionState },
    loading: { ...defaultLoadingState }
  };
}

// src/stores/appStore.ts
var useAppStore = createAppStore({
  portalType: "headless",
  secureStorage: true
});
var initialStats = {
  totalRevenue: 0,
  monthlyRecurringRevenue: 0,
  averageRevenuePerUser: 0,
  churnRate: 0,
  totalInvoices: 0,
  paidInvoices: 0,
  overdueInvoices: 0,
  totalOutstanding: 0,
  collectionRate: 0,
  paymentMethodBreakdown: {},
  revenueByPlan: {},
  recentPayments: [],
  upcomingRenewals: []
};
var initialState = {
  accounts: [],
  invoices: [],
  payments: [],
  plans: [],
  subscriptions: [],
  stats: initialStats,
  selectedAccount: null,
  isLoading: false,
  error: null,
  isConnected: false,
  paymentProcessing: false
};
function useBilling(options = {}) {
  const {
    apiEndpoint = "/api/billing",
    websocketEndpoint,
    apiKey,
    tenantId,
    resellerId,
    stripePk,
    paypalClientId,
    pollInterval = 6e4,
    enableRealtime = true,
    maxRetries = 3
  } = options;
  const [state, setState] = React6.useState(initialState);
  const websocketRef = React6.useRef(null);
  const pollIntervalRef = React6.useRef(null);
  const retryCountRef = React6.useRef(0);
  const { addNotification } = useNotifications();
  const apiCall = React6.useCallback(
    async (endpoint, options2 = {}) => {
      const headers = {
        "Content-Type": "application/json",
        ...options2.headers
      };
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }
      if (tenantId) {
        headers["X-Tenant-ID"] = tenantId;
      }
      if (resellerId) {
        headers["X-Reseller-ID"] = resellerId;
      }
      const response = await fetch(`${apiEndpoint}${endpoint}`, {
        ...options2,
        headers
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    [apiEndpoint, apiKey, tenantId, resellerId]
  );
  const connectWebSocket = React6.useCallback(() => {
    if (!websocketEndpoint || !enableRealtime) return;
    try {
      if (websocketRef.current?.readyState === WebSocket.OPEN) return;
      const wsUrl = new URL(websocketEndpoint);
      if (apiKey) wsUrl.searchParams.set("apiKey", apiKey);
      if (tenantId) wsUrl.searchParams.set("tenantId", tenantId);
      if (resellerId) wsUrl.searchParams.set("resellerId", resellerId);
      const ws = new WebSocket(wsUrl.toString());
      websocketRef.current = ws;
      ws.onopen = () => {
        setState((prev) => ({ ...prev, isConnected: true, error: null }));
        retryCountRef.current = 0;
        addNotification({
          type: "system",
          priority: "low",
          title: "Billing System",
          message: "Real-time billing updates connected",
          channel: ["browser"],
          persistent: false
        });
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case "payment_completed":
              setState((prev) => ({
                ...prev,
                payments: [data.payment, ...prev.payments],
                invoices: prev.invoices.map(
                  (inv) => inv.id === data.payment.invoiceId ? {
                    ...inv,
                    status: "paid",
                    paidDate: new Date(data.payment.processedAt)
                  } : inv
                )
              }));
              addNotification({
                type: "success",
                priority: "medium",
                title: "Payment Received",
                message: `Payment of $${data.payment.amount} completed successfully`,
                channel: ["browser"],
                persistent: false
              });
              break;
            case "payment_failed":
              setState((prev) => ({
                ...prev,
                payments: prev.payments.map(
                  (payment) => payment.id === data.paymentId ? {
                    ...payment,
                    status: "failed",
                    failureReason: data.reason
                  } : payment
                )
              }));
              addNotification({
                type: "error",
                priority: "high",
                title: "Payment Failed",
                message: `Payment failed: ${data.reason}`,
                channel: ["browser"],
                persistent: true
              });
              break;
            case "invoice_created":
              setState((prev) => ({
                ...prev,
                invoices: [data.invoice, ...prev.invoices]
              }));
              addNotification({
                type: "info",
                priority: "medium",
                title: "New Invoice",
                message: `Invoice ${data.invoice.invoiceNumber} created`,
                channel: ["browser"],
                persistent: false
              });
              break;
            case "invoice_overdue":
              setState((prev) => ({
                ...prev,
                invoices: prev.invoices.map(
                  (inv) => inv.id === data.invoiceId ? { ...inv, status: "overdue" } : inv
                )
              }));
              addNotification({
                type: "warning",
                priority: "high",
                title: "Invoice Overdue",
                message: `Invoice ${data.invoiceNumber} is now overdue`,
                channel: ["browser"],
                persistent: true
              });
              break;
            case "subscription_renewed":
              setState((prev) => ({
                ...prev,
                subscriptions: prev.subscriptions.map(
                  (sub) => sub.id === data.subscriptionId ? { ...sub, ...data.updates } : sub
                )
              }));
              break;
            case "stats_update":
              setState((prev) => ({
                ...prev,
                stats: data.stats
              }));
              break;
          }
        } catch (error2) {
          console.error("Failed to parse WebSocket message:", error2);
        }
      };
      ws.onclose = () => {
        setState((prev) => ({ ...prev, isConnected: false }));
        if (retryCountRef.current < maxRetries) {
          const delay = Math.min(1e3 * Math.pow(2, retryCountRef.current), 3e4);
          setTimeout(() => {
            retryCountRef.current++;
            connectWebSocket();
          }, delay);
        }
      };
      ws.onerror = (error2) => {
        console.error("WebSocket error:", error2);
        setState((prev) => ({
          ...prev,
          isConnected: false,
          error: "WebSocket connection failed"
        }));
      };
    } catch (error2) {
      console.error("Failed to establish WebSocket connection:", error2);
      setState((prev) => ({
        ...prev,
        isConnected: false,
        error: error2 instanceof Error ? error2.message : "Connection failed"
      }));
    }
  }, [
    websocketEndpoint,
    enableRealtime,
    apiKey,
    tenantId,
    resellerId,
    maxRetries,
    addNotification
  ]);
  const loadAccounts = React6.useCallback(
    async (filters = {}) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== void 0) {
            params.append(key, String(value));
          }
        });
        const data = await apiCall(`/accounts?${params.toString()}`);
        setState((prev) => ({
          ...prev,
          accounts: data.accounts || [],
          isLoading: false
        }));
      } catch (error2) {
        setState((prev) => ({
          ...prev,
          error: error2 instanceof Error ? error2.message : "Failed to load accounts",
          isLoading: false
        }));
      }
    },
    [apiCall]
  );
  const loadInvoices = React6.useCallback(
    async (filters = {}) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== void 0) {
            params.append(key, value instanceof Date ? value.toISOString() : String(value));
          }
        });
        const data = await apiCall(`/invoices?${params.toString()}`);
        setState((prev) => ({
          ...prev,
          invoices: data.invoices || [],
          isLoading: false
        }));
      } catch (error2) {
        setState((prev) => ({
          ...prev,
          error: error2 instanceof Error ? error2.message : "Failed to load invoices",
          isLoading: false
        }));
      }
    },
    [apiCall]
  );
  const loadPayments = React6.useCallback(
    async (filters = {}) => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== void 0) {
            params.append(key, value instanceof Date ? value.toISOString() : String(value));
          }
        });
        const data = await apiCall(`/payments?${params.toString()}`);
        setState((prev) => ({
          ...prev,
          payments: data.payments || []
        }));
      } catch (error2) {
        setState((prev) => ({
          ...prev,
          error: error2 instanceof Error ? error2.message : "Failed to load payments"
        }));
      }
    },
    [apiCall]
  );
  const loadStats = React6.useCallback(
    async (timeRange = "30d") => {
      try {
        const data = await apiCall(`/stats?range=${timeRange}`);
        setState((prev) => ({
          ...prev,
          stats: data.stats || initialStats
        }));
      } catch (error2) {
        setState((prev) => ({
          ...prev,
          error: error2 instanceof Error ? error2.message : "Failed to load statistics"
        }));
      }
    },
    [apiCall]
  );
  const processPayment = React6.useCallback(
    async (paymentData) => {
      try {
        setState((prev) => ({ ...prev, paymentProcessing: true }));
        const data = await apiCall("/payments", {
          method: "POST",
          body: JSON.stringify(paymentData)
        });
        const newPayment = data.payment;
        setState((prev) => ({
          ...prev,
          payments: [newPayment, ...prev.payments],
          paymentProcessing: false
        }));
        if (newPayment.status === "completed") {
          addNotification({
            type: "success",
            priority: "medium",
            title: "Payment Processed",
            message: `Payment of $${newPayment.amount} processed successfully`,
            channel: ["browser"],
            persistent: false
          });
        } else if (newPayment.status === "failed") {
          addNotification({
            type: "error",
            priority: "high",
            title: "Payment Failed",
            message: newPayment.failureReason || "Payment processing failed",
            channel: ["browser"],
            persistent: true
          });
        }
        return newPayment;
      } catch (error2) {
        setState((prev) => ({ ...prev, paymentProcessing: false }));
        const errorMessage = error2 instanceof Error ? error2.message : "Payment processing failed";
        addNotification({
          type: "error",
          priority: "high",
          title: "Payment Error",
          message: errorMessage,
          channel: ["browser"],
          persistent: true
        });
        throw error2;
      }
    },
    [apiCall, addNotification]
  );
  const createInvoice = React6.useCallback(
    async (invoiceData) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        const data = await apiCall("/invoices", {
          method: "POST",
          body: JSON.stringify({
            ...invoiceData,
            dueDate: invoiceData.dueDate.toISOString()
          })
        });
        const newInvoice = data.invoice;
        setState((prev) => ({
          ...prev,
          invoices: [newInvoice, ...prev.invoices],
          isLoading: false
        }));
        addNotification({
          type: "success",
          priority: "medium",
          title: "Invoice Created",
          message: `Invoice ${newInvoice.invoiceNumber} created successfully`,
          channel: ["browser"],
          persistent: false
        });
        return newInvoice;
      } catch (error2) {
        setState((prev) => ({ ...prev, isLoading: false }));
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to create invoice";
        addNotification({
          type: "error",
          priority: "high",
          title: "Invoice Creation Failed",
          message: errorMessage,
          channel: ["browser"],
          persistent: false
        });
        throw error2;
      }
    },
    [apiCall, addNotification]
  );
  const updateInvoiceStatus = React6.useCallback(
    async (invoiceId, status, notes) => {
      try {
        const data = await apiCall(`/invoices/${invoiceId}/status`, {
          method: "PUT",
          body: JSON.stringify({ status, notes })
        });
        const updatedInvoice = data.invoice;
        setState((prev) => ({
          ...prev,
          invoices: prev.invoices.map((inv) => inv.id === invoiceId ? updatedInvoice : inv)
        }));
        return updatedInvoice;
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to update invoice";
        addNotification({
          type: "error",
          priority: "medium",
          title: "Update Failed",
          message: errorMessage,
          channel: ["browser"],
          persistent: false
        });
        throw error2;
      }
    },
    [apiCall, addNotification]
  );
  const sendInvoice = React6.useCallback(
    async (invoiceId, email) => {
      try {
        await apiCall(`/invoices/${invoiceId}/send`, {
          method: "POST",
          body: JSON.stringify({ email })
        });
        setState((prev) => ({
          ...prev,
          invoices: prev.invoices.map(
            (inv) => inv.id === invoiceId ? { ...inv, status: "sent" } : inv
          )
        }));
        addNotification({
          type: "success",
          priority: "low",
          title: "Invoice Sent",
          message: "Invoice has been sent to customer",
          channel: ["browser"],
          persistent: false
        });
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to send invoice";
        addNotification({
          type: "error",
          priority: "medium",
          title: "Send Failed",
          message: errorMessage,
          channel: ["browser"],
          persistent: false
        });
        throw error2;
      }
    },
    [apiCall, addNotification]
  );
  const addPaymentMethod = React6.useCallback(
    async (customerId, paymentMethodData) => {
      try {
        const data = await apiCall("/payment-methods", {
          method: "POST",
          body: JSON.stringify({
            customerId,
            ...paymentMethodData
          })
        });
        const paymentMethod = data.paymentMethod;
        addNotification({
          type: "success",
          priority: "low",
          title: "Payment Method Added",
          message: `${paymentMethod.type} ending in ${paymentMethod.lastFour} added successfully`,
          channel: ["browser"],
          persistent: false
        });
        return paymentMethod;
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to add payment method";
        addNotification({
          type: "error",
          priority: "medium",
          title: "Payment Method Failed",
          message: errorMessage,
          channel: ["browser"],
          persistent: false
        });
        throw error2;
      }
    },
    [apiCall, addNotification]
  );
  const refundPayment = React6.useCallback(
    async (paymentId, amount, reason) => {
      try {
        const data = await apiCall(`/payments/${paymentId}/refund`, {
          method: "POST",
          body: JSON.stringify({ amount, reason })
        });
        const refundedPayment = data.payment;
        setState((prev) => ({
          ...prev,
          payments: prev.payments.map(
            (payment) => payment.id === paymentId ? refundedPayment : payment
          )
        }));
        addNotification({
          type: "info",
          priority: "medium",
          title: "Refund Processed",
          message: `Refund of $${amount} processed successfully`,
          channel: ["browser"],
          persistent: false
        });
        return refundedPayment;
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to process refund";
        addNotification({
          type: "error",
          priority: "high",
          title: "Refund Failed",
          message: errorMessage,
          channel: ["browser"],
          persistent: false
        });
        throw error2;
      }
    },
    [apiCall, addNotification]
  );
  const retryPayment = React6.useCallback(
    async (paymentId) => {
      try {
        const data = await apiCall(`/payments/${paymentId}/retry`, {
          method: "POST"
        });
        const retriedPayment = data.payment;
        setState((prev) => ({
          ...prev,
          payments: prev.payments.map(
            (payment) => payment.id === paymentId ? retriedPayment : payment
          )
        }));
        return retriedPayment;
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to retry payment";
        addNotification({
          type: "error",
          priority: "medium",
          title: "Retry Failed",
          message: errorMessage,
          channel: ["browser"],
          persistent: false
        });
        throw error2;
      }
    },
    [apiCall, addNotification]
  );
  React6.useEffect(() => {
    loadAccounts({ limit: 50 });
    loadInvoices({ limit: 50 });
    loadPayments({ limit: 50 });
    loadStats();
    if (enableRealtime) {
      connectWebSocket();
    }
    if (!enableRealtime && pollInterval > 0) {
      pollIntervalRef.current = setInterval(() => {
        loadStats();
        loadInvoices({ limit: 10 });
        loadPayments({ limit: 10 });
      }, pollInterval);
    }
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [
    loadAccounts,
    loadInvoices,
    loadPayments,
    loadStats,
    connectWebSocket,
    enableRealtime,
    pollInterval
  ]);
  React6.useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);
  return {
    // State
    ...state,
    // Actions
    processPayment,
    createInvoice,
    updateInvoiceStatus,
    sendInvoice,
    addPaymentMethod,
    refundPayment,
    retryPayment,
    // Data loaders
    loadAccounts,
    loadInvoices,
    loadPayments,
    loadStats,
    // Connection management
    connect: connectWebSocket,
    disconnect: React6.useCallback(() => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    }, []),
    // Utils
    clearError: React6.useCallback(() => {
      setState((prev) => ({ ...prev, error: null }));
    }, []),
    selectAccount: React6.useCallback((account) => {
      setState((prev) => ({ ...prev, selectedAccount: account }));
    }, []),
    // Computed values
    overdueInvoices: state.invoices.filter((inv) => inv.status === "overdue"),
    unpaidInvoices: state.invoices.filter((inv) => inv.status === "sent" && inv.amountDue > 0),
    failedPayments: state.payments.filter((payment) => payment.status === "failed"),
    pendingPayments: state.payments.filter((payment) => payment.status === "pending"),
    recentPayments: state.payments.slice(0, 10),
    totalOutstanding: state.invoices.filter((inv) => ["sent", "overdue"].includes(inv.status)).reduce((sum, inv) => sum + inv.amountDue, 0)
  };
}
var initialStats2 = {
  totalSent: 0,
  totalDelivered: 0,
  totalFailed: 0,
  deliveryRate: 0,
  failureRate: 0,
  channelBreakdown: {},
  recentActivity: []
};
var initialState2 = {
  channels: [],
  templates: [],
  messages: [],
  stats: initialStats2,
  isLoading: false,
  error: null,
  isConnected: false
};
function useCommunication(options = {}) {
  const {
    apiEndpoint = "/api/communication",
    websocketEndpoint,
    apiKey,
    tenantId,
    pollInterval = 3e4,
    enableRealtime = true,
    maxRetries = 3
  } = options;
  const [state, setState] = React6.useState(initialState2);
  const websocketRef = React6.useRef(null);
  const pollIntervalRef = React6.useRef(null);
  const retryCountRef = React6.useRef(0);
  const { notify } = useNotifications();
  const apiCall = React6.useCallback(
    async (endpoint, options2 = {}) => {
      const headers = {
        "Content-Type": "application/json",
        ...options2.headers
      };
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }
      if (tenantId) {
        headers["X-Tenant-ID"] = tenantId;
      }
      const response = await fetch(`${apiEndpoint}${endpoint}`, {
        ...options2,
        headers
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    [apiEndpoint, apiKey, tenantId]
  );
  const connectWebSocket = React6.useCallback(() => {
    if (!websocketEndpoint || !enableRealtime) return;
    try {
      if (websocketRef.current?.readyState === WebSocket.OPEN) return;
      const wsUrl = new URL(websocketEndpoint);
      if (apiKey) wsUrl.searchParams.set("apiKey", apiKey);
      if (tenantId) wsUrl.searchParams.set("tenantId", tenantId);
      const ws = new WebSocket(wsUrl.toString());
      websocketRef.current = ws;
      ws.onopen = () => {
        setState((prev) => ({ ...prev, isConnected: true, error: null }));
        retryCountRef.current = 0;
        notify.info("Communication System", "Real-time communication connected", {
          metadata: { priority: "low", channel: ["browser"] }
        });
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case "message_status_update":
              setState((prev) => ({
                ...prev,
                messages: prev.messages.map((msg) => {
                  if (msg.id !== data.messageId) {
                    return msg;
                  }
                  const update = { status: data.status };
                  if (data.deliveredAt) {
                    update.deliveredAt = new Date(data.deliveredAt);
                  }
                  return { ...msg, ...update };
                })
              }));
              break;
            case "new_message":
              setState((prev) => ({
                ...prev,
                messages: [data.message, ...prev.messages]
              }));
              break;
            case "channel_status_update":
              setState((prev) => ({
                ...prev,
                channels: prev.channels.map(
                  (channel) => channel.id === data.channelId ? { ...channel, status: data.status } : channel
                )
              }));
              break;
            case "stats_update":
              setState((prev) => ({
                ...prev,
                stats: data.stats
              }));
              break;
          }
        } catch (error2) {
          console.error("Failed to parse WebSocket message:", error2);
        }
      };
      ws.onclose = () => {
        setState((prev) => ({ ...prev, isConnected: false }));
        if (retryCountRef.current < maxRetries) {
          const delay = Math.min(1e3 * Math.pow(2, retryCountRef.current), 3e4);
          setTimeout(() => {
            retryCountRef.current++;
            connectWebSocket();
          }, delay);
        }
      };
      ws.onerror = (error2) => {
        console.error("WebSocket error:", error2);
        setState((prev) => ({
          ...prev,
          isConnected: false,
          error: "WebSocket connection failed"
        }));
      };
    } catch (error2) {
      console.error("Failed to establish WebSocket connection:", error2);
      setState((prev) => ({
        ...prev,
        isConnected: false,
        error: error2 instanceof Error ? error2.message : "Connection failed"
      }));
    }
  }, [websocketEndpoint, enableRealtime, apiKey, tenantId, maxRetries, notify]);
  const loadChannels = React6.useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const data = await apiCall("/channels");
      setState((prev) => ({
        ...prev,
        channels: data.channels || [],
        isLoading: false
      }));
    } catch (error2) {
      setState((prev) => ({
        ...prev,
        error: error2 instanceof Error ? error2.message : "Failed to load channels",
        isLoading: false
      }));
    }
  }, [apiCall]);
  const loadTemplates = React6.useCallback(async () => {
    try {
      const data = await apiCall("/templates");
      setState((prev) => ({
        ...prev,
        templates: data.templates || []
      }));
    } catch (error2) {
      setState((prev) => ({
        ...prev,
        error: error2 instanceof Error ? error2.message : "Failed to load templates"
      }));
    }
  }, [apiCall]);
  const loadMessages = React6.useCallback(
    async (filters = {}) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== void 0) {
            params.append(key, value instanceof Date ? value.toISOString() : String(value));
          }
        });
        const data = await apiCall(`/messages?${params.toString()}`);
        setState((prev) => ({
          ...prev,
          messages: data.messages || [],
          isLoading: false
        }));
      } catch (error2) {
        setState((prev) => ({
          ...prev,
          error: error2 instanceof Error ? error2.message : "Failed to load messages",
          isLoading: false
        }));
      }
    },
    [apiCall]
  );
  const loadStats = React6.useCallback(
    async (timeRange = "24h") => {
      try {
        const data = await apiCall(`/stats?range=${timeRange}`);
        setState((prev) => ({
          ...prev,
          stats: data.stats || initialStats2
        }));
      } catch (error2) {
        setState((prev) => ({
          ...prev,
          error: error2 instanceof Error ? error2.message : "Failed to load statistics"
        }));
      }
    },
    [apiCall]
  );
  const sendMessage = React6.useCallback(
    async (messageData) => {
      try {
        const data = await apiCall("/messages", {
          method: "POST",
          body: JSON.stringify({
            ...messageData,
            scheduledAt: messageData.scheduledAt?.toISOString()
          })
        });
        const newMessage = data.message;
        setState((prev) => ({
          ...prev,
          messages: [newMessage, ...prev.messages]
        }));
        notify.success(
          "Message Sent",
          `Message sent to ${messageData.recipient} via ${messageData.channel}`,
          {
            metadata: { priority: "medium", channel: ["browser"] }
          }
        );
        return newMessage;
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to send message";
        notify.error("Message Failed", `Failed to send message: ${errorMessage}`, {
          metadata: { priority: "high", channel: ["browser"] }
        });
        throw error2;
      }
    },
    [apiCall, notify]
  );
  const sendBulkMessages = React6.useCallback(
    async (messages) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        const data = await apiCall("/messages/bulk", {
          method: "POST",
          body: JSON.stringify({
            messages: messages.map((msg) => ({
              ...msg,
              scheduledAt: msg.scheduledAt?.toISOString()
            }))
          })
        });
        const newMessages = data.messages || [];
        setState((prev) => ({
          ...prev,
          messages: [...newMessages, ...prev.messages],
          isLoading: false
        }));
        notify.success("Bulk Messages Sent", `${newMessages.length} messages queued for delivery`, {
          metadata: { priority: "medium", channel: ["browser"] }
        });
        return newMessages;
      } catch (error2) {
        setState((prev) => ({ ...prev, isLoading: false }));
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to send bulk messages";
        notify.error("Bulk Send Failed", `Failed to send bulk messages: ${errorMessage}`, {
          metadata: { priority: "high", channel: ["browser"] }
        });
        throw error2;
      }
    },
    [apiCall, notify]
  );
  const createTemplate = React6.useCallback(
    async (templateData) => {
      try {
        const data = await apiCall("/templates", {
          method: "POST",
          body: JSON.stringify(templateData)
        });
        const newTemplate = data.template;
        setState((prev) => ({
          ...prev,
          templates: [newTemplate, ...prev.templates]
        }));
        return newTemplate;
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to create template";
        setState((prev) => ({
          ...prev,
          error: errorMessage
        }));
        throw error2;
      }
    },
    [apiCall]
  );
  const updateTemplate = React6.useCallback(
    async (id, templateData) => {
      try {
        const data = await apiCall(`/templates/${id}`, {
          method: "PUT",
          body: JSON.stringify(templateData)
        });
        const updatedTemplate = data.template;
        setState((prev) => ({
          ...prev,
          templates: prev.templates.map(
            (template) => template.id === id ? updatedTemplate : template
          )
        }));
        return updatedTemplate;
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to update template";
        setState((prev) => ({
          ...prev,
          error: errorMessage
        }));
        throw error2;
      }
    },
    [apiCall]
  );
  const deleteTemplate = React6.useCallback(
    async (id) => {
      try {
        await apiCall(`/templates/${id}`, {
          method: "DELETE"
        });
        setState((prev) => ({
          ...prev,
          templates: prev.templates.filter((template) => template.id !== id)
        }));
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to delete template";
        setState((prev) => ({
          ...prev,
          error: errorMessage
        }));
        throw error2;
      }
    },
    [apiCall]
  );
  const testChannel = React6.useCallback(
    async (channelId, testData) => {
      try {
        const data = await apiCall(`/channels/${channelId}/test`, {
          method: "POST",
          body: JSON.stringify(testData)
        });
        const notifier = data.success ? notify.success : notify.error;
        notifier(
          "Channel Test",
          data.message || `Channel ${channelId} test ${data.success ? "passed" : "failed"}`,
          {
            metadata: { priority: "medium", channel: ["browser"] }
          }
        );
        return data;
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Channel test failed";
        notify.error("Channel Test Failed", errorMessage, {
          metadata: { priority: "high", channel: ["browser"] }
        });
        throw error2;
      }
    },
    [apiCall, notify]
  );
  const cancelMessage = React6.useCallback(
    async (messageId) => {
      try {
        await apiCall(`/messages/${messageId}/cancel`, {
          method: "POST"
        });
        setState((prev) => ({
          ...prev,
          messages: prev.messages.map(
            (msg) => msg.id === messageId ? { ...msg, status: "failed", failureReason: "Cancelled by user" } : msg
          )
        }));
        notify.info("Message Cancelled", "Message has been cancelled successfully", {
          metadata: { priority: "low", channel: ["browser"] }
        });
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to cancel message";
        notify.error("Cancel Failed", errorMessage, {
          metadata: { priority: "medium", channel: ["browser"] }
        });
        throw error2;
      }
    },
    [apiCall, notify]
  );
  const retryMessage = React6.useCallback(
    async (messageId) => {
      try {
        const data = await apiCall(`/messages/${messageId}/retry`, {
          method: "POST"
        });
        const retriedMessage = data.message;
        setState((prev) => ({
          ...prev,
          messages: prev.messages.map((msg) => msg.id === messageId ? retriedMessage : msg)
        }));
        notify.info("Message Retried", "Message has been queued for retry", {
          metadata: { priority: "low", channel: ["browser"] }
        });
        return retriedMessage;
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to retry message";
        notify.error("Retry Failed", errorMessage, {
          metadata: { priority: "medium", channel: ["browser"] }
        });
        throw error2;
      }
    },
    [apiCall, notify]
  );
  React6.useEffect(() => {
    loadChannels();
    loadTemplates();
    loadMessages({ limit: 50 });
    loadStats();
    if (enableRealtime) {
      connectWebSocket();
    }
    if (!enableRealtime && pollInterval > 0) {
      pollIntervalRef.current = setInterval(() => {
        loadStats();
        loadMessages({ limit: 10 });
      }, pollInterval);
    }
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [
    loadChannels,
    loadTemplates,
    loadMessages,
    loadStats,
    connectWebSocket,
    enableRealtime,
    pollInterval
  ]);
  React6.useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);
  return {
    // State
    ...state,
    // Actions
    sendMessage,
    sendBulkMessages,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    testChannel,
    cancelMessage,
    retryMessage,
    // Data loaders
    loadChannels,
    loadTemplates,
    loadMessages,
    loadStats,
    // Connection management
    connect: connectWebSocket,
    disconnect: React6.useCallback(() => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    }, []),
    // Utils
    clearError: React6.useCallback(() => {
      setState((prev) => ({ ...prev, error: null }));
    }, []),
    // Computed values
    activeChannels: state.channels.filter((ch) => ch.status === "active"),
    failedMessages: state.messages.filter((msg) => msg.status === "failed"),
    pendingMessages: state.messages.filter((msg) => msg.status === "pending"),
    recentMessages: state.messages.slice(0, 10)
  };
}

// src/business/isp-operations.ts
var ISPBusinessService = class {
  constructor(apiClient) {
    this.apiClient = apiClient;
    // Customer Service Operations
    this.customerService = {
      apiClient: this.apiClient,
      async getCustomerProfile(customerId) {
        try {
          const response = await this.apiClient.request(`/customers/${customerId}/profile`);
          if (!response.data) {
            throw new ISPError({
              message: "Customer profile not found",
              category: "business",
              severity: "medium",
              context: `customerId: ${customerId}`
            });
          }
          return response.data;
        } catch (error2) {
          throw new ISPError({
            message: `Failed to get customer profile: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `customerId: ${customerId}`,
            technicalDetails: { originalError: error2 }
          });
        }
      },
      async updateCustomerProfile(customerId, updates) {
        try {
          const response = await this.apiClient.request(`/customers/${customerId}/profile`, {
            method: "PUT",
            body: JSON.stringify(updates)
          });
          if (!response.data) {
            throw new ISPError({
              message: "Failed to update customer profile",
              category: "business",
              severity: "medium"
            });
          }
          return response.data;
        } catch (error2) {
          throw new ISPError({
            message: `Failed to update customer profile: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `customerId: ${customerId}`,
            technicalDetails: { originalError: error2, updates }
          });
        }
      },
      async updateServicePlan(customerId, planId) {
        try {
          await this.apiClient.request(`/customers/${customerId}/service-plan`, {
            method: "PUT",
            body: JSON.stringify({ planId })
          });
        } catch (error2) {
          throw new ISPError({
            message: `Failed to update service plan: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "high",
            context: `customerId: ${customerId}, planId: ${planId}`,
            technicalDetails: { originalError: error2 }
          });
        }
      },
      async getUsageHistory(customerId, period) {
        try {
          const response = await this.apiClient.request(
            `/customers/${customerId}/usage`,
            {
              params: {
                startDate: period.startDate.toISOString(),
                endDate: period.endDate.toISOString()
              }
            }
          );
          return response.data || [];
        } catch (error2) {
          throw new ISPError({
            message: `Failed to get usage history: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `customerId: ${customerId}`,
            technicalDetails: { originalError: error2, period }
          });
        }
      },
      async getBillingHistory(customerId, filters = {}) {
        try {
          const response = await this.apiClient.request(
            `/customers/${customerId}/invoices`,
            {
              params: filters
            }
          );
          return response.data || [];
        } catch (error2) {
          throw new ISPError({
            message: `Failed to get billing history: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `customerId: ${customerId}`,
            technicalDetails: { originalError: error2, filters }
          });
        }
      },
      async suspendService(customerId, reason) {
        try {
          await this.apiClient.request(`/customers/${customerId}/service/suspend`, {
            method: "POST",
            body: JSON.stringify({ reason })
          });
        } catch (error2) {
          throw new ISPError({
            message: `Failed to suspend service: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "high",
            context: `customerId: ${customerId}, reason: ${reason}`,
            technicalDetails: { originalError: error2 }
          });
        }
      },
      async reactivateService(customerId) {
        try {
          await this.apiClient.request(`/customers/${customerId}/service/reactivate`, {
            method: "POST"
          });
        } catch (error2) {
          throw new ISPError({
            message: `Failed to reactivate service: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "high",
            context: `customerId: ${customerId}`,
            technicalDetails: { originalError: error2 }
          });
        }
      },
      async calculateUsageCost(customerId, period) {
        try {
          const response = await this.apiClient.request(`/customers/${customerId}/usage/cost`, {
            params: {
              startDate: period.startDate.toISOString(),
              endDate: period.endDate.toISOString()
            }
          });
          return response.data?.cost || 0;
        } catch (error2) {
          throw new ISPError({
            message: `Failed to calculate usage cost: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `customerId: ${customerId}`,
            technicalDetails: { originalError: error2, period }
          });
        }
      }
    };
    // Service Operations
    this.serviceOperations = {
      apiClient: this.apiClient,
      async getServiceStatus(customerId) {
        try {
          const response = await this.apiClient.request(
            `/customers/${customerId}/service/status`
          );
          if (!response.data) {
            throw new ISPError({
              message: "Service status not found",
              category: "business",
              severity: "medium"
            });
          }
          return response.data;
        } catch (error2) {
          throw new ISPError({
            message: `Failed to get service status: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `customerId: ${customerId}`,
            technicalDetails: { originalError: error2 }
          });
        }
      },
      async scheduleMaintenanceWindow(params) {
        try {
          const response = await this.apiClient.request("/maintenance/schedule", {
            method: "POST",
            body: JSON.stringify(params)
          });
          if (!response.data) {
            throw new ISPError({
              message: "Failed to schedule maintenance",
              category: "business",
              severity: "medium"
            });
          }
          return response.data;
        } catch (error2) {
          throw new ISPError({
            message: `Failed to schedule maintenance: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "high",
            technicalDetails: { originalError: error2, params }
          });
        }
      },
      async troubleshootConnection(customerId) {
        try {
          const response = await this.apiClient.request(`/customers/${customerId}/diagnostics`, {
            method: "POST"
          });
          if (!response.data) {
            throw new ISPError({
              message: "Diagnostics failed to run",
              category: "business",
              severity: "medium"
            });
          }
          return response.data;
        } catch (error2) {
          throw new ISPError({
            message: `Connection troubleshooting failed: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `customerId: ${customerId}`,
            technicalDetails: { originalError: error2 }
          });
        }
      },
      async applyAutomatedFix(customerId, fixId) {
        try {
          const response = await this.apiClient.request(`/customers/${customerId}/diagnostics/fix/${fixId}`, {
            method: "POST"
          });
          return response.data?.success || false;
        } catch (error2) {
          throw new ISPError({
            message: `Failed to apply automated fix: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `customerId: ${customerId}, fixId: ${fixId}`,
            technicalDetails: { originalError: error2 }
          });
        }
      },
      async getMaintenanceHistory(customerId) {
        try {
          const response = await this.apiClient.request(`/customers/${customerId}/maintenance/history`);
          return response.data || [];
        } catch (error2) {
          throw new ISPError({
            message: `Failed to get maintenance history: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `customerId: ${customerId}`,
            technicalDetails: { originalError: error2 }
          });
        }
      },
      async getServicePlans(filters = {}) {
        try {
          const response = await this.apiClient.request("/service-plans", {
            params: filters
          });
          return response.data || [];
        } catch (error2) {
          throw new ISPError({
            message: `Failed to get service plans: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            technicalDetails: { originalError: error2, filters }
          });
        }
      },
      async upgradeService(customerId, newPlanId) {
        try {
          await this.apiClient.request(`/customers/${customerId}/service/upgrade`, {
            method: "POST",
            body: JSON.stringify({ planId: newPlanId })
          });
        } catch (error2) {
          throw new ISPError({
            message: `Service upgrade failed: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "high",
            context: `customerId: ${customerId}, newPlanId: ${newPlanId}`,
            technicalDetails: { originalError: error2 }
          });
        }
      }
    };
    // Network Operations
    this.networkOperations = {
      apiClient: this.apiClient,
      async getNetworkHealth() {
        try {
          const response = await this.apiClient.request("/network/health");
          if (!response.data) {
            throw new ISPError({
              message: "Network health data not available",
              category: "system",
              severity: "high"
            });
          }
          return response.data;
        } catch (error2) {
          throw new ISPError({
            message: `Failed to get network health: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "system",
            severity: "high",
            technicalDetails: { originalError: error2 }
          });
        }
      },
      async getRegionStatus(regionId) {
        try {
          const response = await this.apiClient.request(
            `/network/regions/${regionId}/status`
          );
          if (!response.data) {
            throw new ISPError({
              message: "Region status not found",
              category: "business",
              severity: "medium"
            });
          }
          return response.data;
        } catch (error2) {
          throw new ISPError({
            message: `Failed to get region status: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `regionId: ${regionId}`,
            technicalDetails: { originalError: error2 }
          });
        }
      },
      async getDeviceStatus(deviceId) {
        try {
          const response = await this.apiClient.request(
            `/network/devices/${deviceId}/status`
          );
          if (!response.data) {
            throw new ISPError({
              message: "Device status not found",
              category: "business",
              severity: "medium"
            });
          }
          return response.data;
        } catch (error2) {
          throw new ISPError({
            message: `Failed to get device status: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `deviceId: ${deviceId}`,
            technicalDetails: { originalError: error2 }
          });
        }
      },
      async configureDevice(deviceId, config) {
        try {
          await this.apiClient.request(`/network/devices/${deviceId}/configure`, {
            method: "POST",
            body: JSON.stringify(config)
          });
        } catch (error2) {
          throw new ISPError({
            message: `Device configuration failed: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "high",
            context: `deviceId: ${deviceId}`,
            technicalDetails: { originalError: error2, config }
          });
        }
      },
      async restartDevice(deviceId) {
        try {
          const response = await this.apiClient.request(`/network/devices/${deviceId}/restart`, {
            method: "POST"
          });
          return response.data?.success || false;
        } catch (error2) {
          throw new ISPError({
            message: `Device restart failed: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "high",
            context: `deviceId: ${deviceId}`,
            technicalDetails: { originalError: error2 }
          });
        }
      },
      async getNetworkAlerts(filters = {}) {
        try {
          const response = await this.apiClient.request("/network/alerts", {
            params: filters
          });
          return response.data || [];
        } catch (error2) {
          throw new ISPError({
            message: `Failed to get network alerts: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "system",
            severity: "medium",
            technicalDetails: { originalError: error2, filters }
          });
        }
      },
      async resolveAlert(alertId, notes) {
        try {
          await this.apiClient.request(`/network/alerts/${alertId}/resolve`, {
            method: "POST",
            body: JSON.stringify({ notes })
          });
        } catch (error2) {
          throw new ISPError({
            message: `Failed to resolve alert: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `alertId: ${alertId}`,
            technicalDetails: { originalError: error2, notes }
          });
        }
      },
      async getNetworkMetrics(period) {
        try {
          const response = await this.apiClient.request("/network/metrics", {
            params: {
              startDate: period.startDate.toISOString(),
              endDate: period.endDate.toISOString()
            }
          });
          return response.data || {};
        } catch (error2) {
          throw new ISPError({
            message: `Failed to get network metrics: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "system",
            severity: "medium",
            technicalDetails: { originalError: error2, period }
          });
        }
      }
    };
    // Billing Operations
    this.billingOperations = {
      apiClient: this.apiClient,
      async calculateRevenue(params) {
        try {
          const response = await this.apiClient.request(
            "/billing/revenue/calculate",
            {
              method: "POST",
              body: JSON.stringify(params)
            }
          );
          if (!response.data) {
            throw new ISPError({
              message: "Revenue calculation failed",
              category: "business",
              severity: "medium"
            });
          }
          return response.data;
        } catch (error2) {
          throw new ISPError({
            message: `Revenue calculation failed: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            technicalDetails: { originalError: error2, params }
          });
        }
      },
      async processPayment(paymentRequest) {
        try {
          const response = await this.apiClient.request(
            "/billing/payments/process",
            {
              method: "POST",
              body: JSON.stringify(paymentRequest)
            }
          );
          if (!response.data) {
            throw new ISPError({
              message: "Payment processing failed",
              category: "business",
              severity: "high"
            });
          }
          return response.data;
        } catch (error2) {
          throw new ISPError({
            message: `Payment processing failed: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "high",
            technicalDetails: {
              originalError: error2,
              paymentRequest: {
                ...paymentRequest,
                paymentMethodId: "[REDACTED]"
              }
            }
          });
        }
      },
      async generateCommissions(resellerId, period) {
        try {
          const response = await this.apiClient.request(
            "/billing/commissions/generate",
            {
              method: "POST",
              body: JSON.stringify({
                resellerId,
                startDate: period.startDate.toISOString(),
                endDate: period.endDate.toISOString()
              })
            }
          );
          return response.data || [];
        } catch (error2) {
          throw new ISPError({
            message: `Commission generation failed: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `resellerId: ${resellerId}`,
            technicalDetails: { originalError: error2, period }
          });
        }
      },
      async createInvoice(customerId, lineItems) {
        try {
          const response = await this.apiClient.request(
            "/billing/invoices/create",
            {
              method: "POST",
              body: JSON.stringify({ customerId, lineItems })
            }
          );
          if (!response.data) {
            throw new ISPError({
              message: "Invoice creation failed",
              category: "business",
              severity: "medium"
            });
          }
          return response.data;
        } catch (error2) {
          throw new ISPError({
            message: `Invoice creation failed: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `customerId: ${customerId}`,
            technicalDetails: { originalError: error2, lineItems }
          });
        }
      },
      async sendInvoice(invoiceId) {
        try {
          await this.apiClient.request(`/billing/invoices/${invoiceId}/send`, {
            method: "POST"
          });
        } catch (error2) {
          throw new ISPError({
            message: `Failed to send invoice: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `invoiceId: ${invoiceId}`,
            technicalDetails: { originalError: error2 }
          });
        }
      },
      async applyPayment(invoiceId, paymentId) {
        try {
          await this.apiClient.request(`/billing/invoices/${invoiceId}/apply-payment`, {
            method: "POST",
            body: JSON.stringify({ paymentId })
          });
        } catch (error2) {
          throw new ISPError({
            message: `Failed to apply payment to invoice: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "high",
            context: `invoiceId: ${invoiceId}, paymentId: ${paymentId}`,
            technicalDetails: { originalError: error2 }
          });
        }
      },
      async generateStatement(customerId, period) {
        try {
          const response = await this.apiClient.request(
            `/billing/customers/${customerId}/statement`,
            {
              params: {
                startDate: period.startDate.toISOString(),
                endDate: period.endDate.toISOString()
              }
            }
          );
          return response.data || {};
        } catch (error2) {
          throw new ISPError({
            message: `Statement generation failed: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `customerId: ${customerId}`,
            technicalDetails: { originalError: error2, period }
          });
        }
      },
      async calculateCommissionTiers(resellerId) {
        try {
          const response = await this.apiClient.request(
            `/billing/resellers/${resellerId}/commission-tiers`
          );
          return response.data || {};
        } catch (error2) {
          throw new ISPError({
            message: `Commission tier calculation failed: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
            category: "business",
            severity: "medium",
            context: `resellerId: ${resellerId}`,
            technicalDetails: { originalError: error2 }
          });
        }
      }
    };
  }
};
function createISPBusinessService(apiClient) {
  return new ISPBusinessService(apiClient);
}
function useISPBusiness(apiClient) {
  if (!apiClient) {
    throw new ISPError({
      message: "API client is required for ISP business operations",
      category: "system",
      severity: "high"
    });
  }
  return createISPBusinessService(apiClient);
}

// src/hooks/useISPBusiness.ts
function useISPBusiness2(options = {}) {
  const { portal, tenantId, resellerId } = options;
  const metadata = {};
  if (portal) {
    metadata.portal = portal;
  }
  if (resellerId) {
    metadata.resellerId = resellerId;
  }
  const apiClientConfig = tenantId || Object.keys(metadata).length ? {
    ...tenantId ? { tenantId } : {},
    ...Object.keys(metadata).length ? { metadata } : {}
  } : void 0;
  const apiClient = useApiClient(apiClientConfig);
  const businessService = React6.useMemo(() => {
    return createISPBusinessService(apiClient);
  }, [apiClient]);
  const customerOperations = React6.useMemo(
    () => ({
      getMyProfile: async (customerId) => {
        return businessService.customerService.getCustomerProfile(customerId);
      },
      getMyUsage: async (customerId, period) => {
        return businessService.customerService.getUsageHistory(customerId, period);
      },
      getMyBills: async (customerId) => {
        return businessService.customerService.getBillingHistory(customerId, {
          limit: 12
        });
      },
      getMyServiceStatus: async (customerId) => {
        return businessService.serviceOperations.getServiceStatus(customerId);
      },
      getCustomerOverview: async (customerId) => {
        const [profile, status, usage, bills] = await Promise.all([
          businessService.customerService.getCustomerProfile(customerId),
          businessService.serviceOperations.getServiceStatus(customerId),
          businessService.customerService.getUsageHistory(customerId, {
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3),
            // Last 30 days
            endDate: /* @__PURE__ */ new Date()
          }),
          businessService.customerService.getBillingHistory(customerId, {
            limit: 6
          })
        ]);
        return { profile, status, usage, bills };
      },
      getMyCustomers: async (resellerId2) => {
        const response = await apiClient.request(
          `/resellers/${resellerId2}/customers`
        );
        return response.data || [];
      },
      getResellerMetrics: async (resellerId2, period) => {
        const [customers, revenue, commissions] = await Promise.all([
          apiClient.request(`/resellers/${resellerId2}/customers`),
          businessService.billingOperations.calculateRevenue({
            dateRange: period,
            resellerId: resellerId2
          }),
          businessService.billingOperations.generateCommissions(resellerId2, period)
        ]);
        const customerData = customers.data || [];
        return {
          totalCustomers: customerData.length,
          activeCustomers: customerData.filter((c) => c.status === "active").length,
          revenue,
          commissions
        };
      }
    }),
    [businessService, apiClient]
  );
  const technicianOperations = React6.useMemo(
    () => ({
      getWorkOrders: async (technicianId) => {
        const response = await apiClient.request(
          `/technicians/${technicianId}/work-orders`
        );
        return response.data || [];
      },
      completeWorkOrder: async (workOrderId, notes) => {
        await apiClient.request(`/maintenance/${workOrderId}/complete`, {
          method: "POST",
          body: JSON.stringify({
            notes,
            completedAt: (/* @__PURE__ */ new Date()).toISOString()
          })
        });
      },
      runDiagnostics: async (customerId) => {
        return businessService.serviceOperations.troubleshootConnection(customerId);
      },
      getDeviceList: async (regionId) => {
        const params = regionId ? { regionId } : void 0;
        const response = await apiClient.request("/network/devices", {
          params
        });
        return response.data || [];
      }
    }),
    [businessService, apiClient]
  );
  const adminOperations = React6.useMemo(
    () => ({
      getSystemOverview: async () => {
        const [networkHealth, customersResponse, revenue] = await Promise.all([
          businessService.networkOperations.getNetworkHealth(),
          apiClient.request("/customers/count"),
          businessService.billingOperations.calculateRevenue({
            dateRange: {
              startDate: new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1),
              endDate: /* @__PURE__ */ new Date()
            }
          })
        ]);
        return {
          networkHealth,
          totalCustomers: customersResponse.data?.total || 0,
          totalRevenue: revenue,
          activeTickets: 0
          // Would be implemented
        };
      },
      bulkCustomerOperation: async (customerIds, operation) => {
        const promises = customerIds.map((customerId) => {
          if (operation === "suspend") {
            return businessService.customerService.suspendService(customerId, "Bulk admin action");
          } else {
            return businessService.customerService.reactivateService(customerId);
          }
        });
        await Promise.all(promises);
      }
    }),
    [businessService, apiClient]
  );
  const managementOperations = React6.useMemo(
    () => ({
      getDashboardData: async (period) => {
        const [revenue, networkHealth, customerGrowthResponse] = await Promise.all([
          businessService.billingOperations.calculateRevenue({
            dateRange: period
          }),
          businessService.networkOperations.getNetworkHealth(),
          apiClient.request("/analytics/customer-growth", {
            params: {
              startDate: period.startDate.toISOString(),
              endDate: period.endDate.toISOString()
            }
          })
        ]);
        return {
          revenue,
          networkHealth,
          customerGrowth: customerGrowthResponse.data?.growth || 0,
          servicePerformance: {}
          // Would be implemented
        };
      },
      generateReports: async (type, period) => {
        const response = await apiClient.request(`/reports/${type}`, {
          params: {
            startDate: period.startDate.toISOString(),
            endDate: period.endDate.toISOString()
          }
        });
        return response.data || {};
      }
    }),
    [businessService, apiClient]
  );
  return {
    apiClient,
    // Core business operations
    ...businessService,
    // Portal-optimized convenience methods
    customerOperations,
    technicianOperations,
    adminOperations,
    managementOperations
  };
}
function useCustomerBusiness(customerId) {
  const business = useISPBusiness2({ portal: "customer" });
  return {
    ...business,
    // Pre-bound methods for customer portal
    getMyProfile: React6.useCallback(
      () => business.customerOperations.getMyProfile(customerId),
      [business, customerId]
    ),
    getMyUsage: React6.useCallback(
      (period) => business.customerOperations.getMyUsage(customerId, period),
      [business, customerId]
    ),
    getMyBills: React6.useCallback(
      () => business.customerOperations.getMyBills(customerId),
      [business, customerId]
    ),
    getMyServiceStatus: React6.useCallback(
      () => business.customerOperations.getMyServiceStatus(customerId),
      [business, customerId]
    ),
    upgradeMyService: React6.useCallback(
      (planId) => business.serviceOperations.upgradeService(customerId, planId),
      [business, customerId]
    ),
    payBill: React6.useCallback(
      (paymentRequest) => business.billingOperations.processPayment(paymentRequest),
      [business]
    )
  };
}
function useResellerBusiness(resellerId) {
  const business = useISPBusiness2({ portal: "reseller", resellerId });
  return {
    ...business,
    // Pre-bound methods for reseller portal
    getMyCustomers: React6.useCallback(
      () => business.customerOperations.getMyCustomers(resellerId),
      [business, resellerId]
    ),
    getMyCommissions: React6.useCallback(
      (period) => business.billingOperations.generateCommissions(resellerId, period),
      [business, resellerId]
    ),
    getMyMetrics: React6.useCallback(
      (period) => business.customerOperations.getResellerMetrics(resellerId, period),
      [business, resellerId]
    ),
    addNewCustomer: React6.useCallback(
      async (customerData) => {
        const response = await business.apiClient.request("/customers", {
          method: "POST",
          body: JSON.stringify({ ...customerData, resellerId })
        });
        return response.data;
      },
      [business, resellerId]
    )
  };
}
function useTechnicianBusiness(technicianId) {
  const business = useISPBusiness2({ portal: "technician" });
  return {
    ...business,
    // Pre-bound methods for technician portal
    getMyWorkOrders: React6.useCallback(
      () => business.technicianOperations.getWorkOrders(technicianId),
      [business, technicianId]
    ),
    completeWorkOrder: React6.useCallback(
      (workOrderId, notes) => business.technicianOperations.completeWorkOrder(workOrderId, notes),
      [business]
    ),
    diagnoseCustomer: React6.useCallback(
      (customerId) => business.technicianOperations.runDiagnostics(customerId),
      [business]
    ),
    getMyDevices: React6.useCallback(
      (regionId) => business.technicianOperations.getDeviceList(regionId),
      [business]
    ),
    scheduleJob: React6.useCallback(
      (request) => business.serviceOperations.scheduleMaintenanceWindow(request),
      [business]
    )
  };
}
function useAdminBusiness() {
  const business = useISPBusiness2({ portal: "admin" });
  return {
    ...business,
    // Pre-bound methods for admin portal
    getSystemOverview: React6.useCallback(() => business.adminOperations.getSystemOverview(), [business]),
    bulkSuspendCustomers: React6.useCallback(
      (customerIds) => business.adminOperations.bulkCustomerOperation(customerIds, "suspend"),
      [business]
    ),
    bulkReactivateCustomers: React6.useCallback(
      (customerIds) => business.adminOperations.bulkCustomerOperation(customerIds, "reactivate"),
      [business]
    ),
    getNetworkHealth: React6.useCallback(() => business.networkOperations.getNetworkHealth(), [business]),
    getAllAlerts: React6.useCallback(() => business.networkOperations.getNetworkAlerts(), [business])
  };
}
function useManagementBusiness() {
  const business = useISPBusiness2({ portal: "management" });
  return {
    ...business,
    // Pre-bound methods for management portal
    getDashboard: React6.useCallback(
      (period) => business.managementOperations.getDashboardData(period),
      [business]
    ),
    getFinancialReport: React6.useCallback(
      (period) => business.managementOperations.generateReports("financial", period),
      [business]
    ),
    getOperationalReport: React6.useCallback(
      (period) => business.managementOperations.generateReports("operational", period),
      [business]
    ),
    getCustomerReport: React6.useCallback(
      (period) => business.managementOperations.generateReports("customer", period),
      [business]
    )
  };
}
var cache = /* @__PURE__ */ new Map();
function useApiData(key, fetcher, options = {
  // Implementation pending
}) {
  const {
    ttl = 5 * 60 * 1e3,
    // 5 minutes default
    fallbackData,
    enabled = true,
    retryCount = 2,
    retryDelay = 1e3
  } = options;
  const [data, setData] = React6.useState(() => fallbackData ?? null);
  const [isLoading, setIsLoading] = React6.useState(true);
  const [error2, setError] = React6.useState(null);
  const [lastUpdated, setLastUpdated] = React6.useState(null);
  const retryTimeoutRef = React6.useRef();
  const mountedRef = React6.useRef(true);
  const { notifyApiError } = useApiErrorNotifications();
  const useCachedData = React6.useCallback(() => {
    const cached = cache.get(key);
    const now = Date.now();
    if (cached && now - cached.timestamp < ttl) {
      setData(cached.data);
      setLastUpdated(new Date(cached.timestamp));
      return true;
    }
    return false;
  }, [key, ttl]);
  const handleFetchSuccess = React6.useCallback(
    (result) => {
      if (mountedRef.current) {
        setData(result);
        setLastUpdated(/* @__PURE__ */ new Date());
        setError(null);
        cache.set(key, {
          data: result,
          timestamp: Date.now()
        });
      }
    },
    [key]
  );
  const scheduleRetry = React6.useCallback(
    (attemptCount, fetchFn) => {
      const delay = retryDelay * 2 ** attemptCount;
      retryTimeoutRef.current = setTimeout(() => {
        fetchFn(attemptCount + 1);
      }, delay);
    },
    [retryDelay]
  );
  const useFallbackData = React6.useCallback(() => {
    if (fallbackData !== void 0 && fallbackData !== null && mountedRef.current && !data) {
      setData(fallbackData);
      setLastUpdated(/* @__PURE__ */ new Date());
      setError(null);
      cache.set(key, {
        data: fallbackData,
        timestamp: Date.now()
      });
      return true;
    }
    return false;
  }, [key, fallbackData, data]);
  const fetchWithFallback = React6.useCallback(
    async (attemptCount = 0) => {
      if (!enabled || !mountedRef.current) {
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        if (useCachedData()) {
          setIsLoading(false);
          return;
        }
        const result = await fetcher();
        handleFetchSuccess(result);
      } catch (apiError) {
        if (attemptCount < retryCount) {
          scheduleRetry(attemptCount, fetchWithFallback);
          return;
        }
        if (!useFallbackData() && mountedRef.current && attemptCount === retryCount) {
          setError(apiError);
          notifyApiError(apiError, `loading ${key.replace("-", " ")}`);
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [
      key,
      fetcher,
      enabled,
      retryCount,
      notifyApiError,
      useCachedData,
      handleFetchSuccess,
      scheduleRetry,
      useFallbackData
    ]
  );
  const refetch = React6.useCallback(async () => {
    cache.delete(key);
    await fetchWithFallback();
  }, [key, fetchWithFallback]);
  React6.useEffect(() => {
    mountedRef.current = true;
    fetchWithFallback();
    return () => {
      mountedRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fetchWithFallback]);
  React6.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return {
    data,
    isLoading,
    error: error2,
    refetch,
    lastUpdated
  };
}
function useCustomerDashboard() {
  return useApiData("customer-dashboard", async () => {
    const client = getApiClient();
    const response = await client.getCustomerDashboard();
    return response.data;
  });
}
function useCustomerServices() {
  return useApiData("customer-services", async () => {
    const client = getApiClient();
    const response = await client.getCustomerServices();
    return response.data;
  });
}
function useCustomerBilling() {
  return useApiData("customer-billing", async () => {
    const client = getApiClient();
    const response = await client.getCustomerBilling();
    return response.data;
  });
}
function useCustomerUsage(period) {
  return useApiData(`customer-usage-${period || "30d"}`, async () => {
    const client = getApiClient();
    const response = await client.getCustomerUsage(period);
    return response.data;
  });
}
function useCustomerDocuments() {
  return useApiData("customer-documents", async () => {
    const client = getApiClient();
    const response = await client.getCustomerDocuments();
    return response.data;
  });
}
function useCustomerSupportTickets() {
  return useApiData("customer-support-tickets", async () => {
    const client = getApiClient();
    const response = await client.getCustomerSupportTickets();
    return response.data;
  });
}
var useAppState = () => useAppStore();
var useUI = () => {
  const ui = useAppStore((state) => state.ui);
  const updateUI = useAppStore((state) => state.updateUI);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const toggleFilters = useAppStore((state) => state.toggleFilters);
  return {
    ...ui,
    updateUI,
    toggleSidebar,
    setActiveTab,
    setActiveView,
    toggleFilters
  };
};
var useAppNotifications = () => {
  const notifications = useAppStore((state) => state.ui.notifications);
  const addNotification = useAppStore((state) => state.addNotification);
  const dismissNotification = useAppStore((state) => state.dismissNotification);
  const clearNotifications = useAppStore((state) => state.clearNotifications);
  const activeNotifications = React6.useMemo(
    () => notifications.filter((n) => !n.dismissed),
    [notifications]
  );
  const addSuccess = React6.useCallback(
    (message) => {
      addNotification({ type: "success", title: "Success", message });
    },
    [addNotification]
  );
  const addError = React6.useCallback(
    (message) => {
      addNotification({ type: "error", title: "Error", message });
    },
    [addNotification]
  );
  const addWarning = React6.useCallback(
    (message) => {
      addNotification({ type: "warning", title: "Warning", message });
    },
    [addNotification]
  );
  const addInfo = React6.useCallback(
    (message) => {
      addNotification({ type: "info", title: "Info", message });
    },
    [addNotification]
  );
  return {
    notifications: activeNotifications,
    addNotification,
    addSuccess,
    addError,
    addWarning,
    addInfo,
    dismissNotification,
    clearNotifications
  };
};
var useFilters = (context) => {
  const filterState = useAppStore((state) => state.getFilterState(context));
  const updateFilters = useAppStore((state) => state.updateFilters);
  const resetFilters = useAppStore((state) => state.resetFilters);
  const setSearchTerm = useAppStore((state) => state.setSearchTerm);
  const setStatusFilter = useAppStore((state) => state.setStatusFilter);
  const setSorting = useAppStore((state) => state.setSorting);
  const setDateRange = useAppStore((state) => state.setDateRange);
  const updateFilter = React6.useCallback(
    (updates) => {
      updateFilters(context, updates);
    },
    [context, updateFilters]
  );
  const resetFilter = React6.useCallback(() => {
    resetFilters(context);
  }, [context, resetFilters]);
  const setSearch = React6.useCallback(
    (term) => {
      setSearchTerm(context, term);
    },
    [context, setSearchTerm]
  );
  const setStatus = React6.useCallback(
    (status) => {
      setStatusFilter(context, status);
    },
    [context, setStatusFilter]
  );
  const setSort = React6.useCallback(
    (sortBy, sortOrder = "asc") => {
      setSorting(context, sortBy, sortOrder);
    },
    [context, setSorting]
  );
  const setRange = React6.useCallback(
    (start, end) => {
      setDateRange(context, start, end);
    },
    [context, setDateRange]
  );
  const toggleSort = React6.useCallback(
    (sortBy) => {
      const currentOrder = filterState.sortBy === sortBy ? filterState.sortOrder : "asc";
      const newOrder = currentOrder === "asc" ? "desc" : "asc";
      setSort(sortBy, newOrder);
    },
    [filterState.sortBy, filterState.sortOrder, setSort]
  );
  const hasActiveFilters = React6.useMemo(() => {
    return filterState.searchTerm !== "" || filterState.statusFilter !== "all" || filterState.dateRange?.start !== null || filterState.dateRange?.end !== null || Object.keys(filterState.customFilters).length > 0;
  }, [filterState]);
  return {
    ...filterState,
    updateFilter,
    resetFilter,
    setSearch,
    setStatus,
    setSort,
    setRange,
    toggleSort,
    hasActiveFilters
  };
};
var usePagination = (context) => {
  const paginationState = useAppStore((state) => state.getPaginationState(context));
  const updatePagination = useAppStore((state) => state.updatePagination);
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);
  const setItemsPerPage = useAppStore((state) => state.setItemsPerPage);
  const setTotalItems = useAppStore((state) => state.setTotalItems);
  const updatePage = React6.useCallback(
    (updates) => {
      updatePagination(context, updates);
    },
    [context, updatePagination]
  );
  const goToPage = React6.useCallback(
    (page) => {
      setCurrentPage(context, page);
    },
    [context, setCurrentPage]
  );
  const changeItemsPerPage = React6.useCallback(
    (itemsPerPage) => {
      setItemsPerPage(context, itemsPerPage);
    },
    [context, setItemsPerPage]
  );
  const setTotal = React6.useCallback(
    (totalItems) => {
      setTotalItems(context, totalItems);
    },
    [context, setTotalItems]
  );
  const nextPage = React6.useCallback(() => {
    if (paginationState.currentPage < paginationState.totalPages) {
      goToPage(paginationState.currentPage + 1);
    }
  }, [paginationState.currentPage, paginationState.totalPages, goToPage]);
  const previousPage = React6.useCallback(() => {
    if (paginationState.currentPage > 1) {
      goToPage(paginationState.currentPage - 1);
    }
  }, [paginationState.currentPage, goToPage]);
  const firstPage = React6.useCallback(() => {
    goToPage(1);
  }, [goToPage]);
  const lastPage = React6.useCallback(() => {
    goToPage(paginationState.totalPages);
  }, [paginationState.totalPages, goToPage]);
  const canGoNext = paginationState.currentPage < paginationState.totalPages;
  const canGoPrevious = paginationState.currentPage > 1;
  const startItem = (paginationState.currentPage - 1) * paginationState.itemsPerPage + 1;
  const endItem = Math.min(
    paginationState.currentPage * paginationState.itemsPerPage,
    paginationState.totalItems
  );
  return {
    ...paginationState,
    updatePage,
    goToPage,
    changeItemsPerPage,
    setTotal,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    canGoNext,
    canGoPrevious,
    startItem,
    endItem
  };
};
var useSelection = (context) => {
  const selectionState = useAppStore((state) => state.getSelectionState(context));
  useAppStore((state) => state.updateSelection);
  const selectItem = useAppStore((state) => state.selectItem);
  const deselectItem = useAppStore((state) => state.deselectItem);
  const toggleSelectAll = useAppStore((state) => state.toggleSelectAll);
  const clearSelection = useAppStore((state) => state.clearSelection);
  const select = React6.useCallback(
    (item, multiple = false) => {
      selectItem(context, item, multiple);
    },
    [context, selectItem]
  );
  const deselect = React6.useCallback(
    (item) => {
      deselectItem(context, item);
    },
    [context, deselectItem]
  );
  const toggleItem = React6.useCallback(
    (item, multiple = false) => {
      const isSelected2 = selectionState.selectedItems.includes(item);
      if (isSelected2) {
        deselect(item);
      } else {
        select(item, multiple);
      }
    },
    [selectionState.selectedItems, select, deselect]
  );
  const toggleAll = React6.useCallback(
    (allItems) => {
      toggleSelectAll(context, allItems);
    },
    [context, toggleSelectAll]
  );
  const clear = React6.useCallback(() => {
    clearSelection(context);
  }, [context, clearSelection]);
  const isSelected = React6.useCallback(
    (item) => {
      return selectionState.selectedItems.includes(item);
    },
    [selectionState.selectedItems]
  );
  const hasSelection = selectionState.selectedItems.length > 0;
  const selectedCount = selectionState.selectedItems.length;
  return {
    ...selectionState,
    select,
    deselect,
    toggleItem,
    toggleAll,
    clear,
    isSelected,
    hasSelection,
    selectedCount
  };
};
var useLoading = (context) => {
  const loadingState = useAppStore((state) => state.getLoadingState(context));
  const updateLoading = useAppStore((state) => state.updateLoading);
  const setLoading = useAppStore((state) => state.setLoading);
  const setError = useAppStore((state) => state.setError);
  const setLastUpdated = useAppStore((state) => state.setLastUpdated);
  const startLoading = React6.useCallback(
    (operationId) => {
      setLoading(context, true, operationId);
    },
    [context, setLoading]
  );
  const stopLoading = React6.useCallback(() => {
    setLoading(context, false);
    setLastUpdated(context);
  }, [context, setLoading, setLastUpdated]);
  const setErrorState = React6.useCallback(
    (error2) => {
      setError(context, error2);
    },
    [context, setError]
  );
  const clearError = React6.useCallback(() => {
    setError(context, null);
  }, [context, setError]);
  const updateState = React6.useCallback(
    (updates) => {
      updateLoading(context, updates);
    },
    [context, updateLoading]
  );
  return {
    ...loadingState,
    startLoading,
    stopLoading,
    setError: setErrorState,
    clearError,
    updateState
  };
};
var usePreferences = () => {
  const preferences = useAppStore((state) => state.preferences);
  const updatePreferences = useAppStore((state) => state.updatePreferences);
  const setTheme = useAppStore((state) => state.setTheme);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const setTimezone = useAppStore((state) => state.setTimezone);
  const toggleCompactMode = useAppStore((state) => state.toggleCompactMode);
  const toggleAdvancedFeatures = useAppStore((state) => state.toggleAdvancedFeatures);
  return {
    ...preferences,
    updatePreferences,
    setTheme,
    setLanguage,
    setTimezone,
    toggleCompactMode,
    toggleAdvancedFeatures
  };
};
var useDataTable = (context) => {
  const filters = useFilters(context);
  const pagination = usePagination(context);
  const selection = useSelection(context);
  const loading = useLoading(context);
  const resetContext = useAppStore((state) => state.resetContext);
  const reset = React6.useCallback(() => {
    resetContext(context);
  }, [context, resetContext]);
  return {
    filters,
    pagination,
    selection,
    loading,
    reset
  };
};
var useFormState = (context) => {
  const loading = useLoading(context);
  const { addSuccess, addError } = useAppNotifications();
  const handleSubmit = React6.useCallback(
    async (submitFn, {
      successMessage = "Operation completed successfully",
      errorMessage = "Operation failed"
    } = {}) => {
      loading.startLoading();
      try {
        await submitFn();
        loading.stopLoading();
        addSuccess(successMessage);
      } catch (error2) {
        const errorMsg = error2 instanceof Error ? error2.message : errorMessage;
        loading.setError(errorMsg);
        addError(errorMsg);
      }
    },
    [loading, addSuccess, addError]
  );
  return {
    ...loading,
    handleSubmit
  };
};

// src/services/PersistentErrorQueue.ts
init_error_contract();
var DEFAULT_CONFIG2 = {
  maxQueueSize: 100,
  maxAge: 24 * 60 * 60 * 1e3,
  // 24 hours
  autoSync: true,
  syncInterval: 60 * 1e3,
  // 1 minute
  maxRetries: 3
};
var STORAGE_KEY = "dotmac_error_queue";
var PersistentErrorQueue = class {
  constructor(config = {}) {
    this.syncIntervalId = null;
    this.isSyncing = false;
    this.isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
    /**
     * Handle online event
     */
    this.handleOnline = () => {
      console.log("Connection restored, syncing error queue");
      this.isOnline = true;
      this.sync().catch((err) => {
        console.error("Failed to sync on reconnection:", err);
      });
    };
    /**
     * Handle offline event
     */
    this.handleOffline = () => {
      console.log("Connection lost, errors will be queued");
      this.isOnline = false;
    };
    this.config = { ...DEFAULT_CONFIG2, ...config };
    if (typeof window !== "undefined") {
      window.addEventListener("online", this.handleOnline);
      window.addEventListener("offline", this.handleOffline);
      if (this.config.autoSync) {
        this.startAutoSync();
      }
    }
  }
  /**
   * Add an error to the queue
   */
  enqueue(error2) {
    if (typeof localStorage === "undefined") {
      console.warn("LocalStorage not available, error will not be persisted");
      return;
    }
    const queue = this.loadQueue();
    if (queue.length >= this.config.maxQueueSize) {
      queue.shift();
    }
    const queuedError = {
      error: error2,
      queued_at: (/* @__PURE__ */ new Date()).toISOString(),
      retry_count: 0
    };
    queue.push(queuedError);
    this.saveQueue(queue);
    if (this.isOnline && this.config.autoSync) {
      this.sync().catch((err) => {
        console.error("Failed to sync error queue:", err);
      });
    }
  }
  /**
   * Get all queued errors
   */
  getQueue() {
    return this.loadQueue();
  }
  /**
   * Get count of queued errors
   */
  getQueueSize() {
    return this.loadQueue().length;
  }
  /**
   * Clear all queued errors
   */
  clear() {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  /**
   * Manually trigger sync
   */
  async sync() {
    if (!this.config.errorEndpoint) {
      console.warn("No error endpoint configured, skipping sync");
      return;
    }
    if (this.isSyncing) {
      console.log("Sync already in progress, skipping");
      return;
    }
    if (!this.isOnline) {
      console.log("Offline, skipping sync");
      return;
    }
    this.isSyncing = true;
    try {
      const queue = this.loadQueue();
      if (queue.length === 0) {
        return;
      }
      const now = (/* @__PURE__ */ new Date()).getTime();
      const validQueue = queue.filter((item) => {
        const queuedAt = new Date(item.queued_at).getTime();
        return now - queuedAt < this.config.maxAge;
      });
      const retryableErrors = validQueue.filter(
        (item) => item.retry_count < this.config.maxRetries
      );
      if (retryableErrors.length === 0) {
        this.saveQueue([]);
        return;
      }
      const response = await fetch(this.config.errorEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          errors: retryableErrors.map((item) => item.error),
          batch_id: `batch_${Date.now()}`
        })
      });
      if (response.ok) {
        this.clear();
        console.log(`Successfully synced ${retryableErrors.length} errors`);
      } else {
        const updatedQueue = retryableErrors.map((item) => ({
          ...item,
          retry_count: item.retry_count + 1,
          last_retry_at: (/* @__PURE__ */ new Date()).toISOString()
        }));
        this.saveQueue(updatedQueue);
        console.warn(`Failed to sync errors: ${response.statusText}`);
      }
    } catch (error2) {
      console.error("Error during sync:", error2);
      const queue = this.loadQueue();
      const updatedQueue = queue.map((item) => ({
        ...item,
        retry_count: item.retry_count + 1,
        last_retry_at: (/* @__PURE__ */ new Date()).toISOString()
      }));
      this.saveQueue(updatedQueue);
    } finally {
      this.isSyncing = false;
    }
  }
  /**
   * Start automatic synchronization
   */
  startAutoSync() {
    if (this.syncIntervalId !== null) {
      return;
    }
    this.syncIntervalId = setInterval(() => {
      this.sync().catch((err) => {
        console.error("Auto-sync failed:", err);
      });
    }, this.config.syncInterval);
  }
  /**
   * Stop automatic synchronization
   */
  stopAutoSync() {
    if (this.syncIntervalId !== null) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }
  }
  /**
   * Destroy the queue and clean up
   */
  destroy() {
    this.stopAutoSync();
    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleOnline);
      window.removeEventListener("offline", this.handleOffline);
    }
  }
  /**
   * Load queue from LocalStorage
   */
  loadQueue() {
    if (typeof localStorage === "undefined") {
      return [];
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }
      const queue = JSON.parse(data);
      return Array.isArray(queue) ? queue : [];
    } catch (error2) {
      console.error("Failed to load error queue:", error2);
      return [];
    }
  }
  /**
   * Save queue to LocalStorage
   */
  saveQueue(queue) {
    if (typeof localStorage === "undefined") {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch (error2) {
      console.error("Failed to save error queue:", error2);
      if (error2 instanceof DOMException && error2.name === "QuotaExceededError") {
        const halfQueue = queue.slice(Math.floor(queue.length / 2));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(halfQueue));
        } catch {
          console.error("Storage quota exceeded, unable to save errors");
        }
      }
    }
  }
};
var globalQueue = null;
function getErrorQueue(config) {
  if (globalQueue === null) {
    globalQueue = new PersistentErrorQueue(config);
  }
  return globalQueue;
}

// src/services/ErrorLoggingService.ts
init_error_contract();
var ErrorLoggingService = class {
  constructor(config = {}) {
    this.logBuffer = [];
    this.metricsBuffer = /* @__PURE__ */ new Map();
    this.isOnline = true;
    this.config = {
      enableConsoleLogging: process.env["NODE_ENV"] === "development",
      enableRemoteLogging: true,
      enableMetrics: true,
      enableTracing: true,
      logLevel: "error",
      batchSize: 10,
      flushInterval: 3e4,
      // 30 seconds
      maxRetries: 3,
      endpoints: {},
      filters: {},
      ...config
    };
    this.setupFlushTimer();
    this.setupNetworkStatusListener();
  }
  /**
   * Log an enhanced error with full context
   */
  logError(error2, additionalContext = {}) {
    if (!this.shouldLog(error2)) {
      return;
    }
    const logEntry = this.createLogEntry(error2, additionalContext);
    if (this.config.enableConsoleLogging) {
      this.logToConsole(logEntry);
    }
    if (this.config.enableRemoteLogging) {
      this.logBuffer.push(logEntry);
      if (error2.severity === "critical") {
        this.flushLogs();
      }
    }
    if (this.config.enableMetrics) {
      this.updateMetrics(error2);
    }
    if (this.config.enableTracing && logEntry.traceId) {
      this.sendTrace(logEntry);
    }
  }
  /**
   * Log API request/response for error context
   */
  logApiError(url, method, status, error2, requestDuration, requestPayload, responsePayload) {
    const apiContext = {
      operation: `${method} ${url}`,
      resource: "api_endpoint",
      duration: requestDuration,
      metadata: {
        httpMethod: method,
        httpStatus: status,
        requestPayload: this.sanitizePayload(requestPayload),
        responsePayload: this.sanitizePayload(responsePayload)
      }
    };
    this.logError(error2, apiContext);
  }
  /**
   * Log business operation errors with workflow context
   */
  logBusinessError(error2, businessProcess, workflowStep, customerImpact, metadata = {}) {
    const businessContext = {
      businessProcess,
      workflowStep,
      customerImpact,
      metadata: this.sanitizePayload(metadata)
    };
    this.logError(error2, businessContext);
  }
  /**
   * Get current error metrics
   */
  getMetrics() {
    const now = Date.now();
    const oneMinuteAgo = now - 6e4;
    const recentErrors = this.logBuffer.filter(
      (entry) => new Date(entry.timestamp).getTime() > oneMinuteAgo
    );
    const errorCounts = /* @__PURE__ */ new Map();
    const categoryCounts = /* @__PURE__ */ new Map();
    const impactCounts = /* @__PURE__ */ new Map();
    let criticalCount = 0;
    this.logBuffer.forEach((entry) => {
      if (entry.severity === "critical") criticalCount++;
      errorCounts.set(entry.errorCode, (errorCounts.get(entry.errorCode) || 0) + 1);
      categoryCounts.set(entry.category, (categoryCounts.get(entry.category) || 0) + 1);
      if (entry.customerImpact) {
        impactCounts.set(entry.customerImpact, (impactCounts.get(entry.customerImpact) || 0) + 1);
      }
    });
    return {
      errorCount: this.logBuffer.length,
      errorRate: recentErrors.length,
      criticalErrorCount: criticalCount,
      topErrorCodes: Array.from(errorCounts.entries()).map(([code, count]) => ({ code, count })).sort((a, b) => b.count - a.count).slice(0, 10),
      topErrorCategories: Array.from(categoryCounts.entries()).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count).slice(0, 5),
      customerImpactDistribution: Object.fromEntries(impactCounts)
    };
  }
  /**
   * Clear old logs to prevent memory issues
   */
  clearOldLogs(maxAge = 36e5) {
    const cutoff = Date.now() - maxAge;
    this.logBuffer = this.logBuffer.filter((entry) => new Date(entry.timestamp).getTime() > cutoff);
  }
  /**
   * Force flush all pending logs
   */
  async flushLogs() {
    if (this.logBuffer.length === 0) return;
    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];
    try {
      if (this.config.endpoints.logs) {
        if (this.isOnline) {
          await this.sendLogsToEndpoint(logsToSend, this.config.endpoints.logs);
        } else {
          this.saveToPersistentQueue(logsToSend);
        }
      }
    } catch (error2) {
      this.saveToPersistentQueue(logsToSend);
      console.error("Failed to flush error logs, saved to persistent queue:", error2);
    }
  }
  /**
   * Save logs to persistent queue for offline support
   */
  saveToPersistentQueue(logs) {
    const persistentQueue = getErrorQueue({
      errorEndpoint: this.config.endpoints.logs,
      maxQueueSize: 100,
      autoSync: true
    });
    logs.forEach((log) => {
      const standardError = {
        error_code: log.errorCode,
        message: log.message,
        user_message: log.message,
        // Use same message for now
        correlation_id: log.correlationId || `err_${Date.now()}`,
        timestamp: log.timestamp,
        status: 500,
        // Default status for logged errors
        severity: this.mapSeverity(log.severity),
        category: this.mapCategory(log.category),
        retryable: true,
        details: {
          ...log.technicalDetails,
          errorId: log.errorId,
          component: log.component,
          operation: log.operation,
          resource: log.resource,
          businessProcess: log.businessProcess,
          workflowStep: log.workflowStep,
          customerImpact: log.customerImpact
        },
        trace_id: log.traceId,
        request_id: log.requestId
      };
      persistentQueue.enqueue(standardError);
    });
  }
  /**
   * Map severity to standard format
   */
  mapSeverity(severity) {
    const { ErrorSeverity: ErrorSeverity2 } = (init_error_contract(), __toCommonJS(error_contract_exports));
    switch (severity.toLowerCase()) {
      case "low":
        return ErrorSeverity2.LOW;
      case "medium":
        return ErrorSeverity2.MEDIUM;
      case "high":
        return ErrorSeverity2.HIGH;
      case "critical":
        return ErrorSeverity2.CRITICAL;
      default:
        return ErrorSeverity2.MEDIUM;
    }
  }
  /**
   * Map category to standard format
   */
  mapCategory(category) {
    const { ErrorCategory: ErrorCategory2 } = (init_error_contract(), __toCommonJS(error_contract_exports));
    switch (category.toLowerCase()) {
      case "network":
        return ErrorCategory2.NETWORK;
      case "validation":
        return ErrorCategory2.VALIDATION;
      case "authentication":
        return ErrorCategory2.AUTHENTICATION;
      case "authorization":
        return ErrorCategory2.AUTHORIZATION;
      case "business":
        return ErrorCategory2.BUSINESS;
      case "system":
        return ErrorCategory2.SYSTEM;
      case "database":
        return ErrorCategory2.DATABASE;
      case "external_service":
        return ErrorCategory2.EXTERNAL_SERVICE;
      default:
        return ErrorCategory2.UNKNOWN;
    }
  }
  /**
   * Generate error report for debugging
   */
  generateErrorReport(timeRange) {
    const filteredLogs = this.logBuffer.filter((entry) => {
      const timestamp = new Date(entry.timestamp);
      return timestamp >= timeRange.start && timestamp <= timeRange.end;
    });
    const insights = [];
    const metrics = this.getMetrics();
    if (metrics.criticalErrorCount > 0) {
      insights.push(
        `${metrics.criticalErrorCount} critical errors detected requiring immediate attention`
      );
    }
    if (metrics.errorRate > 10) {
      insights.push(`High error rate detected: ${metrics.errorRate} errors/minute`);
    }
    const customerImpactHigh = metrics.customerImpactDistribution.high || 0;
    const customerImpactCritical = metrics.customerImpactDistribution.critical || 0;
    if (customerImpactHigh + customerImpactCritical > 0) {
      insights.push(
        `${customerImpactHigh + customerImpactCritical} errors with high customer impact`
      );
    }
    return {
      summary: metrics,
      detailedLogs: filteredLogs,
      insights
    };
  }
  createLogEntry(error2, additionalContext) {
    const errorResponse = error2.toEnhancedResponse();
    return {
      errorId: errorResponse.error.id,
      errorCode: errorResponse.error.code,
      message: errorResponse.error.message,
      severity: errorResponse.error.severity,
      category: errorResponse.error.category,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      // Context from error
      correlationId: errorResponse.context.correlationId,
      traceId: errorResponse.context.traceId,
      operation: errorResponse.context.operation,
      resource: errorResponse.context.resource,
      resourceId: errorResponse.context.resourceId,
      businessProcess: errorResponse.context.businessProcess,
      workflowStep: errorResponse.context.workflowStep,
      customerImpact: errorResponse.context.customerImpact,
      service: errorResponse.context.service,
      component: errorResponse.context.component,
      version: errorResponse.context.version,
      environment: errorResponse.context.environment,
      // Technical details
      stackTrace: error2.stack,
      technicalDetails: errorResponse.details.debugInfo,
      // Browser context
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      // Additional context
      tags: errorResponse.context.tags,
      metadata: errorResponse.context.metadata,
      // Override with additional context
      ...additionalContext
    };
  }
  shouldLog(error2) {
    const { filters } = this.config;
    if (filters.minSeverity) {
      const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
      if (severityOrder[error2.severity] < severityOrder[filters.minSeverity]) {
        return false;
      }
    }
    if (filters.excludeCategories?.includes(error2.category)) {
      return false;
    }
    if (filters.excludeCodes?.includes(error2.errorCode)) {
      return false;
    }
    return true;
  }
  logToConsole(logEntry) {
    const logLevel = logEntry.severity === "critical" ? "error" : "warn";
    console[logLevel]("\u{1F6A8} Enhanced ISP Error:", {
      id: logEntry.errorId,
      code: logEntry.errorCode,
      message: logEntry.message,
      severity: logEntry.severity,
      context: {
        operation: logEntry.operation,
        resource: logEntry.resource,
        businessProcess: logEntry.businessProcess,
        customerImpact: logEntry.customerImpact
      },
      technicalDetails: logEntry.technicalDetails
    });
  }
  updateMetrics(error2) {
    const metricKey = `error.${error2.errorCode}`;
    this.metricsBuffer.set(metricKey, (this.metricsBuffer.get(metricKey) || 0) + 1);
    const categoryKey = `error.category.${error2.category}`;
    this.metricsBuffer.set(categoryKey, (this.metricsBuffer.get(categoryKey) || 0) + 1);
    const severityKey = `error.severity.${error2.severity}`;
    this.metricsBuffer.set(severityKey, (this.metricsBuffer.get(severityKey) || 0) + 1);
  }
  async sendLogsToEndpoint(logs, endpoint) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ logs })
    });
    if (!response.ok) {
      throw new Error(`Failed to send logs: ${response.status} ${response.statusText}`);
    }
  }
  sendTrace(logEntry) {
    if (this.config.endpoints.traces && logEntry.traceId) {
      const traceSpan = {
        traceId: logEntry.traceId,
        spanId: logEntry.spanId || this.generateSpanId(),
        operationName: logEntry.operation || "error",
        startTime: new Date(logEntry.timestamp).getTime() * 1e3,
        // microseconds
        duration: logEntry.duration ? logEntry.duration * 1e3 : 0,
        tags: {
          error: true,
          "error.code": logEntry.errorCode,
          "error.severity": logEntry.severity,
          "service.name": logEntry.service || "isp-frontend",
          component: logEntry.component || "unknown"
        },
        logs: [
          {
            timestamp: new Date(logEntry.timestamp).getTime() * 1e3,
            fields: [
              { key: "event", value: "error" },
              { key: "error.message", value: logEntry.message },
              { key: "error.stack", value: logEntry.stackTrace }
            ]
          }
        ]
      };
      fetch(this.config.endpoints.traces, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spans: [traceSpan] })
      }).catch((error2) => {
        console.warn("Failed to send trace:", error2);
      });
    }
  }
  sanitizePayload(payload) {
    if (!payload) return payload;
    const sensitiveFields = ["password", "token", "secret", "key", "auth", "credit_card"];
    if (typeof payload === "object") {
      const sanitized = { ...payload };
      for (const key in sanitized) {
        if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
          sanitized[key] = "[REDACTED]";
        } else if (typeof sanitized[key] === "object") {
          sanitized[key] = this.sanitizePayload(sanitized[key]);
        }
      }
      return sanitized;
    }
    return payload;
  }
  setupFlushTimer() {
    this.flushTimer = setInterval(() => {
      if (this.logBuffer.length >= this.config.batchSize || this.logBuffer.length > 0 && !this.isOnline) {
        this.flushLogs();
      }
    }, this.config.flushInterval);
  }
  setupNetworkStatusListener() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        this.isOnline = true;
        if (this.logBuffer.length > 0) {
          this.flushLogs();
        }
      });
      window.addEventListener("offline", () => {
        this.isOnline = false;
      });
      this.isOnline = navigator.onLine;
    }
  }
  generateSpanId() {
    return Math.random().toString(16).substr(2, 16);
  }
};
new ErrorLoggingService();
var xssPatterns = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /onload\s*=/gi,
  /onerror\s*=/gi,
  /onclick\s*=/gi,
  /onmouseover\s*=/gi
];
var sanitizeHtml = (input) => {
  let sanitized = input;
  xssPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });
  return sanitized.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
};
var preventXSS = (input) => {
  if (typeof input === "string") {
    return input.replace(/[<>]/g, "").replace(/javascript:/gi, "").replace(/vbscript:/gi, "").replace(/data:text\/html/gi, "").trim();
  }
  if (Array.isArray(input)) {
    return input.map(preventXSS);
  }
  if (typeof input === "object" && input !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = preventXSS(value);
    }
    return sanitized;
  }
  return input;
};
var generateCSRFToken = () => {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return Date.now().toString(36) + Math.random().toString(36);
};
function useSecureForm({
  schema,
  onSubmit,
  initialValues = {},
  validateOnChange = false,
  validateOnBlur = true,
  sanitizeHtml: shouldSanitizeHtml = true,
  preventXSS: shouldPreventXSS = true,
  enableCSRFProtection = true
}) {
  const [values, setValuesState] = React6.useState(initialValues);
  const [errors, setErrors] = React6.useState([]);
  const [isSubmitting, setIsSubmitting] = React6.useState(false);
  const [isDirty, setIsDirty] = React6.useState(false);
  const [csrfToken] = React6.useState(() => enableCSRFProtection ? generateCSRFToken() : "");
  const initialValuesRef = React6.useRef(initialValues);
  React6.useRef(null);
  React6.useEffect(() => {
    if (enableCSRFProtection && csrfToken) {
      sessionStorage.setItem("csrf-token", csrfToken);
    }
    return () => {
      if (enableCSRFProtection) {
        sessionStorage.removeItem("csrf-token");
      }
    };
  }, [csrfToken, enableCSRFProtection]);
  const sanitizeInput3 = React6.useCallback(
    (value) => {
      if (shouldPreventXSS) {
        value = preventXSS(value);
      }
      if (shouldSanitizeHtml && typeof value === "string") {
        value = sanitizeHtml(value);
      }
      return value;
    },
    [shouldPreventXSS, shouldSanitizeHtml]
  );
  const validateField = React6.useCallback(
    async (field) => {
      try {
        const fieldValue = values[field];
        const fieldSchema = schema.pick({ [field]: true });
        await fieldSchema.parseAsync({ [field]: fieldValue });
        setErrors((prev) => prev.filter((error2) => error2.field !== field));
        return true;
      } catch (error2) {
        if (error2 instanceof zod.z.ZodError) {
          const fieldErrors = error2.errors.map((err) => ({
            field: err.path[0],
            message: err.message,
            code: err.code
          }));
          setErrors((prev) => [
            ...prev.filter((error3) => error3.field !== field),
            ...fieldErrors
          ]);
        }
        return false;
      }
    },
    [values, schema]
  );
  const validateForm = React6.useCallback(async () => {
    try {
      await schema.parseAsync(values);
      setErrors([]);
      return true;
    } catch (error2) {
      if (error2 instanceof zod.z.ZodError) {
        const formErrors = error2.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
          code: err.code
        }));
        setErrors(formErrors);
      }
      return false;
    }
  }, [values, schema]);
  const setValue = React6.useCallback(
    (field, value) => {
      const sanitizedValue = sanitizeInput3(value);
      setValuesState((prev) => ({
        ...prev,
        [field]: sanitizedValue
      }));
      setIsDirty(true);
      if (validateOnChange) {
        validateField(field);
      }
    },
    [sanitizeInput3, validateOnChange, validateField]
  );
  const setValues = React6.useCallback(
    (newValues) => {
      const sanitizedValues = sanitizeInput3(newValues);
      setValuesState(sanitizedValues);
      setIsDirty(true);
    },
    [sanitizeInput3]
  );
  const handleChange = React6.useCallback(
    (e) => {
      const { name, value, type } = e.target;
      const finalValue = type === "checkbox" ? e.target.checked : value;
      setValue(name, finalValue);
    },
    [setValue]
  );
  const handleBlur = React6.useCallback(
    (e) => {
      const { name } = e.target;
      if (validateOnBlur) {
        validateField(name);
      }
    },
    [validateOnBlur, validateField]
  );
  const handleSubmit = React6.useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (enableCSRFProtection) {
        const storedToken = sessionStorage.getItem("csrf-token");
        if (storedToken !== csrfToken) {
          console.error("CSRF token mismatch");
          return;
        }
      }
      setIsSubmitting(true);
      try {
        const isValid2 = await validateForm();
        if (!isValid2) {
          return;
        }
        const sanitizedValues = sanitizeInput3(values);
        await onSubmit(sanitizedValues);
      } catch (error2) {
        console.error("Form submission error:", error2);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit, validateForm, sanitizeInput3, enableCSRFProtection, csrfToken]
  );
  const reset = React6.useCallback(() => {
    setValuesState(initialValuesRef.current);
    setErrors([]);
    setIsDirty(false);
    setIsSubmitting(false);
  }, []);
  const getFieldError = React6.useCallback(
    (field) => {
      return errors.find((error2) => error2.field === field)?.message;
    },
    [errors]
  );
  const hasFieldError = React6.useCallback(
    (field) => {
      return errors.some((error2) => error2.field === field);
    },
    [errors]
  );
  const isValid = errors.length === 0;
  return {
    values,
    errors,
    isValid,
    isSubmitting,
    isDirty,
    setValue,
    setValues,
    validateField,
    validateForm,
    handleSubmit,
    handleChange,
    handleBlur,
    reset,
    getFieldError,
    hasFieldError,
    csrfToken: enableCSRFProtection ? csrfToken : void 0
  };
}
function usePerformanceObservers(metrics, config) {
  const observersRef = React6.useRef([]);
  React6.useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
      return;
    }
    const observers = [];
    if (config.enableCoreWebVitals) {
      try {
        const coreWebVitalsObserver = createCoreWebVitalsObserver(metrics.current);
        observers.push(coreWebVitalsObserver);
      } catch (error2) {
        if (config.enableConsoleLogging) {
          console.warn("Failed to create Core Web Vitals observer:", error2);
        }
      }
    }
    if (config.enableResourceTiming) {
      try {
        const resourceObserver = createResourceObserver(metrics.current);
        observers.push(resourceObserver);
      } catch (error2) {
        if (config.enableConsoleLogging) {
          console.warn("Failed to create Resource Timing observer:", error2);
        }
      }
    }
    if (config.enableNavigationTiming) {
      try {
        const navigationObserver = createNavigationObserver(metrics.current);
        observers.push(navigationObserver);
      } catch (error2) {
        if (config.enableConsoleLogging) {
          console.warn("Failed to create Navigation Timing observer:", error2);
        }
      }
    }
    observersRef.current = observers;
    return () => {
      observers.forEach((observer) => observer.disconnect());
      observersRef.current = [];
    };
  }, [config, metrics]);
  return observersRef;
}
function createCoreWebVitalsObserver(metrics) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      processPerformanceEntry(entry, metrics);
    }
  });
  const entryTypes = [
    "paint",
    "largest-contentful-paint",
    "first-input",
    "layout-shift",
    "navigation"
  ];
  entryTypes.forEach((type) => {
    try {
      observer.observe({ entryTypes: [type] });
    } catch {
    }
  });
  return observer;
}
function createResourceObserver(metrics) {
  const observer = new PerformanceObserver((list) => {
    const resourceEntries = list.getEntries();
    metrics.resourceCount = (metrics.resourceCount || 0) + resourceEntries.length;
    const totalSize = resourceEntries.reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
    metrics.totalResourceSize = (metrics.totalResourceSize || 0) + totalSize;
  });
  observer.observe({ entryTypes: ["resource"] });
  return observer;
}
function createNavigationObserver(metrics) {
  const observer = new PerformanceObserver((list) => {
    const navEntries = list.getEntries();
    for (const entry of navEntries) {
      const start = entry.startTime;
      metrics.navigationStart = start;
      metrics.domContentLoaded = entry.domContentLoadedEventEnd - start;
      metrics.loadComplete = entry.loadEventEnd - start;
    }
  });
  observer.observe({ entryTypes: ["navigation"] });
  return observer;
}
function processPerformanceEntry(entry, metrics) {
  switch (entry.entryType) {
    case "paint":
      if (entry.name === "first-contentful-paint") {
        metrics.fcp = entry.startTime;
      }
      break;
    case "largest-contentful-paint":
      metrics.lcp = entry.startTime;
      break;
    case "first-input":
      metrics.fid = entry.processingStart - entry.startTime;
      break;
    case "layout-shift":
      if (!entry.hadRecentInput) {
        metrics.cls = (metrics.cls || 0) + entry.value;
      }
      break;
    case "navigation": {
      const navEntry = entry;
      metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
      break;
    }
  }
}
function useMetricTracking(metrics, config) {
  const trackCustomMetric = React6.useCallback(
    (name, value) => {
      if (!config.enableCustomMetrics) {
        return;
      }
      metrics.current.customMetrics[name] = value;
      if (config.enableConsoleLogging) {
        console.log(`\u{1F4CA} Custom metric tracked: ${name} = ${value}`);
      }
    },
    [config.enableCustomMetrics, config.enableConsoleLogging, metrics]
  );
  const trackInteraction = React6.useCallback(
    (interactionName, startTime) => {
      const endTime = performance.now();
      const duration = startTime ? endTime - startTime : endTime;
      trackCustomMetric(`interaction_${interactionName}`, duration);
    },
    [trackCustomMetric]
  );
  const trackApiCall = React6.useCallback(
    (endpoint, duration, success) => {
      const cleanEndpoint = endpoint.replace(/[^a-zA-Z0-9]/g, "_");
      trackCustomMetric(`api_${cleanEndpoint}_duration`, duration);
      trackCustomMetric(`api_${cleanEndpoint}_success`, success ? 1 : 0);
    },
    [trackCustomMetric]
  );
  const trackComponentRender = React6.useCallback(
    (componentName, renderTime) => {
      trackCustomMetric(`component_${componentName}_render`, renderTime);
    },
    [trackCustomMetric]
  );
  return {
    trackCustomMetric,
    trackInteraction,
    trackApiCall,
    trackComponentRender
  };
}

// src/hooks/performance/reportingUtils.ts
function reportMetrics(metrics, config) {
  if (config.enableConsoleLogging) {
    logMetricsToConsole(metrics);
  }
  if (config.reportingEndpoint) {
    sendMetricsToEndpoint(metrics, config.reportingEndpoint, config.enableConsoleLogging ?? false);
  }
  if (typeof window !== "undefined" && window.gtag) {
    sendMetricsToGoogleAnalytics(metrics);
  }
}
function logMetricsToConsole(metrics) {
  console.group("\u{1F4CA} Performance Metrics");
  logWebVitalMetrics(metrics);
  logLoadMetrics(metrics);
  logCustomMetrics(metrics.customMetrics);
  console.groupEnd();
}
function logWebVitalMetrics(metrics) {
  logMetric("\u{1F3A8} First Contentful Paint", metrics.fcp, (v) => `${v.toFixed(2)}ms`);
  logMetric("\u{1F5BC}\uFE0F Largest Contentful Paint", metrics.lcp, (v) => `${v.toFixed(2)}ms`);
  logMetric("\u{1F446} First Input Delay", metrics.fid, (v) => `${v.toFixed(2)}ms`);
  logMetric("\u{1F4D0} Cumulative Layout Shift", metrics.cls, (v) => v.toFixed(4));
  logMetric("\u{1F310} Time to First Byte", metrics.ttfb, (v) => `${v.toFixed(2)}ms`);
}
function logLoadMetrics(metrics) {
  logMetric("\u{1F4C4} DOM Content Loaded", metrics.domContentLoaded, (v) => `${v.toFixed(2)}ms`);
  logMetric("\u2705 Load Complete", metrics.loadComplete, (v) => `${v.toFixed(2)}ms`);
  logMetric("\u{1F4E6} Resource Count", metrics.resourceCount, (v) => v.toString());
  logMetric(
    "\u{1F4BE} Total Resource Size",
    metrics.totalResourceSize,
    (v) => `${(v / 1024).toFixed(2)}KB`
  );
}
function logCustomMetrics(customMetrics) {
  if (Object.keys(customMetrics).length > 0) {
    console.log("\u{1F527} Custom Metrics:");
    for (const [name, value] of Object.entries(customMetrics)) {
      console.log(`  ${name}: ${value}`);
    }
  }
}
function logMetric(label, value, formatter) {
  if (value !== void 0) {
    console.log(`${label}: ${formatter(value)}`);
  }
}
function sendMetricsToEndpoint(metrics, endpoint, enableLogging) {
  const payload = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    metrics
  };
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(() => {
    if (enableLogging) {
      console.error("Failed to send metrics to endpoint:", endpoint);
    }
  });
}
function sendMetricsToGoogleAnalytics(metrics) {
  const gtag = window.gtag;
  if (!gtag) return;
  const events = [
    { metric: metrics.fcp, event: "first_contentful_paint" },
    { metric: metrics.lcp, event: "largest_contentful_paint" },
    { metric: metrics.fid, event: "first_input_delay" },
    { metric: metrics.cls, event: "cumulative_layout_shift", multiplier: 1e3 }
  ];
  events.forEach(({ metric, event, multiplier = 1 }) => {
    if (metric !== void 0) {
      gtag("event", event, { value: Math.round(metric * multiplier) });
    }
  });
}

// src/hooks/performance/usePerformanceReporting.ts
function usePerformanceReporting(metrics, config) {
  const reportingTimerRef = React6.useRef();
  React6.useEffect(() => {
    if (config.reportingInterval && config.reportingInterval > 0) {
      reportingTimerRef.current = setInterval(() => {
        reportMetrics(metrics.current, config);
      }, config.reportingInterval);
      return () => {
        if (reportingTimerRef.current) {
          clearInterval(reportingTimerRef.current);
        }
      };
    }
    return void 0;
  }, [config, metrics]);
  const reportNow = React6.useCallback(() => {
    reportMetrics(metrics.current, config);
  }, [config, metrics]);
  const getMetrics = React6.useCallback(() => {
    return { ...metrics.current };
  }, [metrics]);
  return {
    reportNow,
    getMetrics
  };
}

// src/hooks/performance/usePerformanceMonitoring.ts
var defaultConfig = {
  enableCoreWebVitals: true,
  enableResourceTiming: true,
  enableNavigationTiming: true,
  enableCustomMetrics: true,
  reportingInterval: 3e4,
  // 30 seconds
  enableConsoleLogging: process.env["NODE_ENV"] === "development"
};
function usePerformanceMonitoring(config = {}) {
  const finalConfig = React6.useMemo(() => ({ ...defaultConfig, ...config }), [config]);
  const metricsRef = React6.useRef({
    customMetrics: {}
  });
  usePerformanceObservers(metricsRef, finalConfig);
  const metricTracking = useMetricTracking(metricsRef, finalConfig);
  const reporting = usePerformanceReporting(metricsRef, finalConfig);
  return {
    ...metricTracking,
    ...reporting
  };
}
var initialStats3 = {
  totalRequests: 0,
  pendingRequests: 0,
  activeInstallations: 0,
  completedToday: 0,
  averageProvisioningTime: 0,
  successRate: 0,
  slaCompliance: 0,
  statusBreakdown: {},
  technicianWorkload: {},
  upcomingInstallations: []
};
var initialState3 = {
  templates: [],
  requests: [],
  workflows: [],
  stats: initialStats3,
  isLoading: false,
  error: null,
  isConnected: false,
  selectedRequest: null
};
function useProvisioning(options = {}) {
  const {
    apiEndpoint = "/api/provisioning",
    websocketEndpoint,
    apiKey,
    tenantId,
    resellerId,
    pollInterval = 3e4,
    enableRealtime = true,
    maxRetries = 3
  } = options;
  const [state, setState] = React6.useState(initialState3);
  const websocketRef = React6.useRef(null);
  const pollIntervalRef = React6.useRef(null);
  const retryCountRef = React6.useRef(0);
  const { addNotification } = useNotifications();
  const apiCall = React6.useCallback(
    async (endpoint, options2 = {}) => {
      const headers = {
        "Content-Type": "application/json",
        ...options2.headers
      };
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }
      if (tenantId) {
        headers["X-Tenant-ID"] = tenantId;
      }
      if (resellerId) {
        headers["X-Reseller-ID"] = resellerId;
      }
      const response = await fetch(`${apiEndpoint}${endpoint}`, {
        ...options2,
        headers
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    [apiEndpoint, apiKey, tenantId, resellerId]
  );
  const connectWebSocket = React6.useCallback(() => {
    if (!websocketEndpoint || !enableRealtime) return;
    try {
      if (websocketRef.current?.readyState === WebSocket.OPEN) return;
      const wsUrl = new URL(websocketEndpoint);
      if (apiKey) wsUrl.searchParams.set("apiKey", apiKey);
      if (tenantId) wsUrl.searchParams.set("tenantId", tenantId);
      if (resellerId) wsUrl.searchParams.set("resellerId", resellerId);
      const ws = new WebSocket(wsUrl.toString());
      websocketRef.current = ws;
      ws.onopen = () => {
        setState((prev) => ({ ...prev, isConnected: true, error: null }));
        retryCountRef.current = 0;
        addNotification({
          type: "system",
          priority: "low",
          title: "Provisioning System",
          message: "Real-time provisioning updates connected",
          channel: ["browser"],
          persistent: false
        });
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case "request_status_update":
              setState((prev) => ({
                ...prev,
                requests: prev.requests.map(
                  (req) => req.id === data.requestId ? { ...req, ...data.updates } : req
                )
              }));
              if (["approved", "active", "failed"].includes(data.updates.status)) {
                addNotification({
                  type: data.updates.status === "failed" ? "error" : "success",
                  priority: data.updates.status === "failed" ? "high" : "medium",
                  title: "Service Request Update",
                  message: `Request ${data.requestId} is now ${data.updates.status}`,
                  channel: ["browser"],
                  persistent: false
                });
              }
              break;
            case "new_request":
              setState((prev) => ({
                ...prev,
                requests: [data.request, ...prev.requests]
              }));
              addNotification({
                type: "info",
                priority: "medium",
                title: "New Service Request",
                message: `New ${data.request.serviceTemplateId} request received`,
                channel: ["browser"],
                persistent: false
              });
              break;
            case "task_completed":
              setState((prev) => ({
                ...prev,
                requests: prev.requests.map(
                  (req) => req.id === data.requestId ? {
                    ...req,
                    tasks: req.tasks.map(
                      (task) => task.id === data.taskId ? {
                        ...task,
                        status: "completed",
                        completedAt: new Date(data.completedAt)
                      } : task
                    )
                  } : req
                )
              }));
              break;
            case "technician_assigned":
              setState((prev) => ({
                ...prev,
                requests: prev.requests.map(
                  (req) => req.id === data.requestId ? { ...req, assignedTechnician: data.technicianId } : req
                )
              }));
              addNotification({
                type: "info",
                priority: "low",
                title: "Technician Assigned",
                message: `Technician assigned to request ${data.requestId}`,
                channel: ["browser"],
                persistent: false
              });
              break;
            case "stats_update":
              setState((prev) => ({
                ...prev,
                stats: data.stats
              }));
              break;
          }
        } catch (error2) {
          console.error("Failed to parse WebSocket message:", error2);
        }
      };
      ws.onclose = () => {
        setState((prev) => ({ ...prev, isConnected: false }));
        if (retryCountRef.current < maxRetries) {
          const delay = Math.min(1e3 * Math.pow(2, retryCountRef.current), 3e4);
          setTimeout(() => {
            retryCountRef.current++;
            connectWebSocket();
          }, delay);
        }
      };
      ws.onerror = (error2) => {
        console.error("WebSocket error:", error2);
        setState((prev) => ({
          ...prev,
          isConnected: false,
          error: "WebSocket connection failed"
        }));
      };
    } catch (error2) {
      console.error("Failed to establish WebSocket connection:", error2);
      setState((prev) => ({
        ...prev,
        isConnected: false,
        error: error2 instanceof Error ? error2.message : "Connection failed"
      }));
    }
  }, [
    websocketEndpoint,
    enableRealtime,
    apiKey,
    tenantId,
    resellerId,
    maxRetries,
    addNotification
  ]);
  const loadTemplates = React6.useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const data = await apiCall("/templates");
      setState((prev) => ({
        ...prev,
        templates: data.templates || [],
        isLoading: false
      }));
    } catch (error2) {
      setState((prev) => ({
        ...prev,
        error: error2 instanceof Error ? error2.message : "Failed to load templates",
        isLoading: false
      }));
    }
  }, [apiCall]);
  const loadRequests = React6.useCallback(
    async (filters = {}) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== void 0) {
            params.append(key, value instanceof Date ? value.toISOString() : String(value));
          }
        });
        const data = await apiCall(`/requests?${params.toString()}`);
        setState((prev) => ({
          ...prev,
          requests: data.requests || [],
          isLoading: false
        }));
      } catch (error2) {
        setState((prev) => ({
          ...prev,
          error: error2 instanceof Error ? error2.message : "Failed to load requests",
          isLoading: false
        }));
      }
    },
    [apiCall]
  );
  const loadStats = React6.useCallback(
    async (timeRange = "24h") => {
      try {
        const data = await apiCall(`/stats?range=${timeRange}`);
        setState((prev) => ({
          ...prev,
          stats: data.stats || initialStats3
        }));
      } catch (error2) {
        setState((prev) => ({
          ...prev,
          error: error2 instanceof Error ? error2.message : "Failed to load statistics"
        }));
      }
    },
    [apiCall]
  );
  const createServiceRequest = React6.useCallback(
    async (requestData) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        const data = await apiCall("/requests", {
          method: "POST",
          body: JSON.stringify({
            ...requestData,
            scheduledAt: requestData.scheduledAt?.toISOString()
          })
        });
        const newRequest = data.request;
        setState((prev) => ({
          ...prev,
          requests: [newRequest, ...prev.requests],
          isLoading: false
        }));
        addNotification({
          type: "success",
          priority: "medium",
          title: "Service Request Created",
          message: `Service request for ${requestData.customerInfo.name} has been submitted`,
          channel: ["browser"],
          persistent: false
        });
        return newRequest;
      } catch (error2) {
        setState((prev) => ({ ...prev, isLoading: false }));
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to create service request";
        addNotification({
          type: "error",
          priority: "high",
          title: "Request Creation Failed",
          message: errorMessage,
          channel: ["browser"],
          persistent: false
        });
        throw error2;
      }
    },
    [apiCall, addNotification]
  );
  const updateRequestStatus = React6.useCallback(
    async (requestId, status, notes) => {
      try {
        const data = await apiCall(`/requests/${requestId}/status`, {
          method: "PUT",
          body: JSON.stringify({ status, notes })
        });
        const updatedRequest = data.request;
        setState((prev) => ({
          ...prev,
          requests: prev.requests.map((req) => req.id === requestId ? updatedRequest : req)
        }));
        addNotification({
          type: "success",
          priority: "low",
          title: "Status Updated",
          message: `Request ${requestId} status updated to ${status}`,
          channel: ["browser"],
          persistent: false
        });
        return updatedRequest;
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to update status";
        addNotification({
          type: "error",
          priority: "medium",
          title: "Update Failed",
          message: errorMessage,
          channel: ["browser"],
          persistent: false
        });
        throw error2;
      }
    },
    [apiCall, addNotification]
  );
  const scheduleInstallation = React6.useCallback(
    async (requestId, scheduledAt, technicianId) => {
      try {
        const data = await apiCall(`/requests/${requestId}/schedule`, {
          method: "POST",
          body: JSON.stringify({
            scheduledAt: scheduledAt.toISOString(),
            technicianId
          })
        });
        const updatedRequest = data.request;
        setState((prev) => ({
          ...prev,
          requests: prev.requests.map((req) => req.id === requestId ? updatedRequest : req)
        }));
        addNotification({
          type: "success",
          priority: "medium",
          title: "Installation Scheduled",
          message: `Installation scheduled for ${scheduledAt.toLocaleDateString()}`,
          channel: ["browser"],
          persistent: false
        });
        return updatedRequest;
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to schedule installation";
        addNotification({
          type: "error",
          priority: "medium",
          title: "Scheduling Failed",
          message: errorMessage,
          channel: ["browser"],
          persistent: false
        });
        throw error2;
      }
    },
    [apiCall, addNotification]
  );
  const executeTask = React6.useCallback(
    async (requestId, taskId, result, notes) => {
      try {
        const data = await apiCall(`/requests/${requestId}/tasks/${taskId}/execute`, {
          method: "POST",
          body: JSON.stringify({ result, notes })
        });
        const updatedRequest = data.request;
        setState((prev) => ({
          ...prev,
          requests: prev.requests.map((req) => req.id === requestId ? updatedRequest : req)
        }));
        return updatedRequest;
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to execute task";
        addNotification({
          type: "error",
          priority: "medium",
          title: "Task Execution Failed",
          message: errorMessage,
          channel: ["browser"],
          persistent: false
        });
        throw error2;
      }
    },
    [apiCall, addNotification]
  );
  const cancelRequest = React6.useCallback(
    async (requestId, reason) => {
      try {
        await apiCall(`/requests/${requestId}/cancel`, {
          method: "POST",
          body: JSON.stringify({ reason })
        });
        setState((prev) => ({
          ...prev,
          requests: prev.requests.map(
            (req) => req.id === requestId ? { ...req, status: "cancelled", notes: reason } : req
          )
        }));
        addNotification({
          type: "info",
          priority: "low",
          title: "Request Cancelled",
          message: `Service request ${requestId} has been cancelled`,
          channel: ["browser"],
          persistent: false
        });
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to cancel request";
        addNotification({
          type: "error",
          priority: "medium",
          title: "Cancellation Failed",
          message: errorMessage,
          channel: ["browser"],
          persistent: false
        });
        throw error2;
      }
    },
    [apiCall, addNotification]
  );
  const bulkUpdateStatus = React6.useCallback(
    async (requestIds, status, notes) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        const data = await apiCall("/requests/bulk-update", {
          method: "POST",
          body: JSON.stringify({ requestIds, status, notes })
        });
        const updatedRequests = data.requests || [];
        setState((prev) => ({
          ...prev,
          requests: prev.requests.map(
            (req) => requestIds.includes(req.id) ? updatedRequests.find((ur) => ur.id === req.id) || req : req
          ),
          isLoading: false
        }));
        addNotification({
          type: "success",
          priority: "medium",
          title: "Bulk Update Complete",
          message: `${requestIds.length} requests updated to ${status}`,
          channel: ["browser"],
          persistent: false
        });
        return updatedRequests;
      } catch (error2) {
        setState((prev) => ({ ...prev, isLoading: false }));
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to bulk update requests";
        addNotification({
          type: "error",
          priority: "high",
          title: "Bulk Update Failed",
          message: errorMessage,
          channel: ["browser"],
          persistent: false
        });
        throw error2;
      }
    },
    [apiCall, addNotification]
  );
  const updateEquipmentStatus = React6.useCallback(
    async (requestId, equipmentId, status, serialNumbers, trackingNumber) => {
      try {
        const data = await apiCall(`/requests/${requestId}/equipment/${equipmentId}`, {
          method: "PUT",
          body: JSON.stringify({ status, serialNumbers, trackingNumber })
        });
        const updatedRequest = data.request;
        setState((prev) => ({
          ...prev,
          requests: prev.requests.map((req) => req.id === requestId ? updatedRequest : req)
        }));
        return updatedRequest;
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "Failed to update equipment";
        addNotification({
          type: "error",
          priority: "medium",
          title: "Equipment Update Failed",
          message: errorMessage,
          channel: ["browser"],
          persistent: false
        });
        throw error2;
      }
    },
    [apiCall, addNotification]
  );
  React6.useEffect(() => {
    loadTemplates();
    loadRequests({ limit: 50 });
    loadStats();
    if (enableRealtime) {
      connectWebSocket();
    }
    if (!enableRealtime && pollInterval > 0) {
      pollIntervalRef.current = setInterval(() => {
        loadStats();
        loadRequests({ limit: 10 });
      }, pollInterval);
    }
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [loadTemplates, loadRequests, loadStats, connectWebSocket, enableRealtime, pollInterval]);
  React6.useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);
  return {
    // State
    ...state,
    // Actions
    createServiceRequest,
    updateRequestStatus,
    scheduleInstallation,
    executeTask,
    cancelRequest,
    bulkUpdateStatus,
    updateEquipmentStatus,
    // Data loaders
    loadTemplates,
    loadRequests,
    loadStats,
    // Connection management
    connect: connectWebSocket,
    disconnect: React6.useCallback(() => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    }, []),
    // Utils
    clearError: React6.useCallback(() => {
      setState((prev) => ({ ...prev, error: null }));
    }, []),
    selectRequest: React6.useCallback((request) => {
      setState((prev) => ({ ...prev, selectedRequest: request }));
    }, []),
    // Computed values
    pendingRequests: state.requests.filter((req) => req.status === "pending"),
    activeRequests: state.requests.filter(
      (req) => ["approved", "provisioning", "installing"].includes(req.status)
    ),
    urgentRequests: state.requests.filter((req) => req.priority === "urgent"),
    todayInstallations: state.requests.filter(
      (req) => req.scheduledAt && new Date(req.scheduledAt).toDateString() === (/* @__PURE__ */ new Date()).toDateString()
    )
  };
}
function useISPModules() {
  const queryClient = reactQuery.useQueryClient();
  const ispClient = getISPApiClient();
  const useUsers = (params) => {
    return reactQuery.useQuery({
      queryKey: ["identity", "users", params],
      queryFn: () => ispClient.getUsers(params)
    });
  };
  const useUser = (id) => {
    return reactQuery.useQuery({
      queryKey: ["identity", "users", id],
      queryFn: () => ispClient.getUser(id),
      enabled: !!id
    });
  };
  const useCustomers = (params) => {
    return reactQuery.useQuery({
      queryKey: ["identity", "customers", params],
      queryFn: () => ispClient.getCustomers(params)
    });
  };
  const useCustomer = (id) => {
    return reactQuery.useQuery({
      queryKey: ["identity", "customers", id],
      queryFn: () => ispClient.getCustomer(id),
      enabled: !!id
    });
  };
  const useCreateCustomer2 = () => {
    return reactQuery.useMutation({
      mutationFn: (customerData) => ispClient.createCustomer(customerData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["identity", "customers"] });
      }
    });
  };
  const useInvoices = (customerId, params) => {
    const queryParams = customerId ? { ...params || {}, customerId } : params;
    return reactQuery.useQuery({
      queryKey: ["billing", "invoices", customerId, params],
      queryFn: () => ispClient.getInvoices(queryParams)
    });
  };
  const useInvoice = (id) => {
    return reactQuery.useQuery({
      queryKey: ["billing", "invoices", id],
      queryFn: () => ispClient.getInvoice(id),
      enabled: !!id
    });
  };
  const usePayments = (params) => {
    return reactQuery.useQuery({
      queryKey: ["billing", "payments", params],
      queryFn: () => ispClient.getPayments(params)
    });
  };
  const useProcessPayment = () => {
    return reactQuery.useMutation({
      mutationFn: (paymentData) => ispClient.processPayment(paymentData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["billing", "payments"] });
        queryClient.invalidateQueries({ queryKey: ["billing", "invoices"] });
      }
    });
  };
  const useSubscriptions = (customerId) => {
    return reactQuery.useQuery({
      queryKey: ["billing", "subscriptions", customerId],
      queryFn: () => ispClient.getSubscriptions(customerId)
    });
  };
  const useServiceCatalog = () => {
    return reactQuery.useQuery({
      queryKey: ["services", "catalog"],
      queryFn: () => ispClient.getServiceCatalog(),
      staleTime: 5 * 60 * 1e3
      // 5 minutes
    });
  };
  const useServiceInstances = (customerId) => {
    return reactQuery.useQuery({
      queryKey: ["services", "instances", customerId],
      queryFn: () => ispClient.getServiceInstances(customerId)
    });
  };
  const useProvisionService = () => {
    return reactQuery.useMutation({
      mutationFn: (serviceData) => ispClient.provisionService(serviceData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["services", "instances"] });
      }
    });
  };
  const useUsageTracking = (serviceId, period) => {
    return reactQuery.useQuery({
      queryKey: ["services", "usage", serviceId, period],
      queryFn: () => ispClient.getUsageTracking(serviceId, period),
      enabled: !!serviceId
    });
  };
  const useNetworkDevices = (params) => {
    return reactQuery.useQuery({
      queryKey: ["networking", "devices", params],
      queryFn: () => ispClient.getNetworkDevices(params),
      refetchInterval: 3e4
      // Refresh every 30 seconds for real-time monitoring
    });
  };
  const useNetworkDevice = (id) => {
    return reactQuery.useQuery({
      queryKey: ["networking", "devices", id],
      queryFn: () => ispClient.getNetworkDevice(id),
      enabled: !!id,
      refetchInterval: 1e4
      // Refresh every 10 seconds for device monitoring
    });
  };
  const useIPAM = (params) => {
    return reactQuery.useQuery({
      queryKey: ["networking", "ipam", params],
      queryFn: () => ispClient.getIPAMData(params)
    });
  };
  const useAllocateIP = () => {
    return reactQuery.useMutation({
      mutationFn: (request) => ispClient.allocateIP(request),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["networking", "ipam"] });
      }
    });
  };
  const useNetworkTopology = () => {
    return reactQuery.useQuery({
      queryKey: ["networking", "topology"],
      queryFn: () => ispClient.getNetworkTopology(),
      staleTime: 2 * 60 * 1e3
      // 2 minutes
    });
  };
  const useNetworkMonitoring2 = () => {
    return reactQuery.useQuery({
      queryKey: ["networking", "monitoring"],
      queryFn: () => ispClient.getNetworkMonitoring(),
      refetchInterval: 15e3
      // Refresh every 15 seconds
    });
  };
  const useLeads = (params) => {
    return reactQuery.useQuery({
      queryKey: ["sales", "leads", params],
      queryFn: () => ispClient.getLeads(params)
    });
  };
  const useCreateLead = () => {
    return reactQuery.useMutation({
      mutationFn: (leadData) => ispClient.createLead(leadData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sales", "leads"] });
      }
    });
  };
  const useCRMData = (customerId) => {
    return reactQuery.useQuery({
      queryKey: ["sales", "crm", customerId],
      queryFn: () => ispClient.getCRMData(customerId),
      enabled: !!customerId
    });
  };
  const useCampaigns = () => {
    return reactQuery.useQuery({
      queryKey: ["sales", "campaigns"],
      queryFn: () => ispClient.getCampaigns()
    });
  };
  const useSalesAnalytics = (period) => {
    const params = period ? { period } : void 0;
    return reactQuery.useQuery({
      queryKey: ["sales", "analytics", period],
      queryFn: () => ispClient.getSalesAnalytics(params)
    });
  };
  const useSupportTickets = (params) => {
    return reactQuery.useQuery({
      queryKey: ["support", "tickets", params],
      queryFn: () => ispClient.getSupportTickets(params)
    });
  };
  const useSupportTicket = (id) => {
    return reactQuery.useQuery({
      queryKey: ["support", "tickets", id],
      queryFn: () => ispClient.getSupportTicket(id),
      enabled: !!id
    });
  };
  const useCreateSupportTicket = () => {
    return reactQuery.useMutation({
      mutationFn: (ticketData) => ispClient.createSupportTicket(ticketData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
      }
    });
  };
  const useUpdateSupportTicket = () => {
    return reactQuery.useMutation({
      mutationFn: ({ id, updates }) => ispClient.updateSupportTicket(id, updates),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
        queryClient.invalidateQueries({ queryKey: ["support", "tickets", id] });
      }
    });
  };
  const useKnowledgeBase = (params) => {
    return reactQuery.useQuery({
      queryKey: ["support", "knowledge-base", params],
      queryFn: () => ispClient.getKnowledgeBase(params),
      staleTime: 10 * 60 * 1e3
      // 10 minutes
    });
  };
  const useSLAMetrics = () => {
    return reactQuery.useQuery({
      queryKey: ["support", "sla", "metrics"],
      queryFn: () => ispClient.getSLAMetrics(),
      refetchInterval: 5 * 60 * 1e3
      // Refresh every 5 minutes
    });
  };
  const useResellers = (params) => {
    return reactQuery.useQuery({
      queryKey: ["resellers", params],
      queryFn: () => ispClient.getResellers(params)
    });
  };
  const useReseller = (id) => {
    return reactQuery.useQuery({
      queryKey: ["resellers", id],
      queryFn: () => ispClient.getReseller(id),
      enabled: !!id
    });
  };
  const useResellerCommissions = (resellerId, period) => {
    const params = { resellerId, ...period ? { period } : {} };
    return reactQuery.useQuery({
      queryKey: ["resellers", resellerId, "commissions", period],
      queryFn: () => ispClient.getResellerCommissions(params),
      enabled: !!resellerId
    });
  };
  const useResellerPerformance = (resellerId) => {
    return reactQuery.useQuery({
      queryKey: ["resellers", resellerId, "performance"],
      queryFn: () => ispClient.getResellerPerformance({ resellerId }),
      enabled: !!resellerId
    });
  };
  const useBusinessIntelligence = (params) => {
    return reactQuery.useQuery({
      queryKey: ["analytics", "business-intelligence", params],
      queryFn: () => ispClient.getBusinessIntelligence(params)
    });
  };
  const useDataVisualization = (type, params) => {
    return reactQuery.useQuery({
      queryKey: ["analytics", "visualization", type, params],
      queryFn: () => ispClient.getDataVisualization(type, params),
      enabled: !!type
    });
  };
  const useCustomReports = (params) => {
    return reactQuery.useQuery({
      queryKey: ["analytics", "reports", params],
      queryFn: () => ispClient.getCustomReports(params)
    });
  };
  const useGenerateReport = () => {
    return reactQuery.useMutation({
      mutationFn: (reportConfig) => ispClient.generateReport(reportConfig),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["analytics", "reports"] });
      }
    });
  };
  const useInventoryItems = (params) => {
    return reactQuery.useQuery({
      queryKey: ["inventory", "items", params],
      queryFn: () => ispClient.getInventoryItems(params)
    });
  };
  const useWarehouseManagement = () => {
    return reactQuery.useQuery({
      queryKey: ["inventory", "warehouses"],
      queryFn: () => ispClient.getWarehouseManagement()
    });
  };
  const useProcurementOrders = (params) => {
    return reactQuery.useQuery({
      queryKey: ["inventory", "procurement", params],
      queryFn: () => ispClient.getProcurementOrders(params)
    });
  };
  const useWorkOrders = (params) => {
    return reactQuery.useQuery({
      queryKey: ["field-ops", "work-orders", params],
      queryFn: () => ispClient.getWorkOrders(params)
    });
  };
  const useWorkOrder = (id) => {
    return reactQuery.useQuery({
      queryKey: ["field-ops", "work-orders", id],
      queryFn: () => ispClient.getWorkOrder(id),
      enabled: !!id
    });
  };
  const useCreateWorkOrder = () => {
    return reactQuery.useMutation({
      mutationFn: (workOrderData) => ispClient.createWorkOrder(workOrderData),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["field-ops", "work-orders"]
        });
      }
    });
  };
  const useTechnicians = (params) => {
    return reactQuery.useQuery({
      queryKey: ["field-ops", "technicians", params],
      queryFn: () => ispClient.getTechnicians(params)
    });
  };
  const useTechnicianLocation = (technicianId) => {
    return reactQuery.useQuery({
      queryKey: ["field-ops", "technicians", technicianId, "location"],
      queryFn: () => ispClient.getTechnicianLocation(technicianId),
      enabled: !!technicianId,
      refetchInterval: 3e4
      // Refresh every 30 seconds for location tracking
    });
  };
  const useUpdateTechnicianLocation = () => {
    return reactQuery.useMutation({
      mutationFn: ({ technicianId, location }) => ispClient.updateTechnicianLocation(technicianId, location),
      onSuccess: (_, { technicianId }) => {
        queryClient.invalidateQueries({
          queryKey: ["field-ops", "technicians", technicianId, "location"]
        });
      }
    });
  };
  const useComplianceReports = () => {
    return reactQuery.useQuery({
      queryKey: ["compliance", "reports"],
      queryFn: () => ispClient.getComplianceReports()
    });
  };
  const useAuditTrail = (params) => {
    return reactQuery.useQuery({
      queryKey: ["compliance", "audit-trail", params],
      queryFn: () => ispClient.getAuditTrail(params)
    });
  };
  const useDataProtectionStatus = () => {
    return reactQuery.useQuery({
      queryKey: ["compliance", "data-protection"],
      queryFn: () => ispClient.getDataProtectionStatus()
    });
  };
  const useNotificationTemplates = () => {
    return reactQuery.useQuery({
      queryKey: ["notifications", "templates"],
      queryFn: () => ispClient.getNotificationTemplates(),
      staleTime: 10 * 60 * 1e3
      // 10 minutes
    });
  };
  const useSendEmail = () => {
    return reactQuery.useMutation({
      mutationFn: (emailData) => ispClient.sendEmail(emailData)
    });
  };
  const useSendSMS = () => {
    return reactQuery.useMutation({
      mutationFn: (smsData) => ispClient.sendSMS(smsData)
    });
  };
  const useAutomationRules = () => {
    return reactQuery.useQuery({
      queryKey: ["notifications", "automation", "rules"],
      queryFn: () => ispClient.getAutomationRules()
    });
  };
  const useLicenseInfo = () => {
    return reactQuery.useQuery({
      queryKey: ["licensing", "info"],
      queryFn: () => ispClient.getLicenseInfo(),
      staleTime: 15 * 60 * 1e3
      // 15 minutes
    });
  };
  const useFeatureEntitlements = () => {
    return reactQuery.useQuery({
      queryKey: ["licensing", "features"],
      queryFn: () => ispClient.getFeatureEntitlements(),
      staleTime: 10 * 60 * 1e3
      // 10 minutes
    });
  };
  const useValidateLicense = () => {
    return React6.useCallback(
      async (payload) => {
        return ispClient.validateLicense(payload);
      },
      [ispClient]
    );
  };
  const useAdminDashboard = () => {
    return reactQuery.useQuery({
      queryKey: ["dashboard", "admin"],
      queryFn: () => ispClient.getAdminDashboard(),
      refetchInterval: 6e4
      // Refresh every minute
    });
  };
  const useCustomerDashboard2 = () => {
    return reactQuery.useQuery({
      queryKey: ["dashboard", "customer"],
      queryFn: () => ispClient.getCustomerDashboard(),
      refetchInterval: 6e4
      // Refresh every minute
    });
  };
  const useResellerDashboard = () => {
    return reactQuery.useQuery({
      queryKey: ["dashboard", "reseller"],
      queryFn: () => ispClient.getResellerDashboard(),
      refetchInterval: 6e4
      // Refresh every minute
    });
  };
  const useTechnicianDashboard = () => {
    return reactQuery.useQuery({
      queryKey: ["dashboard", "technician"],
      queryFn: () => ispClient.getTechnicianDashboard(),
      refetchInterval: 6e4
      // Refresh every minute
    });
  };
  return {
    // Identity Module
    useUsers,
    useUser,
    useCustomers,
    useCustomer,
    useCreateCustomer: useCreateCustomer2,
    // Billing Module
    useInvoices,
    useInvoice,
    usePayments,
    useProcessPayment,
    useSubscriptions,
    // Services Module
    useServiceCatalog,
    useServiceInstances,
    useProvisionService,
    useUsageTracking,
    // Networking Module
    useNetworkDevices,
    useNetworkDevice,
    useIPAM,
    useAllocateIP,
    useNetworkTopology,
    useNetworkMonitoring: useNetworkMonitoring2,
    // Sales Module
    useLeads,
    useCreateLead,
    useCRMData,
    useCampaigns,
    useSalesAnalytics,
    // Support Module
    useSupportTickets,
    useSupportTicket,
    useCreateSupportTicket,
    useUpdateSupportTicket,
    useKnowledgeBase,
    useSLAMetrics,
    // Resellers Module
    useResellers,
    useReseller,
    useResellerCommissions,
    useResellerPerformance,
    // Analytics Module
    useBusinessIntelligence,
    useDataVisualization,
    useCustomReports,
    useGenerateReport,
    // Inventory Module
    useInventoryItems,
    useWarehouseManagement,
    useProcurementOrders,
    // Field Operations Module
    useWorkOrders,
    useWorkOrder,
    useCreateWorkOrder,
    useTechnicians,
    useTechnicianLocation,
    useUpdateTechnicianLocation,
    // Compliance Module
    useComplianceReports,
    useAuditTrail,
    useDataProtectionStatus,
    // Notifications Module
    useNotificationTemplates,
    useSendEmail,
    useSendSMS,
    useAutomationRules,
    // Licensing Module
    useLicenseInfo,
    useFeatureEntitlements,
    useValidateLicense,
    // Dashboard Hooks
    useAdminDashboard,
    useCustomerDashboard: useCustomerDashboard2,
    useResellerDashboard,
    useTechnicianDashboard
  };
}
function useFormatting() {
  const localeConfig = useLocaleConfig();
  const currencyConfig = useCurrencyConfig();
  const businessConfig = useBusinessConfig();
  const formatCurrency = React6.useCallback(
    (amount, options = {
      // Implementation pending
    }) => {
      const currency = options.currency || currencyConfig.primary;
      const locale = options.locale || localeConfig.primary;
      const minimumFractionDigits = options.precision ?? currencyConfig.precision;
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits,
        maximumFractionDigits: minimumFractionDigits
      }).format(amount);
    },
    [currencyConfig, localeConfig]
  );
  const formatDate = React6.useCallback(
    (date, format = "short", locale) => {
      const targetLocale = locale || localeConfig.primary;
      const dateObj = typeof date === "string" ? new Date(date) : date;
      const formatOptions = typeof format === "string" ? localeConfig.dateFormat[format] : format;
      return dateObj.toLocaleDateString(targetLocale, formatOptions);
    },
    [localeConfig]
  );
  const formatNumber = React6.useCallback(
    (number, options = {
      // Implementation pending
    }, locale) => {
      const targetLocale = locale || localeConfig.primary;
      return new Intl.NumberFormat(targetLocale, options).format(number);
    },
    [localeConfig]
  );
  const formatPercentage = React6.useCallback(
    (value, precision = 1, locale) => {
      const targetLocale = locale || localeConfig.primary;
      return new Intl.NumberFormat(targetLocale, {
        style: "percent",
        minimumFractionDigits: precision,
        maximumFractionDigits: precision
      }).format(value / 100);
    },
    [localeConfig]
  );
  const formatBandwidth = React6.useCallback(
    (value, unit) => {
      const targetUnit = unit || businessConfig.units.bandwidth;
      if (targetUnit === "gbps" && value >= 1e3) {
        return `${(value / 1e3).toFixed(1)} Gbps`;
      }
      return `${value} ${targetUnit.toUpperCase()}`;
    },
    [businessConfig]
  );
  const formatDataSize = React6.useCallback((bytes, precision = 2) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(precision)} ${units[unitIndex]}`;
  }, []);
  const formatRelativeTime = React6.useCallback(
    (date, locale) => {
      const targetLocale = locale || localeConfig.primary;
      const dateObj = typeof date === "string" ? new Date(date) : date;
      const now = /* @__PURE__ */ new Date();
      const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1e3);
      if (diffInSeconds < 60) {
        return "Just now";
      }
      if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}m ago`;
      }
      if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
      }
      if (diffInSeconds < 2592e3) {
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
      }
      return dateObj.toLocaleDateString(targetLocale, localeConfig.dateFormat.short);
    },
    [localeConfig]
  );
  const formatStatus = React6.useCallback(
    (status, _type = "customer") => {
      const statusConfig = businessConfig.statusTypes[status];
      if (!statusConfig) {
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          color: "default",
          description: ""
        };
      }
      return statusConfig;
    },
    [businessConfig]
  );
  const formatPlan = React6.useCallback(
    (planKey) => {
      const planConfig = businessConfig.planTypes[planKey];
      if (!planConfig) {
        return {
          label: planKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          category: "residential",
          features: []
        };
      }
      return planConfig;
    },
    [businessConfig]
  );
  return {
    formatCurrency,
    formatDate,
    formatNumber,
    formatPercentage,
    formatBandwidth,
    formatDataSize,
    formatRelativeTime,
    formatStatus,
    formatPlan,
    // Direct access to configs for advanced use cases
    localeConfig,
    currencyConfig,
    businessConfig
  };
}
var FormValidator = class {
  constructor(config) {
    this.config = config;
    this.formData = {
      // Implementation pending
    };
  }
  setFormData(data) {
    this.formData = data;
  }
  validateField(fieldName, value) {
    const fieldConfig = this.config[fieldName];
    if (!fieldConfig) {
      return [];
    }
    const errors = [];
    if (fieldConfig.required && this.isEmpty(value)) {
      errors.push({
        field: fieldName,
        message: "This field is required"
      });
      return errors;
    }
    if (!fieldConfig.required && this.isEmpty(value)) {
      return errors;
    }
    if (fieldConfig.rules) {
      for (const rule of fieldConfig.rules) {
        if (!rule.validate(value)) {
          errors.push({
            field: fieldName,
            message: rule.message
          });
        }
      }
    }
    return errors;
  }
  validateForm(formData) {
    this.setFormData(formData);
    const allErrors = [];
    const fieldErrors = {
      // Implementation pending
    };
    for (const fieldName in this.config) {
      const fieldValue = formData[fieldName];
      const errors = this.validateField(fieldName, fieldValue);
      if (errors.length > 0) {
        allErrors.push(...errors);
        fieldErrors[fieldName] = errors[0]?.message || "Validation error";
      }
    }
    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      fieldErrors
    };
  }
  validateFormAsync(formData) {
    return Promise.resolve(this.validateForm(formData));
  }
  isEmpty(value) {
    if (value === null || value === void 0) {
      return true;
    }
    if (typeof value === "string") {
      return value.trim() === "";
    }
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    if (typeof value === "object") {
      return Object.keys(value).length === 0;
    }
    return false;
  }
  // Utility method to get validation config for a specific field
  getFieldConfig(fieldName) {
    return this.config[fieldName];
  }
  // Check if a field is required
  isFieldRequired(fieldName) {
    return this.config[fieldName]?.required ?? false;
  }
};
function createDebouncedValidator(validator, delay = 300) {
  let timeoutId;
  return (fieldName, value, callback) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const errors = validator.validateField(fieldName, value);
      callback(errors);
    }, delay);
  };
}

// src/hooks/useFormValidation.ts
function useFormValidation(initialValues, options) {
  const {
    validationConfig,
    validateOnChange = true,
    validateOnBlur = true,
    debounceTime = 300,
    onValidationComplete
  } = options;
  const [formData, setFormData] = React6.useState(initialValues);
  const [errors, setErrors] = React6.useState({});
  const [touched, setTouchedState] = React6.useState({});
  const [isValidating, setIsValidating] = React6.useState(false);
  const validatorRef = React6.useRef(new FormValidator(validationConfig));
  const debouncedValidatorRef = React6.useRef(
    createDebouncedValidator(validatorRef.current, debounceTime)
  );
  React6.useEffect(() => {
    validatorRef.current = new FormValidator(validationConfig);
    debouncedValidatorRef.current = createDebouncedValidator(validatorRef.current, debounceTime);
  }, [validationConfig, debounceTime]);
  const setValue = React6.useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (validateOnChange && touched[field]) {
        debouncedValidatorRef.current?.(field, value, (fieldErrors) => {
          if (fieldErrors.length > 0) {
            const firstError = fieldErrors[0];
            if (firstError) {
              setErrors((prev) => ({ ...prev, [field]: firstError.message }));
            }
          } else {
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[field];
              return newErrors;
            });
          }
        });
      }
    },
    [validateOnChange, touched]
  );
  const setValues = React6.useCallback((values) => {
    setFormData((prev) => ({ ...prev, ...values }));
  }, []);
  const setError = React6.useCallback((field, error2) => {
    setErrors((prev) => ({ ...prev, [field]: error2 }));
  }, []);
  const clearError = React6.useCallback((field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);
  const clearAllErrors = React6.useCallback(() => {
    setErrors({});
  }, []);
  const setTouched = React6.useCallback((field, isTouched = true) => {
    setTouchedState((prev) => ({ ...prev, [field]: isTouched }));
  }, []);
  const validateField = React6.useCallback(
    async (field) => {
      const value = formData[field];
      const fieldErrors = validatorRef.current.validateField(field, value);
      if (fieldErrors.length > 0) {
        const firstError = fieldErrors[0];
        if (firstError) {
          setErrors((prev) => ({ ...prev, [field]: firstError.message }));
        }
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [formData]
  );
  const validateForm = React6.useCallback(async () => {
    setIsValidating(true);
    try {
      const result = await validatorRef.current.validateFormAsync(formData);
      setErrors(result.fieldErrors);
      if (onValidationComplete) {
        onValidationComplete(result);
      }
      return result;
    } finally {
      setIsValidating(false);
    }
  }, [formData, onValidationComplete]);
  const resetForm = React6.useCallback(
    (newInitialValues) => {
      const resetValues = newInitialValues || initialValues;
      setFormData(resetValues);
      setErrors({});
      setTouchedState({});
    },
    [initialValues]
  );
  const getFieldProps = React6.useCallback(
    (field) => {
      const isRequired = validatorRef.current.isFieldRequired(field);
      const hasError = !!errors[field];
      const fieldProps = {
        value: formData[field] ?? "",
        onChange: (event) => {
          const target = event.target;
          const nextValue = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
          setValue(field, nextValue);
        },
        onBlur: () => {
          setTouched(field, true);
          if (validateOnBlur) {
            void validateField(field);
          }
        },
        required: isRequired,
        "aria-invalid": hasError
      };
      if (errors[field]) {
        fieldProps.error = errors[field];
        fieldProps["aria-describedby"] = `${field}-error`;
      }
      return fieldProps;
    },
    [formData, errors, setValue, setTouched, validateField, validateOnBlur]
  );
  const handleSubmit = React6.useCallback(
    (onSubmit) => async (e) => {
      if (e) {
        e.preventDefault();
      }
      const allTouched = Object.keys(validationConfig).reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {}
      );
      setTouchedState(allTouched);
      const validationResult = await validateForm();
      if (validationResult.isValid) {
        await onSubmit(formData);
      }
    },
    [formData, validationConfig, validateForm]
  );
  const isValid = Object.keys(errors).length === 0;
  return {
    formData,
    errors,
    touched,
    isValid,
    isValidating,
    setValue,
    setValues,
    setError,
    clearError,
    clearAllErrors,
    validateField,
    validateForm,
    resetForm,
    setTouched,
    getFieldProps,
    handleSubmit
  };
}
function useFormSubmission(options = {}) {
  const { onSuccess, onError, resetOnSuccess = false } = options;
  const [isSubmitting, setIsSubmitting] = React6.useState(false);
  const [submitError, setSubmitError] = React6.useState(null);
  const [submitSuccess, setSubmitSuccess] = React6.useState(false);
  const submit = React6.useCallback(
    async (submitFn) => {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);
      try {
        const result = await submitFn();
        setSubmitSuccess(true);
        if (onSuccess) {
          onSuccess(result);
        }
        if (resetOnSuccess) {
        }
      } catch (error2) {
        const errorMessage = error2 instanceof Error ? error2.message : "An error occurred during submission";
        setSubmitError(errorMessage);
        if (onError) {
          onError(error2);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess, onError, resetOnSuccess]
  );
  const reset = React6.useCallback(() => {
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(false);
  }, []);
  return {
    isSubmitting,
    submitError,
    submitSuccess,
    submit,
    reset
  };
}
function useAsyncValidation(field, value, options) {
  const { validator, debounceTime = 500, dependencies = [] } = options;
  const [isValidating, setIsValidating] = React6.useState(false);
  const [errors, setErrors] = React6.useState([]);
  const validateAsync = React6.useCallback(async () => {
    if (!value) {
      setErrors([]);
      return;
    }
    setIsValidating(true);
    try {
      const validationErrors = await validator(value);
      setErrors(validationErrors);
    } catch (_error) {
      setErrors([
        {
          field,
          message: "Validation failed"
        }
      ]);
    } finally {
      setIsValidating(false);
    }
  }, [value, validator, field]);
  React6.useEffect(() => {
    const timeoutId = setTimeout(validateAsync, debounceTime);
    return () => clearTimeout(timeoutId);
  }, [validateAsync, debounceTime, ...dependencies]);
  return {
    isValidating,
    errors,
    hasErrors: errors.length > 0
  };
}
var partnerQueryKeys = {
  all: ["partner"],
  dashboard: (partnerId) => [...partnerQueryKeys.all, "dashboard", partnerId],
  customers: (partnerId) => [...partnerQueryKeys.all, "customers", partnerId],
  customer: (partnerId, customerId) => [...partnerQueryKeys.customers(partnerId), customerId],
  commissions: (partnerId) => [...partnerQueryKeys.all, "commissions", partnerId],
  analytics: (partnerId) => [...partnerQueryKeys.all, "analytics", partnerId]
};
var getClient = () => getPartnerApiClient();
function usePartnerDashboard(partnerId) {
  const client = getClient();
  return reactQuery.useQuery({
    queryKey: partnerQueryKeys.dashboard(partnerId || ""),
    queryFn: () => client.getDashboard(partnerId),
    enabled: !!partnerId,
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    select: (response) => response.data
  });
}
function usePartnerCustomers(partnerId, params) {
  const client = getClient();
  return reactQuery.useQuery({
    queryKey: [...partnerQueryKeys.customers(partnerId || ""), params],
    queryFn: () => client.getCustomers(partnerId, params),
    enabled: !!partnerId,
    staleTime: 2 * 60 * 1e3,
    // 2 minutes
    select: (response) => response.data
  });
}
function usePartnerCustomer(partnerId, customerId) {
  const client = getClient();
  return reactQuery.useQuery({
    queryKey: partnerQueryKeys.customer(partnerId || "", customerId || ""),
    queryFn: () => client.getCustomer(partnerId, customerId),
    enabled: !!partnerId && !!customerId,
    select: (response) => response.data
  });
}
function useCreateCustomer(partnerId) {
  const queryClient = reactQuery.useQueryClient();
  const client = getClient();
  return reactQuery.useMutation({
    mutationFn: (customerData) => client.createCustomer(partnerId, customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.customers(partnerId)
      });
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.dashboard(partnerId)
      });
    }
  });
}
function useUpdateCustomer(partnerId, customerId) {
  const queryClient = reactQuery.useQueryClient();
  const client = getClient();
  return reactQuery.useMutation({
    mutationFn: (customerData) => client.updateCustomer(partnerId, customerId, customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.customer(partnerId, customerId)
      });
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.customers(partnerId)
      });
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.dashboard(partnerId)
      });
    }
  });
}
function usePartnerCommissions(partnerId, params) {
  const client = getClient();
  return reactQuery.useQuery({
    queryKey: [...partnerQueryKeys.commissions(partnerId || ""), params],
    queryFn: () => client.getCommissions(partnerId, params),
    enabled: !!partnerId,
    staleTime: 10 * 60 * 1e3,
    // 10 minutes (financial data changes less frequently)
    select: (response) => response.data
  });
}
function usePartnerAnalytics(partnerId, params) {
  const client = getClient();
  return reactQuery.useQuery({
    queryKey: [...partnerQueryKeys.analytics(partnerId || ""), params],
    queryFn: () => client.getAnalytics(partnerId, params),
    enabled: !!partnerId,
    staleTime: 15 * 60 * 1e3,
    // 15 minutes
    select: (response) => response.data
  });
}
function useValidateTerritory(partnerId) {
  const client = getClient();
  return reactQuery.useMutation({
    mutationFn: async (address) => {
      const response = await client.validateTerritory(partnerId, address);
      return response.data;
    }
  });
}
function usePartnerDataWithErrorBoundary(hookResult) {
  if (hookResult.isError && hookResult.error) {
    if (hookResult.error.status === 403 || hookResult.error.status === 401) {
      console.error("Partner access denied:", hookResult.error);
    }
    if (hookResult.error.status >= 500) {
      console.error("Server error in partner data:", hookResult.error);
    }
  }
  return hookResult;
}
var DEFAULT_COMMISSION_TIERS = [
  {
    id: "bronze",
    name: "Bronze Partner",
    minimumRevenue: 0,
    baseRate: 0.05,
    // 5%
    productMultipliers: {
      residential_basic: 1,
      residential_premium: 1.2,
      business_pro: 1.5,
      enterprise: 2
    }
  },
  {
    id: "silver",
    name: "Silver Partner",
    minimumRevenue: 5e4,
    baseRate: 0.07,
    // 7%
    bonusRate: 0.01,
    // 1% bonus
    productMultipliers: {
      residential_basic: 1,
      residential_premium: 1.3,
      business_pro: 1.6,
      enterprise: 2.2
    }
  },
  {
    id: "gold",
    name: "Gold Partner",
    minimumRevenue: 15e4,
    baseRate: 0.1,
    // 10%
    bonusRate: 0.02,
    // 2% bonus
    productMultipliers: {
      residential_basic: 1.1,
      residential_premium: 1.4,
      business_pro: 1.8,
      enterprise: 2.5
    }
  },
  {
    id: "platinum",
    name: "Platinum Partner",
    minimumRevenue: 5e5,
    baseRate: 0.12,
    // 12%
    bonusRate: 0.03,
    // 3% bonus
    productMultipliers: {
      residential_basic: 1.2,
      residential_premium: 1.5,
      business_pro: 2,
      enterprise: 3
    }
  }
];
var CommissionCalculationInputSchema = zod.z.object({
  customerId: zod.z.string().min(1),
  partnerId: zod.z.string().min(1),
  partnerTier: zod.z.enum(["bronze", "silver", "gold", "platinum"]),
  productType: zod.z.enum(["residential_basic", "residential_premium", "business_pro", "enterprise"]),
  monthlyRevenue: zod.z.number().min(0),
  partnerLifetimeRevenue: zod.z.number().min(0),
  isNewCustomer: zod.z.boolean(),
  contractLength: zod.z.number().min(1).max(36),
  // 1-36 months
  promotionalRate: zod.z.number().min(0).max(1).optional(),
  territoryBonus: zod.z.number().min(0).max(0.05).optional()
  // Max 5% territory bonus
});
var CommissionEngine = class {
  constructor(customTiers) {
    this.auditLog = [];
    this.tiers = customTiers || DEFAULT_COMMISSION_TIERS;
  }
  addAudit(message) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    this.auditLog.push(`${timestamp}: ${message}`);
  }
  getTier(tierName) {
    const tier = this.tiers.find((t) => t.id === tierName);
    if (!tier) {
      throw new Error(`Invalid commission tier: ${tierName}`);
    }
    return tier;
  }
  validateTierEligibility(lifetimeRevenue, tier) {
    return lifetimeRevenue >= tier.minimumRevenue;
  }
  calculateNewCustomerBonus(tier, monthlyRevenue) {
    const baseCommission = monthlyRevenue * tier.baseRate;
    return baseCommission * 0.5;
  }
  calculateContractLengthBonus(contractLength, baseCommission) {
    if (contractLength >= 24) return baseCommission * 0.1;
    if (contractLength >= 12) return baseCommission * 0.05;
    return 0;
  }
  calculateTerritoryBonus(territoryBonus = 0, baseCommission) {
    return baseCommission * territoryBonus;
  }
  applyPromotionalAdjustment(promotionalRate = 1, totalCommission) {
    return totalCommission * promotionalRate;
  }
  calculateCommission(input) {
    this.auditLog = [];
    const validatedInput = CommissionCalculationInputSchema.parse(input);
    this.addAudit(`Starting commission calculation for customer ${validatedInput.customerId}`);
    const tier = this.getTier(validatedInput.partnerTier);
    this.addAudit(`Using tier: ${tier.name} (${tier.baseRate * 100}% base rate)`);
    if (!this.validateTierEligibility(validatedInput.partnerLifetimeRevenue, tier)) {
      const error2 = `Partner not eligible for ${tier.name} tier (requires $${tier.minimumRevenue}, has $${validatedInput.partnerLifetimeRevenue})`;
      this.addAudit(`ERROR: ${error2}`);
      throw new Error(error2);
    }
    const baseAmount = validatedInput.monthlyRevenue;
    const tierMultiplier = tier.baseRate + (tier.bonusRate || 0);
    const productMultiplier = tier.productMultipliers?.[validatedInput.productType] || 1;
    const baseCommission = baseAmount * tierMultiplier * productMultiplier;
    this.addAudit(
      `Base commission: $${baseAmount} \xD7 ${tierMultiplier} \xD7 ${productMultiplier} = $${baseCommission.toFixed(2)}`
    );
    const newCustomerBonus = validatedInput.isNewCustomer ? this.calculateNewCustomerBonus(tier, validatedInput.monthlyRevenue) : 0;
    const contractLengthBonus = this.calculateContractLengthBonus(
      validatedInput.contractLength,
      baseCommission
    );
    const territoryBonus = this.calculateTerritoryBonus(
      validatedInput.territoryBonus,
      baseCommission
    );
    this.addAudit(`New customer bonus: $${newCustomerBonus.toFixed(2)}`);
    this.addAudit(`Contract length bonus: $${contractLengthBonus.toFixed(2)}`);
    this.addAudit(`Territory bonus: $${territoryBonus.toFixed(2)}`);
    const prePromotionalTotal = baseCommission + newCustomerBonus + contractLengthBonus + territoryBonus;
    const promotionalAdjustment = this.applyPromotionalAdjustment(
      validatedInput.promotionalRate,
      prePromotionalTotal
    );
    const totalCommission = promotionalAdjustment;
    const bonusCommission = newCustomerBonus + contractLengthBonus + territoryBonus;
    const effectiveRate = totalCommission / validatedInput.monthlyRevenue;
    this.addAudit(
      `Final commission: $${totalCommission.toFixed(2)} (${(effectiveRate * 100).toFixed(2)}% effective rate)`
    );
    const maxCommissionRate = 0.5;
    if (effectiveRate > maxCommissionRate) {
      const error2 = `Commission rate ${(effectiveRate * 100).toFixed(2)}% exceeds maximum allowed ${maxCommissionRate * 100}%`;
      this.addAudit(`SECURITY ERROR: ${error2}`);
      throw new Error(error2);
    }
    return {
      customerId: validatedInput.customerId,
      partnerId: validatedInput.partnerId,
      baseCommission,
      bonusCommission,
      totalCommission,
      effectiveRate,
      tier: tier.name,
      breakdown: {
        baseAmount,
        tierMultiplier,
        productMultiplier,
        newCustomerBonus,
        territoryBonus,
        contractLengthBonus,
        promotionalAdjustment: promotionalAdjustment - prePromotionalTotal
      },
      calculatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      auditTrail: [...this.auditLog]
    };
  }
  // Batch calculation with transaction safety
  calculateBatchCommissions(inputs) {
    const results = [];
    const errors = [];
    for (let i = 0; i < inputs.length; i++) {
      try {
        const result = this.calculateCommission(inputs[i]);
        results.push(result);
      } catch (error2) {
        errors.push({
          index: i,
          error: error2 instanceof Error ? error2.message : "Unknown error"
        });
      }
    }
    if (errors.length > 0) {
      throw new Error(`Batch calculation failed: ${JSON.stringify(errors)}`);
    }
    return results;
  }
  // Commission validation for existing records
  validateCommission(commission, originalInput) {
    try {
      const recalculated = this.calculateCommission(originalInput);
      const tolerance = 0.01;
      const totalMatch = Math.abs(recalculated.totalCommission - commission.totalCommission) < tolerance;
      const rateMatch = Math.abs(recalculated.effectiveRate - commission.effectiveRate) < tolerance;
      return totalMatch && rateMatch;
    } catch (error2) {
      return false;
    }
  }
  // Get partner tier based on lifetime revenue
  determineEligibleTier(lifetimeRevenue) {
    const eligibleTiers = this.tiers.filter((tier) => lifetimeRevenue >= tier.minimumRevenue).sort((a, b) => b.minimumRevenue - a.minimumRevenue);
    const bestTier = eligibleTiers[0];
    if (bestTier) {
      return bestTier;
    }
    const fallbackTier = this.tiers[0];
    if (fallbackTier) {
      return fallbackTier;
    }
    throw new Error("No commission tiers configured");
  }
  // Simulate commission for what-if scenarios
  simulateCommission(baseRevenue, targetTier, productMix) {
    const tier = this.getTier(targetTier);
    let totalCommissions = 0;
    for (const [productType, revenue] of Object.entries(productMix)) {
      const multiplier = tier.productMultipliers?.[productType] || 1;
      const commission = revenue * (tier.baseRate + (tier.bonusRate || 0)) * multiplier;
      totalCommissions += commission;
    }
    const revenueNeeded = Math.max(0, tier.minimumRevenue - baseRevenue);
    return {
      projectedCommissions: totalCommissions,
      revenueNeeded
    };
  }
};
var commissionEngine = new CommissionEngine();
var TerritorySchema = zod.z.object({
  id: zod.z.string().min(1),
  name: zod.z.string().min(1),
  partnerId: zod.z.string().min(1),
  boundaries: zod.z.object({
    zipCodes: zod.z.array(zod.z.string().regex(/^\d{5}(-\d{4})?$/)).optional(),
    cities: zod.z.array(zod.z.string().min(1)).optional(),
    counties: zod.z.array(zod.z.string().min(1)).optional(),
    states: zod.z.array(zod.z.string().length(2)).optional(),
    coordinates: zod.z.object({
      polygon: zod.z.array(
        zod.z.object({
          lat: zod.z.number().min(-90).max(90),
          lng: zod.z.number().min(-180).max(180)
        })
      )
    }).optional()
  }),
  exclusions: zod.z.object({
    zipCodes: zod.z.array(zod.z.string().regex(/^\d{5}(-\d{4})?$/)).optional(),
    addresses: zod.z.array(zod.z.string().min(5)).optional()
  }).optional(),
  priority: zod.z.number().min(1).max(10).default(5),
  // Higher number = higher priority
  isActive: zod.z.boolean().default(true),
  createdAt: zod.z.string().datetime(),
  updatedAt: zod.z.string().datetime()
});
var AddressSchema = zod.z.object({
  street: zod.z.string().min(5).max(200),
  city: zod.z.string().min(1).max(100),
  state: zod.z.string().length(2),
  zipCode: zod.z.string().regex(/^\d{5}(-\d{4})?$/),
  country: zod.z.string().length(2).default("US")
});
var ValidationResultSchema = zod.z.object({
  isValid: zod.z.boolean(),
  assignedPartnerId: zod.z.string().optional(),
  territoryId: zod.z.string().optional(),
  territoryName: zod.z.string().optional(),
  conflictingTerritories: zod.z.array(
    zod.z.object({
      territoryId: zod.z.string(),
      territoryName: zod.z.string(),
      partnerId: zod.z.string(),
      priority: zod.z.number()
    })
  ).optional(),
  validationMethod: zod.z.enum(["zipcode", "city", "county", "state", "coordinates"]),
  confidence: zod.z.number().min(0).max(1),
  // 0-1 confidence score
  warnings: zod.z.array(zod.z.string()).optional()
});
var TerritoryValidator = class {
  constructor(territories = [], geocodingService) {
    this.territories = [];
    this.territories = territories.map((t) => TerritorySchema.parse(t));
    this.geocodingService = geocodingService;
  }
  // Add or update territory
  addTerritory(territory) {
    const validatedTerritory = TerritorySchema.parse(territory);
    const existingIndex = this.territories.findIndex((t) => t.id === validatedTerritory.id);
    if (existingIndex >= 0) {
      this.territories[existingIndex] = validatedTerritory;
    } else {
      this.territories.push(validatedTerritory);
    }
  }
  // Remove territory
  removeTerritory(territoryId) {
    this.territories = this.territories.filter((t) => t.id !== territoryId);
  }
  // Get territories for a partner
  getPartnerTerritories(partnerId) {
    return this.territories.filter((t) => t.partnerId === partnerId && t.isActive);
  }
  // Validate address against territories
  async validateAddress(address, requestingPartnerId) {
    const validatedAddress = AddressSchema.parse(address);
    const activeTerritories = this.territories.filter((t) => t.isActive);
    const matchingTerritories = [];
    for (const territory of activeTerritories) {
      if (territory.boundaries.zipCodes?.includes(validatedAddress.zipCode)) {
        if (!this.isExcluded(validatedAddress, territory)) {
          matchingTerritories.push({
            territory,
            method: "zipcode",
            confidence: 0.95
          });
        }
      }
    }
    if (matchingTerritories.length === 0) {
      for (const territory of activeTerritories) {
        if (territory.boundaries.cities?.some(
          (city) => city.toLowerCase() === validatedAddress.city.toLowerCase()
        )) {
          if (!this.isExcluded(validatedAddress, territory)) {
            matchingTerritories.push({
              territory,
              method: "city",
              confidence: 0.8
            });
          }
        }
      }
    }
    if (matchingTerritories.length === 0) {
      for (const territory of activeTerritories) {
        if (territory.boundaries.states?.includes(validatedAddress.state)) {
          if (!this.isExcluded(validatedAddress, territory)) {
            matchingTerritories.push({
              territory,
              method: "state",
              confidence: 0.4
            });
          }
        }
      }
    }
    if (matchingTerritories.length === 0 && this.geocodingService) {
      try {
        const coordinates = await this.geocodingService(validatedAddress);
        for (const territory of activeTerritories) {
          if (territory.boundaries.coordinates) {
            if (this.isPointInPolygon(coordinates, territory.boundaries.coordinates.polygon)) {
              if (!this.isExcluded(validatedAddress, territory)) {
                matchingTerritories.push({
                  territory,
                  method: "coordinates",
                  confidence: 0.9
                });
              }
            }
          }
        }
      } catch (error2) {
        console.warn("Geocoding failed:", error2);
      }
    }
    matchingTerritories.sort((a, b) => {
      const priorityDiff = b.territory.priority - a.territory.priority;
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });
    const warnings = [];
    if (matchingTerritories.length === 0) {
      return ValidationResultSchema.parse({
        isValid: false,
        validationMethod: "state",
        confidence: 0,
        warnings: warnings.length > 0 ? warnings : void 0
      });
    }
    const bestMatch = matchingTerritories[0];
    const conflictingTerritories = matchingTerritories.slice(1).map((mt) => ({
      territoryId: mt.territory.id,
      territoryName: mt.territory.name,
      partnerId: mt.territory.partnerId,
      priority: mt.territory.priority
    }));
    if (conflictingTerritories.length > 0) {
      warnings.push(`Address matches multiple territories. Using highest priority territory.`);
    }
    if (requestingPartnerId) {
      const assignedPartnerId = bestMatch.territory.partnerId;
      if (assignedPartnerId !== requestingPartnerId) {
        warnings.push(`Address is in territory assigned to partner ${assignedPartnerId}`);
      }
    }
    return ValidationResultSchema.parse({
      isValid: true,
      assignedPartnerId: bestMatch.territory.partnerId,
      territoryId: bestMatch.territory.id,
      territoryName: bestMatch.territory.name,
      conflictingTerritories: conflictingTerritories.length > 0 ? conflictingTerritories : void 0,
      validationMethod: bestMatch.method || "state",
      confidence: bestMatch.confidence || 0,
      warnings: warnings.length > 0 ? warnings : void 0
    });
  }
  // Check if address is in exclusion list
  isExcluded(address, territory) {
    if (!territory.exclusions) return false;
    if (territory.exclusions.zipCodes?.includes(address.zipCode)) {
      return true;
    }
    if (territory.exclusions.addresses) {
      const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
      return territory.exclusions.addresses.some(
        (excludedAddress) => fullAddress.toLowerCase().includes(excludedAddress.toLowerCase())
      );
    }
    return false;
  }
  // Point-in-polygon algorithm for coordinate-based validation
  isPointInPolygon(point, polygon) {
    if (polygon.length < 3) {
      return false;
    }
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const current = polygon[i];
      const previous = polygon[j];
      if (current.lng > point.lng !== previous.lng > point.lng && point.lat < (previous.lat - current.lat) * (point.lng - current.lng) / (previous.lng - current.lng) + current.lat) {
        inside = !inside;
      }
    }
    return inside;
  }
  // Validate partner has access to territory
  validatePartnerAccess(partnerId, territoryId) {
    const territory = this.territories.find((t) => t.id === territoryId);
    return territory?.partnerId === partnerId && territory?.isActive === true;
  }
  // Get territory coverage statistics
  getTerritoryStats(territoryId) {
    const territory = this.territories.find((t) => t.id === territoryId);
    if (!territory) {
      throw new Error(`Territory ${territoryId} not found`);
    }
    return {
      zipCodeCount: territory.boundaries.zipCodes?.length || 0,
      cityCount: territory.boundaries.cities?.length || 0,
      hasCoordinateBoundaries: !!territory.boundaries.coordinates,
      priority: territory.priority,
      isActive: territory.isActive
    };
  }
  // Find optimal territory assignments to minimize conflicts
  optimizeTerritoryAssignments() {
    const results = [];
    for (const territory of this.territories) {
      const conflicts = [];
      let conflictScore = 0;
      if (territory.boundaries.zipCodes) {
        for (const otherTerritory of this.territories) {
          if (otherTerritory.id === territory.id) continue;
          const overlap = territory.boundaries.zipCodes.filter(
            (zip) => otherTerritory.boundaries.zipCodes?.includes(zip)
          );
          if (overlap.length > 0) {
            conflicts.push(`ZIP code overlap with ${otherTerritory.name}: ${overlap.join(", ")}`);
            conflictScore += overlap.length * 10;
          }
        }
      }
      if (territory.boundaries.cities) {
        for (const otherTerritory of this.territories) {
          if (otherTerritory.id === territory.id) continue;
          const overlap = territory.boundaries.cities.filter(
            (city) => otherTerritory.boundaries.cities?.some(
              (otherCity) => city.toLowerCase() === otherCity.toLowerCase()
            )
          );
          if (overlap.length > 0) {
            conflicts.push(`City overlap with ${otherTerritory.name}: ${overlap.join(", ")}`);
            conflictScore += overlap.length * 5;
          }
        }
      }
      results.push({
        territoryId: territory.id,
        suggestedChanges: conflicts,
        conflictScore
      });
    }
    return results.sort((a, b) => b.conflictScore - a.conflictScore);
  }
  // Bulk validation for multiple addresses
  async validateBulkAddresses(addresses, requestingPartnerId) {
    const results = [];
    for (const address of addresses) {
      try {
        const result = await this.validateAddress(address, requestingPartnerId);
        results.push(result);
      } catch (error2) {
        results.push({
          isValid: false,
          validationMethod: "state",
          confidence: 0,
          warnings: [
            `Invalid address format: ${error2 instanceof Error ? error2.message : "Unknown error"}`
          ]
        });
      }
    }
    return results;
  }
};
var territoryValidator = new TerritoryValidator();

// src/hooks/useBusinessValidation.ts
function useBusinessValidation(partnerId) {
  const [validationCache, setValidationCache] = React6.useState(
    /* @__PURE__ */ new Map()
  );
  const validateCustomer = React6.useCallback(
    async (customer) => {
      const warnings = [];
      const errors = [];
      const suggestions = [];
      let territoryValidation;
      let commissionEstimate;
      try {
        if (customer.address && partnerId) {
          try {
            const addressParts = customer.address.split(",").map((s) => s.trim());
            if (addressParts.length >= 3) {
              const street = addressParts[0];
              const city = addressParts[1];
              const stateZip = addressParts[2]?.split(" ") ?? [];
              const [state, zipCode] = stateZip;
              if (street && city && state && zipCode) {
                const address = { street, city, state, zipCode };
                const result = await territoryValidator.validateAddress(address, partnerId);
                const validationDetails = {
                  isInTerritory: result.isValid && result.assignedPartnerId === partnerId,
                  confidence: result.confidence
                };
                if (result.assignedPartnerId) {
                  validationDetails.assignedPartnerId = result.assignedPartnerId;
                }
                if (result.territoryName) {
                  validationDetails.territoryName = result.territoryName;
                }
                territoryValidation = validationDetails;
                if (!result.isValid) {
                  errors.push("Customer address is not in any assigned territory");
                } else if (result.assignedPartnerId !== partnerId) {
                  errors.push(
                    `Customer is in territory assigned to partner ${result.assignedPartnerId}`
                  );
                }
                if (result.warnings) {
                  warnings.push(...result.warnings);
                }
                if (result.confidence < 0.8) {
                  warnings.push(
                    "Territory assignment has low confidence - manual review recommended"
                  );
                }
              }
            }
          } catch (error2) {
            warnings.push("Could not validate territory - address format may be incorrect");
          }
        }
        if (customer.plan && customer.mrr && partnerId) {
          try {
            const tier = commissionEngine.determineEligibleTier(1e5);
            const commissionResult = commissionEngine.calculateCommission({
              customerId: customer.id || "new-customer",
              partnerId,
              partnerTier: tier.id,
              productType: customer.plan,
              monthlyRevenue: customer.mrr,
              partnerLifetimeRevenue: 1e5,
              // Default for estimation
              isNewCustomer: true,
              contractLength: 12
              // Default 12 months
            });
            commissionEstimate = {
              monthlyCommission: commissionResult.totalCommission,
              annualCommission: commissionResult.totalCommission * 12,
              effectiveRate: commissionResult.effectiveRate
            };
            if (commissionResult.effectiveRate < 0.05) {
              suggestions.push(
                "Consider upgrading customer to higher-value plan for better commission rates"
              );
            }
            if (commissionResult.breakdown.newCustomerBonus > 0) {
              suggestions.push(
                `New customer bonus of $${commissionResult.breakdown.newCustomerBonus.toFixed(2)} applies`
              );
            }
          } catch (error2) {
            warnings.push("Could not calculate commission estimate");
          }
        }
        if (customer.mrr && customer.mrr < 10) {
          warnings.push("Monthly recurring revenue is very low - confirm pricing accuracy");
        }
        if (customer.mrr && customer.mrr > 1e3) {
          suggestions.push("High-value customer - consider priority support assignment");
        }
        if (customer.plan === "enterprise" && customer.mrr && customer.mrr < 200) {
          warnings.push("Enterprise plan pricing seems low - verify plan selection");
        }
        if (customer.status === "suspended") {
          warnings.push("Customer account is suspended - resolve issues before activation");
        }
        if (customer.status === "pending" && customer.joinDate) {
          const joinDate = new Date(customer.joinDate);
          const daysSinceJoin = Math.floor(
            (Date.now() - joinDate.getTime()) / (1e3 * 60 * 60 * 24)
          );
          if (daysSinceJoin > 30) {
            warnings.push("Customer has been pending for over 30 days - follow up required");
          }
        }
        const isValid = errors.length === 0;
        const validationResult = {
          isValid,
          warnings,
          errors,
          suggestions
        };
        if (territoryValidation) {
          validationResult.territoryValidation = territoryValidation;
        }
        if (commissionEstimate) {
          validationResult.commissionEstimate = commissionEstimate;
        }
        return validationResult;
      } catch (error2) {
        const validationResult = {
          isValid: false,
          warnings,
          errors: [
            ...errors,
            `Validation error: ${error2 instanceof Error ? error2.message : "Unknown error"}`
          ],
          suggestions
        };
        if (territoryValidation) {
          validationResult.territoryValidation = territoryValidation;
        }
        if (commissionEstimate) {
          validationResult.commissionEstimate = commissionEstimate;
        }
        return validationResult;
      }
    },
    [partnerId]
  );
  const validateCommission = React6.useCallback(
    (customerId, monthlyRevenue, productType, partnerTier, isNewCustomer = false, contractLength = 12) => {
      const warnings = [];
      const errors = [];
      const suggestions = [];
      try {
        if (!partnerId) {
          errors.push("Partner ID is required for commission validation");
          return { isValid: false, warnings, errors, suggestions };
        }
        const result = commissionEngine.calculateCommission({
          customerId,
          partnerId,
          partnerTier,
          productType,
          monthlyRevenue,
          partnerLifetimeRevenue: 1e5,
          // This should come from actual partner data
          isNewCustomer,
          contractLength
        });
        if (result.effectiveRate > 0.25) {
          warnings.push("Commission rate exceeds 25% - verify calculation parameters");
        }
        if (result.totalCommission > monthlyRevenue * 0.5) {
          errors.push("Commission exceeds 50% of monthly revenue - calculation may be incorrect");
        }
        if (result.breakdown.newCustomerBonus > 0 && !isNewCustomer) {
          errors.push("New customer bonus applied to existing customer");
        }
        if (contractLength < 12) {
          suggestions.push("Longer contract terms may increase commission rates");
        }
        if (result.breakdown.territoryBonus === 0) {
          suggestions.push("Check if territory bonus applies for this customer location");
        }
        return {
          isValid: errors.length === 0,
          warnings,
          errors,
          suggestions
        };
      } catch (error2) {
        return {
          isValid: false,
          warnings,
          errors: [error2 instanceof Error ? error2.message : "Commission validation failed"],
          suggestions
        };
      }
    },
    [partnerId]
  );
  const validateTerritoryAssignment = React6.useCallback(
    async (address) => {
      const warnings = [];
      const errors = [];
      const suggestions = [];
      try {
        if (!partnerId) {
          errors.push("Partner ID is required for territory validation");
          return { isValid: false, warnings, errors, suggestions };
        }
        const addressParts = address.split(",").map((s) => s.trim());
        if (addressParts.length < 3) {
          errors.push("Address must include street, city, and state/zip");
          return { isValid: false, warnings, errors, suggestions };
        }
        const street = addressParts[0];
        const city = addressParts[1];
        const stateZip = addressParts[2]?.split(" ") ?? [];
        const [state, zipCode] = stateZip;
        if (!street || !city || !state || !zipCode) {
          errors.push("Incomplete address information");
          return { isValid: false, warnings, errors, suggestions };
        }
        const addressObj = { street, city, state, zipCode };
        const result = await territoryValidator.validateAddress(addressObj, partnerId);
        if (!result.isValid) {
          errors.push("Address is not in any assigned territory");
        } else if (result.assignedPartnerId !== partnerId) {
          errors.push(`Address is in territory assigned to partner ${result.assignedPartnerId}`);
          suggestions.push("Contact territory management for reassignment if needed");
        }
        if (result.confidence < 0.7) {
          warnings.push("Low confidence territory match - manual review recommended");
        }
        if (result.warnings) {
          warnings.push(...result.warnings);
        }
        return {
          isValid: errors.length === 0,
          warnings,
          errors,
          suggestions
        };
      } catch (error2) {
        return {
          isValid: false,
          warnings,
          errors: [
            `Territory validation failed: ${error2 instanceof Error ? error2.message : "Unknown error"}`
          ],
          suggestions
        };
      }
    },
    [partnerId]
  );
  const getCachedValidation = React6.useCallback(
    (key) => {
      return validationCache.get(key) || null;
    },
    [validationCache]
  );
  const cacheValidation = React6.useCallback((key, result) => {
    setValidationCache((prev) => new Map(prev.set(key, result)));
  }, []);
  return {
    validateCustomer,
    validateCommission,
    validateTerritoryAssignment,
    getCachedValidation,
    cacheValidation
  };
}

// src/utils/csp.ts
function generateNonce() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  for (let i = 0; i < 22; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result + "==";
}
function generateCSP(nonce, isDevelopment = false) {
  const policies = [
    `default-src 'self'`,
    // Use nonce for scripts instead of unsafe-inline
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ""}`,
    // Tightened CSP: Remove unsafe-inline in production, use nonce for inline styles
    `style-src 'self'${isDevelopment ? " 'unsafe-inline'" : ` 'nonce-${nonce}'`} fonts.googleapis.com`,
    `font-src 'self' fonts.gstatic.com data:`,
    `img-src 'self' data: blob: https:`,
    `connect-src 'self' ws: wss: https:`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`
  ];
  return policies.join("; ");
}
function generateCSPMeta(nonce) {
  const csp = generateCSP(nonce, process.env["NODE_ENV"] === "development");
  return `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
}
function extractNonce(cspHeader) {
  const match = cspHeader.match(/'nonce-([^']+)'/);
  return match ? match[1] : null;
}
function isValidNonce(nonce) {
  return /^[A-Za-z0-9+/]{22}==$/.test(nonce);
}

// src/utils/validation.ts
function sanitizeInput2(input, type = "text", options = {}) {
  if (input === null || input === void 0) {
    return "";
  }
  const stringValue = String(input).trim();
  if (!stringValue) {
    return "";
  }
  const { maxLength = 1e3, allowHTML = false } = options;
  switch (type) {
    case "email":
      const emailResult = sanitizeEmail(stringValue);
      return emailResult || "";
    case "phone":
      return stringValue.replace(/[^\d+\-\s()]/g, "").substring(0, maxLength);
    case "url":
      const urlCleaned = stringValue.replace(/^(javascript|data|vbscript):/i, "");
      return urlCleaned.substring(0, maxLength);
    case "html":
      if (allowHTML) {
        return sanitizeHTML(stringValue, { maxLength });
      }
      return sanitizeText(stringValue, maxLength);
    case "alphanumeric":
      return stringValue.replace(/[^a-zA-Z0-9\s\-_.,!?]/g, "").substring(0, maxLength);
    case "text":
    default:
      return sanitizeText(stringValue, maxLength);
  }
}
function validateInput(value, type, options = {}) {
  const {
    required = false,
    minLength,
    maxLength,
    pattern,
    sanitize = true,
    allowHTML = false
  } = options;
  const stringValue = value === null || value === void 0 ? "" : String(value).trim();
  if (required && !stringValue) {
    return {
      isValid: false,
      error: "This field is required"
    };
  }
  if (!required && !stringValue) {
    return {
      isValid: true,
      sanitizedValue: ""
    };
  }
  const processedValue = sanitize ? sanitizeInput2(stringValue, type, { maxLength, allowHTML }) : stringValue;
  if (minLength && processedValue.length < minLength) {
    return {
      isValid: false,
      error: `Must be at least ${minLength} characters long`
    };
  }
  if (maxLength && processedValue.length > maxLength) {
    return {
      isValid: false,
      error: `Must be no more than ${maxLength} characters long`
    };
  }
  if (pattern && !pattern.test(processedValue)) {
    return {
      isValid: false,
      error: "Invalid format"
    };
  }
  switch (type) {
    case "email":
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(processedValue)) {
        return {
          isValid: false,
          error: "Please enter a valid email address"
        };
      }
      break;
    case "phone":
      const phoneRegex = /^[\+]?[1-9]?[\d\s\-\(\)]{7,15}$/;
      if (!phoneRegex.test(processedValue)) {
        return {
          isValid: false,
          error: "Please enter a valid phone number"
        };
      }
      break;
    case "url":
      try {
        new URL(processedValue);
      } catch {
        return {
          isValid: false,
          error: "Please enter a valid URL"
        };
      }
      break;
    case "password":
      if (processedValue.length < 8) {
        return {
          isValid: false,
          error: "Password must be at least 8 characters long"
        };
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(processedValue)) {
        return {
          isValid: false,
          error: "Password must contain uppercase, lowercase, and numeric characters"
        };
      }
      break;
  }
  return {
    isValid: true,
    sanitizedValue: processedValue
  };
}
function validateFormData(data, schema) {
  const errors = {};
  const sanitizedData = {};
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    const result = validateInput(value, rules.type, rules);
    if (!result.isValid) {
      errors[field] = result.error || "Invalid value";
    } else {
      sanitizedData[field] = result.sanitizedValue;
    }
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
}
function createRateLimit(config) {
  const attempts = /* @__PURE__ */ new Map();
  return {
    async checkLimit(key) {
      const now = Date.now();
      now - config.windowMs;
      for (const [k, v] of attempts.entries()) {
        if (v.resetTime < now) {
          attempts.delete(k);
        }
      }
      const current = attempts.get(key) || {
        count: 0,
        resetTime: now + config.windowMs
      };
      if (current.count >= config.maxRequests && current.resetTime > now) {
        return {
          allowed: false,
          remainingRequests: 0,
          resetTime: current.resetTime
        };
      }
      if (current.resetTime <= now) {
        current.count = 1;
        current.resetTime = now + config.windowMs;
      } else {
        current.count++;
      }
      attempts.set(key, current);
      return {
        allowed: true,
        remainingRequests: Math.max(0, config.maxRequests - current.count),
        resetTime: current.resetTime
      };
    },
    async clearLimit(key) {
      attempts.delete(key);
    }
  };
}
var VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[\+]?[1-9]?[\d\s\-\(\)]{7,15}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  url: /^https?:\/\/(?:[-\w.])+(?::[0-9]+)?(?:\/(?:[\w/_.])*(?:\?(?:[\w&%=.]*))?(?:#(?:\w*))?)?$/
};
var PLUGIN_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s-()]+$/,
  url: /^https?:\/\/[^\s]+$/
};
var COMMON_SCHEMAS = {
  login: {
    email: { type: "email", required: true, maxLength: 255 },
    password: {
      type: "password",
      required: true,
      minLength: 8,
      maxLength: 128
    }
  },
  registration: {
    email: { type: "email", required: true, maxLength: 255 },
    password: {
      type: "password",
      required: true,
      minLength: 8,
      maxLength: 128
    },
    name: { type: "text", required: true, minLength: 2, maxLength: 100 },
    phone: { type: "phone", required: false, maxLength: 20 }
  },
  profile: {
    name: { type: "text", required: true, minLength: 2, maxLength: 100 },
    phone: { type: "phone", required: false, maxLength: 20 },
    address: { type: "text", required: false, maxLength: 500 }
  }
};

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
var isInitialized = false;
function initializeOTEL(serviceName) {
  if (isInitialized) {
    console.warn("OpenTelemetry already initialized");
    return;
  }
  const otelEndpoint = process.env["NEXT_PUBLIC_OTEL_ENDPOINT"];
  if (!otelEndpoint) {
    console.log("OpenTelemetry endpoint not configured, skipping initialization");
    return;
  }
  try {
    const resource = resources.Resource.default().merge(
      new resources.Resource({
        [semanticConventions.ATTR_SERVICE_NAME]: serviceName,
        [semanticConventions.ATTR_SERVICE_VERSION]: process.env.npm_package_version || "1.0.0",
        [semanticConventions.ATTR_DEPLOYMENT_ENVIRONMENT]: process.env["NODE_ENV"] || "development"
      })
    );
    const traceExporter = new exporterTraceOtlpHttp.OTLPTraceExporter({
      url: `${otelEndpoint}/v1/traces`,
      headers: {}
    });
    const metricExporter = new exporterMetricsOtlpHttp.OTLPMetricExporter({
      url: `${otelEndpoint}/v1/metrics`,
      headers: {}
    });
    const sdk = new sdkNode.NodeSDK({
      resource,
      traceExporter,
      metricReader: new sdkMetrics.PeriodicExportingMetricReader({
        exporter: metricExporter,
        exportIntervalMillis: 1e4
        // Export metrics every 10 seconds
      }),
      instrumentations: [
        autoInstrumentationsNode.getNodeAutoInstrumentations({
          "@opentelemetry/instrumentation-fs": {
            enabled: false
            // Disable fs instrumentation to reduce noise
          }
        })
      ]
    });
    sdk.start();
    isInitialized = true;
    console.log(`\u2705 OpenTelemetry initialized for ${serviceName}`);
    console.log(`   Endpoint: ${otelEndpoint}`);
    console.log(`   Environment: ${process.env["NODE_ENV"]}`);
    const gracefulShutdown = () => {
      sdk.shutdown().then(() => console.log("OpenTelemetry terminated")).catch((error2) => console.error("Error terminating OpenTelemetry", error2)).finally(() => process.exit(0));
    };
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error2) {
    console.error("Failed to initialize OpenTelemetry:", error2);
  }
}
function createSpan(name, attributes) {
  return {
    end: () => {
    },
    setAttribute: (key, value) => {
    },
    setStatus: (status) => {
    }
  };
}
function recordMetric(name, value, attributes) {
  if (process.env["NODE_ENV"] === "development") {
    console.log(`Metric: ${name} = ${value}`, attributes);
  }
}
var performance2 = {
  /**
   * Measure function execution time
   */
  measureTime: async (name, fn) => {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      recordMetric(`${name}.duration`, duration);
      return result;
    } catch (error2) {
      const duration = Date.now() - start;
      recordMetric(`${name}.duration`, duration, { error: true });
      throw error2;
    }
  },
  /**
   * Track page load performance
   */
  trackPageLoad: (pathname) => {
    if (typeof window !== "undefined" && window.performance) {
      const navigation = window.performance.getEntriesByType(
        "navigation"
      )[0];
      if (navigation) {
        recordMetric("page.load.time", navigation.loadEventEnd - navigation.fetchStart, {
          pathname,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          domInteractive: navigation.domInteractive - navigation.fetchStart
        });
      }
    }
  },
  /**
   * Track API call performance
   */
  trackAPICall: (endpoint, method, duration, status) => {
    recordMetric("api.call.duration", duration, {
      endpoint,
      method,
      status,
      success: status >= 200 && status < 300
    });
  }
};
function useNonce() {
  if (typeof window === "undefined") {
    return "";
  }
  const meta = document.querySelector('meta[name="csp-nonce"]');
  return meta?.getAttribute("content") || "";
}
function NonceScript({
  children,
  nonce,
  ...props
}) {
  const currentNonce = nonce || useNonce();
  if (props.src) {
    return /* @__PURE__ */ jsxRuntime.jsx(Script__default.default, { nonce: currentNonce, ...props });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    "script",
    {
      nonce: currentNonce,
      dangerouslySetInnerHTML: {
        __html: children
      },
      ...props
    }
  );
}
function NonceProvider({ children, nonce }) {
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    nonce && /* @__PURE__ */ jsxRuntime.jsx("meta", { name: "csp-nonce", content: nonce }),
    children
  ] });
}
var StandardErrorBoundary = class extends React6.Component {
  constructor(props) {
    super(props);
    this.retryTimeoutId = null;
    this.handleRetry = () => {
      const { maxRetries = 3 } = this.props;
      const { retryCount } = this.state;
      if (retryCount >= maxRetries) {
        return;
      }
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorId: null,
        retryCount: prevState.retryCount + 1
      }));
      this.retryTimeoutId = setTimeout(() => {
        this.forceUpdate();
      }, 100);
    };
    this.handleClearError = () => {
      this.setState({
        hasError: false,
        error: null,
        errorId: null,
        retryCount: 0
      });
    };
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
      retryCount: 0
    };
  }
  static getDerivedStateFromError(error2) {
    const ispError = classifyError(error2, "Error Boundary");
    return {
      hasError: true,
      error: ispError,
      errorId: ispError.id
    };
  }
  componentDidCatch(error2, errorInfo) {
    const { onError, context } = this.props;
    const ispError = classifyError(error2, context || "Error Boundary");
    logError(ispError, {
      url: typeof window !== "undefined" ? window.location.href : "Unknown",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown"
    });
    onError?.(ispError, errorInfo);
    this.setState({
      error: ispError,
      errorId: ispError.id
    });
  }
  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }
  render() {
    const { hasError, error: error2, errorId, retryCount } = this.state;
    const {
      children,
      fallback: CustomFallback,
      enableRetry = true,
      maxRetries = 3,
      level = "component"
    } = this.props;
    if (hasError && error2 && errorId) {
      const hasReachedMaxRetries = retryCount >= maxRetries;
      const fallbackProps = {
        error: error2,
        errorId,
        retryCount,
        onRetry: this.handleRetry,
        onClearError: this.handleClearError,
        level,
        hasReachedMaxRetries
      };
      if (CustomFallback) {
        return /* @__PURE__ */ jsxRuntime.jsx(CustomFallback, { ...fallbackProps });
      }
      switch (level) {
        case "application":
          return /* @__PURE__ */ jsxRuntime.jsx(ApplicationErrorFallback, { ...fallbackProps });
        case "widget":
          return /* @__PURE__ */ jsxRuntime.jsx(WidgetErrorFallback, { ...fallbackProps });
        default:
          return /* @__PURE__ */ jsxRuntime.jsx(ComponentErrorFallback, { ...fallbackProps });
      }
    }
    return children;
  }
};
var ApplicationErrorFallback = ({
  error: error2,
  errorId,
  onRetry,
  hasReachedMaxRetries
}) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 p-4", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "max-w-md w-full bg-white rounded-lg shadow-lg p-6", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-center", children: [
  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4", children: /* @__PURE__ */ jsxRuntime.jsx(
    "svg",
    {
      className: "h-6 w-6 text-red-600",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
        }
      )
    }
  ) }),
  /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Application Error" }),
  /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-gray-600 mb-4", children: error2.userMessage }),
  /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-sm text-gray-500 mb-6", children: [
    "Error ID: ",
    errorId
  ] }),
  /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
    !hasReachedMaxRetries && /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        onClick: onRetry,
        className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
        children: "Try Again"
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        onClick: () => window.location.reload(),
        className: "px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500",
        children: "Reload Page"
      }
    )
  ] })
] }) }) });
var ComponentErrorFallback = ({
  error: error2,
  errorId,
  onRetry,
  onClearError,
  hasReachedMaxRetries
}) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: "border border-red-200 rounded-md bg-red-50 p-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex", children: [
  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntime.jsx("svg", { className: "h-5 w-5 text-red-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntime.jsx(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
    }
  ) }) }),
  /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ml-3", children: [
    /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-sm font-medium text-red-800", children: "Component Error" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-red-700 mt-1", children: error2.userMessage }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-xs text-red-600 mt-1", children: [
      "ID: ",
      errorId
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-3 flex gap-2", children: [
      !hasReachedMaxRetries && /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          onClick: onRetry,
          className: "text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 focus:outline-none focus:ring-1 focus:ring-red-500",
          children: "Retry"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          onClick: onClearError,
          className: "text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500",
          children: "Dismiss"
        }
      )
    ] })
  ] })
] }) });
var WidgetErrorFallback = ({
  error: error2,
  onRetry,
  hasReachedMaxRetries
}) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-center p-2 text-sm text-gray-500 bg-gray-50 border rounded", children: [
  /* @__PURE__ */ jsxRuntime.jsx(
    "svg",
    {
      className: "h-4 w-4 mr-2 text-gray-400",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
        }
      )
    }
  ),
  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex-1", children: "Unable to load" }),
  !hasReachedMaxRetries && /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      onClick: onRetry,
      className: "ml-2 text-blue-600 hover:text-blue-800 focus:outline-none",
      children: "Retry"
    }
  )
] });
function withErrorBoundary2(Component2, errorBoundaryProps) {
  const WrappedComponent = (props) => /* @__PURE__ */ jsxRuntime.jsx(StandardErrorBoundary, { ...errorBoundaryProps, children: /* @__PURE__ */ jsxRuntime.jsx(Component2, { ...props }) });
  WrappedComponent.displayName = `withErrorBoundary(${Component2.displayName || Component2.name})`;
  return WrappedComponent;
}
function useErrorBoundary2() {
  const [error2, setError] = React6__namespace.default.useState(null);
  const captureError = React6__namespace.default.useCallback((error3) => {
    setError(error3);
  }, []);
  const clearError = React6__namespace.default.useCallback(() => {
    setError(null);
  }, []);
  if (error2) {
    throw error2;
  }
  return { captureError, clearError };
}
var ErrorHandlingContext = React6.createContext(null);
function ErrorHandlingProvider({
  children,
  initialConfig = {},
  onError,
  enableTelemetry = true,
  telemetryEndpoint = "/api/telemetry/errors"
}) {
  const [config, setConfig] = React6.useState({
    ...DEFAULT_ERROR_CONFIG,
    ...initialConfig
  });
  const [globalErrors, setGlobalErrors] = React6.useState([]);
  const { currentTenant } = useISPTenant();
  const { showError } = useNotifications();
  const errorStats = React6__namespace.default.useMemo(() => {
    const stats = {
      totalErrors: globalErrors.length,
      criticalErrors: 0,
      networkErrors: 0,
      authErrors: 0
    };
    globalErrors.forEach((error2) => {
      if (error2.severity === "critical") stats.criticalErrors++;
      if (error2.category === "network") stats.networkErrors++;
      if (error2.category === "authentication" || error2.category === "authorization")
        stats.authErrors++;
    });
    return stats;
  }, [globalErrors]);
  React6.useEffect(() => {
    configureGlobalErrorHandling(config);
  }, [config]);
  React6.useEffect(() => {
    const logger = (logEntry) => {
      setGlobalErrors((prev) => {
        const newErrors = [logEntry.error, ...prev.slice(0, 49)];
        return newErrors;
      });
      if (enableTelemetry && telemetryEndpoint) {
        sendToTelemetry(logEntry).catch((telemetryError) => {
          console.warn("Failed to send error telemetry:", telemetryError);
        });
      }
      onError?.(logEntry.error, logEntry);
      if (logEntry.error.severity === "critical" && config.enableUserNotifications) {
        showError(`Critical error: ${logEntry.error.userMessage}`, {
          persistent: true,
          actions: logEntry.error.retryable ? [
            {
              label: "Report Issue",
              action: () => reportIssue(logEntry.error)
            }
          ] : void 0
        });
      }
    };
    setErrorLogger(logger);
    return () => {
      setErrorLogger(() => {
      });
    };
  }, [config, enableTelemetry, telemetryEndpoint, onError, showError]);
  const sendToTelemetry = async (logEntry) => {
    if (!telemetryEndpoint) return;
    try {
      await fetch(telemetryEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...currentTenant && { "X-Tenant-ID": currentTenant.id }
        },
        body: JSON.stringify({
          ...logEntry,
          tenantId: currentTenant?.id,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          version: typeof window !== "undefined" ? window.__APP_VERSION__ : "unknown"
        })
      });
    } catch (telemetryError) {
      console.debug("Telemetry error:", telemetryError);
    }
  };
  const reportIssue = async (error2) => {
    try {
      await fetch("/api/support/report-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...currentTenant && { "X-Tenant-ID": currentTenant.id }
        },
        body: JSON.stringify({
          errorId: error2.id,
          correlationId: error2.correlationId,
          userMessage: "Automatically reported critical error",
          context: error2.context,
          technicalDetails: error2.technicalDetails
        })
      });
      showError("Issue reported successfully. Our team will investigate.", {
        type: "success"
      });
    } catch (reportError2) {
      showError("Failed to report issue. Please contact support directly.");
    }
  };
  const updateConfig = React6.useCallback((newConfig) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);
  const reportError = React6.useCallback(
    (error2, context) => {
      logError(error2, {
        tenantId: currentTenant?.id,
        userId: typeof window !== "undefined" ? window.sessionStorage.getItem("userId") || void 0 : void 0,
        sessionId: typeof window !== "undefined" ? window.sessionStorage.getItem("sessionId") || void 0 : void 0
      });
      if (context) {
        console.group(`\u{1F534} Error in ${context}`);
        console.error("Error details:", error2);
        console.error("User message:", error2.userMessage);
        console.error("Technical details:", error2.technicalDetails);
        console.groupEnd();
      }
    },
    [currentTenant]
  );
  const clearGlobalErrors = React6.useCallback(() => {
    setGlobalErrors([]);
  }, []);
  const contextValue = {
    config,
    updateConfig,
    reportError,
    clearGlobalErrors,
    globalErrors,
    errorStats
  };
  return /* @__PURE__ */ jsxRuntime.jsx(ErrorHandlingContext.Provider, { value: contextValue, children });
}
function useErrorHandling() {
  const context = React6.useContext(ErrorHandlingContext);
  if (!context) {
    throw new Error("useErrorHandling must be used within an ErrorHandlingProvider");
  }
  return context;
}
function useErrorReporting() {
  const { reportError } = useErrorHandling();
  return {
    reportError,
    reportApiError: (error2, endpoint) => {
      const ispError = ISPError.classifyError(error2, `API: ${endpoint}`);
      reportError(ispError, endpoint);
    },
    reportComponentError: (error2, componentName) => {
      const ispError = ISPError.classifyError(error2, `Component: ${componentName}`);
      reportError(ispError, componentName);
    },
    reportBusinessError: (message, context, details) => {
      const ispError = new ISPError({
        message,
        category: "business",
        severity: "medium",
        context,
        retryable: false,
        technicalDetails: details
      });
      reportError(ispError, context);
    }
  };
}
function ErrorDevOverlay() {
  const { globalErrors, errorStats, clearGlobalErrors } = useErrorHandling();
  const [isVisible, setIsVisible] = React6.useState(false);
  if (process.env["NODE_ENV"] !== "development") {
    return null;
  }
  if (!isVisible && globalErrors.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "fixed bottom-4 right-4 z-50", children: [
    !isVisible && globalErrors.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        onClick: () => setIsVisible(true),
        className: "bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors",
        children: [
          "\u{1F534} ",
          errorStats.totalErrors,
          " Error",
          errorStats.totalErrors !== 1 ? "s" : "",
          errorStats.criticalErrors > 0 && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "ml-1 bg-red-800 px-1 rounded text-xs", children: [
            errorStats.criticalErrors,
            " Critical"
          ] })
        ]
      }
    ),
    isVisible && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "bg-white border border-red-200 rounded-lg shadow-xl max-w-md w-96 max-h-96 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between p-3 bg-red-50 border-b", children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "font-semibold text-red-800", children: "Recent Errors" }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: clearGlobalErrors,
              className: "text-xs text-red-600 hover:text-red-800",
              children: "Clear"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: () => setIsVisible(false),
              className: "text-red-600 hover:text-red-800",
              children: "\u2715"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "overflow-y-auto max-h-80 p-2", children: globalErrors.map((error2, index) => /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          className: "mb-2 p-2 bg-gray-50 rounded border text-xs",
          children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  className: `px-1 rounded text-xs font-medium ${error2.severity === "critical" ? "bg-red-100 text-red-800" : error2.severity === "high" ? "bg-orange-100 text-orange-800" : error2.severity === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`,
                  children: error2.severity
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-gray-500", children: new Date(error2.timestamp).toLocaleTimeString() })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-medium text-gray-900 mb-1", children: error2.message }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-gray-600", children: error2.context }),
            error2.userMessage && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-blue-600 mt-1", children: [
              "User: ",
              error2.userMessage
            ] })
          ]
        },
        `${error2.id}-${index}`
      )) })
    ] })
  ] });
}

// src/management/types.ts
var EntityStatus = /* @__PURE__ */ ((EntityStatus2) => {
  EntityStatus2["ACTIVE"] = "active";
  EntityStatus2["INACTIVE"] = "inactive";
  EntityStatus2["PENDING"] = "pending";
  EntityStatus2["SUSPENDED"] = "suspended";
  EntityStatus2["DELETED"] = "deleted";
  return EntityStatus2;
})(EntityStatus || {});
var EntityType = /* @__PURE__ */ ((EntityType3) => {
  EntityType3["TENANT"] = "tenant";
  EntityType3["CUSTOMER"] = "customer";
  EntityType3["USER"] = "user";
  EntityType3["SERVICE"] = "service";
  EntityType3["RESELLER"] = "reseller";
  EntityType3["PARTNER"] = "partner";
  return EntityType3;
})(EntityType || {});
var BillingCycle = /* @__PURE__ */ ((BillingCycle2) => {
  BillingCycle2["MONTHLY"] = "monthly";
  BillingCycle2["QUARTERLY"] = "quarterly";
  BillingCycle2["ANNUALLY"] = "annually";
  return BillingCycle2;
})(BillingCycle || {});
var InvoiceStatus = /* @__PURE__ */ ((InvoiceStatus2) => {
  InvoiceStatus2["DRAFT"] = "draft";
  InvoiceStatus2["SENT"] = "sent";
  InvoiceStatus2["PAID"] = "paid";
  InvoiceStatus2["OVERDUE"] = "overdue";
  InvoiceStatus2["CANCELLED"] = "cancelled";
  return InvoiceStatus2;
})(InvoiceStatus || {});
var PaymentStatus = /* @__PURE__ */ ((PaymentStatus2) => {
  PaymentStatus2["PENDING"] = "pending";
  PaymentStatus2["COMPLETED"] = "completed";
  PaymentStatus2["FAILED"] = "failed";
  PaymentStatus2["REFUNDED"] = "refunded";
  PaymentStatus2["CANCELLED"] = "cancelled";
  return PaymentStatus2;
})(PaymentStatus || {});
var PaymentMethod = /* @__PURE__ */ ((PaymentMethod2) => {
  PaymentMethod2["CREDIT_CARD"] = "credit_card";
  PaymentMethod2["BANK_TRANSFER"] = "bank_transfer";
  PaymentMethod2["ACH"] = "ach";
  PaymentMethod2["WIRE"] = "wire";
  PaymentMethod2["CHECK"] = "check";
  PaymentMethod2["CASH"] = "cash";
  return PaymentMethod2;
})(PaymentMethod || {});
var ReportType = /* @__PURE__ */ ((ReportType4) => {
  ReportType4["FINANCIAL"] = "financial";
  ReportType4["USAGE"] = "usage";
  ReportType4["OPERATIONAL"] = "operational";
  ReportType4["COMPLIANCE"] = "compliance";
  ReportType4["EXECUTIVE"] = "executive";
  ReportType4["CUSTOM"] = "custom";
  return ReportType4;
})(ReportType || {});
var ReportFormat = /* @__PURE__ */ ((ReportFormat2) => {
  ReportFormat2["JSON"] = "json";
  ReportFormat2["CSV"] = "csv";
  ReportFormat2["PDF"] = "pdf";
  ReportFormat2["EXCEL"] = "excel";
  return ReportFormat2;
})(ReportFormat || {});
var ReportStatus = /* @__PURE__ */ ((ReportStatus2) => {
  ReportStatus2["QUEUED"] = "queued";
  ReportStatus2["PROCESSING"] = "processing";
  ReportStatus2["COMPLETED"] = "completed";
  ReportStatus2["FAILED"] = "failed";
  ReportStatus2["EXPIRED"] = "expired";
  return ReportStatus2;
})(ReportStatus || {});
var ServiceType = /* @__PURE__ */ ((ServiceType2) => {
  ServiceType2["INTERNET"] = "internet";
  ServiceType2["VOICE"] = "voice";
  ServiceType2["TV"] = "tv";
  ServiceType2["CLOUD_STORAGE"] = "cloud_storage";
  ServiceType2["EMAIL"] = "email";
  ServiceType2["SECURITY"] = "security";
  ServiceType2["SUPPORT"] = "support";
  ServiceType2["CUSTOM"] = "custom";
  return ServiceType2;
})(ServiceType || {});
var PricingModel = /* @__PURE__ */ ((PricingModel2) => {
  PricingModel2["FIXED"] = "fixed";
  PricingModel2["TIERED"] = "tiered";
  PricingModel2["USAGE_BASED"] = "usage_based";
  PricingModel2["HYBRID"] = "hybrid";
  return PricingModel2;
})(PricingModel || {});

// src/management/ManagementApiClient.ts
var ManagementApiClient = class extends BaseApiClient {
  constructor(config) {
    super(config.baseURL, {}, "ManagementAPI");
    this.apiConfig = {
      base_url: config.baseURL,
      timeout_ms: 3e4,
      retry_attempts: 3,
      retry_delay_ms: 1e3,
      rate_limit_requests: 100,
      rate_limit_window_ms: 6e4,
      auth_header_name: "Authorization",
      tenant_header_name: "X-Tenant-ID",
      request_id_header_name: "X-Request-ID",
      ...config.apiConfig
    };
    this.cacheConfig = {
      enabled: true,
      default_ttl_seconds: 300,
      max_entries: 1e3,
      cache_key_prefix: "mgmt_api",
      invalidation_patterns: ["create_*", "update_*", "delete_*"],
      ...config.cacheConfig
    };
    this.enableAuditLogging = config.enableAuditLogging ?? true;
    this.enablePerformanceMonitoring = config.enablePerformanceMonitoring ?? true;
    this.cache = /* @__PURE__ */ new Map();
    this.rateLimitTokens = this.apiConfig.rate_limit_requests;
    this.rateLimitLastRefill = Date.now();
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.setupInterceptors();
  }
  setupInterceptors() {
    if (this.enablePerformanceMonitoring) {
      this.setupPerformanceMonitoring();
    }
    if (this.enableAuditLogging) {
      this.setupAuditLogging();
    }
  }
  setupPerformanceMonitoring() {
    const originalRequest = this.request.bind(this);
    this.request = async function(method, endpoint, data, config) {
      const startTime = performance.now();
      try {
        const result = await originalRequest(method, endpoint, data, config);
        const duration = performance.now() - startTime;
        this.logPerformanceMetric(method, endpoint, duration, "success");
        return result;
      } catch (error2) {
        const duration = performance.now() - startTime;
        this.logPerformanceMetric(method, endpoint, duration, "error");
        throw error2;
      }
    }.bind(this);
  }
  logPerformanceMetric(method, endpoint, duration, status) {
    const metric = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      method,
      endpoint,
      duration_ms: Math.round(duration),
      status
    };
    if (typeof window !== "undefined" && "performanceMonitor" in window) {
      window.performanceMonitor.track("api_request", metric);
    }
  }
  setupAuditLogging() {
    const originalRequest = this.request.bind(this);
    this.request = async function(method, endpoint, data, config) {
      const requestContext = this.createRequestContext(method, endpoint);
      const auditConfig = {
        ...config,
        headers: {
          ...config?.headers,
          [this.apiConfig.request_id_header_name]: requestContext.request_id,
          "X-Audit-Context": JSON.stringify(requestContext)
        }
      };
      try {
        const result = await originalRequest(method, endpoint, data, auditConfig);
        this.logAuditEvent("api_request", "success", requestContext, {
          method,
          endpoint,
          data
        });
        return result;
      } catch (error2) {
        this.logAuditEvent("api_request", "error", requestContext, {
          method,
          endpoint,
          data,
          error: error2.message
        });
        throw error2;
      }
    }.bind(this);
  }
  createRequestContext(method, endpoint) {
    return {
      request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: this.getCurrentUserId(),
      tenant_id: this.getCurrentTenantId(),
      portal_type: this.getPortalType(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      correlation_id: this.generateCorrelationId()
    };
  }
  getCurrentUserId() {
    return typeof window !== "undefined" ? localStorage.getItem("user_id") || void 0 : void 0;
  }
  getCurrentTenantId() {
    return typeof window !== "undefined" ? localStorage.getItem("tenant_id") || void 0 : void 0;
  }
  getPortalType() {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname.includes("admin")) return "admin";
      if (hostname.includes("reseller")) return "reseller";
      if (hostname.includes("management")) return "management";
      return "unknown";
    }
    return "server";
  }
  generateCorrelationId() {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  logAuditEvent(type, status, context, data) {
    if (this.enableAuditLogging) {
      console.debug("[Audit]", { type, status, context, data });
    }
  }
  // ===== RATE LIMITING =====
  async checkRateLimit() {
    const now = Date.now();
    const timePassed = now - this.rateLimitLastRefill;
    if (timePassed >= this.apiConfig.rate_limit_window_ms) {
      this.rateLimitTokens = this.apiConfig.rate_limit_requests;
      this.rateLimitLastRefill = now;
    }
    if (this.rateLimitTokens <= 0) {
      return new Promise((resolve) => {
        this.requestQueue.push(resolve);
        this.processQueue();
      });
    }
    this.rateLimitTokens--;
  }
  processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;
    this.isProcessingQueue = true;
    const processNext = () => {
      if (this.requestQueue.length === 0) {
        this.isProcessingQueue = false;
        return;
      }
      if (this.rateLimitTokens > 0) {
        const nextRequest = this.requestQueue.shift();
        if (nextRequest) {
          this.rateLimitTokens--;
          nextRequest();
        }
      }
      setTimeout(processNext, 100);
    };
    setTimeout(processNext, 0);
  }
  // ===== CACHING =====
  getCacheKey(method, endpoint, params) {
    const key = `${this.cacheConfig.cache_key_prefix}:${method}:${endpoint}`;
    if (params) {
      const paramString = JSON.stringify(params);
      return `${key}:${btoa(paramString)}`;
    }
    return key;
  }
  getFromCache(key) {
    if (!this.cacheConfig.enabled) return null;
    const entry = this.cache.get(key);
    if (!entry) return null;
    const now = Date.now();
    const expirationTime = entry.timestamp + entry.ttl_seconds * 1e3;
    if (now > expirationTime) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }
  setCache(key, data, ttl) {
    if (!this.cacheConfig.enabled) return;
    if (this.cache.size >= this.cacheConfig.max_entries) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    const entry = {
      key,
      data,
      timestamp: Date.now(),
      ttl_seconds: ttl || this.cacheConfig.default_ttl_seconds
    };
    this.cache.set(key, entry);
  }
  invalidateCache(pattern) {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
  // ===== ENTITY MANAGEMENT OPERATIONS =====
  async listEntities(entityType, filters = {}) {
    await this.checkRateLimit();
    const cacheKey = this.getCacheKey("GET", `/entities/${entityType}`, filters);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;
    const config = { params: filters };
    const result = await this.get(`/api/v1/entities/${entityType}`, config);
    this.setCache(cacheKey, result);
    return result;
  }
  async getEntity(entityType, entityId) {
    await this.checkRateLimit();
    const cacheKey = this.getCacheKey("GET", `/entities/${entityType}/${entityId}`);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;
    const result = await this.get(`/api/v1/entities/${entityType}/${entityId}`);
    this.setCache(cacheKey, result);
    return result;
  }
  async createEntity(request) {
    await this.checkRateLimit();
    try {
      const result = await this.post("/api/v1/entities", request);
      this.invalidateCache(`entities/${request.entity_type}`);
      return result;
    } catch (error2) {
      return {
        success: false,
        error: error2.message,
        error_code: error2.code
      };
    }
  }
  async updateEntity(entityType, entityId, request) {
    await this.checkRateLimit();
    try {
      const result = await this.put(
        `/api/v1/entities/${entityType}/${entityId}`,
        request
      );
      this.invalidateCache(`entities/${entityType}`);
      this.cache.delete(this.getCacheKey("GET", `/entities/${entityType}/${entityId}`));
      return result;
    } catch (error2) {
      return {
        success: false,
        error: error2.message,
        error_code: error2.code
      };
    }
  }
  async deleteEntity(entityType, entityId) {
    await this.checkRateLimit();
    try {
      await this.delete(`/api/v1/entities/${entityType}/${entityId}`);
      this.invalidateCache(`entities/${entityType}`);
      this.cache.delete(this.getCacheKey("GET", `/entities/${entityType}/${entityId}`));
      return { success: true };
    } catch (error2) {
      return {
        success: false,
        error: error2.message,
        error_code: error2.code
      };
    }
  }
  // ===== BILLING OPERATIONS =====
  async getBillingData(entityId, period) {
    await this.checkRateLimit();
    const cacheKey = this.getCacheKey("GET", `/billing/${entityId}`, period);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;
    const config = { params: period };
    const result = await this.get(`/api/v1/billing/${entityId}`, config);
    this.setCache(cacheKey, result, 600);
    return result;
  }
  async processPayment(entityId, amount, paymentData) {
    await this.checkRateLimit();
    const result = await this.post(`/api/v1/billing/${entityId}/payments`, {
      amount,
      ...paymentData
    });
    this.invalidateCache(`billing/${entityId}`);
    return result;
  }
  async generateInvoice(entityId, services, options = {}) {
    await this.checkRateLimit();
    const result = await this.post(`/api/v1/billing/${entityId}/invoices`, {
      services,
      ...options
    });
    this.invalidateCache(`billing/${entityId}`);
    return result;
  }
  async getInvoices(entityId, filters = {}) {
    await this.checkRateLimit();
    const cacheKey = this.getCacheKey("GET", `/billing/${entityId}/invoices`, filters);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;
    const config = { params: filters };
    const result = await this.get(`/api/v1/billing/${entityId}/invoices`, config);
    this.setCache(cacheKey, result, 300);
    return result;
  }
  // ===== ANALYTICS OPERATIONS =====
  async getDashboardStats(timeframe, entityType) {
    await this.checkRateLimit();
    const cacheKey = this.getCacheKey("GET", "/analytics/dashboard", {
      timeframe,
      entityType
    });
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;
    const config = {
      params: { timeframe, entity_type: entityType }
    };
    const result = await this.get("/api/v1/analytics/dashboard", config);
    this.setCache(cacheKey, result, 600);
    return result;
  }
  async getUsageMetrics(entityId, period) {
    await this.checkRateLimit();
    const cacheKey = this.getCacheKey("GET", `/analytics/usage/${entityId}`, period);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;
    const config = { params: period };
    const result = await this.get(`/api/v1/analytics/usage/${entityId}`, config);
    this.setCache(cacheKey, result, 300);
    return result;
  }
  async generateReport(type, params) {
    await this.checkRateLimit();
    const result = await this.post("/api/v1/reports/generate", {
      type,
      parameters: params
    });
    return result;
  }
  async getReport(reportId) {
    await this.checkRateLimit();
    const cacheKey = this.getCacheKey("GET", `/reports/${reportId}`);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;
    const result = await this.get(`/api/v1/reports/${reportId}`);
    this.setCache(cacheKey, result, 3600);
    return result;
  }
  async downloadReport(reportId) {
    await this.checkRateLimit();
    const result = await this.get(`/api/v1/reports/${reportId}/download`, {
      headers: { Accept: "application/octet-stream" }
    });
    return result;
  }
  // ===== BATCH OPERATIONS =====
  async batchOperation(operations) {
    await this.checkRateLimit();
    const result = await this.post("/api/v1/batch", {
      operations
    });
    this.cache.clear();
    return result;
  }
  // ===== HEALTH AND MONITORING =====
  async getApiHealth() {
    return this.get("/api/v1/health");
  }
  async getApiMetrics() {
    return this.get("/api/v1/metrics");
  }
  // ===== CACHE MANAGEMENT =====
  clearCache() {
    this.cache.clear();
  }
  getCacheStats() {
    return {
      size: this.cache.size,
      max_size: this.cacheConfig.max_entries,
      hit_ratio: 0
      // Would need to implement hit counting
    };
  }
};
function useManagementOperations(config) {
  const [state, setState] = React6.useState({
    entities: {},
    billing: {},
    analytics: {
      dashboardStats: createInitialOperationState(),
      usageMetrics: createInitialOperationState(),
      reports: createInitialOperationState(),
      reportGeneration: createInitialOperationState()
    },
    globalLoading: false,
    globalError: null
  });
  const apiClientRef = React6.useRef(null);
  const subscriptionsRef = React6.useRef(/* @__PURE__ */ new Map());
  const operationQueueRef = React6.useRef([]);
  const autoRefreshTimerRef = React6.useRef(null);
  React6.useEffect(() => {
    apiClientRef.current = new ManagementApiClient(config.apiConfig);
    return () => {
      subscriptionsRef.current.forEach((unsubscribe) => unsubscribe());
      subscriptionsRef.current.clear();
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
      }
    };
  }, [config.apiConfig]);
  React6.useEffect(() => {
    if (config.autoRefreshInterval && config.autoRefreshInterval > 0) {
      autoRefreshTimerRef.current = setInterval(() => {
        refreshStaleData();
      }, config.autoRefreshInterval);
    }
    return () => {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
      }
    };
  }, [config.autoRefreshInterval]);
  function createInitialOperationState() {
    return {
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
      isStale: false
    };
  }
  function updateOperationState(path, updater) {
    setState((prev) => {
      const pathParts = path.split(".");
      const newState = { ...prev };
      let current = newState;
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current[pathParts[i]] = { ...current[pathParts[i]] };
        current = current[pathParts[i]];
      }
      const finalKey = pathParts[pathParts.length - 1];
      const currentState = current[finalKey] || createInitialOperationState();
      current[finalKey] = { ...currentState, ...updater(currentState) };
      return newState;
    });
  }
  function setGlobalState(updates) {
    setState((prev) => ({ ...prev, ...updates }));
  }
  async function executeWithStateManagement(operation, statePath, enableOptimistic = false) {
    try {
      updateOperationState(statePath, () => ({
        loading: true,
        error: null
      }));
      const result = await operation();
      updateOperationState(statePath, () => ({
        data: result,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
        isStale: false
      }));
      return result;
    } catch (error2) {
      updateOperationState(statePath, () => ({
        loading: false,
        error: error2.message || "Unknown error occurred"
      }));
      if (config.retryFailedOperations) {
        operationQueueRef.current.push(operation);
      }
      throw error2;
    }
  }
  async function refreshStaleData() {
    console.debug("Refreshing stale data...");
  }
  const listEntities = React6.useCallback(
    async (entityType, filters = {}) => {
      if (!apiClientRef.current) throw new Error("API client not initialized");
      const statePath = `entities.${entityType}.entities`;
      return executeWithStateManagement(
        () => apiClientRef.current.listEntities(entityType, filters),
        statePath
      );
    },
    []
  );
  const getEntity = React6.useCallback(
    async (entityType, entityId) => {
      if (!apiClientRef.current) throw new Error("API client not initialized");
      const statePath = `entities.${entityType}.selectedEntity`;
      return executeWithStateManagement(
        () => apiClientRef.current.getEntity(entityType, entityId),
        statePath
      );
    },
    []
  );
  const createEntity = React6.useCallback(
    async (request) => {
      if (!apiClientRef.current) throw new Error("API client not initialized");
      const statePath = `entities.${request.entity_type}.createOperation`;
      if (config.enableOptimisticUpdates) {
        const optimisticEntity = {
          id: `temp_${Date.now()}`,
          ...request.data,
          status: request.initial_status || "pending" /* PENDING */,
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        updateOperationState(statePath, () => ({
          data: optimisticEntity,
          loading: true,
          error: null
        }));
      }
      const result = await executeWithStateManagement(
        () => apiClientRef.current.createEntity(request),
        statePath,
        config.enableOptimisticUpdates
      );
      if (result.success) {
        listEntities(request.entity_type);
      }
      return result;
    },
    [config.enableOptimisticUpdates, listEntities]
  );
  const updateEntity = React6.useCallback(
    async (entityType, entityId, request) => {
      if (!apiClientRef.current) throw new Error("API client not initialized");
      const statePath = `entities.${entityType}.updateOperation`;
      if (config.enableOptimisticUpdates) {
        const currentEntity = state.entities[entityType]?.selectedEntity?.data;
        if (currentEntity) {
          const optimisticEntity = {
            ...currentEntity,
            ...request.data,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          };
          updateOperationState(`entities.${entityType}.selectedEntity`, () => ({
            data: optimisticEntity
          }));
        }
      }
      const result = await executeWithStateManagement(
        () => apiClientRef.current.updateEntity(entityType, entityId, request),
        statePath,
        config.enableOptimisticUpdates
      );
      if (result.success) {
        listEntities(entityType);
        getEntity(entityType, entityId);
      }
      return result;
    },
    [config.enableOptimisticUpdates, state.entities, listEntities, getEntity]
  );
  const deleteEntity = React6.useCallback(
    async (entityType, entityId) => {
      if (!apiClientRef.current) throw new Error("API client not initialized");
      const statePath = `entities.${entityType}.deleteOperation`;
      const result = await executeWithStateManagement(
        () => apiClientRef.current.deleteEntity(entityType, entityId),
        statePath
      );
      if (result.success) {
        listEntities(entityType);
      }
      return result;
    },
    [listEntities]
  );
  const getBillingData = React6.useCallback(
    async (entityId, period) => {
      if (!apiClientRef.current) throw new Error("API client not initialized");
      const statePath = `billing.${entityId}.billingData`;
      return executeWithStateManagement(
        () => apiClientRef.current.getBillingData(entityId, period),
        statePath
      );
    },
    []
  );
  const processPayment = React6.useCallback(
    async (entityId, amount, paymentData) => {
      if (!apiClientRef.current) throw new Error("API client not initialized");
      const statePath = `billing.${entityId}.paymentOperation`;
      return executeWithStateManagement(
        () => apiClientRef.current.processPayment(entityId, amount, paymentData),
        statePath
      );
    },
    []
  );
  const generateInvoice = React6.useCallback(
    async (entityId, services, options = {}) => {
      if (!apiClientRef.current) throw new Error("API client not initialized");
      const statePath = `billing.${entityId}.invoiceGeneration`;
      return executeWithStateManagement(
        () => apiClientRef.current.generateInvoice(entityId, services, options),
        statePath
      );
    },
    []
  );
  const getInvoices = React6.useCallback(
    async (entityId, filters = {}) => {
      if (!apiClientRef.current) throw new Error("API client not initialized");
      const statePath = `billing.${entityId}.invoices`;
      return executeWithStateManagement(
        () => apiClientRef.current.getInvoices(entityId, filters),
        statePath
      );
    },
    []
  );
  const getDashboardStats = React6.useCallback(
    async (timeframe, entityType) => {
      if (!apiClientRef.current) throw new Error("API client not initialized");
      const statePath = "analytics.dashboardStats";
      return executeWithStateManagement(
        () => apiClientRef.current.getDashboardStats(timeframe, entityType),
        statePath
      );
    },
    []
  );
  const getUsageMetrics = React6.useCallback(
    async (entityId, period) => {
      if (!apiClientRef.current) throw new Error("API client not initialized");
      const statePath = "analytics.usageMetrics";
      return executeWithStateManagement(
        () => apiClientRef.current.getUsageMetrics(entityId, period),
        statePath
      );
    },
    []
  );
  const generateReport = React6.useCallback(
    async (type, params) => {
      if (!apiClientRef.current) throw new Error("API client not initialized");
      const statePath = "analytics.reportGeneration";
      return executeWithStateManagement(
        () => apiClientRef.current.generateReport(type, params),
        statePath
      );
    },
    []
  );
  const getReport = React6.useCallback(async (reportId) => {
    if (!apiClientRef.current) throw new Error("API client not initialized");
    return apiClientRef.current.getReport(reportId);
  }, []);
  const downloadReport = React6.useCallback(async (reportId) => {
    if (!apiClientRef.current) throw new Error("API client not initialized");
    return apiClientRef.current.downloadReport(reportId);
  }, []);
  const batchOperation = React6.useCallback(
    async (operations) => {
      if (!apiClientRef.current) throw new Error("API client not initialized");
      setGlobalState({ globalLoading: true });
      try {
        const result = await apiClientRef.current.batchOperation(operations);
        setGlobalState({ globalLoading: false });
        return result;
      } catch (error2) {
        setGlobalState({ globalLoading: false, globalError: error2.message });
        throw error2;
      }
    },
    []
  );
  const refreshData = React6.useCallback(
    async (entityType, entityId) => {
      if (entityType) {
        await listEntities(entityType);
        if (entityId) {
          await getEntity(entityType, entityId);
        }
      } else {
        await refreshStaleData();
      }
    },
    [listEntities, getEntity]
  );
  const clearCache = React6.useCallback(() => {
    if (apiClientRef.current) {
      apiClientRef.current.clearCache();
    }
    setState({
      entities: {},
      billing: {},
      analytics: {
        dashboardStats: createInitialOperationState(),
        usageMetrics: createInitialOperationState(),
        reports: createInitialOperationState(),
        reportGeneration: createInitialOperationState()
      },
      globalLoading: false,
      globalError: null
    });
  }, []);
  const retryFailedOperation = React6.useCallback(async (operationId) => {
    if (operationQueueRef.current.length > 0) {
      const operation = operationQueueRef.current.shift();
      if (operation) {
        await operation();
      }
    }
  }, []);
  const subscribeToEntity = React6.useCallback((entityType, entityId) => {
    const subscriptionKey = `${entityType}:${entityId}`;
    const unsubscribe = () => {
      subscriptionsRef.current.delete(subscriptionKey);
    };
    subscriptionsRef.current.set(subscriptionKey, unsubscribe);
    return unsubscribe;
  }, []);
  const subscribeToEntityList = React6.useCallback(
    (entityType, filters) => {
      const subscriptionKey = `${entityType}:list`;
      const unsubscribe = () => {
        subscriptionsRef.current.delete(subscriptionKey);
      };
      subscriptionsRef.current.set(subscriptionKey, unsubscribe);
      return unsubscribe;
    },
    []
  );
  const isLoading = React6.useCallback(
    (operation) => {
      if (!operation) {
        return state.globalLoading;
      }
      const pathParts = operation.split(".");
      let current = state;
      for (const part of pathParts) {
        current = current[part];
        if (!current) return false;
      }
      return current.loading || false;
    },
    [state]
  );
  const hasError = React6.useCallback(
    (operation) => {
      if (!operation) {
        return !!state.globalError;
      }
      const pathParts = operation.split(".");
      let current = state;
      for (const part of pathParts) {
        current = current[part];
        if (!current) return false;
      }
      return !!current.error;
    },
    [state]
  );
  const getError = React6.useCallback(
    (operation) => {
      if (!operation) {
        return state.globalError;
      }
      const pathParts = operation.split(".");
      let current = state;
      for (const part of pathParts) {
        current = current[part];
        if (!current) return null;
      }
      return current.error || null;
    },
    [state]
  );
  const getCacheStats = React6.useCallback(() => {
    if (!apiClientRef.current) return null;
    return apiClientRef.current.getCacheStats();
  }, []);
  return React6.useMemo(
    () => ({
      state,
      listEntities,
      getEntity,
      createEntity,
      updateEntity,
      deleteEntity,
      getBillingData,
      processPayment,
      generateInvoice,
      getInvoices,
      getDashboardStats,
      getUsageMetrics,
      generateReport,
      getReport,
      downloadReport,
      batchOperation,
      refreshData,
      clearCache,
      retryFailedOperation,
      subscribeToEntity,
      subscribeToEntityList,
      isLoading,
      hasError,
      getError,
      getCacheStats
    }),
    [
      state,
      listEntities,
      getEntity,
      createEntity,
      updateEntity,
      deleteEntity,
      getBillingData,
      processPayment,
      generateInvoice,
      getInvoices,
      getDashboardStats,
      getUsageMetrics,
      generateReport,
      getReport,
      downloadReport,
      batchOperation,
      refreshData,
      clearCache,
      retryFailedOperation,
      subscribeToEntity,
      subscribeToEntityList,
      isLoading,
      hasError,
      getError,
      getCacheStats
    ]
  );
}
var ManagementContext = React6.createContext(null);
var ManagementErrorBoundary = class extends React6__namespace.default.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error2) {
    return { hasError: true, error: error2, errorInfo: null };
  }
  componentDidCatch(error2, errorInfo) {
    this.setState({ errorInfo });
    if (process.env["NODE_ENV"] === "development") {
      console.error("[ManagementProvider] Error caught:", error2, errorInfo);
    }
    if (this.props.onError) {
      this.props.onError(error2, errorInfo);
    }
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "management-error-boundary p-6 bg-red-50 border border-red-200 rounded-lg", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntime.jsx("svg", { className: "h-5 w-5 text-red-400", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            fillRule: "evenodd",
            d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
            clipRule: "evenodd"
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ml-3", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-sm font-medium text-red-800", children: "Management System Error" }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-2 text-sm text-red-700", children: /* @__PURE__ */ jsxRuntime.jsx("p", { children: "An error occurred in the management system. Please refresh the page or contact support if the problem persists." }) }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: () => window.location.reload(),
              className: "bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200",
              children: "Refresh Page"
            }
          ) }),
          process.env["NODE_ENV"] === "development" && /* @__PURE__ */ jsxRuntime.jsxs("details", { className: "mt-4", children: [
            /* @__PURE__ */ jsxRuntime.jsx("summary", { className: "cursor-pointer text-sm font-medium text-red-800", children: "Error Details (Development)" }),
            /* @__PURE__ */ jsxRuntime.jsx("pre", { className: "mt-2 text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto", children: this.state.error?.stack })
          ] })
        ] })
      ] }) });
    }
    return this.props.children;
  }
};
function getDefaultConfig(portalType, apiBaseUrl, initialConfig) {
  const baseApiConfig = {
    baseURL: apiBaseUrl,
    apiConfig: {
      base_url: apiBaseUrl,
      timeout_ms: 3e4,
      retry_attempts: 3,
      retry_delay_ms: 1e3,
      rate_limit_requests: portalType === "management-admin" ? 200 : 100,
      rate_limit_window_ms: 6e4,
      auth_header_name: "Authorization",
      tenant_header_name: "X-Tenant-ID",
      request_id_header_name: "X-Request-ID"
    },
    cacheConfig: {
      enabled: true,
      default_ttl_seconds: portalType === "management-admin" ? 300 : 600,
      max_entries: 1e3,
      cache_key_prefix: `${portalType}_mgmt`,
      invalidation_patterns: ["create_*", "update_*", "delete_*"]
    },
    enableAuditLogging: true,
    enablePerformanceMonitoring: true
  };
  return {
    apiConfig: baseApiConfig,
    enableOptimisticUpdates: portalType !== "management-admin",
    // More conservative for management
    enableRealTimeSync: true,
    autoRefreshInterval: portalType === "management-admin" ? 3e4 : 6e4,
    // More frequent for management
    retryFailedOperations: true,
    ...initialConfig
  };
}
function getPortalEntityTypes(portalType) {
  switch (portalType) {
    case "management-admin":
      return ["tenant" /* TENANT */, "reseller" /* RESELLER */, "partner" /* PARTNER */, "user" /* USER */];
    case "admin":
      return ["customer" /* CUSTOMER */, "user" /* USER */, "service" /* SERVICE */];
    case "reseller":
      return ["customer" /* CUSTOMER */, "service" /* SERVICE */];
    default:
      return [];
  }
}
function getPortalFeatures(portalType, customFeatures) {
  const defaultFeatures = {
    enableBatchOperations: portalType === "management-admin",
    enableRealTimeSync: true,
    enableAdvancedAnalytics: portalType !== "reseller",
    enableAuditLogging: true
  };
  return { ...defaultFeatures, ...customFeatures };
}
function ManagementProvider({
  children,
  portalType,
  apiBaseUrl,
  initialConfig,
  features: customFeatures,
  enablePerformanceMonitoring = true,
  enableErrorBoundary = true
}) {
  const [config, setConfig] = React6.useState(
    () => getDefaultConfig(portalType, apiBaseUrl, initialConfig)
  );
  const [isInitialized2, setIsInitialized] = React6.useState(false);
  const [performance3, setPerformance] = React6.useState({
    apiResponseTimes: {},
    cacheHitRatio: 0,
    errorRate: 0
  });
  const operations = useManagementOperations(config);
  const availableEntityTypes = React6.useMemo(() => getPortalEntityTypes(portalType), [portalType]);
  const features2 = React6.useMemo(
    () => getPortalFeatures(portalType, customFeatures),
    [portalType, customFeatures]
  );
  React6.useEffect(() => {
    const initializeSystem = async () => {
      try {
        if (features2.enableAdvancedAnalytics) {
          await operations.getDashboardStats("24h");
        }
        setIsInitialized(true);
      } catch (error2) {
        if (process.env["NODE_ENV"] === "development") {
          console.error("[ManagementProvider] Initialization failed:", error2);
        }
      }
    };
    initializeSystem();
  }, [operations, features2]);
  React6.useEffect(() => {
    if (!enablePerformanceMonitoring) return;
    const performanceMonitoringInterval = setInterval(() => {
      const cacheStats = operations.getCacheStats();
      setPerformance((prev) => ({
        ...prev,
        cacheHitRatio: cacheStats?.hit_ratio || 0
      }));
    }, 3e4);
    return () => clearInterval(performanceMonitoringInterval);
  }, [operations, enablePerformanceMonitoring]);
  const updateConfig = React6.useCallback((newConfig) => {
    setConfig((prev) => ({
      ...prev,
      ...newConfig,
      apiConfig: newConfig.apiConfig ? {
        ...prev.apiConfig,
        ...newConfig.apiConfig
      } : prev.apiConfig
    }));
  }, []);
  const resetConfiguration = React6.useCallback(() => {
    setConfig(getDefaultConfig(portalType, apiBaseUrl, initialConfig));
  }, [portalType, apiBaseUrl, initialConfig]);
  const handleError = React6.useCallback(
    (error2, errorInfo) => {
      if (enablePerformanceMonitoring) {
        setPerformance((prev) => ({
          ...prev,
          errorRate: prev.errorRate + 1
        }));
      }
    },
    [enablePerformanceMonitoring]
  );
  const contextValue = React6.useMemo(
    () => ({
      ...operations,
      config,
      isInitialized: isInitialized2,
      portalType,
      availableEntityTypes,
      features: features2,
      performance: performance3,
      updateConfig,
      resetConfiguration
    }),
    [
      operations,
      config,
      isInitialized2,
      portalType,
      availableEntityTypes,
      features2,
      performance3,
      updateConfig,
      resetConfiguration
    ]
  );
  const content = /* @__PURE__ */ jsxRuntime.jsx(ManagementContext.Provider, { value: contextValue, children });
  if (enableErrorBoundary) {
    return /* @__PURE__ */ jsxRuntime.jsx(ManagementErrorBoundary, { onError: handleError, children: content });
  }
  return content;
}
function useManagement() {
  const context = React6.useContext(ManagementContext);
  if (!context) {
    throw new Error("useManagement must be used within a ManagementProvider");
  }
  return context;
}
function useManagementEntity(entityType) {
  const {
    listEntities,
    getEntity,
    createEntity,
    updateEntity,
    deleteEntity,
    isLoading,
    hasError,
    getError
  } = useManagement();
  return {
    list: (filters) => listEntities(entityType, filters),
    get: (id) => getEntity(entityType, id),
    create: (data) => createEntity({ entity_type: entityType, data }),
    update: (id, data) => updateEntity(entityType, id, { data }),
    delete: (id) => deleteEntity(entityType, id),
    isLoading: (operation = "entities") => isLoading(`entities.${entityType}.${operation}`),
    hasError: (operation = "entities") => hasError(`entities.${entityType}.${operation}`),
    getError: (operation = "entities") => getError(`entities.${entityType}.${operation}`)
  };
}
function useManagementBilling(entityId) {
  const {
    getBillingData,
    processPayment,
    generateInvoice,
    getInvoices,
    isLoading,
    hasError,
    getError
  } = useManagement();
  return {
    getBillingData: (period) => getBillingData(entityId, period),
    processPayment: (amount, paymentData) => processPayment(entityId, amount, paymentData),
    generateInvoice: (services, options) => generateInvoice(entityId, services, options),
    getInvoices: (filters) => getInvoices(entityId, filters),
    isLoading: (operation = "billingData") => isLoading(`billing.${entityId}.${operation}`),
    hasError: (operation = "billingData") => hasError(`billing.${entityId}.${operation}`),
    getError: (operation = "billingData") => getError(`billing.${entityId}.${operation}`)
  };
}
function useManagementAnalytics() {
  const {
    getDashboardStats,
    getUsageMetrics,
    generateReport,
    getReport,
    downloadReport,
    isLoading,
    hasError,
    getError
  } = useManagement();
  return {
    getDashboardStats,
    getUsageMetrics,
    generateReport,
    getReport,
    downloadReport,
    isLoading: (operation = "dashboardStats") => isLoading(`analytics.${operation}`),
    hasError: (operation = "dashboardStats") => hasError(`analytics.${operation}`),
    getError: (operation = "dashboardStats") => getError(`analytics.${operation}`)
  };
}
function useManagementPerformance() {
  const { performance: performance3, getCacheStats } = useManagement();
  return {
    ...performance3,
    getCacheStats,
    getHealthStatus: () => ({
      healthy: performance3.errorRate < 0.1,
      cachePerformance: performance3.cacheHitRatio > 0.8 ? "good" : "poor",
      errorRate: performance3.errorRate
    })
  };
}
function useManagementConfig() {
  const { config, updateConfig, resetConfiguration, features: features2 } = useManagement();
  return {
    config,
    features: features2,
    updateConfig,
    resetConfiguration,
    updateApiConfig: (apiConfig) => {
      updateConfig({ apiConfig });
    },
    enableFeature: (feature) => {
      if (process.env["NODE_ENV"] === "development") {
        console.warn("Dynamic feature toggling not implemented");
      }
    }
  };
}
function UnifiedBillingExample({
  customerId,
  showAnalytics = true,
  showBulkOperations = false
}) {
  const { portalType, features: features2, isInitialized: isInitialized2 } = useManagement();
  const [selectedCustomerId, setSelectedCustomerId] = React6.useState(customerId);
  const customerEntity = useManagementEntity("customer" /* CUSTOMER */);
  const billingOps = useManagementBilling(selectedCustomerId || "");
  const analytics = useManagementAnalytics();
  React6.useEffect(() => {
    if (isInitialized2) {
      customerEntity.list({ limit: 10, status: ["active"] });
    }
  }, [isInitialized2]);
  React6.useEffect(() => {
    if (selectedCustomerId && isInitialized2) {
      billingOps.getBillingData({
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
        end_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      });
    }
  }, [selectedCustomerId, isInitialized2]);
  React6.useEffect(() => {
    if (showAnalytics && features2.enableAdvancedAnalytics && isInitialized2) {
      analytics.getDashboardStats("30d");
    }
  }, [showAnalytics, features2.enableAdvancedAnalytics, isInitialized2]);
  if (!isInitialized2) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "p-4", children: "Initializing management system..." });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Unified Billing Operations" }),
      /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "text-sm text-gray-600", children: [
        "Portal: ",
        portalType,
        " | Features:",
        " ",
        Object.entries(features2).filter(([_, enabled]) => enabled).map(([feature, _]) => feature).join(", ")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-6 p-4 bg-gray-50 rounded-lg", children: [
      /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "text-lg font-semibold mb-3", children: "Customer Selection" }),
      customerEntity.isLoading() ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-gray-500", children: "Loading customers..." }) : customerEntity.hasError() ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-red-500", children: [
        "Error: ",
        customerEntity.getError()?.message
      ] }) : /* @__PURE__ */ jsxRuntime.jsxs(
        "select",
        {
          value: selectedCustomerId || "",
          onChange: (e) => setSelectedCustomerId(e.target.value),
          className: "w-full p-2 border border-gray-300 rounded",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: "Select a customer..." }),
            /* @__PURE__ */ jsxRuntime.jsx("option", { value: "cust_001", children: "Customer 001 - John Doe" }),
            /* @__PURE__ */ jsxRuntime.jsx("option", { value: "cust_002", children: "Customer 002 - Jane Smith" }),
            /* @__PURE__ */ jsxRuntime.jsx("option", { value: "cust_003", children: "Customer 003 - Acme Corp" })
          ]
        }
      )
    ] }),
    selectedCustomerId && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-6 p-4 bg-blue-50 rounded-lg", children: [
      /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "text-lg font-semibold mb-3", children: "Billing Operations" }),
      billingOps.isLoading("billingData") ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-gray-500", children: "Loading billing data..." }) : billingOps.hasError("billingData") ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-red-500", children: [
        "Error: ",
        billingOps.getError("billingData")?.message
      ] }) : /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-3 bg-white rounded border", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-gray-600", children: "Outstanding Balance" }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xl font-bold text-red-600", children: "$1,234.56" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-3 bg-white rounded border", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-gray-600", children: "This Month" }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xl font-bold text-green-600", children: "$567.89" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-3 bg-white rounded border", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-gray-600", children: "Total Paid" }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xl font-bold text-blue-600", children: "$12,345.67" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: () => billingOps.generateInvoice([{ id: "svc_1", amount: 99.99 }]),
              disabled: billingOps.isLoading("generateInvoice"),
              className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50",
              children: "Generate Invoice"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: () => billingOps.processPayment(100, { method: "credit_card" }),
              disabled: billingOps.isLoading("processPayment"),
              className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50",
              children: "Process Payment"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: () => billingOps.getInvoices({ status: ["pending", "overdue"] }),
              disabled: billingOps.isLoading("getInvoices"),
              className: "px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50",
              children: "View Invoices"
            }
          )
        ] })
      ] })
    ] }),
    showAnalytics && features2.enableAdvancedAnalytics && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-6 p-4 bg-green-50 rounded-lg", children: [
      /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "text-lg font-semibold mb-3", children: "Analytics Dashboard" }),
      analytics.isLoading("dashboardStats") ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-gray-500", children: "Loading analytics..." }) : analytics.hasError("dashboardStats") ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-red-500", children: [
        "Error: ",
        analytics.getError("dashboardStats")?.message
      ] }) : /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-3 bg-white rounded border", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-gray-600", children: "Total Revenue" }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xl font-bold text-green-600", children: "$45,678.90" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-3 bg-white rounded border", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-gray-600", children: "Active Customers" }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xl font-bold text-blue-600", children: "1,234" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-3 bg-white rounded border", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-gray-600", children: "Conversion Rate" }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xl font-bold text-purple-600", children: "12.3%" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-3 bg-white rounded border", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-gray-600", children: "Churn Rate" }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xl font-bold text-red-600", children: "2.1%" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-4 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: () => analytics.generateReport("financial", { period: "30d" }),
            disabled: analytics.isLoading("generateReport"),
            className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50",
            children: "Generate Report"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: () => analytics.getUsageMetrics("30d"),
            disabled: analytics.isLoading("getUsageMetrics"),
            className: "px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50",
            children: "Usage Metrics"
          }
        )
      ] })
    ] }),
    showBulkOperations && features2.enableBatchOperations && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-4 bg-orange-50 rounded-lg", children: [
      /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "text-lg font-semibold mb-3", children: "Bulk Operations" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-600 mb-3", children: "Available for Management Admin portal with batch operations enabled" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("button", { className: "px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700", children: "Bulk Invoice Generation" }),
        /* @__PURE__ */ jsxRuntime.jsx("button", { className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700", children: "Bulk Payment Processing" }),
        /* @__PURE__ */ jsxRuntime.jsx("button", { className: "px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700", children: "Bulk Customer Import" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-6 p-4 bg-gray-100 rounded-lg", children: [
      /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "text-lg font-semibold mb-3", children: "Portal Configuration" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "Portal Type:" }),
          " ",
          portalType
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "Real-time Sync:" }),
          " ",
          features2.enableRealTimeSync ? "Enabled" : "Disabled"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "Advanced Analytics:" }),
          " ",
          features2.enableAdvancedAnalytics ? "Enabled" : "Disabled"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "Batch Operations:" }),
          " ",
          features2.enableBatchOperations ? "Enabled" : "Disabled"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "Audit Logging:" }),
          " ",
          features2.enableAuditLogging ? "Enabled" : "Disabled"
        ] })
      ] })
    ] })
  ] });
}

Object.defineProperty(exports, "QueryClient", {
  enumerable: true,
  get: function () { return reactQuery.QueryClient; }
});
Object.defineProperty(exports, "QueryClientProvider", {
  enumerable: true,
  get: function () { return reactQuery.QueryClientProvider; }
});
exports.AdminOnlyGuard = AdminOnlyGuard;
exports.AdminPortalAudit = AdminPortalAudit;
exports.ApiClient = ApiClient;
exports.AuditIntegrationWrapper = AuditIntegrationWrapper;
exports.AuditPresets = AuditPresets;
exports.AuditProvider = AuditProvider;
exports.BillingCycle = BillingCycle;
exports.BillingManagerGuard = BillingManagerGuard;
exports.COMMON_SCHEMAS = COMMON_SCHEMAS;
exports.CUSTOMER_PORTAL_TOKEN_KEY = CUSTOMER_PORTAL_TOKEN_KEY;
exports.ConfigProvider = ConfigProvider;
exports.CustomerOnlyGuard = CustomerOnlyGuard;
exports.CustomerPortalAudit = CustomerPortalAudit;
exports.DEFAULT_COMMISSION_TIERS = DEFAULT_COMMISSION_TIERS;
exports.DEFAULT_ERROR_CONFIG = DEFAULT_ERROR_CONFIG;
exports.DEFAULT_PORTAL_TOKEN_KEY = DEFAULT_PORTAL_TOKEN_KEY;
exports.EmptyStateFallback = EmptyStateFallback;
exports.EntityStatus = EntityStatus;
exports.EntityType = EntityType;
exports.ErrorBoundary = ErrorBoundary;
exports.ErrorDevOverlay = ErrorDevOverlay;
exports.ErrorHandlingProvider = ErrorHandlingProvider;
exports.FeatureGuard = FeatureGuard;
exports.GenericErrorFallback = GenericErrorFallback;
exports.ISPApiClient = ISPApiClient;
exports.ISPBusinessService = ISPBusinessService;
exports.ISPError = ISPError;
exports.ISPTenantProvider = ISPTenantProvider;
exports.InlineErrorFallback = InlineErrorFallback;
exports.InvoiceStatus = InvoiceStatus;
exports.LoadingErrorFallback = LoadingErrorFallback;
exports.MFASetup = MFASetup;
exports.MFAVerification = MFAVerification;
exports.MaintenanceFallback = MaintenanceFallback;
exports.ManagementApiClient = ManagementApiClient;
exports.ManagementPortalAudit = ManagementPortalAudit;
exports.ManagementProvider = ManagementProvider;
exports.NetworkEngineerGuard = NetworkEngineerGuard;
exports.NetworkErrorFallback = NetworkErrorFallback;
exports.NonceProvider = NonceProvider;
exports.NonceScript = NonceScript;
exports.NotificationContainer = NotificationContainer;
exports.NotificationProvider = NotificationProvider;
exports.PLUGIN_PATTERNS = PLUGIN_PATTERNS;
exports.PaymentMethod = PaymentMethod;
exports.PaymentStatus = PaymentStatus;
exports.PermissionGuard = PermissionGuard;
exports.PortalAuthError = PortalAuthError;
exports.PricingModel = PricingModel;
exports.RateLimiter = RateLimiter;
exports.RealTimeProvider = RealTimeProvider;
exports.RealTimeStatus = RealTimeStatus;
exports.ReportFormat = ReportFormat;
exports.ReportStatus = ReportStatus;
exports.ReportType = ReportType;
exports.ResellerOnlyGuard = ResellerOnlyGuard;
exports.ResellerPortalAudit = ResellerPortalAudit;
exports.RouteGuard = RouteGuard;
exports.ServiceType = ServiceType;
exports.StandardErrorBoundary = StandardErrorBoundary;
exports.SupportAgentGuard = SupportAgentGuard;
exports.TechnicianAppAudit = TechnicianAppAudit;
exports.ThemeProvider = ThemeProvider;
exports.UnauthorizedFallback = UnauthorizedFallback;
exports.UnifiedBillingExample = UnifiedBillingExample;
exports.VALIDATION_PATTERNS = VALIDATION_PATTERNS;
exports.adminTheme = adminTheme;
exports.buildPortalAuthHeaders = buildPortalAuthHeaders;
exports.calculateRetryAfter = calculateRetryAfter;
exports.calculateRetryDelay = calculateRetryDelay;
exports.checkApiHealth = checkApiHealth;
exports.classifyError = classifyError;
exports.clearOperatorAuthTokens = clearOperatorAuthTokens;
exports.commissionEngine = commissionEngine;
exports.configureISPErrorHandling = configureGlobalErrorHandling;
exports.configureStandardErrorHandling = configureGlobalErrorHandling2;
exports.createApiClient = createApiClient;
exports.createISPApiClient = createISPApiClient;
exports.createISPBusinessService = createISPBusinessService;
exports.createMockDataGuard = createMockDataGuard;
exports.createMockGenerator = createMockGenerator;
exports.createPortalAuthFetch = createPortalAuthFetch;
exports.createRateLimit = createRateLimit;
exports.createRateLimitMiddleware = createRateLimitMiddleware;
exports.createSpan = createSpan;
exports.csrfProtection = csrfProtection;
exports.customerTheme = customerTheme;
exports.deduplicateError = deduplicateError;
exports.defaultConfigs = defaultConfigs;
exports.defaultFrameworkConfig = defaultFrameworkConfig;
exports.defaultMockGuard = defaultMockGuard;
exports.defaultTheme = defaultTheme;
exports.devOnly = devOnly;
exports.escapeHTML = escapeHTML;
exports.extractNonce = extractNonce;
exports.generateCSP = generateCSP;
exports.generateCSPMeta = generateCSPMeta;
exports.generateNonce = generateNonce;
exports.getApiClient = getApiClient;
exports.getApiConfig = getApiConfig;
exports.getClientIdentifier = getClientIdentifier;
exports.getGlobalErrorConfig = getGlobalErrorConfig;
exports.getISPApiClient = getISPApiClient;
exports.getOperatorAccessToken = getOperatorAccessToken;
exports.getPartnerApiClient = getPartnerApiClient;
exports.getPortalAuthToken = getPortalAuthToken;
exports.initializeApi = initializeApi;
exports.initializeOTEL = initializeOTEL;
exports.inputSanitizer = inputSanitizer;
exports.isApiInitialized = isApiInitialized;
exports.isValidNonce = isValidNonce;
exports.ispApiClient = ispApiClient;
exports.logError = logError;
exports.mockApiWrapper = mockApiWrapper;
exports.mockData = mockData;
exports.partnerApiClient = getPartnerApiClient;
exports.partnerQueryKeys = partnerQueryKeys;
exports.performance = performance2;
exports.portalAuthFetch = portalAuthFetch;
exports.rateLimiter = rateLimiter;
exports.rateLimiters = rateLimiters;
exports.recordMetric = recordMetric;
exports.requireApiClient = requireApiClient;
exports.resellerTheme = resellerTheme;
exports.safeConsole = safeConsole;
exports.sanitizeEmail = sanitizeEmail;
exports.sanitizeHTML = sanitizeHTML;
exports.sanitizeInput = sanitizeInput2;
exports.sanitizeText = sanitizeText;
exports.sanitizeURL = sanitizeURL;
exports.secureStorage = secureStorage;
exports.setGlobalErrorHandler = setGlobalErrorHandler;
exports.setGlobalISPApiClient = setGlobalISPApiClient;
exports.setOperatorAccessToken = setOperatorAccessToken;
exports.shouldRetry = shouldRetry;
exports.territoryValidator = territoryValidator;
exports.testOnly = testOnly;
exports.themes = themes;
exports.tokenManager = tokenManager;
exports.useAdminBusiness = useAdminBusiness;
exports.useApiClient = useApiClient;
exports.useApiData = useApiData;
exports.useApiErrorNotifications = useApiErrorNotifications;
exports.useAppNotifications = useAppNotifications;
exports.useAppState = useAppState;
exports.useAppStore = useAppStore;
exports.useAsyncValidation = useAsyncValidation;
exports.useAudit = useAudit;
exports.useBilling = useBilling;
exports.useBorderRadius = useBorderRadius;
exports.useBrandingConfig = useBrandingConfig;
exports.useBreakpoints = useBreakpoints;
exports.useBusinessConfig = useBusinessConfig;
exports.useBusinessValidation = useBusinessValidation;
exports.useCSRFProtection = useCSRFProtection;
exports.useCachedData = useApiData;
exports.useColors = useColors;
exports.useCommunication = useCommunication;
exports.useConfig = useConfig;
exports.useCreateCustomer = useCreateCustomer;
exports.useCurrencyConfig = useCurrencyConfig;
exports.useCustomRouteProtection = useCustomRouteProtection;
exports.useCustomerActivity = useCustomerActivity;
exports.useCustomerBilling = useCustomerBilling;
exports.useCustomerBusiness = useCustomerBusiness;
exports.useCustomerDashboard = useCustomerDashboard;
exports.useCustomerDocuments = useCustomerDocuments;
exports.useCustomerServices = useCustomerServices;
exports.useCustomerSupportTickets = useCustomerSupportTickets;
exports.useCustomerUsage = useCustomerUsage;
exports.useDataLoadingErrorHandler = useDataLoadingErrorHandler;
exports.useDataTable = useDataTable;
exports.useErrorBoundary = useErrorBoundary2;
exports.useErrorBoundaryHook = useErrorBoundaryHook;
exports.useErrorHandling = useErrorHandling;
exports.useErrorNotifications = useErrorNotifications;
exports.useErrorReporting = useErrorReporting;
exports.useFeatureFlags = useFeatureFlags;
exports.useFieldOperations = useFieldOperations;
exports.useFilters = useFilters;
exports.useFormErrorHandler = useFormErrorHandler;
exports.useFormState = useFormState;
exports.useFormSubmission = useFormSubmission;
exports.useFormValidation = useFormValidation;
exports.useFormatting = useFormatting;
exports.useGlobalErrorListener = useGlobalErrorListener;
exports.useISPBusiness = useISPBusiness;
exports.useISPModules = useISPModules;
exports.useISPTenant = useISPTenant;
exports.useISPTenantProvider = useISPTenantProvider;
exports.useLegacyErrorBoundary = useErrorBoundary;
exports.useLegacyErrorHandler = useStandardErrorHandler;
exports.useLoading = useLoading;
exports.useLocaleConfig = useLocaleConfig;
exports.useManagement = useManagement;
exports.useManagementAnalytics = useManagementAnalytics;
exports.useManagementBilling = useManagementBilling;
exports.useManagementBusiness = useManagementBusiness;
exports.useManagementConfig = useManagementConfig;
exports.useManagementEntity = useManagementEntity;
exports.useManagementOperations = useManagementOperations;
exports.useManagementPerformance = useManagementPerformance;
exports.useMockData = useMockData;
exports.useNetworkMonitoring = useNetworkMonitoring;
exports.useNonce = useNonce;
exports.useNotificationStore = useNotificationStore;
exports.useNotifications = useNotifications;
exports.usePagination = usePagination;
exports.usePartnerAnalytics = usePartnerAnalytics;
exports.usePartnerCommissions = usePartnerCommissions;
exports.usePartnerCustomer = usePartnerCustomer;
exports.usePartnerCustomers = usePartnerCustomers;
exports.usePartnerDashboard = usePartnerDashboard;
exports.usePartnerDataWithErrorBoundary = usePartnerDataWithErrorBoundary;
exports.usePerformanceMonitoring = usePerformanceMonitoring;
exports.usePortalIdAuth = usePortalIdAuth;
exports.usePreferences = usePreferences;
exports.useProvisioning = useProvisioning;
exports.useRealTime = useRealTime;
exports.useRealtimeErrorHandler = useRealtimeErrorHandler;
exports.useResellerBusiness = useResellerBusiness;
exports.useRouteProtection = useRouteProtection;
exports.useSecureForm = useSecureForm;
exports.useSelection = useSelection;
exports.useShadows = useShadows;
exports.useSpacing = useSpacing;
exports.useStandardApiErrorHandler = useApiErrorHandler;
exports.useStandardErrorHandler = useStandardErrorHandler;
exports.useTechnicianBusiness = useTechnicianBusiness;
exports.useTenantStore = useTenantStore;
exports.useTheme = useTheme;
exports.useToast = useToast;
exports.useTypography = useTypography;
exports.useUI = useUI;
exports.useUpdateCustomer = useUpdateCustomer;
exports.useUploadErrorHandler = useUploadErrorHandler;
exports.useValidateTerritory = useValidateTerritory;
exports.useWebSocket = useWebSocket;
exports.validateFormData = validateFormData;
exports.validateInput = validateInput;
exports.withAudit = withAudit;
exports.withErrorBoundary = withErrorBoundary;
exports.withErrorFallback = withErrorFallback;
exports.withStandardErrorBoundary = withErrorBoundary2;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map