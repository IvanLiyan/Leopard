import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import posed, { PoseGroup } from "react-pose";

/* Lego Components */
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Relative Imports */
import SplashQuote from "./SplashQuote";
import SignupButton from "./SignupButton";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

type MainSectionProps = BaseProps;

const MainSection = (props: MainSectionProps) => {
  const { style, className } = props;
  const styles = useStylesheet(props);
  const { dimenStore } = AppStore.instance();

  return (
    <section className={css(styles.root, className, style)}>
      <div className={css(styles.topSection)}>
        <PoseGroup animateOnMount>
          {!dimenStore.isSmallScreen && (
            <LeftIllustration
              key="left-illustration"
              className={css(styles.illustrationLeft)}
            >
              <Illustration
                name="landingIllustrationLeft"
                alt={i`Merchant illustration`}
                animate={false}
              />
            </LeftIllustration>
          )}
          <ContentIllustration key="content">
            <div className={css(styles.topCenterSection)}>
              <div className={css(styles.mainPitchText)}>
                Join the world’s leading mobile commerce platform
              </div>
              <div className={css(styles.mainPitchSubtext)}>
                Reach hundreds of millions of consumers across the world by
                selling on Wish
              </div>
              <SignupButton
                className={css(styles.cta)}
                style={{ fontSize: 22, padding: "10px 80px" }}
              />
            </div>
          </ContentIllustration>
          {!dimenStore.isSmallScreen && (
            <RightIllustration
              className={css(styles.illustrationRight)}
              key="right-illustration"
            >
              <Illustration
                name="landingIllustrationRight"
                alt={i`Merchant illustration`}
                animate={false}
              />
            </RightIllustration>
          )}
        </PoseGroup>
      </div>
      {dimenStore.isSmallScreen && (
        <Illustration
          name="merchantLandingSmaller"
          alt={i`Merchant illustration`}
          animate={false}
          className={css(styles.smaller)}
        />
      )}
      <div className={css(styles.qouteContainer)}>
        <SplashQuote
          text={
            i`"After joining Wish, the number of orders ` +
            i`per month continues to rise. Now our European Delivery ` +
            i`Center is one of the top 10 sellers in Europe."`
          }
          name={`-Koen de Vries, EDC Internet BV, Netherlands`}
          className={css(styles.qoute)}
        />
      </div>
    </section>
  );
};

export default observer(MainSection);

const LeftIllustration = posed.div({
  enter: { opacity: 1, y: 0, delay: 50, transition: { duration: 300 } },
  exit: { opacity: 0, y: 10 },
});

const ContentIllustration = posed.div({
  enter: { opacity: 1, y: 0, delay: 100, transition: { duration: 300 } },
  exit: { opacity: 0, y: 10 },
});

const RightIllustration = posed.div({
  enter: { opacity: 1, y: 0, delay: 150, transition: { duration: 300 } },
  exit: { opacity: 0, y: 10 },
});

const useStylesheet = (props: MainSectionProps) => {
  const { isIE } = AppStore.instance();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
        },
        topSection: {
          display: "flex",
          flexDirection: "row",
        },
        topCenterSection: {
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: `110px 0px 0px 0px`,
        },
        mainPitchText: {
          "@media (max-width: 900px)": {
            fontSize: 30,
            marginTop: 40,
          },
          "@media (min-width: 900px)": {
            fontSize: 40,
            minWidth: !isIE ? 650 : undefined,
            width: isIE ? 650 : undefined,
          },
          alignSelf: "stretch",
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.2,
          color: palettes.textColors.Ink,
          textAlign: "center",
        },
        mainPitchSubtext: {
          "@media (max-width: 900px)": {
            fontSize: 22,
            padding: "0px 20px",
          },
          "@media (min-width: 900px)": {
            fontSize: 22,
            minWidth: !isIE ? 650 : undefined,
            width: isIE ? 650 : undefined,
          },
          fontWeight: fonts.weightNormal,
          lineHeight: 1.4,
          color: palettes.textColors.DarkInk,
          marginTop: 20,
          textAlign: "center",
        },
        cta: {
          alignSelf: "center",
          marginTop: 50,
          marginBottom: 150,
        },
        qouteContainer: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: isIE ? 650 : undefined,
          alignSelf: "center",
        },
        qoute: {
          "@media (min-width: 900px)": {
            maxWidth: !isIE ? 650 : undefined,
            width: isIE ? 650 : undefined,
          },
        },
        illustrationLeft: {
          alignSelf: "flex-end",
          marginRight: -200,
          "@media (min-width: 900px)": {
            minWidth: !isIE ? "36%" : undefined,
            width: isIE ? "36%" : undefined,
          },
        },
        illustrationRight: {
          alignSelf: "flex-end",
          marginLeft: -200,
          marginBottom: -90,
          "@media (min-width: 900px)": {
            minWidth: !isIE ? "36%" : undefined,
            width: isIE ? "36%" : undefined,
          },
        },
        smaller: {
          maxHeight: 350,
        },
      }),
    [isIE]
  );
};
