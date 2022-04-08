/* External Libraries */
import { PhoneNumberUtil } from "google-libphonenumber";
import validator from "validator";
import moment from "moment/moment";
import Id from "valid-objectid";
import {
  Validator,
  ValidationResponse,
} from "@ContextLogic/lego/toolkit/forms/validators";
import {
  RequiredValidator,
  EmailValidator,
  RegexBasedValidator,
  CurrencyValidator,
} from "@ContextLogic/lego/toolkit/forms/validators";
import get from "lodash/get";
import isInteger from "lodash/isInteger";

// Re-exported to not break existing imports.
export {
  Validator,
  RequiredValidator,
  EmailValidator,
  RegexBasedValidator,
  CurrencyValidator,
};
export type { ValidationResponse };

/* Toolkit */
import { call } from "@toolkit/api";
import { DatetimeInput } from "@schema/types";

export class CharacterLength extends Validator {
  minimum: number | null | undefined;
  maximum: number | null | undefined;

  constructor({
    minimum,
    maximum,
    customMessage,
  }: {
    customMessage?: string | null | undefined;
    minimum?: number;
    maximum?: number;
  } = {}) {
    super({ customMessage });
    if (minimum != null && maximum != null) {
      if (minimum > maximum) {
        throw `minimum (${minimum}) cannot be larger than maximum (${maximum})`;
      }
    }
    this.minimum = minimum;
    this.maximum = maximum;
  }

  async validateText(text = ""): Promise<ValidationResponse> {
    const value = text.trim();
    const { maximum, minimum } = this;
    if (minimum != null && value.length < minimum) {
      return this.errorMessage();
    }

    if (maximum != null && value.length > maximum) {
      return this.errorMessage();
    }

    return null;
  }

  errorMessage(): string | null | undefined {
    const { customMessage, maximum, minimum } = this;
    if (maximum != null && minimum != null) {
      if (customMessage) {
        return customMessage;
      }

      if (maximum === minimum) {
        if (maximum === 1) {
          return i`This field should only be 1 character long`;
        }

        return i`This field should be ${maximum} characters long`;
      }

      return i`This field must be ${minimum} - ${maximum} characters long`;
    }

    if (maximum != null) {
      if (customMessage) {
        return customMessage;
      }

      return i`This field cannot be longer than ${maximum} characters`;
    }

    if (minimum != null) {
      if (customMessage) {
        return customMessage;
      }

      return i`This field must be at least ${minimum} characters`;
    }

    return null;
  }
}

export class PasswordValidator extends Validator {
  static minimumScore = 2;

  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;
    return [
      new RequiredValidator({ customMessage }),
      new CharacterLength({ customMessage, minimum: 8 }),
    ];
  }

  async validateText(text = ""): Promise<ValidationResponse> {
    const resp = await call("user/password-score", {
      password: text,
    });

    if (resp.code !== 0) {
      return i`Something went wrong`;
    }

    if (resp.data.score < PasswordValidator.minimumScore) {
      return i`Please enter a stronger password`;
    }

    return null;
  }
}

export class StoreNameValidator extends Validator {
  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;
    return [
      new RequiredValidator({ customMessage }),
      new CharacterLength({ customMessage, maximum: 30 }),
      new RegexBasedValidator({
        customMessage:
          customMessage || i`Store name contains invalid characters`,
        pattern: /^[A-z\d\u00C0-\u00ff\s'\.,-\/#!$%\^&\*;:{}=\-_`~()]+$/,
      }),
    ];
  }

  async validateText(text = ""): Promise<ValidationResponse> {
    const value = text.trim().toLowerCase();

    if (value.toLowerCase().indexOf("wish") !== -1) {
      return i`Store name cannot contain "Wish" text`;
    }
    if (value.indexOf(".") !== -1) {
      return i`Store name is invalid`;
    }
    const resp = await call("merchants/merchant-uniqueness", {
      store_name: text,
    });

    if (resp.code === 0) {
      const brandResponse = await call("merchants/no-brands-in-storename", {
        store_name: text,
      });

      if (brandResponse.code === 0) {
        return null;
      }

      if (brandResponse.code === 23) {
        return i`Store name taken, please try another name`;
      }

      return brandResponse.msg;
    }

    if (resp.code === 22) {
      return i`Store name taken, please try another name`;
    }
  }
}

