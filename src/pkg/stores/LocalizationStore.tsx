/* External Libraries */
import {
  createContext,
  useContext,
  createRef,
  useImperativeHandle,
} from "react";
import { computed } from "mobx";
import { gql } from "@apollo/client";

/* Toolkit */
import {
  RootQuery,
  PlatformConstants,
  Locale,
  CountryCode,
} from "@schema/types";

// following is copied in from @toolkit/locales. this is done to preserve the
// ability to delete @toolkit, required for syncing with clroot
export type LocaleInfo = {
  name: string;
  country: CountryCode;
  isRightToLeft?: boolean;
};

/* We don't translate the actual language names */
/* eslint-disable local-rules/unwrapped-i18n */
const Locales: {
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
// end @toolkit/locales

class LocalizationStore {
  availableLocales: ReadonlyArray<Locale>;
  locale: Locale;
  preferredProperLocale: string;

  constructor({
    currentLocale: locale,
    currentProperLocale: preferredProperLocale,
    platformConstants: { availableLocales },
  }: LocalizationStoreInitialQueryResponse) {
    this.availableLocales = availableLocales ? availableLocales : [];
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
    currentLocale
    currentProperLocale
    platformConstants {
      availableLocales
    }
  }
`;

export type LocalizationStoreInitialQueryResponse = {
  readonly platformConstants: Pick<PlatformConstants, "availableLocales">;
} & Pick<RootQuery, "currentLocale" | "currentProperLocale">;

const LocalizationStoreContext = createContext(
  new LocalizationStore({
    currentLocale: "en",
    currentProperLocale: "en-us",
    platformConstants: { availableLocales: ["en"] },
  }),
);

// combined with the later useImperativeHandle, this allows us to access the
// LocalizationStore outside of React
const LocalizationStoreRef = createRef<LocalizationStore>();

export const LocalizationStoreProvider: React.FC<{
  initialData: LocalizationStoreInitialQueryResponse;
}> = ({ initialData, children }) => {
  const localizationStore = new LocalizationStore(initialData);
  useImperativeHandle(LocalizationStoreRef, () => localizationStore);

  return (
    <LocalizationStoreContext.Provider value={localizationStore}>
      {children}
    </LocalizationStoreContext.Provider>
  );
};

const LegacyLocalizationStoreAdapter = {
  instance: (): LocalizationStore => {
    const ref = LocalizationStoreRef.current;
    if (ref == null) {
      throw "Attempting to access reference to un-instantiated LocalizationStore";
    }
    return ref;
  },
};

export default LegacyLocalizationStoreAdapter;
