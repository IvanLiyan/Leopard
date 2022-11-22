import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import posed, { PoseGroup } from "react-pose";

import Illustration from "@core/components/Illustration";
import { Text, Layout, PrimaryButton } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useDeviceStore } from "@core/stores/DeviceStore";
import { useTheme } from "@core/stores/ThemeStore";
import { css } from "@core/toolkit/styling";

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

type Props = BaseProps & {
  readonly onClickQuestionnaireButton: () => unknown;
};

const InviteOnlySection = (props: Props) => {
  const { style, className, onClickQuestionnaireButton } = props;
  const styles = useStylesheet();
  const deviceStore = useDeviceStore();

  return (
    <section className={css(styles.root, className, style)}>
      <div className={css(styles.topSection)}>
        <PoseGroup animateOnMount>
          {!deviceStore.isSmallScreen && (
            <LeftIllustration
              key="left-illustration"
              className={css(styles.illustrationLeft)}
            >
              <Illustration
                name="landingHeaderIllustrationLeft"
                alt={i`Merchant illustration`}
                animate={false}
              />
            </LeftIllustration>
          )}
          <ContentIllustration key="content">
            <div className={css(styles.topCenterSection)}>
              <Text style={styles.mainPitchText} weight="bold">
                Wish Invites Business Merchants to Join Our Online Marketplace
              </Text>
              <Layout.FlexColumn
                alignItems="center"
                style={styles.subtitleContainer}
              >
                <Text weight="semibold" style={styles.subtitle}>
                  Tell us about yourself in our questionnaire. Then, we&#39;ll{" "}
                </Text>
                <Text weight="semibold" style={styles.subtitle}>
                  reach out to you about joining Wish for Merchants.
                </Text>
              </Layout.FlexColumn>
              <PrimaryButton
                style={styles.cta}
                onClick={() => {
                  onClickQuestionnaireButton();
                }}
              >
                Complete the Questionnaire
              </PrimaryButton>
            </div>
          </ContentIllustration>
          {!deviceStore.isSmallScreen && (
            <RightIllustration
              className={css(styles.illustrationRight)}
              key="right-illustration"
            >
              <Illustration
                name="landingHeaderIllustrationRight"
                alt={i`Merchant illustration`}
                animate={false}
              />
            </RightIllustration>
          )}
        </PoseGroup>
      </div>
      {deviceStore.isSmallScreen && (
        <Layout.FlexRow justifyContent="center">
          <Illustration
            name="landingHeaderIllustrationSmaller"
            alt={i`Merchant illustration`}
            animate={false}
            style={styles.smallIllustration}
          />
        </Layout.FlexRow>
      )}
    </section>
  );
};

export default observer(InviteOnlySection);

const useStylesheet = () => {
  const { isIE } = useDeviceStore();
  const { surface, textDark, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          backgroundColor: surface,
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
          color: textBlack,
          "@media (max-width: 900px)": {
            fontSize: 28,
            marginTop: 30,
          },
          "@media (min-width: 900px)": {
            fontSize: 34,
            minWidth: !isIE ? 550 : undefined,
            width: isIE ? 550 : undefined,
            marginTop: 45,
          },
          alignSelf: "stretch",
          lineHeight: 1.2,
          textAlign: "center",
          paddingLeft: 20,
          paddingRight: 20,
        },
        subtitleContainer: {
          marginTop: 25,
          "@media (max-width: 900px)": {
            padding: "0px 20px",
          },
          "@media (min-width: 900px)": {
            maxWidth: !isIE ? 650 : undefined,
            width: isIE ? 550 : undefined,
          },
        },
        subtitle: {
          "@media (max-width: 900px)": {
            fontSize: 16,
          },
          "@media (min-width: 900px)": {
            fontSize: 18,
          },
          lineHeight: 1.4,
          color: textDark,
        },
        cta: {
          alignSelf: "center",
          marginTop: 90,
          marginBottom: 100,
          "@media (max-width: 900px)": {
            fontSize: 13,
            height: 40,
            width: 250,
          },
          "@media (min-width: 900px)": {
            fontSize: 16,
            height: 40,
            width: 300,
          },
        },
        illustrationLeft: {
          alignSelf: "flex-end",
          marginRight: -200,
          marginBottom: -10,
          "@media (min-width: 900px)": {
            minWidth: !isIE ? "36%" : undefined,
            width: isIE ? "36%" : undefined,
          },
        },
        illustrationRight: {
          alignSelf: "flex-end",
          marginLeft: -200,
          marginBottom: -120,
          zIndex: 99,
          "@media (min-width: 900px)": {
            minWidth: !isIE ? "36%" : undefined,
            width: isIE ? "36%" : undefined,
          },
        },
        smallIllustration: {
          height: 275,
          zIndex: 99,
        },
      }),
    [isIE, surface, textDark, textBlack],
  );
};
