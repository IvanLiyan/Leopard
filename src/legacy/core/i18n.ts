export const i18n = (s: string) => s;
export const ni18n = (n: number, s1: string, s2: string) => s1;
export const ci18n = (s1: string, s2: string) => s1;
export const cni18n = (s1: string, n: number, s2: string, s3: string) => s1;

// define(["jed"], function (jed) {
//   var Jed = jed.Jed;
//   var locale = window.locale_info["locale"];
//   var jedi18n = undefined;

//   if (!window.localeJson) {
//     jedi18n = new Jed({});
//   } else {
//     jedi18n = new Jed(window.localeJson);
//   }

//   function _format(jedChain, args) {
//     try {
//       return jedChain.fetch(args);
//     } catch {
//       // pass
//     }

//     const str = jedChain.fetch();
//     let nonPositionalMatchCount = 0;

//     function replacer(match, capturedNum) {
//       let argIndex = 0;
//       if (capturedNum !== undefined) {
//         argIndex = capturedNum - 1;
//       } else {
//         argIndex = nonPositionalMatchCount;
//         nonPositionalMatchCount++;
//       }
//       return args[argIndex] !== undefined ? args[argIndex] : "";
//     }

//     const sprintfPlaceholderRegex = /%(\d+)\$[ds]|%[ds]/g;
//     const result = str.replace(sprintfPlaceholderRegex, replacer);

//     const descPlaceholderRegex = /\{%(\d+)=[^{}]+\}/g;
//     return result.replace(descPlaceholderRegex, replacer);
//   }

//   function _i18n(str) {
//     var _args = Array.prototype.slice.apply(arguments);

//     if (typeof str !== "string") {
//       console.log("You passed in '" + str + "' to i18n, did you mean ni18n?");
//     }

//     let result = jedi18n.translate(str);
//     result = _format(result, _args.slice(1));

//     if (locale == "up") {
//       result = result.toUpperCase();
//     }
//     return result;
//   }

//   function _ni18n(num, singular, plural) {
//     var _args = Array.prototype.slice.apply(arguments);
//     format_args = _args.slice(3);
//     format_args.splice(0, 0, _args[0]);

//     var str = jedi18n.translate(singular).ifPlural(num, plural);
//     str = _format(str, format_args);

//     if (locale == "up") {
//       str = str.toUpperCase();
//     }
//     return str;
//   }

//   function _ci18n(context, message) {
//     context = context.toUpperCase();
//     var _args = Array.prototype.slice.apply(arguments);

//     if (!context) {
//       return _i18n(message);
//     }

//     var result = jedi18n.translate(message).withContext(context);
//     result = _format(result, _args.slice(2));

//     if (locale == "up") {
//       result = result.toUpperCase();
//     }

//     return result;
//   }

//   function _cni18n(context, num, singular, plural) {
//     context = context.toUpperCase();
//     var _args = Array.prototype.slice.apply(arguments);
//     format_args = _args.slice(4);
//     format_args.splice(0, 0, _args[1]);

//     if (!context) {
//       return _ni18n(num, singular, plural);
//     }

//     var str = jedi18n
//       .translate(singular)
//       .ifPlural(num, plural)
//       .withContext(context);
//     str = _format(str, format_args);

//     if (locale == "up") {
//       str = str.toUpperCase();
//     }
//     return str;
//   }

//   return {
//     i18n: _i18n,
//     ni18n: _ni18n,
//     ci18n: _ci18n,
//     cni18n: _cni18n,
//     sprintf: Jed.sprintf,
//   };
// });
