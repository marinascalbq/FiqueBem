module.exports = {
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    transformIgnorePatterns: [
      "node_modules/(?!firebase)", // Garante que o Firebase será transformado pelo Babel
    ],
    testEnvironment: "jsdom",
  };
  