export class CaptchaValidator extends Validator {
  getRequirements(): ReadonlyArray<Validator> {
    const customMessage = i`Please enter the captcha code.`;
    return [new RequiredValidator({ customMessage })];
  }
}

export class PhoneNumberValidator extends Validator {
  countryCode: string;
  allowEmpty?: boolean;

  constructor({
    customMessage,
    countryCode,
    allowEmpty,
  }: {
    customMessage?: string | null | undefined;
    countryCode: string;
    allowEmpty?: boolean;
  }) {
    super({ customMessage });
    this.countryCode = countryCode;
    this.allowEmpty = allowEmpty;
  }

  async validateText(text = ""): Promise<ValidationResponse> {
    const { customMessage, countryCode, allowEmpty } = this;
    const value = text.trim();

    if (value.length === 0 && allowEmpty) {
      return null;
    }

    const phoneUtil = PhoneNumberUtil.getInstance();
    let phoneCountryCode = countryCode;
    let isValid = false;
    try {
      const number = phoneUtil.parseAndKeepRawInput(value, countryCode);
      const nationalNumber = String(number.getNationalNumber());
      const usSpecialStateMap = {
        "671": "GU",
      };

      const specialUSStateKeyArray = [...Object.keys(usSpecialStateMap)];
      specialUSStateKeyArray.sort((a, b) => b.length - a.length);

      if (countryCode == "US") {
        const stateKey = specialUSStateKeyArray.find((key) =>
          nationalNumber.startsWith(key)
        );
        if (stateKey) {
          // if you find this please fix the any types (legacy)
          phoneCountryCode = (usSpecialStateMap as any)[stateKey];
        }
      }

      if (
        phoneUtil.getCountryCodeForRegion(phoneCountryCode).toString() == "1"
      ) {
        isValid = phoneUtil.isValidNumberForRegion(number, phoneCountryCode);
      } else {
        // For non-US/CA phone numbers, check validity of number format only.
        // Valid phone number from other international territories, such as
        // the Isle of Man, certain French overseas territories, etc. may not
        // validate against their parent country.
        // See https://godoc.org/github.com/ttacon/libphonenumber#IsValidNumberForRegion
        isValid = phoneUtil.isValidNumber(number);
      }
    } finally {
      if (!isValid) {
        if (customMessage) {
          return customMessage;
        }
        return i`Please enter a valid ${countryCode} phone number`;
      }
    }

    return null;
  }
}

export class NoWishEmailsValidator extends Validator {
  getRequirements(): ReadonlyArray<Validator> {
    return [new EmailValidator()];
  }

  async validateText(text = ""): Promise<ValidationResponse> {
    const { customMessage } = this;
    const value = text.trim().toLowerCase();

    if (
      value.indexOf("@wish.com") > 0 ||
      value.indexOf("@contextlogic.com") > 0
    ) {
      if (customMessage) {
        return customMessage;
      }
      return i`This email address is not allowed`;
    }

    return null;
  }
}

export class WishContextlogicAccentureEmailValidator extends Validator {
  getRequirements(): ReadonlyArray<Validator> {
    return [new EmailValidator()];
  }

  async validateText(text = ""): Promise<ValidationResponse> {
    const { customMessage } = this;
    const value = text.trim().toLowerCase();

    const hasAllowedEmail =
      value.indexOf("@wish.com") > 0 ||
      value.indexOf("@contextlogic.com") > 0 ||
      value.indexOf("@accenture.com") > 0;

    if (!hasAllowedEmail) {
      if (customMessage) return customMessage;

      return (
        `This email address is not allowed, permitted domains are @wish.com, ` +
        `@contextlogic.com, and @accenture.com`
      );
    }

    return null;
  }
}

export class UrlValidator extends Validator {
  async validateText(text = ""): Promise<ValidationResponse> {
    const { customMessage } = this;
    const isValid = validator.isURL(text, {
      protocols: ["http", "https"],
      require_protocol: false,
      disallow_auth: true,
    });

    if (!isValid) {
      if (customMessage) {
        return customMessage;
      }
      return i`Please enter a valid url`;
    }

    return null;
  }
}

