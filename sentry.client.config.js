// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// auto generated file
// eslint-disable-next-line no-undef
const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
// eslint-disable-next-line no-undef
const ENV = process.env.ENV || "local";

Sentry.init(
  // ENV === "local"
  // TODO [lliepert]: temp disabling sentry until vault is set up
  // eslint-disable-next-line no-constant-condition
  true
    ? {}
    : {
        dsn: SENTRY_DSN, // Adjust this value in production, or use tracesSampler for greater control
        tracesSampleRate: 1.0,
        environment: ENV,
        // ...
        // Note: if you want to override the automatic release value, do not set a
        // `release` value here - use the environment variable `SENTRY_RELEASE`, so
        // that it will also get attached to your source maps
      },
);
