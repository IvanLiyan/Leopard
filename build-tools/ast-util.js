/* eslint-disable */
const t = require("@babel/types");
const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;

exports.print = (ast) => generate(ast).code;

const sanitize = (str) =>
  str
    /* replace newlines with single spaces */
    .replace(/\n/g, " ")
    /* replace double spaces with single spaces */
    .replace(/\s\s+/g, " ");

const parse = (source) => {
  return parser.parse(source, {
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    startLine: 1,
    tokens: true,
    plugins: [
      "jsx",
      "typescript",
      "decorators-legacy",
      "dynamicImport",
      ["classProperties", { loose: true }],
      "objectRestSpread",

      "asyncGenerators",
      "bigInt",
      "classPrivateMethods",
      "classPrivateProperties",
      "dynamicImport",
      "exportDefaultFrom",
      "exportExtensions",
      "exportNamespaceFrom",
      "functionBind",
      "functionSent",
      "importMeta",
      "nullishCoalescingOperator",
      "numericSeparator",
      "optionalCatchBinding",
      "optionalChaining",
      ["pipelineOperator", { proposal: "minimal" }],
      "throwExpressions",
      "exportNamespaceFrom",
    ],
    sourceType: "module",
    strictMode: false,
  });
};
exports.parse = parse;

const functionName = (expr) => {
  if (!t.isCallExpression(expr)) {
    return null;
  }

  if (!expr.callee) {
    return null;
  }

  if (t.isIdentifier(expr.callee)) {
    return expr.callee.name;
  }

  if (t.isMemberExpression(expr.callee)) {
    expr = expr.callee;
    while (t.isMemberExpression(expr)) {
      expr = expr.property;
    }

    return expr.name;
  }

  if (t.isCallExpression(expr.callee)) {
    return functionName(expr.callee);
  }

  return null;
};

const reduceBinaryExpression = (expr) => {
  if (!t.isBinaryExpression(expr)) {
    return [expr];
  }

  return [
    ...reduceBinaryExpression(expr.left),
    ...reduceBinaryExpression(expr.right),
  ];
};

const getNonEmptyJSXChildren = (expr) => {
  // Remove empty text nodes. Nodes that only contain new lines or spaces.
  // For eg. this expression
  // <div>
  //  <div>Child</div>
  // </div>
  // has children = [JSText("\n"),JSXElement("<div>Child<div>"),JSText("\n")].
  // Filter empty text nodes and return [JSXElement("<div>Child<div>")]
  return expr.children.filter((node) => {
    if (t.isJSXText(node)) {
      return (node.value || "").replace("\n", "").trim() !== "";
    }

    /* Remove expressions that just contain empty string "{  }"
    Given expression:
      <div>
        This campaign is scheduled to add {formatCurrency(Number(amount), currency)}{" "}
        of budget on every {this.renderDays(days)} Pacific time.
      </div>

    Prettier formatter sometimes inserts an expression with an empty string, remove it.
     */
    if (t.isJSXExpressionContainer(node)) {
      if (t.isStringLiteral(node.expression) && node.expression.value == " ") {
        return false;
      }
    }

    return true;
  });
};

const isStringInterpolationJSXElement = (expr) => {
  const children = getNonEmptyJSXChildren(expr);

  let hasStringChild = false;
  for (const child of children) {
    if (t.isJSXText(child)) {
      hasStringChild = true;
    } else if (!t.isJSXExpressionContainer(child)) {
      return false;
    }
  }

  return hasStringChild;
};

const isString = (e) => e && t.isStringLiteral(e);

const isStringArg = (argument) => {
  if (isString(argument)) {
    return true;
  }

  if (t.isBinaryExpression(argument) && argument.operator === "+") {
    return isString(argument.left) || isString(argument.right);
  }

  return false;
};

const getStringArgs = (expr) => {
  if (!t.isCallExpression(expr)) {
    return [];
  }

  return expr.arguments
    .filter((a) => isStringArg(a))
    .map((a) => {
      if (isString(a)) {
        return a.value;
      }

      return reduceBinaryExpression(a).reduce(
        (accum, e) => accum + e.value,
        "",
      );
    });
};

const camelToSentenceCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b([A-Z]+)([A-Z])([a-z])/, "$1 $2$3")
    .replace(/^./, function (str) {
      return str.toUpperCase();
    });
};

