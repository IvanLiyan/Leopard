// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  distDir: "build",
  reactStrictMode: true,
  images: {
    domains: ["canary.contestimg.wish.com"],
  },
  i18n: {
    locales: [
      "HC",
      "UP",
      "en-US",
      "es-419",
      "pt-BR",
      "fr-FR",
      "it-IT",
      "ja-JP",
      "ko-KR",
      "de-DE",
      "zh-CN",
      "tr-TR",
      "ru-RU",
      "th-TH",
      "vi-VN",
      "da-DK",
      "id-ID",
      "sv-SE",
      "nb-NO",
      "nl-NL",
      "fi-FI",
      "el-GR",
      "pl-PL",
      "ro-RO",
      "hu-HU",
      "be-BY",
      "cs-CZ",
      "sk-SK",
      "sl-SI",
      "lt-LT",
      "et-EE",
      "lv-LV",
      "ar-SA",
      "hr-HR",
      "hi-IN",
      "sq-AL",
      "bs-BA",
      "bg-BG",
      "sr-RS",
      "uk-UA",
      "km-KH",
      "az-AZ",
      "ms-MY",
      "tl-PH",
      "kk-KZ",
      "zh-TW",
    ],
    defaultLocale: "en-US",
  },
};

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
// TODO [lliepert]: temp disabling sentry until vault is set up
// module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
module.exports = moduleExports;
