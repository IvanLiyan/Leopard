const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "./" });
const customJestConfig = {
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["node_modules", "src"],
  roots: ["<rootDir>/src/"],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i": `<rootDir>/__mocks__/fileMock.js`,
    // Handle module aliases
    "@add-edit-product/(.*)": "<rootDir>/src/app/add-edit-product/$1",
    "@all-products/(.*)": "<rootDir>/src/app/all-products/$1",
    "@chrome/(.*)": "<rootDir>/src/app/chrome/$1",
    "@core/(.*)": "<rootDir>/src/app/core/$1",
    "@core-builder/(.*)": "<rootDir>/src/app/core-builder/$1",
    "@infractions/(.*)": "<rootDir>/src/app/infractions/$1",
    "@landing-pages/(.*)": "<rootDir>/src/app/landing-pages/$1",
    "@performance-cn/(.*)": "<rootDir>/src/app/performance/$1",
    "@schema": "<rootDir>/src/app/schema",
    "@deprecated/(.*)": "<rootDir>/src/deprecated/$1",
    "@public/(.*)": "<rootDir>/public/$1",
  },
  // Add more setup options before each test is run
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  testEnvironment: "jsdom",
};

module.exports = createJestConfig(customJestConfig);
