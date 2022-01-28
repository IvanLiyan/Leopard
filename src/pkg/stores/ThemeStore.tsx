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
import { computed, observable } from "mobx";

import Color from "color";

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
// import UserStore from "@stores/UserStore"; // TODO [lliepert]: commenting out userstore usage, will bring back in further ticket
import { useNavigationStore } from "@stores/NavigationStore";
import EnvironmentStore, { useEnvironmentStore } from "./EnvironmentStore";
import { useLocalizationStore } from "@stores/LocalizationStore";
import { useToastStore } from "@stores/ToastStore";

// this object represents the default colours available to Wish designers
// it is used to populate the themes used in code
// if changes are made, keep this in sync with default themes in
// @ContextLogic/lego/toolkit/providers and @toolkit/providers
const PALETTES_DEPRECATED = {
  textColors: {
    White: "#FFFFFF",
    LightInk: "#5A7385",
    DarkInk: "#4A5F6E",
    Ink: "#152934",
  },
  greyScaleColors: {
    LighterGrey: "#F8FAFB",
    LightGrey: "#EEF2F5",
    Grey: "#D5DFE6",
    DarkGrey: "#C4CDD5",
    DarkerGrey: "#898F95",
  },
  coreColors: {
    LighterWishBlue: "#E6F7FF",
    LightWishBlue: "#79D6FA",
    WishBlue: "#2FB7EC",
    DarkWishBlue: "#006BA0",
    DarkerWishBlue: "#1A4379",
    DarkestWishBlue: "#001D53",
  },
  greens: {
    LighterCashGreen: "#C2EF8A",
    LightCashGreen: "#A5E15D",
    CashGreen: "#88C43F",
    DarkCashGreen: "#4A8305",
    DarkerCashGreen: "#3f7004",
    DarkestCashGreen: "#355F03",
  },
  cyans: {
    LighterCyan: "#92F1D3",
    LightCyan: "#2EE3AA",
    Cyan: "#1ACC94",
    DarkCyan: "#318562",
    DarkerCyan: "#2A7265",
    DarkestCyan: "#1E6458",
  },
  palaceBlues: {
    LighterPalaceBlue: "#E7EEFD",
    LightPalaceBlue: "#C3D4FA",
    PalaceBlue: "#8CACF6",
    DarkPalaceBlue: "#376EEE",
    DarkerPalaceBlue: "#2561EC",
    DarkestPalaceBlue: "#0E3AA1",
    Pacifica: "#0D6FFF",
  },
  purples: {
    LighterPurple: "#E8E0FF",
    LightPurple: "#CBB9FF",
    Purple: "#AE92FF",
    DarkPurple: "#8055FF",
    DarkerPurple: "#7443FF",
    DarkestPurple: "#6719FF",
  },
  yellows: {
    LighterYellow: "#FFF0BB",
    LightYellow: "#FFE380",
    Yellow: "#FFD560",
    DarkYellow: "#FFC72C",
    DarkerYellow: "#F0B616",
    DarkestYellow: "#E4AB0F",
  },
  oranges: {
    LighterOrange: "#F9D3AE",
    LightOrange: "#FABF86",
    Orange: "#F7A14D",
    DarkOrange: "#EF8D2E",
    DarkerOrange: "#DE7712",
    DarkestOrange: "#AF5E0E",
  },
  reds: {
    LighterRed: "#FADDE2",
    LightRed: "#F1ABB5",
    Red: "#EC8998",
    DarkRed: "#E56175",
    DarkerRed: "#DB2441",
    DarkestRed: "#CA213C",
  },
};

