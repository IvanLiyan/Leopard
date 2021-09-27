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

export type IllustratedMetricProps = BaseProps & {
  readonly illustration: IllustrationName;
  readonly title: string;
  readonly value: string;
};

const IllustratedMetric = ({
  illustration,
  title,
  value,
  className,
}: IllustratedMetricProps) => {
  const styles = useStylesheet();
  return (
    <div className={css(styles.root, className)}>
      <Illustration
        name={illustration}
        alt={illustration}
        className={css(styles.illustration)}
      />
      <div className={css(styles.textContainer)}>
        <div className={css(styles.title)}>{title}</div>
        <div className={css(styles.value)}>{value}</div>
      </div>
    </div>
  );
};
export default observer(IllustratedMetric);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
        },
        illustration: {
          width: 40,
          height: 40,
        },
        textContainer: {
          display: "flex",
          flexDirection: "column",
        },
        title: {
          fontSize: 12,
          fontWeight: fonts.weightNormal,
        },
        value: {
          fontSize: 16,
          fontWeight: fonts.weightMedium,
          color: textBlack,
        },
      }),
    [textBlack],
  );
};
