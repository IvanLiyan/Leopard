// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require("@sentry/nextjs");

const withTM = require("next-transpile-modules")([
  "recharts",
  "@ContextLogic/lego",
]);

const MD_URL = process.env.NEXT_PUBLIC_MD_URL || "";

// ESM modules are only supported in next@12.
// (https://stackoverflow.com/a/69781269/7992823)
// TODO [lliepert]: upgrade next version. for now, re-implement isDev check here
const env = process.env.ENV || process.env.NEXT_PUBLIC_ENV;
const isDev = ["stage", "dev"].includes(env);

const moduleExports = {
  distDir: "build",
  reactStrictMode: true,
  images: {
    domains: ["canary.contestimg.wish.com"],
  },
  async rewrites() {
    return isDev
      ? [
          {
            source: "/api/:path*",
            destination: `${MD_URL}/api/:path*`,
          },
          {
            source: "/go/:mid",
            destination: `${MD_URL}/go/:mid`,
          },
        ]
      : [];
  },
  webpack: (config, { buildId, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.BUILD_ID": JSON.stringify(buildId),
      }),
    );
    return config;
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
module.exports = withTM(moduleExports);
