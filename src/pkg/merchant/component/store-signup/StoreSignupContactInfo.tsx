/* eslint no-empty: 0 */
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";
import { PhoneNumberUtil } from "google-libphonenumber";
import faker from "faker/locale/en";

/* Lego Components */
import {
  Card,
  PrimaryButton,
  Field,
  TextInput,
  TextInputProps,
} from "@ContextLogic/lego";
import { PhoneNumberField } from "@merchant/component/core";
import { Illustration } from "@merchant/component/core";
import { StateField, CountrySelect } from "@merchant/component/core";

/* Merchant Components */
import SignupTOSText from "@merchant/component/signup/SignupTOSText";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import CountryNames from "@toolkit/countries";
import { CountryCode } from "@toolkit/countries";

import {
  RequiredValidator,
  USZipcodeOnlyValidator,
  CNZipcodeOnlyValidator,
  ChineseOnlyValidator,
} from "@toolkit/validators";

import { CountryType } from "@merchant/component/core/CountrySelect";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import LocalizationStore from "@merchant/stores/LocalizationStore";
import UserStore from "@merchant/stores/UserStore";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { useTheme } from "@merchant/stores/ThemeStore";
import { weightBold, weightMedium } from "@toolkit/fonts";

type StoreSignupContactInfoProps = BaseProps & {
  readonly showCNOptions?: boolean;
  readonly interselectablePhoneCountryCodes?:
    | ReadonlyArray<CountryCode>
    | null
    | undefined;
};

const FieldHeight = 40;

