/*
 * ChangeEmailModal.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 6/03/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Relative Imports */
import ChangeEmailScreen from "./ChangeEmailScreen";
import ConfirmationScreen from "@plus/component/settings/account-settings/modals/ConfirmationScreen";

/* Type Imports */
import ToastStore from "@stores/ToastStore";
import DeviceStore from "@stores/DeviceStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ChangeEmailModalProps = BaseProps & {
  readonly currentEmail: string;
};

type ChangeEmailModalContentProps = ChangeEmailModalProps & {
  readonly closeModal: () => unknown;
  readonly onChange: (newEmail: string) => unknown;
};

const ChangeEmailModalContent: React.FC<ChangeEmailModalContentProps> = ({
  closeModal,
  onChange,
  currentEmail,
}: ChangeEmailModalContentProps) => {
  const styles = useStylesheet();
  const [newEmail, setNewEmail] = useState<string | null>();

  if (newEmail == null) {
    return (
      <ChangeEmailScreen
        className={css(styles.content)}
        onCancel={closeModal}
        onNext={(newEmailArg: string) => {
          setNewEmail(newEmailArg);
          onChange(newEmailArg);
        }}
        currentEmail={currentEmail}
      />
    );
  }

  const bodyText =
    i`A verification email has been send to **${newEmail}**, ` +
    i`please follow the instructions on that email to complete the change.`;
  const mailToLink =
    "[merchant_support@wish.com](mailto:merchant_support@wish.com)";
  const tipText =
    i`**Please note:** You will not be able to change your email again ` +
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
    [],
  );

export default class ChangeEmailModal extends Modal {
  props: ChangeEmailModalProps;
  newEmail: string | null = null;

  constructor(props: ChangeEmailModalProps) {
    super(() => null);

    this.setHeader({
      title: i`Change email`,
    });

    const { screenInnerWidth } = DeviceStore.instance();
    const targetPercentage = 745 / screenInnerWidth;
    this.setWidthPercentage(targetPercentage);

    this.props = props;
  }

  close() {
    const toastStore = ToastStore.instance();
    super.close();
    if (this.newEmail)
      setTimeout(() => {
        toastStore.positive(
          i`A verification email has been sent to ${this.newEmail}, please ` +
            i`follow the instructions to complete the change!`,
        );
      }, 300);
  }

  renderContent() {
    return (
      <ChangeEmailModalContent
        closeModal={() => this.close()}
        onChange={(newEmail: string) => {
          this.newEmail = newEmail;
        }}
        {...this.props}
      />
    );
  }
}
