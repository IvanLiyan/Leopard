/*
 * HeroBanner.tsx
 *
 * Created by Jonah Dlin on Tue Aug 23 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Layout, Markdown, PrimaryButton, Text } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Illustration from "@deprecated/pkg/merchant/component/core/Illustration";
import { ci18n } from "@core/toolkit/i18n";

type Props = BaseProps & {
  readonly onOpenQuestionnaire: () => unknown;
};

const HeroBanner: React.FC<Props> = ({
  className,
  style,
  onOpenQuestionnaire,
}) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexRow
      style={[styles.root, className, style]}
      alignItems="flex-end"
      justifyContent="space-between"
    >
      <Layout.FlexColumn style={styles.content}>
        <Markdown
          style={styles.header}
          text={i`Start Your Free Trial\* of **Managed Merchant Services**`}
        />
        <Text style={styles.description}>
          Harness a new suite of operational services to build a global brand,
          sell quality products, and create a trusted shopping experience
        </Text>
        <PrimaryButton
          onClick={() => {
            onOpenQuestionnaire();
          }}
          style={styles.button}
        >
          {ci18n(
            "Text on a button merchants click to get started with wish merchant services",
            "Get Started",
          )}
        </PrimaryButton>
      </Layout.FlexColumn>
      <Layout.FlexRow style={styles.leftIllustrations} alignItems="flex-end">
        <Illustration
          style={styles.treeIllusration}
          name="mmsWelcomeTree"
          alt={i`Image of tree`}
        />
        <Illustration
          style={styles.truckIllustration}
          name="mmsWelcomeTruck"
          alt={i`Image of truck`}
        />
      </Layout.FlexRow>
      <Illustration
        style={styles.desktopIllustration}
        name="mmsWelcomeDesktop"
        alt={i`Desktop with merchant services`}
      />
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  const { secondaryLighter, textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: secondaryLighter,
          position: "relative",
          height: 738,
          "@media (max-width: 1149px)": {
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            height: "unset",
          },
          overflow: "hidden",
        },
        content: {
          position: "absolute",
          top: 152,
          left: 135,
          zIndex: 1,
          maxWidth: "calc(100% - 735px)",
          // Page scaling is handled explicitly
          // eslint-disable-next-line local-rules/no-frozen-width
          width: 787,
          "@media (max-width: 1454px)": {
            top: 100,
            left: 31,
            maxWidth: "calc(100% - 631px)",
          },
          "@media (max-width: 1149px)": {
            position: "static",
            maxWidth: "unset",
            width: "unset",
            margin: "100px 31px 80px",
          },
        },
        header: {
          fontSize: 60,
          lineHeight: "72px",
          color: textBlack,
          marginBottom: 27,
        },
        description: {
          fontSize: 24,
          lineHeight: "28px",
          color: textDark,
          marginBottom: 27,
        },
        button: {
          fontSize: 20,
          lineHeight: "24px",
          width: "fit-content",
        },
        leftIllustrations: {
          marginLeft: 31,
          marginRight: 31,
        },
        treeIllusration: {
          // Page scaling is handled explicitly
          // eslint-disable-next-line local-rules/no-frozen-width
          width: 163,
          marginRight: 142,
          "@media (max-width: 1454px)": {
            display: "none",
          },
        },
        truckIllustration: {
          // Page scaling is handled explicitly
          // eslint-disable-next-line local-rules/no-frozen-width
          width: 243,
        },
        desktopIllustration: {
          // Page scaling is handled explicitly
          // eslint-disable-next-line local-rules/no-frozen-width
          width: 833,
          "@media (max-width: 1149px)": {
            display: "none",
          },
        },
      }),
    [secondaryLighter, textBlack, textDark],
  );
};

export default observer(HeroBanner);
