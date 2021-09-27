import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type MetricProps = BaseProps & {
  readonly title: string;
  readonly value: string;
};

const Metric = ({ title, value, className }: MetricProps) => {
  const styles = useStylesheet();
  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.title)}>{title}</div>
      <div className={css(styles.value)}>{value}</div>
    </div>
  );
};
export default observer(Metric);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        title: {
          fontSize: 16,
          fontWeight: fonts.weightMedium,
          color: textBlack,
          marginBottom: 5,
        },
        value: {
          fontSize: 24,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.25,
          color: textBlack,
        },
      }),
    [textBlack]
  );
};
