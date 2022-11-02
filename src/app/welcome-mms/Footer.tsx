/*
 * Footer.tsx
 *
 * Created by Jonah Dlin on Wed Aug 24 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Layout, H2, Text, SecondaryButton } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Illustration from "@deprecated/pkg/merchant/component/core/Illustration";
import { IS_SMALL_SCREEN } from "@core/toolkit/styling";
import { ci18n } from "@core/toolkit/i18n";

type Props = BaseProps & {
  readonly onOpenQuestionnaire: () => unknown;
};

const Footer: React.FC<Props> = ({ className, style, onOpenQuestionnaire }) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexRow style={[styles.root, className, style]} alignItems="center">
      <Layout.FlexRow
        style={styles.imageContainer}
        alignItems="center"
        justifyContent="center"
      >
        <Illustration
          style={styles.image}
          name="mmsWelcomePencil"
          alt={i`Fill out the questionnaire`}
        />
      </Layout.FlexRow>
      <Layout.FlexColumn alignItems="flex-start">
        <H2 style={styles.header}>Interested in Managed Merchant Services?</H2>
        <Text style={styles.text}>
          Complete our questionnaire, and someone from our Business Development
          team will reach out to you
        </Text>
        <SecondaryButton
          padding="16px 24px"
          onClick={() => {
            onOpenQuestionnaire();
          }}
        >
          <Text weight="bold">
            {ci18n(
              "Text on a button merchants click to get started with wish merchant services",
              "Get Started",
            )}
          </Text>
        </SecondaryButton>
      </Layout.FlexColumn>
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  const { textWhite, secondary, secondaryDarkest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: secondaryDarkest,
        },
        imageContainer: {
          maxWidth: 512,
          width: "30%",
          minWidth: 253,
          marginRight: 64,
          [`@media ${IS_SMALL_SCREEN}`]: {
            display: "none",
          },
        },
        image: {
          maxWidth: 144,
        },
        header: {
          color: textWhite,
          marginBottom: 12,
        },
        text: {
          color: secondary,
          fontSize: 16,
          lineHeight: "24px",
          marginBottom: 45,
        },
        link: {
          fontSize: 24,
          lineHeight: "28px",
        },
      }),
    [textWhite, secondary, secondaryDarkest],
  );
};

export default observer(Footer);
