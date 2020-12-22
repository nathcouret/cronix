// jest.config.js
module.exports = {
  verbose: true,
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/test/tsconfig.json",
      diagnostics: true
    }
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  testMatch: ["**/?(*.)+(spec|test).(js|ts)"],
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"]
};
