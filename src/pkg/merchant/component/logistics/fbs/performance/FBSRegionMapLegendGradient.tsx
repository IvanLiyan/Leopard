/* eslint-disable filenames/match-regex */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightMedium } from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useLocalizationStore } from "@stores/LocalizationStore";

export type FBSRegionMapLegendGradientProps = BaseProps & {
  readonly colors: ReadonlyArray<string>;
  readonly prices: ReadonlyArray<number>;
  readonly currency: string;
};

const FBSRegionMapLegendGradient = (props: FBSRegionMapLegendGradientProps) => {
  const { className, colors, prices, currency } = props;
  const styles = useStyleSheet();

  const { localeProper } = useLocalizationStore();

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.gradient)}>
        {colors.map((c) => (
          <div
            className={css(styles.gradientBlock)}
            style={{ backgroundColor: c }}
            key={c}
          />
        ))}
      </div>
      <div className={css(styles.prices)}>
        {prices.map((p, idx) => (
          <div
            className={css(
              styles.priceText,
              idx === 0 ? styles.edgePriceBlock : styles.priceBlock,
            )}
            key={p}
          >
            {!isNaN(p) &&
              new Intl.NumberFormat(localeProper, {
                style: "currency",
                currency,
                minimumFractionDigits: 0,
              }).format(p)}
          </div>
        ))}
        <div className={css(styles.edgePriceBlock)} />
      </div>
    </div>
  );
};

export default observer(FBSRegionMapLegendGradient);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        gradient: {
          flex: 1,
          display: "flex",
          flexDirection: "row",
          borderRadius: 2,
          overflow: "hidden",
        },
        gradientBlock: {
          flex: 1,
        },
        prices: {
          flex: 1,
          display: "flex",
          flexDirection: "row",
        },
        edgePriceBlock: {
          flex: 0.5,
          textAlign: "left",
        },
        priceBlock: {
          flex: 1,
          textAlign: "center",
        },
        priceText: {
          color: palettes.textColors.LightInk,
          cursor: "default",
          fontSize: 16,
          fontWeight: weightMedium,
          userSelect: "none",
        },
      }),
    [],
  );
};
