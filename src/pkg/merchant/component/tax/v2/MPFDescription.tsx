import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

export type MPFDescriptionProps = BaseProps;

const MPFDescription: React.FC<MPFDescriptionProps> = ({
  className,
  style,
}: MPFDescriptionProps) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <Icon name="blueCheckmark" className={css(styles.icon)} />
      <div className={css(styles.textContent)}>
        <Text className={css(styles.title)} weight="bold">
          Wish Marketplace Facilitator (MPF)
        </Text>
        <Text className={css(styles.description)}>
          Below is a list of marketplace regions where Wish collects and remits
          taxes on behalf of merchants if certain requirements and thresholds
          are met.
        </Text>
      </div>
    </div>
  );
};

export default observer(MPFDescription);

const useStylesheet = () => {
  const { surfaceLightest, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 24,
          display: "flex",
          backgroundColor: surfaceLightest,
        },
        icon: {
          width: 24,
          height: 24,
          marginRight: 8,
        },
        textContent: {
          display: "flex",
          flexDirection: "column",
        },
        title: {
          fontSize: 16,
          lineHeight: "20px",
          color: textBlack,
        },
        description: {
          marginTop: 8,
          fontSize: 14,
          lineHeight: "20px",
          color: textBlack,
        },
      }),
    [surfaceLightest, textBlack]
  );
};
