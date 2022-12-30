const withTM = require("next-transpile-modules");

function withLoshop(options) {
  return withTM(["g7", "pathplot"])(options);
}

module.exports = withLoshop;
