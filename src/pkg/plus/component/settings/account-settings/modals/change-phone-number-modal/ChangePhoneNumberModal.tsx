import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Relative Imports */
import ChangePhoneNumberScreen from "./ChangePhoneNumberScreen";
import PhoneNumberVerificationScreen from "./PhoneNumberVerificationScreen";

/* Type Imports */
import { useToastStore } from "@stores/ToastStore";
import { useApolloStore } from "@stores/ApolloStore";
import DeviceStore from "@stores/DeviceStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  ChangePhoneNumberSendCodeMutation,
  ChangePhoneNumberMutationSendCodeArgs,
  CountryCode,
} from "@schema/types";

const SEND_VERIFICATION_CODE = gql`
  mutation ChangePhoenNumberModal_SendCode(
    $input: ChangePhoneNumberSendCodeInput!
  ) {
    currentUser {
      changePhoneNumber {
        sendCode(input: $input) {
          error
          sentOk
        }
      }
    }
  }
`;

type SendVerificationCodeResponseType = {
  readonly currentUser: {
    readonly changePhoneNumber: {
      readonly sendCode: Pick<
        ChangePhoneNumberSendCodeMutation,
        "error" | "sentOk"
      >;
    };
  };
};

type ChangePhoneNumberModalProps = BaseProps & {
  readonly currentPhoneNumber: string;
  readonly setPhoneNumber: (number: string) => unknown;
  readonly interselectablePhoneCountryCodes: ReadonlyArray<CountryCode>;
};

type ChangePhoneNumberModalContentProps = ChangePhoneNumberModalProps & {
  readonly closeModal: () => unknown;
};

const ChangePhoneNumberModalContent: React.FC<ChangePhoneNumberModalContentProps> =
  ({
    closeModal,
    currentPhoneNumber,
    setPhoneNumber,
    interselectablePhoneCountryCodes,
  }: ChangePhoneNumberModalContentProps) => {
    const styles = useStylesheet();
    const toastStore = useToastStore();
    const { client } = useApolloStore();
    const [state, setState] = useState<"CHANGE" | "CODE">("CHANGE");
    const [newPhoneNumber, setNewPhoneNumber] = useState<string | undefined>();

    const [sendVerification] = useMutation<
      SendVerificationCodeResponseType,
      ChangePhoneNumberMutationSendCodeArgs
    >(SEND_VERIFICATION_CODE, { client }); // required since modals aren't passed down the client by default

    const sendVerificationCode = async () => {
      if (newPhoneNumber == null || newPhoneNumber?.length == 0) {
        toastStore.negative(i`Please fill out the form.`);
        return;
      }
      const { data } = await sendVerification({
        variables: { input: { newPhoneNumber } },
      });
      if (data == null) {
        toastStore.negative(i`Something went wrong. Please try again later.`);
        return;
      }

      const {
        currentUser: {
          changePhoneNumber: {
            sendCode: { error, sentOk },
          },
        },
      } = data;

      if (!sentOk) {
        const errMessage =
          error || i`Something went wrong. Please try again later.`;
        toastStore.negative(errMessage);
      } else {
        setState("CODE");
        toastStore.positive(i`Verification code sent!`);
      }
    };

    if (state == "CHANGE") {
      return (
        <ChangePhoneNumberScreen
          currentPhoneNumber={currentPhoneNumber}
          className={css(styles.content)}
          onCancel={closeModal}
          setNewPhoneNumber={setNewPhoneNumber}
          sendVerificationCode={sendVerificationCode}
          interselectablePhoneCountryCodes={interselectablePhoneCountryCodes}
        />
      );
    }

    return (
      <PhoneNumberVerificationScreen
        className={css(styles.content)}
        newPhoneNumber={newPhoneNumber}
        setPhoneNumber={setPhoneNumber}
        sendVerificationCode={sendVerificationCode}
        onCancel={() => {
          setState("CHANGE");
        }}
        onNext={closeModal}
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

export default class ChangePhoneNumberModal extends Modal {
  props: ChangePhoneNumberModalProps;

  constructor(props: ChangePhoneNumberModalProps) {
    super(() => null);

    this.setHeader({
      title: i`Edit Phone Number`,
    });

    const { screenInnerWidth } = DeviceStore.instance();
    const targetPercentage = 745 / screenInnerWidth;
    this.setWidthPercentage(targetPercentage);

    this.props = props;
  }

  renderContent() {
    return (
      <ChangePhoneNumberModalContent
        {...this.props}
        closeModal={() => super.close()}
      />
    );
  }
}
