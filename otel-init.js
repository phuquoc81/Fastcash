const DEFAULT_CONFIG = Object.freeze({
  serviceName: 'fastcash-web',
  serviceVersion: '1.0.0',
  endpoint: '',
  apiKey: '',
  debug: false,
});

function readTelemetryConfig() {
  const runtimeConfig = typeof window !== 'undefined' && window.FASTCASH_TELEMETRY_CONFIG
    ? window.FASTCASH_TELEMETRY_CONFIG
    : {};

  return { ...DEFAULT_CONFIG, ...runtimeConfig };
}

function createTelemetryClient(config) {
  const enabled = Boolean(config.endpoint && config.apiKey);

  function debugLog(message, details) {
    if (config.debug) {
      console.info(message, details ?? '');
    }
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
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        return navigator.sendBeacon(config.endpoint, blob);
      }

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
      console.warn('Fastcash telemetry send failed.', error);
      return false;
    }
  }

  return {
    enabled,
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
} else {
  console.info('Fastcash telemetry is disabled. Set window.FASTCASH_TELEMETRY_CONFIG to enable it.');
}

export { telemetryClient };
