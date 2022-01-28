// special module for babel
/* eslint-disable @typescript-eslint/no-var-requires */
const { transformVisitor } = require("./ast-util");

module.exports = function () {
  return {
    name: "localization-plugin",
    visitor: transformVisitor,
  };
};
