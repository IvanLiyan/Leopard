import _ from "lodash";
import { i18n } from "@core/toolkit/i18n";
import { formatCurrency as legoFormatCurrency } from "@ContextLogic/lego/toolkit/currency";

export const formatPhoneNumber = (num: string): string => {
  num = num.replace(/\D/g, "");
  if (num.length == 10) {
    return num.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  } else if (num.length == 11) {
    return num.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "($1) $2-$3-$4");
  } else {
    return num;
  }
};

export const round = (num: string, fixed: number): string | number => {
  if (typeof fixed === "undefined" || !fixed) {
    return Math.round(parseFloat(num));
  }
  return parseFloat(num).toFixed(fixed);
};

export const formatPercentage = (
  num: string,
  denom: string,
  fixed: number,
): string => {
  if (!fixed) fixed = 0;

  const n = parseFloat(num);
  const d = parseFloat(denom);
  if (d == 0) return "100%";
  return ((n / d) * 100).toFixed(fixed) + "%";
};

export const newlineToBr = (htmlString: string): string => {
  return htmlString.replace(/\n/g, "<br>");
};

type PhoneNumberComponentType =
  | "phone_number_country"
  | "phone_number_area"
  | "phone_number_number";

export const validatePhoneNumberComponent = (
  type: PhoneNumberComponentType,
  num: string,
): string | boolean => {
  if (type === "phone_number_country") {
    if (num != num.replace(/\D/g, "")) {
      return i18n("Phone number can only contain digits.");
    }

    if (!(1 <= num.length && num.length <= 3)) {
      return i18n("Country code is not the right length");
    }
  } else if (type === "phone_number_area") {
    if (num != num.replace(/\D/g, "")) {
      return i18n("Phone number can only contain digits.");
    }

    // we can accept numbers with no area code
    if (!(0 <= num.length && num.length <= 3)) {
      return i18n("Area code is not the right length");
    }
  } else if (type === "phone_number_number") {
    // check for extensions
    if (num.indexOf("x") >= 0) {
      const example = "<br>Ex. + 1 - 234 - 5678910x1234";
      // verify that it has an extension formatted properly
      const numArray = num.split("x");

      // if there isn't the right amount of parts
      if (numArray.length != 2) {
        return `${i18n(
          "Phone numbers with extensions can only have one x.",
        )}${example}`;
      }

      if (numArray[1].length == 0) {
        return `${i18n("Extension number missing.")}${example}`;
      }

      // if there are non-digits in the extension
      if (numArray[1] != numArray[1].replace(/\D/g, "")) {
        return `${i18n(
          "Extension cannot contain non-number characters.",
        )}${example}`;
      }

      // otherwise, validate the non-extension part of the number
      return validatePhoneNumberComponent(type, numArray[0]);
    } else {
      if (num != num.replace(/\D/g, "")) {
        return i18n("Phone number can only contain digits.");
      }

      // no extensions
      if (!(6 <= num.length && num.length <= 11)) {
        return i18n("Phone number is not the right length");
      }
    }
  } else {
    // if 'type' did not match any of the phone number components
    // TODO [lliepert]: added in missing i18n call, should we?
    return i18n("Unhandled exception, please contact support");
  }

  return true;
};

export const copyTextToClipboard = (text: string): void => {
  const textArea = document.createElement("textarea");

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = "2em";
  textArea.style.height = "2em";

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = "0";

  // Clean up any borders.
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = "transparent";

  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    document.execCommand("copy");
  } catch (err) {
    // pass
  }

  document.body.removeChild(textArea);
};

// add leading '+' if necessary, and remove leading 0s
export const cleanPhoneNumber = (phone_number: string): string => {
  // add leading '+' if necessary
  if (phone_number[0] != "+") {
    phone_number = "+" + phone_number;
  }

  // remove leading 0s
  while (phone_number.indexOf("+0") >= 0) {
    phone_number = "+" + phone_number.substring(2, phone_number.length);
  }
  return phone_number;
};

export const pluralStr = (
  num: number,
  singular: string,
  plural: string,
): string => {
  if (num == 1) {
    return singular;
  }
  return plural;
};

export const isInt = (n: number): boolean => {
  return n % 1 == 0;
};

export const addCommas = (nStr: string): string => {
  nStr += "";
  const x = nStr.split(".");
  let x1 = x[0];
  const x2 = x.length > 1 ? "." + x[1] : "";
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
};

