/*
 * PasswordInput.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 6/02/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightSemibold } from "@toolkit/fonts";

/* Merchant Components */
import { Link } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { TextInputProps } from "@ContextLogic/lego";
import { useTheme } from "@stores/ThemeStore";

export type PasswordInputProps = Omit<
  TextInputProps,
  | "showErrorMessages"
  | "type"
  | "value"
  | "onChange"
  | "validators"
  | "passValidity"
  | "validationResponse"
> & {
  readonly password: string | null | undefined;
  readonly setPassword: (newPassword: string) => unknown;
  readonly isIncorrect?: boolean;
};

const PasswordInput: React.FC<PasswordInputProps> = (
  props: PasswordInputProps,
) => {
  const {
    className,
    style,
    password,
    setPassword,
    isIncorrect = false,
    ...remainingProps
  } = props;
  const styles = useStylesheet();
  const isBlank =
    password !== null && password !== undefined && password.length == 0;
  let errorMessage = null;
  if (isBlank) errorMessage = i`Password is required`;
  else if (isIncorrect) errorMessage = i`Password is incorrect.`;

  return (
    <div className={css(className, style)}>
      <TextInput
        showErrorMessages={false}
        type={"password"}
        value={password}
        onChange={({ text }) => {
          setPassword(text);
        }}
        validationResponse={errorMessage}
        {...remainingProps}
      />
      <div className={css(styles.bottom)}>
        <div className={css(styles.errorText)}>{errorMessage}</div>
        <Link className={css(styles.forgotPassword)}>Forgot password?</Link>
      </div>
    </div>
  );
};

export default PasswordInput;

const useStylesheet = () => {
  const { negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        bottom: {
          marginTop: 7,
          display: "flex",
          justifyContent: "space-between",
        },
        // taken from @ContextLogic/lego/form/TextInput.tsx
        errorText: {
          fontSize: 12,
          fontWeight: weightSemibold,
          lineHeight: 1.33,
          color: negative,
          textAlign: "left",
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
        forgotPassword: {
          fontSize: 12,
          fontWeight: weightSemibold,
          lineHeight: 1.33,
          textAlign: "right",
        },
      }),
    [negative],
  );
};
