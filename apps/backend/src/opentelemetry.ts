import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { logs, NodeSDK, tracing } from '@opentelemetry/sdk-node';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

export const serviceName = `LargeTrader.Backend.${process.env.STACK ?? 'Local'}`;
export const serviceVersion = process.env.VERSION ?? '1.0.0';

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: serviceName,
  [ATTR_SERVICE_VERSION]: serviceVersion,
});

const tracesExporter = new OTLPTraceExporter();

const metricsExporter = new OTLPMetricExporter();

const logsExporter = new OTLPLogExporter();

export const sdk = new NodeSDK({
  resource,
  traceExporter: new tracing.ConsoleSpanExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricsExporter,
    exportIntervalMillis: 1000,
    exportTimeoutMillis: 1000,
  }),
  spanProcessors: [new tracing.BatchSpanProcessor(tracesExporter)],
  logRecordProcessors: [new logs.BatchLogRecordProcessor(logsExporter)],
  instrumentations: [getNodeAutoInstrumentations()],
});

process.on('SIGTERM', (err) => {
  console.log(`Received SIGTERM: ${err}`);

  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) =>
      console.log(`Error terminating tracing ${error?.message ?? error}`),
    )
    .finally(() => process.exit(0));
});
