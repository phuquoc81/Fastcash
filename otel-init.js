// OpenTelemetry Web SDK initialization
const hasImportMapSupport = typeof document !== 'undefined'
  && !!document.querySelector('script[type="importmap"]');

let tracerProvider = null;

if (!hasImportMapSupport) {
  console.info(
    'Telemetry bootstrap skipped: static browser launches do not resolve npm package imports without an import map or bundler.',
  );
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
      'x-kubiks-key': window.localStorage.getItem('fastcash.kubiksKey') || '',
    },
  });

  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  }

  tracerProvider.register();

  console.log('OpenTelemetry initialized for FastCash');
}

export { tracerProvider };
