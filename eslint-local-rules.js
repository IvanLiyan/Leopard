"use strict";
const _ = require("lodash");

module.exports = {
  "validate-root": {
    meta: {
      docs: {
        description:
          "component should not set root settings would limit " +
          "their reusability",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        CallExpression(node) {
          if (node.callee.type !== "MemberExpression") {
            return;
          }

          if (node.arguments.length !== 1) {
            return;
          }

          const objectName = _.get(node.callee, "object.name");
          const propertyName = _.get(node.callee, "property.name");
          if (objectName !== "StyleSheet" || propertyName !== "create") {
            return;
          }

          const styleClasses = node.arguments[0].properties;
          for (let styleClass of styleClasses) {
            const className =
              _.get(styleClass, "key.name") || _.get(styleClass, "key.value");
            if (styleClass.value.type !== "ObjectExpression") {
              continue;
            }

            for (let config of styleClass.value.properties) {
              if (config.type !== "Property") {
                continue;
              }

              if (className !== "root") {
                continue;
              }

              const configName =
                _.get(config, "key.name") || _.get(config, "key.value");
              if (!configName) {
                continue;
              }

              const value = config.value.value;
              if (configName === "minWidth" || configName === "maxWidth") {
                context.report({
                  node: config,
                  message:
                    configName +
                    " is based on the context. Setting it " +
                    "inside at the component root severely limits its " +
                    "reusability. Please apply this at the parent level",
                });
              }

              if (configName.startsWith("margin")) {
                context.report({
                  node: config,
                  message:
                    "margin is an external property. Please apply it at the " +
                    "parent, or convert it to 'padding'" +
                    "reusability. Please apply this at the parent level",
                });
              }
            }
          }
        },
      };
    },
  },
  "no-relative-import": {
    meta: {
      docs: {
        description: "Replace relative import with @package import",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ImportDeclaration(node) {
          if (node.source.value.startsWith(".")) {
            context.report({
              node: node,
              message: "Replace relative import with @package import",
            });
          }
        },
      };
    },
  },
  "no-non-riptide-import": {
    meta: {
      docs: {
        description: "Only import from @riptide or @components/core",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ImportDeclaration(node) {
          if (
            node.source.value.startsWith("@") &&
            !(
              node.source.value.startsWith("@riptide") ||
              node.source.value.startsWith("@components/core")
            )
          ) {
            context.report({
              node: node,
              message: "Only import from @riptide or @components/core",
            });
          }
        },
      };
    },
  },
  "no-riptide-non-component-import": {
    meta: {
      docs: {
        description: "Only components can be imported from @riptide",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ImportDeclaration(node) {
          if (
            node.source.value.startsWith("@riptide") &&
            !node.source.value.startsWith("@riptide/component") &&
            node.source.value !== "@riptide/toolkit/provider"
          ) {
            context.report({
              node: node,
              message: "Only components can be imported from @riptide",
            });
          }
        },
      };
    },
  },
  "no-window": {
    meta: {
      docs: {
        description:
          "Dependencies on `window` break when rendered server-side " +
          "in SSR. Confirm that this call can only be executed on " +
          "the client side.",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        Identifier(node) {
          if (node.name === "window") {
            context.report({
              node: node,
              message:
                "Dependencies on `window` break when rendered server-side " +
                "in SSR. Confirm that this call can only be executed on " +
                "the client side.",
            });
          }
        },
      };
    },
  },
};
