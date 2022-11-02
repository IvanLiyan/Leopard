module.exports = {
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$": `<rootDir>/__mocks__/fileMock.js`,

    // Handle module aliases
    "^@deprecated/pkg/assets/(.*)$": "<rootDir>/src/pkg/assets/$1",
    "^@legacy/(.*)$": "<rootDir>/src/pkg/legacy/$1",
    "^@merchant/(.*)$": "<rootDir>/src/pkg/merchant/$1",
    "^@plus/(.*)$": "<rootDir>/src/pkg/plus/$1",
    "^@schema/(.*)$": "<rootDir>/src/pkg/schema/$1",
    "^@core/stores/(.*)$": "<rootDir>/src/pkg/stores/$1",
    "^@toolkit/(.*)$": "<rootDir>/src/pkg/toolkit/$1",
    "^@next-toolkit/(.*)$": "<rootDir>/src/toolkit/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  testEnvironment: "jsdom",
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  testEnvironment: "jest-environment-jsdom",
};
