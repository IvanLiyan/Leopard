import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { TextInput, Markdown, HorizontalField, Text } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { PhoneNumberField } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useTimer } from "@ContextLogic/lego/toolkit/hooks";
import AreaCodes from "@toolkit/area-codes";

/* Merchant API */
import { sendVerificationCode } from "@merchant/api/onboarding";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

export type PhoneNumberPageEnterNumberProps = BaseProps & {
  readonly countryCodeDomicile: CountryCode | null | undefined;
  readonly phoneNumber: string | null | undefined;
  readonly onPhoneNumber: (phoneNumber: string | null | undefined) => void;
  readonly phoneNumberValid: boolean;
  readonly onPhoneNumberValidityChanged: (isValid: boolean) => void;
  readonly verificationCode: string | null | undefined;
  readonly onVerificationCodeChange: (code: string) => void;
};

const PhoneNumberPageEnterNumber = (props: PhoneNumberPageEnterNumberProps) => {
  const {
    className,
    style,
    countryCodeDomicile,
    phoneNumber,
    onPhoneNumber,
    phoneNumberValid,
    onPhoneNumberValidityChanged,
    verificationCode,
    onVerificationCodeChange,
  } = props;
  const [countDownLeft, startCountDownTimer] = useTimer({
    periodMs: 60000,
    intervalMs: 1000,
    startNow: false,
  });

  const handleSendCode = async () => {
    if (!countryCodeDomicile) {
      return;
    }

    if (countDownLeft != 0) {
      return;
    }
    startCountDownTimer();

    const areaCode =
      AreaCodes[countryCodeDomicile.toUpperCase() as CountryCode];
    await sendVerificationCode({
      phoneNumber: phoneNumber || "",
      phoneNumberAreaCode: areaCode.toString() || "",
    }).call();

    const { toastStore } = AppStore.instance();
    toastStore.positive(i`Verification code is sent.`);
  };

  const styles = useStylesheet();

  const infoText =
    i`Providing a phone number consistent with your country/region of` +
    i` domicile further validates your store and helps us customize` +
    i` your merchant experience on Wish.`;

  return (
    <div className={css(styles.root, style, className)}>
      <Text weight="bold" className={css(styles.title)}>
        Add your phone number
      </Text>
      <div className={css(styles.content)}>
        Stay connected for updates about your store.
      </div>
      <HorizontalField
        className={css(styles.field)}
        title={() => (
          <div className={css(styles.fieldTitle, styles.fieldTitleMargin)}>
            Phone number
          </div>
        )}
        titleAlign="start"
        titleWidth={220}
      >
        <PhoneNumberField
          country={countryCodeDomicile || "CN"}
          countryFixed={!!countryCodeDomicile}
          onPhoneNumber={({ phoneNumber }) => onPhoneNumber(phoneNumber)}
          phoneNumber={phoneNumber}
          onValidityChanged={onPhoneNumberValidityChanged}
          showTitle={false}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={() => (
          <div className={css(styles.fieldTitle)}>Verify your phone number</div>
        )}
        titleAlign="start"
        titleWidth={220}
      >
        <div className={css(styles.column)}>
          <div className={css(styles.row)}>
            <TextInput
              className={css(styles.codeInput)}
              placeholder={i`Enter verification code`}
              value={verificationCode}
              onChange={({ text }) => onVerificationCodeChange(text)}
            />
            <PrimaryButton
              style={styles.codeButton}
              onClick={handleSendCode}
              isDisabled={countDownLeft != 0 || !phoneNumberValid}
            >
              <span>Send code</span>
              <span>{countDownLeft != 0 && ` (${countDownLeft / 1000}s)`}</span>
            </PrimaryButton>
          </div>
          <div className={css(styles.info)}>
            <Illustration
              className={css(styles.icon)}
              name="lightBulbBackgroundColorYellow"
              alt=""
            />
            <Markdown className={css(styles.infoText)} text={infoText} />
          </div>
        </div>
      </HorizontalField>
    </div>
  );
};

export default PhoneNumberPageEnterNumber;

const useStylesheet = () => {
  const { textBlack, textDark, pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        },
        title: {
          marginTop: 40,
          fontSize: 24,
          lineHeight: "32px",
          color: textBlack,
          textAlign: "center",
        },
        content: {
          marginTop: 16,
          color: textDark,
          textAlign: "center",
        },
        field: {
          marginTop: 40,
          maxWidth: 700,
          width: "100%",
        },
        fieldTitle: {
          lineHeight: "40px",
        },
        fieldTitleMargin: {
          marginTop: 25,
        },
        column: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
        },
        row: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "stretch",
        },
        codeInput: {
          flex: 1,
          marginRight: 16,
        },
        codeButton: {
          height: "100%",
          boxSizing: "border-box",
        },
        info: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: 16,
          marginTop: 16,
          backgroundColor: pageBackground,
        },
        icon: {
          width: 40,
        },
        infoText: {
          textAlign: "justify",
          marginLeft: 12,
          flex: 1,
          color: textBlack,
          fontSize: 14,
        },
      }),
    [textBlack, textDark, pageBackground]
  );
};
