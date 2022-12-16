import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Illustration, { IllustrationName } from "@core/components/Illustration";
import {
  css,
  IS_NOT_VERY_LARGE_SCREEN,
  IS_VERY_LARGE_SCREEN,
} from "@core/toolkit/styling";
import { useUserStore } from "@core/stores/UserStore";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";

export type WishLogoMode = "ink" | "white";
type Props = BaseProps & {
  readonly text?: string;
  readonly mode: WishLogoMode;
};

const WishLogo: React.FC<Props> = (props: Props) => {
  const { className, style, text, mode } = props;

  const styles = useStylesheet(props);
  const headerText = useHeaderText(props);

  return (
    <Layout.FlexRow className={css(className, style)} alignItems="flex-end">
      <Illustration
        name={getIllustration(mode)}
        animate={false}
        alt={text || ci18n("alt label for image", "Wish for Merchants")}
        style={styles.logo}
      />
      {headerText && (
        <Text style={styles.textContainer} weight="medium" renderAsSpan>
          {headerText}
        </Text>
      )}
    </Layout.FlexRow>
  );
};

const useHeaderText = ({ text }: Props): string | null | undefined => {
  const { isDisabledMerchant, loggedInMerchantUser } = useUserStore();
  if (text) {
    return text;
  }

  if (isDisabledMerchant) {
    return ci18n(
      "label telling merchants their account has been disabled",
      "Disabled",
    );
  }

  return loggedInMerchantUser?.displayName;
};

const getIllustration = (mode?: WishLogoMode): IllustrationName => {
  switch (mode) {
    case "white":
      return "wishLogoWhite";
    case "ink":
    default:
      return "wishLogoInk";
  }
};

const useTextColor = (mode: WishLogoMode): string => {
  const { textBlack, textWhite } = useTheme();
  switch (mode) {
    case "ink":
      return textBlack;
    case "white":
      return textWhite;
  }
};

export default observer(WishLogo);

const useStylesheet = ({ mode }: Props) => {
  const textColor = useTextColor(mode);
  return useMemo(
    () =>
      StyleSheet.create({
        logo: {
          width: 70,
          minHeight: 23,
          marginRight: 10,
          flexShrink: 0,
        },
        textContainer: {
          verticalAlign: "text-bottom",
          color: textColor,
          fontSize: 13,
          lineHeight: "10px",
          textTransform: "uppercase",
          userSelect: "none",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          letterSpacing: "0.1em",
          [`@media ${IS_NOT_VERY_LARGE_SCREEN}`]: {
            display: "none",
          },
          [`@media ${IS_VERY_LARGE_SCREEN}`]: {
            maxWidth: 200,
          },
        },
      }),
    [textColor],
  );
};
