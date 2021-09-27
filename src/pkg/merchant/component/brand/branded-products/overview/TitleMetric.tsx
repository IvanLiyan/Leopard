import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Illustration, IllustrationName } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type TitleMetricProps = BaseProps & {
  readonly illustration: IllustrationName;
  readonly title: string;
  readonly value: string;
};

const TitleMetric = ({
  illustration,
  title,
  value,
  className,
}: TitleMetricProps) => {
  const styles = useStylesheet();
  return (
    <div className={css(styles.root, className)}>
      <Illustration
        name={illustration}
        alt={illustration}
        className={css(styles.illustration)}
      />
      <div className={css(styles.title)}>{title}</div>
      <div className={css(styles.value)}>{value}</div>
    </div>
  );
};
export default observer(TitleMetric);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: 24,
        },
        illustration: {
          width: 40,
          height: 40,
        },
        title: {
          fontSize: 14,
          fontWeight: fonts.weightMedium,
          marginTop: 12,
          marginBottom: 4,
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