// New palette dataset from the design team.
const PALETTES_V2 = {
  WHITE: "#FFFFFF",
  GREY: {
    "100": "#F7F9FA",
    "200": "#EFF4F6",
    "300": "#DCE5E9",
    "400": "#BFCDD4",
    "500": "#98ABB6",
    "600": "#6B828F",
    "700": "#3F5663",
    "800": "#1C2C36",
    "900": "#0E161C",
  },
  RED: {
    "100": "#FFEBEC",
    "200": "#FCB8BE",
    "300": "#F8868F",
    "400": "#F15460",
    "500": "#E52533",
    "600": "#D0000F",
    "700": "#AF000C",
    "800": "#820009",
    "900": "#4D0005",
  },
  VERMILLION: {
    "100": "#FFECE6",
    "200": "#FFBDA7",
    "300": "#FF8B65",
    "400": "#FF5622",
    "500": "#E63200",
    "600": "#C62800",
    "700": "#9F1D00",
    "800": "#751300",
    "900": "#4D0B00",
  },
  ORANGE: {
    "100": "#FFF1E6",
    "200": "#FACCA5",
    "300": "#F1A666",
    "400": "#E3812B",
    "500": "#CE6200",
    "600": "#B15500",
    "700": "#8D4500",
    "800": "#653200",
    "900": "#402000",
  },
  YELLOW: {
    "100": "#FFF8E6",
    "200": "#FFECAB",
    "300": "#FFDB6C",
    "400": "#FFC72C",
    "500": "#E3A700",
    "600": "#BE8B00",
    "700": "#916A00",
    "800": "#614700",
    "900": "#332500",
  },
  GREEN: {
    "100": "#F4FFE6",
    "200": "#D3F9A5",
    "300": "#B2F066",
    "400": "#8EE12A",
    "500": "#6FCA00",
    "600": "#5EAB00",
    "700": "#488300",
    "800": "#315900",
    "900": "#1B3000",
  },
  CYAN: {
    "100": "#E6FFF4",
    "200": "#C7FEE7",
    "300": "#9CF0CD",
    "400": "#67D3A6",
    "500": "#2EAA77",
    "600": "#10774C",
    "700": "#004F2F",
    "800": "#003620",
    "900": "#002918",
  },
  BLUE: {
    "100": "#E6F8FF",
    "200": "#C8EEFD",
    "300": "#8BD9F7",
    "400": "#2FB7EC",
    "500": "#0090D9",
    "600": "#0073BF",
    "700": "#00579E",
    "800": "#003C7B",
    "900": "#002759",
  },
  COBALT: {
    "100": "#F0F4FF",
    "200": "#E5ECFF",
    "300": "#D0DBFF",
    "400": "#ADC0FD",
    "500": "#7996F9",
    "600": "#305BEF",
    "700": "#0739CF",
    "800": "#022786",
    "900": "#001340",
  },
  PURPLE: {
    "100": "#F4F0FF",
    "200": "#E7E0FC",
    "300": "#D3C5F8",
    "400": "#B59EF1",
    "500": "#8B66E5",
    "600": "#551FD0",
    "700": "#3700AF",
    "800": "#2A0082",
    "900": "#19004D",
  },
  SKIN: {
    "100": "#F6C8B5",
    "200": "#F1CBB4",
    "300": "#EAC6A7",
    "400": "#E7C1AA",
    "500": "#E8BB9A",
    "600": "#EAA781",
    "700": "#D58F66",
    "800": "#B17762",
    "900": "#9C614E",
    "000": "#A1594A",
    // "100": "#8C533B",
    // "200": "#512B22"
  },
  HAIR: {
    "100": "#FADFA9",
    "200": "#FBD17D",
    "300": "#C79843",
    "400": "#D7763F",
    "500": "#C0612F",
    "600": "#882118",
    "700": "#674225",
    "800": "#5C3426",
    "900": "#382422",
    "1000": "#30111E",
    "1100": "#2E082B",
    "1200": "#071822",
  },
};

