# OpenTelemetry Setup for FastCash

This project now includes comprehensive observability through OpenTelemetry and Kubiks.

## What's New

### Files Added
- `otel-init.js` - OpenTelemetry SDK initialization
- `otel-utils.js` - Telemetry utility functions for custom tracking
- `package.json` - Dependencies for web-based OpenTelemetry
- `.env.example` - Environment variable template
- `TELEMETRY_SETUP.md` - This file

### Changes Made
- Updated `index.html` to initialize OpenTelemetry on page load

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file (or use `.env` for Vercel):
```bash
REACT_APP_KUBIKS_KEY=kubiks_c71a0c0b7664f11a0aa477f86d4840a909ae805d8f83059f977fe92aadbcb540
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.kubiks.app
OTEL_SERVICE_NAME=fastcash-web
```

### 3. Verify Setup

Open your browser console and you should see:
```
OpenTelemetry initialized for FastCash
```

## Using Telemetry in Your Code

### Track Tab Navigation
```javascript
import { trackTabChange } from './otel-utils.js';

// When user clicks a tab
document.querySelector('[data-tab="dashboard"]').addEventListener('click', () => {
  trackTabChange('dashboard');
});
```

### Track User Actions
```javascript
import { trackUserAction } from './otel-utils.js';

trackUserAction('button_click', {
  button_name: 'submit',
  form_type: 'signup'
});
```

### Track API Calls
```javascript
import { trackAPICall } from './otel-utils.js';

const apiCall = trackAPICall('https://api.example.com/data', 'GET');

try {
  const response = await fetch('https://api.example.com/data');
  apiCall.end(response.status, 150); // status code and duration
} catch (error) {
  apiCall.recordError(error);
}
```

### Track Errors
```javascript
import { trackError } from './otel-utils.js';

try {
  // some code
} catch (error) {
  trackError('DataFetchError', error.message, error.stack);
}
```

### Track Page Performance
```javascript
import { trackPageMetrics } from './otel-utils.js';

// Call after page loads
window.addEventListener('load', () => {
  trackPageMetrics();
});
```

## Vercel Integration

### Enable Log Drains
1. Go to Vercel Project Settings → Functions → Web Analytics
2. Configure to send logs to Kubiks endpoint

### Enable Trace Drains
1. Go to Vercel Project Settings → Integrations → OpenTelemetry
2. Configure trace exporter endpoint

## What Gets Tracked

### Automatically
- Page load performance metrics
- Navigation events
- All HTTP requests and responses
- Errors and exceptions
- Resource performance

### Custom (Add to Your Code)
- User interactions
- Form submissions
- Business events
- Custom metrics

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_KUBIKS_KEY` | Kubiks API key for authentication | Yes |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Kubiks ingestion endpoint | Yes |
| `OTEL_SERVICE_NAME` | Your service name in Kubiks | No (default: fastcash-web) |

## Testing

1. Open your app in browser
2. Check browser console for initialization message
3. Interact with the page
4. Open Network tab in DevTools - you should see requests to `ingest.kubiks.app`
5. Check Kubiks dashboard for incoming telemetry data

## Production Checklist

- [ ] Remove `console.log` telemetry messages (or set NODE_ENV=production)
- [ ] Set proper API key in production environment
- [ ] Test on staging environment first
- [ ] Configure appropriate sampling if needed
- [ ] Set up alerts in Kubiks dashboard

## Troubleshooting

### No data appearing in Kubiks
1. Check browser console for errors
2. Verify API key is correct
3. Check Network tab for failed requests to `ingest.kubiks.app`
4. Ensure CORS is enabled

### High network usage
- Reduce event frequency by adjusting sampling
- Filter out non-essential events
- Batch events before sending

## Documentation
- [Kubiks Documentation](https://docs.kubiks.ai)
- [OpenTelemetry JS Documentation](https://opentelemetry.io/docs/instrumentation/js/)
- [OTLP Protocol](https://opentelemetry.io/docs/specs/otlp/)

