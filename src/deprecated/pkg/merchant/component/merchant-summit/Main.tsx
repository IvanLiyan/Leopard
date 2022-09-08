import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, H1, H4, Text } from "@ContextLogic/lego";

/* Merchant Stores */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Assets */
import summitBannerMobileURL from "@assets/img/merchant-summit/landing/mobile/summit-banner-mobile.png";
import summitBannerWebURL from "@assets/img/merchant-summit/landing/web/summit-banner-web.png";

type MainProps = BaseProps;

const Main = (props: MainProps) => {
  const styles = useStylesheet();
  const { isSmallScreen } = useDeviceStore();

  return (
    <Layout.FlexColumn
      style={[
        isSmallScreen ? styles.mobileBanner : styles.webBanner,
        styles.root,
      ]}
    >
      <Layout.FlexColumn
        style={
          isSmallScreen ? styles.textContainerMobile : styles.textContainerWeb
        }
        justifyContent="center"
        alignItems={isSmallScreen ? "center" : "flex-start"}
      >
        <H1
          style={[
            isSmallScreen ? styles.titleMobile : styles.titleWeb,
            styles.text,
          ]}
        >
          Wish Merchant Summit 2021
        </H1>
        <H4 style={styles.text}>November 09, 2021</H4>
        <Text style={styles.text}>
          Welcome to Wish’s 2021 Merchant Summit. Browse the agenda and
          speakers, and get the latest updates and videos about Wish’s plans for
          merchant success in 2022.
        </Text>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

export default observer(Main);

const useStylesheet = () => {
  const { textWhite } = useTheme();

  const header = document.getElementById("header");
  const offsetHeight = header ? header.offsetHeight : 60;

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          height: "90vh",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          paddingTop: offsetHeight,
        },
        mobileBanner: {
          background: `url(${summitBannerMobileURL})`,
          backgroundPosition: "center bottom",
        },
        webBanner: {
          background: `url(${summitBannerWebURL})`,
          backgroundPosition: "right bottom",
        },
        textContainerMobile: {
          margin: "80px 16px",
        },
        textContainerWeb: {
          marginLeft: 120,
          height: "100%",
        },
        titleMobile: {
          fontSize: 34,
        },
        titleWeb: {
          fontSize: 60,
        },
        text: {
          color: textWhite,
          lineHeight: "120%",
          marginBottom: 9,
          width: "100%",
          maxWidth: 532,
        },
      }),
    [offsetHeight, textWhite]
  );
};
