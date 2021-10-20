/*
 * CodeContent.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/29/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import moment from "moment/moment";

/* Legacy Toolkit */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { weightMedium } from "@toolkit/fonts";

/* Lego Components */
import { Markdown, TextInput, PrimaryButton } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { Button } from "@ContextLogic/lego";

/* Relative Imports */
import CodeInput from "./code-input/CodeInput";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";
import { formatDatetimeLocalized } from "@toolkit/datetime";

type Props = BaseProps & {
  readonly onCancel: () => unknown;
  readonly onNext: (code: string) => unknown;
  readonly infoText: string;
  readonly nextText: string;
  readonly codeInvalid: boolean | undefined;
  readonly setCodeInvalid: (isValid: boolean) => unknown;
  readonly isLoading: boolean;
  readonly sendCode: (force?: "FORCE") => unknown;
  readonly isSendingCode: boolean;
  readonly countDown: number;
  readonly hasTfaBackupCodes: boolean;
};

type Mode = "STANDARD" | "BACKUP";

const CodeContent: React.FC<Props> = (props: Props) => {
  const CODE_LENGTH = 6;

  const {
    onCancel,
    onNext,
    infoText,
    nextText,
    codeInvalid,
    setCodeInvalid,
    isLoading,
    countDown,
    sendCode,
    isSendingCode,
    hasTfaBackupCodes,
  } = props;
  const styles = useStylesheet();
  const { primary } = useTheme();
  const [mode, setModeRaw] = useState<Mode>("STANDARD");
  const [code, setCodeRaw] = useState<string | undefined>();
  const codeFull =
    (code || "").length >= (mode == "STANDARD" ? CODE_LENGTH : 1);
  const setCode = (code: string | undefined) => {
    setCodeInvalid(false);
    setCodeRaw(code);
  };
  const setMode = (mode: Mode) => {
    setCode(undefined);
    setCodeInvalid(false);
    setModeRaw(mode);
  };
  const canResend = countDown == 0;
  const countDownFormated = ` ${formatDatetimeLocalized(
    moment.utc(countDown),
    "mm:ss",
  )}`;

  const resendCodeText = ci18n(
    "referring to a two factor authentication code",
    "Resend code",
  );
  const standardActionText = ci18n(
    "referring to a two factor authentication code",
    "**Please enter the 6-digit verification code**",
  );
  const backupActionText = ci18n(
    "referring to a two factor authentication backup code previously saved by the merchant",
    "**Please enter one of your %1$d-digit backup codes**",
    10,
  );

  const didntReceiveText = ci18n(
    "referring to a two factor authentication code sent to the merchant's device",
    "Didn't receive your code? Use one of your [backup codes](#)",
  );
  const textInsteadText = ci18n(
    "gives the user an option to text themselves a two-factor verification code instead of using a backup code",
    "Don't have a backup code? [Send verification code to your device](#)",
  );
  const invalidCodeText = codeInvalid
    ? ci18n(
        "referring to a two factor authentication code",
        "Your verification code is incorrect.",
      )
    : "";

  const codeSentDescription = () => {
    if (canResend) {
      return null;
    }

    const codeSentTitle = ci18n(
      "referring to a two factor authentication code sent to the merchant's device",
      "**Verification code has sent!**",
    );
    const codeSentText = ci18n(
      "referring to a two factor authentication code sent to the merchant's device",
      "You may resend the code again in %1$s",
      countDownFormated,
    );

    return (
      <div className={css(styles.codeSentDescription)}>
        <Markdown text={codeSentTitle} />
        <Markdown text={codeSentText} />
      </div>
    );
  };

  const codeContent =
    mode == "STANDARD" ? (
      <>
        <div className={css(styles.codeContainer)}>
          <Markdown
            className={css(styles.codeDescription)}
            text={standardActionText}
          />
          <CodeInput
            className={css(styles.codeInput)}
            elementClassName={css(
              codeInvalid && styles.invalidCodeInputElement,
            )}
            numCharacters={CODE_LENGTH}
            value={code}
            onChange={setCode}
          />
          <Popover popoverContent={codeSentDescription}>
            <Button
              style={styles.resendButton}
              onClick={sendCode}
              disabled={isSendingCode || !canResend}
              borderColor={primary}
            >
              <Markdown
                text={`**${resendCodeText}${
                  canResend ? "" : countDownFormated
                }**`}
              />
            </Button>
          </Popover>
          <div className={css(styles.invalidCodeText)}>{invalidCodeText}</div>
          {hasTfaBackupCodes && (
            <div
              onClick={() => {
                setMode("BACKUP");
              }}
            >
              <Markdown text={didntReceiveText} />
            </div>
          )}
        </div>
      </>
    ) : (
      <>
        <div className={css(styles.codeContainer)}>
          <Markdown style={{ maxWidth: 380 }} text={backupActionText} />
          <TextInput
            inputContainerStyle={css(styles.backupCodeInput)}
            value={code}
            onChange={({ text }) => {
              setCode(text);
            }}
            validationResponse={codeInvalid ? invalidCodeText : undefined}
            renderBlankError
          />
          <div
            onClick={() => {
              setMode("STANDARD");
            }}
          >
            <Markdown text={textInsteadText} />
          </div>
        </div>
      </>
    );

  return (
    <>
      <div className={css(styles.root)}>
        <Markdown openLinksInNewTab text={infoText} />
        {codeContent}
      </div>
      <div className={css(styles.buttonContainer)}>
        <Button className={css(styles.button)} onClick={onCancel}>
          Cancel
        </Button>
        <PrimaryButton
          popoverStyle={css(styles.button)}
          onClick={() => {
            if (code != null) {
              onNext(code);
            }
          }}
          isDisabled={!codeFull}
          isLoading={isLoading}
        >
          {nextText}
        </PrimaryButton>
      </div>
    </>
  );
};

export default CodeContent;

const useStylesheet = () => {
  const { primary, surfaceDark, negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: 314,
          padding: "0px 72px",
        },
        codeSentDescription: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 10,
          maxWidth: 200,
        },
        codeContainer: {
          height: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        },
        codeDescription: {
          marginTop: 30,
        },
        codeInput: {
          marginTop: 20,
        },
        backupCodeInput: {
          marginTop: 30,
          minWidth: 330, // eslint-disable-line local-rules/no-frozen-width
        },
        invalidCodeInputElement: {
          borderColor: negative,
          ":focus": {
            borderColor: negative,
          },
        },
        invalidCodeText: {
          color: negative,
          fontSize: 12,
          fontWeight: weightMedium,
          marginTop: 3,
          minHeight: 27,
        },
        smallText: {
          color: primary,
          fontSize: 12,
        },
        smallTextHover: {
          transition: "opacity 0.3s linear",
          ":hover": {
            opacity: 0.6,
          },
        },
        buttonContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 24,
          borderTop: `1px solid ${surfaceDark}`,
        },
        button: {
          minWidth: 160,
        },
        resendButton: {
          minWidth: 160,
          marginTop: 10,
          marginBottom: 10,
          color: primary,
        },
      }),
    [primary, surfaceDark, negative],
  );
};