const StoreSignupContactInfo: React.FC<StoreSignupContactInfoProps> = (
  props: StoreSignupContactInfoProps
) => {
  const { className, style, interselectablePhoneCountryCodes } = props;
  const styles = useStylesheet();

  const [isLoading, setIsLoading] = useState(false);

  const [stateName, setStateName] = useState<string | null | undefined>();

  const [firstName, setFirstName] = useState<string | null | undefined>();
  const [isValidFirstName, setIsValidFirstName] = useState(false);

  const [lastName, setLastName] = useState<string | null | undefined>();
  const [isValidLastName, setIsValidLastName] = useState(false);

  const [streetAddress1, setStreetAddress1] = useState<
    string | null | undefined
  >();
  const [isValidStreetAddress1, setIsValidStreetAddress1] = useState(false);

  const [streetAddress2, setStreetAddress2] = useState<
    string | null | undefined
  >();

  const [city, setCity] = useState<string | null | undefined>();
  const [isValidCity, setIsValidCity] = useState(false);

  const [postalCode, setPostalCode] = useState<string | null | undefined>();
  const [isValidPostalCode, setIsValidPostalCode] = useState(false);

  const [countryCode, setCountryCode] = useState<
    CountryCode | null | undefined
  >();

  const [phoneNumberCC, setPhoneNumberCC] = useState<
    CountryCode | null | undefined
  >();
  const [, setPhoneNumberAreaCode] = useState<string | null | undefined>();
  const [phoneNumber, setPhoneNumber] = useState<string | null | undefined>();
  const [
    isInterselectablePhoneCountry,
    setIsInterselectablePhoneCountry,
  ] = useState(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);

  const [
    interselectablePhoneCountryCodeSet,
    setInterselectablePhoneCountryCodeSet,
  ] = useState<Set<CountryCode> | null | undefined>();

  useEffect(() => {
    setInterselectablePhoneCountryCodeSet(
      interselectablePhoneCountryCodes != null
        ? new Set(interselectablePhoneCountryCodes)
        : undefined
    );

    const { loggedInMerchantUser: merchant } = UserStore.instance();

    if (merchant.business_address) {
      setStreetAddress1(merchant.business_address.street_address1);
      setStreetAddress2(merchant.business_address.street_address2);
      setCity(merchant.business_address.city);
      setPostalCode(merchant.business_address.zipcode);
      setStateName(merchant.business_address.state);
      setCountryCode(merchant.business_address.country_code);
    }

    try {
      const phoneUtil = PhoneNumberUtil.getInstance();
      const number = phoneUtil.parseAndKeepRawInput(merchant.phone_number);
      setPhoneNumber(number.getNationalNumber()?.toString());
      setPhoneNumberAreaCode(number.getCountryCode()?.toString());
      setPhoneNumberCC(
        phoneUtil.getRegionCodeForNumber(number) as CountryCode | undefined
      );
    } catch (e) {
      // Default to US calling code if error
      setPhoneNumberAreaCode("1");
      setPhoneNumber(merchant.phone_number);
      setPhoneNumberCC(countryCode);
    }

    setFirstName(merchant.first_name);
    setLastName(merchant.last_name);
  }, [interselectablePhoneCountryCodes, countryCode]);

  const resetNamesIfNotChinese = () => {
    if (phoneNumberCC != "CN") {
      return;
    }

    const cnPattern = /^[\u4E00-\u9FA5]+$/;

    if (firstName && !cnPattern.test(firstName.trim())) {
      setFirstName(null);
    }
    if (lastName && !cnPattern.test(lastName.trim())) {
      setLastName(null);
    }
  };

  const onCountry = (countryCode: CountryCode | undefined) => {
    if (countryCode != null && countryCode != countryCode) {
      setCity(null);
      setStateName(null);
      setPostalCode(null);
    }

    setCountryCode(countryCode);
    setPhoneNumberCC(countryCode);
    setIsInterselectablePhoneCountry(
      interselectablePhoneCountryCodeSet != null
        ? interselectablePhoneCountryCodeSet.has(countryCode as CountryCode)
        : false
    );

    resetNamesIfNotChinese();
  };

  const onPhoneNumber = (params: {
    country: CountryCode;
    areaCode: string;
    phoneNumber: string;
  }) => {
    const { country, areaCode, phoneNumber } = params;
    setPhoneNumberCC(country);
    setPhoneNumber(phoneNumber);
    setPhoneNumberAreaCode(areaCode);

    resetNamesIfNotChinese();
  };

  const onSubmitClicked = async () => {
    setIsLoading(true);
    // GQL call here
    setIsLoading(false);
  };

  const readyToSubmit =
    _.isEmpty(stateName) === false &&
    isValidFirstName &&
    isValidLastName &&
    isValidStreetAddress1 &&
    isValidCity &&
    isValidPostalCode &&
    countryCode != null &&
    isValidPhoneNumber;

  const requiredValidator = new RequiredValidator();

  const zipcodeValidators = (): TextInputProps["validators"] => {
    if (countryCode === "US") {
      return [requiredValidator, new USZipcodeOnlyValidator()];
    } else if (countryCode === "CN") {
      return [requiredValidator, new CNZipcodeOnlyValidator()];
    }

    return [requiredValidator];
  };

  const nameValidators = (): TextInputProps["validators"] => {
    if (phoneNumberCC === "CN") {
      return [requiredValidator, new ChineseOnlyValidator()];
    }
    return [requiredValidator];
  };

  const countryOptions = (): ReadonlyArray<CountryType> => {
    let countryCodes: CountryCode[] = [];
    let topCountries: CountryCode[] = [
      "US",
      "DE",
      "FR",
      "BR",
      "CA",
      "GB",
      "ES",
    ];

    topCountries = ["CN", ...topCountries];

    const remainingCountryCodes: CountryCode[] = (Object.keys(
      CountryNames
    ) as CountryCode[]).filter((cc) => !topCountries.includes(cc));

    const { countryCodeByIp } = AppStore.instance();
    const { locale } = LocalizationStore.instance();

    // sort the country in current locale
    const compareFn = new Intl.Collator(locale, { sensitivity: "base" })
      .compare;
    const countryCompareFn = (code1: CountryCode, code2: CountryCode) => {
      const name1 = CountryNames[code1];
      const name2 = CountryNames[code2];
      return compareFn(name1, name2);
    };
    remainingCountryCodes.sort(countryCompareFn);

    countryCodes = [...topCountries, ...remainingCountryCodes];

    // put current country on top
    if (countryCodeByIp && countryCodes.includes(countryCodeByIp)) {
      countryCodes = countryCodes.filter((cc) => cc != countryCodeByIp);
      countryCodes = [countryCodeByIp, ...countryCodes];
    }

    return countryCodes.map(
      (countryCode: CountryCode): CountryType => {
        const countryName = CountryNames[countryCode];
        return {
          name: countryName,
          cc: countryCode,
        };
      }
    );
  };

  const isPreorderMerchant = () => {
    const {
      loggedInMerchantUser: { utm_source: source },
    } = UserStore.instance();
    return source === "preorder_email";
  };

  return (
    <Card className={css(className, style)}>
      <div className={css(styles.root)}>
        <section className={css(styles.title)}>
          Add your contact information
        </section>
        <div className={css(styles.content)}>
          <div className={css(styles.sideBySide)}>
            <Field className={css(styles.field)} title={i`First Name`}>
              <TextInput
                placeholder={i`Enter your first name`}
                focusOnMount
                onChange={({ text }) => setFirstName(text)}
                disabled={isLoading}
                height={FieldHeight}
                value={firstName}
                validators={nameValidators()}
                onValidityChanged={(isValid) => setIsValidFirstName(isValid)}
                debugValue={faker.name.firstName()}
              />
            </Field>
            <Field className={css(styles.field)} title={i`Last Name`}>
              <TextInput
                placeholder={i`Enter your last name`}
                onChange={({ text }) => setLastName(text)}
                disabled={isLoading}
                value={lastName}
                height={FieldHeight}
                validators={nameValidators()}
                onValidityChanged={(isValid) => setIsValidLastName(isValid)}
                debugValue={faker.name.lastName()}
              />
            </Field>
          </div>
          <Field
            className={css(styles.field)}
            title={i`Business Street Address`}
          >
            <TextInput
              placeholder={i`Street address 1`}
              onChange={({ text }) => setStreetAddress1(text)}
              disabled={isLoading}
              className={css(styles.streetAddress1)}
              validators={[requiredValidator]}
              height={FieldHeight}
              value={streetAddress1}
              onValidityChanged={(isValid) => setIsValidStreetAddress1(isValid)}
              debugValue={faker.address.streetAddress()}
            />

            <TextInput
              placeholder={i`Street address 2`}
              onChange={({ text }) => setStreetAddress2(text)}
              disabled={isLoading}
              height={FieldHeight}
              value={streetAddress2}
              debugValue={faker.address.secondaryAddress()}
            />
          </Field>
          <div className={css(styles.sideBySide)}>
            <Field className={css(styles.field)} title={i`Country / Region`}>
              <CountrySelect
                className={css(styles.countrySelect)}
                onCountry={onCountry}
                disabled={isLoading}
                currentCountryCode={countryCode}
                countries={countryOptions()}
              />
            </Field>
            <StateField
              className={css(styles.field)}
              currentState={stateName}
              disabled={isLoading}
              height={FieldHeight}
              countryCode={countryCode}
              excludeStates={countryCode == "CN" ? ["TW", "HK", "MO"] : []}
              onState={(stateName) => setStateName(stateName)}
            />
          </div>
          <div className={css(styles.sideBySide)}>
            <Field className={css(styles.field)} title={i`City`}>
              <TextInput
                placeholder={i`Select a city`}
                onChange={({ text }) => setCity(text)}
                disabled={isLoading}
                value={city}
                height={FieldHeight}
                validators={[requiredValidator]}
                onValidityChanged={(isValid) => setIsValidCity(isValid)}
                debugValue={faker.address.city()}
              />
            </Field>
            <Field
              className={css(styles.field)}
              title={countryCode === "US" ? i`ZIP Code` : i`Postal Code`}
            >
              <TextInput
                placeholder={
                  countryCode === "US"
                    ? i`Enter your ZIP code`
                    : i`Enter your postal code`
                }
                onChange={({ text }) => setPostalCode(text)}
                disabled={isLoading}
                value={postalCode}
                height={FieldHeight}
                validators={zipcodeValidators()}
                onValidityChanged={(isValid) => setIsValidPostalCode(isValid)}
                debugValue={faker.address.zipCode().slice(0, 5)}
              />
            </Field>
          </div>
          <PhoneNumberField
            className={css(styles.field)}
            disabled={isLoading}
            country={phoneNumberCC || "US"}
            countryFixed={!isInterselectablePhoneCountry}
            countryOptions={
              isInterselectablePhoneCountry
                ? interselectablePhoneCountryCodes
                : undefined
            }
            phoneNumber={phoneNumber}
            height={FieldHeight}
            onPhoneNumber={onPhoneNumber}
            onValidityChanged={(isValid) => setIsValidPhoneNumber(isValid)}
            debugValue={faker.phone
              .phoneNumber()
              .replace(/\D/g, "")
              .slice(0, 10)}
          />

          <SignupTOSText buttonText={i`Enter my store`} />

          <div className={css(styles.buttonContainer)}>
            <div className={css(styles.buttonHeightFixer)}>
              <PrimaryButton
                onClick={onSubmitClicked}
                isDisabled={!readyToSubmit}
                isLoading={isLoading}
                popoverStyle={css(styles.primaryButtonsPopStyle)}
              >
                {isLoading ? i`Setting up your store` : i`Enter my store`}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
      {!isPreorderMerchant && (
        <div className={css(styles.footerRoot)}>
          <div className={css(styles.footerText)}>
            When your business expands, we may ask you for a few more details to
            verify your store.
          </div>
          <Illustration
            name="ladyHoldingPackage"
            alt={i`Default footer image`}
          />
        </div>
      )}
    </Card>
  );
};

