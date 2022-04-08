/* eslint-disable filenames/match-regex */
/* eslint-disable local-rules/unwrapped-i18n */
//
//  toolkit/colors.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 8/7/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

export const palettes = {
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

export const gradients = {
  WishBlueToCyan: {
    startColor: "WishBlue",
    start: "#2FB7EC",
    endColor: "Cyan",
    end: "#1ACC94",
    value: "linear-gradient(288deg, #1ACC94, #2FB7EC)",
  },
  WishBlueToDarkPalaceBlue: {
    startColor: "WishBlue",
    start: "#2FB7EC",
    endColor: "DarkPalaceBlue",
    end: "#376EEE",
    value: "linear-gradient(288deg, #376EEE, #2FB7EC)",
  },
  WishBlueToDarkPurple: {
    startColor: "WishBlue",
    start: "#2FB7EC",
    endColor: "DarkPurple",
    end: "#8055FF",
    value: "linear-gradient(288deg, #8055FF, #2FB7EC)",
  },
  DarkYellowToDarkOrange: {
    startColor: "DarkYellow",
    start: "#FFC72C",
    endColor: "DarkOrange",
    end: "#EF8D2E",
    value: "linear-gradient(288deg, #EF8D2E, #FFC72C)",
  },
  DarkRedToLighterOrange: {
    startColor: "DarkRed",
    start: "#E56175",
    endColor: "LighterOrange",
    end: "#F9D3AE",
    value: "linear-gradient(288deg, #F9D3AE, #E56175)",
  },
};

export const black = palettes.textColors.DarkInk;
export const text = palettes.textColors.Ink;
export const text01 = palettes.textColors.Ink;
export const white = palettes.textColors.White;

export const info = palettes.coreColors.WishBlue;
export const grayED = "#ededed";
export const wishBlue = palettes.coreColors.WishBlue;
export const cashGreen = palettes.greens.CashGreen;
export const positive = palettes.cyans.LightCyan;
export const negative = palettes.reds.DarkRed;
export const borderGray = palettes.greyScaleColors.Grey;
export const positiveLight = "#f5cccc";
export const negativeLight = "#d9ead3";
export const pageBackground = "#f8fafb";
export const warningYellow = palettes.yellows.Yellow;

export const wishExpressOrange = "#ef8d2e";

export const modalBackdrop = "rgba(74, 95, 110, 1)";

export const redocThemeColor = {
  http: {
    get: "#6bbd5b",
    post: "#248fb2",
    put: "#9b708b",
    options: "#d3ca12",
    patch: "#e09d43",
    delete: "#e27a7a",
    basic: "#999",
    link: "#31bbb6",
    head: "#c167e4",
  },
};
