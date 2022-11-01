const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
const withTM = require("next-transpile-modules")([
  "recharts",
  "@ContextLogic/lego",
]);

const MD_URL = process.env.NEXT_PUBLIC_MD_URL || "";

module.exports = (phase, { defaultConfig }) => {
  return withTM({
    ...defaultConfig,
    distDir: "build",
    basePath: "/md",
    reactStrictMode: true,
    images: {
      domains: ["canary.contestimg.wish.com"],
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
          ]
        : [];
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

      return config;
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // temporarily added to allow demoing on staging while the final tsc etc.
      // errors are being resolved
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    pageExtensions: ["tsx", "ts", "jsx", "js"]
      .map((ext) =>
        phase === PHASE_DEVELOPMENT_SERVER
          ? [`dev.${ext}`, `prod.${ext}`]
          : [`prod.${ext}`],
      )
      .flat(),
  });
};
