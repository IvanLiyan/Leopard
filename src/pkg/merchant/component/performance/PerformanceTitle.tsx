import React from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Popover } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type TitleProps = BaseProps & {
  readonly title: string;
  readonly dateText: string;
};

const PerformanceTitle = (props: TitleProps) => {
  const { children, title, dateText } = props;
  const styles = useStyleSheet();
  return (
    <div className={css(styles.titleContainer)}>
      <div className={css(styles.title)}>{title}</div>
      <Popover
        className={css(styles.dateRange)}
        popoverContent={() => {
          return <div className={css(styles.datePopup)}>{dateText}</div>;
        }}
      >
        {children}
      </Popover>
    </div>
  );
};

export default PerformanceTitle;

const useStyleSheet = () =>
  StyleSheet.create({
    titleContainer: {
      margin: "7%",
    },
    title: {
      fontSize: 20,
      fontWeight: fonts.weightBold,
      color: palettes.textColors.Ink,
      marginBottom: "2%",
    },
    dateRange: {
      fontSize: 14,
      color: palettes.textColors.LightInk,
      display: "inline-block",
    },
    datePopup: {
      margin: 8,
      // eslint-disable-next-line local-rules/no-frozen-width
      width: 207,
      fontSize: 12,
    },
  });
