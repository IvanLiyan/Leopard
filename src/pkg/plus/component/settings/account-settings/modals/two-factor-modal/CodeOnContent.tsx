/*
 * CodeOnContent.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 6/17/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React, { useState } from "react";

/* External Libraries */
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

/* Merchant Stores */
import { useApolloStore } from "@merchant/stores/ApolloStore";
import { useToastStore } from "@merchant/stores/ToastStore";

/* Legacy */
import { zendeskURL } from "@legacy/core/url";

/* Relative Imports */
import CodeContent from "./CodeContent";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  TwoFactorTurnOnMutation,
  TwoFactorMutationsVerifyCodeArgs,
} from "@schema/types";

const TURN_ON = gql`
  mutation CodeOnContent_TurnOnTwoFactorAuth($input: TwoFactorTurnOnInput!) {
    currentUser {
      twoFactorAuthentication {
        turnOn(input: $input) {
          codeState
          backupCodes
          error
          isOn
        }
      }
    }
  }
`;

type TurnOnResponseType = {
  readonly currentUser: {
    readonly twoFactorAuthentication: {
      readonly turnOn: Pick<
        TwoFactorTurnOnMutation,
        "error" | "isOn" | "codeState" | "backupCodes"
      >;
    };
  };
};

type Props = BaseProps & {
  readonly onCancel: () => unknown;
  readonly onNext: (
    backupCodes: TwoFactorTurnOnMutation["backupCodes"]
  ) => unknown;
  readonly sendCode: (force?: "FORCE") => unknown;
  readonly isSendingCode: boolean;
  readonly countDown: number;
  readonly hasTfaBackupCodes: boolean;
};

const CodeOnContent: React.FC<Props> = (props: Props) => {
  const { client } = useApolloStore();
  const toastStore = useToastStore();
  const {
    onCancel,
    onNext,
    sendCode,
    countDown,
    isSendingCode,
    hasTfaBackupCodes,
  } = props;
  const [codeInvalid, setCodeInvalid] = useState(false);
  const [turnOn, { loading }] = useMutation<
    TurnOnResponseType,
    TwoFactorMutationsVerifyCodeArgs
  >(TURN_ON, { client }); // required since modals aren't passed down the client by default

  const tfaFAQLink = zendeskURL("221686987");
  const infoText =
    i`Two-factor authentication adds an additional layer of security to your ` +
    i`account. When signing in, you’ll need to enter your password and a ` +
    i`verification code. [Learn more](${tfaFAQLink})`;
  const nextText = i`Enable`;

  return (
    <CodeContent
      onCancel={onCancel}
      countDown={countDown}
      isSendingCode={isSendingCode}
      onNext={async (code: string) => {
        const { data } = await turnOn({ variables: { input: { code } } });
        if (data == null) {
          toastStore.negative(i`Something went wrong. Please try again later.`);
          return;
        }

        const {
          currentUser: {
            twoFactorAuthentication: {
              turnOn: { error, isOn, backupCodes, codeState },
            },
          },
        } = data;

        if (codeState !== "OK") {
          setCodeInvalid(true);
          return;
        }

        if (!isOn) {
          toastStore.negative(
            error || i`Something went wrong. Please try again later.`
          );
          return;
        }

        onNext(backupCodes || []);
      }}
      infoText={infoText}
      nextText={nextText}
      codeInvalid={codeInvalid}
      setCodeInvalid={setCodeInvalid}
      isLoading={loading}
      sendCode={sendCode}
      hasTfaBackupCodes={hasTfaBackupCodes}
    />
  );
};

export default CodeOnContent;
