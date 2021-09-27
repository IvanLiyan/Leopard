/*
 * SwitchNavBackTutorialModal.tsx
 *
 * Created by Jonah Dlin on Wed Jun 02 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import { Layout, PrimaryButton, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useUIStateBool } from "@toolkit/ui-state";
import { Illustration } from "@merchant/component/core";
import { useApolloStore } from "@merchant/stores/ApolloStore";

export type Props = BaseProps & {
  readonly closeModal: () => void;
};

const SwitchNavBackTutorial = (props: Props) => {
  const { className, style, closeModal } = props;
  const styles = useStylesheet();
  const { client } = useApolloStore();

  const {
    isLoading,
    update: dismissSwitchNavBack,
  } = useUIStateBool("DISMISSED_SWITCH_NAV_BACK_TUTORIAL", { client });

  const handleDismissModal = async () => {
    await dismissSwitchNavBack(true);
    closeModal();
  };

  return (
    <Layout.FlexColumn className={css(className, style)}>
      <Layout.FlexColumn
        className={css(styles.textContainer)}
        alignItems="center"
        justifyContent="center"
      >
        <Text className={css(styles.header)} weight="bold">
          Welcome to the new navigation menu!
        </Text>
        <Text className={css(styles.description)}>
          Opt out at any time by clicking "Switch to original navigation" in the
          store name dropdown on the top right corner.
        </Text>
      </Layout.FlexColumn>
      <Illustration
        name="switchNavBackInstructions"
        alt={i`How to switch to original navigation`}
      />
      <Layout.FlexRow
        className={css(styles.footer)}
        alignItems="center"
        justifyContent="center"
      >
        <PrimaryButton onClick={handleDismissModal} isLoading={isLoading}>
          Got it
        </PrimaryButton>
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

export default class SwitchNavBackTutorialModal extends Modal {
  constructor() {
    super(() => null);

    this.setWidthPercentage(0.5);
    this.setNoMaxHeight(true);
  }

  renderContent() {
    return <SwitchNavBackTutorial closeModal={() => this.close()} />;
  }
}

const useStylesheet = () => {
  const { textBlack, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        textContainer: {
          padding: "40px 60px",
        },
        header: {
          color: textBlack,
          fontSize: 20,
          lineHeight: "24px",
          marginBottom: 8,
        },
        description: {
          color: textBlack,
          fontSize: 16,
          lineHeight: "24px",
          textAlign: "center",
        },
        illustration: {
          width: "100%",
        },
        footer: {
          padding: 24,
          flex: 1,
          borderTop: `1px solid ${borderPrimary}`,
        },
      }),
    [textBlack, borderPrimary]
  );
};
