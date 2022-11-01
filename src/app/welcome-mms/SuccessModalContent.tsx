/*
 * SuccessModal.tsx
 *
 * Created by Jonah Dlin on Wed Aug 24 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { H4, Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@legacy/core/i18n";
import Illustration from "@merchant/component/core/Illustration";
import { useTheme } from "@core/stores/ThemeStore";
import Icon from "@merchant/component/core/Icon";

type Props = BaseProps & {
  readonly name: string;
  readonly onClose: () => unknown;
};

const SuccessModalContent = observer(
  ({ style, className, name, onClose }: Props) => {
    const styles = useStylesheet();
    const { textBlack } = useTheme();

    return (
      <Layout.FlexColumn
        alignItems="stretch"
        style={[styles.root, style, className]}
      >
        <Icon
          onClick={() => onClose()}
          style={styles.close}
          name="x"
          size={24}
          color={textBlack}
        />
        <Illustration
          style={styles.banner}
          name="mmsWelcomeSuccessBanner"
          alt={i`We have received your submission`}
        />
        <H4 style={styles.header}>We have received your submission</H4>
        <Text style={[styles.text, styles.lastTextBlock]}>
          {ci18n(
            "addressing someone with the name in the placeholder",
            "Hello {%1=name of person},",
            name,
          )}
        </Text>
        <Text style={[styles.text, styles.lastTextBlock]}>
          Thank you for your interest in Managed Merchant Services. Our Business
          Development Team will reach out to you about next steps.
        </Text>
        <Text style={styles.text}>
          {ci18n(
            "as in the end of a letter, followed by 'the wish team;",
            "Thank you,",
          )}
        </Text>
        <Text style={styles.text}>The Wish Team</Text>
      </Layout.FlexColumn>
    );
  },
);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "72px 72px 66px",
        },
        banner: {
          marginBottom: 38,
        },
        header: {
          marginBottom: 24,
          textAlign: "center",
        },
        text: {
          color: textDark,
          fontSize: 14,
          lineHeight: "20px",
        },
        link: {
          fontSize: 14,
          lineHeight: "20px",
        },
        lastTextBlock: {
          marginBottom: 20,
        },
        close: {
          position: "absolute",
          top: 12,
          right: 16,
          transition: "opacity 0.3s linear",
          cursor: "pointer",
          ":hover": {
            opacity: 0.6,
          },
        },
      }),
    [textDark],
  );
};

export default SuccessModalContent;
