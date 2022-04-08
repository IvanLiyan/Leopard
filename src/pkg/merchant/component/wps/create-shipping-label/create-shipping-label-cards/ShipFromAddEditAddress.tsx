/*
 * ShipFromAddEditAddress.tsx
 *
 * Created by Jonah Dlin on Mon Feb 01 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import faker from "faker/locale/en";
import startCase from "lodash/startCase";
import lowerCase from "lodash/lowerCase";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import StateField from "@merchant/component/core/StateField";
import CountrySelect from "@merchant/component/core/CountrySelect";

/* Lego Components */
import {
  Alert,
  BackButton,
  CheckboxField,
  Field,
  Info,
  PrimaryButton,
  Text,
  TextInput,
  TextInputProps,
} from "@ContextLogic/lego";

/* Merchant Stores */
import { useToastStore } from "@stores/ToastStore";

/* Merchant Model */
import { useTheme } from "@stores/ThemeStore";
import { SubdivisionNames } from "@ContextLogic/lego/toolkit/states";

/* Merchant Toolkit */
import {
  CNZipcodeOnlyValidator,
  PhoneNumberValidator,
  RequiredValidator,
  USZipcodeOnlyValidator,
} from "@toolkit/validators";
import { CountryCode } from "@schema/types";
import { useMutation } from "@apollo/client";
import {
  AddEditWarehouseInputType,
  AddEditWarehouseResponseType,
  ADD_EDIT_WAREHOUSE,
  PickedOriginCountryType,
  WarehouseAddress,
} from "@toolkit/wps/create-shipping-label";

type Props = BaseProps & {
  readonly onBack: () => unknown;
  readonly onSubmit: (id: string) => unknown;
  readonly countryOptions: ReadonlyArray<PickedOriginCountryType>;
  readonly warehouse?: WarehouseAddress; // if edit, the warehouse to edit
};

const DEFAULT_COUNTRY_CODE: CountryCode = "US";

