/* eslint-disable filenames/match-regex */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightMedium } from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FBSRegionMapLegendItemProps = BaseProps & {
  readonly swatchFill: string;
  readonly text: string;
};

const FBSRegionMapLegendItem = (props: FBSRegionMapLegendItemProps) => {
  const { className, swatchFill, text } = props;
  const styles = useStyleSheet();

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.swatch)} style={{ background: swatchFill }} />
      <div className={css(styles.text)}>{text}</div>
    </div>
  );
};

export default observer(FBSRegionMapLegendItem);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        swatch: {
          borderRadius: 2,
          width: 20,
          height: 20,
          marginRight: 6,
        },
        text: {
          color: palettes.textColors.LightInk,
          cursor: "default",
          fontSize: 16,
          fontWeight: weightMedium,
          userSelect: "none",
        },
      }),
    []
  );
};