const getPlaceholderName = (expr) => {
  try {
    // Constant/Variable: ${someVar}
    if (t.isIdentifier(expr)) {
      return camelToSentenceCase(expr.name);
    }
    // Number: ${3}
    else if (t.isNumericLiteral(expr)) {
      return `A number, e.g. ${expr.value}`;
    }
    // Some string: ${"Some string"}
    else if (t.isStringLiteral(expr)) {
      return `Example: ${expr.value}`;
    }
    // Boolean: ${false}
    else if (t.isBooleanLiteral(expr)) {
      return "True or False";
    }
    // Some array: ${[1,2,3]}
    else if (t.isArrayExpression(expr)) {
      return "List";
    } else if (t.isTemplateElement(expr)) {
      return expr.value.raw;
    }
    // Template literal: ${`Something`}
    else if (t.isTemplateLiteral(expr)) {
      const elements = [...expr.quasis, ...expr.expressions];
      let placeholderName = "Example: ";
      for (const elem of elements) {
        placeholderName = `${placeholderName} ${getPlaceholderName(
          elem,
        )}`.trim();
      }
      return placeholderName;
    }
    // Template literal: ${i`Something`}
    else if (t.isTaggedTemplateExpression(expr)) {
      return getPlaceholderName(expr.quasi);
    }
    // Function call: ${someFunc()}
    else if (t.isCallExpression(expr)) {
      return getPlaceholderName(expr.callee);
    }
    // MemberExpression: ${someVar.test.property}
    else if (t.isMemberExpression(expr)) {
      return `${getPlaceholderName(expr.object)} ${getPlaceholderName(
        expr.property,
      )}`.trim();
    }
    // Ternary: ${test ? 1 : 3}
    else if (t.isConditionalExpression(expr)) {
      const consequentName = getPlaceholderName(expr.consequent).substring(
        0,
        30,
      );
      const alternateName = getPlaceholderName(expr.alternate).substring(0, 30);
      if (consequentName === alternateName) {
        return consequentName;
      }
      return `${consequentName} or ${alternateName}`;
    }
  } catch (error) {
    console.log(`Error building descriptive placeholder: ${error}`);
  }

  return "";
};

const buildDescriptivePlaceholder = (expr, expressionCount) => {
  const placeholderDescription = getPlaceholderName(expr)
    .substring(0, 40)
    .replace(/[{}]/g, "");
  if (placeholderDescription === "") {
    return `%${expressionCount}$s`;
  }
  return `{%${expressionCount}=${placeholderDescription}}`;
};

const inferFromTemplateLiteral = (expr) => {
  /*
   * Case:
   *  ` Foo ${name}`
   * Returns:
   *  ["Foo %0s"]
   */
  const e = expr;
  if (!t.isTemplateLiteral(e)) {
    return [];
  }

  const elements = [...e.quasis, ...e.expressions].sort(
    (a, b) => a.start - b.start,
  );

  let format = "";
  let expressionCount = 1;
  let results = [];
  for (const elem of elements) {
    if (t.isTemplateElement(elem)) {
      const value = elem.value.cooked || elem.value.raw || "";
      if (value.trim() !== "") {
        format += value;
      }
    } else {
      format += buildDescriptivePlaceholder(elem, expressionCount++);
      results = [...results, ...i18nInference(elem, false)];
    }
  }
  format = sanitize(format);

  return [{ format, callArgs: e.expressions }, ...results];
};

const transformTemplateLiteral = ({ expr }) => {
  /*
   * Case:
   *  {` Foo ${name}`}
   * Returns:
   *  i18n(" Foo %0s", name)
   */
  const e = expr;
  if (!t.isTemplateLiteral(e)) {
    return e;
  }

  const elements = [...e.quasis, ...e.expressions].sort(
    (a, b) => a.start - b.start,
  );

  let format = "";
  let expressionCount = 1;
  for (const elem of elements) {
    if (t.isTemplateElement(elem)) {
      const value = elem.value.cooked || elem.value.raw || "";
      if (value.trim() !== "") {
        format += value;
      }
    } else {
      format += buildDescriptivePlaceholder(elem, expressionCount++);
    }
  }
  format = sanitize(format);

  // $FlowFixMe
  const transformedArgs = e.expressions.map((expr) =>
    transformI18n({ expr, transformLiterals: false }),
  );
  return t.callExpression(t.identifier(""), [
    t.stringLiteral(format),
    ...transformedArgs,
  ]);
};

