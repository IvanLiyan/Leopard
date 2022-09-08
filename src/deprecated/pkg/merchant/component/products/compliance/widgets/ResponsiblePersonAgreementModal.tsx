import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { css } from "@toolkit/styling";
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Layout } from "@ContextLogic/lego";

/* Model */
import ResponsiblePersonState from "@merchant/model/products/ResponsiblePersonState";

/* Merchant Imports */
import AddResponsiblePersonTerms from "@merchant/component/products/compliance/legal-terms/AddResponsiblePersonTerms";

/* Merchant Store */
import { useDeviceStore } from "@stores/DeviceStore";

import Link from "@next-toolkit/Link";

export type Props = {
  readonly state: ResponsiblePersonState;
};

export type ContentProps = {
  readonly onClose: () => unknown;
  readonly state: ResponsiblePersonState;
};

const ResponsiblePersonModalContent = (props: ContentProps) => {
  const { isSmallScreen } = useDeviceStore();
  const { onClose, state } = props;

  const styles = useStylesheet();

  const sendButtonProps = {
    style: { flex: 1 },
    text: i`Agree and continue`,
    isLoading: state.isSubmitting,
    onClick: async () => {
      await state.acceptTerms();
      onClose();
    },
  };

  const cancelButtonProps = {
    onClick: () => onClose(),
  };

  return (
    <Layout.FlexColumn>
      <AddResponsiblePersonTerms className={css(styles.content)} />
      <ModalFooter
        layout={isSmallScreen ? "vertical" : "horizontal"}
        action={sendButtonProps}
        extraFooterContent={
          <Link className={css(styles.cancelButton)} {...cancelButtonProps}>
            Cancel
          </Link>
        }
      />
    </Layout.FlexColumn>
  );
};

export default class ResponsiblePersonAgreementModal extends Modal {
  parentProps: Props;

  constructor(props: Props) {
    super(() => null);
    this.parentProps = props;

    this.setHeader({
      title: i`EU Product Compliance - Responsible Person Declaration`,
    });
    this.setWidthPercentage(0.4);
    this.setOverflowY("scroll");
  }

  renderContent() {
    const { state } = this.parentProps;
    return (
      <ResponsiblePersonModalContent
        onClose={() => this.close()}
        state={state}
      />
    );
  }
}

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
        },
        cancelButton: {
          ":not(:last-child)": {
            marginRight: 24,
          },
        },
      }),
    []
  );
};