export class SecureUrlValidator extends Validator {
  async validateText(text = ""): Promise<ValidationResponse> {
    const { customMessage } = this;
    const isValid = validator.isURL(text, {
      protocols: ["https"],
      require_protocol: true,
      disallow_auth: true,
    });

    if (!isValid) {
      if (customMessage) {
        return customMessage;
      }
      return i`Please enter a valid https url`;
    }

    return null;
  }
}

export class StoreUrlValidator extends Validator {
  getRequirements(): ReadonlyArray<Validator> {
    return [new UrlValidator()];
  }

  async validateText(text = ""): Promise<ValidationResponse> {
    const resp = await call("merchants/url-validate", {
      store_url: text,
    });

    if (resp.code !== 0) {
      return resp.msg;
    }
    if (resp.data.url_issue) {
      return resp.data.url_issue;
    }

    return null;
  }
}

export class DateFormatValidator extends Validator {
  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;
    return [
      new RegexBasedValidator({
        customMessage:
          customMessage || i`Value requires a date format as 'mm/dd/yyyy'`,
        pattern:
          /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/,
      }),
    ];
  }
}

export class NumbersOnlyValidator extends Validator {
  PATTERN = /^\d+$/;

  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;
    return [
      new RegexBasedValidator({
        customMessage: customMessage || i`Value must be a whole number`,
        pattern: /^\d+$/,
      }),
    ];
  }
}

export class ChineseOnlyValidator extends Validator {
  PATTERN = /^[\u4E00-\u9FA5]+$/;

  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;
    return [
      new RegexBasedValidator({
        customMessage: customMessage || i`Value must be in Chinese only`,
        pattern: /^[\u4E00-\u9FA5]+$/,
      }),
    ];
  }
}

export class USZipcodeOnlyValidator extends Validator {
  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;
    return [
      new CharacterLength({ customMessage, minimum: 5, maximum: 5 }),
      new NumbersOnlyValidator({
        customMessage: i`US zipcodes should only contain numbers`,
      }),
    ];
  }
}

export class CNZipcodeOnlyValidator extends Validator {
  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;
    return [
      new CharacterLength({ customMessage, minimum: 6, maximum: 6 }),
      new NumbersOnlyValidator({
        customMessage: i`CN zipcodes should only contain numbers`,
      }),
    ];
  }
}

export class TaxNumberValidator extends Validator {
  /*
   * These values come from here. Add more countries as needed.
   * https://docs.google.com/spreadsheets/d/1Pn5enzL_-EZBWf2-TjbdEptprj9OUCSOQqQbSyHisWY/edit#gid=978019023
   */