const transformTaggedTemplateExpression = ({ expr }) => {
  if (!t.isTaggedTemplateExpression(expr)) {
    return expr;
  }

  switch (expr.tag.name) {
    case "i": // i18n
      return transformTemplateLiteral({ expr: expr.quasi });
    case "s": // staticUrl
      return t.callExpression(t.identifier("staticUrl"), [expr.quasi]);
    default:
      return expr;
  }
};

const getCombinedBinaryExpressionElements = (expr) => {
  const elements = reduceBinaryExpression(expr);
  if (elements.length === 0) {
    return [];
  }

  let combinedExprs = [];
  let currentCombinedExprArr = [];
  for (const element of elements) {
    if (t.isTaggedTemplateExpression(element)) {
      currentCombinedExprArr = [...currentCombinedExprArr, element];
    } else {
      combinedExprs = [
        ...combinedExprs,
        ...[combinedTaggedTemplate(currentCombinedExprArr), element],
      ];
      currentCombinedExprArr = [];
    }
  }
  combinedExprs = [
    ...combinedExprs,
    combinedTaggedTemplate(currentCombinedExprArr),
  ];

  return combinedExprs.filter((_) => _ !== null);
};

const combinedTaggedTemplate = (elements) => {
  if (elements.length === 0) {
    return null;
  }

  const combinedTag = elements[0].tag;
  const combinedQuasis = elements.reduce((accum, e) => {
    const newBatch = e.quasi.quasis;
    if (accum.length === 0) {
      return [...newBatch];
    }

    if (newBatch.length > 0) {
      const [firstOfNewBactch, ...restOfNewBatch] = newBatch;
      if (firstOfNewBactch.value.raw.indexOf("${") >= 0) {
        // Dont stitch if leading element in the new batch should
        // be a quasis.
        return [...accum, ...newBatch];
      } else {
        // Stritch leading quasis of the newBatch with trailing
        // quasis of the previous one.
        const tail = accum[accum.length - 1];
        tail.value.raw += firstOfNewBactch.value.raw;
        tail.value.cooked += firstOfNewBactch.value.cooked;
        return [...accum, ...restOfNewBatch];
      }
    }

    return [...accum];
  }, []);

  const combinedExpressions = elements.reduce(
    (accum, e) => [...accum, ...e.quasi.expressions],
    [],
  );

  const combinedQuasi = t.templateLiteral(combinedQuasis, combinedExpressions);
  return t.taggedTemplateExpression(combinedTag, combinedQuasi);
};

const buildBinaryExpression = (elements) => {
  let binaryExpression = elements[0];
  for (let i = 1; i < elements.length; i++) {
    binaryExpression = t.binaryExpression("+", binaryExpression, elements[i]);
  }
  return binaryExpression;
};

const transformBinaryExpression = ({ expr }) => {
  if (!t.isBinaryExpression(expr)) {
    return expr;
  }

  const combinedElements = getCombinedBinaryExpressionElements(expr);
  if (!combinedElements.some((_) => t.isTaggedTemplateExpression(_))) {
    return expr;
  }
  const transformedExprs = combinedElements.map((combined) =>
    transformI18n({ expr: combined, transformLiterals: false }),
  );

  if (transformedExprs.length === 0) {
    return expr;
  }
  return buildBinaryExpression(transformedExprs);
};

const inferFromBinaryExpression = (expr) => {
  if (!t.isBinaryExpression(expr)) {
    return [];
  }
  let results = [];
  const combinedExprs = getCombinedBinaryExpressionElements(expr).filter((_) =>
    t.isTaggedTemplateExpression(_),
  );
  for (const combined of combinedExprs) {
    results = [...results, ...inferFromTaggedTemplateExpression(combined)];
  }

  return results;
};

const inferFromTaggedTemplateExpression = (expr) => {
  if (!t.isTaggedTemplateExpression(expr)) {
    return [];
  }

  switch (expr.tag.name) {
    case "i":
      return inferFromTemplateLiteral(expr.quasi);
    default:
      return [];
  }
};

