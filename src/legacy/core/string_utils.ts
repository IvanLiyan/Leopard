export const shortenWithEllipsis = (text: string, length: number): string => {
  if (length <= 3) {
    return "...";
  }

  if (text.length > length) {
    return text.substr(0, length - 3) + "...";
  }

  return text;
};

// define(["core/i18n", "@ContextLogic/lego/toolkit/currency"], function (
//   i18nModule,
//   currency,
// ) {
//   /*
//    * Return whether or not a given number is an integer
//    */

//   var i18n = i18nModule.i18n;

//   function formatPhoneNumber(num) {
//     num = num.replace(/\D/g, "");
//     if (num.length == 10) {
//       return num.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
//     } else if (num.length == 11) {
//       return num.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "($1) $2-$3-$4");
//     } else {
//       return num;
//     }
//   }

//   function round(num, fixed) {
//     if (typeof fixed === "undefined" || !fixed) {
//       return Math.round(parseFloat(num));
//     }
//     return parseFloat(num).toFixed(fixed);
//   }

//   function formatPercentage(num, denom, fixed) {
//     if (!fixed) fixed = 0;

//     var n = parseFloat(num);
//     var d = parseFloat(denom);
//     if (d == 0) return "100%";
//     return ((n / d) * 100).toFixed(fixed) + "%";
//   }

//   function newlineToBr(html_string) {
//     return html_string.replace(/\n/g, "<br>");
//   }

//   function validatePhoneNumberComponent(type, num) {
//     if (type === "phone_number_country") {
//       if (num != num.replace(/\D/g, "")) {
//         return i18n("Phone number can only contain digits.");
//       }

//       if (!(1 <= num.length && num.length <= 3)) {
//         return i18n("Country code is not the right length");
//       }
//     } else if (type === "phone_number_area") {
//       if (num != num.replace(/\D/g, "")) {
//         return i18n("Phone number can only contain digits.");
//       }

//       // we can accept numbers with no area code
//       if (!(0 <= num.length && num.length <= 3)) {
//         return i18n("Area code is not the right length");
//       }
//     } else if (type === "phone_number_number") {
//       // check for extensions
//       if (num.indexOf("x") >= 0) {
//         example = "<br>Ex. + 1 - 234 - 5678910x1234";
//         // verify that it has an extension formatted properly
//         num = num.split("x");

//         // if there isn't the right amount of parts
//         if (num.length != 2) {
//           return (
//             i18n("Phone numbers with extensions can only have one x.") + example
//           );
//         }

//         if (num[1].length == 0) {
//           return i18n("Extension number missing.") + example;
//         }

//         // if there are non-digits in the extension
//         if (num[1] != num[1].replace(/\D/g, "")) {
//           return (
//             i18n("Extension cannot contain non-number characters.") + example
//           );
//         }

//         // otherwise, validate the non-extension part of the number
//         return validatePhoneNumberComponent(type, num[0]);
//       } else {
//         if (num != num.replace(/\D/g, "")) {
//           return i18n("Phone number can only contain digits.");
//         }

//         // no extensions
//         if (!(6 <= num.length && num.length <= 11)) {
//           return i18n("Phone number is not the right length");
//         }
//       }
//     } else {
//       // if 'type' did not match any of the phone number components
//       return "Unhandled exception, please contact support";
//     }

//     return true;
//   }

//   function copyTextToClipboard(text) {
//     var textArea = document.createElement("textarea");

//     // Place in top-left corner of screen regardless of scroll position.
//     textArea.style.position = "fixed";
//     textArea.style.top = 0;
//     textArea.style.left = 0;

//     // Ensure it has a small width and height. Setting to 1px / 1em
//     // doesn't work as this gives a negative w/h on some browsers.
//     textArea.style.width = "2em";
//     textArea.style.height = "2em";

//     // We don't need padding, reducing the size if it does flash render.
//     textArea.style.padding = 0;

//     // Clean up any borders.
//     textArea.style.border = "none";
//     textArea.style.outline = "none";
//     textArea.style.boxShadow = "none";

