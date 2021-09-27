/* External Libraries */
import { computed } from "mobx";

/* Toolkit */
import Locales, { Locale, LocaleInfo } from "@toolkit/locales";

export default class LocalizationStore {
  @computed
  get preferredProperLocale(): string {
    return (window as any).pageParams.preferred_proper_locale;
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
  get locale(): Locale {
    return (window as any).pageParams.locale;
  }

  @computed
  get localeInfo(): LocaleInfo | null | undefined {
    const { locale } = this;
    return Locales[locale];
  }

  // if possible, query GQL instead, will be deprecating pageParams in the future
  /*
  platformConstants {
    availableLocales
  }
  */
  @computed
  get availableLocales(): ReadonlyArray<Locale> {
    return (window as any).pageParams.dashboard_locales.map((_: string) =>
      _.toLowerCase()
    );
  }

  static instance(): LocalizationStore {
    let { localizationStore } = window as any;
    if (localizationStore == null) {
      localizationStore = new LocalizationStore();
      (window as any).localizationStore = localizationStore;
    }
    return localizationStore;
  }
}

export const useLocalizationStore = (): LocalizationStore => {
  return LocalizationStore.instance();
};