const inferFromStringInterpolationJSXElement = (expr) => {
  /*
   * Case:
   *  <div>{bat ? `yes ${x}` : `no`} Bar {foo} baz</div>
   * Returns:
   *  ["%0s bar %1s baz", "yes %0", "no"]
   */
  if (!t.isJSXElement(expr) && !t.isJSXFragment(expr)) {
    return [];
  }

  const children = getNonEmptyJSXChildren(expr);
  if (children.length === 0) {
    return [];
  }

  let format = "";
  let expressionCount = 1;
  let results = [];
  for (const elem of children) {
    if (t.isJSXText(elem)) {
      const textElem = elem;
      const value = textElem.value || "";
      if (value.trim() !== "") {
        format += value;
      }
    } else if (t.isJSXExpressionContainer(elem)) {
      format += buildDescriptivePlaceholder(elem.expression, expressionCount++);
      results = [...results, ...i18nInference(elem, false)];
    }
  }
  format = format.trim();
  format = sanitize(format).replace(/^\s+|\s+$/g, "");

  const callArgs = children.filter((_) => t.isJSXExpressionContainer(_));
  return [{ format, callArgs }, ...results];
};

const transformStringInterpolationJSXElement = ({ expr }) => {
  /*
   * Case:
   *  <div>{bat ? `yes ${x}` : `no`} Bar {foo} baz</div>
   * Returns:
   *  <div>{
   *    i18n("%0s bar %1s baz",
            bat ? i18n("yes %0s", x) : i18n("no"),
            i18n("foo")
        )
      }</div>
   */
  if (!t.isJSXElement(expr) && !t.isJSXFragment(expr)) {
    return expr;
  }

  const children = getNonEmptyJSXChildren(expr);
  if (children.length === 0) {
    return expr;
  }

  let format = "";
  let expressionCount = 1;
  for (const elem of children) {
    if (t.isJSXText(elem)) {
      const textElem = elem;
      const text = textElem.value;
      if (text.trim() !== "") {
        format += text;
      }
    } else if (t.isJSXExpressionContainer(elem)) {
      format += buildDescriptivePlaceholder(elem.expression, expressionCount++);
    }
  }
  format = format.trim();
  format = sanitize(format).replace(/^\s+|\s+$/g, "");

  // $FlowFixMe
  const callArgs = children.filter((_) => t.isJSXExpressionContainer(_));
  const transformedArgs = callArgs.map((expr) =>
    transformI18n({ expr, transformLiterals: false }),
  );
  expr.children = [
    t.jSXExpressionContainer(
      t.callExpression(t.identifier(""), [
        t.stringLiteral(format),
        ...transformedArgs,
      ]),
    ),
  ];

  return expr;
};

const inferFromStringLiteral = (expr) => {
  /*
   * Case:
   *  "Hello"
   * Returns:
   *  ["Hello"]
   */
  if (t.isStringLiteral(expr)) {
    const value = expr.value || "";
    if (value.trim() !== "") {
      return [{ format: expr.value, callArgs: [] }];
    }
  }

  return [];
};

const transformStringLiteral = ({ expr }) => {
  /*
   * Case:
   *  "Hello"
   * Returns:
   *  i18n("Hello")
   */
  if (t.isStringLiteral(expr)) {
    const value = expr.value || "";
    if (value.trim() !== "") {
      // $FlowFixMe
      return t.callExpression(t.identifier(""), [t.stringLiteral(value)]);
    }
  }

  return expr;
};

const inferFromConditionalExpression = (expr) => {
  /*
   * Case:
   *  <div>{bat ? `yes ${x}` : `no`}</div>
   * Returns:
   *  ["yes %0", "no"]
   */
  if (!t.isConditionalExpression(expr)) {
    return [];
  }

  const consequent = i18nInference(expr.consequent, false);
  const alternate = i18nInference(expr.alternate, false);

  return [...consequent, ...alternate];
};

const transformConditionalExpression = ({ expr }) => {
  /*
   * Input:
   *  {bat ? `yes ${x}` : `no`}
   * Returns:
   *  {bat ? i18n("yes %0s", x): i18n("no")}
   */
  if (!t.isConditionalExpression(expr)) {
    return expr;
  }

  const transformedConsequent = transformI18n({
    expr: expr.consequent,
    transformLiterals: false,
  });
  const transformedAlternate = transformI18n({
    expr: expr.alternate,
    transformLiterals: false,
  });

  return t.conditionalExpression(
    expr.test,
    transformedConsequent,
    transformedAlternate,
  );
};

