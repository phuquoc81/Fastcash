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
const tracerProvider = new BasicTracerProvider({ resource });

if (!kubiksKey) {
  console.info('OpenTelemetry initialization skipped: no Kubiks key configured. Provide one with ?kubiksKey=... or localStorage.');
} else {
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

  async function send(eventName, attributes = {}) {
    if (!enabled) return false;

    const payload = JSON.stringify({
      service: {
        name: config.serviceName,
        version: config.serviceVersion,
      },
      eventName,
      attributes,
      timestamp: new Date().toISOString(),
      page: typeof window !== 'undefined' ? window.location.href : '',
    });

    try {
      await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-kubiks-key': config.apiKey,
        },
        body: payload,
        keepalive: true,
      });
      return true;
    } catch (error) {
      console.warn('FastCash telemetry send failed.', error);
      return false;
    }
  }

  return {
    enabled,
    misconfigured,
    track(eventName, attributes) {
      debugLog(`[Telemetry] ${eventName}`, attributes);
      return send(eventName, attributes);
    },
    trackError(name, message, stack = '') {
      return send('error', {
        name,
        message,
        stack,
      });
    },
  };
}

const telemetryClient = createTelemetryClient(readTelemetryConfig());

if (typeof window !== 'undefined') {
  window.fastcashTelemetry = telemetryClient;
}

if (telemetryClient.enabled) {
  telemetryClient.track('app.init');
} else if (telemetryClient.misconfigured) {
  console.warn('FastCash telemetry is misconfigured. Set both endpoint and apiKey in window.FASTCASH_TELEMETRY_CONFIG to enable.');
} else {
  console.info('FastCash telemetry is disabled. Set window.FASTCASH_TELEMETRY_CONFIG to enable.');
}

export { telemetryClient };
