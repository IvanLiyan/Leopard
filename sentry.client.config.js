// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const ENV = process.env.ENV;

Sentry.init({
  dsn: `https://346261e9302d40f091ea74b719183fba@${window.location.host}/sentry-proxy-v2/280`,
  tracesSampleRate: 0, // disable performance monitoring; it uses the /envelope URL which is not supported on sentry v10 (current sentry.infra.wish.com version)
  environment: ENV,
  autoSessionTracking: false, // session tracking uses the /envelope URL which is not supported on sentry v10 (current sentry.infra.wish.com version)
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
