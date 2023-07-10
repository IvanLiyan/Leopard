/*
 * component/form/PasswordInput.tsx
 * Project-Lego
 *
 * This component wraps text input with validation for new passwords.
 * It should not be used when requesting the current password.
 *
 * Created by Lucas Liepert on 6/02/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import pick from "lodash/pick";

/* Lego Components */
import { TextInput, TextInputProps } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { useLogger } from "@core/toolkit/logger";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import { weightSemibold } from "@core/toolkit/fonts";

import { useTheme } from "@core/stores/ThemeStore";
import { useApolloStore } from "@core/stores/ApolloStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  PasswordEvaluation,
  AuthenticationServiceSchemaPasswordEvaluationArgs,
} from "@schema";

const CHECK_PASSWORD_STRENGTH = gql`
  query PasswordInput_CheckPasswordStrength($password: String!) {
    authentication {
      passwordEvaluation(password: $password) {
        valid
        errorMessage
      }
    }
  }
`;

type CheckPasswordStrengthInput = {
  readonly password: AuthenticationServiceSchemaPasswordEvaluationArgs["password"];
};

type CheckPasswordStrengthResponseType = {
  readonly authentication: {
    readonly passwordEvaluation: Pick<
      PasswordEvaluation,
      "valid" | "errorMessage"
    >;
  };
};

export type PasswordInputProps = BaseProps &
  Omit<
    TextInputProps,
    | "type"
    | "showErrorMessages"
    | "onChange"
    | "validationResponse"
    | "loading"
    | "onValidityChanged"
    | "forceValidation"
  > & {
    readonly password?: string | null | undefined;
    readonly onPasswordChange?: (newPassword: string) => unknown;
    readonly onValidityChanged?: (
      isValid: boolean,
      errorMessage?: string | null,
    ) => unknown;
    readonly passwordVisible?: boolean;
    readonly forceValidation?: boolean;
  };

const PasswordInput = (props: PasswordInputProps) => {
  const {
    className,
    style,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    children,
    password,
    onPasswordChange = () => undefined,
    onValidityChanged = () => undefined,
    passwordVisible = false,
    forceValidation = false,
    ...textInputProps
  } = props;
  const [numAttempts, setNumAttempts] = useState(0);
  const styles = useStylesheet();
  const failedPasswordAttemptLogger = useLogger(
    "MERCHANT_FAILED_PASSWORD_ATTEMPTS",
  );
  const debouncedPassword = useDebouncer(password, 500);
  const { client } = useApolloStore();
  const { data, loading } = useQuery<
    CheckPasswordStrengthResponseType,
    CheckPasswordStrengthInput
  >(CHECK_PASSWORD_STRENGTH, {
    client,
    variables: {
      password: debouncedPassword || "",
    },
    skip: debouncedPassword == null || debouncedPassword.length == 0,
  });
  const passwordEvaluation = data?.authentication.passwordEvaluation;
  const passwordValid = passwordEvaluation?.valid;
  useEffect(() => {
    if (debouncedPassword == null || debouncedPassword.trim().length == 0) {
      return;
    }
    setNumAttempts((numAttempts) => numAttempts + 1);
  }, [passwordEvaluation, debouncedPassword]);

  useEffect(() => {
    if (numAttempts == 0 || passwordValid) {
      return;
    }

    failedPasswordAttemptLogger.info({
      numAttempts,
      version: "2",
    });
  }, [numAttempts, failedPasswordAttemptLogger, passwordValid]);

  let error: string | null | undefined = null;
  if (
    (debouncedPassword && debouncedPassword.length == 0) ||
    (debouncedPassword == null && forceValidation)
  ) {
    error = i`This field is required`;
  } else {
    error = passwordEvaluation?.errorMessage;
  }

  useEffect(() => {
    onValidityChanged(error == null, error);
  }, [error, onValidityChanged]);

  let bottom;
  if (error) {
    bottom = (
      <div className={css(styles.errorText, styles.bottom)}>{error}</div>
    );
  }

  return (
    <div className={css(className, style)}>
      <TextInput
        type={passwordVisible ? "text" : "password"}
        showErrorMessages={false}
        onChange={({ text }) => {
          onPasswordChange(text);
        }}
        validationResponse={error}
        loading={loading || debouncedPassword !== password} // don't wait for the debouncer to send the query
        autoComplete="new-password"
        {...textInputProps}
      />
      {bottom}
    </div>
  );
};

PasswordInput.propDoc = {
  ...pick(TextInput.propDoc, [
    "disabled",
    "placeholder",
    "height",
    "debugValue",
  ]),
  password: {
    required: false,
    defaultValue: "null",
    type: "string",
    description: "Value of the input (should correspond to onPasswordChange)", // eslint-disable-line local-rules/unwrapped-i18n
  },
  onPasswordChange: {
    required: false,
    defaultValue: "() => undefined",
    type: "(newPassword: string) => unknown",
    description: "Function called when the password is changed", // eslint-disable-line local-rules/unwrapped-i18n
  },
  onValidityChanged: {
    required: false,
    defaultValue: "() => undefined",
    type: "(isValid: boolean,errorMessage?: string | null) => unknown",
    description: "Function called when the validity of the password changes", // eslint-disable-line local-rules/unwrapped-i18n
  },
  passwordVisible: {
    required: false,
    defaultValue: "false",
    type: "boolean",
    description:
      "Controls whether the password should be displayed in plain-text or *s", // eslint-disable-line local-rules/unwrapped-i18n
  },
};

export default observer(PasswordInput);

const useStylesheet = () => {
  const { textDark, borderPrimaryDark, negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        strengthContainer: {
          display: "flex",
          justifyContent: "space-between",
          color: textDark,
          flexDirection: "row",
          alignItems: "center",
        },
        strengthIndicator: {
          flex: 1,
          marginLeft: 65,
        },
        bottom: {
          marginTop: 7,
          minHeight: 15,
          fontSize: 12,
          lineHeight: 1.33,
        },
        // taken from @ContextLogic/lego/form/TextInput.tsx
        errorText: {
          fontWeight: weightSemibold,
          color: negative,
          animationName: [
            {
              from: {
                transform: "translateY(-5px)",
                opacity: 0,
              },

              to: {
                transform: "translate(-5px)",
                opacity: 1,
              },
            },
          ],
          animationDuration: "300ms",
          cursor: "default",
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
    [textDark, borderPrimaryDark, negative],
  );
};
