const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
const { withSentryConfig } = require("@sentry/nextjs");
const withTM = require("next-transpile-modules")([
  "recharts",
  "@ContextLogic/lego",
]);

const MD_URL = process.env.NEXT_PUBLIC_MD_URL || "";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const moduleExports = (phase, { defaultConfig }) => {
  return withTM(
    withBundleAnalyzer({
      ...defaultConfig,
      distDir: "build",
      basePath: "/md",
      reactStrictMode: true,
      images: {
        domains: ["canary.contestimg.wish.com"],
        path: "",
      },
      async rewrites() {
        return MD_URL
          ? [
              {
                source: "/api/:path*",
                destination: `${MD_URL}/api/:path*`,
                basePath: false,
              },
              {
                source: "/go/:mid",
                destination: `${MD_URL}/go/:mid`,
                basePath: false,
              },
              {
                source: "/logout",
                destination: `${MD_URL}/logout`,
                basePath: false,
              },
              {
                // used for xsrf check
                source: "/",
                destination: `${MD_URL}/`,
                basePath: false,
              },
            ]
          : [];
      },
      async redirects() {
        return [
          {
            source: "/v2-login",
            destination: "/login",
            permanent: false,
          },
        ];
      },
      webpack: (config, { buildId, webpack }) => {
        config.plugins.push(
          new webpack.DefinePlugin({
            "process.env.BUILD_ID": JSON.stringify(buildId),
          }),
        );

        config.resolve.alias.i18nModule = "src/app/core/toolkit/i18n";
        config.plugins.push(
          new webpack.ProvidePlugin({
            i18nModule: "i18nModule",
            i18n: ["i18nModule", "i18n"],
            ni18n: ["i18nModule", "ni18n"],
            ci18n: ["i18nModule", "ci18n"],
            cni18n: ["i18nModule", "cni18n"],
            sprintf: ["i18nModule", "sprintf"],
          }),
        );

        config.module.rules.push({
          test: /\.(csv|tsv)$/,
          use: [
            {
              loader: "csv-loader",
              options: {
                dynamicTyping: true,
                header: true,
                skipEmptyLines: true,
              },
            },
          ],
        });

        return config;
      },
      typescript: {
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // We're confident disabling type checking in the build process because
        // we always run it in conjunction with `lint` which also performs
        // type checking. By disabling it here we speed up pipelines by
        // parallelizing the type checking
        ignoreBuildErrors: true,
      },
      pageExtensions: ["tsx", "ts", "jsx", "js"]
        .map((ext) =>
          phase === PHASE_DEVELOPMENT_SERVER
            ? [`dev.${ext}`, `prod.${ext}`]
            : [`prod.${ext}`],
        )
        .flat(),
      sentry: {
        disableServerWebpackPlugin: true, // disable source maps
        disableClientWebpackPlugin: true, // disable source maps
      },
    }),
  );
};

module.exports = withSentryConfig(moduleExports);
