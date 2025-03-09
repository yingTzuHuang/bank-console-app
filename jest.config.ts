import { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  testEnvironment: "node",
  preset: "ts-jest",
  collectCoverage: true,
  coverageDirectory: "../coverage",
  collectCoverageFrom: ["src/**/*.ts"],
  testMatch: ["**/tests/**/*.test.ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};

export default config;
