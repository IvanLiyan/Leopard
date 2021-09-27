import React from "react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Relative Imports */
import ConfirmationScreen from "./ConfirmationScreen";

/* Type Imports */
import DeviceStore from "@merchant/stores/DeviceStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type PaymentConfirmationModalProps = BaseProps & {
  readonly onClick: () => unknown;
};

export default class PaymentConfirmationModal extends Modal {
  props: PaymentConfirmationModalProps;

  constructor(props: PaymentConfirmationModalProps) {
    super(() => null);

    this.setHeader({
      title: i`Confirm payment provider`,
    });

    const { screenInnerWidth } = DeviceStore.instance();
    const targetPercentage = 745 / screenInnerWidth;
    this.setWidthPercentage(targetPercentage);

    this.props = props;
  }

  close() {
    super.close();
  }

  renderContent() {
    const bodyText =
      i`Please confirm and complete sign in on **Payoneer** to finish setting up your ` +
      i`payment provider`;

    return (
      <ConfirmationScreen
        closeModal={() => {
          this.close();
        }}
        onClick={() => this.props.onClick()}
        bodyText={bodyText}
      />
    );
  }
}
