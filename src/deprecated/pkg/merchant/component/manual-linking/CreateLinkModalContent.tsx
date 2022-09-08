import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Toolkit */
import { css } from "@toolkit/styling";

/* Lego Toolkit */
import { Field, Layout, Markdown, Text, TextInput } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTimer } from "@ContextLogic/lego/toolkit/hooks";

/* Model */
import CreateLinkState from "@merchant/model/manual-linking/CreateLinkState";

/* Component */
import PasswordField from "@merchant/component/core/PasswordField";
import BackupCodeSection from "@merchant/component/manual-linking/BackupCodeSection";

import Link from "@next-toolkit/Link";

type InitialProps = BaseProps & {
  readonly editState: CreateLinkState;
};

/**
 * Manual linking create link modal content - create linking in two steps:
 *  1. authenticate linked store's credentials
 *  2. verify code and complete linking flow
 */
const CreateLinkModalContent: React.FC<InitialProps> = ({
  style,
  className,
  editState,
}) => {
  const styles = useStylesheet();
  const [showBackupCode, setShowBackupCode] = useState<boolean>(false);

  const {
    currentStep,
    merchant,
    password,
    verificationCode,
    isAuthenticating,
    isVerifying,
    obfuscatedPhoneNumber,
    sendPhoneCall,
    supportVerificationCode,
  } = editState;

  const verifyTitle = sendPhoneCall
    ? i`A call is being made to ${obfuscatedPhoneNumber}`
    : i`A text message with a verification code was just sent to ${obfuscatedPhoneNumber}`;

  // initialize countdown timer for resending verification code
  const [countDownLeft, startCountDownTimer] = useTimer({
    periodMs: 60000,
    intervalMs: 1000,
    startNow: false,
  });

  // handle resending verification code
  const handleResendCode = async (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    // determine which code delivery method is clicked
    const sendPhoneCall = (event.target as HTMLAnchorElement).hash === "#call";
    editState.sendPhoneCall = sendPhoneCall;

    // authenticate and send code
    await editState.authenticateLinking();

    // start timer if verification code is sent
    if (editState.isVerificaitonCodeSent) {
      startCountDownTimer();
    }
  };

  const renderAuthenticationStep = () => {
    return (
      <Layout.FlexColumn style={[styles.root, className, style]}>
        <Text style={styles.title}>
          Enter the login credentials for the store you would like to link
        </Text>
        <Field title={i`Email address or username`}>
          <TextInput
            value={merchant}
            onChange={({ text }) => {
              editState.merchant = text;
            }}
            placeholder={i`Email address or username`}
            disabled={isAuthenticating}
          />
        </Field>
        <PasswordField
          type="CURRENT"
          placeholder={i`Password`}
          password={password}
          disabled={isAuthenticating}
          onPasswordChange={(text) => {
            editState.password = text;
          }}
        />
      </Layout.FlexColumn>
    );
  };

  const renderVerificationStep = () => {
    return (
      <Layout.FlexColumn style={[styles.root, className, style]}>
        <Text style={styles.title}>{verifyTitle}</Text>
        <Field title={i`Enter code`}>
          <TextInput
            value={verificationCode || ""}
            onChange={({ text }) => {
              editState.verificationCode = text;
            }}
            disabled={isVerifying}
          />
        </Field>
        <div className={css(styles.verifyCodeMessage)}>
          <Markdown
            text={
              countDownLeft === 0
                ? i`Haven't received the code? [Resend code](${"#sms"}) or [receive a phone call](${"#call"})`
                : i`Haven't received the code? Try again in ${
                    countDownLeft / 1000
                  }s`
            }
            onLinkClicked={handleResendCode}
            style={styles.resendCodePrompt}
          />
          {showBackupCode ? (
            <BackupCodeSection
              supportVerificationCode={supportVerificationCode}
            />
          ) : (
            <Link onClick={() => setShowBackupCode(true)}>
              Unable to receive your code?
            </Link>
          )}
        </div>
      </Layout.FlexColumn>
    );
  };

  return currentStep === "AUTHENTICATE"
    ? renderAuthenticationStep()
    : renderVerificationStep();
};

const useStylesheet = () => {
  const { textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 24,
          gap: 24,
        },
        title: {
          fontSize: 16,
          color: textDark,
          alignSelf: "center",
        },
        verifyCodeMessage: {
          fontSize: 16,
          color: textBlack,
        },
        resendCodePrompt: {
          marginBottom: 8,
        },
      }),
    [textDark, textBlack]
  );
};

export default observer(CreateLinkModalContent);
