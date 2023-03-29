module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "eslint-plugin-local-rules"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "next",
    "next/core-web-vitals",
    "prettier",
  ],
  rules: {
    "no-console": "error",
    // we allow -ignore and -nocheck with comment due to aphrodite's SSR setup
    // requirements
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-expect-error": "allow-with-description",
        "ts-ignore": "allow-with-description",
        "ts-nocheck": "allow-with-description",
        "ts-check": false,
      },
    ],
    "local-rules/validate-root": "error",
    // TODO [lliepert]: re-enable these for forward commits
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
  },
  ignorePatterns: [
    ".eslintrc.js",
    "eslint-local-rules.js",
    "next.config.js",
    "jest.config.js",
    "node_modules",
    "build",
    "out",
    "eslint-local-rules-OLD.js",
    "lighthouse", // if linting lighthouse is desired, we should give it it's own eslintrc
    "tests/*",
  ],
};
