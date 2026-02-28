// OpenTelemetry Web SDK initialization
import { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { CompositePropagator, HttpTraceContextPropagator, HttpBaggagePropagator } from '@opentelemetry/core';
import { B3Propagator } from '@opentelemetry/propagator-b3';

// Create a resource to identify this service
const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'fastcash-web',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
);

// Create the tracer provider
const tracerProvider = new BasicTracerProvider({ resource });

// OTLP HTTP exporter for Kubiks
const otlpExporter = new OTLPTraceExporter({
  url: 'https://ingest.kubiks.app/v1/traces',
  headers: {
    'x-kubiks-key': process.env.REACT_APP_KUBIKS_KEY || 'kubiks_c71a0c0b7664f11a0aa477f86d4840a909ae805d8f83059f977fe92aadbcb540',
  },
});

// Add processors
tracerProvider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));

// Optional: Add console exporter for debugging (remove in production)
if (process.env.NODE_ENV !== 'production') {
  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
}

// Set the global tracer provider
tracerProvider.register();

console.log('OpenTelemetry initialized for FastCash');

export { tracerProvider };
