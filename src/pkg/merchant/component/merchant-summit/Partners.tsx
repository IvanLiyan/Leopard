import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, H2 } from "@ContextLogic/lego";
import { IllustrationName } from "@merchant/component/core/Illustration";
import Illustration from "@merchant/component/core/Illustration";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";

type PartnersProps = BaseProps;

const CONTENT: ReadonlyArray<IllustrationName> = [
  "logoSfinternational",
  "logoWiseexpress",
  "logoSunyou",
  "logoLianlianglobal",
  "logoUmf",
  "logoTopyou",
  "logoYwwenexpress",
  "logoYunexpress",
  "logoEquick",
];

const Partners = (props: PartnersProps) => {
  const styles = useStylesheet();
  const { isSmallScreen } = useDeviceStore();

  const content = CONTENT.map((logo: IllustrationName) => (
    <Illustration
      key={logo}
      style={isSmallScreen ? styles.logoMobile : styles.logo}
      name={logo}
      alt={i`Partner Logo`}
    />
  ));

  return (
    <Layout.FlexColumn
      style={isSmallScreen ? styles.rootMobile : styles.root}
      justifyContent="center"
      alignItems="center"
    >
      <H2 style={isSmallScreen ? styles.titleMobile : styles.titleWeb}>
        Summit Partners
      </H2>
      <Layout.FlexRow
        style={styles.sectionContainer}
        justifyContent="center"
        alignItems="flex-start"
      >
        {content}
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

export default observer(Partners);

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
          padding: "80px 16px",
          backgroundColor: surfaceLightest,
        },
        titleMobile: {
          fontSize: 28,
          textAlign: "center",
        },
        titleWeb: {
          fontSize: 40,
        },
        sectionContainer: {
          width: "100%",
          flexWrap: "wrap",
        },
        section: {
          padding: 16,
        },
        logoMobile: {
          ":not(:last-child)": {
            marginRight: 12,
          },
          marginTop: 22,
          height: 29,
          maxWidth: 100,
        },
        logo: {
          ":not(:last-child)": {
            marginRight: 32,
          },
          marginTop: 60,
          height: 80,
          maxWidth: 276,
        },
      }),
    [surfaceLightest]
  );
};