const COMMON_THEME = {
  textWhite: PALETTES_V2.WHITE,
  textUltraLighter: PALETTES_V2.GREY["300"],
  textUltralight: PALETTES_V2.GREY["400"],
  textLight: PALETTES_V2.GREY["600"],
  textDark: PALETTES_V2.GREY["700"],
  textBlack: PALETTES_V2.GREY["800"],
  textPlaceholder: PALETTES_V2.GREY["400"],

  surfaceLightest: PALETTES_V2.WHITE,
  surfaceLighter: PALETTES_V2.GREY["100"],
  surfaceLight: PALETTES_V2.GREY["200"],
  surface: PALETTES_V2.GREY["300"],
  surfaceDark: PALETTES_V2.GREY["400"],
  surfaceDarker: PALETTES_V2.GREY["500"],
  info: PALETTES_V2.GREY["300"], // TODO [lliepert]: deprecate this in favour of surface

  hoverColor: PALETTES_V2.GREY["700"],
  hoverBackground: PALETTES_V2.GREY["100"],

  inputBackground: PALETTES_V2.WHITE,
  pageBackground: PALETTES_V2.GREY["100"],
  modalBackground: `${PALETTES_V2.GREY["800"]}CC`,

  borderPrimaryLightest: PALETTES_V2.WHITE,
  borderPrimaryLighter: PALETTES_V2.GREY["100"],
  borderPrimaryLight: PALETTES_V2.GREY["200"],
  borderPrimary: PALETTES_V2.GREY["300"],
  borderPrimaryDark: PALETTES_V2.GREY["400"],
  borderPrimaryDarker: PALETTES_V2.GREY["600"],

  corePrimaryLightest: PALETTES_V2.BLUE["100"],
  corePrimaryLighter: PALETTES_V2.BLUE["200"],
  corePrimaryLight: PALETTES_V2.BLUE["300"],
  corePrimary: PALETTES_V2.BLUE["400"],
  corePrimaryDark: PALETTES_V2.BLUE["600"],
  corePrimaryDarker: PALETTES_V2.BLUE["800"],
  corePrimaryDarkest: PALETTES_V2.BLUE["900"],

  positiveLighter: PALETTES_V2.CYAN["100"],
  positiveLight: PALETTES_V2.CYAN["300"],
  positive: PALETTES_V2.CYAN["400"],
  positiveDark: PALETTES_V2.CYAN["600"],
  positiveDarker: PALETTES_V2.CYAN["700"],
  positiveDarkest: PALETTES_V2.CYAN["800"],

  warningLighter: PALETTES_V2.YELLOW["100"],
  warningLight: PALETTES_V2.YELLOW["200"],
  warning: PALETTES_V2.YELLOW["400"],
  warningDark: PALETTES_V2.YELLOW["500"],
  warningDarker: PALETTES_V2.YELLOW["600"],
  warningDarkest: PALETTES_V2.YELLOW["700"],

  negativeLighter: PALETTES_V2.RED["100"],
  negativeLight: PALETTES_V2.RED["200"],
  negative: PALETTES_V2.RED["400"],
  negativeDark: PALETTES_V2.RED["500"],
  negativeDarker: PALETTES_V2.RED["600"],
  negativeDarkest: PALETTES_V2.RED["700"],

  cashLighter: PALETTES_V2.GREEN["200"],
  cashLight: PALETTES_V2.GREEN["300"],
  cash: PALETTES_V2.GREEN["400"],
  cashDark: PALETTES_V2.GREEN["600"],
  cashDarker: PALETTES_V2.GREEN["700"],
  cashDarkest: PALETTES_V2.GREEN["800"],

  primaryLighter: PALETTES_V2.BLUE["200"],
  primaryLight: PALETTES_V2.BLUE["300"],
  primary: PALETTES_V2.BLUE["400"],
  primaryDark: PALETTES_V2.BLUE["700"],
  primaryDarker: PALETTES_V2.BLUE["800"],
  primaryDarkest: PALETTES_V2.BLUE["900"],

  secondaryLighter: PALETTES_V2.COBALT["200"],
  secondaryLight: PALETTES_V2.COBALT["300"],
  secondary: PALETTES_V2.COBALT["400"],
  secondaryDark: PALETTES_V2.COBALT["600"],
  secondaryDarker: PALETTES_V2.COBALT["700"],
  secondaryDarkest: PALETTES_V2.COBALT["800"],

  tertiaryLighter: PALETTES_V2.PURPLE["200"],
  tertiaryLight: PALETTES_V2.PURPLE["300"],
  tertiary: PALETTES_V2.PURPLE["400"],
  tertiaryDark: PALETTES_V2.PURPLE["500"],
  tertiaryDarker: PALETTES_V2.PURPLE["600"],
  tertiaryDarkest: PALETTES_V2.PURPLE["700"],

  quaternaryLightest: PALETTES_V2.ORANGE["100"],
  quaternaryLighter: PALETTES_V2.ORANGE["200"],
  quaternaryLight: PALETTES_V2.ORANGE["300"],
  quaternary: PALETTES_V2.ORANGE["400"],
  quaternaryDark: PALETTES_V2.ORANGE["500"],
  quaternaryDarker: PALETTES_V2.ORANGE["600"],
  quaternaryDarkest: PALETTES_V2.ORANGE["700"],

  orangeSurface: PALETTES_V2.ORANGE["400"],

  lightGreenSurface: PALETTES_V2.CYAN["300"],
  greenSurface: PALETTES_V2.CYAN["500"],

  lightBlueSurface: PALETTES_V2.COBALT["100"],
  darkBlueSurface: PALETTES_V2.BLUE["600"],

  lightPurpleSurface: PALETTES_V2.PURPLE["400"],
  purpleSurface: PALETTES_V2.PURPLE["500"],
  darkPurpleSurface: PALETTES_V2.PURPLE["600"],

  wishBlue: PALETTES_V2.BLUE["400"],

  wishExpressOrange: PALETTES_V2.ORANGE["200"],

  metricRed: PALETTES_V2.RED["400"],
  metricOrange: PALETTES_V2.ORANGE["400"],
  metricYellow: PALETTES_V2.YELLOW["500"],
  metricCyan: PALETTES_V2.CYAN["400"],
  metricBlue: PALETTES_V2.BLUE["500"],
  metricPurple: PALETTES_V2.PURPLE["400"],
};

