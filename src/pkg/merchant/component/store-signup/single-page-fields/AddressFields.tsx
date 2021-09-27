import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { runInAction } from "mobx";

/* Lego Components */
import { Field, TextInput } from "@ContextLogic/lego";
import { PhoneNumberField } from "@merchant/component/core";
import { CountryCode } from "@toolkit/countries";

import { CountrySelect, StateField } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { RequiredValidator } from "@toolkit/validators";

/* Toolkit */
import StoreSignupSinglePageState from "@merchant/model/StoreSignupSinglePageState";
import { weightSemibold } from "@toolkit/fonts";

/* Merchant Stores */
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useTheme } from "@merchant/stores/ThemeStore";
import AutocompleteField from "./AutocompleteField";

type AddressFieldsProps = {
  readonly signupState: StoreSignupSinglePageState;
};

const AddressFields: React.FC<AddressFieldsProps> = (
  props: AddressFieldsProps
) => {
  const { signupState } = props;
  const styles = useStylesheet();

  const {
    countryOrRegion,
    phoneNumber,
    storeAddressLine1,
    storeAddressLine2,
    city,
    hasSelectedCountryOrRegion,
    stateOrProvince,
    hasSelectedStateOrProvince,
    zipOrPostalCode,
    isCountryOrRegionValid,
    countryOptions,
    zipcodeValidators,
    forceAddressValidation,
    forceValidation,
  } = signupState;

  const { isSmallScreen } = useDimenStore();

  const { borderPrimaryDark, negative } = useTheme();

  const hasCountryError = hasSelectedCountryOrRegion && !isCountryOrRegionValid;
  const hasStateError =
    hasSelectedStateOrProvince &&
    (stateOrProvince == null || stateOrProvince.trim().length == 0);

  return (
    <>
      <AutocompleteField
        className={css(styles.wideField)}
        signupState={signupState}
        inputText={storeAddressLine1}
        onTextChange={(text) => (signupState.storeAddressLine1 = text)}
        field="STREET_ADDRESS_LINE_1"
        title={i`Store Address Line 1`}
        debugValue={"100 Adelaide Street West"}
        validators={[new RequiredValidator()]}
        onValidityChanged={(isValid) =>
          (signupState.isStoreAddressLine1Valid = isValid)
        }
      />
      <Field className={css(styles.wideField)} title={i`Store Address Line 2`}>
        <TextInput
          placeholder={i`Optional`}
          value={storeAddressLine2}
          onChange={({ text }) => (signupState.storeAddressLine2 = text)}
          debugValue="suite 2800"
          borderColor={borderPrimaryDark}
        />
      </Field>
      <Field
        className={css(isSmallScreen ? styles.wideField : styles.leftField)}
        title={i`City`}
      >
        <TextInput
          value={city}
          onChange={({ text }) => (signupState.city = text)}
          validators={[new RequiredValidator()]}
          onValidityChanged={(isValid) => (signupState.isCityValid = isValid)}
          forceValidation={forceAddressValidation || forceValidation}
          debugValue="toronto"
          borderColor={borderPrimaryDark}
        />
      </Field>
      <Field
        className={css(isSmallScreen ? styles.wideField : styles.rightField)}
        title={i`Country / Region`}
      >
        <CountrySelect
          error={hasCountryError}
          countries={countryOptions}
          placeholder="--"
          currentCountryCode={countryOrRegion}
          onCountry={(country) => {
            runInAction(() => {
              signupState.countryOrRegion = country || null;
              if (!hasSelectedCountryOrRegion) {
                signupState.hasSelectedCountryOrRegion = true;
              }
            });
          }}
          borderColor={hasCountryError ? negative : borderPrimaryDark}
        />
        {hasCountryError && (
          <div className={css(styles.errorText)}>This field is required</div>
        )}
      </Field>
      <StateField
        className={css(isSmallScreen ? styles.wideField : styles.leftField)}
        countryCode={countryOrRegion}
        currentState={stateOrProvince}
        excludeStates={countryOrRegion == "CN" ? ["TW", "HK", "MO"] : []}
        onState={(state) => {
          signupState.stateOrProvince = state;
          if (!hasSelectedStateOrProvince) {
            signupState.hasSelectedStateOrProvince = true;
          }
        }}
        showErrorMessages={false}
        borderColor={hasStateError ? negative : borderPrimaryDark}
      >
        {hasStateError && (
          <div className={css(styles.errorText)}>This field is required</div>
        )}
      </StateField>
      <Field
        className={css(isSmallScreen ? styles.wideField : styles.rightField)}
        title={i`Zip / Postal Code`}
      >
        <TextInput
          value={zipOrPostalCode}
          onChange={({ text }) => (signupState.zipOrPostalCode = text)}
          validators={zipcodeValidators}
          onValidityChanged={(isValid) =>
            (signupState.isZipOrPostalCodeValid = isValid)
          }
          forceValidation={forceAddressValidation || forceValidation}
          debugValue="M5H 1S3"
          borderColor={borderPrimaryDark}
        />
      </Field>
      <PhoneNumberField
        className={css(styles.wideField)}
        country={countryOrRegion || phoneNumber?.country}
        countryFixed
        phoneNumber={phoneNumber?.phoneNumber}
        onPhoneNumber={(params: {
          country: CountryCode;
          areaCode: string;
          phoneNumber: string;
        }) => (signupState.phoneNumber = params)}
        validators={[new RequiredValidator()]}
        onValidityChanged={(isValid) =>
          (signupState.isPhoneNumberValid = isValid)
        }
        forceValidation={forceAddressValidation || forceValidation}
        debugValue="4165551234"
        borderColor={borderPrimaryDark}
      />
    </>
  );
};

const useStylesheet = () => {
  const { negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        wideField: {
          display: "flex",
          flexDirection: "column",
          gridColumn: "1 / 3",
        },
        leftField: {
          display: "flex",
          flexDirection: "column",
          column: 1,
        },
        rightField: {
          display: "flex",
          flexDirection: "column",
          column: 2,
        },
        errorText: {
          fontSize: 12,
          fontWeight: weightSemibold,
          lineHeight: 1.33,
          color: negative,
          marginTop: 7,
          cursor: "default",
        },
      }),
    [negative]
  );
};

export default observer(AddressFields);