//     // Avoid flash of white box if rendered for any reason.
//     textArea.style.background = "transparent";

//     textArea.value = text;

//     document.body.appendChild(textArea);

//     textArea.select();

//     try {
//       document.execCommand("copy");
//     } catch (err) {
//       // pass
//     }

//     document.body.removeChild(textArea);
//   }

//   // add leading '+' if necessary, and remove leading 0s
//   function cleanPhoneNumber(phone_number) {
//     // add leading '+' if necessary
//     if (phone_number[0] != "+") {
//       phone_number = "+" + phone_number;
//     }

//     // remove leading 0s
//     while (phone_number.indexOf("+0") >= 0) {
//       phone_number = "+" + phone_number.substring(2, phone_number.length);
//     }
//     return phone_number;
//   }

//   function pluralStr(num, singular, plural) {
//     if (num == 1) {
//       return singular;
//     }
//     return plural;
//   }

//   function isInt(n) {
//     return n % 1 == 0;
//   }

//   function addCommas(nStr) {
//     nStr += "";
//     x = nStr.split(".");
//     x1 = x[0];
//     x2 = x.length > 1 ? "." + x[1] : "";
//     var rgx = /(\d+)(\d{3})/;
//     while (rgx.test(x1)) {
//       x1 = x1.replace(rgx, "$1" + "," + "$2");
//     }
//     return x1 + x2;
//   }

//   function getRatio(numerator, denominator, accuracy, is_percent) {
//     var x = parseFloat(numerator);
//     var y = parseFloat(denominator);
//     var to_return = 0;
//     if (y != 0 && !isNaN(y) && !isNaN(x)) {
//       to_return = (x * 1.0) / y;
//     }

//     if (is_percent == true && to_return > 100) {
//       to_return = 100.0;
//     }
//     return to_return.toFixed(accuracy);
//   }

//   function checkTimeFromNow(time, diff) {
//     /* Check if time is more than diff days in the past
//      * time - mm-dd-yyyy
//      * diff - number of days
//      */
//     var today = new Date();
//     var d = new Date(
//       time.substring(6),
//       time.substring(0, 2) - 1,
//       time.substring(3, 5),
//     );
//     d.setDate(d.getDate() + diff);
//     return d < today;
//   }

//   /* Return a Date object from a string that is formatted %m-%d-%Y */
//   function createDateFromString(date_str) {
//     var split_date_str = date_str.split("-");
//     var date = new Date(
//       split_date_str[2],
//       split_date_str[0] - 1,
//       split_date_str[1],
//     );
//     return date;
//   }

//   /* Format a currency symbol based on currency code
//    *
//    * params:
//    *   currencyCode     - alphabetical currency code
//    *   symbol           - base symbol of the currency
//    */
//   function formatCurrencySymbol(currencyCode, symbol) {
//     var currencySymbol = symbol;

//     if (currencyCode != "USD") {
//       currencySymbol = currencyCode + " " + symbol;
//     }

//     return currencySymbol;
//   }

//   function formatForeignCurrency(_n, currencyCode) {
//     // This is deprecated, use currency.formatCurrency directly
//     return currency.formatCurrency(_n, currencyCode);
//   }

//   function formatCurrency(
//     _n,
//     includeDollar,
//     shouldAddCommas,
//     maxNumber,
//     currencyName,
//   ) {
//     /* Format a number as money. Add a $ sign, commas, and round to 2 digits
//      * if the number is not an integer
//      *
//      * params:
//      *   n                - the number to format
//      *   includeDollar    - whether or not to include the dollar sign.
//      *                      Default = true
//      *   shouldAddCommas  - whether or not to add commas. Default = true
//      *   maxNumber        - if specified, any number greater than
//      *                      maxNumber will be shown as "maxNumber+".
//      *                      Default = undefined/unspecified
//      */
//     var n = parseFloat(_n);
//     if (isNaN(n)) {
//       return _n;
//     }

