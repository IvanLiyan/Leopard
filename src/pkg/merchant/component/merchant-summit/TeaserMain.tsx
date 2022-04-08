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
import teaserHeaderMobileURL from "@assets/img/merchant-summit/teaser/mobile/teaser-header-mobile.png";
import teaserHeaderURL from "@assets/img/merchant-summit/teaser/web/teaser-header.png";

type TeaserMainProps = BaseProps;

const TeaserMain = (props: TeaserMainProps) => {
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
          Global Annual Merchant Summit
        </H1>
        <H4 style={styles.text}>November 09, 2021</H4>
        <Text style={styles.text}>
          Get the latest updates and watch videos about Wish’s plans for
          merchant success
        </Text>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

export default observer(TeaserMain);

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
          background: `url(${teaserHeaderMobileURL})`,
        },
        webBanner: {
          background: `url(${teaserHeaderURL})`,
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
