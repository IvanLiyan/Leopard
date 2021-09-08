import { createContext, useContext } from "react";
import { useRouter } from "next/router";
import { Jed } from "jed";
import { BaseProps } from "@toolkit/types";

import arJedConfig from "@ContextLogic/leopardstrings/ar_SA.jed.json";
import azJedConfig from "@ContextLogic/leopardstrings/az_AZ.jed.json";
import beJedConfig from "@ContextLogic/leopardstrings/be_BY.jed.json";
import bgJedConfig from "@ContextLogic/leopardstrings/bg_BG.jed.json";
import bsJedConfig from "@ContextLogic/leopardstrings/bs_BA.jed.json";
import csJedConfig from "@ContextLogic/leopardstrings/cs_CZ.jed.json";
import daJedConfig from "@ContextLogic/leopardstrings/da_DK.jed.json";
import deJedConfig from "@ContextLogic/leopardstrings/de_DE.jed.json";
import elJedConfig from "@ContextLogic/leopardstrings/el_GR.jed.json";
import esJedConfig from "@ContextLogic/leopardstrings/es_LA.jed.json";
import etJedConfig from "@ContextLogic/leopardstrings/et_EE.jed.json";
import fiJedConfig from "@ContextLogic/leopardstrings/fi_FI.jed.json";
import frJedConfig from "@ContextLogic/leopardstrings/fr_FR.jed.json";
import hcJedConfig from "@ContextLogic/leopardstrings/hc.jed.json";
import hiJedConfig from "@ContextLogic/leopardstrings/hi_IN.jed.json";
import hrJedConfig from "@ContextLogic/leopardstrings/hr_HR.jed.json";
import huJedConfig from "@ContextLogic/leopardstrings/hu_HU.jed.json";
import idJedConfig from "@ContextLogic/leopardstrings/id_ID.jed.json";
import itJedConfig from "@ContextLogic/leopardstrings/it_IT.jed.json";
import jaJedConfig from "@ContextLogic/leopardstrings/ja_JP.jed.json";
import kkJedConfig from "@ContextLogic/leopardstrings/kk_KZ.jed.json";
import kmJedConfig from "@ContextLogic/leopardstrings/km_KH.jed.json";
import koJedConfig from "@ContextLogic/leopardstrings/ko_KR.jed.json";
import ltJedConfig from "@ContextLogic/leopardstrings/lt_LT.jed.json";
import lvJedConfig from "@ContextLogic/leopardstrings/lv_LV.jed.json";
import msJedConfig from "@ContextLogic/leopardstrings/ms_MY.jed.json";
import nbJedConfig from "@ContextLogic/leopardstrings/nb_NO.jed.json";
import nlJedConfig from "@ContextLogic/leopardstrings/nl_NL.jed.json";
import plJedConfig from "@ContextLogic/leopardstrings/pl_PL.jed.json";
import ptJedConfig from "@ContextLogic/leopardstrings/pt_BR.jed.json";
import roJedConfig from "@ContextLogic/leopardstrings/ro_RO.jed.json";
import ruJedConfig from "@ContextLogic/leopardstrings/ru_RU.jed.json";
import skJedConfig from "@ContextLogic/leopardstrings/sk_SK.jed.json";
import slJedConfig from "@ContextLogic/leopardstrings/sl_SI.jed.json";
import sqJedConfig from "@ContextLogic/leopardstrings/sq_AL.jed.json";
import srJedConfig from "@ContextLogic/leopardstrings/sr_RS.jed.json";
import svJedConfig from "@ContextLogic/leopardstrings/sv_SE.jed.json";
import thJedConfig from "@ContextLogic/leopardstrings/th_TH.jed.json";
import tlJedConfig from "@ContextLogic/leopardstrings/tl_PH.jed.json";
import trJedConfig from "@ContextLogic/leopardstrings/tr_TR.jed.json";
import ukJedConfig from "@ContextLogic/leopardstrings/uk_UA.jed.json";
import viJedConfig from "@ContextLogic/leopardstrings/vi_VN.jed.json";
import zhJedConfig from "@ContextLogic/leopardstrings/zh_TW.jed.json";