const i18nInference = (expr, inferLiterals = true) => {
  if (t.isJSXExpressionContainer(expr)) {
    return i18nInference(expr.expression, inferLiterals);
  }

  if (t.isJSXElement(expr) || t.isJSXFragment(expr)) {
    if (isStringInterpolationJSXElement(expr)) {
      return inferFromStringInterpolationJSXElement(expr);
    }

    return [];
  }

  if (t.isConditionalExpression(expr)) {
    return inferFromConditionalExpression(expr);
  }

  if (inferLiterals) {
    if (t.isStringLiteral(expr)) {
      return inferFromStringLiteral(expr);
    }

    if (t.isTemplateLiteral(expr)) {
      return inferFromTemplateLiteral(expr);
    }
  }

  if (t.isTaggedTemplateExpression(expr)) {
    return inferFromTaggedTemplateExpression(expr);
  }

  if (t.isBinaryExpression(expr)) {
    return inferFromBinaryExpression(expr);
  }

  return [];
};

const transformI18n = ({ expr, transformLiterals = true }) => {
  // console.log("transforming", expr);
  if (t.isJSXExpressionContainer(expr)) {
    return transformI18n({ expr: expr.expression, transformLiterals });
  }

  if (t.isJSXElement(expr) || t.isJSXFragment(expr)) {
    if (isStringInterpolationJSXElement(expr)) {
      return transformStringInterpolationJSXElement({ expr });
    }

    const children = getNonEmptyJSXChildren(expr);
    if (children.length === 1 && t.isJSXExpressionContainer(children[0])) {
      const transformedChild = transformI18n({
        expr: children[0],
        transformLiterals,
      });
      if (
        t.isExpression(transformedChild) ||
        t.isJSXEmptyExpression(transformedChild)
      ) {
        expr.children = [t.jSXExpressionContainer(transformedChild)];
      }
      return expr;
    }

    return expr;
  }

  if (t.isConditionalExpression(expr)) {
    return transformConditionalExpression({ expr });
  }

  if (transformLiterals) {
    if (t.isStringLiteral(expr)) {
      return inferFromStringLiteral(expr);
    }

    if (t.isTemplateLiteral(expr)) {
      return inferFromTemplateLiteral(expr);
    }
  }

  if (t.isTaggedTemplateExpression(expr)) {
    return transformTaggedTemplateExpression({ expr });
  }

  if (t.isBinaryExpression(expr)) {
    return transformBinaryExpression({ expr });
  }
  return expr;
};

exports.isI18n = (expr) => functionName(expr) === "i18n";
exports.isNi18n = (expr) => functionName(expr) === "ni18n";
exports.isCi18n = (expr) => functionName(expr) === "ci18n";
exports.isCni18n = (expr) => functionName(expr) === "cni18n";
exports.isEventId = (expr) => functionName(expr) === "eventId";
exports.isStaticUrl = (expr) => functionName(expr) === "staticUrl";

exports.transform = (ast) => {
  traverse(ast, {
    JSXFragment: function (path) {
      const expr = path.node;
      transformI18n({ expr });
    },
    JSXElement: function (path) {
      const expr = path.node;
      transformI18n({ expr });
    },
    TaggedTemplateExpression: function (path) {
      if (path.parent.type === "BinaryExpression") {
        return;
      }

      const expr = path.node;
      path.replaceWith(transformI18n({ expr }));
    },
    BinaryExpression: function (path) {
      if (path.parent.type === "BinaryExpression") {
        return;
      }

      const expr = path.node;
      if (expr.operator !== "+") {
        return;
      }

      path.replaceWith(transformI18n({ expr }));
    },
  });
};

exports.transformVisitor = {
  JSXFragment: {
    enter(path) {
      const expr = path.node;
      transformI18n({ expr });
    },
  },
  JSXElement: {
    enter(path) {
      const expr = path.node;
      transformI18n({ expr });
    },
  },
  TaggedTemplateExpression: {
    enter(path) {
      if (path.parent.type === "BinaryExpression") {
        const elements = reduceBinaryExpression(path.parent);
        if (elements.every((e) => t.isTaggedTemplateExpression(e))) {
          return;
        }
      }

      const expr = path.node;
      path.replaceWith(transformI18n({ expr }));
    },
  },
  BinaryExpression: {
    enter(path) {
      const expr = path.node;
      path.replaceWith(transformI18n({ expr }));
    },
  },
};
