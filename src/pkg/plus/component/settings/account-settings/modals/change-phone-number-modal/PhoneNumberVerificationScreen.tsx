import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Legacy Toolkit */
import { ci18n } from "@legacy/core/i18n";

/* Merchant Stores */
import { useApolloStore } from "@stores/ApolloStore";
import { useToastStore } from "@stores/ToastStore";

/* Lego Components */
import { Button } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";

import CodeInput from "@plus/component/settings/account-settings/modals/two-factor-modal/code-input/CodeInput";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";
import {
  ChangePhoneNumberVerifyCodeMutation,
  ChangePhoneNumberMutationVerifyCodeArgs,
} from "@schema/types";

const VERIFY_CODE = gql`
  mutation ChangePhoenNumberVerificationScreen_VerifyCodeNumber(
    $input: ChangePhoneNumberVerifyCodeInput!
  ) {
    currentUser {
      changePhoneNumber {
        verifyCode(input: $input) {
          error
          verifiedOk
        }
      }
    }
  }
`;

type VerifyCodeResponseType = {
  readonly currentUser: {
    readonly changePhoneNumber: {
      readonly verifyCode: Pick<
        ChangePhoneNumberVerifyCodeMutation,
        "error" | "verifiedOk"
      >;
    };
  };
};

type Props = BaseProps & {
  readonly onCancel: () => unknown;
  readonly onNext: () => unknown;
  readonly newPhoneNumber: string | undefined;
  readonly setPhoneNumber: (number: string) => unknown;
  readonly sendVerificationCode: () => Promise<unknown>;
};

const PhoneNumberVerificationScreen: React.FC<Props> = (props: Props) => {
  const CODE_LENGTH = 5;
  const {
    className,
    style,
    onCancel,
    onNext,
    newPhoneNumber,
    setPhoneNumber,
    sendVerificationCode,
  } = props;
  const styles = useStylesheet();
  const { client } = useApolloStore();
  const toastStore = useToastStore();
  const [code, setCodeRaw] = useState<string>("");
  const [codeInvalid, setCodeInvalid] = useState(false);
  const setCode = (code: string) => {
    setCodeInvalid(false);
    setCodeRaw(code);
  };

  const isCodeFormatValid = code && code.length == CODE_LENGTH;

  const headerText = ci18n(
    "referring to a code that has been sent to a phone number",
    "A five-digit verification code has been sent to %1$s",
    newPhoneNumber,
  );
  const actionText = ci18n(
    "referring to a code that has been sent to a phone number",
    "Please enter the five-digit verification code",
  );
  const sendCodeText = ci18n(
    "referring to the button to resend verification code",
    "Send again",
  );

  const [verifyCode] = useMutation<
    VerifyCodeResponseType,
    ChangePhoneNumberMutationVerifyCodeArgs
  >(VERIFY_CODE, { client });

  const onVerify = async () => {
    if (newPhoneNumber == null || !isCodeFormatValid) {
      toastStore.negative(i`Please fill out the form.`);
      return;
    }
    const { data } = await verifyCode({
      variables: { input: { newPhoneNumber, verificationCode: code } },
    });
    if (data == null) {
      toastStore.negative(i`Something went wrong. Please try again later.`);
      return;
    }

    const {
      currentUser: {
        changePhoneNumber: {
          verifyCode: { error, verifiedOk },
        },
      },
    } = data;

    if (!verifiedOk) {
      setCodeInvalid(true);
      const errMessage =
        error || i`Something went wrong. Please try again later.`;
      toastStore.negative(errMessage);
    } else {
      setPhoneNumber(newPhoneNumber);
      toastStore.positive(i`Success! Your phone number has been updated!`);
      onNext();
    }
  };

  return (
    <>
      <div className={css(styles.root, className, style)}>
        <Markdown className={css(styles.header)} text={headerText} />
        <div className={css(styles.codeContainer)}>
          <Markdown className={css(styles.codeDescription)} text={actionText} />
          <CodeInput
            className={css(styles.codeInput)}
            elementClassName={css(
              codeInvalid && styles.invalidCodeInputElement,
            )}
            numCharacters={CODE_LENGTH}
            value={code}
            onChange={setCode}
          />
          <SecondaryButton
            className={css(styles.resendButton)}
            onClick={sendVerificationCode}
          >
            <Markdown text={`**${sendCodeText}**`} />
          </SecondaryButton>
        </div>
      </div>
      <div className={css(styles.buttonContainer)}>
        <Button className={css(styles.button)} onClick={onCancel}>
          Back
        </Button>
        <PrimaryButton onClick={onVerify} isDisabled={!isCodeFormatValid}>
          Confirm
        </PrimaryButton>
      </div>
    </>
  );
};

export default PhoneNumberVerificationScreen;

const useStylesheet = () => {
  const { borderPrimaryDark, negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0px 72px",
        },
        codeContainer: {
          height: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        },
        codeDescription: {
          marginTop: 30,
          textAlign: "center",
        },
        header: {
          textAlign: "center",
        },
        codeInput: {
          marginTop: 20,
        },
        invalidCodeInputElement: {
          borderColor: negative,
          ":focus": {
            borderColor: negative,
          },
        },
        field: {
          minWidth: 330, // eslint-disable-line local-rules/no-frozen-width
          marginTop: 22,
          marginBottom: 10,
        },
        resendButton: {
          width: 360, // eslint-disable-line local-rules/no-frozen-width
          marginTop: 10,
          marginBottom: 10,
        },
        buttonContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 24,
          borderTop: `1px solid ${borderPrimaryDark}`,
        },
        button: {
          minWidth: 160,
        },
      }),
    [borderPrimaryDark, negative],
  );
};
