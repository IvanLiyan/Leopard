import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";
import { Layout, Text } from "@ContextLogic/lego";

import { Illustration } from "@merchant/component/core";
import { css } from "@toolkit/styling";

import { useUserStore } from "@stores/UserStore";
import { useNavigationStore } from "@stores/NavigationStore";
import { useEnvironmentStore } from "@stores/EnvironmentStore";
import { useTheme } from "@stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IllustrationName } from "@merchant/component/core";

export type WishForMerchantsMode = "default" | "ink" | "white";
type WishForMerchantsProps = BaseProps & {
  readonly text?: string;
  readonly mode?: WishForMerchantsMode;
};

const WishForMerchants = (props: WishForMerchantsProps) => {
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
        style={{ lineHeight: 1.1 }}
      >
        {headerText}
      </Text>
    </Layout.FlexRow>
  );
};

const useHeaderText = ({ text }: WishForMerchantsProps): string => {
  const { isNavyBlueNav } = useNavigationStore();
  const { isDisabledMerchant } = useUserStore();
  const { env } = useEnvironmentStore();
  if (text) {
    return text;
  }

  if (isDisabledMerchant) {
    return i`Disabled`;
  }

  switch (env) {
    case "fe_qa_staging":
      // No translation here as the text won't be shown to
      // external users.
      // eslint-disable-next-line local-rules/unwrapped-i18n
      return "Staging";
    case "sandbox":
      // No translation here as the text won't be shown to
      // external users.
      // eslint-disable-next-line local-rules/unwrapped-i18n
      return "Sandbox";
    case "stage":
      // No translation here as the text won't be shown to
      // external users.
      // eslint-disable-next-line local-rules/unwrapped-i18n
      return "dev";
    default:
      return isNavyBlueNav
        ? ci18n(
            "placed beside a 'Wish' logo to display 'Wish Merchants'",
            "Merchants",
          )
        : ci18n(
            "placed beside a 'Wish' logo to display 'Wish For Merchants'",
            "For Merchants",
          );
  }
};

const getIllustration = (mode?: WishForMerchantsMode): IllustrationName => {
  switch (mode) {
    case "ink":
      return "wishLogoInk";
    case "white":
      return "wishLogoWhite";
    default:
      return "wishLogoBlue";
  }
};

const useTextColor = (mode?: WishForMerchantsMode): string => {
  const { textBlack, textWhite, primary } = useTheme();
  switch (mode) {
    case "ink":
      return textBlack;
    case "white":
      return textWhite;
    default:
      return primary;
  }
};

export default observer(WishForMerchants);

const useStylesheet = ({ mode }: WishForMerchantsProps) => {
  const { isNavyBlueNav } = useNavigationStore();
  const textColor = useTextColor(mode);
  return useMemo(
    () =>
      StyleSheet.create({
        logo: {
          width: isNavyBlueNav ? 75 : 85,
          marginRight: 7,
          flexShrink: 0,
        },
        textContainer: {
          color: textColor,
          fontSize: isNavyBlueNav ? 15 : 22,
          textTransform: isNavyBlueNav ? "uppercase" : "none",
          lineHeight: 1,
          userSelect: "none",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        },
      }),
    [isNavyBlueNav, textColor],
  );
};
