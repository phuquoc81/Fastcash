# OpenTelemetry Setup for FastCash

This project includes optional observability through OpenTelemetry and Kubiks.

## What's New

### Files Added
- `otel-init.js` - OpenTelemetry SDK initialization
- `otel-utils.js` - Telemetry utility functions for custom tracking
- `package.json` - Dependencies for web-based OpenTelemetry
- `TELEMETRY_SETUP.md` - This file

### Changes Made
- Updated `index.html` so telemetry is opt-in for static launches

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Enable Telemetry for a Static Launch

Telemetry is disabled by default. Enable it with either:

```js
localStorage.setItem('fastcash.telemetry', 'enabled');
localStorage.setItem('fastcash.telemetry.kubiksKey', '<your-kubiks-key>');
```

or by opening the app with query parameters:

```text
index.html?telemetry=1&kubiksKey=<your-kubiks-key>
```

Use your own Kubiks key at runtime. Do not commit credentials into the repository.

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

If you deploy Fastcash behind a framework that supports environment variables or a bundler, inject the Kubiks key at deploy time and keep the browser bundle free of committed secrets.

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
| `fastcash.telemetry` | Set to `enabled` in `localStorage` to opt in | Yes |
| `fastcash.telemetry.kubiksKey` | Kubiks API key stored in `localStorage` or passed by `kubiksKey` query param | Yes |

## Testing

1. Open your app in browser
2. Check browser console for initialization message
3. Interact with the page
4. Open Network tab in DevTools - you should see requests to `ingest.kubiks.app`
5. Check Kubiks dashboard for incoming telemetry data

## Production Checklist

- [ ] Remove `console.log` telemetry messages (or set NODE_ENV=production)
- [ ] Provide the Kubiks key at runtime instead of committing it
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
