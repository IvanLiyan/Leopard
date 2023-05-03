/*
 *  stores/ThemeStore.tsx
 *  Project-Lego
 *
 * This file defines a ThemeStore used to calculate the themes provided
 * to Lego's ThemeProvider and the various app ThemeProviders
 *
 *  Created by Lucas Liepert on 06-26-20.
 *  Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, {
  useMemo,
  createContext,
  useContext,
  createRef,
  useImperativeHandle,
} from "react";
import { computed } from "mobx";

import Color from "color";

import { PALETTES } from "@ContextLogic/zeus";
// import required in ThemeStore as this is where we set up the theme passed
// to Lego and instantiate the Lego provider
// eslint-disable-next-line local-rules/no-lego-context-import
import {
  LegoProvider,
  Theme as LegoTheme,
  NavigateOptions,
  ToastContext,
  NavigationContext,
} from "@ContextLogic/lego/toolkit/providers";
import UserStore from "./UserStore";
import { useNavigationStore } from "./NavigationStore";
import EnvironmentStore, { useEnvironmentStore } from "./EnvironmentStore";
import { useLocalizationStore } from "./LocalizationStore";
import { useToastStore } from "./ToastStore";

// deprecated color in use for store and internal themes
const PACIFICA = "#0D6FFF";
const DARKEST_CYAN = "#1E6458";
const DARKER_PURPLE = "#7443FF";
const INK = "#152934";

const COMMON_THEME = {
  textWhite: PALETTES.WHITE,
  textUltraLighter: PALETTES.GREY["300"],
  textUltralight: PALETTES.GREY["400"],
  textLight: PALETTES.GREY["600"],
  textDark: PALETTES.GREY["700"],
  textBlack: PALETTES.GREY["800"],
  textPlaceholder: PALETTES.GREY["400"],

  surfaceLightest: PALETTES.WHITE,
  surfaceLighter: PALETTES.GREY["100"],
  surfaceLight: PALETTES.GREY["200"],
  surface: PALETTES.GREY["300"],
  surfaceDark: PALETTES.GREY["400"],
  surfaceDarker: PALETTES.GREY["500"],
  surfaceDarkest: PALETTES.GREY["900"], // TODO (dsirivat): deprecate pending full atlas integration
  info: PALETTES.GREY["300"], // TODO [lliepert]: deprecate this in favour of surface

  hoverColor: PALETTES.GREY["700"],
  hoverBackground: PALETTES.GREY["100"],

  inputBackground: PALETTES.WHITE,
  pageBackground: PALETTES.GREY["100"],
  modalBackground: `${PALETTES.GREY["800"]}CC`,

  borderPrimaryLightest: PALETTES.WHITE,
  borderPrimaryLighter: PALETTES.GREY["100"],
  borderPrimaryLight: PALETTES.GREY["200"],
  borderPrimary: PALETTES.GREY["300"],
  borderPrimaryDark: PALETTES.GREY["400"],
  borderPrimaryDarker: PALETTES.GREY["600"],

  corePrimaryLightest: PALETTES.BLUE["100"],
  corePrimaryLighter: PALETTES.BLUE["200"],
  corePrimaryLight: PALETTES.BLUE["300"],
  corePrimary: PALETTES.BLUE["400"],
  corePrimaryDark: PALETTES.BLUE["600"],
  corePrimaryDarker: PALETTES.BLUE["800"],
  corePrimaryDarkest: PALETTES.BLUE["900"],

  positiveLighter: PALETTES.CYAN["100"],
  positiveLight: PALETTES.CYAN["300"],
  positive: PALETTES.CYAN["400"],
  positiveDark: PALETTES.CYAN["600"],
  positiveDarker: PALETTES.CYAN["700"],
  positiveDarkest: PALETTES.CYAN["800"],

  warningLighter: PALETTES.YELLOW["100"],
  warningLight: PALETTES.YELLOW["200"],
  warning: PALETTES.YELLOW["400"],
  warningDark: PALETTES.YELLOW["500"],
  warningDarker: PALETTES.YELLOW["600"],
  warningDarkest: PALETTES.YELLOW["700"],

  negativeLighter: PALETTES.RED["100"],
  negativeLight: PALETTES.RED["200"],
  negative: PALETTES.RED["400"],
  negativeDark: PALETTES.RED["500"],
  negativeDarker: PALETTES.RED["600"],
  negativeDarkest: PALETTES.RED["700"],

  cashLighter: PALETTES.GREEN["200"],
  cashLight: PALETTES.GREEN["300"],
  cash: PALETTES.GREEN["400"],
  cashDark: PALETTES.GREEN["600"],
  cashDarker: PALETTES.GREEN["700"],
  cashDarkest: PALETTES.GREEN["800"],

  primaryLighter: PALETTES.BLUE["200"],
  primaryLight: PALETTES.BLUE["300"],
  primary: PALETTES.BLUE["400"],
  primaryDark: PALETTES.BLUE["700"],
  primaryDarker: PALETTES.BLUE["800"],
  primaryDarkest: PALETTES.BLUE["900"],

  secondaryLightest: PALETTES.COBALT["100"],
  secondaryLighter: PALETTES.COBALT["200"],
  secondaryLight: PALETTES.COBALT["300"],
  secondary: PALETTES.COBALT["400"],
  secondaryDark: PALETTES.COBALT["600"],
  secondaryDarker: PALETTES.COBALT["700"],
  secondaryDarkest: PALETTES.COBALT["800"],

  tertiaryLighter: PALETTES.PURPLE["200"],
  tertiaryLight: PALETTES.PURPLE["300"],
  tertiary: PALETTES.PURPLE["400"],
  tertiaryDark: PALETTES.PURPLE["500"],
  tertiaryDarker: PALETTES.PURPLE["600"],
  tertiaryDarkest: PALETTES.PURPLE["700"],

  quaternaryLightest: PALETTES.ORANGE["100"],
  quaternaryLighter: PALETTES.ORANGE["200"],
  quaternaryLight: PALETTES.ORANGE["300"],
  quaternary: PALETTES.ORANGE["400"],
  quaternaryDark: PALETTES.ORANGE["500"],
  quaternaryDarker: PALETTES.ORANGE["600"],
  quaternaryDarkest: PALETTES.ORANGE["700"],

  orangeSurface: PALETTES.ORANGE["400"],

  lightGreenSurface: PALETTES.CYAN["300"],
  greenSurface: PALETTES.CYAN["500"],

  lightBlueSurface: PALETTES.COBALT["100"],
  darkBlueSurface: PALETTES.BLUE["600"],

  lightPurpleSurface: PALETTES.PURPLE["400"],
  purpleSurface: PALETTES.PURPLE["500"],
  darkPurpleSurface: PALETTES.PURPLE["600"],

  wishBlue: PALETTES.BLUE["400"],

  wishExpressOrange: PALETTES.ORANGE["200"],

  metricRed: PALETTES.RED["400"],
  metricOrange: PALETTES.ORANGE["400"],
  metricYellow: PALETTES.YELLOW["500"],
  metricCyan: PALETTES.CYAN["400"],
  metricBlue: PALETTES.BLUE["500"],
  metricPurple: PALETTES.PURPLE["400"],
};

/**
 * accessing MERCHANT_THEME directly should be minimized whenever possible,
 * as such access will not be compatible if we add dynamic theming in the future
 */