const polishJedConfig: (_: unknown) => Record<string, unknown> = (
  jedConfiguration,
) => {
  // @ts-ignore: copied in from legacy code, jed isn't type safe
  const polishedJedConfiguration: unknown = { ...jedConfiguration };
  // @ts-ignore: copied in from legacy code, jed isn't type safe
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  for (const string of Object.keys(polishedJedConfiguration.locale_data.wish)) {
    // @ts-ignore: copied in from legacy code, jed isn't type safe
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const translations = polishedJedConfiguration.locale_data.wish[string];
    if (Array.isArray(translations) && translations.length) {
      // @ts-ignore: copied in from legacy code, jed isn't type safe
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      polishedJedConfiguration.locale_data.wish[string] = translations.filter(
        (_) => _ !== null,
      );
    }
  }

  return polishedJedConfiguration as Record<string, unknown>;
};

/*******************************************************************************
 * IMPORTANT: be sure to update the supported locales in next.config.js if
 *            changing the below object
 ******************************************************************************/
const localeToJedConfig = {
  HC: polishJedConfig(hcJedConfig),
  UP: {},
  "en-US": {},
  "es-419": polishJedConfig(esJedConfig),
  "pt-BR": polishJedConfig(ptJedConfig),
  "fr-FR": polishJedConfig(frJedConfig),
  "it-IT": polishJedConfig(itJedConfig),
  "ja-JP": polishJedConfig(jaJedConfig),
  "ko-KR": polishJedConfig(koJedConfig),
  "de-DE": polishJedConfig(deJedConfig),
  "zh-CN": polishJedConfig(zhJedConfig),
  "tr-TR": polishJedConfig(trJedConfig),
  "ru-RU": polishJedConfig(ruJedConfig),
  "th-TH": polishJedConfig(thJedConfig),
  "vi-VN": polishJedConfig(viJedConfig),
  "da-DK": polishJedConfig(daJedConfig),
  "id-ID": polishJedConfig(idJedConfig),
  "sv-SE": polishJedConfig(svJedConfig),
  "nb-NO": polishJedConfig(nbJedConfig),
  "nl-NL": polishJedConfig(nlJedConfig),
  "fi-FI": polishJedConfig(fiJedConfig),
  "el-GR": polishJedConfig(elJedConfig),
  "pl-PL": polishJedConfig(plJedConfig),
  "ro-RO": polishJedConfig(roJedConfig),
  "hu-HU": polishJedConfig(huJedConfig),
  "be-BY": polishJedConfig(beJedConfig),
  "cs-CZ": polishJedConfig(csJedConfig),
  "sk-SK": polishJedConfig(skJedConfig),
  "sl-SI": polishJedConfig(slJedConfig),
  "lt-LT": polishJedConfig(ltJedConfig),
  "et-EE": polishJedConfig(etJedConfig),
  "lv-LV": polishJedConfig(lvJedConfig),
  "ar-SA": polishJedConfig(arJedConfig),
  "hr-HR": polishJedConfig(hrJedConfig),
  "hi-IN": polishJedConfig(hiJedConfig),
  "sq-AL": polishJedConfig(sqJedConfig),
  "bs-BA": polishJedConfig(bsJedConfig),
  "bg-BG": polishJedConfig(bgJedConfig),
  "sr-RS": polishJedConfig(srJedConfig),
  "uk-UA": polishJedConfig(ukJedConfig),
  "km-KH": polishJedConfig(kmJedConfig),
  "az-AZ": polishJedConfig(azJedConfig),
  "ms-MY": polishJedConfig(msJedConfig),
  "tl-PH": polishJedConfig(tlJedConfig),
  "kk-KZ": polishJedConfig(kkJedConfig),
  "zh-TW": polishJedConfig(zhJedConfig),
};
/*******************************************************************************
 * IMPORTANT: be sure to update the supported locales in next.config.js if
 *            changing the above object
 ******************************************************************************/

