/*
 * ChangePasswordModal.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/29/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Relative Imports */
import ChangePasswordScreen from "./ChangePasswordScreen";
import ConfirmationScreen from "@plus/component/settings/account-settings/modals/ConfirmationScreen";

/* Type Imports */
import ToastStore from "@merchant/stores/ToastStore";
import DeviceStore from "@merchant/stores/DeviceStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ChangePasswordModalProps = BaseProps;

type ChangePasswordModalContentProps = ChangePasswordModalProps & {
  readonly closeModal: () => unknown;
  readonly onChange: () => unknown;
};

const ChangePasswordModalContent: React.FC<ChangePasswordModalContentProps> = ({
  closeModal,
  onChange,
}: ChangePasswordModalContentProps) => {
  const styles = useStylesheet();
  const [state, setState] = useState<"CODE" | "COMPLETE">("CODE");

  if (state == "CODE") {
    return (
      <ChangePasswordScreen
        className={css(styles.content)}
        onCancel={closeModal}
        onNext={() => {
          setState("COMPLETE");
          onChange();
        }}
      />
    );
  }

  const bodyText = i`Success! Your password has been updated.`;
  const mailToLink =
    "[merchant_support@wish.com](mailto:merchant_support@wish.com)";
  const tipText =
    i`**Please note:** You will not be able to change your password again ` +
    i`for the next ${48} hours. If you wish to change it again, please contact ` +
    i`your account manager (${mailToLink})`;

  return (
    <ConfirmationScreen
      closeModal={closeModal}
      bodyText={bodyText}
      tipText={tipText}
    />
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          minHeight: 340,
        },
      }),
    []
  );

export default class ChangePasswordModal extends Modal {
  props: ChangePasswordModalProps;
  changed = false;

  constructor(props: ChangePasswordModalProps) {
    super(() => null);

    this.setHeader({
      title: i`Change password`,
    });

    const { screenInnerWidth } = DeviceStore.instance();
    const targetPercentage = 745 / screenInnerWidth;
    this.setWidthPercentage(targetPercentage);

    this.props = props;
  }

  close() {
    const toastStore = ToastStore.instance();
    super.close();
    if (this.changed)
      setTimeout(() => {
        toastStore.positive(i`Your password has been updated!`);
      }, 300);
  }

  renderContent() {
    return (
      <ChangePasswordModalContent
        {...this.props}
        closeModal={() => this.close()}
        onChange={() => {
          this.changed = true;
        }}
      />
    );
  }
}