//     if (typeof includeDollar === "undefined") {
//       includeDollar = true;
//     }
//     if (typeof shouldAddCommas === "undefined") {
//       shouldAddCommas = true;
//     }
//     var addPlus = false;
//     if (maxNumber && !isNaN(maxNumber)) {
//       if (n > maxNumber) {
//         n = maxNumber;
//         addPlus = true;
//       }
//     }
//     var formatted = n.toFixed(2);

//     if (shouldAddCommas) {
//       formatted = addCommas(formatted);
//     }
//     if (includeDollar) {
//       formatted = "$" + formatted;
//       // if number is negative, we want the currency to render as
//       // '-$3.14, instead of $-3.14'
//       if (n < 0) {
//         dollar_sign = formatted.charAt(0);
//         negative_sign = formatted.charAt(1);
//         formatted = negative_sign + dollar_sign + formatted.substring(2);
//       }
//     }
//     if (addPlus) {
//       formatted = formatted + "+";
//     }
//     if (currencyName) {
//       formatted =
//         formatted +
//         '<span class="currency-subscript">' +
//         currencyName +
//         "</span>";
//     }
//     return formatted;
//   }

//   function validateVolume(str) {
//     var volume_format =
//       /^(\d+(\.\d+)?)\s*(ml|l|oz\.?|m\^3|cm\^3|gallon|quart|cup|qt\.?|pt\.?|litre|liter|pint|fl\.?\s?oz\.?)s?$/gi;
//     if (str.match(volume_format)) return true;
//     return false;
//   }

//   function validateLength(str) {
//     var length_format_1 =
//       /^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;
//     var length_format_2 =
//       /^(\d+(\.\d+)?)\s*(ft.?|feet|\')\s*(\d+(\.\d+)?)\s*(in\.?|inche(es)?|\")$/gi;

//     if (str.match(length_format_1) || str.match(length_format_2)) return true;
//     return false;
//   }

//   function validateArea(str) {
//     var area_format_1 =
//       /^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;
//     var area_format_2 =
//       /^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|X|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;

//     if (str.match(area_format_1) || str.match(area_format_2)) return true;
//     return false;
//   }

//   function validateVoltage(str) {
//     var voltage_format = /^(\d+(\.\d+)?)\s*v$/gi;
//     if (str.match(voltage_format)) return true;
//     return false;
//   }

//   function validateWattage(str) {
//     var wattage_format = /^(\d+(\.\d+)?)\s*w$/gi;
//     if (str.match(wattage_format)) return true;
//     return false;
//   }

//   function validateCustom(str) {
//     if (str.length <= 50) return true;
//     return false;
//   }

//   function validateWeight(str) {
//     var weight_format =
//       /^(\d+(\.\d+)?)\s*(mg|g|kg|oz\.?|ounce|gram|pound|lb)s?$/gi;
//     if (str.match(weight_format)) return true;
//     return false;
//   }

//   function validateSize(size_string, valid_size_names) {
//     if (_.indexOf(valid_size_names, size_string) != -1 || !isNaN(size_string)) {
//       return false;
//     } else if (
//       validateWeight(size_string) ||
//       validateLength(size_string) ||
//       validateVoltage(size_string) ||
//       validateArea(size_string) ||
//       validateVolume(size_string) ||
//       validateWattage(size_string) ||
//       validateCustom(size_string)
//     ) {
//       return false;
//     } else {
//       return "Invalid size";
//     }
//   }

//   function validateColor(
//     color_string,
//     valid_color_names,
//     valid_color_names_merchant,
//     allow_custom_colors,
//   ) {
//     if (allow_custom_colors) {
//       custom_format = /^[a-zA-Z0-9][\ ]*([a-zA-Z0-9'\.\-\/\\&][\ ]*)*$/gi;

//       if (!color_string.match(custom_format) || color_string.length > 50) {
//         return "Invalid color";
//       }
//       return false;
//     }

//     var colors = color_string
//       .toLowerCase()
//       .replace(/ /g, "")
//       .replace(/\//g, "&")
//       .replace(/\+/g, "&")
//       .replace(/\\/g, "&")
//       .split("&");

//     if (colors.length > 5) {
//       return "No more than five colors";
//     }