type Locale = keyof typeof localeToJedConfig;

type LocalizationState = {
  readonly locale: Locale;
  readonly jed: unknown;
};

const defaultLocalizationState: LocalizationState = {
  locale: "en-US",
  // this and following disables required since jed does not have types
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  jed: new Jed({}),
};

const LocalizationContext = createContext(defaultLocalizationState);

type LocalizationProviderProps = Pick<BaseProps, "children"> & {
  readonly locale?: Locale;
};

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  locale: localeProp,
  children,
}: LocalizationProviderProps) => {
  const { locales } = useRouter();

  const locale: Locale =
    localeProp ||
    (locales?.find((locale) =>
      Object.keys(localeToJedConfig).includes(locale),
    ) as Locale) ||
    "en-US";

  const jedConfig = localeToJedConfig[locale];

  const jed: unknown =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    Object.keys(jedConfig).length == 0 ? new Jed({}) : new Jed(jedConfig);

  return (
    <LocalizationContext.Provider value={{ locale, jed }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): {
  i18n: (s: string) => string;
  ni18n: (n: number, s1: string, s2: string) => string;
  ci18n: (s1: string, s2: string) => string;
  cni18n: (s1: string, n: number, s2: string, s3: string) => string;
} => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { locale, jed } = useContext(LocalizationContext);

  type FormatArg = string | number;

  const formatter = (str: string, args: FormatArg[]): string => {
    let nonPositionalMatchCount = 0;

    const replacer = (match: string, capturedNum: number): string => {
      let argIndex = 0;
      if (capturedNum !== undefined) {
        argIndex = capturedNum - 1;
      } else {
        argIndex = nonPositionalMatchCount;
        nonPositionalMatchCount++;
      }
      return args[argIndex] !== undefined ? args[argIndex].toString() : "";
    };

    const sprintfPlaceholderRegex = /%(\d+)\$[ds]|%[ds]/g;
    const result = str.replace(sprintfPlaceholderRegex, replacer);

    const descPlaceholderRegex = /\{%(\d+)=[^{}]+\}/g;
    return result.replace(descPlaceholderRegex, replacer);
  };

  const i18n = (format: string, ...formatArgs: FormatArg[]): string => {
    // @ts-ignore: copied in from legacy code, jed isn't type safe
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    let result: string = jed.translate(format).fetch();
    result = formatter(result, formatArgs);

    if (locale == "UP") {
      return result.toUpperCase();
    }
    return result;
  };

  const ni18n = (
    num: number,
    singular: string,
    plural: string,
    ...formatArgs: FormatArg[]
  ): string => {
    // @ts-ignore: copied in from legacy code, jed isn't type safe
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    let result: string = jed.translate(singular).ifPlural(num, plural).fetch();
    result = formatter(result, formatArgs);

    if (locale == "UP") {
      return result.toUpperCase();
    }
    return result;
  };

  const ci18n = (
    context: string,
    message: string,
    ...formatArgs: FormatArg[]
  ): string => {
    context = context.toUpperCase();

    if (!context) {
      return i18n(message);
    }

    // @ts-ignore: copied in from legacy code, jed isn't type safe
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    let result: string = jed.translate(message).withContext(context).fetch();
    result = formatter(result, formatArgs);

    if (locale == "UP") {
      return result.toUpperCase();
    }

    return result;
  };

  const cni18n = (
    context: string,
    num: number,
    singular: string,
    plural: string,
    ...formatArgs: FormatArg[]
  ): string => {
    context = context.toUpperCase();

    if (!context) {
      return ni18n(num, singular, plural);
    }

    // @ts-ignore: copied in from legacy code, jed isn't type safe
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    let result: string = jed.translate(singular).ifPlural(num, plural).withContext(context).fetch(); // prettier-ignore
    result = formatter(result, formatArgs);

    if (locale == "UP") {
      return result.toUpperCase();
    }
    return result;
  };

  return { i18n, ni18n, ci18n, cni18n };
};
