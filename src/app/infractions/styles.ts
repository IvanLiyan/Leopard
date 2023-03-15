import { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { IS_SMALL_SCREEN, IS_LARGE_SCREEN } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";

export const useInfractionDetailsStylesheet = () => {
  const { surfaceLight } = useTheme();
  return useMemo(() => {
    return StyleSheet.create({
      disputeContent: {
        // flex and grid don't play nicely with Mui accordion
        marginTop: 24,
        ":nth-child(1n) > div": {
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
      },
      detailsContent: {
        display: "grid",
        gridGap: 24,
        [`@media ${IS_SMALL_SCREEN}`]: {
          gridTemplateColumns: "1fr",
        },
        [`@media ${IS_LARGE_SCREEN}`]: {
          gridTemplateColumns: "1fr 1fr",
          alignItems: "start",
        },
        marginTop: 24,
      },
      column: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gridGap: 16,
      },
      cardRoot: {
        padding: 16,
      },
      divider: {
        margin: "10px 0px 16px 0px",
      },
      bodyText: {
        padding: 16,
        backgroundColor: surfaceLight,
      },
      cardMarginSmall: {
        ":not(:first-child)": {
          marginTop: 8,
        },
      },
      cardMargin: {
        ":not(:first-child)": {
          marginTop: 12,
        },
      },
      cardMarginLarge: {
        ":not(:first-child)": {
          marginTop: 16,
        },
      },
    });
  }, [surfaceLight]);
};
