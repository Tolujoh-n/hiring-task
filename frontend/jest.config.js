// jest.config.js
module.exports = {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest", // this transforms your JSX/JS files with Babel
    "^.+\\.js$": "babel-jest", // for any JS files (including dependencies like axios)
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios|some-other-module-to-transpile)/",
  ],
  testEnvironment: "jsdom", // If you're using React and DOM APIs in your tests
};