const DARK_COMMON_THEME = {
  textWhite: PALETTES_DEPRECATED.textColors.White,
  textUltraLighter: PALETTES_DEPRECATED.textColors.White,
  textUltralight: PALETTES_DEPRECATED.textColors.White,
  textLight: PALETTES_DEPRECATED.textColors.White,
  textDark: PALETTES_DEPRECATED.textColors.White,
  textBlack: PALETTES_DEPRECATED.textColors.White,
  textPlaceholder: PALETTES_DEPRECATED.greyScaleColors.LighterGrey,

  surfaceLightest: PALETTES_DEPRECATED.textColors.Ink,
  surfaceLighter: PALETTES_DEPRECATED.textColors.DarkInk,
  surfaceLight: PALETTES_DEPRECATED.textColors.DarkInk,
  surface: PALETTES_DEPRECATED.textColors.LightInk,
  surfaceDark: PALETTES_DEPRECATED.textColors.LightInk,
  surfaceDarker: PALETTES_DEPRECATED.textColors.White,

  hoverColor: PALETTES_DEPRECATED.greyScaleColors.DarkGrey,
  hoverBackground: PALETTES_DEPRECATED.greyScaleColors.DarkerGrey,

  inputBackground: PALETTES_DEPRECATED.textColors.DarkInk,
  pageBackground: PALETTES_DEPRECATED.textColors.Ink,
  modalBackground: `${PALETTES_DEPRECATED.textColors.DarkInk}CC`,
  info: PALETTES_DEPRECATED.greyScaleColors.DarkGrey,

  borderPrimaryLightest: PALETTES_DEPRECATED.textColors.Ink,
  borderPrimaryLighter: PALETTES_DEPRECATED.textColors.Ink,
  borderPrimaryLight: PALETTES_DEPRECATED.textColors.Ink,
  borderPrimary: PALETTES_DEPRECATED.textColors.Ink,
  borderPrimaryDark: PALETTES_DEPRECATED.greyScaleColors.DarkGrey,
  borderPrimaryDarker: PALETTES_DEPRECATED.greyScaleColors.Grey,

  corePrimaryLightest: PALETTES_V2.BLUE["900"],
  corePrimaryLighter: PALETTES_V2.BLUE["800"],
  corePrimaryLight: PALETTES_V2.BLUE["700"],
  corePrimary: PALETTES_V2.BLUE["400"],
  corePrimaryDark: PALETTES_V2.BLUE["300"],
  corePrimaryDarker: PALETTES_V2.BLUE["200"],
  corePrimaryDarkest: PALETTES_V2.BLUE["100"],

  positiveLighter: PALETTES_DEPRECATED.cyans.LighterCyan,
  positiveLight: PALETTES_DEPRECATED.cyans.LighterCyan,
  positive: PALETTES_DEPRECATED.cyans.Cyan,
  positiveDark: PALETTES_DEPRECATED.cyans.DarkCyan,
  positiveDarker: PALETTES_DEPRECATED.cyans.DarkerCyan,
  positiveDarkest: PALETTES_DEPRECATED.cyans.DarkestCyan,

  warningLighter: PALETTES_DEPRECATED.yellows.DarkestYellow,
  warningLight: PALETTES_DEPRECATED.yellows.DarkYellow,
  warning: PALETTES_DEPRECATED.yellows.Yellow,
  warningDark: PALETTES_DEPRECATED.yellows.Yellow,
  warningDarker: PALETTES_DEPRECATED.yellows.LightYellow,
  warningDarkest: PALETTES_DEPRECATED.yellows.LighterYellow,

  negativeLighter: PALETTES_DEPRECATED.reds.DarkestRed,
  negativeLight: PALETTES_DEPRECATED.reds.DarkerRed,
  negative: PALETTES_DEPRECATED.reds.DarkRed,
  negativeDark: PALETTES_DEPRECATED.reds.Red,
  negativeDarker: PALETTES_DEPRECATED.reds.LightRed,
  negativeDarkest: PALETTES_DEPRECATED.reds.LighterRed,

  cashLighter: PALETTES_V2.GREEN["800"],
  cashLight: PALETTES_V2.GREEN["600"],
  cash: PALETTES_V2.GREEN["400"],
  cashDark: PALETTES_V2.GREEN["300"],
  cashDarker: PALETTES_V2.GREEN["200"],
  cashDarkest: PALETTES_V2.GREEN["100"],

  primaryLighter: PALETTES_V2.BLUE["900"],
  primaryLight: PALETTES_V2.BLUE["700"],
  primary: PALETTES_V2.BLUE["400"],
  primaryDark: PALETTES_V2.BLUE["300"],
  primaryDarker: PALETTES_V2.BLUE["200"],
  primaryDarkest: PALETTES_V2.BLUE["100"],

  secondaryLighter: PALETTES_V2.COBALT["900"],
  secondaryLight: PALETTES_V2.COBALT["700"],
  secondary: PALETTES_V2.COBALT["400"],
  secondaryDark: PALETTES_V2.COBALT["300"],
  secondaryDarker: PALETTES_V2.COBALT["200"],
  secondaryDarkest: PALETTES_V2.COBALT["100"],

  tertiaryLighter: PALETTES_V2.PURPLE["800"],
  tertiaryLight: PALETTES_V2.PURPLE["600"],
  tertiary: PALETTES_V2.PURPLE["400"],
  tertiaryDark: PALETTES_V2.PURPLE["300"],
  tertiaryDarker: PALETTES_V2.PURPLE["200"],
  tertiaryDarkest: PALETTES_V2.PURPLE["100"],

  quaternaryLightest: PALETTES_V2.ORANGE["900"],
  quaternaryLighter: PALETTES_V2.ORANGE["800"],
  quaternaryLight: PALETTES_V2.ORANGE["600"],
  quaternary: PALETTES_V2.ORANGE["400"],
  quaternaryDark: PALETTES_V2.ORANGE["300"],
  quaternaryDarker: PALETTES_V2.ORANGE["200"],
  quaternaryDarkest: PALETTES_V2.ORANGE["100"],
  orangeSurface: PALETTES_DEPRECATED.oranges.DarkOrange,

  lightGreenSurface: PALETTES_V2.CYAN["300"],
  greenSurface: PALETTES_V2.CYAN["500"],

  lightBlueSurface: PALETTES_V2.COBALT["100"],
  darkBlueSurface: PALETTES_V2.BLUE["600"],

  lightPurpleSurface: PALETTES_V2.PURPLE["400"],
  purpleSurface: PALETTES_DEPRECATED.purples.DarkPurple,
  darkPurpleSurface: PALETTES_V2.PURPLE["600"],

  wishBlue: PALETTES_V2.BLUE["400"],

  wishExpressOrange: PALETTES_DEPRECATED.oranges.LighterOrange,

  metricRed: PALETTES_V2.RED["400"],
  metricOrange: PALETTES_V2.ORANGE["400"],
  metricYellow: PALETTES_V2.YELLOW["500"],
  metricCyan: PALETTES_V2.CYAN["400"],
  metricBlue: PALETTES_V2.BLUE["500"],
  metricPurple: PALETTES_V2.PURPLE["400"],
};