export const MERCHANT_THEME = {
  ...COMMON_THEME,
  primaryLight: PALETTES.COBALT["100"],
  primary: PALETTES.COBALT["600"],
  primaryDark: PALETTES.COBALT["800"],
  topbarBackground: PALETTES.COBALT["600"],
  topbarSearchBackground: PALETTES.COBALT["300"],
};

const STORE_THEME = {
  ...COMMON_THEME,
  primaryLight: PALETTES.COBALT["100"],
  primary: PALETTES.COBALT["600"],
  primaryDark: PALETTES.BLUE["800"],
  topbarBackground: PACIFICA,
  topbarSearchBackground: PALETTES.WHITE,
};

const INTERNAL_THEME = MERCHANT_THEME;

type ThemeName = "MERCHANT" | "INTERNAL" | "STORE";

const APP_THEMES: { [k in ThemeName]: AppTheme } = {
  MERCHANT: MERCHANT_THEME,
  INTERNAL: INTERNAL_THEME,
  STORE: STORE_THEME,
};

const LEGO_THEMES: { [k in ThemeName]: LegoTheme } = {
  MERCHANT: MERCHANT_THEME,
  INTERNAL: INTERNAL_THEME,
  STORE: STORE_THEME,
};

class ThemeStore {
  currentAppTheme = (override?: ThemeName): AppTheme => {
    const userStore = UserStore.instance();

    if (override) {
      return APP_THEMES[override];
    }

    if (!userStore.isLoggedIn) {
      return APP_THEMES.MERCHANT;
    }

    if (userStore.isStoreUser) {
      return APP_THEMES.STORE;
    }

    if (userStore.isMerchant) {
      return APP_THEMES.MERCHANT;
    }

    return APP_THEMES.INTERNAL;
  };

