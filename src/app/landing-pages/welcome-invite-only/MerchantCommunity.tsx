import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import Illustration from "@core/components/Illustration";
import { Layout, Text } from "@ContextLogic/lego";

/* Merchant Stores */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useDeviceStore } from "@core/stores/DeviceStore";
import { useTheme } from "@core/stores/ThemeStore";

type MerchantCommunityProps = BaseProps & {
  readonly insetX: number;
};

const MerchantCommunity = (props: MerchantCommunityProps) => {
  const { style, className } = props;
  const deviceStore = useDeviceStore();
  const styles = useStylesheet(props);

  return (
    <Layout.FlexColumn
      style={[
        deviceStore.isSmallScreen ? styles.rootSmallScreen : styles.root,
        className,
        style,
      ]}
      alignItems="center"
    >
      <Layout.FlexColumn style={styles.textContainer}>
        <Text style={styles.title} weight="bold">
          Building a Trusted Merchant Community
        </Text>
        <Text style={styles.description}>
          Wish is now an invite-only platform where top-tier merchants can sell
          their products to millions of customers around the world.
        </Text>
      </Layout.FlexColumn>
      <Illustration
        style={styles.illustration}
        name="shippingPriceDrop"
        animate={false}
        alt={i`Global reach`}
      />
    </Layout.FlexColumn>
  );
};

export default observer(MerchantCommunity);

const useStylesheet = (props: MerchantCommunityProps) => {
  const { textBlack, textDark, textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          position: "relative",
          backgroundColor: textWhite,
          padding: `35px ${props.insetX}px`,
        },
        rootSmallScreen: {
          backgroundColor: textWhite,
          padding: `20px ${props.insetX}px`,
        },
        illustration: {
          height: 125,
          marginTop: 50,
          marginBottom: 50,
        },
        textContainer: {
          width: "80%",
        },
        title: {
          marginTop: 50,
          fontSize: 24,
          lineHeight: 1.2,
          color: textBlack,
          marginBottom: 15,
          textAlign: "center",
        },
        description: {
          fontSize: 16,
          lineHeight: 1.4,
          color: textDark,
          textAlign: "center",
        },
      }),
    [props.insetX, textWhite, textBlack, textDark],
  );
};