const MERCHANT_THEME = {
  ...COMMON_THEME,
  primaryLight: PALETTES_V2.COBALT["100"],
  primary: PALETTES_V2.COBALT["600"],
  primaryDark: PALETTES_V2.COBALT["800"],
  topbarBackground: PALETTES_V2.COBALT["600"],
  topbarSearchBackground: PALETTES_V2.COBALT["300"],
};

const STORE_THEME = {
  ...COMMON_THEME,
  primaryLight: PALETTES_V2.COBALT["100"],
  primary: PALETTES_V2.COBALT["600"],
  primaryDark: PALETTES_V2.BLUE["800"],
  topbarBackground: PALETTES_DEPRECATED.palaceBlues.Pacifica,
  topbarSearchBackground: PALETTES_DEPRECATED.textColors.White,
};

const STORE_DARK_THEME = {
  ...DARK_COMMON_THEME,
  primaryLight: PALETTES_DEPRECATED.coreColors.LighterWishBlue,
  primary: PALETTES_DEPRECATED.palaceBlues.Pacifica,
  primaryDark: PALETTES_DEPRECATED.coreColors.DarkerWishBlue,
  topbarBackground: PALETTES_DEPRECATED.palaceBlues.Pacifica,
  topbarSearchBackground: PALETTES_DEPRECATED.textColors.White,
};

