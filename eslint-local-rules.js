/* eslint-disable */
"use strict";
const minimatch = require("minimatch");
const yaml = require("js-yaml");
const fs = require("fs");
const _ = require("lodash");
const checkWord = require("check-word");
const englishWords = checkWord("en");
const rulesPath = require("path");

const Tags = ["div", "section", "form", "img", "span"];

const getManifestFilePatterns = () => {
  const stringFiles = fs
    .readdirSync(rulesPath.resolve("../../"))
    .filter((fn) => fn.endsWith("strings.yml"));
  let features = [];
  let filePatterns = [];

  _.forEach(stringFiles, function (stringFile) {
    const stringFileYaml = yaml.safeLoad(
      fs.readFileSync(rulesPath.resolve("../../" + stringFile), "utf8")
    );
    features = features.concat(stringFileYaml.features);
  });

  _.forEach(features, function (feature) {
    filePatterns = filePatterns.concat(feature.files);
  });
  return filePatterns;
};
const manifestFilePatterns = getManifestFilePatterns();

const isLikelyI18n = (_string) => {
  if (typeof _string !== "string" || _string.length < 3) {
    return false;
  }

  if (!/^[A-Z]+/g.test(_string)) {
    // Does not start with a capital letter
    return false;
  }

  if (isUpperCase(_string)) {
    // All caps. These are usually constants
    return false;
  }

  const words = _string.split(" ");
  const likelyWords = words.filter((w) => {
    try {
      return englishWords.check(w.toLowerCase());
    } catch (e) {
      return true;
    }
  });
  // More than 50% of the words in the string are english words
  return likelyWords.length >= 0.5 * words.length;
};

const isLikelyStaticUrl = (_string) => {
  if (typeof _string !== "string") {
    return false;
  }

  return _string.startsWith("static/");
};

const isUpperCase = (str) => {
  return str === str.toUpperCase();
};

const parsePixel = (str) => {
  return parseInt(str.substring(0, str.length - 2));
};

const parsePercentage = (str) => {
  return parseInt(str.substring(0, str.length - 2));
};

const i18nIdentifiers = ["i18n", "ci18n", "ni18n", "cni18n"];

/*
 * This parser here espree instead of babel.
 * https://astexplorer.net/ to test out new rules.
 */
