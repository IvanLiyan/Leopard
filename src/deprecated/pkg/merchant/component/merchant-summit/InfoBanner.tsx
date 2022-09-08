import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, H2, H4, Text } from "@ContextLogic/lego";
import Illustration from "@merchant/component/core/Illustration";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";

type InfoBannerProps = BaseProps;

const InfoBanner = (props: InfoBannerProps) => {
  const styles = useStylesheet();
  const { isSmallScreen } = useDeviceStore();

  const content = (
    <Illustration name="merchantConferenceChinaBanner" alt={i`Banner`} />
  );

  return (
    <Layout.FlexColumn
      style={isSmallScreen ? styles.rootMobile : styles.root}
      justifyContent="center"
      alignItems="center"
    >
      <H2 style={isSmallScreen ? styles.titleMobile : styles.titleWeb}>
        Wish Merchant Summit 2021
      </H2>
      <H4 style={isSmallScreen ? styles.subtitleMobile : styles.subtitleWeb}>
        Shenzhen, China
      </H4>
      <Text
        style={isSmallScreen ? styles.dateMobile : styles.dateWeb}
        weight="bold"
      >
        November 09, 2021
      </Text>
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

export default observer(InfoBanner);

const useStylesheet = () => {
  const { surfaceLighter } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "80px 120px",
          backgroundColor: surfaceLighter,
        },
        rootMobile: {
          padding: "80px 16px",
          backgroundColor: surfaceLighter,
        },
        titleMobile: {
          fontSize: 28,
          textAlign: "center",
        },
        titleWeb: {
          fontSize: 40,
          textAlign: "center",
        },
        subtitleMobile: {
          fontSize: 16,
          margin: 16,
        },
        subtitleWeb: {
          fontSize: 24,
          margin: 16,
        },
        dateMobile: {
          fontSize: 14,
          marginBottom: 22,
        },
        dateWeb: {
          fontSize: 14,
          marginBottom: 60,
        },
        sectionContainer: {
          width: "100%",
        },
        section: {
          padding: 16,
        },
      }),
    [surfaceLighter]
  );
};
