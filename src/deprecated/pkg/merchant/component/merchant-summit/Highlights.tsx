import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, H2, H4, Text } from "@ContextLogic/lego";
import { IllustrationName } from "@merchant/component/core/Illustration";
import Illustration from "@merchant/component/core/Illustration";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";

type HighlightsProps = BaseProps;

const CONTENT: ReadonlyArray<{ icon: IllustrationName; text: string }> = [
  {
    icon: "iconWishCommunityPillars",
    text: i`New community pillars: trust, quality, merchant-focused expansion`,
  },
  {
    icon: "iconMerchantGrowthInitiatives",
    text: i`Merchant growth initiatives and tools`,
  },
  {
    icon: "iconWishInsights",
    text: i`High-level data and insights into Wish performance in 2021`,
  },
];

const Highlights = (props: HighlightsProps) => {
  const styles = useStylesheet();
  const { isSmallScreen } = useDeviceStore();

  const content = CONTENT.map(({ icon, text }) => (
    <Layout.FlexColumn
      key={icon}
      style={styles.section}
      alignItems={isSmallScreen ? "center" : "flex-start"}
    >
      <Illustration style={styles.icon} name={icon} alt={i`Icon`} />
      <Text style={[styles.text, styles.textWhite]}>{text}</Text>
    </Layout.FlexColumn>
  ));

  return (
    <Layout.FlexColumn
      style={isSmallScreen ? styles.rootMobile : styles.root}
      justifyContent="center"
      alignItems="center"
    >
      <H2
        style={[
          isSmallScreen ? styles.titleMobile : styles.titleWeb,
          styles.textWhite,
        ]}
      >
        Summit highlights
      </H2>
      <H4
        style={[
          isSmallScreen ? styles.subtitleMobile : styles.subtitleWeb,
          styles.textWhite,
        ]}
      >
        Topics at this year’s Wish Merchant Summit include:
      </H4>
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

export default observer(Highlights);

const useStylesheet = () => {
  const { primary, textWhite } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "80px 120px",
          backgroundColor: primary,
        },
        rootMobile: {
          padding: "80px 0px",
          backgroundColor: primary,
        },
        titleMobile: {
          fontSize: 28,
          margin: "0px 16px 10px",
          textAlign: "center",
        },
        titleWeb: {
          fontSize: 40,
          marginBottom: 10,
        },
        subtitleMobile: {
          margin: "0px 16px 22px",
          fontSize: 16,
          textAlign: "center",
        },
        subtitleWeb: {
          fontSize: 24,
          marginBottom: 60,
        },
        textWhite: { color: textWhite },
        sectionContainer: {
          width: "100%",
        },
        section: {
          padding: 16,
          minWidth: 276,
        },
        icon: {
          width: 80,
          height: 80,
        },
        text: {
          lineHeight: "150%",
          marginTop: 24,
          height: "100%",
          maxWidth: 276,
        },
      }),
    [primary, textWhite]
  );
};
