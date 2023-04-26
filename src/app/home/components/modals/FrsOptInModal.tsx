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
            alt={i`Introducing WishPost 2.0`}
          />
          <Heading variant="h2" className={css(styles.header)}>
            Introducing WishPost 2.0
          </Heading>
          <Heading variant="h4" className={css(styles.subheader)}>
            A new shipping model designed to help you sell more
          </Heading>
          <Text className={css(styles.body, styles.bodyBottomMargin)}>
            WishPost 2.0 will use a new and improved WishPost rate card and
            payout policy. Customers will receive more shipping incentives, and
            your store&#39;s impressions and sales will grow—at no additional
            cost to you.
          </Text>
          <Text className={css(styles.body)}>
            Ready to get started? We&#39;ve made it easy to opt in.
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
