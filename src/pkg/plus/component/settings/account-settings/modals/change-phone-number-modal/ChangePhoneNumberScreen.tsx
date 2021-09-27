import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Legacy Toolkit */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { CountryCode } from "@toolkit/countries";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Popover, PhoneNumberField } from "@merchant/component/core";

/* Merchant Plus Components */
import HorizontalField from "@plus/component/form/HorizontalField";

import { PhoneNumberUtil } from "google-libphonenumber";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly onCancel: () => unknown;
  readonly sendVerificationCode: () => Promise<unknown>;
  readonly currentPhoneNumber: string;
  readonly setNewPhoneNumber: (number: string) => unknown;
  readonly interselectablePhoneCountryCodes: ReadonlyArray<CountryCode>;
};

const ChangePhoneNumberScreen: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    onCancel,
    currentPhoneNumber,
    setNewPhoneNumber,
    sendVerificationCode,
    interselectablePhoneCountryCodes,
  } = props;
  const styles = useStylesheet();

  const phoneUtil = PhoneNumberUtil.getInstance();
  const number = phoneUtil.parseAndKeepRawInput(currentPhoneNumber);
  const phoneNumber = number.getNationalNumber()?.toString();
  const phoneNumberCC = phoneUtil.getRegionCodeForNumber(number) as
    | CountryCode
    | undefined;

  const isInterselectablePhoneCountry =
    phoneNumberCC != null &&
    new Set(interselectablePhoneCountryCodes).has(phoneNumberCC as CountryCode);

  const [newPhoneNumberCC, setNewPhoneNumberCC] = useState<
    CountryCode | undefined
  >(phoneNumberCC);
  const [newPhoneNumberValid, setNewPhoneNumberValid] = useState(false);

  const headerText = ci18n(
    "referring to a phone number",
    "Enter a mobile phone number you would like authentication codes to be sent to each time you log in"
  );

  const phoneNumberDesc = ci18n(
    "Tells the user that the phone number country cannot be altered",
    "The new phone number must be within the same country you signed up your merchant account for. For further assistance, please contact your account manager at [merchant_support@wish.com](mailto:merchant_support@wish.com)"
  );

  return (
    <>
      <div className={css(styles.root, className, style)}>
        <Markdown className={css(styles.header)} text={headerText} />
        <HorizontalField
          className={css(styles.row)}
          title={i`Current Phone Number`}
          centerTitleVertically
        >
          <PhoneNumberField
            className={css(styles.field)}
            showTitle={false}
            countryFixed
            disabled
            country={phoneNumberCC || "US"}
            phoneNumber={phoneNumber}
          />
        </HorizontalField>
        <HorizontalField
          className={css(styles.row)}
          title={i`New Phone Number`}
          centerTitleVertically
        >
          {!isInterselectablePhoneCountry && (
            <Popover
              position="top center"
              popoverContent={phoneNumberDesc}
              popoverMaxWidth={260}
            >
              <PhoneNumberField
                className={css(styles.field)}
                showTitle={false}
                country={phoneNumberCC}
                countryFixed
                onValidityChanged={(isValid) => setNewPhoneNumberValid(isValid)}
                onPhoneNumber={({ country, areaCode, phoneNumber }) => {
                  const fullNumber = "+" + areaCode + phoneNumber;
                  setNewPhoneNumber(fullNumber);
                }}
              />
            </Popover>
          )}

          {isInterselectablePhoneCountry && (
            <PhoneNumberField
              className={css(styles.field)}
              showTitle={false}
              country={newPhoneNumberCC}
              countryOptions={interselectablePhoneCountryCodes}
              onValidityChanged={(isValid) => setNewPhoneNumberValid(isValid)}
              onPhoneNumber={({ country, areaCode, phoneNumber }) => {
                const fullNumber = "+" + areaCode + phoneNumber;
                setNewPhoneNumberCC(country as CountryCode | undefined);
                setNewPhoneNumber(fullNumber);
              }}
            />
          )}
        </HorizontalField>
      </div>
      <div className={css(styles.buttonContainer)}>
        <Button className={css(styles.button)} onClick={onCancel}>
          Cancel
        </Button>
        <PrimaryButton
          onClick={sendVerificationCode}
          isDisabled={!newPhoneNumberValid}
        >
          Next
        </PrimaryButton>
      </div>
    </>
  );
};

export default ChangePhoneNumberScreen;

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
          margin: 10,
          textAlign: "center",
        },
        row: {
          marginTop: 20,
        },
        field: {
          minWidth: 330, // eslint-disable-line local-rules/no-frozen-width
          marginBottom: 5,
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
