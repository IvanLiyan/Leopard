/* External Libraries */
import { createContext, useContext } from "react";
import { computed } from "mobx";
import { gql } from "@apollo/client";

/* Toolkit */
import Locales, { Locale, LocaleInfo } from "@toolkit/locales";

type LocalizationStoreArgs = {
  readonly availableLocales: ReadonlyArray<Locale>;
  readonly preferredProperLocale: string;
  readonly locale: Locale;
};

export default class LocalizationStore {
  availableLocales: ReadonlyArray<Locale>;
  locale: Locale;
  preferredProperLocale: string;

  constructor({
    availableLocales,
    locale,
    preferredProperLocale,
  }: LocalizationStoreArgs) {
    this.availableLocales = availableLocales;
    this.locale = locale;
    this.preferredProperLocale = preferredProperLocale;
  }

  @computed
  get localeProper(): string {
    const { locale } = this;
    if (locale == "zh") {
      return "zh-CN";
    }

    if (locale == "pt") {
      return "pt-BR";
    }

    return locale;
  }

  @computed
  get isRTL(): boolean {
    const { localeInfo } = this;
    return localeInfo?.isRightToLeft == true;
  }

  @computed
  get localeInfo(): LocaleInfo | null | undefined {
    const { locale } = this;
    return Locales[locale];
  }
}

export const useLocalizationStore = (): LocalizationStore => {
  return useContext(LocalizationStoreContext);
};

export const LOCALIZATION_STORE_INITIAL_QUERY = gql`
  query LocalizationStore_InitialQuery {
    currentMerchant {
      preferredProperLocale
      locale
    }
    platformConstants {
      availableLocales
    }
  }
`;

// TODO [lliepert]: bad typing, redo once query is real
export type LocalizationStoreInitialQueryResponse = LocalizationStoreArgs;

export const defaultLocalizationStoreArgs: LocalizationStoreArgs = {
  availableLocales: ["en"],
  locale: "en",
  preferredProperLocale: "en",
};

export const LocalizationStoreContext = createContext(
  new LocalizationStore(defaultLocalizationStoreArgs),
);
