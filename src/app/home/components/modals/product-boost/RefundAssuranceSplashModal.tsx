import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Layout, Markdown, H4 } from "@ContextLogic/lego";
import { css } from "@core/toolkit/styling";
import Illustration from "@core/components/Illustration";
import { useNavigationStore } from "@core/stores/NavigationStore";
import ModalTitle from "@core/components/modal/ModalTitle";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import ModalFooter from "@core/components/modal/ModalFooter";
import { zendeskURL } from "@core/toolkit/url";
import { merchFeUrl } from "@core/toolkit/router";

type RefundAssuranceSplashModalProps = BaseProps &
  Pick<ModalProps, "open"> & {
    readonly onClose: () => unknown;
  };

const RefundAssuranceSplashModal = ({
  open,
  onClose,
}: RefundAssuranceSplashModalProps) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  return (
    <Modal open={open} onClose={() => onClose()} maxWidth="md">
      <ModalTitle
        title={i`New ProductBoost credits`}
        onClose={() => onClose()}
      />
      <Layout.FlexColumn alignItems="stretch">
        <Layout.FlexColumn
          className={css(styles.content)}
          alignItems="center"
          justifyContent="center"
        >
          <Illustration
            name="homePbModalRefundAssurance"
            alt={i`New ProductBoost credits`}
            className={css(styles.contentBlock, styles.illustration)}
          />
          <H4 className={css(styles.contentBlock, styles.title)}>
            You just received ProductBoost Credit from ProductBoost Refund
            Assurance program!
          </H4>
          <Markdown
            className={css(styles.contentBlock, styles.description)}
            text={
              i`You have been awarded ProductBoost Credit through ProductBoost ` +
              i`Refund Assurance based on recent order refunds caused by the ` +
              i`Advanced Logistics Program. See details [here](${merchFeUrl(
                "/product-boost/refund-assurance",
              )}).`
            }
          />
          <Markdown
            className={css(styles.contentBlock, styles.description)}
            text={
              i`Invest in ProductBoost with confidence and assurance while being protected ` +
              i`against Advanced Logistics Program refunds. Create ProductBoost campaigns for ` +
              i`products included in the Advanced Logistics Program now. [Learn more](${zendeskURL(
                "1260804150329",
              )})`
            }
          />
        </Layout.FlexColumn>
        <ModalFooter
          action={{
            text: i`Create ProductBoost campaign`,
            onClick: async () => {
              await navigationStore.navigate(
                merchFeUrl("/product-boost/create"),
              );
            },
          }}
          cancel={{
            text: ci18n(
              "Text on a button that closes a modal without performing any action",
              "Cancel",
            ),
            onClick: () => onClose(),
          }}
        />
      </Layout.FlexColumn>
    </Modal>
  );
};

export default RefundAssuranceSplashModal;

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
        title: {
          maxWidth: 700,
          textAlign: "center",
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
