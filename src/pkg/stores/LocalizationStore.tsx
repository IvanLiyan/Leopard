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
import Locales, { Locale, LocaleInfo } from "@toolkit/locales";
import { RootQuery, PlatformConstants } from "@schema/types";

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

// below we mock out LocalizationStore.instance() for compatibility with legacy code
const LegacyLocalizationStoreMock = {
  instance: (): LocalizationStore => {
    const ref = LocalizationStoreRef.current;
    if (ref == null) {
      throw "Attempting to access reference to un-instantiated LocalizationStore";
    }
    return ref;
  },
};

export default LegacyLocalizationStoreMock;
