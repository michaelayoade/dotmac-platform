import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { ATTR_DEPLOYMENT_ENVIRONMENT, ATTR_SERVICE_VERSION, ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

// src/utils/telemetry.ts
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
    const resource = Resource.default().merge(
      new Resource({
        [ATTR_SERVICE_NAME]: serviceName,
        [ATTR_SERVICE_VERSION]: process.env.npm_package_version || "1.0.0",
        [ATTR_DEPLOYMENT_ENVIRONMENT]: process.env["NODE_ENV"] || "development"
      })
    );
    const traceExporter = new OTLPTraceExporter({
      url: `${otelEndpoint}/v1/traces`,
      headers: {}
    });
    const metricExporter = new OTLPMetricExporter({
      url: `${otelEndpoint}/v1/metrics`,
      headers: {}
    });
    const sdk = new NodeSDK({
      resource,
      traceExporter,
      metricReader: new PeriodicExportingMetricReader({
        exporter: metricExporter,
        exportIntervalMillis: 1e4
        // Export metrics every 10 seconds
      }),
      instrumentations: [
        getNodeAutoInstrumentations({
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
      sdk.shutdown().then(() => console.log("OpenTelemetry terminated")).catch((error) => console.error("Error terminating OpenTelemetry", error)).finally(() => process.exit(0));
    };
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("Failed to initialize OpenTelemetry:", error);
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
var performance = {
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
    } catch (error) {
      const duration = Date.now() - start;
      recordMetric(`${name}.duration`, duration, { error: true });
      throw error;
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

export { createSpan, initializeOTEL, performance, recordMetric };
//# sourceMappingURL=telemetry.mjs.map
//# sourceMappingURL=telemetry.mjs.map