import React from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Illustration, IllustrationName } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PerformanceData } from "@merchant/api/performance";

export type PerformanceArrowPopoverProps = BaseProps & {
  readonly title: string;
  readonly performanceData: PerformanceData;
};

type Context = {
  readonly decreaseColor: string;
  readonly increaseColor: string;
};

const PerformanceArrowPopover = (props: PerformanceArrowPopoverProps) => {
  const { performanceData, title } = props;
  const { previousDate, correlation, dataChange, trend } = performanceData;
  let increaseArrow: IllustrationName = "gincreaseArrow";
  let decreaseArrow: IllustrationName = "rdecreaseArrow";
  const colorContext = {
    decreaseColor: palettes.reds.DarkRed,
    increaseColor: palettes.cyans.LightCyan,
  };

  if (correlation == "inverse") {
    increaseArrow = "rincreaseArrow";
    decreaseArrow = "gdecreaseArrow";
    colorContext.increaseColor = palettes.reds.DarkRed;
    colorContext.decreaseColor = palettes.cyans.LightCyan;
  }

  const styles = useStyleSheet(colorContext);

  return (
    <>
      <div className={css(styles.toolTipTitle)}>{title}</div>
      <div
        className={css(
          trend == "down" ? styles.decreaseLabel : styles.increaseLabel
        )}
      >
        <Illustration
          name={trend == "down" ? decreaseArrow : increaseArrow}
          animate={false}
          className={css(styles.smallArrow)}
          alt={"arrow"}
        />
        {dataChange}
      </div>
      <div className={css(styles.toolTipCompare)}>
        Compared to {previousDate}
      </div>
    </>
  );
};

export default PerformanceArrowPopover;

const useStyleSheet = (ctx: Context) =>
  StyleSheet.create({
    toolTipTitle: {
      fontSize: 12,
      fontWeight: fonts.weightBold,
      color: palettes.textColors.Ink,
      textAlign: "left",
      marginTop: 8,
      marginLeft: 8,
      marginBottom: 4,
    },
    decreaseLabel: {
      fontSize: 12,
      color: ctx.decreaseColor,
      textAlign: "left",
      display: "flex",
      fontWeight: fonts.weightNormal,
      marginLeft: 8,
    },
    increaseLabel: {
      fontSize: 12,
      color: ctx.increaseColor,
      textAlign: "left",
      display: "flex",
      fontWeight: fonts.weightNormal,
      marginLeft: 8,
    },
    smallArrow: {
      marginRight: 2,
      marginTop: -2,
    },
    toolTipCompare: {
      fontSize: 12,
      color: palettes.textColors.DarkInk,
      textAlign: "left",
      marginTop: 4,
      marginLeft: 8,
      marginBottom: 4,
      marginRight: 8,
      fontWeight: fonts.weightNormal,
    },
  });
