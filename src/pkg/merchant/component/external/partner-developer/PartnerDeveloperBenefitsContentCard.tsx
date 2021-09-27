import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { weightBold } from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly color: string;
  readonly title: string;
  readonly message: string;
};

const PartnerDeveloperBenefitsContentCard = (props: Props) => {
  const { color, title, message, className, style } = props;
  const styles = useStylesheet(color);

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.title)}>{title}</div>
      <div className={css(styles.message)}>{message}</div>
    </div>
  );
};

const useStylesheet = (themeColor: string) => {
  const { textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 30,
          border: `2px solid ${themeColor}`,
          boxShadow: `10px -10px ${themeColor}`,
        },
        title: {
          fontSize: "36px",
          lineHeight: 1.33,
          marginBottom: 28,
          fontWeight: weightBold,
          color: themeColor,
          "@media (max-width: 900px)": {
            fontSize: "24px",
          },
        },
        message: {
          fontSize: "16px",
          lineHeight: 1.5,
          marginBottom: 24,
          color: textBlack,
        },
      }),
    [themeColor, textBlack]
  );
};

export default PartnerDeveloperBenefitsContentCard;
