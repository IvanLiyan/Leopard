import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";
import Illustration from "@merchant/component/core/Illustration";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useDeviceStore } from "@stores/DeviceStore";

/* Merchant Components */
import FeatureCard from "@merchant/component/wss/FeatureCard";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FeatureCardProps = BaseProps;

const HeaderSection: React.FC<FeatureCardProps> = (props: FeatureCardProps) => {
  const { isSmallScreen } = useDeviceStore();
  const styles = useStylesheet();
  const { style, className } = props;

  const FeatureCardsBox = isSmallScreen ? Layout.FlexColumn : Layout.FlexRow;

  return (
    <Layout.FlexColumn style={[className, style]}>
      <Layout.FlexRow
        style={styles.top}
        alignItems="stretch"
        justifyContent="flex-end"
      >
        <Layout.FlexColumn style={styles.topText}>
          <Text style={styles.topTitle} weight="bold">
            Level up with Wish Standards
          </Text>
          <Text style={styles.topSubtitle}>
            Wish Standards is a new program that rewards you for providing great
            customer experiences
          </Text>
        </Layout.FlexColumn>
        {!isSmallScreen && (
          <Layout.FlexColumn
            style={styles.imageContainer}
            alignItems="flex-end"
            justifyContent="center"
          >
            <Illustration name="wssSplashRibbon" alt="" />
          </Layout.FlexColumn>
        )}
      </Layout.FlexRow>
      {isSmallScreen && (
        <Layout.FlexRow
          style={styles.mobileRibbonContainer}
          justifyContent="flex-end"
        >
          <Illustration
            name="wssSplashRibbonMobile"
            alt=""
            style={styles.mobileRibbon}
          />
        </Layout.FlexRow>
      )}
      <div className={css(styles.featureCardsContainer)}>
        <FeatureCardsBox style={styles.featureCards} justifyContent="center">
          <FeatureCard
            style={styles.featureCard}
            cardImg="eyeOn"
            title={i`Increase visibility`}
            subtitle={
              i`Wish may boost your products’ rankings as customers search ` +
              i`and browse throughout the app`
            }
          />
          <FeatureCard
            style={styles.featureCard}
            cardImg="ticket"
            title={i`Get commission discounts`}
            subtitle={i`Increase your earning potential by achieving commission discounts`}
          />
          <FeatureCard
            style={styles.featureCard}
            cardImg="shieldCheck"
            title={i`Stand out to customers`}
            subtitle={
              i`Your listings and profile will include a badge ` +
              i`that makes you stand out to customers`
            }
          />
        </FeatureCardsBox>
      </div>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const {
    surfaceLightest,
    secondaryLighter,
    secondaryDarkest,
    surfaceDarker,
    textBlack,
    textDark,
  } = useTheme();
  const { isSmallScreen } = useDeviceStore();
  return useMemo(
    () =>
      StyleSheet.create({
        top: {
          backgroundColor: secondaryLighter,
          zIndex: 1,
        },
        topText: {
          maxWidth: isSmallScreen ? "100%" : "50%",
          margin: isSmallScreen ? "40px 16px 16px 16px" : "10%",
          flex: "1",
        },
        topDate: {
          fontSize: isSmallScreen ? 14 : 16,
          color: surfaceDarker,
        },
        topTitle: {
          fontSize: isSmallScreen ? 28 : 60,
          lineHeight: isSmallScreen ? "32px" : "72px",
          color: textBlack,
          marginTop: isSmallScreen ? 16 : 24,
        },
        topSubtitle: {
          fontSize: isSmallScreen ? 16 : 28,
          lineHeight: isSmallScreen ? "24px" : "32px",
          color: textDark,
          marginTop: isSmallScreen ? 16 : 24,
        },
        imageContainer: {
          padding: "96px 8% 0 6.5%",
          // Negative margin here is necessary to create border shape
          marginTop: -96,
          borderTopLeftRadius: 400,
          backgroundColor: surfaceLightest,
          zIndex: 2,
          maxWidth: 750,
        },
        featureCardsContainer: {
          background: `linear-gradient(${secondaryLighter} 50%, ${surfaceLightest} 50%)`,
        },
        featureCards: {
          backgroundColor: secondaryDarkest,
          borderRadius: isSmallScreen ? undefined : "140px 0",
          padding: isSmallScreen ? "20px 16px" : "0 16px",
          zIndex: 3,
        },
        featureCard: {
          margin: isSmallScreen ? "20px 0px" : "64px 15px",
          maxWidth: isSmallScreen ? undefined : 380,
          flexBasis: "33%",
        },
        mobileRibbonContainer: {
          backgroundColor: secondaryLighter,
          paddingRight: 16,
          paddingBottom: 34,
        },
        mobileRibbon: {
          height: "43%",
          width: "43%",
          maxWidth: 156,
        },
      }),
    [
      secondaryLighter,
      surfaceLightest,
      surfaceDarker,
      textBlack,
      textDark,
      secondaryDarkest,
      isSmallScreen,
    ]
  );
};

export default observer(HeaderSection);
