import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";
import { EmailInput, TextInput } from "@ContextLogic/lego";

import { PasswordInput } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { black } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { BaseSectionProps } from "./SectionWrapper";

const AccountSection = (props: BaseSectionProps) => {
  const styles = useStylesheet();
  const { state, className } = props;
  const { requiredValidator, confirmPwdValidator } = state;

  return (
    <div className={css(className)}>
      <div className={css(styles.subtitle)}>
        These will be your login credentials.
      </div>
      <HorizontalField
        className={css(styles.field)}
        title={i`Username`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <TextInput
          className={css(styles.textInput)}
          value={state.username}
          onChange={({ text }) => {
            state.username = text;
          }}
          validators={[requiredValidator]}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`Email`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <EmailInput
          className={css(styles.textInput)}
          value={state.email}
          onChange={({ text }) => {
            state.email = text;
          }}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`Password`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <PasswordInput
          className={css(styles.textInput)}
          password={state.password}
          onPasswordChange={(text) => {
            state.password = text;
          }}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`Confirm Password`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <TextInput
          type="password"
          className={css(styles.textInput)}
          value={state.confirmPassword}
          onChange={({ text }) => {
            state.confirmPassword = text;
          }}
          validators={[requiredValidator, confirmPwdValidator]}
        />
      </HorizontalField>
    </div>
  );
};
export default observer(AccountSection);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        field: {
          marginTop: 24,
        },
        textInput: {
          flex: 1,
          maxWidth: 648,
        },
        subtitle: {
          fontSize: 16,
          color: black,
          paddingTop: 16,
        },
      }),
    [],
  );