//     var invalid_colors_english = _.filter(
//       colors,
//       _.bind(function (color) {
//         return _.indexOf(valid_color_names, color) == -1;
//       }, this),
//     );

//     if (invalid_colors_english.length) {
//       var invalid_colors_merchant = _.filter(
//         colors,
//         _.bind(function (color) {
//           return _.indexOf(valid_color_names_merchant, color) == -1;
//         }, this),
//       );

//       if (invalid_colors_merchant.length) {
//         return "Invalid color";
//       }
//     }

//     return false;
//   }

//   function validateShippingTime(time_string) {
//     var shipping_times = time_string.split("-");

//     if (shipping_times.length == 2) {
//       var min_shipping_time = shipping_times[0];
//       var max_shipping_time = shipping_times[1];

//       if (isInt(min_shipping_time) && isInt(max_shipping_time)) {
//         min_shipping_time = parseInt(min_shipping_time);
//         max_shipping_time = parseInt(max_shipping_time);
//         if (min_shipping_time >= 2 && max_shipping_time > min_shipping_time) {
//           return false;
//         }
//       }
//     }

//     return "Invalid shipping time";
//   }

//   function containsChineseCharacter(str) {
//     var re = /^.*[\u4E00-\u9FA5].*$/;
//     return re.test(str);
//   }

//   function validateEmail(email) {
//     var re =
//       /(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-011\013\014\016-\177])*")@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,10}\.?$/i;
//     return re.test(email);
//   }

//   function validateCountry(country, allCountries) {
//     if (allCountries.indexOf(country) >= 0) {
//       return false;
//     }
//     return i18n("Invalid country code, legal examples: CN or US");
//   }

//   function validateDeclaredName(declaredName, isLocalName) {
//     isLocalName = !!isLocalName;

//     var isInvalidBasic = function () {
//       return (
//         typeof declaredName !== "string" ||
//         declaredName.length <= 1 ||
//         declaredName.length > 200
//       );
//     };
//     var isContainInvalid = function () {
//       // If updating this also update the value
//       // in lib/products/csv/csv_parser.py
//       var containsNotationRe = /[^\w\s,&.\-/\u4E00-\u9FA5]/;
//       return (
//         containsNotationRe.test(declaredName) ||
//         (!isLocalName && containsChineseCharacter(declaredName))
//       );
//     };
//     var isBeginWithInvalid = function () {
//       var beginWithUnderlineRe = /^_/;
//       return beginWithUnderlineRe.test(declaredName);
//     };
//     var isContainNoWordCharacter = function () {
//       var regularWordCharRe = /[a-zA-Z]/;
//       return (
//         !regularWordCharRe.test(declaredName) &&
//         (!isLocalName || !containsChineseCharacter(declaredName))
//       );
//     };

//     if (
//       isInvalidBasic() ||
//       isContainInvalid() ||
//       isBeginWithInvalid() ||
//       isContainNoWordCharacter()
//     ) {
//       return i18n("Invalid declared name");
//     }
//     return false;
//   }

//   function validateDeclaredLocalName(declaredLocalName) {
//     return validateDeclaredName(declaredLocalName, true);
//   }

//   function validateURL(url) {
//     var re = /^.+\..+\/.+$/;
//     return re.test(url);
//   }

//   function validateWebsiteLink(link) {
//     var re = /^.+\..+$/;
//     return re.test(link);
//   }

//   function validateMinMaxShipTime(ship_time) {
//     // check if ship_time is an integer
//     if (ship_time % 1 == 0) {
//       return false;
//     }

//     return "Ship time must be a number";
//   }

//   function validatePrice(price) {
//     var re = /^\d{0,5}(\.\d{0,2}){0,1}$/;
//     if (price.match(re)) {
//       return false;
//     }
//     return "Invalid retail price";
//   }

//   function validateShipping(price) {
//     if (!price) {
//       return "Price is required";
//     }
//     var re = /^\d*(\.\d{0,2}){0,1}$/;
//     if (price.match(re)) {
//       return false;
//     }
//     return "Invalid shipping price";
//   }

