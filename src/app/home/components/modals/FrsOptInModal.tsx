import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import { Layout } from "@ContextLogic/lego";
import ModalFooter from "@core/components/modal/ModalFooter";
import { useNavigationStore } from "@core/stores/NavigationStore";
import { observer } from "mobx-react";
import { css } from "@core/toolkit/styling";
import { merchFeURL } from "@core/toolkit/router";
import { ci18n } from "@core/toolkit/i18n";
import Icon from "@core/components/Icon";
import { useTheme } from "@core/stores/ThemeStore";
import Illustration from "@core/components/Illustration";

type FrsOptInModalProps = BaseProps &
  Pick<ModalProps, "open"> & {
    readonly onClose: () => unknown;
  };

const FrsOptInModal: React.FC<FrsOptInModalProps> = ({ open, onClose }) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const { textDark } = useTheme();

  return (
    <Modal open={open} onClose={() => onClose()} maxWidth="lg">
      <Layout.FlexColumn alignItems="stretch">
        <Layout.FlexColumn style={styles.content} alignItems="center">
          <Icon
            style={styles.closeButton}
            name="x"
            size={24}
            color={textDark}
            onClick={onClose}
          />
          <Illustration
            style={styles.illustration}
            name="homeFrsOptInModal"
            alt={i`Enroll in Flat Rate Shipping`}
          />
          <Heading variant="h2" className={css(styles.header)}>
            Enroll in Flat Rate Shipping
          </Heading>
          <Text className={css(styles.body, styles.bodyBottomMargin)}>
            To improve Wish customer and merchant experiences, and to grow store
            performances, we&apos;re enhancing flat rate shipping. With these
            updates, we&apos;re giving you more control over pricing while
            strengthening customer incentives—all to help you drive more sales.
          </Text>
          <Text className={css(styles.body)}>
            Ready to get started? We&apos;ve made it easy to enroll.
          </Text>
        </Layout.FlexColumn>
        <ModalFooter
          action={{
            text: ci18n("Call to action on a modal", "Get started"),
            onClick: async () => {
              await navigationStore.navigate(
                merchFeURL("/shipping-settings#wishpost-settings"),
              );
            },
          }}
        />
      </Layout.FlexColumn>
    </Modal>
  );
};

export default observer(FrsOptInModal);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          position: "relative",
          padding: "70px 24px 52px 24px",
        },
        illustration: {
          marginBottom: 29,
          height: 116,
        },
        header: {
          marginBottom: 8,
        },
        subheader: {
          marginBottom: 16,
        },
        body: {
          maxWidth: 600,
          textAlign: "center",
        },
        bodyBottomMargin: {
          marginBottom: 8,
        },
        closeButton: {
          position: "absolute",
          right: 24,
          cursor: "pointer",
          top: 24,
        },
      }),
    [],
  );
};
