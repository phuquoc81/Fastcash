// OpenTelemetry utilities for custom tracking
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('fastcash-web', '1.0.0');

/**
 * Track page navigation/tab changes
 */
export function trackTabChange(tabName) {
  const span = tracer.startSpan('tab.change', {
    attributes: {
      'tab.name': tabName,
      'user.action': 'navigation',
    },
  });
  span.end();
  console.log(`[Telemetry] Tab changed to: ${tabName}`);
}

/**
 * Track user interactions (clicks, form submissions)
 */
export function trackUserAction(actionName, details = {}) {
  const span = tracer.startSpan('user.action', {
    attributes: {
      'action.name': actionName,
      ...Object.entries(details).reduce((acc, [key, value]) => {
        acc[`action.${key}`] = String(value);
        return acc;
      }, {}),
    },
  });
  span.end();
  console.log(`[Telemetry] User action: ${actionName}`, details);
}

/**
 * Track page load performance
 */
export function trackPageMetrics() {
  if (typeof window !== 'undefined' && window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const span = tracer.startSpan('page.load', {
      attributes: {
        'page.load_time_ms': pageLoadTime,
        'page.dom_interactive_ms': perfData.domInteractive - perfData.navigationStart,
        'page.dom_complete_ms': perfData.domComplete - perfData.navigationStart,
      },
    });
    span.end();
    console.log(`[Telemetry] Page load time: ${pageLoadTime}ms`);
  }
}

/**
 * Track errors
 */
export function trackError(errorName, errorMessage, errorStack = '') {
  const span = tracer.startSpan('error', {
    attributes: {
      'error.name': errorName,
      'error.message': errorMessage,
      'error.stack': errorStack,
    },
  });
  span.recordException(new Error(errorMessage));
  span.setStatus({ code: 2 }); // ERROR
  span.end();
  console.error(`[Telemetry] Error tracked: ${errorName} - ${errorMessage}`);
}

/**
 * Track API calls
 */
export function trackAPICall(endpoint, method = 'GET', details = {}) {
  const span = tracer.startSpan('api.call', {
    attributes: {
      'http.method': method,
      'http.url': endpoint,
      ...Object.entries(details).reduce((acc, [key, value]) => {
        acc[`api.${key}`] = String(value);
        return acc;
      }, {}),
    },
  });
  return {
    end: (statusCode, duration) => {
      span.setAttributes({
        'http.status_code': statusCode,
        'http.duration_ms': duration,
      });
      span.end();
      console.log(`[Telemetry] API call: ${method} ${endpoint} - ${statusCode} (${duration}ms)`);
    },
    recordError: (error) => {
      span.recordException(error);
      span.end();
    },
  };
}

export default {
  trackTabChange,
  trackUserAction,
  trackPageMetrics,
  trackError,
  trackAPICall,
};
