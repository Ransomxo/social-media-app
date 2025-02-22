module.exports = {
  setupFiles: ['reflect-metadata'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
