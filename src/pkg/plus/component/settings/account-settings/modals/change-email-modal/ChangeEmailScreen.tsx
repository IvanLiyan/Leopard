/*
 * ChangeEmailScreen.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/29/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

/* Legacy Toolkit */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { EmailValidator, RequiredValidator } from "@toolkit/validators";

/* Lego Components */
import { Button } from "@ContextLogic/lego";
import { Markdown, TextInput } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Merchant Plus Components */
import HorizontalField from "@plus/component/form/HorizontalField";
import PasswordInput from "@plus/component/settings/account-settings/modals/change-password-modal/PasswordInput";

/* Merchant Stores */
import { useApolloStore } from "@stores/ApolloStore";
import { useToastStore } from "@stores/ToastStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  ChangeEmailMutation,
  UserMutationChangeEmailArgs,
} from "@schema/types";
import { useTheme } from "@stores/ThemeStore";

const CHANGE_EMAIL = gql`
  mutation ChangeEmailScreen_ChangeEmail($input: ChangeEmailInput!) {
    currentUser {
      changeEmail(input: $input) {
        error
        passwordOk
      }
    }
  }
`;

type ChangeEmailResponseType = {
  readonly currentUser: {
    readonly changeEmail: Pick<ChangeEmailMutation, "error" | "passwordOk">;
  };
};

type Props = BaseProps & {
  readonly onCancel: () => unknown;
  readonly onNext: (newEmail: string) => unknown;
  readonly currentEmail: string;
};

const ChangeEmailScreen: React.FC<Props> = (props: Props) => {
  const { className, style, onCancel, onNext, currentEmail } = props;
  const styles = useStylesheet();
  const { client } = useApolloStore();
  const toastStore = useToastStore();
  const [email, setEmail] = useState<string | undefined>();
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState<string | undefined>();
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [changeEmail] = useMutation<
    ChangeEmailResponseType,
    UserMutationChangeEmailArgs
  >(CHANGE_EMAIL, { client }); // required since modals aren't passed down the client by default

  const onChangeEmail = async () => {
    if (email == null || password == null) {
      toastStore.negative(i`Please fill out the form.`);
      return;
    }
    const { data } = await changeEmail({
      variables: { input: { email, password } },
    });
    if (data == null) {
      toastStore.negative(i`Something went wrong. Please try again later.`);
      return;
    }

    const {
      currentUser: {
        changeEmail: { error, passwordOk },
      },
    } = data;

    if (!passwordOk) {
      setPasswordInvalid(true);
      return;
    }
    if (error) {
      toastStore.negative(error);
      return;
    }

    onNext(email);
  };

  const headerText =
    ci18n(
      "referring to an email address",
      "We'll use this address if we need to contact you about your store.",
    ) +
    "\n\n" +
    ci18n(
      "referring to an email address",
      "Your customers will see this address if you email them.",
    );

  const emailPopover = () => (
    <Markdown
      className={css(styles.markdown)}
      text={i`New email address that will be used for messages from Wish`}
    />
  );

  return (
    <>
      <div className={css(styles.root, className, style)}>
        <Markdown className={css(styles.header)} text={headerText} />
        <HorizontalField title={i`Current email`} centerTitleVertically>
          <TextInput
            className={css(styles.field)}
            value={currentEmail}
            disabled
            renderBlankError
          />
        </HorizontalField>
        <HorizontalField
          title={i`New email`}
          popoverContent={emailPopover}
          popoverPosition={"right center"}
          centerTitleVertically
        >
          {/* can replace with EmailInput once new theming is done
          - right now have to use plus TextInput */}
          <TextInput
            className={css(styles.field)}
            validators={[new RequiredValidator(), new EmailValidator()]}
            onChange={({ text, isValid }) => {
              setEmail(text);
              setEmailValid(!!isValid);
            }}
            passValidity
            renderBlankError
          />
        </HorizontalField>
        <HorizontalField title={i`Current password`} centerTitleVertically>
          <PasswordInput
            className={css(styles.field)}
            password={password}
            setPassword={setPassword}
            isIncorrect={passwordInvalid}
          />
        </HorizontalField>
      </div>
      <div className={css(styles.buttonContainer)}>
        <Button className={css(styles.button)} onClick={onCancel}>
          Cancel
        </Button>
        <PrimaryButton
          popoverStyle={css(styles.button)}
          onClick={onChangeEmail}
          isDisabled={!(emailValid && password)}
        >
          Next
        </PrimaryButton>
      </div>
    </>
  );
};

export default ChangeEmailScreen;

const useStylesheet = () => {
  const { borderPrimaryDark } = useTheme();
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
        header: {
          textAlign: "center",
        },
        markdown: {
          margin: 10,
          maxWidth: 225,
        },
        field: {
          minWidth: 330, // eslint-disable-line local-rules/no-frozen-width
          marginTop: 22,
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
    [borderPrimaryDark],
  );
};
