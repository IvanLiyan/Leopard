/* Lego Toolkit */
import { Locale, CountryCode } from "@schema";
export type { Locale };

export type LocaleInfo = {
  name: string;
  country: CountryCode;
  isRightToLeft?: boolean;
};

/* We don't translate the actual language names */
/* eslint-disable local-rules/unwrapped-i18n */
const locales: {
  [key in Locale]: LocaleInfo;
} = {
  en: {
    name: "English",
    country: "US",
  },
  zh: {
    name: "中文",
    country: "CN",
  },
  de: {
    name: "Deutsch",
    country: "DE",
  },
  fr: {
    name: "Français",
    country: "FR",
  },
  es: {
    name: "Español",
    country: "ES",
  },
  pt: {
    name: "Português",
    country: "BR",
  },
  sv: {
    name: "Svenska",
    country: "SE",
  },
  tr: {
    name: "Türkçe",
    country: "TR",
  },
  pl: {
    name: "polski",
    country: "PL",
  },
  nl: {
    name: "Nederlands",
    country: "NL",
  },
  ar: {
    name: "العَرَبِيَّة‎",
    country: "SA",
    isRightToLeft: true,
  },
  cs: {
    name: "čeština",
    country: "CZ",
  },
  hu: {
    name: "magyar nyelv",
    country: "HU",
  },
  da: {
    name: "dansk",
    country: "DK",
  },
  fi: {
    name: "suomi",
    country: "FI",
  },
  nb: {
    name: "bokmål",
    country: "NO",
  },
  ko: {
    name: "한국어",
    country: "KR",
  },
  ja: {
    name: "日本語",
    country: "JP",
  },
  it: {
    name: "italiano",
    country: "IT",
  },
  th: {
    name: "ภาษาไทย",
    country: "TH",
  },
  vi: {
    name: "tiếng Việt",
    country: "VN",
  },
  id: {
    name: "bahasa Indonesia",
    country: "ID",
  },
  up: {
    name: "UPPER",
    country: "US",
  },
};

export default locales;
