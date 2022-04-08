import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text, Button } from "@ContextLogic/lego";
import Illustration from "@merchant/component/core/Illustration";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useDeviceStore } from "@stores/DeviceStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FooterSectionProps = BaseProps;

const FooterSection: React.FC<FooterSectionProps> = (
  props: FooterSectionProps
) => {
  const { isSmallScreen } = useDeviceStore();
  const styles = useStylesheet();
  const { style, className } = props;

  const FooterBox = isSmallScreen ? Layout.FlexColumn : Layout.FlexRow;
  const appImage = (
    <Illustration
      name="wishAppImage"
      alt={i`Wish App`}
      style={styles.footerImage}
    />
  );

  return (
    <FooterBox
      style={[styles.root, className, style]}
      justifyContent="center"
      alignItems="center"
    >
      {!isSmallScreen && appImage}
      <Layout.FlexColumn
        style={styles.text}
        alignItems={isSmallScreen ? "center" : "flex-start"}
      >
        <Text style={styles.title} weight="semibold">
          Not a Wish merchant yet?
        </Text>
        <Text style={styles.subtitle}>
          Sign up for free and showcase your products to up to 90 million
          monthly active users.
        </Text>
        <Button style={styles.joinButton} href="/signup" openInNewTab>
          Join now
        </Button>
      </Layout.FlexColumn>
      {isSmallScreen && appImage}
    </FooterBox>
  );
};

const useStylesheet = () => {
  const { textWhite, secondaryDarkest } = useTheme();
  const { isSmallScreen } = useDeviceStore();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          borderTopLeftRadius: isSmallScreen ? 40 : 140,
          backgroundColor: secondaryDarkest,
          padding: isSmallScreen ? "48px 16px 0 16px" : "24px 0 0 0",
        },
        text: {
          maxWidth: 380,
          color: textWhite,
          marginLeft: isSmallScreen ? undefined : 32,
          textAlign: isSmallScreen ? "center" : "left",
        },
        title: {
          fontSize: 20,
        },
        subtitle: {
          fontSize: 16,
          marginTop: 6,
        },
        joinButton: {
          marginTop: isSmallScreen ? 16 : 24,
          alignSelf: isSmallScreen ? "center" : "flex-start",
        },
        footerImage: {
          position: "relative",
          left: isSmallScreen ? "max(-4.5%, -18px)" : undefined,
          width: isSmallScreen ? "50%" : undefined,
          marginTop: isSmallScreen ? 40 : undefined,
          maxWidth: 190,
        },
      }),
    [textWhite, secondaryDarkest, isSmallScreen]
  );
};

export default observer(FooterSection);
