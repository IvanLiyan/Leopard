import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import faker from "faker/locale/en";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { EmailInput } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { NoWishEmailsValidator } from "@toolkit/validators";

/* Merchant API */
import * as onboardingApi from "@merchant/api/onboarding";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

type AnotherEmailAddressProps = BaseProps & {
  readonly onEmailChanged: (newEmail: string) => unknown;
  readonly onGoBack: () => unknown;
};

const AnotherEmailAddress = (props: AnotherEmailAddressProps) => {
  const [userInputEmail, setUserInputEmail] = useState<string | null>(null);
  const [userEmailValid, setUserEmailValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { onEmailChanged, onGoBack, className, style: propStyle } = props;

  const sendEmail = async () => {
    setIsLoading(true);
    if (!userInputEmail || !userEmailValid) {
      setIsLoading(false);
      return;
    }

    const { toastStore } = AppStore.instance();
    try {
      await onboardingApi
        .sendConfirmEmail({
          email: userInputEmail,
          regenerate_code: true,
        })
        .call();
      onEmailChanged(userInputEmail);
      onGoBack();
    } catch (e) {
      toastStore.negative(e.msg);
    }
    setIsLoading(false);
  };

  const styles = useStylesheets();
  return (
    <div className={css(styles.root, propStyle, className)}>
      <div className={css(styles.backButtonLine)}>
        <SecondaryButton
          style={styles.backButton}
          onClick={onGoBack}
          type="default"
          border=""
        >
          <Icon name="arrowLeft" />
        </SecondaryButton>
      </div>
      <Text weight="bold" className={css(styles.title)}>
        What's your email?
      </Text>
      <div className={css(styles.text)}>
        Enter your email address for verification
      </div>
      <div className={css(styles.fields)}>
        <EmailInput
          className={css(styles.input)}
          placeholder={i`Enter your email address`}
          onChange={({ text }) => setUserInputEmail(text)}
          onValidityChanged={(isValid) => setUserEmailValid(isValid)}
          validators={[new NoWishEmailsValidator()]}
          showErrorMessages={false}
          value={userInputEmail}
          debugValue={faker.internet.email()}
        />
        <PrimaryButton
          isDisabled={!userInputEmail || !userEmailValid}
          style={styles.button}
          onClick={sendEmail}
          isLoading={isLoading}
        >
          Send email
        </PrimaryButton>
      </div>
    </div>
  );
};

export default AnotherEmailAddress;

const useStylesheets = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          textAlign: "center",
          fontSize: 16,
          padding: "10px 10px 80px 10px",
        },
        backButtonLine: {
          alignSelf: "stretch",
          display: "flex",
          justifyContent: "flex-start",
        },
        backButton: {
          padding: 7,
        },
        title: {
          marginTop: 42,
          fontSize: 24,
          lineHeight: 1.5,
          color: palettes.textColors.DarkInk,
        },
        text: {
          marginTop: 24,
          lineHeight: "24px",
        },
        fields: {
          width: "100%",
          maxWidth: 260,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
        },
        input: {
          marginTop: 16,
        },
        button: {
          marginTop: 16,
          boxSizing: "border-box",
        },
      }),
    []
  );
};
