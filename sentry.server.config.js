/*
    NOTE: this file will not be used as we don't have a Next.JS server.
    It is required to run next build && next export.
*/
// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "",
});
