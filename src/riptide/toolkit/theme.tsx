import React, { createContext, useContext } from "react";

const PALETTE = {
  WHITE: "#FFFFFF",
  BLACK: "#000000",
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

const defaultTheme = {
  primaryLight: PALETTE.BLUE["200"],
  primary: PALETTE.BLUE["400"],
  primaryDark: PALETTE.BLUE["600"],

  textLight: PALETTE.GREY["600"],
  textDark: PALETTE.GREY["900"],
  textBlack: PALETTE.GREY["900"],

  border: PALETTE.GREY["300"],

  surfaceWhite: PALETTE.WHITE,
  surfaceLight: PALETTE.GREY["200"],
  surfaceMediumLight: PALETTE.GREY["300"],
};

export type Theme = Readonly<typeof defaultTheme>;

const ThemeContext = createContext(defaultTheme);

export const ThemeProvider: React.FC = ({ children }) => {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  return useContext(ThemeContext);
};

export type FontColor = "LIGHT" | "DARK" | "BLACK" | "INHERIT";
export type FontWeight = "REGULAR" | "MEDIUM" | "SEMIBOLD" | "BOLD";
type FontFamily =
  | "Proxima-Regular"
  | "Proxima-Medium"
  | "Proxima-Semibold"
  | "Proxima-Bold";

export const useFontWeight = (weight: FontWeight): FontFamily => {
  const FontWeightToFontFamily: { [weight in FontWeight]: FontFamily } = {
    REGULAR: "Proxima-Regular",
    MEDIUM: "Proxima-Medium",
    SEMIBOLD: "Proxima-Semibold",
    BOLD: "Proxima-Bold",
  };

  return FontWeightToFontFamily[weight];
};

export const useFontColor = (color: FontColor): string | undefined => {
  const { textLight, textDark, textBlack } = useTheme();

  const FontColorToThemeColor: { [color in FontColor]: string | undefined } = {
    LIGHT: textLight,
    DARK: textDark,
    BLACK: textBlack,
    INHERIT: undefined,
  };

  return FontColorToThemeColor[color];
};
