// OpenTelemetry Web SDK initialization
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);
const hasImportMapBrowserSupport = typeof HTMLScriptElement !== 'undefined'
  && typeof HTMLScriptElement.supports === 'function'
  && HTMLScriptElement.supports('importmap');
const hasConfiguredImportMap = typeof document !== 'undefined'
  && !!document.querySelector('script[type="importmap"]');

let tracerProvider = null;

if (!hasImportMapBrowserSupport) {
  console.debug('Telemetry initialization skipped: browser import-map support not detected.');
} else if (!hasConfiguredImportMap) {
  console.debug('Telemetry initialization skipped: no import map is configured for telemetry modules.');
} else {
  const kubiksKey = window.localStorage.getItem('fastcash.kubiksKey');

  if (!kubiksKey) {
    console.info('Telemetry initialization skipped: missing fastcash.kubiksKey configuration.');
  } else {
    const [
      { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor },
      { OTLPTraceExporter },
      { Resource },
      { SemanticResourceAttributes },
    ] = await Promise.all([
      import('@opentelemetry/sdk-trace-web'),
      import('@opentelemetry/exporter-trace-otlp-http'),
      import('@opentelemetry/resources'),
      import('@opentelemetry/semantic-conventions'),
    ]);

    const resource = Resource.default().merge(
      new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'fastcash-web',
        [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
      }),
    );

    tracerProvider = new BasicTracerProvider({ resource });

    const otlpExporter = new OTLPTraceExporter({
      url: 'https://ingest.kubiks.app/v1/traces',
      headers: {
        'x-kubiks-key': kubiksKey,
      },
    });

    tracerProvider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));

    if (LOCAL_HOSTNAMES.has(window.location.hostname)) {
      tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
    }

    tracerProvider.register();

    console.log('OpenTelemetry initialized for FastCash');
  }
}

export { tracerProvider };