  CountryNumberMasks = {
    FR: /^FR[A-Z0-9]{2}\d{9}$|^EU/,
    DE: /^DE\d{9}$|^\d{11}$|^EU/,
    ES: /^(ES)?[A-Z0-9]\d{7}[A-Z0-9]$|^EU/,
    GB: /^GB\d{9}$|^GB\d{12}$|^GB[A-Z]{2}\d{3}$|^EU/,
    SE: /^SE\d{12}$|^EU/,
    AU: /^((ABN)\s)?\d{2}\s\d{3}\s\d{3}\s\d{3}(\s\d{3})?$|^(ABN)?\d{11}(\d{3})?$|^(ARN)?\d{12}$/,
    CA: /^\d{9}(RT(\d{4})?)?$|^\d{9}RR\d{4}$/,
    IT: /^(IT)?\d{11}$|^EU/,
    JP: /^\d{13}$/,
    AL: /^(J|K|L)\d{8}[A-Z]$/,
    AT: /^ATU\d{8}$|^AT U\d{8}$|^\d{2}\s\d{3}\/\d{4}$|^EU/,
    BE: /^BE\d{10}$|^BE\s0\d{9}$|^EU/,
    BA: /^\d{12}$/,
    BG: /^\d{9,10}$|^BG\d{9,10}$|^EU/,
    HR: /^(HR)?\d{11}$|^EU/,
    CY: /^CY\d{8}[A-Z]$|^EU/,
    CZ: /^CZ\d{8}$|^CZ\d{9}$|^CZ\d{10}$|^EU/,
    DK: /^(DK)?\d{8}$|^EU/,
    EE: /^EE\d{9}$|^EU/,
    FI: /^FI\d{8}$|^EU/,
    GR: /^EL\d{9}$|^EU/,
    HU: /^HU\d{8}$|^\d{8}-\d-\d{2}$|^EU/,
    IE: /^IE\d{7}[A-Z]{1,2}$|^IE\d[A-Z]\d{5}[A-Z]$|^IE\d\W\d{5}[A-Z]$|^EU/,
    LV: /^LV\d{11}$|^LV\s\d{4}\s\d{3}\s\d{4}$|^EU/,
    LI: /^\d{2}\s\d{3}$|^\d{5}$/,
    LT: /^LT\d{9}$|^LT\d{12}$|^LT\d{4}\s\d{3}\s\d{2}$|^EU/,
    LU: /^LU\d{8}$|^EU/,
    MK: /^MK\d{13}$/,
    MX: /^[A-Z&]{3,4}-?\d{6}-?\w{3}$/,
    NL: /^NL\d{9}B\d{2}$|^EU/,
    NO: /^(NO)?\s?\d{3}\s?\d{3}\s?\d{3}\s?MVA$/,
    PL: /^(PL)?\s?\d{10}$|^(PL)?\s?\d{3}-\d{2}-\d{2}-\d{3}$|^(PL)?\s?\d{3}-\d{3}-\d{2}-\d{2}$|^EU/,
    PT: /^PT\d{9}$|^EU/,
    RO: /^EU|^RO\d{2,10}$/,
    RU: /^\d{10}$|^\d{4}\s\d{5}\s\d{1}$|^\d{12}$/,
    RS: /^\d{9}$/,
    SK: /^SK\d{10}$|^SK\d{9}$|^EU/,
    SI: /^SI\d{8}$|^EU/,
    TR: /^\d{10}$|^\d{3}\s\d{3}\s\d{4}$|^\d{11}$/,
    UA: /^\d{3}\s?\d{3}\s?\d{3}\s?(\d{3})?$/,
    MC: /^FR[A-Z0-9]{2}\d{9}$|^EU/,
    OSS: /\d/,
  };

  StateNumberMasks = {
    CA: {
      BC: /^R\d{6}$|^(PST\-)?\d{4}\-\d{4}$/,
      MT: /^\d{6}\-\d$|^\d{7}$|^\d{9}MT|^\d{9}MC/,
      QC: /^\d{10}TQ(\d{4})?$/,
      SK: /^\d{7}$/,
      MB: /^\d{6}\-\d$|^\d{7}$|^\d{9}MT|^\d{9}MC/,
    },
  };

  countryCode: string;
  stateCode: string | null | undefined;

  constructor({
    customMessage = i`You entered an invalid tax ID. Please check and try again.`,
    countryCode,
    stateCode,
  }: {
    customMessage?: string | null | undefined;
    countryCode: string;
    stateCode?: string | null | undefined;
  }) {
    super({ customMessage });
    this.stateCode = stateCode != null ? stateCode.toUpperCase() : null;
    this.countryCode = countryCode.toUpperCase();
  }

  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage, countryCode, stateCode } = this;
    const requirements = [new RequiredValidator({ customMessage })];

    let pattern: any | null | undefined = null;

    if (stateCode == null) {
      pattern = (this.CountryNumberMasks as any)[countryCode];
    } else {
      // _.get() is needed here because of the nested dynamic access.
      // Can't be accomplished with optional chaining.
      // eslint-disable-next-line local-rules/no-unnecessary-use-of-lodash
      pattern = get(this.StateNumberMasks, `${countryCode}.${stateCode}`);
    }

    if (pattern != null) {
      requirements.push(
        new RegexBasedValidator({
          customMessage,
          pattern,
        })
      );
    }

    return requirements;
  }
}

export class ObjectIdValidator extends Validator {
  async validateText(text = ""): Promise<ValidationResponse> {
    const { customMessage } = this;
    const value = text.trim();
    if (!Id.isValid(value)) {
      if (customMessage) {
        return customMessage;
      }

      return i`Please enter a valid ID`;
    }

    return null;
  }
}

export class DateValidator extends Validator {
  PATTERN =
    /(^$)|(^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:19|20)\d{2})\s*$)/;

  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage, PATTERN } = this;
    return [
      new RegexBasedValidator({
        customMessage: customMessage || i`Enter date in DD/MM/YYYY format`,
        pattern: PATTERN,
      }),
    ];
  }
}