  currentLegoTheme = (override?: ThemeName): LegoTheme => {
    const userStore = UserStore.instance();

    if (override) {
      return LEGO_THEMES[override];
    }

    if (!userStore.isLoggedIn) {
      return LEGO_THEMES.MERCHANT;
    }

    if (userStore.isStoreUser) {
      return LEGO_THEMES.STORE;
    }

    if (userStore.isMerchant) {
      return LEGO_THEMES.MERCHANT;
    }

    return LEGO_THEMES.INTERNAL;
  };

  @computed get topbarBackground(): string {
    const { env } = EnvironmentStore.instance();
    switch (env) {
      case "fe_qa_staging":
        return DARKEST_CYAN;
      case "sandbox":
        return DARKER_PURPLE;
      case "stage":
        return INK;
      default:
        return PALETTES.WHITE;
    }
  }

  @computed get lightenedTopbarBackground(): string {
    const { env } = EnvironmentStore.instance();
    const { topbarBackground } = this;
    switch (env) {
      case "fe_qa_staging":
        return "#407B71";
      case "sandbox":
        return new Color(topbarBackground).lighten(0.6).toString();
      case "stage":
        return new Color(topbarBackground).lighten(0.6).toString();
      default:
        return PALETTES.GREY["200"];
    }
  }

  static instance(): ThemeStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let { themeStore } = window as any;
    if (themeStore == null) {
      themeStore = new ThemeStore();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).themeStore = themeStore;
    }
    return themeStore;
  }
}

export const useThemeStore = (): ThemeStore => {
  return ThemeStore.instance();
};

export interface AppTheme {
  readonly textWhite: string;
  readonly textUltraLighter: string;
  readonly textUltralight: string;
  readonly textLight: string;
  readonly textDark: string;
  readonly textBlack: string;
  readonly textPlaceholder: string;

  readonly surfaceLightest: string;
  readonly surfaceLighter: string;
  readonly surfaceLight: string;
  readonly surface: string;
  readonly surfaceDark: string;
  readonly surfaceDarker: string;
  readonly surfaceDarkest: string;

  readonly hoverColor: string;
  readonly hoverBackground: string;

  readonly inputBackground: string;
  readonly pageBackground: string;
  readonly modalBackground: string;
  readonly topbarBackground: string;
  readonly topbarSearchBackground: string;
  readonly info: string;

  readonly borderPrimaryLightest: string;
  readonly borderPrimaryLighter: string;
  readonly borderPrimaryLight: string;
  readonly borderPrimary: string;
  readonly borderPrimaryDark: string;
  readonly borderPrimaryDarker: string;

  readonly corePrimaryLightest: string;
  readonly corePrimaryLighter: string;
  readonly corePrimaryLight: string;
  readonly corePrimary: string;
  readonly corePrimaryDark: string;
  readonly corePrimaryDarker: string;
  readonly corePrimaryDarkest: string;

  readonly positiveLighter: string;
  readonly positiveLight: string;
  readonly positive: string;
  readonly positiveDark: string;
  readonly positiveDarker: string;
  readonly positiveDarkest: string;

  readonly warningLighter: string;
  readonly warningLight: string;
  readonly warning: string;
  readonly warningDark: string;
  readonly warningDarker: string;
  readonly warningDarkest: string;

  readonly negativeLighter: string;
  readonly negativeLight: string;
  readonly negative: string;
  readonly negativeDark: string;
  readonly negativeDarker: string;
  readonly negativeDarkest: string;

  readonly cashLighter: string;
  readonly cashLight: string;
  readonly cash: string;
  readonly cashDark: string;
  readonly cashDarker: string;
  readonly cashDarkest: string;

  readonly primaryLighter: string;
  readonly primaryLight: string;
  readonly primary: string;
  readonly primaryDark: string;
  readonly primaryDarker: string;
  readonly primaryDarkest: string;

  readonly secondaryLightest: string;
  readonly secondaryLighter: string;
  readonly secondaryLight: string;
  readonly secondary: string;
  readonly secondaryDark: string;
  readonly secondaryDarker: string;
  readonly secondaryDarkest: string;