export const getRatio = (
  numerator: string,
  denominator: string,
  accuracy: number,
  is_percent: boolean,
): string => {
  const x = parseFloat(numerator);
  const y = parseFloat(denominator);
  let to_return = 0;
  if (y != 0 && !isNaN(y) && !isNaN(x)) {
    to_return = (x * 1.0) / y;
  }

  if (is_percent == true && to_return > 100) {
    to_return = 100.0;
  }
  return to_return.toFixed(accuracy);
};

export const checkTimeFromNow = (time: string, diff: number): boolean => {
  /* Check if time is more than diff days in the past
   * time - mm-dd-yyyy
   * diff - number of days
   */
  const today = new Date();
  const d = new Date(
    // TODO [lliepert]: code was missing parse floats; need to test this
    parseFloat(time.substring(6)),
    parseFloat(time.substring(0, 2)) - 1,
    parseFloat(time.substring(3, 5)),
  );
  d.setDate(d.getDate() + diff);
  return d < today;
};

/* Return a Date object from a string that is formatted %m-%d-%Y */
export const createDateFromString = (dateStr: string): Date => {
  const splitDateStr = dateStr.split("-");
  const date = new Date(
    parseFloat(splitDateStr[2]),
    parseFloat(splitDateStr[0]) - 1,
    parseFloat(splitDateStr[1]),
  );
  return date;
};

/* Format a currency symbol based on currency code
 *
 * params:
 *   currencyCode     - alphabetical currency code
 *   symbol           - base symbol of the currency
 */
export const formatCurrencySymbol = (
  currencyCode: string,
  symbol: string,
): string => {
  let currencySymbol = symbol;

  if (currencyCode != "USD") {
    currencySymbol = currencyCode + " " + symbol;
  }

  return currencySymbol;
};

export const formatForeignCurrency = (
  _n: number,
  currencyCode: string,
): string => {
  // This is deprecated, use legoFormatCurrency directly
  return legoFormatCurrency(_n, currencyCode);
};

export const formatCurrency = (
  _n: string,
  includeDollar: boolean,
  shouldAddCommas: boolean,
  maxNumber: number,
  currencyName: string,
): string => {
  /* Format a number as money. Add a $ sign, commas, and round to 2 digits
   * if the number is not an integer
   *
   * params:
   *   n                - the number to format
   *   includeDollar    - whether or not to include the dollar sign.
   *                      Default = true
   *   shouldAddCommas  - whether or not to add commas. Default = true
   *   maxNumber        - if specified, any number greater than
   *                      maxNumber will be shown as "maxNumber+".
   *                      Default = undefined/unspecified
   */
  let n = parseFloat(_n);
  if (isNaN(n)) {
    return _n;
  }

  if (typeof includeDollar === "undefined") {
    includeDollar = true;
  }
  if (typeof shouldAddCommas === "undefined") {
    shouldAddCommas = true;
  }
  let addPlus = false;
  if (maxNumber && !isNaN(maxNumber)) {
    if (n > maxNumber) {
      n = maxNumber;
      addPlus = true;
    }
  }
  let formatted = n.toFixed(2);

  if (shouldAddCommas) {
    formatted = addCommas(formatted);
  }
  if (includeDollar) {
    formatted = "$" + formatted;
    // if number is negative, we want the currency to render as
    // '-$3.14, instead of $-3.14'
    if (n < 0) {
      const dollar_sign = formatted.charAt(0);
      const negative_sign = formatted.charAt(1);
      formatted = negative_sign + dollar_sign + formatted.substring(2);
    }
  }
  if (addPlus) {
    formatted = formatted + "+";
  }
  if (currencyName) {
    formatted =
      formatted +
      '<span class="currency-subscript">' +
      currencyName +
      "</span>";
  }
  return formatted;
};

export const validateVolume = (str: string): boolean => {
  const volume_format =
    /^(\d+(\.\d+)?)\s*(ml|l|oz\.?|m\^3|cm\^3|gallon|quart|cup|qt\.?|pt\.?|litre|liter|pint|fl\.?\s?oz\.?)s?$/gi;
  if (str.match(volume_format)) return true;
  return false;
};

