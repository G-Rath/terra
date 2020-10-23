import { Config } from '@jest/types';
import 'ts-jest';

const config: Config.InitialOptions = {
  coveragePathIgnorePatterns: ['index.ts'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
      astTransformers: {
        after: ['ts-nameof']
      }
    }
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1'
  },
  resetMocks: true,
  restoreMocks: true,
  setupFilesAfterEnv: [
    './test/setupOClifEnv.ts',
    './test/setupMockFs.ts',
    './test/setupExpectEachTestHasAssertions.ts',
    './test/setupAwsSdkMock.ts',
    './test/matchers/index.ts'
  ],
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  transform: {
    '\\.tsx?': 'ts-jest'
  }
};

export default config;
