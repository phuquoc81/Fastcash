// OpenTelemetry Web SDK initialization
import { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const KUBIKS_KEY_QUERY_PARAM = 'kubiksKey';
const KUBIKS_KEY_STORAGE = 'fastcash.telemetry.kubiksKey';
const OTLP_TRACES_URL = 'https://ingest.kubiks.app/v1/traces';

function readKubiksKey() {
  if (typeof window === 'undefined') return '';

  try {
    const params = new URLSearchParams(window.location.search);
    const keyFromQuery = params.get(KUBIKS_KEY_QUERY_PARAM)?.trim();

    if (keyFromQuery) {
      window.localStorage.setItem(KUBIKS_KEY_STORAGE, keyFromQuery);
      return keyFromQuery;
    }

    return window.localStorage.getItem(KUBIKS_KEY_STORAGE)?.trim() || '';
  } catch (error) {
    console.warn('OpenTelemetry key lookup failed:', error);
    return '';
  }
}

function isLocalDebugEnabled() {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

// Create a resource to identify this service
const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'fastcash-web',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
);

const kubiksKey = readKubiksKey();
let tracerProvider = null;

if (!kubiksKey) {
  console.info('OpenTelemetry disabled: provide a Kubiks key with ?kubiksKey=... or localStorage.');
} else {
  // Create the tracer provider
  tracerProvider = new BasicTracerProvider({ resource });

  // OTLP HTTP exporter for Kubiks
  const otlpExporter = new OTLPTraceExporter({
    url: OTLP_TRACES_URL,
    headers: {
      'x-kubiks-key': kubiksKey,
    },
  });

  // Add processors
  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));

  // Optional: Add console exporter for local debugging
  if (isLocalDebugEnabled()) {
    tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  }

  // Set the global tracer provider
  tracerProvider.register();

  console.log('OpenTelemetry initialized for FastCash');
}

export { tracerProvider };