export class MinMaxValueValidator extends Validator {
  minAllowedValue: number | null | undefined;
  maxAllowedValue: number | null | undefined;

  constructor({
    customMessage,
    minAllowedValue,
    maxAllowedValue,
    allowBlank,
  }: {
    customMessage?: string | null | undefined;
    minAllowedValue?: number;
    maxAllowedValue?: number;
    allowBlank?: boolean;
  } = {}) {
    super({ customMessage, allowBlank });
    this.minAllowedValue = minAllowedValue;
    this.maxAllowedValue = maxAllowedValue;
  }

  async validateText(text = ""): Promise<ValidationResponse> {
    const { customMessage, minAllowedValue, maxAllowedValue } = this;
    let value = text.trim();
    if (value[0] === "$") {
      value = value.substring(1);
    }

    const floatValue = parseFloat(value);
    if (
      isNaN(floatValue) ||
      (typeof maxAllowedValue === "number" && floatValue > maxAllowedValue) ||
      (typeof minAllowedValue === "number" && floatValue < minAllowedValue)
    ) {
      return customMessage || i`Value not in the limit.`;
    }

    return null;
  }
}

export class JSONValidator extends Validator {
  customMessage: string | null | undefined;

  constructor({
    customMessage,
  }: {
    customMessage?: string | null | undefined;
  }) {
    super({ customMessage });
    this.customMessage = customMessage;
  }

  async validateText(text = ""): Promise<ValidationResponse> {
    try {
      JSON.parse(text);
    } catch (e) {
      return this.customMessage || i`Value is not a valid JSON object.`;
    }
    return null;
  }
}

export class MatchValueValidator extends Validator {
  customMessage: string | null | undefined;
  matchedString: string | null | undefined;

  constructor({
    customMessage,
    matchedString,
  }: {
    customMessage?: string | null | undefined;
    matchedString: string | null | undefined;
  }) {
    super({ customMessage });
    this.matchedString = matchedString;
  }

  async validateText(text = ""): Promise<ValidationResponse> {
    if (text !== this.matchedString) {
      return this.customMessage || i`Values do not match`;
    }
    return null;
  }
}

export class NumberRangeValidator extends Validator {
  minimum: number | null | undefined;
  maximum: number | null | undefined;

  constructor({
    customMessage,
    minimum,
    maximum,
  }: {
    customMessage?: string | null | undefined;
    minimum?: number;
    maximum?: number;
  } = {}) {
    super({ customMessage });
    if (minimum != null && maximum != null) {
      if (minimum > maximum) {
        throw `minimum (${minimum}) cannot be larger than maximum (${maximum})`;
      }
    }
    if (!!minimum && !!maximum) {
      throw `Required values 'minimum' and 'maximum' were not provided`;
    }
    this.minimum = minimum;
    this.maximum = maximum;
  }

  async validateText(text = ""): Promise<ValidationResponse> {
    const { minimum, maximum } = this;
    if (text.length == 0) {
      return null;
    }

    try {
      const value = parseInt(text);
      if (minimum != null && value < minimum) {
        return this.errorMessage();
      }

      if (maximum != null && value > maximum) {
        return this.errorMessage();
      }
    } catch (err) {
      return this.errorMessage();
    }

    return null;
  }

  errorMessage(): string | null | undefined {
    const { customMessage } = this;
    if (customMessage) {
      return customMessage;
    }
    return i`Provided value is not valid`;
  }
}

export class HoursValidator extends Validator {
  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;
    return [
      new CharacterLength({ customMessage, minimum: 1, maximum: 2 }),
      new NumbersOnlyValidator({
        customMessage: i`Time should only contain numbers`,
      }),
      new NumberRangeValidator({
        customMessage: i`Hours should be between 0-12`,
        minimum: 0,
        maximum: 12,
      }),
    ];
  }
}

export class MinutesValidator extends Validator {
  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;
    return [
      new CharacterLength({ customMessage, minimum: 1, maximum: 2 }),
      new NumbersOnlyValidator({
        customMessage: i`Time should only contain numbers`,
      }),
      new NumberRangeValidator({
        customMessage: i`Minutes should be between 0-59`,
        minimum: 0,
        maximum: 59,
      }),
    ];
  }
}

