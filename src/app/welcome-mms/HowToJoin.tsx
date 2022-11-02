/*
 * HowToJoin.tsx
 *
 * Created by Jonah Dlin on Wed Aug 24 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Layout, H2, Text, Link } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Illustration from "@deprecated/pkg/merchant/component/core/Illustration";
import { css, IS_SMALL_SCREEN } from "@core/toolkit/styling";

type Props = BaseProps & {
  readonly onOpenQuestionnaire: () => unknown;
};

const HowToJoin: React.FC<Props> = ({
  className,
  style,
  onOpenQuestionnaire,
}) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexRow
      style={[styles.root, className, style]}
      alignItems="center"
      justifyContent="space-between"
    >
      <Illustration
        style={styles.image}
        name="mmsWelcomeLaptopSurvey"
        alt={i`Fill out the welcome survey`}
      />
      <Layout.FlexColumn alignItems="flex-start">
        <H2 style={styles.header}>How to Join Managed Merchant Services</H2>
        <div className={css(styles.topParagraph)}>
          <Link
            style={[styles.link, styles.inline]}
            onClick={() => {
              onOpenQuestionnaire();
            }}
          >
            Complete this questionnaire.
          </Link>
          {"  "}
          <Text style={[styles.text, styles.inline]}>
            Our Business Development team will reach out to you about next
            steps.
          </Text>
        </div>
        <Text style={styles.text}>
          You can also contact a Business Development representative to see if
          Managed Merchant Services is a good fit for you.
        </Text>
      </Layout.FlexColumn>
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  const { textDark, secondaryLighter } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: secondaryLighter,
        },
        image: {
          maxWidth: 512,
          width: "30%",
          minWidth: 253,
          marginRight: 64,
          [`@media ${IS_SMALL_SCREEN}`]: {
            display: "none",
          },
        },
        header: {
          marginBottom: 40,
        },
        topParagraph: {
          marginBottom: 28,
        },
        inline: {
          display: "inline",
        },
        text: {
          color: textDark,
          fontSize: 24,
          lineHeight: "28px",
        },
        link: {
          fontSize: 24,
          lineHeight: "28px",
        },
      }),
    [textDark, secondaryLighter],
  );
};

export default observer(HowToJoin);
