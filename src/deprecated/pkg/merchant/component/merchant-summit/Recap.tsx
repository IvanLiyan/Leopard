import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, H2, Text } from "@ContextLogic/lego";
import { IllustrationName } from "@merchant/component/core/Illustration";
import Illustration from "@merchant/component/core/Illustration";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";

type RecapProps = BaseProps;

const CONTENT: ReadonlyArray<{ icon: IllustrationName; text: string }> = [
  {
    icon: "iconEnhancedPlatform",
    text:
      i`We’re building an enhanced platform experience, including shoppable ` +
      i`videos and a revamped homepage.`,
  },
  {
    icon: "iconWishStandards",
    text:
      i`Introducing Wish Standards, a new program that helps high-quality ` +
      i`merchants succeed.`,
  },
  {
    icon: "iconGlobalSupport",
    text:
      i`Wish is committed to supporting merchants through challenging global ` +
      i`policy shifts, such as the EU’s VAT policy changes.`,
  },
  {
    icon: "iconWishFulfillment",
    text:
      i`Fulfillment By Wish helps merchants navigate logistical complexities ` +
      i`with straightforward shipping and fulfillment services.`,
  },
];

const Recap = (props: RecapProps) => {
  const styles = useStylesheet();
  const { isSmallScreen } = useDeviceStore();

  const content = CONTENT.map(({ icon, text }) => (
    <Layout.FlexColumn
      key={icon}
      style={styles.section}
      alignItems={isSmallScreen ? "center" : "flex-start"}
    >
      <Illustration style={styles.icon} name={icon} alt={i`Icon`} />
      <Text style={styles.text}>{text}</Text>
    </Layout.FlexColumn>
  ));

  return (
    <Layout.FlexColumn
      style={isSmallScreen ? styles.rootMobile : styles.root}
      justifyContent="center"
      alignItems="center"
    >
      <H2 style={isSmallScreen ? styles.titleMobile : styles.titleWeb}>
        Recap of Wish’s Plans
      </H2>
      {isSmallScreen ? (
        <Layout.FlexColumn style={styles.sectionContainer}>
          {content}
        </Layout.FlexColumn>
      ) : (
        <Layout.FlexRow
          style={styles.sectionContainer}
          justifyContent="center"
          alignItems="flex-start"
        >
          {content}
        </Layout.FlexRow>
      )}
    </Layout.FlexColumn>
  );
};

export default observer(Recap);

const useStylesheet = () => {
  const { surfaceLightest } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "80px 120px",
          backgroundColor: surfaceLightest,
        },
        rootMobile: {
          padding: "80px 0px",
          backgroundColor: surfaceLightest,
        },
        titleMobile: {
          fontSize: 28,
          margin: "0px 16px 20px",
          textAlign: "center",
        },
        titleWeb: {
          fontSize: 40,
          marginBottom: 60,
          textAlign: "center",
        },
        sectionContainer: {
          width: "100%",
        },
        section: {
          padding: 16,
        },
        icon: {
          width: 80,
          height: 80,
        },
        text: {
          lineHeight: "150%",
          marginTop: 24,
          height: "100%",
          maxWidth: 500,
        },
      }),
    [surfaceLightest]
  );
};
