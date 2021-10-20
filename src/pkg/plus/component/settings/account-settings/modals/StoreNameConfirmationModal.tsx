/*
 * StoreNameConfirmationModal.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 6/02/2020
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

export type StoreNameConfirmationModalProps = BaseProps;

export default class StoreNameConfirmationModal extends Modal {
  props: StoreNameConfirmationModalProps;

  constructor(props: StoreNameConfirmationModalProps) {
    super(() => null);

    this.setHeader({
      title: i`Change store name`,
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
      toastStore.positive(i`Your store name has been updated!`);
    }, 300);
  }

  renderContent() {
    const bodyText = i`Success! Your store name has been updated.`;
    const mailToLink =
      "[merchant_support@wish.com](mailto:merchant_support@wish.com)";
    const tipText =
      i`**Please note:** You will not be able to change your store name again ` +
      i`for the next ${48} hours. If you wish to change it again, please contact ` +
      i`your account manager (${mailToLink})`;

    return (
      <ConfirmationScreen
        closeModal={() => {
          this.close();
        }}
        bodyText={bodyText}
        tipText={tipText}
      />
    );
  }
}
