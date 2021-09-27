/*
 * ChangePasswordScreen.tsx
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

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import { PasswordInput as NewPasswordInput } from "@merchant/component/core";

/* Merchant Stores */
import { useApolloStore } from "@merchant/stores/ApolloStore";
import { useToastStore } from "@merchant/stores/ToastStore";

/* Lego Components */
import { TextInput, Markdown, HorizontalField } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Relative Imports */
import PasswordInput from "./PasswordInput";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ChangePasswordInput, ChangePasswordMutation } from "@schema/types";
import { useTheme } from "@merchant/stores/ThemeStore";

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($curPassword: String!, $newPassword: String!) {
    currentUser {
      password {
        change(
          input: { curPassword: $curPassword, newPassword: $newPassword }
        ) {
          error
          passwordOk
        }
      }
    }
  }
`;

type ChangePasswordResponseType = {
  readonly currentUser: {
    readonly password: {
      readonly change: Pick<ChangePasswordMutation, "error" | "passwordOk">;
    };
  };
};

type Props = BaseProps & {
  readonly onCancel: () => unknown;
  readonly onNext: () => unknown;
};

const ChangePasswordScreen: React.FC<Props> = (props: Props) => {
  const { className, style, onCancel, onNext } = props;
  const styles = useStylesheet();
  const { client } = useApolloStore();
  const toastStore = useToastStore();
  const [password, setPassword] = useState<string | undefined>();
  const [passwordInvalid, setPasswordInvalid] = useState<boolean | undefined>();
  const [newPassword, setNewPassword] = useState<string | undefined>();
  const [newPasswordValid, setNewPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>();
  const passwordsMatchRaw =
    confirmPassword == undefined ? undefined : confirmPassword == newPassword;
  const [passwordsMatch, debouncerLoading] = useDebouncer(
    passwordsMatchRaw,
    500,
    {
      returnLoading: true,
    }
  );
  const [changePassword, { loading }] = useMutation<
    ChangePasswordResponseType,
    ChangePasswordInput
  >(CHANGE_PASSWORD, { client });

  const passwordRequirements = () => (
    <Markdown
      className={css(styles.markdown)}
      text={i`Passwords must be at least 8 characters.`}
    />
  );

  const onChangePassword = async () => {
    if (password == null || newPassword == null) {
      toastStore.negative(
        i`Please provide your current password and a new password`
      );
      return;
    }

    const { data } = await changePassword({
      variables: { curPassword: password, newPassword },
    });

    const passwordOk = data?.currentUser.password.change.passwordOk;
    if (!passwordOk) {
      setPasswordInvalid(true);
      return;
    }

    const error = data?.currentUser.password.change.error;
    if (error) {
      toastStore.negative(error);
      return;
    }

    // the password was changed
    onNext();
  };

  return (
    <>
      <div className={css(styles.root, className, style)}>
        <HorizontalField title={i`Current password`} centerTitleVertically>
          <PasswordInput
            className={css(styles.field)}
            password={password}
            setPassword={(password: string) => {
              setPassword(password);
              setPasswordInvalid(false);
            }}
            isIncorrect={passwordInvalid}
          />
        </HorizontalField>
        <HorizontalField
          title={i`New password`}
          popoverContent={passwordRequirements}
          popoverPosition={"right center"}
          centerTitleVertically
        >
          <NewPasswordInput
            className={css(styles.field)}
            password={newPassword}
            onPasswordChange={setNewPassword}
            onValidityChanged={setNewPasswordValid}
          />
        </HorizontalField>
        <HorizontalField title={i`Confirm new password`} centerTitleVertically>
          <TextInput
            className={css(styles.field)}
            type={"password"}
            onChange={({ text }) => {
              setConfirmPassword(text);
            }}
            validationResponse={
              passwordsMatch == false ? i`Passwords do not match` : null
            }
            renderBlankError
            loading={debouncerLoading}
          />
        </HorizontalField>
      </div>
      <div className={css(styles.buttonContainer)}>
        <Button className={css(styles.button)} onClick={onCancel}>
          Cancel
        </Button>
        <PrimaryButton
          popoverStyle={css(styles.button)}
          onClick={() => {
            onChangePassword();
          }}
          isDisabled={!(password && newPasswordValid && passwordsMatch)}
          isLoading={loading}
        >
          Next
        </PrimaryButton>
      </div>
    </>
  );
};

export default ChangePasswordScreen;

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
        markdown: {
          margin: "12px 21px",
        },
        field: {
          minWidth: 330, // eslint-disable-line local-rules/no-frozen-width
          marginTop: 22,
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
    [borderPrimaryDark]
  );
};
