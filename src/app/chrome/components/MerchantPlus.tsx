/* moved from
 * @plus/component/nav/MerchantPlus.tsx
 * by https://gist.github.com/yuhchen-wish/b80dd7fb4233edf447350a7daec083b1
 * on 1/18/2022
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import Illustration, { IllustrationName } from "@core/components/Illustration";
import { Layout, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

/* Merchant Store */
import { useUserStore } from "@core/stores/UserStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";

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
        alt={text || i`Wish for Merchants`}
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

  return loggedInMerchantUser?.displayName || "";
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
          "@media (max-width: 1150px)": {
            display: "none",
          },
          "@media (min-width: 1150px)": {
            maxWidth: 200,
          },
        },
      }),
    [textColor],
  );
};