export const validateLength = (str: string): boolean => {
  const length_format_1 =
    // eslint-disable-next-line no-useless-escape
    /^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;
  const length_format_2 =
    // eslint-disable-next-line no-useless-escape
    /^(\d+(\.\d+)?)\s*(ft.?|feet|\')\s*(\d+(\.\d+)?)\s*(in\.?|inche(es)?|\")$/gi;

  if (str.match(length_format_1) || str.match(length_format_2)) return true;
  return false;
};

export const validateArea = (str: string): boolean => {
  const area_format_1 =
    // eslint-disable-next-line no-useless-escape
    /^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;
  const area_format_2 =
    // eslint-disable-next-line no-useless-escape
    /^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|X|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;

  if (str.match(area_format_1) || str.match(area_format_2)) return true;
  return false;
};

export const validateVoltage = (str: string): boolean => {
  const voltage_format = /^(\d+(\.\d+)?)\s*v$/gi;
  if (str.match(voltage_format)) return true;
  return false;
};

export const validateWattage = (str: string): boolean => {
  const wattage_format = /^(\d+(\.\d+)?)\s*w$/gi;
  if (str.match(wattage_format)) return true;
  return false;
};

export const validateCustom = (str: string): boolean => {
  if (str.length <= 50) return true;
  return false;
};

export const validateWeight = (str: string): boolean => {
  const weight_format =
    /^(\d+(\.\d+)?)\s*(mg|g|kg|oz\.?|ounce|gram|pound|lb)s?$/gi;
  if (str.match(weight_format)) return true;
  return false;
};

export const validateSize = (
  size_string: string,
  valid_size_names: string,
): string | boolean => {
  if (
    _.indexOf(valid_size_names, size_string) != -1 ||
    !isNaN(Number(size_string))
  ) {
    return false;
  } else if (
    validateWeight(size_string) ||
    validateLength(size_string) ||
    validateVoltage(size_string) ||
    validateArea(size_string) ||
    validateVolume(size_string) ||
    validateWattage(size_string) ||
    validateCustom(size_string)
  ) {
    return false;
  } else {
    return "Invalid size";
  }
};

export const validateColor = (
  color_string: string,
  valid_color_names: string,
  valid_color_names_merchant: string,
  allow_custom_colors: boolean,
): string | boolean => {
  if (allow_custom_colors) {
    // eslint-disable-next-line no-useless-escape
    const custom_format = /^[a-zA-Z0-9][\ ]*([a-zA-Z0-9'\.\-\/\\&][\ ]*)*$/gi;

    if (!color_string.match(custom_format) || color_string.length > 50) {
      // TODO [lliepert]: added i18n call, is this valid?
      return i18n("Invalid color");
    }
    return false;
  }

  const colors = color_string
    .toLowerCase()
    .replace(/ /g, "")
    .replace(/\//g, "&")
    .replace(/\+/g, "&")
    .replace(/\\/g, "&")
    .split("&");

  if (colors.length > 5) {
    // TODO [lliepert]: added i18n call, is this valid?
    return i18n("No more than five colors");
  }

  const invalid_colors_english = _.filter(
    colors,
    _.bind((color) => {
      return _.indexOf(valid_color_names, color) == -1;
    }, this),
  );

  if (invalid_colors_english.length) {
    const invalid_colors_merchant = _.filter(
      colors,
      _.bind((color) => {
        return _.indexOf(valid_color_names_merchant, color) == -1;
      }, this),
    );

    if (invalid_colors_merchant.length) {
      // TODO [lliepert]: added i18n call, is this valid?
      return i18n("Invalid color");
    }
  }

  return false;
};

export const validateShippingTime = (time_string: string): boolean | string => {
  const shipping_times = time_string.split("-");

  if (shipping_times.length == 2) {
    const min_shipping_time_str = shipping_times[0];
    const max_shipping_time_str = shipping_times[1];

    if (
      isInt(parseInt(min_shipping_time_str)) &&
      isInt(parseInt(max_shipping_time_str))
    ) {
      const min_shipping_time = parseInt(min_shipping_time_str);
      const max_shipping_time = parseInt(max_shipping_time_str);
      if (min_shipping_time >= 2 && max_shipping_time > min_shipping_time) {
        return false;
      }
    }
  }

  // TODO [lliepert]: added i18n call, is this valid?
  return i18n("Invalid shipping time");
};

export const containsChineseCharacter = (str: string): boolean => {
  const re = /^.*[\u4E00-\u9FA5].*$/;
  return re.test(str);
};

export const validateEmail = (email: string): boolean => {
  const re =
    // eslint-disable-next-line no-useless-escape
    /(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-011\013\014\016-\177])*")@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,10}\.?$/i;
  return re.test(email);
};

export const validateCountry = (
  country: string,
  allCountries: string[],
): boolean | string => {
  if (allCountries.indexOf(country) >= 0) {
    return false;
  }
  return i18n("Invalid country code, legal examples: CN or US");
};

export const validateDeclaredName = (
  declaredName: string,
  isLocalName: boolean,
): boolean | string => {
  isLocalName = !!isLocalName;

  const isInvalidBasic = () => {
    return (
      typeof declaredName !== "string" ||
      declaredName.length <= 1 ||
      declaredName.length > 200
    );
  };
  const isContainInvalid = () => {
    // If updating this also update the value
    // in lib/products/csv/csv_parser.py
    const containsNotationRe = /[^\w\s,&.\-/\u4E00-\u9FA5]/;
    return (
      containsNotationRe.test(declaredName) ||
      (!isLocalName && containsChineseCharacter(declaredName))
    );
  };
  const isBeginWithInvalid = () => {
    const beginWithUnderlineRe = /^_/;
    return beginWithUnderlineRe.test(declaredName);
  };
  const isContainNoWordCharacter = () => {
    const regularWordCharRe = /[a-zA-Z]/;
    return (
      !regularWordCharRe.test(declaredName) &&
      (!isLocalName || !containsChineseCharacter(declaredName))
    );
  };

  if (
    isInvalidBasic() ||
    isContainInvalid() ||
    isBeginWithInvalid() ||
    isContainNoWordCharacter()
  ) {
    return i18n("Invalid declared name");
  }
  return false;
};

export const validateDeclaredLocalName = (
  declaredLocalName: string,
): boolean | string => {
  return validateDeclaredName(declaredLocalName, true);
};

export const validateURL = (url: string): boolean => {
  const re = /^.+\..+\/.+$/;
  return re.test(url);
};

export const validateWebsiteLink = (link: string): boolean => {
  const re = /^.+\..+$/;
  return re.test(link);
};

export const validateMinMaxShipTime = (ship_time: number): boolean | string => {
  // check if ship_time is an integer
  if (ship_time % 1 == 0) {
    return false;
  }

  // TODO [lliepert]: added i18n call, is this valid?
  return i18n("Ship time must be a number");
};

export const validatePrice = (price: string): boolean | string => {
  const re = /^\d{0,5}(\.\d{0,2}){0,1}$/;
  if (re.exec(price)) {
    return false;
  }
  // TODO [lliepert]: added i18n call, is this valid?
  return i18n("Invalid retail price");
};

export const validateShipping = (price: string): boolean | string => {
  if (!price) {
    // TODO [lliepert]: added i18n call, is this valid?
    return i18n("Price is required");
  }
  const re = /^\d*(\.\d{0,2}){0,1}$/;
  if (re.exec(price)) {
    return false;
  }
  // TODO [lliepert]: added i18n call, is this valid?
  return i18n("Invalid shipping price");
};

export const validateEmptyShipping = (price: string): boolean | string => {
  const re = /^\d*(\.\d{0,2}){0,1}$/;
  if (re.exec(price)) {
    return false;
  }
  // TODO [lliepert]: added i18n call, is this valid?
  return i18n("Invalid shipping price");
};

export const validateInventory = (inv: string): boolean | string => {
  if (!inv) {
    return false;
  }
  const re = /^(0|[1-9]\d*)$/;
  if (re.exec(inv)) {
    return false;
  }
  // TODO [lliepert]: added i18n call, is this valid?
  return i18n("Invalid inventory");
};

export const escapeCSS = (text: string): boolean | string => {
  // For escaping CSS Selector special characters
  // eslint-disable-next-line no-useless-escape
  return text.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\\\$&");
};

export const is_ascii = (text: string): boolean => {
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) >= 128) {
      return false;
    }
  }
  return true;
};

// note: char code < 256 is actually a superset of Latin1
export const is_latin1 = (text: string): boolean => {
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) >= 256) {
      return false;
    }
  }

  // if text contains invalid characters
  if (text.replace(/\W+/g, "") != text) {
    return false;
  }

  return true;
};

export const shortenWithEllipsis = (text: string, length: number): string => {
  if (length <= 3) {
    return "...";
  }

  if (text.length > length) {
    return text.substr(0, length - 3) + "...";
  }

  return text;
};

export const cleanStr = (str: string): string => {
  const clean_str = str.trim().toLowerCase();
  return clean_str.replace(/\W/g, ""); // remove internal whitespace
};
export const fuzzyStrMatch = (str1: string, str2: string): boolean => {
  return cleanStr(str1 || "") == cleanStr(str2 || "");
};

export const validateObjectId = (id: string): boolean => {
  if (!id) {
    return false;
  }
  const objectIdRegex = /^[a-f\d]{24}$/i;
  return objectIdRegex.test(id);
};
