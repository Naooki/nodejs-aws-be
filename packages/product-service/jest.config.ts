export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "src/services": "<rootDir>/src/services/index.ts",
    "src/getProductById": "<rootDir>/src/handlers/index.ts",
    "src/getProductList": "<rootDir>/src/handlers/index.ts",
  }
};
