import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import faker from "faker/locale/en";

/* Lego Components */
import { Field, TextInput, HorizontalField, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { getCountryName } from "@toolkit/countries";
import {
  RequiredValidator,
  USZipcodeOnlyValidator,
  CNZipcodeOnlyValidator,
} from "@toolkit/validators";

/* Merchant API */
import { setData } from "@merchant/api/seller-profile-verification";

import { StateField } from "@merchant/component/core";

/* Relative Imports */
import ContinueButton from "./ContinueButton";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { useTheme } from "@merchant/stores/ThemeStore";
import { BusinessAddress } from "@merchant/api/authentication";
import LocalizationStore from "@merchant/stores/LocalizationStore";

type BusinessLocationProp = BaseProps & {
  readonly countryCodeDomicile: CountryCode | null | undefined;
  readonly isRefetchingData: boolean;
  readonly onNext: () => void;
};

const BusinessLocationPage = (props: BusinessLocationProp) => {
  const {
    countryCodeDomicile,
    isRefetchingData,
    onNext,
    style,
    className,
  } = props;
  const { userStore } = AppStore.instance();
  const { loggedInMerchantUser } = userStore;
  const { business_address: addressInMU } = loggedInMerchantUser;

  let defaultAddress: BusinessAddress | null = addressInMU;
  if (defaultAddress) {
    if (defaultAddress.country_code != countryCodeDomicile) {
      defaultAddress = null;
    } else if (
      defaultAddress.country_code == "US" ||
      defaultAddress.country_code == "CA"
    ) {
      const { locale } = LocalizationStore.instance();
      if (locale != "en") {
        defaultAddress = null;
      }
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentState, setCurrentState] = useState(defaultAddress?.state);
  const [currentCity, setCurrentCity] = useState(defaultAddress?.city);
  const [currentStreet1, setCurrentStreet1] = useState(
    defaultAddress?.street_address1
  );
  const [currentStreet2, setCurrentStreet2] = useState(
    defaultAddress?.street_address2
  );
  const [currentZipcode, setCurrentZipcode] = useState(defaultAddress?.zipcode);
  const [currentCityValid, setCurrentCityValid] = useState(currentCity != null);
  const [currentStreet1Valid, setCurrentStreet1Valid] = useState(
    currentStreet1 != null
  );
  const [currentZipcodeValid, setCurrentZipcodeValid] = useState(
    currentZipcode != null
  );

  const isLoading = () => {
    return isSubmitting || isRefetchingData;
  };

  const isValid = () => {
    return (
      currentCityValid &&
      currentStreet1Valid &&
      currentZipcodeValid &&
      currentState != null
    );
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      return;
    }

    let hasError = false;
    setIsSubmitting(true);
    try {
      await setData({
        page_name: "BusinessLocationPage",
        ba_state: currentState || "",
        ba_city: currentCity || "",
        ba_street1: currentStreet1 || "",
        ba_street2: currentStreet2 || "",
        ba_zipcode: currentZipcode || "",
      }).call();
      hasError = false;
    } catch (e) {
      hasError = true;
    } finally {
      setIsSubmitting(false);
    }

    if (!hasError) {
      onNext();
    }
  };

  const zipcodeValidators = useZipcodeValidators(countryCodeDomicile);
  const styles = useStylesheet();

  const tipText =
    i`Your business address should be within your country/region of domicile.` +
    i` If you are an unincorporated individual merchant,` +
    i` you may provide your residential address here.`;
  const tip = () => (
    <div className={css(styles.tip)}>
      <p>{tipText}</p>
    </div>
  );

  const renderStreet1 = () => {
    return (
      <TextInput
        className={css(countryCodeDomicile == "CN" ? styles.field : null)}
        placeholder={i`Street address`}
        onChange={({ text }) => setCurrentStreet1(text)}
        disabled={isLoading()}
        validators={[new RequiredValidator()]}
        value={currentStreet1}
        onValidityChanged={setCurrentStreet1Valid}
        debugValue={faker.address.streetAddress()}
      />
    );
  };

  const renderStreet2 = () => {
    return (
      <TextInput
        className={css(styles.field)}
        placeholder={i`Apartment, suite, etc. (optional)`}
        onChange={({ text }) => setCurrentStreet2(text)}
        disabled={isLoading()}
        value={currentStreet2}
        debugValue={faker.address.secondaryAddress()}
      />
    );
  };

  const renderCountry = () => {
    return (
      <Field title={i`Country/Region`}>
        <TextInput
          onChange={({ text }) => setCurrentZipcode(text)}
          disabled
          value={getCountryName(countryCodeDomicile)}
        />
      </Field>
    );
  };

  const renderState = () => {
    return (
      <StateField
        currentState={currentState}
        disabled={isLoading()}
        countryCode={countryCodeDomicile}
        excludeStates={countryCodeDomicile == "CN" ? ["TW", "HK", "MO"] : []}
        onState={setCurrentState}
      />
    );
  };

  const renderCity = () => {
    return (
      <Field title={i`City`}>
        <TextInput
          placeholder={i`Select a city`}
          onChange={({ text }) => setCurrentCity(text)}
          disabled={isLoading()}
          value={currentCity}
          validators={[new RequiredValidator()]}
          onValidityChanged={setCurrentCityValid}
          debugValue={faker.address.city()}
        />
      </Field>
    );
  };

  const renderZipcode = () => {
    return (
      <Field title={countryCodeDomicile === "US" ? i`Zipcode` : i`Postal code`}>
        <TextInput
          placeholder={i`Enter zipcode/postal code`}
          onChange={({ text }) => setCurrentZipcode(text)}
          disabled={isLoading()}
          value={currentZipcode}
          validators={zipcodeValidators}
          onValidityChanged={setCurrentZipcodeValid}
          debugValue={faker.address.zipCode().slice(0, 5)}
        />
      </Field>
    );
  };

  const renderGridForCN = () => {
    return (
      <div className={css(styles.grid)}>
        {renderCountry()}
        {renderState()}
        {renderCity()}
        {renderZipcode()}
      </div>
    );
  };

  const renderGridForNonCN = () => {
    return (
      <div className={css(styles.grid, styles.field)}>
        {renderCity()}
        {renderState()}
        {renderCountry()}
        {renderZipcode()}
      </div>
    );
  };

  const renderInputs = () => {
    if (countryCodeDomicile == "CN") {
      return (
        <div className={css(styles.inputs)}>
          {renderGridForCN()}
          {renderStreet1()}
          {renderStreet2()}
        </div>
      );
    }
    return (
      <div className={css(styles.inputs)}>
        {renderStreet1()}
        {renderStreet2()}
        {renderGridForNonCN()}
      </div>
    );
  };

  return (
    <div className={css(styles.root, style, className)}>
      <div className={css(styles.upper)}>
        <Text weight="bold" className={css(styles.title)}>
          Where is your business located?
        </Text>
        <div className={css(styles.subtitle)}>
          Provide your business address to further validate your store.
        </div>
        <HorizontalField
          className={css(styles.form)}
          title={() => (
            <div className={css(styles.formTitle)}>Business address</div>
          )}
          titleAlign="start"
          titleWidth={220}
          popoverContent={tip}
        >
          {renderInputs()}
        </HorizontalField>
      </div>
      <ContinueButton
        className={css(styles.button)}
        onClick={handleSubmit}
        isLoading={isSubmitting || isRefetchingData}
        text={i`Continue`}
        isDisabled={!isValid()}
      />
    </div>
  );
};

export default observer(BusinessLocationPage);

const useStylesheet = () => {
  const { textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
        },
        upper: {
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
        subtitle: {
          marginTop: 16,
          color: textDark,
          textAlign: "center",
        },
        form: {
          marginTop: 40,
          maxWidth: 800,
          width: "100%",
        },
        formTitle: {
          lineHeight: "40px",
        },
        field: {
          marginTop: 25,
        },
        inputs: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
        },
        grid: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr));",
          gridGap: 15,
        },
        tip: {
          padding: "10px 10px 0 10px",
          fontSize: 14,
          maxWidth: 300,
        },
        button: {
          marginTop: 40,
        },
      }),
    [textDark, textBlack]
  );
};

const useZipcodeValidators = (countryCode: string | null | undefined) => {
  return useMemo(() => {
    if (countryCode === "US") {
      return [new RequiredValidator(), new USZipcodeOnlyValidator()];
    } else if (countryCode === "CN") {
      return [new RequiredValidator(), new CNZipcodeOnlyValidator()];
    }

    return [new RequiredValidator()];
  }, [countryCode]);
};
