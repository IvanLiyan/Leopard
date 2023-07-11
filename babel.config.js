const { babelOptimizerPlugin } = require("@graphql-codegen/client-preset");

module.exports = {
  presets: ["next/babel"],
  assumptions: {
    setPublicClassFields: true,
  },
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
    ["@babel/plugin-proposal-private-methods", { loose: true }],
    "./build-tools/localization-plugin.js",
    [
      babelOptimizerPlugin,
      { artifactDirectory: "./src/schema", gqlTagName: "gql" },
    ],
  ],
};
