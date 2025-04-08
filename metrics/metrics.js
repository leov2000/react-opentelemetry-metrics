import { Resource } from "@opentelemetry/resources";
import {
  DiagConsoleLogger,
  DiagLogLevel,
  diag,
  metrics,
} from "@opentelemetry/api";
import { ConsoleMetricExporter } from "@opentelemetry/sdk-metrics";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const resource = new Resource({
  "service.name": "Example Service Name",
  "service.namespace": "Example Namespace",
  "deployment.environment": "qa",
  "application.name": "Example",
});

const consoleExporter = new ConsoleMetricExporter();

const metricReader = new PeriodicExportingMetricReader({
  exporter: consoleExporter,
  exportIntervalMillis: 5000,
});

const meterProvider = new MeterProvider({
  resource,
  readers: [metricReader],
});

metrics.setGlobalMeterProvider(meterProvider);

const meter = meterProvider.getMeter("example-app");

export const requestCounter = meter.createCounter("page_views", {
  description: "Counts the number of page views",
});

export const requestDuration = meter.createHistogram("page_load_duration", {
  description: "Measures the duration of page loads",
  unit: "ms",
});

export const customEventCounter = meter.createCounter("custom_events", {
  description: "Counts custom events triggered by users",
});

export async function shutdownMetrics() {
  console.log("Manually shutting down metrics provider...");
  await meterProvider.shutdown();
  console.log("Metrics provider shutdown complete.");
}
