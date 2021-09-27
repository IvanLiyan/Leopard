/*
 * WpsShippedWarning.tsx
 *
 * Created by Jonah Dlin on Mon May 17 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Banner, Layout, Text } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { useTheme } from "@merchant/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type WpsShippedWarningProps = BaseProps & {
  readonly orderId: string;
};

const WpsShippedWarning: React.FC<WpsShippedWarningProps> = ({
  className,
  style,
  orderId,
}: WpsShippedWarningProps) => {
  const styles = useStylesheet();

  return (
    <Banner
      className={css(className, style)}
      sentiment="warning"
      text={
        <Layout.FlexColumn alignItems="flex-start">
          <Text className={css(styles.bannerText)} weight="semibold">
            This order is already marked as "shipped".
          </Text>
          <Text className={css(styles.bannerText)}>
            Before this order becomes confirmed shipped upon the first tracking
            scan, you can use a different shipping provider or edit your WPS
            shipping label details.
          </Text>
          <Button
            href={`/shipping-label/create/${orderId}`}
            style={{ marginTop: 16 }}
          >
            Edit shipping label
          </Button>
        </Layout.FlexColumn>
      }
      showTopBorder
      contentAlignment="left"
    />
  );
};

export default observer(WpsShippedWarning);

const useStylesheet = () => {
  const { textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        bannerText: {
          marginBottom: 4,
          color: textBlack,
        },
      }),
    [textBlack]
  );
};
