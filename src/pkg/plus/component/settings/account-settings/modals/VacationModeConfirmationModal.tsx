/*
 * VacationModeConfirmationModal.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 6/03/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React from "react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Relative Imports */
import ConfirmationScreen from "./ConfirmationScreen";

/* Type Imports */
import ToastStore from "@stores/ToastStore";
import DeviceStore from "@stores/DeviceStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type VacationModeConfirmationModalProps = BaseProps & {
  readonly turningOnVacationMode: boolean;
};

export default class VacationModeConfirmationModal extends Modal {
  props: VacationModeConfirmationModalProps;

  constructor(props: VacationModeConfirmationModalProps) {
    super(() => null);

    this.setHeader({
      title: i`Vacation mode`,
    });

    const { screenInnerWidth } = DeviceStore.instance();
    const targetPercentage = 745 / screenInnerWidth;
    this.setWidthPercentage(targetPercentage);

    this.props = props;
  }

  close() {
    const toastStore = ToastStore.instance();
    super.close();
    setTimeout(() => {
      if (this.props.turningOnVacationMode) {
        toastStore.warning(
          i`Vacation mode is now on, enjoy your vacation! ` +
            i`Your products will be updated shortly.`,
        );
      } else {
        toastStore.info(
          i`Vacation mode is now off! Your products are now for sale again.`,
        );
      }
    }, 300);
  }

  renderContent() {
    const bodyText = this.props.turningOnVacationMode
      ? i`Vacation mode is turned **ON**.` +
        "\n\n" +
        i`Your products will be updated shortly.`
      : `Vacation mode is turned **OFF**.` +
        "\n\n" +
        i`Your products are now for sale again.`;

    const illustration = this.props.turningOnVacationMode
      ? "merchantPlusVacationModeOn"
      : "merchantPlusVacationModeOff";

    return (
      <ConfirmationScreen
        closeModal={() => {
          this.close();
        }}
        bodyText={bodyText}
        illustration={illustration}
      />
    );
  }
}