  readonly tertiaryLighter: string;
  readonly tertiaryLight: string;
  readonly tertiary: string;
  readonly tertiaryDark: string;
  readonly tertiaryDarker: string;
  readonly tertiaryDarkest: string;

  readonly quaternaryLightest: string;
  readonly quaternaryLighter: string;
  readonly quaternaryLight: string;
  readonly quaternary: string;
  readonly quaternaryDark: string;
  readonly quaternaryDarker: string;
  readonly quaternaryDarkest: string;

  readonly orangeSurface: string;

  readonly lightGreenSurface: string;
  readonly greenSurface: string;

  readonly lightBlueSurface: string;
  readonly darkBlueSurface: string;

  readonly lightPurpleSurface: string;
  readonly purpleSurface: string;
  readonly darkPurpleSurface: string;

  readonly wishBlue: string;

  readonly wishExpressOrange: string;

  readonly metricRed: string;
  readonly metricOrange: string;
  readonly metricYellow: string;
  readonly metricCyan: string;
  readonly metricBlue: string;
  readonly metricPurple: string;
}

// exported solely for adding theming to legacy CC components
export const ThemeContext = React.createContext<AppTheme>(APP_THEMES.MERCHANT);

export const ThemeProvider: React.FC<{ readonly theme: AppTheme }> = ({
  theme,
  children,
}) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): AppTheme => {
  const theme = useContext(ThemeContext);
  return theme;
};

// wrap a component in all the various theme providers we use in one go
export const ThemeWrapper: React.FC<{ overrideThemeAs?: ThemeName }> = ({
  children,
  overrideThemeAs,
}) => {
  const { currentLegoTheme, currentAppTheme } = useThemeStore();
  const { env: appEnv } = useEnvironmentStore();
  const { locale } = useLocalizationStore();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();
  const legoNavigation = useMemo((): NavigationContext => {
    return {
      navigate(url: string, options?: NavigateOptions) {
        const openInNewTab = options?.openInNewTab == true;
        // convert synch navigate function (next.js) to promise navigate
        // function (lego)
        return Promise.resolve(
          navigationStore.navigate(url, {
            openInNewTab,
          }),
        );
      },
      // TODO [lliepert]: fix this any type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pushPath(path: string, queryParams?: any | null | undefined) {
        // TODO [lliepert]: test out this behavior - do we need lego navigation anymore?
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-floating-promises
        navigationStore.pushPath(path, queryParams);
      },
      getQueryParameters(): Readonly<{
        [key: string]: string;
      }> {
        return navigationStore.queryParams;
      },
      getCurrentPath(): string {
        return navigationStore.currentPath;
      },
    };
  }, [navigationStore]);

  const legoToasts = useMemo((): ToastContext => {
    return {
      negative(message: string) {
        toastStore.negative(message);
      },
      positive(message: string) {
        toastStore.positive(message);
      },
      warning(message: string) {
        toastStore.warning(message);
      },
    };
  }, [toastStore]);

  const theming = useMemo(() => {
    const theme = currentLegoTheme(overrideThemeAs);
    return { theme };
  }, [overrideThemeAs, currentLegoTheme]);

  return (
    <LegoProvider
      env={
        ["fe_qa_staging", "stage", "sandbox"].includes(appEnv)
          ? "development"
          : "production"
      }
      locale={locale}
      theming={theming}
      navigation={legoNavigation}
      toasts={legoToasts}
    >
      <ThemeProvider theme={currentAppTheme(overrideThemeAs)}>
        {children}
      </ThemeProvider>
    </LegoProvider>
  );
};

const ThemeStoreContext = createContext(new ThemeStore());

// combined with the later useImperativeHandle, this allows us to access the
// ThemeStore outside of React
const ThemeStoreRef = createRef<ThemeStore>();

export const ThemeStoreProvider: React.FC = ({ children }) => {
  const themeStore = new ThemeStore();
  useImperativeHandle(ThemeStoreRef, () => themeStore);

  return (
    <ThemeStoreContext.Provider value={themeStore}>
      <ThemeWrapper>{children}</ThemeWrapper>
    </ThemeStoreContext.Provider>
  );
};

const LegacyThemeStoreAdapter = {
  instance: (): ThemeStore => {
    const ref = ThemeStoreRef.current;
    if (ref == null) {
      throw "Attempting to access reference to un-instantiated ThemeStore.\n\nIf this error occurred during a Next.JS Fast Refresh, try performing a full refresh.";
    }
    return ref;
  },
};

export default LegacyThemeStoreAdapter;