//   function validateEmptyShipping(price) {
//     var re = /^\d*(\.\d{0,2}){0,1}$/;
//     if (price.match(re)) {
//       return false;
//     }
//     return "Invalid shipping price";
//   }

//   function validateInventory(inv) {
//     if (!inv) {
//       return false;
//     }
//     var re = /^(0|[1-9]\d*)$/;
//     if (inv.match(re)) {
//       return false;
//     }
//     return "Invalid inventory";
//   }

//   function escapeCSS(text) {
//     // For escaping CSS Selector special characters
//     return text.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\\\$&");
//   }

//   function is_ascii(text) {
//     for (var i = 0; i < text.length; i++) {
//       if (text.charCodeAt(i) >= 128) {
//         return false;
//       }
//     }
//     return true;
//   }

//   // note: char code < 256 is actually a superset of Latin1
//   function is_latin1(text) {
//     for (var i = 0; i < text.length; i++) {
//       if (text.charCodeAt(i) >= 256) {
//         return false;
//       }
//     }

//     // if text contains invalid characters
//     if (text.replace(/\W+/g, "") != text) {
//       return false;
//     }

//     return true;
//   }

//   function shortenWithEllipsis(text, length) {
//     if (length <= 3) {
//       return "...";
//     }

//     if (text.length > length) {
//       return text.substr(0, length - 3) + "...";
//     }

//     return text;
//   }

//   function cleanStr(str) {
//     const clean_str = str.trim().toLowerCase();
//     return clean_str.replace(/\W/g, ""); // remove internal whitespace
//   }
//   function fuzzyStrMatch(str1, str2) {
//     return cleanStr(str1 || "") == cleanStr(str2 || "");
//   }

//   function validateObjectId(id) {
//     if (!id) {
//       return false;
//     }
//     var objectIdRegex = /^[a-f\d]{24}$/i;
//     return objectIdRegex.test(id);
//   }

//   /*
//    * Javascript Diff Algorithm
//    *  By John Resig (http://ejohn.org/)
//    *  Modified by Chu Alan "sprite"
//    *
//    * Released under the MIT license.
//    *
//    * More Info:
//    *  http://ejohn.org/projects/javascript-diff-algorithm/
//    */
//   function escape(s) {
//     var n = s;
//     n = n.replace(/&/g, "&amp;");
//     n = n.replace(/</g, "&lt;");
//     n = n.replace(/>/g, "&gt;");
//     n = n.replace(/"/g, "&quot;");

//     return n;
//   }
//   function diffString(o, n) {
//     o = o.replace(/\s+$/, "");
//     n = n.replace(/\s+$/, "");

//     var out = diff(
//       o == "" ? [] : o.split(/\s+/),
//       n == "" ? [] : n.split(/\s+/),
//     );
//     var str = "";

//     var oSpace = o.match(/\s+/g);
//     if (oSpace == null) {
//       oSpace = ["\n"];
//     } else {
//       oSpace.push("\n");
//     }
//     var nSpace = n.match(/\s+/g);
//     if (nSpace == null) {
//       nSpace = ["\n"];
//     } else {
//       nSpace.push("\n");
//     }

//     if (out.n.length == 0) {
//       for (var i = 0; i < out.o.length; i++) {
//         str += "<del>" + escape(out.o[i]) + oSpace[i] + "</del>";
//       }
//     } else {
//       if (out.n[0].text == null) {
//         for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
//           str += "<del>" + escape(out.o[n]) + oSpace[n] + "</del>";
//         }
//       }

//       for (var i = 0; i < out.n.length; i++) {
//         if (out.n[i].text == null) {
//           str += "<ins>" + escape(out.n[i]) + nSpace[i] + "</ins>";
//         } else {
//           var pre = "";

//           for (
//             n = out.n[i].row + 1;
//             n < out.o.length && out.o[n].text == null;
//             n++
//           ) {
//             pre += "<del>" + escape(out.o[n]) + oSpace[n] + "</del>";
//           }
//           str += " " + out.n[i].text + nSpace[i] + pre;
//         }
//       }
//     }
//     return str;
//   }
//   function diff(o, n) {
//     var ns = new Object();
//     var os = new Object();

