/*
 * TwoFactorModal.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/29/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React, { useState, useEffect, useCallback } from "react";

/* External Libraries */
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import moment from "moment/moment";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Lego Toolkit */
import { useTimer, useMountEffect } from "@ContextLogic/lego/toolkit/hooks";

/* Merchant Plus Components */
import ConfirmationScreen from "@plus/component/settings/account-settings/modals/ConfirmationScreen";

/* Merchant Stores */
import { useApolloStore } from "@merchant/stores/ApolloStore";
import { useToastStore } from "@merchant/stores/ToastStore";

/* Relative Imports */
import CodeOnContent from "./CodeOnContent";
import CodeOffContent from "./CodeOffContent";
import CompleteContent from "./CompleteContent";

/* Type Imports */
import ToastStore from "@merchant/stores/ToastStore";
import DeviceStore from "@merchant/stores/DeviceStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  TwoFactorSendCodeMutation,
  TwoFactorTurnOnMutation,
} from "@schema/types";

const SEND_CODE = gql`
  mutation TwoFactorModal_SendTwoFactorAuthCode {
    currentUser {
      twoFactorAuthentication {
        sendCode {
          error
          sent
          sentTime {
            iso8061
          }
        }
      }
    }
  }
`;

type SendCodeResponseType = {
  readonly currentUser: {
    readonly twoFactorAuthentication: {
      readonly sendCode: Pick<
        TwoFactorSendCodeMutation,
        "error" | "sent" | "sentTime"
      >;
    };
  };
};

type TwoFactorCodeState =
  | "CODE_ON"
  | "CODE_OFF"
  | "COMPLETE_ON"
  | "COMPLETE_OFF";

export type TwoFactorModalProps = BaseProps & {
  readonly turningOnTwoFactor: boolean;
  readonly updateTwoFactorEnabled: (isOn: boolean) => unknown;
  readonly tfaSentTime: string | undefined;
  readonly updateTfaSentTime: (time: string) => unknown;
  readonly hasTfaBackupCodes: boolean;
};

type TwoFactorModalContentProps = TwoFactorModalProps & {
  readonly closeModal: () => unknown;
  readonly onStateChange: (newState: TwoFactorCodeState) => unknown;
};

const TwoFactorModalContent: React.FC<TwoFactorModalContentProps> = (
  props: TwoFactorModalContentProps
) => {
  const {
    closeModal,
    onStateChange,
    turningOnTwoFactor,
    updateTwoFactorEnabled,
    tfaSentTime,
    updateTfaSentTime,
    hasTfaBackupCodes,
  } = props;

  const minimumWaitTime = 300000;
  const [time, setTime] = useState(tfaSentTime);
  const periodSinceTfaSent = time
    ? moment.utc().diff(moment.utc(time), "seconds") * 1000
    : minimumWaitTime;
  const periodRemaining =
    periodSinceTfaSent >= minimumWaitTime
      ? 0
      : minimumWaitTime - periodSinceTfaSent;

  const [countDownLeft, startCountDownTimer] = useTimer({
    periodMs: periodRemaining,
    intervalMs: 1000,
    startNow: false,
  });

  const [state, setStateRaw] = useState<TwoFactorCodeState>(
    turningOnTwoFactor ? "CODE_ON" : "CODE_OFF"
  );
  const [backupCodes, setBackupCodes] = useState<
    TwoFactorTurnOnMutation["backupCodes"]
  >();
  const { client } = useApolloStore();
  const toastStore = useToastStore();
  const setState = (newState: TwoFactorCodeState) => {
    setStateRaw(newState);
    onStateChange(newState);
  };
  const [sendCodeMutation, { called }] = useMutation<
    SendCodeResponseType,
    void
  >(SEND_CODE, { client }); // required since modals aren't passed down the client by default

  const [isSendingCode, setIsSendingCode] = useState(false);

  const sendCode = useCallback(
    async (force?: "FORCE") => {
      if (called && !force) {
        return;
      }
      setIsSendingCode(true);

      const { data } = await sendCodeMutation();
      const sent = data?.currentUser.twoFactorAuthentication.sendCode.sent;
      const error = data?.currentUser.twoFactorAuthentication.sendCode.error;
      const requestSentTime =
        data?.currentUser.twoFactorAuthentication.sendCode.sentTime?.iso8061;

      setIsSendingCode(false);
      if (requestSentTime) {
        updateTfaSentTime(requestSentTime);
        setTime(requestSentTime);
      }

      if (!sent) {
        toastStore.negative(
          error || i`Something went wrong. Please try again later.`
        );
      }
    },
    [called, sendCodeMutation, toastStore, updateTfaSentTime]
  );

  // try to send a new 2fa code on mount
  useMountEffect(() => {
    if (periodRemaining == 0) {
      sendCode();
    }
  });

  useEffect(() => {
    startCountDownTimer();
  }, [startCountDownTimer]);

  switch (state) {
    case "CODE_ON":
      return (
        <CodeOnContent
          onCancel={closeModal}
          onNext={(backupCodes: TwoFactorTurnOnMutation["backupCodes"]) => {
            setBackupCodes(backupCodes);
            setState("COMPLETE_ON");
            updateTwoFactorEnabled(true);
          }}
          countDown={countDownLeft}
          sendCode={sendCode}
          isSendingCode={isSendingCode}
          hasTfaBackupCodes={hasTfaBackupCodes}
        />
      );

    case "CODE_OFF":
      return (
        <CodeOffContent
          onCancel={closeModal}
          onNext={() => {
            setState("COMPLETE_OFF");
            updateTwoFactorEnabled(false);
          }}
          countDown={countDownLeft}
          sendCode={sendCode}
          isSendingCode={isSendingCode}
          hasTfaBackupCodes={hasTfaBackupCodes}
        />
      );

    case "COMPLETE_ON":
      return (
        <CompleteContent
          onCancel={closeModal}
          backupCodes={backupCodes || []}
        />
      );

    default:
      // "COMPLETE_OFF"
      const bodyText = i`Sucess! Two-factor authentication is now **OFF**.`;
      const tipText =
        i`**Please note:** Your account must have two-factor ` +
        i`authentication enabled to receive payments from Wish.`;

      return (
        <ConfirmationScreen
          closeModal={closeModal}
          bodyText={bodyText}
          tipText={tipText}
        />
      );
  }
};

export default class TwoFactorModal extends Modal {
  props: TwoFactorModalProps;
  state: TwoFactorCodeState = "CODE_ON";

  constructor(props: TwoFactorModalProps) {
    super(() => null);

    this.setHeader({
      title: i`Two-factor authentication`,
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
      if (this.state == "COMPLETE_ON") {
        toastStore.positive(i`Two-factor authentication is now turned on!`);
      } else if (this.state == "COMPLETE_OFF") {
        toastStore.positive(i`Two-factor authentication is now turned off!`);
      }
    }, 300);
  }

  renderContent() {
    return (
      <TwoFactorModalContent
        {...this.props}
        closeModal={() => this.close()}
        onStateChange={(newState) => {
          this.state = newState;
        }}
      />
    );
  }
}
