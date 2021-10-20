import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Banner, Button, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { useTheme } from "@stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ValidateStoreBannerProps = BaseProps;

const ValidateStoreBanner = ({
  className,
  style,
}: ValidateStoreBannerProps) => {
  const styles = useStylesheet();

  return (
    <Banner
      className={css(className, style)}
      sentiment="warning"
      text={
        <div className={css(styles.bannerTextContainer)}>
          <Text weight="bold" className={css(styles.bannerText)}>
            Validate your store to gain access to Tax Settings
          </Text>
          <div className={css(styles.bannerText)}>
            We need a few more details from you to validate your store's
            ownership and help your business correctly set up and report taxes.
          </div>
          <Button href="/seller-profile-verification" style={{ marginTop: 12 }}>
            Validate my store
          </Button>
        </div>
      }
      showTopBorder
      contentAlignment="left"
    />
  );
};

export default observer(ValidateStoreBanner);

const useStylesheet = () => {
  const { textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        bannerTextContainer: {
          display: "flex",
          textAlign: "left",
          flexDirection: "column",
          alignItems: "flex-start",
        },
        bannerText: {
          marginBottom: 4,
          color: textBlack,
        },
      }),
    [textBlack],
  );
};
