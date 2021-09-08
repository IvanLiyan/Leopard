import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { BaseProps } from "@riptide/toolkit/types";
import { useTheme } from "@riptide/toolkit/theme";

import Layout from "@components/core/Layout";

const NUM_PLACEHOLDERS = 5;

export type Props = Omit<BaseProps, "children">;

const LoadingRow: React.FC<Props> = ({ style }: Props) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexRow style={[styles.root, style]}>
      {Array.from(Array(NUM_PLACEHOLDERS).keys()).map((i) => (
        <Layout.FlexColumn key={i}>
          <div className={css(styles.image, styles.animate)} />
          <div className={css(styles.price, styles.animate)} />
          <div className={css(styles.purchasers, styles.animate)} />
        </Layout.FlexColumn>
      ))}
    </Layout.FlexRow>
  );
};

export default LoadingRow;

const useStylesheet = () => {
  const { surfaceMedium, surfaceDark } = useTheme();

  return useMemo(() => {
    const keyframes = {
      "0%": {
        backgroundColor: surfaceMedium,
      },
      "40%": {
        backgroundColor: surfaceDark,
      },
      "100%": {
        backgroundColor: surfaceMedium,
      },
    };

    return StyleSheet.create({
      root: {
        flex: "none",
        overflowX: "hidden",
      },
      image: {
        height: 128,
        width: 128,
        marginRight: 8,
        marginBottom: 8,
      },
      price: {
        height: 14,
        width: 54,
        marginBottom: 6,
      },
      purchasers: {
        height: 10,
        width: 84,
        marginBottom: 18,
      },
      animate: {
        animationName: [keyframes],
        animationDuration: "2s",
        animationIterationCount: "infinite",
      },
    });
  }, [surfaceMedium, surfaceDark]);
};
