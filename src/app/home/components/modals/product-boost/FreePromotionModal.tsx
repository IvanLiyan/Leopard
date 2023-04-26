import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Layout, Ul } from "@ContextLogic/lego";
import { css } from "@core/toolkit/styling";
import Illustration from "@core/components/Illustration";
import { useNavigationStore } from "@core/stores/NavigationStore";
import ModalTitle from "@core/components/modal/ModalTitle";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import { useTheme } from "@core/stores/ThemeStore";
import ModalFooter from "@core/components/modal/ModalFooter";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import { merchFeURL } from "@core/toolkit/router";

type FreePromotionModalProps = BaseProps &
  Pick<ModalProps, "open"> & {
    readonly onClose: () => unknown;
    readonly productNames: ReadonlyArray<string>;
  };

const FreePromotionModal: React.FC<FreePromotionModalProps> = ({
  open,
  onClose,
  productNames,
}) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  return (
    <Modal open={open} onClose={() => onClose()} maxWidth="md">
      <ModalTitle title={i`Free Boosted Products`} onClose={() => onClose()} />
      <Layout.FlexColumn alignItems="stretch">
        <Layout.FlexColumn
          className={css(styles.content)}
          alignItems="center"
          justifyContent="center"
        >
          <Heading variant="h1" className={css(styles.text)}>
            Thank you for being a valuable member of Wish!
          </Heading>
          <Illustration
            name="homePbModalRocket"
            alt={i`New ProductBoost credits`}
            className={css(styles.contentBlock, styles.illustration)}
          />
          <Text className={css(styles.contentBlock, styles.text)}>
            As a token of appreciation, we are boosting some of your products
            for free.
          </Text>
          <Ul className={css(styles.contentBlock)}>
            {[
              ...productNames.slice(0, 5).map((productName) => {
                return (
                  <Ul.Li key={productName}>
                    <Text className={css(styles.productName)}>
                      {productName}
                    </Text>
                  </Ul.Li>
                );
              }),
              ...(productNames.length > 5
                ? [
                    <Ul.Li key="number-of-extra-products">
                      <Text>+{productNames.length - 5} more</Text>
                    </Ul.Li>,
                  ]
                : []),
            ]}
          </Ul>
        </Layout.FlexColumn>
        <ModalFooter
          action={{
            text: i`View Campaigns`,
            onClick: async () => {
              await navigationStore.navigate(
                merchFeURL("/product-boost/history/list?automated=0"),
              );
            },
          }}
        />
      </Layout.FlexColumn>
    </Modal>
  );
};

export default FreePromotionModal;

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