module.exports = {
  "unwrapped-i18n": {
    meta: {
      docs: {
        description: "user visible strings should be tagged for translation",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        Literal(node) {
          if (
            node.parent.callee &&
            i18nIdentifiers.includes(node.parent.callee.name)
          ) {
            return;
          }

          if (isLikelyI18n(node.value)) {
            context.report({
              node: node,
              message:
                "Should this be translated? If so, replace with i`" +
                node.value +
                "`",
            });
          }
        },
      };
    },
  },
  "only-literals-in-i18n": {
    meta: {
      docs: {
        description:
          "Must pass in string literals for extractor to consume the strings properly",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        CallExpression(node) {
          if (!i18nIdentifiers.includes(node.callee.name)) {
            return;
          }
          if (
            node.callee.name === "i18n" &&
            node.arguments.length >= 1 &&
            node.arguments[0].type === "Literal"
          ) {
            return;
          }
          if (
            node.callee.name === "ci18n" &&
            node.arguments.length >= 2 &&
            node.arguments[0].type === "Literal" &&
            node.arguments[1].type === "Literal"
          ) {
            return;
          }
          if (
            node.callee.name === "ni18n" &&
            node.arguments.length >= 3 &&
            node.arguments[1].type === "Literal" &&
            node.arguments[2].type === "Literal"
          ) {
            return;
          }
          if (
            node.callee.name === "cni18n" &&
            node.arguments.length >= 4 &&
            node.arguments[0].type === "Literal" &&
            node.arguments[2].type === "Literal" &&
            node.arguments[3].type === "Literal"
          ) {
            return;
          }

          context.report({
            node: node,
            message:
              "Invalid arguments in call to " +
              node.callee.name +
              "(). Translatable strings and context must be passed as string literals " +
              " in order to be extracted correctly.",
          });
        },
      };
    },
  },
  "unwrapped-static-url": {
    meta: {
      docs: {
        description: "static urls should be wrapped in a s`<path>` expression",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        Literal(node) {
          if (isLikelyStaticUrl(node.value)) {
            const correct = node.value.replace("static/", "");
            context.report({
              node: node,
              message:
                "Is this a static url? If so, replace with s`" + correct + "`",
            });
            return;
          }
        },
      };
    },
  },
  "absURL-deprecated": {
    meta: {
      docs: {
        description: "absURL() is deprecated",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        CallExpression(node) {
          if (node.callee.name === "absURL") {
            context.report({
              node: node,
              message: "absURL() is deprecated. replace with a relative path",
            });
            return;
          }
        },
      };
    },
  },
  "staticUrl-deprecated": {
    meta: {
      docs: {
        description: "staticUrl() is deprecated",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        CallExpression(node) {
          if (node.callee.name === "staticUrl") {
            context.report({
              node: node,
              message:
                "staticUrl() is deprecated. If this is an image, " +
                "please move this file into a lego/img and import it as " +
                "a module: \"import fooImg from 'lego/img/fooImg.svg'\"; ",
            });
            return;
          }
        },
      };
    },
  },
  "no-dom-manipulation": {
    meta: {
      docs: {
        description:
          "ID attribute not allowed. Do not manipulate the DOM " +
          "manually. React manages the DOM and decides when to insert an " +
          "remove elements. External manual manipulation will lead " +
          "to undefined behaviour",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        JSXOpeningElement(node) {
          if (!node.attributes) {
            return;
          }

          const elementName = _.get(node, "name.name");
          if (Tags.indexOf(elementName) < 0) {
            return;
          }

          if (node.attributes.some((a) => _.get(a, "name.name") === "id")) {
            context.report({
              node: node,
              message:
                "ID attribute not allowed. Do not manipulate the DOM " +
                "manually. React manages the DOM and decides when to " +
                "insert an remove elements. External manual manipulation " +
                "will lead to undefined behaviour",
            });
          }
        },
        JSXAttribute(node) {
          const elementName = _.get(node, "name.name") || "";
          if (elementName != "data-testid" && elementName.includes("-")) {
            context.report({
              node: node,
              message:
                "DOM access and manipulation is not allowed. please remove " +
                `this tag: ${elementName}`,
            });
            return;
          }
        },
      };
    },
  },
  "no-external-styling": {
    meta: {
      docs: {
        description:
          "Components need to be as portable as possible. " +
          "If their appearance rely on a .scss file being present, " +
          "they wouldn’t be usable outside of that page.",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        JSXAttribute(node) {
          const attributeName = _.get(node, "name.name");
          if (attributeName !== "className") {
            return;
          }

          if (node.value.type === "Literal") {
            context.report({
              node: node,
              message:
                "External styling not allowed. Appearance the of " +
                "component should only depend on internal " +
                "styles to ensure that it remains portable. ",
            });
            return;
          }

          if (node.value.type === "JSXExpressionContainer") {
            const expressionType = node.value.expression.type;
            if (
              ["TemplateLiteral", "Literal", "BinaryExpression"].indexOf(
                expressionType
              ) >= 0
            ) {
              context.report({
                node: node,
                message:
                  "External styling not allowed. Appearance the of " +
                  "component should only depend on internal " +
                  "styles to ensure that it remains portable. ",
              });
              return;
            }
          }
        },
      };
    },
  },
  "unnecessary-list-usage": {
    meta: {
      docs: {
        description:
          "<ul> and </li> to are commonly used (incorrectly) to " +
          "achieve vertical alignment. Can usually be replaced with " +
          "'display: flex, flex-direction: column'",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        JSXOpeningElement(node) {
          const elementName = _.get(node, "name.name");
          if (["ul", "li"].indexOf(elementName) >= 0) {
            context.report({
              node: node,
              message:
                "Likely unnecessary usage of " +
                elementName +
                ". " +
                "If you only need vertical alignment, please replace with " +
                "<div> and 'display: flex, flex-direction: column' ",
            });
            return;
          }
        },
      };
    },
  },
  "no-setState": {
    meta: {
      docs: {
        description:
          "@observables make components much easier to manage as state " +
          "variables are just fields on the class.",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        CallExpression(node) {
          if (node.callee.type === "MemberExpression") {
            const objectType = _.get(node.callee, "object.type");
            const propertyName = _.get(node.callee, "property.name");
            if (
              objectType === "ThisExpression" &&
              propertyName === "setState"
            ) {
              context.report({
                node: node,
                message:
                  "setState not allowed. Switch to use @observable for " +
                  "easier state management and performance improvements. " +
                  "https://mobx.js.org/getting-started.html",
              });
              return;
            }
          }
        },
      };
    },
  },
  "no-broad-styling-rules": {
    meta: {
      docs: {
        description:
          "Broad CSS rules distort the appearance of child components" +
          "Don't allow them",
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
            if (styleClass.value.type !== "ObjectExpression") {
              continue;
            }

            for (let config of styleClass.value.properties) {
              if (config.type !== "Property") {
                continue;
              }

              if (config.key.type !== "Literal") {
                continue;
              }

              const configName = config.key.value;
              if (typeof configName !== "string") {
                continue;
              }

              for (let tag of Tags) {
                if (
                  (configName.includes(tag) || configName.includes("*")) &&
                  !configName.includes(">")
                ) {
                  context.report({
                    node: config,
                    message:
                      "'" +
                      configName +
                      "'" +
                      " descendant rule is too broad, and very likely to " +
                      "distort the  appearance of child components." +
                      "Add a '>' selector to ensure that you only affect " +
                      "direct descendants https://mzl.la/2vzaOej." +
                      "Or move this into a class",
                  });
                  break;
                }
              }
            }
          }
        },
      };
    },
  },
  "no-complex-styling": {
    meta: {
      docs: {
        description:
          "Styling rules should be keep as simple as possible" +
          " to prevent undefined behavior",
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
            if (styleClass.value.type !== "ObjectExpression") {
              continue;
            }

            for (let config of styleClass.value.properties) {
              if (config.type !== "Property") {
                continue;
              }

              const configName =
                _.get(config, "key.name") || _.get(config, "key.value");
              if (!configName) {
                continue;
              }

              if (
                configName.startsWith("margin") ||
                configName.startsWith("padding")
              ) {
                const configValue = _.get(config, "value.value");
                if (!configValue) {
                  continue;
                }

                if (configValue.toString().includes("auto")) {
                  context.report({
                    node: config,
                    message:
                      configName +
                      ": " +
                      configValue.toString() +
                      " has complex behavior. Replace with a " +
                      "flexbox rule for more predictable " +
                      "appearance and responsiveness: https://bit.ly/2OOp4HO",
                  });
                  continue;
                }

                if (configValue.toString().startsWith("-")) {
                  context.report({
                    node: config,
                    message:
                      "Negative margins are a hack and lead to undefined " +
                      "behavior. Replace with a flexbox rule: " +
                      "https://bit.ly/2OOp4HO",
                  });
                  continue;
                }
              }

              if (["width", "height"].includes(configName)) {
                const configValue = _.get(config, "value.value");
                if (!configValue) {
                  continue;
                }

                if (configValue.toString().includes("auto")) {
                  context.report({
                    node: config,
                    message:
                      "Should not be left to the browser - auto has complex " +
                      "behavior. Please remove or replace with more " +
                      "predictable value: https://bit.ly/2OOp4HO",
                  });
                  continue;
                }
              }

              if (configName === "float") {
                const configValue = _.get(config, "value.value");
                if (!configValue) {
                  continue;
                }

                if (configValue.toString().includes("auto")) {
                  context.report({
                    node: config,
                    message:
                      "'float' has complex behavior. " +
                      "Replace with a flex rule: " +
                      "flexDirection: row, justifyContent: space-between " +
                      "| flex-end. https://bit.ly/2OOp4HO",
                  });
                  continue;
                }
              }
            }
          }
        },
      };
    },
  },
  "no-frozen-width": {
    meta: {
      docs: {
        description:
          "components with frozen widths are very difficult to work with " +
          "as they do not adapt to different scenarios.",
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

              const configName =
                _.get(config, "key.name") || _.get(config, "key.value");
              if (!configName) {
                continue;
              }

              const value = config.value.value;
              if (configName === "width") {
                if (typeof value === "number") {
                  if (value > 150) {
                    // Probably not an icon. Why are we freezing the width.
                    context.report({
                      node: config,
                      message:
                        "Reconsider usage of a frozen width here. " +
                        "Components with unadaptable sizes would not look " +
                        "good on a different screen and are very difficult " +
                        "to work with.",
                    });
                  }
                  if (value === 0) {
                    context.report({
                      node: config,
                      message:
                        "Zero width doesn't make sense here. Please remove " +
                        "the element from the tree or set display: 'none'",
                    });
                  }
                } else if (typeof value === "string") {
                  if (value.endsWith("px")) {
                    const pixelValue = parsePixel(value);
                    if (pixelValue > 150) {
                      // Probably not an icon. Why are we freezing the width.
                      context.report({
                        node: config,
                        message:
                          "Reconsider usage of a frozen width here. " +
                          "Components with unadaptable sizes would not " +
                          "look good on a different screen and a very " +
                          "difficult to work with.",
                      });
                    }

                    if (pixelValue === 0) {
                      context.report({
                        node: config,
                        message:
                          "Zero width doesn't make sense. Please remove the " +
                          "element, or set display: 'none'",
                      });
                    }
                  } else if (value.endsWith("%")) {
                    const percentageValue = parsePixel(value);
                    if (percentageValue === 0) {
                      context.report({
                        node: config,
                        message:
                          "Zero width doesn't make sense. Please remove the " +
                          "element, or set display: 'none'",
                      });
                    }

                    if (className === "root") {
                      context.report({
                        node: config,
                        message:
                          "Width of the component should be left to " +
                          "the parent. What happens when the parent wants " +
                          "a different size?",
                      });
                    }
                  }
                }
              } else if (configName === "minWidth") {
                if (typeof value === "number") {
                  if (value > 300) {
                    context.report({
                      node: config,
                      message:
                        "Minimum width is too large. Screen sizes " +
                        "range from 640px - 1920px. This does not adapt well " +
                        "- would be more than 50% of the page on " +
                        "a smaller screen",
                    });
                  }
                } else if (typeof value === "string") {
                  if (value.endsWith("px")) {
                    const pixelValue = parsePixel(value);
                    if (pixelValue > 300) {
                      context.report({
                        node: config,
                        message:
                          "Minimum width is too large. Screen sizes " +
                          "range from 640px - 1920px. This does not adapt " +
                          "well - would be more than 50% of the page " +
                          "on a smaller screen ",
                      });
                    }
                  }
                }
              }
            }
          }
        },
      };
    },
  },
  "forgot-display-flex": {
    meta: {
      docs: {
        description:
          "using flexDirection, alignItems, or justifyContent without " +
          "specifying 'display: flex'",
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
            if (styleClass.value.type !== "ObjectExpression") {
              continue;
            }

            const properties = styleClass.value.properties.map((p) => {
              const key = _.get(p, "key.name") || _.get(p, "key.value");
              const value = _.get(p, "value.value");
              return {
                key: key,
                value: value,
              };
            });

            const FlexProperties = [
              "justifyContent",
              "alignItems",
              "flexDirection",
            ];
            if (properties.some((p) => FlexProperties.indexOf(p.key) >= 0)) {
              const hasDisplayFlex = properties.some(
                (p) =>
                  p.key === "display" &&
                  ["flex", "grid", "inline-flex"].includes(p.value)
              );

              if (!hasDisplayFlex) {
                context.report({
                  node: styleClass,
                  message:
                    "need 'display: flex|grid|inline-flex'. Otherwise flexbox rules won't " +
                    "take effect",
                });
                break;
              }
            }
          }
        },
      };
    },
  },
  "forgot-tag-observer": {
    meta: {
      docs: {
        description:
          "need to tag components with @observer otherwise @observable and " +
          "@computed, etc will not work",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ClassDeclaration(node) {
          const superClassName = _.get(node, "superClass.name");
          if (superClassName !== "Component") {
            return;
          }

          const decorators = (node.decorators || []).map((d) =>
            _.get(d, "expression.name")
          );
          if (!decorators.includes("observer")) {
            context.report({
              node: node,
              message:
                "component needs to be tagged with @observer " +
                "otherwise it will not react to certain changes",
            });
          }
        },
      };
    },
  },
  "no-pageParams": {
    meta: {
      docs: {
        description: "component should not depend on `window.pageParams` ",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        Identifier(node) {
          if (node.name === "pageParams") {
            context.report({
              node: node,
              message:
                "Dependency on window.pageParams breaks when the " +
                "code is used outside of current page",
            });
          }
        },
      };
    },
  },
  "no-manual-navigation": {
    meta: {
      docs: {
        description:
          "Please navigate the user via navigationStore.navigate(path) so we" +
          " can take advantage of progressive loading.",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        AssignmentExpression(node) {
          const nodeType = node.left.type;

          if (nodeType === "MemberExpression") {
            const objectType = node.left.object.type;
            const objectName = node.left.object.name;
            const propertyName = node.left.property.name;

            if (
              objectType === "Identifier" &&
              objectName === "window" &&
              propertyName === "location"
            ) {
              context.report({
                node: node,
                message:
                  "Please navigate the user via navigationStore.navigate(path) so we " +
                  "can take advantage of progressive loading.",
              });
            }

            if (objectType === "MemberExpression") {
              const innerPropertyName = node.left.object.property.name;
              if (innerPropertyName === "location") {
                context.report({
                  node: node,
                  message:
                    "Please navigate the user via navigationStore.navigate(path) so we " +
                    "can take advantage of progressive loading.",
                });
              }
            }
          }
        },
        CallExpression(node) {
          if (node.callee.type === "MemberExpression") {
            const objectType = _.get(node.callee, "object.type");
            const childObjectType = _.get(node.callee, "object.object.type");
            const childObjectName = _.get(node.callee, "object.object.name");
            const childPropertyName = _.get(
              node.callee,
              "object.property.name"
            );

            if (
              objectType === "MemberExpression" &&
              childObjectType === "Identifier" &&
              childObjectName === "window" &&
              childPropertyName === "location"
            ) {
              context.report({
                node: node,
                message:
                  "Please navigate the user via navigationStore.navigate(path) so we " +
                  "can take advantage of progressive loading.",
              });
            }
          }
        },
      };
    },
  },
  "no-manual-before-unload": {
    meta: {
      docs: {
        description:
          "Please use navigationStore.placeNavigationLock(msg) / " +
          "navigationStore.removeNavigationLock() for compatibiity with " +
          "progressive loading.",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        AssignmentExpression(node) {
          if (node.left.type != "MemberExpression") {
            return;
          }

          const memberExpression = node.left;
          if (memberExpression.object.type == "Identifier") {
            if (memberExpression.object.name != "window") {
              return;
            }
            if (memberExpression.property.name != "onbeforeunload") {
              return;
            }
            context.report({
              node: node,
              message:
                "Please use navigationStore.placeNavigationLock(msg) / " +
                "navigationStore.removeNavigationLock() for compatibiity with " +
                "progressive loading.",
            });
            return;
          }
        },
      };
    },
  },
  "no-absolute-url": {
    meta: {
      docs: {
        description:
          "hardcoding links to merchant.wish.com moves chinese merchants" +
          "away from their site: china-merchant.wish.com",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        Literal(node) {
          if (
            typeof node.value === "string" &&
            node.value.includes("merchant.wish.com")
          ) {
            context.report({
              node: node,
              message:
                "hardcoding links to merchant.wish.com moves chinese " +
                "merchants away from their site: china-merchant.wish.com. " +
                "Please replace with a relative path",
            });
          }
        },
      };
    },
  },
  "no-hardcoded-fontweight": {
    meta: {
      docs: {
        description:
          "use predefined font weight value from fonts.js as this allows us" +
          "modify them easily in the future",
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
            if (styleClass.value.type !== "ObjectExpression") {
              continue;
            }

            for (let config of styleClass.value.properties) {
              if (config.type !== "Property") {
                continue;
              }

              const configName =
                _.get(config, "key.name") || _.get(config, "key.value");
              if (!configName) {
                continue;
              }

              if (
                configName === "fontWeight" &&
                config.value.type === "Literal"
              ) {
                const value = config.value.value;
                context.report({
                  node: config,
                  message:
                    "Please use the <Text weight='bold|semibold|regular|medium' /> component " +
                    "from lego instead of using font weight directly.",
                });
              }
            }
          }
        },
      };
    },
  },
  "no-hardcoded-faq-url": {
    meta: {
      docs: {
        description:
          "don't hardcode zendesk links. Use zendeskURL(<faq id>) " +
          "from 'toolkit/url' to support chinese merchants",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        Literal(node) {
          if (
            typeof node.value === "string" &&
            node.value.includes("merchantfaq.wish.com")
          ) {
            context.report({
              node: node,
              message:
                "don't hardcode zendesk links. Use zendeskURL(<faq id>) " +
                "from 'lego/toolkit/url' to support chinese merchants",
            });
          }
        },
        TemplateElement(node) {
          if (
            typeof node.value.raw === "string" &&
            node.value.raw.includes("merchantfaq.wish.com")
          ) {
            context.report({
              node: node,
              message:
                "don't hardcode zendesk links. Use zendeskURL(<faq id>) " +
                "from 'lego/toolkit/url' to support chinese merchants",
            });
          }
        },
      };
    },
  },
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
  "no-empty-link": {
    meta: {
      docs: {
        description: "should not have empty links",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        JSXAttribute(node) {
          if (node.name.name !== "href") {
            return;
          }

          let expr = node.value;
          if (node.value.type === "JSXExpressionContainer") {
            expr = node.value.expression;
          }

          if (expr.type === "Literal") {
            const value = _.get(expr, "value");
            if (!value || ["", "#"].includes(value.trim())) {
              context.report({
                node: node,
                message: "link leads nowhere",
              });
              return;
            }
          }
        },
      };
    },
  },
  "no-verbose-conditional": {
    meta: {
      docs: {
        description:
          "conditionals written as 'foo ? 2 : null' can be" +
          "simplified to `foo && 2`",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ConditionalExpression(node) {
          if (
            node.consequent.type !== "JSXElement" &&
            node.alternate.type !== "JSXElement"
          ) {
            return;
          }

          if (node.consequent.type === "Literal") {
            if (node.consequent.value === null) {
              context.report({
                node: node,
                message: "please simplify to `!test && value`",
              });
            }
            return;
          } else if (node.alternate.type === "Literal") {
            if (node.alternate.value === null) {
              context.report({
                node: node,
                message: "please simplify to `test && value`",
              });
            }
            return;
          }
        },
      };
    },
  },
  "no-unnecessary-use-of-lodash": {
    meta: {
      docs: {
        description:
          "only use external lib (like lodash) when there is need for it",
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

          const object = _.get(node, "callee.object.name");
          if (object != "_") {
            return;
          }

          const property = _.get(node, "callee.property.name");
          if (["isNull"].includes(property)) {
            context.report({
              node: node,
              message:
                "call to _." +
                property +
                " is unnecessary. Please replace with a " +
                "simple check",
            });
          }

          if (["filter"].includes(property)) {
            context.report({
              node: node,
              message:
                "Please use native array filter: " +
                "https://developer.mozilla.org/en-US/docs/Web/JavaScript/" +
                "Reference/Global_Objects/Array/filter",
            });
          }

          if (["map"].includes(property)) {
            context.report({
              node: node,
              message:
                "Please use native array map: " +
                "https://developer.mozilla.org/en-US/docs/Web/JavaScript/" +
                "Reference/Global_Objects/Array/map",
            });
          }

          if (["get"].includes(property)) {
            context.report({
              node: node,
              message:
                "_.get(obj, 'path.to.value') erases typechecking. Please replace " +
                "with optional-chaining: `obj?.path.to.value`. \n" +
                "https://developer.mozilla.org/en-US/docs/Web/" +
                "JavaScript/Reference/Operators/Optional_chaining",
            });
          }

          if (["mapValues"].includes(property)) {
            context.report({
              node: node,
              message:
                "Please use replace with Object.values(obj).map(v => ...) array map",
            });
          }

          if (["each", "forEach"].includes(property)) {
            context.report({
              node: node,
              message:
                "Please use native array forEach: " +
                "https://developer.mozilla.org/en-US/docs/Web/JavaScript/" +
                "Reference/Global_Objects/Array/forEach",
            });
          }

          if (["reduce"].includes(property)) {
            context.report({
              node: node,
              message:
                "Please use native array reduce: " +
                "https://developer.mozilla.org/en-US/docs/Web/JavaScript/" +
                "Reference/Global_Objects/Array/reduce",
            });
          }

          if (["isUndefined"].includes(property)) {
            context.report({
              node: node,
              message: "Please replace with a basic: foo != undefined check",
            });
          }

          if (["extend"].includes(property)) {
            context.report({
              node: node,
              message:
                "Please use an ES6 spread: " +
                "https://developer.mozilla.org/en-US/docs/Web/JavaScript/" +
                "Reference/Operators/Spread_syntax",
            });
          }

          if (["find"].includes(property)) {
            if (
              ["ArrowFunctionExpression", "FunctionExpression"].includes(
                node.arguments[1].type
              )
            ) {
              context.report({
                node: node,
                message:
                  "Please use native list.find(): " +
                  "https://developer.mozilla.org/en-US/docs/Web/JavaScript/" +
                  "Reference/Global_Objects/Array/find",
              });
            }
          }
        },
      };
    },
  },
  "no-unnecessary-i-tag": {
    meta: {
      docs: {
        description:
          "strings inside jsx expression are translated automatically and do " +
          "not need to be wrapped",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        JSXExpressionContainer(node) {
          if (node.parent.type !== "JSXElement") {
            return;
          }

          if (node.expression.type !== "TaggedTemplateExpression") {
            return;
          }

          const tagName = _.get(node, "expression.tag.name");
          if (tagName !== "i") {
            return;
          }

          const nonEmptyChildren = node.parent.children.filter(
            (c) => ["JSXText", "Literal"].indexOf(c.type) < 0
          );

          if (nonEmptyChildren.length === 1) {
            // No other fragments
            context.report({
              node: node,
              message:
                "unnecessary translation tag (i). Text inside JSX markup " +
                "is automatically translated. Please replace with: " +
                "<div>text that will be translated</div>",
            });
            return;
          }
        },
      };
    },
  },
  "no-unnecessary-indexOf": {
    meta: {
      docs: {
        description:
          "most occurences of indexOf() can be replaced with includes()",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        BinaryExpression(node) {
          if (node.operator !== ">=" && node.operator !== "<") {
            return;
          }

          if (node.left.type !== "CallExpression") {
            return;
          }

          if (node.right.type !== "Literal" || node.right.value !== 0) {
            return;
          }

          const property = _.get(node.left, "callee.property.name");
          if (property !== "indexOf") {
            return;
          }

          if (node.operator === ">=") {
            context.report({
              node: node,
              message:
                "Please replace with `array.includes(value)`: " +
                "https://developer.mozilla.org/en-US/docs/Web/JavaScript/" +
                "Reference/Global_Objects/Array/includes",
            });
          } else if (node.operator === "<") {
            context.report({
              node: node,
              message:
                "Please replace with `!array.includes(value)`: " +
                "https://developer.mozilla.org/en-US/docs/Web/JavaScript/" +
                "Reference/Global_Objects/Array/includes",
            });
          }
        },
      };
    },
  },
  "no-large-method-params": {
    meta: {
      docs: {
        description:
          "replace methods with large parameter lists with object param to " +
          "improve readablity",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        FunctionDeclaration(node) {
          if (node.params.length > 2) {
            context.report({
              node: node,
              message:
                "Arg list is too large. Please pass the arguments " +
                "with an object to improve readablity",
            });
            return;
          }
        },
        FunctionExpression(node) {
          if (node.params.length > 2) {
            context.report({
              node: node,
              message:
                "Arg list is too large. Please pass the arguments " +
                "with an object to improve readability",
            });
            return;
          }
        },
        ArrowFunctionExpression(node) {
          if (node.params.length > 2) {
            context.report({
              node: node,
              message:
                "Arg list is too large. Please pass the arguments " +
                "with an object to improve readability",
            });
            return;
          }
        },
      };
    },
  },
  "use-fragment": {
    meta: {
      docs: {
        description: "use fragments to reduce DOM heirarchy",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        JSXElement(node) {
          if (!node.openingElement) {
            return;
          }

          if (
            !["div", "section", "aside"].includes(node.openingElement.name.name)
          ) {
            return;
          }

          const attributes = node.openingElement.attributes || [];
          if (attributes.length > 0) {
            return;
          }

          const children = node.children || [];
          if (children.length <= 1) {
            return;
          }

          if (
            children.some(
              (child) =>
                child.type == "JSXExpressionContainer" ||
                child.type == "JSXText"
            )
          ) {
            return;
          }

          context.report({
            node: node,
            message:
              "Unnecessary DOM node. Please remove the node or use a " +
              "fragment: https://reactjs.org/docs/fragments.html",
          });

          return;
        },
        ArrayExpression(node) {
          if (
            node.elements.some((elem) => {
              if (elem.type !== "JSXElement") {
                return false;
              }

              const elementName = elem.openingElement.name.name;
              return elementName && /^[a-z]+$/g.test(elementName);
            })
          ) {
            context.report({
              node: node,
              message:
                "Please render these nodes inline, or group them with a " +
                "fragment: https://reactjs.org/docs/fragments.html",
            });
            return;
          }
        },
      };
    },
  },
  "no-b-tag": {
    meta: {
      docs: {
        description:
          "use tunable font-weight and font-size in favor of <b> tag",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        JSXOpeningElement(node) {
          const elementName = _.get(node, "name.name");
          if (elementName == "b") {
            context.report({
              node: node,
              message:
                "Unnecessary usage of <b> tag. " +
                "Please use font-weight to set bold appearance",
            });
            return;
          }
        },
      };
    },
  },
  "unnecessary-string-literal": {
    meta: {
      docs: {
        description:
          "only use string literal identifier for object of key is not a " +
          "valid JavaScript identifier",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        MemberExpression(node) {
          const identifierRegex = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
          if (node.property.type === "Literal") {
            const value = node.property.value;
            if (typeof value === "string" && identifierRegex.test(value)) {
              context.report({
                node: node,
                message:
                  "Unnecessary use of string key. Only use this " +
                  "when this when the key is not a " +
                  "valid JavaScript identifier e.g dict['Some key with spaces']",
              });
              return;
            }
          }
        },
        Property(node) {
          const identifierRegex = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
          if (node.key.type != "Literal") {
            return;
          }

          const value = node.key.value;
          if (typeof value === "string" && identifierRegex.test(value)) {
            context.report({
              node: node,
              message:
                "Unnecessary use of string key. Only use this " +
                "when this when the key is not a " +
                "valid JavaScript identifier e.g {'Some key with spaces': 2}",
            });
            return;
          }
        },
      };
    },
  },
  "use-formatCurrency": {
    meta: {
      docs: {
        description:
          "currency values need to appear in the right format based on the " +
          "user's locale.",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        TemplateElement(node) {
          const value = node.value.raw;
          if (typeof value === "string") {
            if (/(.*)(\$|¥|£)(\${|\d+(.*))/.test(value)) {
              context.report({
                node: node,
                message:
                  "Format of currency values differ based on the user's locale." +
                  " Use formatCurrency to display the currency ",
              });
              return;
            }
          }
        },
        BinaryExpression(node) {
          if (node.operator !== "+") {
            return;
          }

          if (node.left.type !== "Literal") {
            return;
          }

          if (!["$", "¥"].includes(node.left.value)) {
            return;
          }

          context.report({
            node: node,
            message:
              "Format of currency values differ based on the user's locale." +
              " Use formatCurrency to display the currency ",
          });
        },
      };
    },
  },
  "use-string-interpolation": {
    meta: {
      docs: {
        description:
          "don't use + operator concatenate string. Use template strings " +
          "to improve readability: https://github.com/lukehoban/es6features#template-strings",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        BinaryExpression(node) {
          if (node.parent.type === "BinaryExpression") {
            return;
          }

          if (node.operator !== "+") {
            return;
          }

          const types = [node.left.type, node.right.type];
          const valueTypes = [typeof node.left.value, typeof node.right.value];
          if (types[0] == "Literal" && types[0] != types[1]) {
            if (valueTypes.includes("string")) {
              context.report({
                node: node,
                message:
                  "don't use '+' operator for string interpolation. Use template " +
                  "strings to improve readability: " +
                  "https://github.com/lukehoban/es6features#template-strings",
              });
              return;
            }
          }
        },
      };
    },
  },
  "long-tagged-template": {
    meta: {
      docs: {
        description: "concatenate long i18n strings with + sign",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        TaggedTemplateExpression(node) {
          if (!node.tag || node.tag.name != "i") {
            return;
          }

          if (node.quasi.quasis[0].value.raw.length > 80) {
            context.report({
              node: node,
              message:
                "string should fit 80-character limit, please break up by " +
                "concatenating as: i`this is a ` + i` really long string `",
            });
            return;
          }
        },
      };
    },
  },
  "no-c-style-for-loop": {
    meta: {
      docs: {
        description: "Please replace C-Style 'for' loop with a modern option ",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ForStatement(node) {
          context.report({
            node: node,
            message:
              "Please replace C-Style 'for' loop with a modern option. " +
              "For-of: https://mzl.la/2WpRdJw. " +
              "Or array.forEach: https://mzl.la/IysHjg",
          });
        },
      };
    },
  },
  "no-for-in": {
    meta: {
      docs: {
        description:
          "Please replace outdated 'for-in' loop with a modern option ",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ForInStatement(node) {
          context.report({
            node: node,
            message:
              "Please replace outdated 'for-in' loop with a modern option" +
              "If iterating an object, use for (const key of Object.keys(ibject)) ... " +
              "If iterating an array, use for (const item of array) ... https://mzl.la/2WpRdJw",
          });
        },
      };
    },
  },
  "no-object-assign": {
    meta: {
      docs: {
        description:
          "Object.assign({}, foo) can be replaced with a spread { ...foo } ",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        CallExpression(node) {
          if (node.callee.type != "MemberExpression") {
            return;
          }

          if (node.callee.object.type != "Identifier") {
            return;
          }

          if (node.callee.property.type != "Identifier") {
            return;
          }

          const objectName = node.callee.object.name;
          const propertyName = node.callee.property.name;

          if (objectName === "Object" && propertyName === "assign") {
            context.report({
              node: node,
              message:
                "Please replace `Object.assign(foo, {})` with a spread: `{...foo}`",
            });
          }
        },
      };
    },
  },
  "no-hardcoded-wish-link": {
    meta: {
      docs: {
        description:
          "Links to wish.com should use wishURL for multi-env support ",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        TemplateElement(node) {
          if (typeof node.value.raw != "string") {
            return;
          }

          if (
            node.value.raw.includes("www.wish.com") ||
            node.value.raw.includes("http://wish.com") ||
            node.value.raw.includes("https://wish.com")
          ) {
            context.report({
              node: node,
              message:
                "don't hardcode wish links. Use wishURL(<path to page>) " +
                "from 'lego/toolkit/url' to target the correct env",
            });
          }
        },
        Literal(node) {
          if (typeof node.value != "string") {
            return;
          }

          if (
            node.value.includes("www.wish.com") ||
            node.value.includes("http://wish.com") ||
            node.value.includes("https://wish.com")
          ) {
            context.report({
              node: node,
              message:
                "don't hardcode wish links. Use wishURL(<faq id>) " +
                "from 'lego/toolkit/url' to target the correct env",
            });
          }
        },
      };
    },
  },
  "no-hardcoded-cdn-link": {
    meta: {
      docs: {
        description:
          "Assets (images, etc) should be imported and bundled at build-time",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        TemplateElement(node) {
          if (typeof node.value.raw != "string") {
            return;
          }

          if (node.value.raw.includes("cloudfront.net")) {
            context.report({
              node: node,
              message:
                "Do not hardcode a CDN link. Assets (images, etc) " +
                "should be imported and bundled at build-time",
            });
          }
        },
        Literal(node) {
          if (typeof node.value != "string") {
            return;
          }

          if (node.value.includes("cloudfront.net")) {
            context.report({
              node: node,
              message:
                "Do not hardcode a CDN link. Assets (images, etc) " +
                "should be imported and bundled at build-time",
            });
          }
        },
      };
    },
  },
  "getter-naming-conventions": {
    meta: {
      docs: {
        description:
          "getters read like fields. should not be named like a method",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        MethodDefinition(node) {
          if (node.kind != "get") {
            return;
          }

          ["get", "build", "compute", "create"].forEach((invalidPrefix) => {
            if (node.key.name.startsWith(invalidPrefix)) {
              context.report({
                node: node,
                message:
                  "getter should not be named like a method. " +
                  `please remove the unnecessary "${invalidPrefix}" prefix in the name`,
              });
            }
          });
        },
      };
    },
  },
  "camel-case": {
    meta: {
      docs: {
        description: "Javascript identifiers should be in camelCase ",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ClassProperty(node) {
          if (
            node.key.name &&
            node.key.name.includes("_") &&
            /[a-z]/.test(node.key.name)
          ) {
            context.report({
              node: node,
              message: "property should be in camelCase",
            });
          }
        },
      };
    },
  },
  "moment-for-date-formatting": {
    meta: {
      docs: {
        description:
          "please use moment.js to parse, format, and manipulate dates",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        CallExpression(node) {
          if (node.callee.type != "MemberExpression") {
            return;
          }

          if (node.callee.object.type != "Identifier") {
            return;
          }

          if (node.callee.property.type != "Identifier") {
            return;
          }

          const propertyName = node.callee.property.name;
          if (["getFullYear", "getDay", "getMonth"].includes(propertyName)) {
            context.report({
              node: node,
              message:
                "please use moment.js to parse, format, and manipulate dates." +
                " https://momentjs.com/docs/#/displaying/",
            });
          }
        },
      };
    },
  },
  "use-link-component": {
    meta: {
      docs: {
        description: "use Link component instead of <a> tag",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        JSXIdentifier(node) {
          if (node.name == "a") {
            context.report({
              node: node,
              message:
                "please the `Link` component instead " +
                " (https://merchant.wish.com/lego/component/Link)",
            });
            return;
          }
        },
      };
    },
  },
  "bad-flex-configs": {
    meta: {
      docs: {
        description:
          "using flexDirection, alignItems, or justifyContent with incorrect " +
          "values",
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
          for (const styleClass of styleClasses) {
            if (styleClass.value.type !== "ObjectExpression") {
              continue;
            }

            for (const p of styleClass.value.properties) {
              const key = _.get(p, "key.name") || _.get(p, "key.value");
              const value = _.get(p, "value.value");
              if (typeof value !== "string") {
                continue;
              }

              if (
                key === "justifyContent" &&
                ![
                  "flex-start",
                  "flex-end",
                  "center",
                  "space-between",
                  "space-around",
                  "initial",
                  "inherit",
                ].includes(value)
              ) {
                context.report({
                  node: p,
                  message:
                    "invalid value for justifyContent: https://mzl.la/1MHILOn",
                });
              }

              if (
                (key === "alignItems" || key === "alignSelf") &&
                ![
                  "stretch",
                  "center",
                  "flex-start",
                  "flex-end",
                  "baseline",
                  "initial",
                  "inherit",
                ].includes(value)
              ) {
                context.report({
                  node: p,
                  message:
                    "invalid value for alignItems: https://mzl.la/2vuEt88",
                });
              }

              if (
                key === "flexDirection" &&
                ![
                  "row",
                  "column",
                  "row-reverse",
                  "column-reverse",
                  "initial",
                  "inherit",
                ].includes(value)
              ) {
                context.report({
                  node: p,
                  message:
                    "invalid value for flexDirection: https://mzl.la/2JDHfll",
                });
              }
            }
          }
        },
      };
    },
  },
  "no-untyped-api-calls": {
    meta: {
      docs: {
        description: "API calls should be reusable and typesafe manner",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        CallExpression(node) {
          if (node.callee.name === "callAsync") {
            context.report({
              node: node,
              message:
                "API calls should be reusable and written in a typesafe manner to avoid bugs. " +
                "Please move to the new api: https://phab.wish.com/w/webpack/api-calls/",
            });
            return;
          }
        },
      };
    },
  },
  "use-markdown": {
    meta: {
      docs: {
        description:
          "Text with JSX interspersed between (links, bold, italics) " +
          "cannot be translated accurately. Write in markdown to support i18n",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        JSXElement(node) {
          const nonEmptyChildren = node.children.filter((child) => {
            if (
              (child.type != "Literal" && child.type != "JSXText") ||
              typeof child.value != "string"
            ) {
              return true;
            }
            return (
              child.value.trim().length > 0 && child.value.trim() != "&nbsp;"
            );
          });

          const hasJSXElement = nonEmptyChildren.some(
            (child) => child.type == "JSXElement"
          );
          const hasLiteral = nonEmptyChildren.some(
            (child) => child.type == "Literal" || child.type == "JSXText"
          );

          if (hasJSXElement && hasLiteral) {
            context.report({
              node: node,
              message:
                "Text with JSX interspersed between (links, bold, italics) " +
                "cannot be translated accurately. Please use the Markdown " +
                "component: https://merchant.wish.com/lego/component/Markdown",
            });
            return;
          }
        },
      };
    },
  },
  "no-untyped-global": {
    meta: {
      docs: {
        description:
          "Globals like app stores should be access in a typed manner" +
          " to prevent bugs",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        Identifier(node) {
          if (node.parent.type !== "VariableDeclarator") {
            return;
          }

          if (node.name !== "app") {
            return;
          }

          context.report({
            node: node,
            message:
              "`app` should be access in a typesafe way. " +
              'import AppStore from "@merchant/stores/AppStore_DEPRECATED"; ' +
              "then read it as: `const { myStore } = (app: AppStore)` ",
          });
        },
      };
    },
  },
  "use-toasts": {
    meta: {
      docs: {
        description:
          "Replace aggressive alert() calls with the platform's " +
          "toast system.",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        CallExpression(node) {
          if (node.callee.type !== "Identifier") {
            return;
          }

          if (node.callee.name == "alert") {
            context.report({
              node: node,
              message:
                "Replace the alert() calls with the toasts...  " +
                "Search the codebase for toastStore",
            });
          }
        },
      };
    },
  },
  "prefer-spread": {
    meta: {
      docs: {
        description: "Use spread instead of Array.concat to combine arrays",
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

          if (node.callee.property.name == "concat") {
            context.report({
              node: node,
              message:
                "Use spread instead of Array.concat to combine arrays: " +
                "https://gist.github.com/yesvods/51af798dd1e7058625f4",
            });
          }
        },
      };
    },
  },
  "types-pascal-case": {
    meta: {
      docs: {
        description: "Flow type declarations should be in PascalCase",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        TypeAlias(node) {
          if (/^[A-Z]([a-zA-Z0-9])+$/.test(node.id.name)) {
            return;
          }

          context.report({
            node: node,
            message: "Flow type declarations should be in PascalCase",
          });
        },
      };
    },
  },
  "no-complex-relative-imports": {
    meta: {
      docs: {
        description:
          "Dont use relative import to access a parent directory ('..'). Use an absolute import",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ImportDeclaration(node) {
          if (node.source.value.includes("..")) {
            context.report({
              node: node,
              message:
                "Don't use relative import to access " +
                "a parent directory ('..'). Use an absolute import",
            });
          }
        },
      };
    },
  },
  "no-relative-imports": {
    meta: {
      docs: {
        description: "No relative imports allowed",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ImportDeclaration(node) {
          if (node.source.value.startsWith("./")) {
            context.report({
              node: node,
              message: "No relative imports allowed from this directory",
            });
          }
        },
      };
    },
  },
  "no-imperative-jsx": {
    meta: {
      docs: {
        description: "Don't construct JSX trees with array.push(<div />)",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        CallExpression(node) {
          if (
            node.callee.type != "MemberExpression" ||
            node.callee.property.type != "Identifier"
          ) {
            return;
          }
          if (node.callee.property.name != "push") {
            return;
          }
          if (node.arguments.some((arg) => arg.type === "JSXElement")) {
            context.report({
              node: node,
              message:
                "Don't construct JSX trees with array.push(<div />)... the logic is difficult to follow." +
                " Please render the tree inline and use conditional render: https://bit.ly/2DVUgAa",
            });
          }
        },
      };
    },
  },
  "prefer-readonly-array": {
    meta: {
      docs: {
        description: "Prevent mutating arrays that is supposed to be immutable",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        GenericTypeAnnotation(node) {
          if (node.id.name != "Array") {
            return;
          }

          context.report({
            node: node,
            message:
              "Users should not be able to modify array the array with `.push()`, `.slice`, etc." +
              " Please switch this to $ReadOnlyArray<T>",
          });
        },
      };
    },
  },
  "no-unknown-types": {
    meta: {
      docs: {
        description: "Prevent usage of unknown flow types: String, Number",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        GenericTypeAnnotation(node) {
          if (node.id.name == "String") {
            context.report({
              node: node,
              message:
                "`String` is not a valid flow type. Please replace with lowercase `string`.",
            });
            return;
          }

          if (node.id.name == "Number") {
            context.report({
              node: node,
              message:
                "`Number` is not a valid flow type. Please replace with lowercase `number`.",
            });
            return;
          }

          if (node.id.name == "Boolean") {
            context.report({
              node: node,
              message:
                "`Boolean` is not a valid flow type. Please replace with lowercase `boolean`.",
            });
            return;
          }
        },
      };
    },
  },
  "no-container-import": {
    meta: {
      docs: {
        description:
          "Containers are executable program entry points, they shouldn't be reused",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ImportDeclaration(node) {
          if (!node.source.value.includes("/container/")) {
            return;
          }

          const hasDefaultImport = node.specifiers.some(
            (s) => s.type === "ImportDefaultSpecifier"
          );
          if (!hasDefaultImport) {
            return;
          }

          context.report({
            node: node,
            message:
              "Containers are executable page entry points, they shouldn't be imported and reused." +
              " Please move any reusable content into a lego/component/ directory",
          });
        },
      };
    },
  },
  "forgot-alignItems": {
    meta: {
      docs: {
        description:
          "alignItems must be provided with flexDirection: 'row'. " +
          'It is likely you want `alignItems: "center"` to vertically center the content',
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
            if (styleClass.value.type !== "ObjectExpression") {
              continue;
            }

            const properties = styleClass.value.properties.map((p) => {
              const key = _.get(p, "key.name") || _.get(p, "key.value");
              const value = _.get(p, "value.value");
              return {
                key: key,
                value: value,
              };
            });

            const hasFlexDirectionRow = properties.some(
              (p) => p.key === "flexDirection" && p.value === "row"
            );

            if (hasFlexDirectionRow) {
              const hasAlignItems = properties.some(
                (p) => p.key === "alignItems"
              );
              if (!hasAlignItems) {
                context.report({
                  node: styleClass,
                  message:
                    "alignItems must be provided with flexDirection: 'row'. " +
                    'To vertically center the content, use `alignItems: "center"`.',
                });
                break;
              }
            }
          }
        },
      };
    },
  },
  "no-internal-import": {
    meta: {
      docs: {
        description: "Cannot import code written for Wish internal use.",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ImportDeclaration(node) {
          if (!node.source.value.startsWith("@internal/")) {
            return;
          }

          context.report({
            node: node,
            message:
              "Cannot import code written for Wish internal use. If the logic needs to be used on merchant," +
              " please move it to the @merchant pkg.",
          });
        },
      };
    },
  },
  "no-plus-import": {
    meta: {
      docs: {
        description: "Cannot import code written from @plus",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ImportDeclaration(node) {
          if (!node.source.value.startsWith("@plus/")) {
            return;
          }

          context.report({
            node: node,
            message:
              "Cannot import code written from @plus. This rule is to help establish independency between projects." +
              "To use the logic, please directly copy it into this project's repository.",
          });
        },
      };
    },
  },
  "no-i18n-project-feature": {
    meta: {
      docs: {
        description:
          "user visible strings should be in an i18n project feature",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      const hasI18nFeature = function () {
        const sourceFileName = context
          .getFilename()
          .split("clroot/sweeper/merchant_dashboard/")[1];
        let hasFeature = false;

        for (let filepath of manifestFilePatterns) {
          const re = new RegExp(`^${filepath.replace(/\*/g, ".*")}$`, "i");
          if (re.test(sourceFileName)) {
            hasFeature = true;
            break;
          }
        }

        return hasFeature;
      };
      return {
        Literal(node) {
          if (
            !hasI18nFeature() &&
            isLikelyI18n(node.value) &&
            node.parent.type === "JSXElement"
          ) {
            context.report({
              node: node,
              message:
                "Should this be translated? If so, make sure to add this file to a feature in strings.yml",
            });
          }
        },
        TaggedTemplateExpression(node) {
          if (!node.tag || node.tag.name != "i") {
            return;
          }
          if (!hasI18nFeature()) {
            context.report({
              node: node,
              message:
                "Should this be translated? If so, make sure to add this file to a feature in strings.yml",
            });
          }
        },
      };
    },
  },
  "no-links-in-i18n": {
    meta: {
      docs: {
        description: "markdown links are often broken by translators",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      const hasMarkdownLink = function (node) {
        const value = node.quasi.quasis
          .map((quasi) => quasi.value.raw)
          .join("%s");
        const regex = RegExp(/\[(.*?)\]\((.*?)\)/);
        return regex.test(value);
      };
      return {
        TaggedTemplateExpression(node) {
          if (!node.tag || node.tag.name != "i") {
            return;
          }

          if (hasMarkdownLink(node)) {
            context.report({
              node: node,
              message:
                "Markdown links should not be included in translatable strings as translators don't know how " +
                "to work with them (so your links may be broken in other languages). Try something like this instead:\n" +
                "\tconst myMarkdown = `[${i`here`}](/path/to/page)`;\n" +
                "\tconst myString = i`Click ${myMarkdown} to go to the page.`;",
            });
          }
        },
      };
    },
  },
  "no-translation-comparisons": {
    meta: {
      docs: {
        description:
          "Comparisons should be made on solid values, not translated user-visible strings",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        BinaryExpression(node) {
          const ops = ["==", "!=", "===", "!==", ">", ">=", "<", "<="];
          if (!ops.includes(node.operator)) {
            return;
          }

          const types = [node.left.type, node.right.type];
          const expressionType = ["TaggedTemplateExpression", "CallExpression"];
          if (
            !expressionType.includes(types[0]) &&
            !expressionType.includes(types[1])
          ) {
            return;
          }

          if (
            (node.left.callee &&
              i18nIdentifiers.includes(node.left.callee.name)) ||
            (node.right.callee &&
              i18nIdentifiers.includes(node.right.callee.name)) ||
            (node.left.tag && node.left.tag.name == "i") ||
            (node.right.tag && node.right.tag.name == "i")
          ) {
            context.report({
              node: node,
              message:
                "There should be no string comparisons on translations as it may not be in the same language",
            });
          }
        },
      };
    },
  },
  "no-merchant-import": {
    meta: {
      docs: {
        description: "Cannot import code written from @merchant.",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ImportDeclaration(node) {
          if (!node.source.value.startsWith("@merchant/")) {
            return;
          }

          context.report({
            node: node,
            message:
              "Cannot import code written from @merchant. This rule is to help establish independency between projects." +
              "To use the logic, please directly copy it into this project's repository.",
          });
        },
      };
    },
  },
  "no-brandpartner-import": {
    meta: {
      docs: {
        description: "Cannot import code written for @brandpartner.",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ImportDeclaration(node) {
          if (!node.source.value.startsWith("@brandpartner/")) {
            return;
          }

          context.report({
            node: node,
            message:
              "Cannot import code written from @brandpartner. This rule is to help establish independency between projects." +
              "To use the logic, please directly copy it into this project's repository.",
          });
        },
      };
    },
  },
  "no-lego-context-import": {
    meta: {
      docs: {
        description:
          "Replace 'import moment from  \"moment\";' " +
          'with import moment from  "moment/moment"; ',
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ImportDeclaration(node) {
          if (
            !node.source.value.startsWith(
              "@ContextLogic/lego/toolkit/providers"
            )
          ) {
            return;
          }

          context.report({
            node: node,
            message:
              "Cannot import Lego context in app. Please reference app " +
              "context / providers / stores. \nIf you're trying to import " +
              "theming, see @merchant/stores/ThemeStore for app version.",
          });
        },
      };
    },
  },
  "use-proper-moment-import": {
    meta: {
      docs: {
        description: "Cannot import Lego context in app.",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ImportDeclaration(node) {
          if (node.source.value != "moment") {
            return;
          }

          context.report({
            node: node,
            message:
              "Please Replace 'import moment from \"moment\";' with " +
              'import moment from  "moment/moment"; ',
          });
        },
      };
    },
  },
  "use-localized-moment": {
    meta: {
      docs: {
        description:
          "Date and time should be formatted according to user's locale",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      const isMomentIdentifier = function (identifierName) {
        return [
          "moment",
          "date",
          "time",
          "day",
          "week",
          "month",
          "year",
          "quarter",
        ].some((keyword) => identifierName.toLowerCase().includes(keyword));
      };

      const isMomentCallExpression = function (node) {
        if (node.callee.type === "Identifier") {
          return isMomentIdentifier(node.callee.name);
        }
        if (node.callee.type === "MemberExpression") {
          return isMomentMemberExpression(node.callee);
        }
        return false;
      };

      const isMomentMemberExpression = function (node) {
        if (node.object.type === "Identifier") {
          return isMomentIdentifier(node.object.name);
        }
        if (node.object.type === "CallExpression") {
          return isMomentCallExpression(node.object);
        }
        if (
          node.object.type === "MemberExpression" &&
          node.object.property.type === "Identifier"
        ) {
          return isMomentIdentifier(node.object.property);
        }
        return false;
      };

      const isMomentFormatter = function (node) {
        if (node.type !== "CallExpression") {
          return false;
        }
        if (node.callee.type !== "MemberExpression") {
          return false;
        }
        if (node.callee.property.type !== "Identifier") {
          return false;
        }
        if (node.callee.property.name !== "format") {
          return false;
        }

        return isMomentMemberExpression(node.callee);
      };

      const message =
        "Please use formatDatetimeLocalized to format datetime strings properly for the user's locale";

      return {
        JSXExpressionContainer(node) {
          if (node.parent.type !== "JSXElement") {
            return;
          }

          const expr = node.expression;
          if (isMomentFormatter(expr)) {
            context.report({
              node: node,
              message: message,
            });
          }
        },
        TaggedTemplateExpression(node) {
          if (!node.tag || node.tag.name !== "i") {
            return;
          }

          for (let expr of node.quasi.expressions) {
            if (isMomentFormatter(expr)) {
              context.report({
                node: node,
                message: message,
              });
              return;
            }
          }
        },
      };
    },
  },
  "apollo-pin-types": {
    meta: {
      docs: {
        description:
          "Must provide type arguments for response and arguments when using apollo.",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        CallExpression(node) {
          if (node.callee == null) {
            return;
          }
          if (node.callee.type == "Identifier") {
            if (
              node.callee.name != "useQuery" &&
              node.callee.name != "useMutation"
            ) {
              return null;
            }
            if (
              node.typeParameters == null ||
              node.typeParameters.params.length < 2
            ) {
              context.report({
                node: node,
                message:
                  `Must provide both type arguments when using ${node.callee.name}. ` +
                  `E.g ${node.callee.name}<ResponseType, RequestType>(). ` +
                  `Please also AVOID using "any" types, your PR will be rejected.`,
              });
              return;
            }
          }
          if (node.callee.type == "MemberExpression") {
            if (
              node.callee.property.name != "query" &&
              node.callee.property.name != "mutate"
            ) {
              return null;
            }
            if (
              node.typeParameters == null ||
              node.typeParameters.params.length < 2
            ) {
              context.report({
                node: node,
                message:
                  `Must provide both type arguments when using Apollo queries and mutations. ` +
                  `E.g client.query<ResponseType, RequestType>(), client.mutate<ResponseType, RequestType>(). ` +
                  `Please also AVOID using "any" types, your PR will be rejected.`,
              });
              return;
            }
          }
        },
      };
    },
  },
  "ts-no-force-unrwap": {
    meta: {
      docs: {
        description:
          "Do not override TS compiler on a possible null variable. Clear it properly for null",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        TSNonNullExpression(node) {
          context.report({
            node: node,
            message:
              "Do not override TS compiler on a possible null variable. Clear it properly for null",
          });
        },
      };
    },
  },
  "use-effect-no-deps": {
    meta: {
      docs: {
        description:
          "There is no dependency array in useEffect, which causes it to be evaluated after each render. " +
          "This is usually NOT intended, please fix.",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        CallExpression(node) {
          if (node.callee.name === "useEffect" && node.arguments.length === 1) {
            context.report({
              node: node,
              message:
                "There is no dependency array in useEffect, which causes it to be evaluated after each render. " +
                "This is usually NOT intended, please fix.",
            });
          }
        },
      };
    },
  },
  "no-lego-direct-import": {
    meta: {
      docs: {
        description: "No direct imports from lego allowed",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        ImportDeclaration(node) {
          if (
            node.source.value.startsWith("@ContextLogic/lego/component") &&
            node.source.value !== "@ContextLogic/lego/component"
          ) {
            context.report({
              node: node,
              message:
                'No direct imports from lego allowed from this directory. Please use "@ContextLogic/lego".',
            });
          }
        },
      };
    },
  },
  "no-empty-string-comparisons": {
    meta: {
      docs: {
        description: "Do not use empty string comparisons",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        IfStatement(node) {
          if (
            node.test.type === "BinaryExpression" &&
            (node.test.operator === "==" ||
              node.test.operator === "===" ||
              node.test.operator === "!=" ||
              node.test.operator === "!==") &&
            node.test.right.value === ""
          ) {
            context.report({
              node: node,
              message:
                'Do not use comparison with an empty string to check blank strings. Please use "str.trim().length".',
            });
          }
        },
      };
    },
  },
  "graphql-mutation-no-pick-args": {
    meta: {
      docs: {
        description:
          "Do not apply TS Pick operator on a GraphQL mutation argument data type",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create: function (context) {
      return {
        TSTypeReference(node) {
          if (
            node.typeName &&
            node.typeName.name === "Pick" &&
            node.typeParameters &&
            node.typeParameters.params.length > 0 &&
            node.typeParameters.params[0].typeName &&
            node.typeParameters.params[0].typeName.name.endsWith("Args")
          ) {
            context.report({
              node: node,
              message:
                "Do not apply TS Pick operator on a GraphQL mutation argument data type (e.g. ends with _Args). Please use the type directly. This way, future required fields added can be caught by TypeScript.",
            });
          }
        },
      };
    },
  },
};
