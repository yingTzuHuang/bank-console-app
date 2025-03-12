import { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  testEnvironment: "node",
  preset: "ts-jest",
  collectCoverage: true,
  coverageDirectory: "../coverage",
  collectCoverageFrom: ["src/**/*.ts", "!src/index.ts"],
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.m?[tj]sx?$": ["ts-jest", { useESM: true }],
  },
  clearMocks: true,
};

export default config;
