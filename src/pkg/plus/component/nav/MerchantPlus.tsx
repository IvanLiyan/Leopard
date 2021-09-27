import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Illustration } from "@merchant/component/core";
import { Layout, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Store */
import { useUserStore } from "@merchant/stores/UserStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IllustrationName } from "@merchant/component/core";
import { useTheme } from "@merchant/stores/ThemeStore";

export type MerchantPlusMode = "default" | "ink" | "white";
type Props = BaseProps & {
  readonly text?: string;
  readonly mode?: MerchantPlusMode;
};

const MerchantPlus: React.FC<Props> = (props: Props) => {
  const { className, style, text, mode } = props;

  const styles = useStylesheet(props);
  const headerText = useHeaderText(props);

  return (
    <Layout.FlexRow className={css(className, style)} alignItems="flex-end">
      <Illustration
        name={getIllustration(mode)}
        animate={false}
        alt={text || i`Merchant Plus`}
        className={css(styles.logo)}
      />
      <Text
        className={css(styles.textContainer)}
        weight="medium"
        style={{ lineHeight: 1 }}
      >
        {headerText}
      </Text>
    </Layout.FlexRow>
  );
};

const useHeaderText = ({ text }: Props): string => {
  const { isDisabledMerchant, loggedInMerchantUser } = useUserStore();
  if (text) {
    return text;
  }

  if (isDisabledMerchant) {
    return i`Disabled`;
  }

  return loggedInMerchantUser.display_name;
};

const getIllustration = (mode?: MerchantPlusMode): IllustrationName => {
  switch (mode) {
    case "ink":
      return "wishLogoInk";
    case "white":
      return "wishLogoWhite";
    default:
      return "wishLogoBlue";
  }
};

const useTextColor = (mode?: MerchantPlusMode): string => {
  const { textBlack, surfaceLightest } = useTheme();
  switch (mode) {
    case "ink":
    case "white":
      return surfaceLightest;
    default:
      return textBlack;
  }
};

export default observer(MerchantPlus);

const useStylesheet = ({ mode }: Props) => {
  const textColor = useTextColor(mode);
  return useMemo(
    () =>
      StyleSheet.create({
        logo: {
          width: 70,
          minHeight: 23,
          marginRight: 7,
          flexShrink: 0,
        },
        textContainer: {
          color: textColor,
          fontSize: 13,
          textTransform: "uppercase",
          userSelect: "none",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          letterSpacing: "0.1em",
          "@media (max-width: 900px)": {
            display: "none",
          },
          "@media (min-width: 900px)": {
            maxWidth: 200,
          },
        },
      }),
    [textColor]
  );
};
