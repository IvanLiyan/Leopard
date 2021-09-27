import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown, Text } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type OnboardingReviewHeaderProps = BaseProps;

const OnboardingReviewHeader = (props: OnboardingReviewHeaderProps) => {
  const styles = useStyleSheet();
  const appStoreURL = "/merchant_apps";
  const policyURL = "/policy/home";
  return (
    <WelcomeHeader
      title={() => (
        <Text className={css(styles.bannerTitle)} weight="bold">
          Congratulations! Your store application is submitted successfully.
        </Text>
      )}
      body={() => (
        <Markdown
          text={
            i`We are currently reviewing your application,` +
            i` and will get back to you in **3 business days** about our review status.` +
            i` While you are waiting, get familiar with` +
            i` [Wish Merchant Policies](${policyURL}) and visit the` +
            i` [Wish App Store](${appStoreURL})` +
            i` to explore trusted, Wish-approved public apps` +
            i` that help you with a variety of store operations.`
          }
          className={css(styles.bannerText)}
        />
      )}
      illustration="reviewHeader"
      maxIllustrationWidth={"40%"}
      paddingX={0}
      hideBorder
    />
  );
};

export default OnboardingReviewHeader;

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        bannerTitle: {
          width: "100%",
          paddingTop: 46,
          fontSize: 24,
          lineHeight: 1.33,
        },
        bannerText: {
          marginTop: 16,
          marginBottom: 46,
          fontSize: 16,
          color: palettes.textColors.DarkInk,
        },
      }),
    []
  );
};
