/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Jed } from "jed";
import deTranslations from "@ContextLogic/merchantstrings/de_DE.jed.json";
import frTranslations from "@ContextLogic/merchantstrings/fr_FR.jed.json";
import jaTranslations from "@ContextLogic/merchantstrings/ja_JP.jed.json";
import ptTranslations from "@ContextLogic/merchantstrings/pt_BR.jed.json";
import viTranslations from "@ContextLogic/merchantstrings/vi_VN.jed.json";
import esTranslations from "@ContextLogic/merchantstrings/es_LA.jed.json";
import itTranslations from "@ContextLogic/merchantstrings/it_IT.jed.json";
import koTranslations from "@ContextLogic/merchantstrings/ko_KR.jed.json";
import trTranslations from "@ContextLogic/merchantstrings/tr_TR.jed.json";
import zhTranslations from "@ContextLogic/merchantstrings/zh_CN.jed.json";
import { Locale } from "@schema";
import { getBrowserLocale } from "@core/stores/LocalizationStore";

type SupportedLocale = ExcludeStrict<
  Locale,
  "id" | "pl" | "ar" | "hu" | "da" | "fi" | "nb" | "th" | "cs" | "nl" | "sv"
>;

const LocaleTranslations: {
  readonly [T in SupportedLocale]: Record<string, unknown>;
} = {
  en: {},
  up: {},
  de: deTranslations,
  fr: frTranslations,
  ja: jaTranslations,
  pt: ptTranslations,
  vi: viTranslations,
  es: esTranslations,
  it: itTranslations,
  ko: koTranslations,
  tr: trTranslations,
  zh: zhTranslations,
};

const isSupportedLocale = (value: string) => {
  return Object.keys(LocaleTranslations).includes(value);
};

const getAppLocaleCookie = () => {
  if (typeof document == "undefined") {
    return;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; app_locale=`);
  if (parts != null && parts.length === 2) {
    const part = parts.pop();
    if (part != null) {
      const value = part.split(";").shift();
      if (value == null || !isSupportedLocale(value)) {
        return undefined;
      }
      return value;
    }
  }
};

const locale = (getAppLocaleCookie() ??
  getBrowserLocale() ??
  "en") as SupportedLocale;

const jedi18n = (() => {
  const { [locale]: jedConfiguration = {} } = LocaleTranslations;

  if (Object.keys(jedConfiguration).length == 0) {
    return new Jed({});
  }

  // po2json inserts nulls inside the entries arrays so instead of
  // "My string": ["translation"], we get "My string": [null, "translation"]
  // Take out the nulls, before sending the object to Jed()
  const polishedJedConfiguration: any = { ...jedConfiguration };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  for (const string of Object.keys(polishedJedConfiguration.locale_data.wish)) {
    const translations = polishedJedConfiguration.locale_data.wish[string];
    if (Array.isArray(translations) && translations.length) {
      polishedJedConfiguration.locale_data.wish[string] = translations.filter(
        (_) => _ !== null,
      );
    }
  }

  return new Jed(polishedJedConfiguration);
})();

function _format(jedChain: any, args: any) {
  try {
    return jedChain.fetch(args);
  } catch {
    // pass
  }

  const str = jedChain.fetch();
  let nonPositionalMatchCount = 0;

  function replacer(match: any, capturedNum: any) {
    let argIndex = 0;
    if (capturedNum !== undefined) {
      argIndex = capturedNum - 1;
    } else {
      argIndex = nonPositionalMatchCount;
      nonPositionalMatchCount++;
    }
    return args[argIndex] !== undefined ? args[argIndex] : "";
  }

  const sprintfPlaceholderRegex = /%(\d+)\$[ds]|%[ds]/g;
  const result = str.replace(sprintfPlaceholderRegex, replacer);

  const descPlaceholderRegex = /\{%(\d+)=[^{}]+\}/g;
  return result.replace(descPlaceholderRegex, replacer);
}

function _i18n(str: string, ...args: any[]): string {
  let result = jedi18n.translate(str);
  result = _format(result, args);

  if (locale == "up") {
    result = result.toUpperCase();
  }
  return result;
}

function _ni18n(
  num: number,
  singular: string,
  plural: string,
  ...args: any[]
): string {
  const format_args = [num, ...args];

  let str = jedi18n.translate(singular).ifPlural(num, plural);
  str = _format(str, format_args);

  if (locale == "up") {
    str = str.toUpperCase();
  }
  return str;
}

function _ci18n(context: string, message: string, ...args: any[]): string {
  context = context.toUpperCase();

  let result = jedi18n.translate(message).withContext(context);
  result = _format(result, args);

  if (locale == "up") {
    result = result.toUpperCase();
  }

  return result;
}

function _cni18n(
  context: string,
  num: number,
  singular: string,
  plural: string,
  ...args: any
): string {
  context = context.toUpperCase();
  const format_args = [num, ...args];

  let str = jedi18n
    .translate(singular)
    .ifPlural(num, plural)
    .withContext(context);
  str = _format(str, format_args);

  if (locale == "up") {
    str = str.toUpperCase();
  }
  return str;
}

export const i18n = _i18n;
export const ci18n = _ci18n;
export const ni18n = _ni18n;
export const cni18n = _cni18n;
