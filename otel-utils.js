function getTelemetryClient() {
  if (typeof window !== 'undefined' && window.fastcashTelemetry) {
    return window.fastcashTelemetry;
  }

  return {
    track() {
      return false;
    },
    trackError() {
      return false;
    },
  };
}

/**
 * Track page navigation/tab changes
 */
export function trackTabChange(tabName) {
  return getTelemetryClient().track('tab.change', {
    'tab.name': tabName,
    'user.action': 'navigation',
  });
}

/**
 * Track user interactions (clicks, form submissions)
 */
export function trackUserAction(actionName, details = {}) {
  return getTelemetryClient().track('user.action', {
    'action.name': actionName,
    ...Object.entries(details).reduce((acc, [key, value]) => {
      acc[`action.${key}`] = String(value);
      return acc;
    }, {}),
  });
}

/**
 * Track page load performance
 */
export function trackPageMetrics() {
  if (typeof window !== 'undefined' && window.performance) {
    const navigationEntry = window.performance.getEntriesByType('navigation')[0];

    if (navigationEntry) {
      return getTelemetryClient().track('page.load', {
        'page.load_time_ms': Math.round(navigationEntry.loadEventEnd),
        'page.dom_interactive_ms': Math.round(navigationEntry.domInteractive),
        'page.dom_complete_ms': Math.round(navigationEntry.domComplete),
      });
    }

    const perfData = window.performance.timing;
    const navigationStart = perfData.navigationStart || 0;
    return getTelemetryClient().track('page.load', {
      'page.load_time_ms': perfData.loadEventEnd - navigationStart,
      'page.dom_interactive_ms': perfData.domInteractive - navigationStart,
      'page.dom_complete_ms': perfData.domComplete - navigationStart,
    });
  }

  return false;
}

/**
 * Track errors
 */
export function trackError(errorName, errorMessage, errorStack = '') {
  return getTelemetryClient().trackError(
    errorName,
    errorMessage,
    String(errorStack).slice(0, 1000),
  );
}

/**
 * Track API calls
 */
export function trackAPICall(endpoint, method = 'GET', details = {}) {
  const telemetry = getTelemetryClient();
  const startedAt = Date.now();

  telemetry.track('api.call.start', {
    'http.method': method,
    'http.url': endpoint,
    ...Object.entries(details).reduce((acc, [key, value]) => {
      acc[`api.${key}`] = String(value);
      return acc;
    }, {}),
  });

  return {
    end: (statusCode, duration) => {
      return telemetry.track('api.call.complete', {
        'http.method': method,
        'http.url': endpoint,
        'http.status_code': statusCode,
        'http.duration_ms': duration ?? (Date.now() - startedAt),
      });
    },
    recordError: (error) => {
      return telemetry.trackError(
        'api.call',
        error?.message || `API call failed: ${method} ${endpoint}`,
        error?.stack || '',
      );
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
