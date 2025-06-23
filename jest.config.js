export default {
  testEnvironment: 'node',
  transform: {},
  reporters: ['default', 'jest-junit'],
  moduleNameMapper: {
    '^./deps/three/examples/jsm/loaders/GLTFLoader.js$': '<rootDir>/tests/__mocks__/GLTFLoader.js',
    '^./deps/holoplay/holoplay.module.js$': '<rootDir>/tests/__mocks__/holoplay.module.js'
  },
  testPathIgnorePatterns: ['<rootDir>/test/quiltExport.test.js']
};