const ShipFromAddEditAddress: React.FC<Props> = ({
  className,
  style,
  onBack,
  onSubmit,
  warehouse,
  countryOptions,
}: Props) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const { negative, borderPrimary, borderPrimaryDark } = useTheme();

  const [warehouseName, setWarehouseName] = useState<string | undefined>(
    warehouse?.warehouseName
  );
  const [isWarehouseNameValid, setIsWarehouseNameValid] =
    useState<boolean>(false);

  const [personName, setPersonName] = useState<string | undefined>(
    warehouse?.address.name
  );
  const [isPersonNameValid, setIsPersonNameValid] = useState<boolean>(false);

  const [country, setCountry] = useState<CountryCode | undefined>(
    warehouse?.address.countryCode || DEFAULT_COUNTRY_CODE
  );
  const [hasSelectedCountry, setHasSelectedCountry] = useState<boolean>(false);

  const [phone, setPhone] = useState<string | null | undefined>(
    warehouse?.address.phoneNumber
  );
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(true);

  const [streetAddress1, setStreetAddress1] = useState<string | undefined>(
    warehouse?.address.streetAddress1
  );
  const [isStreetAddress1Valid, setIsStreetAddress1Valid] =
    useState<boolean>(false);

  const [streetAddress2, setStreetAddress2] = useState<
    string | null | undefined
  >(warehouse?.address.streetAddress2);

  const [city, setCity] = useState<string | undefined>(warehouse?.address.city);
  const [isCityValid, setIsCityValid] = useState<boolean>(false);

  const [state, setState] = useState<string | null | undefined>(
    warehouse?.address.state
  );
  const [hasSelectedState, setHasSelectedState] = useState<boolean>(false);

  const [zipcode, setZipcode] = useState<string | null | undefined>(
    warehouse?.address.zipcode
  );
  const [isZipcodeValid, setIsZipcodeValid] = useState<boolean>(false);

  const [isDefault, setIsDefault] = useState<boolean | undefined>(
    warehouse?.isDefault
  );

  const [forceValidation, setForceValidation] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState(false);

  const showDefaultAlert =
    (warehouse == null && isDefault) ||
    (warehouse != null && !warehouse.isDefault && isDefault);

  const isEdit = warehouse?.id != null;

  const showCountryError = useMemo(() => {
    return (forceValidation || hasSelectedCountry) && country == null;
  }, [country, hasSelectedCountry, forceValidation]);

  const showStateError = useMemo(() => {
    return (
      (forceValidation || hasSelectedState) &&
      (state == null || state.trim().length == 0)
    );
  }, [state, hasSelectedState, forceValidation]);

  const canSave = useMemo(
    () =>
      isStreetAddress1Valid &&
      isCityValid &&
      !showStateError &&
      !showCountryError &&
      isZipcodeValid &&
      isWarehouseNameValid &&
      isPersonNameValid &&
      state != null &&
      country != null &&
      isPhoneValid,
    [
      isStreetAddress1Valid,
      isCityValid,
      showStateError,
      showCountryError,
      isZipcodeValid,
      isWarehouseNameValid,
      isPersonNameValid,
      state,
      country,
      isPhoneValid,
    ]
  );

  const [submitAddress] = useMutation<
    AddEditWarehouseResponseType,
    AddEditWarehouseInputType
  >(ADD_EDIT_WAREHOUSE);

  const handleSubmit = async () => {
    if (
      !canSave ||
      streetAddress1 == null ||
      city == null ||
      state == null ||
      zipcode == null ||
      warehouseName == null ||
      personName == null ||
      country == null
    ) {
      setForceValidation(true);
      return;
    }

    setIsSaving(true);

    const input: AddEditWarehouseInputType["input"] = {
      merchantSenderAddressId: warehouse?.id,
      isDefault: isDefault || false,
      warehouseName,
      address: {
        name: personName,
        streetAddress1,
        streetAddress2,
        city,
        state,
        zipcode,
        phoneNumber: phone,
        countryCode: country,
      },
    };

    const { data } = await submitAddress({ variables: { input } });

    if (data == null) {
      toastStore.negative(i`Something went wrong`);
      setIsSaving(false);
      return;
    }
    const {
      currentMerchant: {
        merchantSenderAddress: {
          upsertMerchantSenderAddress: { ok, message, id },
        },
      },
    } = data;

    if (!ok || id == null) {
      toastStore.negative(message || i`Something went wrong`);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    toastStore.positive(
      isEdit
        ? i`Warehouse edited successfully.`
        : i`Warehouse added successfully.`
    );
    onSubmit(id);
  };

  const requiredValidator = new RequiredValidator();

  const zipcodeValidators = (): TextInputProps["validators"] => {
    if (country === "US") {
      return [requiredValidator, new USZipcodeOnlyValidator()];
    } else if (country === "CN") {
      return [requiredValidator, new CNZipcodeOnlyValidator()];
    }

    return [requiredValidator];
  };

  const renderFieldTitle = (title: string, optional?: boolean) => (
    <div className={css(styles.fieldTitle)}>
      <Text className={css(styles.fieldTitleText)} weight="semibold">
        {title}
      </Text>
      {!optional && <div className={css(styles.fieldTitleStar)}>*</div>}
    </div>
  );

  const subdivisionName =
    country != null && SubdivisionNames[country]
      ? SubdivisionNames[country]
      : i`State`;

  const preparedCountryOptions = countryOptions.map(({ name, code }) => ({
    name,
    cc: code,
  }));

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.fields)}>
        <Field
          className={css(styles.field)}
          title={() => renderFieldTitle(i`Warehouse name`)}
        >
          <TextInput
            placeholder={i`Warehouse name`}
            value={warehouseName}
            onChange={({ text }) => setWarehouseName(text)}
            debugValue={faker.company.companyName()}
            validators={[new RequiredValidator()]}
            onValidityChanged={(isValid) => setIsWarehouseNameValid(isValid)}
            forceValidation={forceValidation}
          />
        </Field>
        <Field
          className={css(styles.field)}
          title={() => renderFieldTitle(i`Your name`)}
        >
          <TextInput
            placeholder={i`Your name`}
            value={personName}
            onChange={({ text }) => setPersonName(text)}
            debugValue={faker.name.findName()}
            validators={[new RequiredValidator()]}
            onValidityChanged={(isValid) => setIsPersonNameValid(isValid)}
            forceValidation={forceValidation}
          />
        </Field>
        <Field
          className={css(styles.field)}
          title={() => renderFieldTitle(i`Ship-from country / region`)}
        >
          <CountrySelect
            countries={preparedCountryOptions}
            placeholder="--"
            currentCountryCode={country}
            onCountry={(newCountry) => {
              if (newCountry != null) {
                setCountry(newCountry);
              }
              if (!hasSelectedCountry) {
                setHasSelectedCountry(true);
              }
            }}
            borderColor={showCountryError ? negative : borderPrimaryDark}
          />
          {showCountryError && (
            <Text className={css(styles.errorText)} weight="semibold">
              This field is required
            </Text>
          )}
        </Field>
        <Field
          className={css(styles.field)}
          title={() => renderFieldTitle(i`Address`)}
        >
          <TextInput
            placeholder={i`Street address`}
            value={streetAddress1}
            onChange={({ text }) => setStreetAddress1(text)}
            debugValue={faker.address.streetAddress()}
            validators={[requiredValidator]}
            onValidityChanged={(isValid) => setIsStreetAddress1Valid(isValid)}
            forceValidation={forceValidation}
          />
          <TextInput
            className={css(styles.streetAddress2Input)}
            placeholder={i`Apt, suite.`}
            value={streetAddress2}
            onChange={({ text }) => setStreetAddress2(text)}
            debugValue={faker.address.secondaryAddress()}
          />
        </Field>
        <div className={css(styles.field, styles.smallFields)}>
          <Field title={() => renderFieldTitle(i`City`)}>
            <TextInput
              placeholder={i`City`}
              value={city}
              onChange={({ text }) => setCity(text)}
              debugValue={faker.address.city()}
              validators={[requiredValidator]}
              onValidityChanged={(isValid) => setIsCityValid(isValid)}
              forceValidation={forceValidation}
            />
          </Field>
          <Field
            title={() =>
              renderFieldTitle(country === "US" ? i`ZIP Code` : i`Postal Code`)
            }
          >
            <TextInput
              placeholder={country === "US" ? i`ZIP Code` : i`Postal Code`}
              value={zipcode}
              onChange={({ text }) => setZipcode(text)}
              debugValue={faker.address.zipCode().slice(0, 5)}
              validators={zipcodeValidators()}
              onValidityChanged={(isValid) => setIsZipcodeValid(isValid)}
              forceValidation={forceValidation}
            />
          </Field>
        </div>
        <StateField
          className={css(styles.field)}
          title={() => renderFieldTitle(subdivisionName)}
          countryCode={country}
          currentState={state}
          excludeStates={country == "CN" ? ["TW", "HK", "MO"] : []}
          onState={(state) => {
            // state is returned in all caps
            setState(startCase(lowerCase(state)));
            if (!hasSelectedState) {
              setHasSelectedState(true);
            }
          }}
          showErrorMessages={false}
          borderColor={showStateError ? negative : borderPrimary}
        >
          {showStateError && (
            <Text className={css(styles.errorText)} weight="semibold">
              This field is required
            </Text>
          )}
        </StateField>
        <Field
          className={css(styles.field)}
          title={() => renderFieldTitle(i`Phone`, true)}
        >
          <TextInput
            inputStyle={{
              boxShadow: "none",
            }}
            placeholder={i`Phone`}
            type="tel"
            value={phone}
            onChange={({ text }) => setPhone(text)}
            debugValue={"551-520-7578"}
            validators={[
              new PhoneNumberValidator({
                countryCode: country || "US",
                allowEmpty: true,
              }),
            ]}
            onValidityChanged={(isValid) => setIsPhoneValid(isValid)}
            forceValidation={forceValidation}
          />
        </Field>
      </div>
      <div className={css(styles.checkboxFieldContainer)}>
        <CheckboxField
          checked={isDefault}
          onChange={() => setIsDefault(!isDefault)}
        >
          Apply to all eligible products for Wish Parcel Services
        </CheckboxField>
        <Info
          className={css(styles.checkboxFieldInfo)}
          text={i`Set as default address for all products eligible for Wish Parcel`}
        />
      </div>
      {showDefaultAlert && (
        <Alert
          sentiment="warning"
          text={
            i`Selecting this option will overwrite any warehouse information ` +
            i`that you previously provided for creating Wish Parcel shipping ` +
            i`label`
          }
        />
      )}
      <div className={css(styles.footer)}>
        <BackButton
          onClick={onBack}
          style={styles.cancelButton}
          hideBorder
          disabled={isSaving}
        >
          Cancel
        </BackButton>
        <PrimaryButton
          onClick={handleSubmit}
          className={css(styles.saveButton)}
          isLoading={isSaving}
        >
          Save address
        </PrimaryButton>
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { textDark, negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        fields: {
          display: "flex",
          flexDirection: "column",
          marginBottom: 24,
        },
        fieldTitle: {
          display: "flex",
        },
        fieldTitleText: {
          fontSize: 14,
          lineHeight: "16px",
          color: textDark,
        },
        fieldTitleStar: {
          fontSize: 14,
          lineHeight: 1,
          marginLeft: 2,
          color: negative,
        },
        streetAddress2Input: {
          marginTop: 16,
        },
        field: {
          maxWidth: 360,
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        smallFields: {
          display: "grid",
          columnGap: "16px",
          gridTemplateColumns: "2.3fr 1fr",
        },
        errorText: {
          fontSize: 12,
          lineHeight: 1.33,
          color: negative,
          marginTop: 7,
          cursor: "default",
        },
        checkboxFieldContainer: {
          display: "flex",
          alignItems: "center",
          marginBottom: 8,
        },
        checkboxFieldInfo: {
          cursor: "pointer",
          marginLeft: 4,
        },
        footer: {
          marginTop: 16,
          display: "flex",
          justifyContent: "flex-end",
        },
        cancelButton: {
          marginRight: 16,
          padding: "7px 3px",
        },
        saveButton: {
          height: 36,
          boxSizing: "border-box",
        },
      }),
    [textDark, negative]
  );
};

export default observer(ShipFromAddEditAddress);
