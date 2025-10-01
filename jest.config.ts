import nextJest from 'next/jest.js';

import type { Config as ConfigNS } from '@jest/types';
import type { Config } from 'jest';

const createJestConfig = nextJest({
  dir: './',
});

const baseConfig: ConfigNS.InitialProjectOptions = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@common/(.*)$': '<rootDir>/../kausal_common/src/$1',
  },
};

async function createConfig() {
  const config = await createJestConfig(baseConfig)();
  return {
    coverageProvider: 'v8',
    ...config,
  } satisfies Config;
}

export default createConfig();