const MERCHANT_DARK_THEME = {
  ...DARK_COMMON_THEME,
  primaryLight: PALETTES_DEPRECATED.coreColors.LighterWishBlue,
  primary: PALETTES_DEPRECATED.coreColors.WishBlue,
  primaryDark: PALETTES_DEPRECATED.coreColors.DarkerWishBlue,
  topbarBackground: PALETTES_DEPRECATED.coreColors.WishBlue,
  topbarSearchBackground: PALETTES_DEPRECATED.coreColors.LighterWishBlue,
};

const PLUS_THEME = {
  ...COMMON_THEME,
  primaryLight: PALETTES_V2.COBALT["100"],
  primary: PALETTES_V2.COBALT["600"],
  primaryDark: PALETTES_V2.COBALT["800"],
  topbarBackground: PALETTES_DEPRECATED.coreColors.DarkerWishBlue,
  topbarSearchBackground: "#3C5F8D",
};

const PLUS_DARK_THEME = {
  ...DARK_COMMON_THEME,
  primaryLight: PALETTES_DEPRECATED.coreColors.LighterWishBlue,
  primary: PALETTES_DEPRECATED.coreColors.WishBlue,
  primaryDark: PALETTES_DEPRECATED.coreColors.DarkerWishBlue,
  topbarBackground: PALETTES_DEPRECATED.coreColors.DarkerWishBlue,
  topbarSearchBackground: "#3C5F8D",
};

const INTERNAL_THEME = MERCHANT_THEME;
const INTERNAL_DARK_THEME = MERCHANT_DARK_THEME;

type ThemeName =
  | "MERCHANT"
  | "MERCHANT_DARK"
  | "INTERNAL"
  | "INTERNAL_DARK"
  | "PLUS"
  | "PLUS_DARK"
  | "STORE"
  | "STORE_DARK";

const APP_THEMES: { [k in ThemeName]: AppTheme } = {
  MERCHANT: MERCHANT_THEME,
  MERCHANT_DARK: MERCHANT_DARK_THEME,
  INTERNAL: INTERNAL_THEME,
  INTERNAL_DARK: INTERNAL_DARK_THEME,
  PLUS: PLUS_THEME,
  PLUS_DARK: PLUS_DARK_THEME,
  STORE: STORE_THEME,
  STORE_DARK: STORE_DARK_THEME,
};

const LEGO_THEMES: { [k in ThemeName]: LegoTheme } = {
  MERCHANT: MERCHANT_THEME,
  MERCHANT_DARK: MERCHANT_DARK_THEME,
  INTERNAL: INTERNAL_THEME,
  INTERNAL_DARK: INTERNAL_DARK_THEME,
  PLUS: PLUS_THEME,
  PLUS_DARK: PLUS_DARK_THEME,
  STORE: STORE_THEME,
  STORE_DARK: STORE_DARK_THEME,
};