export class UPCValidator extends Validator {
  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;
    return [
      new RegexBasedValidator({
        customMessage: customMessage || i`Enter a valid GTIN code`,
        pattern: /^([0-9]){8,14}$/,
      }),
    ];
  }
}

export class GtinValidator extends Validator {
  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;
    return [
      new RegexBasedValidator({
        customMessage: customMessage || i`Enter a valid GTIN code`,
        pattern: /^([0-9]){8,14}$/,
      }),
    ];
  }
}

export class CustomsHsCodeValidator extends Validator {
  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;
    const defaultMessage = i`Enter a valid customs HS code`;
    return [
      new RegexBasedValidator({
        customMessage: customMessage || defaultMessage,
        pattern: /^(\d*\.){0,2}\d*$/,
      }),
      new RegexBasedValidator({
        customMessage: customMessage || defaultMessage,
        pattern: /^([\.]*\d){6,10}[\.]*$/,
      }),
    ];
  }
}

export class IntegerValidator extends Validator {
  constructor({
    customMessage,
    allowBlank,
  }: {
    customMessage?: string | null | undefined;
    allowBlank?: boolean;
  } = {}) {
    super({ customMessage, allowBlank });
  }

  async validateText(text = ""): Promise<ValidationResponse> {
    const { customMessage } = this;
    const value = text.trim();
    const floatValue = parseFloat(value);
    if (isNaN(floatValue) || !isInteger(floatValue)) {
      return customMessage || i`Value must be an integer`;
    }

    return null;
  }
}

export class NonZeroValidator extends Validator {
  constructor({
    customMessage,
    allowBlank,
  }: {
    customMessage?: string | null | undefined;
    allowBlank?: boolean;
  } = {}) {
    super({ customMessage, allowBlank });
  }

  async validateText(text = ""): Promise<ValidationResponse> {
    const { customMessage } = this;
    const value = text.trim();
    const floatValue = parseFloat(value);
    if (isNaN(floatValue) || floatValue === 0) {
      return customMessage || i`Value cannot be zero`;
    }

    return null;
  }
}

export class UploadFileRequiredValidator extends Validator {
  async validateText(text = ""): Promise<ValidationResponse> {
    const { customMessage } = this;
    const errorMsg = customMessage || i`This document is required`;
    try {
      const parsedValue = JSON.parse(text);
      const isValid = Array.isArray(parsedValue) && parsedValue.length > 0;
      if (!isValid) {
        return errorMsg;
      }
    } catch (err) {
      return errorMsg;
    }
    return null;
  }
}

export class CheckBoxRequiredValidator extends Validator<boolean> {
  async validateText(value: boolean): Promise<ValidationResponse> {
    const { customMessage } = this;
    const errorMsg = customMessage || i`This field is required`;
    if (!value) {
      return errorMsg;
    }
    return null;
  }
}

export class DatetimeInputValidator extends Validator<DatetimeInput> {
  format: string;
  cannotSelectFuture: boolean;
  cannotSelectPast: boolean;
  required: boolean;

  constructor(config: {
    format: string;
    cannotSelectFuture?: boolean;
    cannotSelectPast?: boolean;
    required?: boolean;
  }) {
    const {
      format,
      cannotSelectFuture = false,
      cannotSelectPast = false,
      required = false,
    } = config || {};
    super({});
    this.format = format;
    this.cannotSelectFuture = cannotSelectFuture;
    this.cannotSelectPast = cannotSelectPast;
    this.required = required;
  }

  async validateText(
    datetimeInput: DatetimeInput | undefined
  ): Promise<ValidationResponse> {
    const { format, cannotSelectFuture, cannotSelectPast, required } = this;
    if (!datetimeInput) {
      return required ? i`This field is required` : null;
    }
    const { formatted } = datetimeInput;
    if (!formatted) {
      return required ? i`This field is required` : null;
    }
    const date = moment(formatted, format, true);
    if (!date.isValid()) {
      return i`Enter a valid date in ${format} format`;
    }
    const today = moment();
    if (cannotSelectFuture && date.isAfter(today)) {
      return i`Cannot select dates in the future`;
    }
    if (cannotSelectPast && date.isBefore(today)) {
      return i`Cannot select dates in the past`;
    }
    return null;
  }
}
