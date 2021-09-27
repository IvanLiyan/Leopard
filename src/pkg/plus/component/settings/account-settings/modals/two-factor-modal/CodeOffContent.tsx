/*
 * CodeOffContent.tsx
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

/* Relative Imports */
import CodeContent from "./CodeContent";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  TwoFactorTurnOffMutation,
  TwoFactorMutationsTurnOffArgs,
} from "@schema/types";

const TURN_OFF = gql`
  mutation CodeOffContent_TurnOffTwoFactorAuth($input: TwoFactorTurnOffInput!) {
    currentUser {
      twoFactorAuthentication {
        turnOff(input: $input) {
          codeState
          error
          isOn
        }
      }
    }
  }
`;

type TurnOffResponseType = {
  readonly currentUser: {
    readonly twoFactorAuthentication: {
      readonly turnOff: Pick<
        TwoFactorTurnOffMutation,
        "error" | "isOn" | "codeState"
      >;
    };
  };
};

type Props = BaseProps & {
  readonly onCancel: () => unknown;
  readonly onNext: () => unknown;
  readonly sendCode: (force?: "FORCE") => unknown;
  readonly countDown: number;
  readonly isSendingCode: boolean;
  readonly hasTfaBackupCodes: boolean;
};

const CodeOffContent: React.FC<Props> = (props: Props) => {
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
  const [turnOff, { loading }] = useMutation<
    TurnOffResponseType,
    TwoFactorMutationsTurnOffArgs
  >(TURN_OFF, { client }); // required since modals aren't passed down the client by default

  const infoText =
    i` Are you sure you want to turn off two-factor authentication? We do ` +
    i`not recommend turning off two-factor authentication as your account ` +
    i`may not be secure.`;
  const nextText = i`Disable`;

  return (
    <CodeContent
      onCancel={onCancel}
      countDown={countDown}
      isSendingCode={isSendingCode}
      onNext={async (code: string) => {
        const { data } = await turnOff({ variables: { input: { code } } });
        if (data == null) {
          toastStore.negative(i`Something went wrong. Please try again later.`);
          return;
        }

        const {
          currentUser: {
            twoFactorAuthentication: {
              turnOff: { error, isOn, codeState },
            },
          },
        } = data;

        if (codeState !== "OK") {
          setCodeInvalid(true);
          return;
        }

        if (isOn) {
          toastStore.negative(
            error || i`Something went wrong. Please try again later.`
          );
          return;
        }

        onNext();
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

export default CodeOffContent;
