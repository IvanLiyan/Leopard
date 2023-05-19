import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Layout } from "@ContextLogic/lego";
import { css } from "@core/toolkit/styling";
import { useNavigationStore } from "@core/stores/NavigationStore";
import ModalTitle from "@core/components/modal/ModalTitle";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import { useTheme } from "@core/stores/ThemeStore";
import ModalFooter from "@core/components/modal/ModalFooter";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import { FreePBCreditModalFields } from "@home/toolkit/product-boost";
import { merchFeUrl } from "@core/toolkit/router";

type FreeCreditModalProps = BaseProps &
  Pick<ModalProps, "open"> & {
    readonly onClose: () => unknown;
    readonly freePbCreditModalInfo: FreePBCreditModalFields | null | undefined;
  };

const FreeCreditModal: React.FC<FreeCreditModalProps> = ({
  open,
  onClose,
  freePbCreditModalInfo,
}) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  const expiredDate = freePbCreditModalInfo?.expired_date;
  const initialAmount = freePbCreditModalInfo?.initial_amount;
  const currentAmount = freePbCreditModalInfo?.current_amount;

  return (
    <Modal open={open} onClose={() => onClose()} maxWidth="md">
      <ModalTitle
        title={i`Free ProductBoost Credits`}
        onClose={() => onClose()}
      />
      <Layout.FlexColumn alignItems="stretch">
        <Layout.FlexColumn
          className={css(styles.content)}
          alignItems="center"
          justifyContent="center"
        >
          <Heading variant="h1" className={css(styles.text)}>
            You have just received free ProductBoost credits! You can use them
            to reach more people and increase your sales.
          </Heading>
          {currentAmount != null &&
            expiredDate != null &&
            initialAmount != null &&
            (currentAmount === initialAmount ? (
              <Text className={css(styles.contentBlock, styles.text)}>
                {i`You have been awarded ${initialAmount} worth of free ProductBoost ` +
                  i`credits! Boost your sales before the credits expire on ${expiredDate}.`}
              </Text>
            ) : (
              <Text className={css(styles.contentBlock, styles.text)}>
                {i`You were awarded ${initialAmount} worth of free ProductBoost ` +
                  i`credits, and you still have ${currentAmount} remaining! ` +
                  i`Boost your sales before the credits expire on ${expiredDate}.`}
              </Text>
            ))}
        </Layout.FlexColumn>
        <ModalFooter
          action={{
            text: i`Create a campaign`,
            onClick: async () => {
              await navigationStore.navigate(
                merchFeUrl("/product-boost/v2/create"),
              );
            },
          }}
          cancel={{
            text: i`Close`,
            onClick: () => onClose(),
          }}
        />
      </Layout.FlexColumn>
    </Modal>
  );
};

export default FreeCreditModal;

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
        },
        contentBlock: {
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
        illustration: {
          maxWidth: 350,
        },
        text: {
          marginBottom: "12px",
          textAlign: "center",
        },
        productName: {
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
        description: {
          fontSize: 16,
          lineHeight: "24px",
          maxWidth: 700,
        },
        footer: {
          flex: 1,
          padding: 24,
          borderTop: `1px solid ${borderPrimary}`,
        },
        footerButton: {
          boxSizing: "border-box",
          height: 40,
        },
      }),
    [borderPrimary],
  );
};
