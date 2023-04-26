import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { Markdown, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Banner from "../Banner";
import { css } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";
import { merchFeURL } from "@core/toolkit/router";

type OnboardingReviewBannerProps = BaseProps;

const OnboardingReviewBanner: React.FC<OnboardingReviewBannerProps> = ({
  className,
  style,
}) => {
  const styles = useStyleSheet();
  const appStoreURL = "https://wish-partner.com";
  const policyURL = merchFeURL("/policy/home");
  return (
    <Banner
      className={className}
      style={style}
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
            i` [Wish Partner Network](${appStoreURL})` +
            i` to explore trusted, Wish-approved public apps` +
            i` that help you with a variety of store operations.`
          }
          className={css(styles.bannerText)}
        />
      )}
      bannerImg="bannerOnboardingReview"
    />
  );
};

export default OnboardingReviewBanner;

const useStyleSheet = () => {
  const { textDark } = useTheme();
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
          color: textDark,
        },
      }),
    [textDark],
  );
};