//     for (var i = 0; i < n.length; i++) {
//       // check edge case for when n[i] == 'constructor'
//       if (ns[n[i]] == null || n[i].toLowerCase() == "constructor")
//         ns[n[i]] = { rows: new Array(), o: null };
//       ns[n[i]].rows.push(i);
//     }

//     for (var i = 0; i < o.length; i++) {
//       if (os[o[i]] == null || o[i].toLowerCase() == "constructor")
//         os[o[i]] = { rows: new Array(), n: null };
//       os[o[i]].rows.push(i);
//     }

//     for (var i in ns) {
//       if (
//         ns[i].rows.length == 1 &&
//         typeof os[i] != "undefined" &&
//         os[i].rows.length == 1
//       ) {
//         n[ns[i].rows[0]] = { text: n[ns[i].rows[0]], row: os[i].rows[0] };
//         o[os[i].rows[0]] = { text: o[os[i].rows[0]], row: ns[i].rows[0] };
//       }
//     }

//     for (var i = 0; i < n.length - 1; i++) {
//       if (
//         n[i].text != null &&
//         n[i + 1].text == null &&
//         n[i].row + 1 < o.length &&
//         o[n[i].row + 1].text == null &&
//         n[i + 1] == o[n[i].row + 1]
//       ) {
//         n[i + 1] = { text: n[i + 1], row: n[i].row + 1 };
//         o[n[i].row + 1] = { text: o[n[i].row + 1], row: i + 1 };
//       }
//     }

//     for (var i = n.length - 1; i > 0; i--) {
//       if (
//         n[i].text != null &&
//         n[i - 1].text == null &&
//         n[i].row > 0 &&
//         o[n[i].row - 1].text == null &&
//         n[i - 1] == o[n[i].row - 1]
//       ) {
//         n[i - 1] = { text: n[i - 1], row: n[i].row - 1 };
//         o[n[i].row - 1] = { text: o[n[i].row - 1], row: i - 1 };
//       }
//     }
//     return { o: o, n: n };
//   }

//   return {
//     roundFloat: round,
//     checkTimeFromNow: checkTimeFromNow,
//     createDateFromString: createDateFromString,
//     getRatio: getRatio,
//     addCommas: addCommas,
//     formatCurrency: formatCurrency,
//     formatForeignCurrency: formatForeignCurrency,
//     formatCurrencySymbol: formatCurrencySymbol,
//     pluralStr: pluralStr,
//     formatPhoneNumber: formatPhoneNumber,
//     newlineToBr: newlineToBr,
//     validatePhoneNumberComponent: validatePhoneNumberComponent,
//     validateSize: validateSize,
//     validateArea: validateArea,
//     validateColor: validateColor,
//     validateShippingTime: validateShippingTime,
//     validateEmail: validateEmail,
//     validateURL: validateURL,
//     validateCountry: validateCountry,
//     validateDeclaredName: validateDeclaredName,
//     validateDeclaredLocalName: validateDeclaredLocalName,
//     validateMinMaxShipTime: validateMinMaxShipTime,
//     containsChineseCharacter: containsChineseCharacter,
//     cleanPhoneNumber: cleanPhoneNumber,
//     validateVolume: validateVolume,
//     validateWeight: validateWeight,
//     validateLength: validateLength,
//     validateVoltage: validateVoltage,
//     validateWattage: validateWattage,
//     validateCustom: validateCustom,
//     formatPercentage: formatPercentage,
//     validatePrice: validatePrice,
//     validateShipping: validateShipping,
//     validateEmptyShipping: validateEmptyShipping,
//     validateInventory: validateInventory,
//     escape: escape,
//     escapeCSS: escapeCSS,
//     is_ascii: is_ascii,
//     is_latin1: is_latin1,
//     shortenWithEllipsis: shortenWithEllipsis,
//     diffString: diffString,
//     copyTextToClipboard: copyTextToClipboard,
//     validateWebsiteLink: validateWebsiteLink,
//     fuzzyStrMatch: fuzzyStrMatch,
//     validateObjectId: validateObjectId,
//   };
// });
