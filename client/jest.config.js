module.exports = {
  moduleFileExtensions: ['js', 'vue'],
  collectCoverageFrom: ['src/utils/**/*.{js,vue}'],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
