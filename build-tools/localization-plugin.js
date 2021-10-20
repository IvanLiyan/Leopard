const { transformVisitor } = require("./ast-util");

module.exports = function () {
  return {
    name: "localization-plugin",
    visitor: transformVisitor,
  };
};
