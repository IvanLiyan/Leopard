import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { css } from "@toolkit/styling";
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Layout } from "@ContextLogic/lego";

/* Model */
import FranceEprState from "@merchant/model/products/FranceEprState";

/* Merchant Imports */
import FranceEprTerms from "@merchant/component/products/compliance/legal-terms/FranceEprTerms";

/* Merchant Store */
import { useDeviceStore } from "@stores/DeviceStore";

import Link from "@next-toolkit/Link";

export type Props = {
  readonly state: FranceEprState;
};

export type ContentProps = {
  readonly onClose: () => unknown;
  readonly state: FranceEprState;
};

const FranceEprAgreementModalContent = (props: ContentProps) => {
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
      <FranceEprTerms className={css(styles.content)} />
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

export default class FranceEprAgreementModal extends Modal {
  parentProps: Props;

  constructor(props: Props) {
    super(() => null);
    this.parentProps = props;

    this.setHeader({
      title: i`France EPR Declaration`,
    });
    this.setWidthPercentage(0.4);
    this.setOverflowY("scroll");
  }

  renderContent() {
    const { state } = this.parentProps;
    return (
      <FranceEprAgreementModalContent
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
