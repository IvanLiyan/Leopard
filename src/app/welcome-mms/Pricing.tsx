/*
 * Pricing.tsx
 *
 * Created by Jonah Dlin on Wed Aug 24 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Layout, H2, Text } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Illustration from "@deprecated/pkg/merchant/component/core/Illustration";
import { IS_SMALL_SCREEN } from "@core/toolkit/styling";
import { ci18n } from "@core/toolkit/i18n";

type Props = BaseProps;

const Pricing: React.FC<Props> = ({ className, style }) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexRow style={[className, style]} alignItems="center">
      <Layout.FlexColumn alignItems="flex-start">
        <H2 style={styles.header}>
          {ci18n(
            "title of section on how we price the Managed Merchant Services",
            "Pricing",
          )}
        </H2>
        <Text style={styles.text}>
          As a special, limited-time, introductory offer, Managed Merchant
          Services are currently FREE for eligible merchants!*
        </Text>
        <Text style={styles.disclaimer}>
          *Standard logistics, fulfillment, and shipping fees apply. Your
          Account Manager will follow up with you about the duration of this
          free trial period, as well as costs for future premium services.
        </Text>
      </Layout.FlexColumn>
      <Illustration
        style={styles.image}
        name="mmsWelcomeTicketsCoins"
        alt={i`Information about pricing`}
      />
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        image: {
          minWidth: 253,
          marginLeft: 32,
          [`@media ${IS_SMALL_SCREEN}`]: {
            display: "none",
          },
        },
        header: {
          marginBottom: 34,
        },
        text: {
          color: textDark,
          fontSize: 24,
          lineHeight: "28px",
          marginBottom: 34,
        },
        disclaimer: {
          color: textDark,
          fontSize: 16,
          lineHeight: "24px",
        },
      }),
    [textDark],
  );
};

export default observer(Pricing);