export default observer(StoreSignupContactInfo);

const useStylesheet = () => {
  const { textDark, surfaceLight, borderPrimary, primaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0px 25px 25px 25px",
        },
        title: {
          fontSize: 24,
          fontWeight: weightBold,
          lineHeight: 1.33,
          color: textDark,
          alignSelf: "center",
          textAlign: "center",
          padding: "40px 0px",
          cursor: "default",
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          alignItems: "stretch",
        },
        field: {
          marginBottom: 25,
        },
        input: {
          height: FieldHeight,
        },
        streetAddress1: {
          marginBottom: 15,
        },
        countrySelect: {
          overflowX: "hidden",
        },
        sideBySide: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "row",
          flexWrap: "wrap",
          ":nth-child(1n) > div": {
            flexGrow: 1,
            flexBasis: 0,
            flexShrink: 1,
            minWidth: 200,
            ":not(:last-child)": {
              "@media (max-width: 640px)": {
                marginRight: 0,
                marginBottom: 10,
              },
              "@media (min-width: 640px)": {
                marginRight: 10,
                marginBottom: 0,
              },
            },
          },
        },
        buttonContainer: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        buttonHeightFixer: {
          height: FieldHeight,
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          ":nth-child(1n) > div": {
            flexGrow: 1,
            flexBasis: 0,
            flexShrink: 1,
          },
        },
        footerRoot: {
          backgroundColor: surfaceLight,
          borderTop: `2px ${borderPrimary} dotted`,
          padding: "18px 24px 22px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        footerText: {
          maxWidth: 320,
          fontSize: 14,
          lineHeight: 1.5,
          fontWeight: weightMedium,
          color: primaryDark,
          marginRight: 40,
        },
        primaryButtonsPopStyle: {
          display: "grid",
        },
      }),
    [textDark, surfaceLight, borderPrimary, primaryDark]
  );
};
