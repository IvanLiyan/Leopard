import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightBold, weightMedium } from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type SimpleStatBoxProps = BaseProps & {
  readonly value: any | null | undefined;
  readonly title: string;
  readonly titleIcon?: string;
};

const SimpleStatBox = (props: SimpleStatBoxProps) => {
  const { className, title, value, titleIcon } = props;
  const styles = useStyleSheet();

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.content)}>
        <div className={css(styles.titleContainer)}>
          {titleIcon && (
            <img
              className={css(styles.titleIcon)}
              src={titleIcon}
              alt="stat number icon"
              draggable="false"
            />
          )}
          <div className={css(styles.title)}>{title}</div>
        </div>
        <div className={css(value ? styles.value : styles.noValue)}>
          {value ? value : "--"}
        </div>
      </div>
    </div>
  );
};

export default observer(SimpleStatBox);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        content: {
          display: "flex",
          flexDirection: "column",
        },
        titleContainer: {
          display: "flex",
        },
        titleIcon: {
          marginRight: 6,
        },
        title: {
          color: palettes.textColors.LightInk,
          cursor: "default",
          fontSize: 16,
          fontWeight: weightMedium,
          userSelect: "none",
        },
        value: {
          color: palettes.textColors.Ink,
          cursor: "default",
          fontSize: 28,
          fontWeight: weightBold,
          lineHeight: 1.14,
          marginTop: 4,
          userSelect: "none",
        },
        noValue: {
          color: palettes.greyScaleColors.DarkGrey,
          fontSize: 32,
          fontWeight: weightMedium,
          lineHeight: 1.14,
          userSelect: "none",
        },
      }),
    []
  );
};