class ThemeStore {
  @observable prefersDark = false; //window.matchMedia('(prefers-color-scheme: dark)').matches;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentAppTheme = (override?: ThemeName): AppTheme => {
    const { prefersDark } = this;
    // const userStore = UserStore.instance(); // TODO [lliepert]: commenting out userstore usage, will bring back in further ticket

    const appThemes = APP_THEMES;

    // const merchantTheme = appThemes.MERCHANT;
    // const merchantDarkTheme = appThemes.MERCHANT_DARK;

    // const storeTheme = appThemes.STORE;
    // const storeDarkTheme = appThemes.STORE_DARK;

    // const plusTheme = appThemes.PLUS;
    // const plusDarkTheme = appThemes.PLUS_DARK;

    const internalTheme = appThemes.INTERNAL;
    const internalDarkTheme = appThemes.INTERNAL_DARK;

    // TODO [lliepert]: commenting out userstore usage, will bring back in further ticket
    // if (!userStore.isLoggedIn) {
    //   return prefersDark ? merchantDarkTheme : merchantTheme;
    // }

    // if (userStore.isStoreUser) {
    //   return prefersDark ? storeDarkTheme : storeTheme;
    // }

    // if (userStore.isPlusUser) {
    //   return prefersDark ? plusDarkTheme : plusTheme;
    // }

    // if (userStore.isMerchant) {
    //   return prefersDark ? merchantDarkTheme : merchantTheme;
    // }

    return prefersDark ? internalDarkTheme : internalTheme;
  };

  currentLegoTheme = (override?: ThemeName): LegoTheme => {
    const { prefersDark } = this;
    // TODO [lliepert]: commenting out userstore usage, will bring back in further ticket
    // const userStore = UserStore.instance();

    const legoThemes = LEGO_THEMES;
    if (override) {
      return legoThemes[override];
    }

    // const merchantTheme = legoThemes.MERCHANT;
    // const merchantDarkTheme = legoThemes.MERCHANT_DARK;

    // const storeTheme = legoThemes.STORE;
    // const storeDarkTheme = legoThemes.STORE_DARK;

    // const plusTheme = legoThemes.PLUS;
    // const plusDarkTheme = legoThemes.PLUS_DARK;

    const internalTheme = legoThemes.INTERNAL;
    const internalDarkTheme = legoThemes.INTERNAL_DARK;

    // TODO [lliepert]: commenting out userstore usage, will bring back in further ticket
    // if (!userStore.isLoggedIn) {
    //   return prefersDark ? merchantDarkTheme : merchantTheme;
    // }

    // if (userStore.isStoreUser) {
    //   return prefersDark ? storeDarkTheme : storeTheme;
    // }

    // if (userStore.isPlusUser) {
    //   return prefersDark ? plusDarkTheme : plusTheme;
    // }

    // if (userStore.isMerchant) {
    //   return prefersDark ? merchantDarkTheme : merchantTheme;
    // }

    return prefersDark ? internalDarkTheme : internalTheme;
  };

  @computed get topbarBackground(): string {
    const { env } = EnvironmentStore.instance();
    switch (env) {
      case "fe_qa_staging":
        return PALETTES_DEPRECATED.cyans.DarkestCyan;
      case "sandbox":
        return PALETTES_DEPRECATED.purples.DarkerPurple;
      case "stage":
        return PALETTES_DEPRECATED.textColors.Ink;
      default:
        return PALETTES_V2.WHITE;
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
        return PALETTES_V2.GREY["200"];
    }
  }
}

export const useThemeStore = (): ThemeStore => {
  return useContext(ThemeStoreContext);
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

// below we mock out ThemeStore.instance() for compatibility with legacy code
const LegacyThemeStoreMock = {
  instance: (): ThemeStore => {
    const ref = ThemeStoreRef.current;
    if (ref == null) {
      throw "Attempting to access reference to un-instantiated ThemeStore";
    }
    return ref;
  },
};

export default LegacyThemeStoreMock;
